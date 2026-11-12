import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { withAssignmentImageStorageLock } from "../lib/assignment-image-lock.mjs";
import { deleteAssignmentImageObject, putAssignmentImageObject } from "../lib/assignment-images.ts";

const temporary = await mkdtemp(path.join(os.tmpdir(), "codetogether-backup-snapshot-"));
const databasePath = path.join(temporary, "codetogether.sqlite");
const imageDirectory = path.join(temporary, "assignment-images");
const backupDirectory = path.join(temporary, "backups");
const backupScript = process.env.TEST_BACKUP_SCRIPT || "scripts/backup-sqlite.mjs";
const imageId = "66666666-6666-4666-8666-666666666666";
const assignmentId = "backup-fixture";
const imageKey = `assignment-images/${assignmentId}/${imageId}.png`;
const imageBytes = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x01]);
const baseEnvironment = { ...process.env, DATABASE_PATH: databasePath, ASSIGNMENT_IMAGE_DIRECTORY: imageDirectory, BACKUP_DIRECTORY: backupDirectory };
const r2Config = { R2_ACCOUNT_ID: "0123456789abcdef0123456789abcdef", R2_ACCESS_KEY_ID: "backup-access-key", R2_SECRET_ACCESS_KEY: "backup-secret-key", R2_BUCKET_NAME: "legacy-image-bucket" };
const r2ImageId = "77777777-7777-4777-8777-777777777777";
const r2AssignmentId = "backup-r2-fixture";
const r2ImageKey = `assignment-images/${r2AssignmentId}/${r2ImageId}.png`;

function runNode(script, environment = baseEnvironment, extraNodeArguments = []) {
  const stripTypes = script.endsWith("backup-sqlite.mjs") ? ["--experimental-strip-types"] : [];
  return spawnSync(process.execPath, [...stripTypes, ...extraNodeArguments, script], { cwd: process.cwd(), encoding: "utf8", env: environment });
}

try {
  const migration = runNode("scripts/migrate-sqlite.mjs");
  assert.equal(migration.status, 0, migration.stderr || migration.stdout);
  const database = new DatabaseSync(databasePath);
  try {
    database.prepare("INSERT INTO users(id,login,password,name,role,created_at) VALUES ('backup-student','backup-student','hash','Backup student','student',?)").run(new Date().toISOString());
    database.prepare("INSERT INTO assignments(id,student_id,title,kind,prompt,created_at) VALUES (?,?,?,?,?,?)").run(assignmentId, "backup-student", "Backup fixture", "text", "See the image", new Date().toISOString());
    await mkdir(imageDirectory, { recursive: true, mode: 0o700 });
    await putAssignmentImageObject(imageKey, imageBytes, "image/png", "filesystem", { ASSIGNMENT_IMAGE_DIRECTORY: imageDirectory });
    database.prepare("INSERT INTO assignment_images(id,assignment_id,object_key,content_type,size_bytes,original_name,created_at,storage_backend) VALUES (?,?,?,?,?,?,?,?)")
      .run(imageId, assignmentId, imageKey, "image/png", imageBytes.byteLength, "fixture.png", new Date().toISOString(), "filesystem");
  } finally {
    database.close();
  }

  const backup = runNode(backupScript);
  assert.equal(backup.status, 0, backup.stderr || backup.stdout);
  const snapshotId = (await readFile(path.join(backupDirectory, "latest"), "utf8")).trim();
  assert.match(snapshotId, /^snapshot-\d{17}-\d+$/);
  const snapshotDirectory = path.join(backupDirectory, snapshotId);
  const verifySnapshot = spawnSync(process.execPath, ["scripts/verify-backup-snapshot.mjs", snapshotDirectory, snapshotId], { cwd: process.cwd(), encoding: "utf8", env: baseEnvironment });
  assert.equal(verifySnapshot.status, 0, verifySnapshot.stderr || verifySnapshot.stdout);
  const restoredImages = path.join(temporary, "restored-images");
  await mkdir(restoredImages, { recursive: true });
  const unpack = spawnSync(process.env.ASSIGNMENT_IMAGE_TAR || "tar", ["-xzf", path.join(snapshotDirectory, "assignment-images.tar.gz"), "-C", restoredImages], { encoding: "utf8" });
  assert.equal(unpack.status, 0, unpack.stderr || "Could not unpack image snapshot.");
  assert.deepEqual(new Uint8Array(await readFile(path.join(restoredImages, assignmentId, `${imageId}.png`))), imageBytes);

  const r2Mock = path.join(temporary, "r2-fetch-mock.mjs");
  await writeFile(r2Mock, `globalThis.fetch = async () => new Response(Uint8Array.from([${[...imageBytes].join(",")}]), { status: 200 });\n`);
  const databaseWithR2Image = new DatabaseSync(databasePath);
  try {
    databaseWithR2Image.prepare("INSERT INTO assignments(id,student_id,title,kind,prompt,created_at) VALUES (?,?,?,?,?,?)")
      .run(r2AssignmentId, "backup-student", "Legacy R2 image", "text", "Image", new Date().toISOString());
    databaseWithR2Image.prepare("INSERT INTO assignment_images(id,assignment_id,object_key,content_type,size_bytes,original_name,created_at,storage_backend) VALUES (?,?,?,?,?,?,?,'r2')")
      .run(r2ImageId, r2AssignmentId, r2ImageKey, "image/png", imageBytes.byteLength, "legacy.png", new Date().toISOString());
  } finally {
    databaseWithR2Image.close();
  }
  const r2Environment = { ...baseEnvironment, ...r2Config };
  const backupWithR2 = runNode(backupScript, r2Environment, ["--import", r2Mock]);
  assert.equal(backupWithR2.status, 0, backupWithR2.stderr || backupWithR2.stdout);
  const snapshotWithR2Id = (await readFile(path.join(backupDirectory, "latest"), "utf8")).trim();
  assert.notEqual(snapshotWithR2Id, snapshotId);
  const snapshotWithR2 = path.join(backupDirectory, snapshotWithR2Id);
  const verifyWithR2 = spawnSync(process.execPath, ["scripts/verify-backup-snapshot.mjs", snapshotWithR2, snapshotWithR2Id], { cwd: process.cwd(), encoding: "utf8", env: r2Environment });
  assert.equal(verifyWithR2.status, 0, verifyWithR2.stderr || verifyWithR2.stdout);
  const migratedDatabase = new DatabaseSync(path.join(snapshotWithR2, "database.sqlite"), { readOnly: true });
  try {
    assert.equal(migratedDatabase.prepare("SELECT storage_backend FROM assignment_images WHERE id=?").get(r2ImageId).storage_backend, "filesystem");
  } finally {
    migratedDatabase.close();
  }
  const restoredWithR2Images = path.join(temporary, "restored-images-with-r2");
  await mkdir(restoredWithR2Images, { recursive: true });
  const unpackR2 = spawnSync(process.env.ASSIGNMENT_IMAGE_TAR || "tar", ["-xzf", path.join(snapshotWithR2, "assignment-images.tar.gz"), "-C", restoredWithR2Images], { encoding: "utf8" });
  assert.equal(unpackR2.status, 0, unpackR2.stderr || "Could not unpack migrated R2 image snapshot.");
  assert.deepEqual(new Uint8Array(await readFile(path.join(restoredWithR2Images, r2AssignmentId, `${r2ImageId}.png`))), imageBytes);
  const r2Manifest = JSON.parse(await readFile(path.join(snapshotWithR2, "manifest.json"), "utf8"));
  assert.equal(r2Manifest.assignmentImages.objectCount, 2);
  assert.equal(r2Manifest.assignmentImages.convertedFromR2, 1);

  let signalLockAcquired;
  const heldLock = new Promise(resolve => { signalLockAcquired = resolve; });
  let releaseLock;
  const lockOwner = withAssignmentImageStorageLock(imageDirectory, async () => {
    signalLockAcquired();
    await new Promise(resolve => { releaseLock = resolve; });
  });
  await heldLock;
  const deleting = deleteAssignmentImageObject(imageKey, "filesystem", { ASSIGNMENT_IMAGE_DIRECTORY: imageDirectory });
  await new Promise(resolve => setTimeout(resolve, 50));
  assert.deepEqual(new Uint8Array(await readFile(path.join(imageDirectory, assignmentId, `${imageId}.png`))), imageBytes, "Deletion must wait while a backup snapshot holds the storage lock.");
  releaseLock();
  await Promise.all([lockOwner, deleting]);
  const removeFilesystemMetadata = new DatabaseSync(databasePath);
  try {
    removeFilesystemMetadata.prepare("DELETE FROM assignment_images WHERE id=?").run(imageId);
    removeFilesystemMetadata.prepare("UPDATE assignments SET prompt='Image removed' WHERE id=?").run(assignmentId);
  } finally {
    removeFilesystemMetadata.close();
  }

  let r2DeleteCalls = 0;
  const heldR2LockReady = new Promise(resolve => { signalLockAcquired = resolve; });
  const heldR2Lock = withAssignmentImageStorageLock(imageDirectory, async () => new Promise(resolve => { releaseLock = resolve; signalLockAcquired(); }));
  await heldR2LockReady;
  const deletingR2 = deleteAssignmentImageObject(r2ImageKey, "r2", r2Environment, async () => {
    r2DeleteCalls++;
    return new Response(null, { status: 204 });
  });
  await new Promise(resolve => setTimeout(resolve, 50));
  assert.equal(r2DeleteCalls, 0, "R2 deletion must wait while a backup snapshot holds the storage lock.");
  releaseLock();
  await Promise.all([heldR2Lock, deletingR2]);
  assert.equal(r2DeleteCalls, 1);

  const missingCredentialsBackup = runNode(backupScript, { ...baseEnvironment, R2_ACCOUNT_ID: "", R2_ACCESS_KEY_ID: "", R2_SECRET_ACCESS_KEY: "", R2_BUCKET_NAME: "" });
  assert.notEqual(missingCredentialsBackup.status, 0, "A backup with R2 rows must fail if it cannot archive the objects.");
  assert.match(missingCredentialsBackup.stderr, /R2-backed assignment images exist/);
  assert.equal((await readFile(path.join(backupDirectory, "latest"), "utf8")).trim(), snapshotWithR2Id);

  const failedBackup = runNode(backupScript, { ...r2Environment, ASSIGNMENT_IMAGE_TAR: path.join(temporary, "missing-tar-command") }, ["--import", r2Mock]);
  assert.notEqual(failedBackup.status, 0, "A failed image archive must fail the whole backup.");
  assert.equal((await readFile(path.join(backupDirectory, "latest"), "utf8")).trim(), snapshotWithR2Id, "A failed backup must leave the previous complete snapshot selected.");
  const snapshots = (await readdir(backupDirectory, { withFileTypes: true })).filter(entry => entry.isDirectory() && entry.name.startsWith("snapshot-"));
  assert.equal(snapshots.length, 2, "A partial backup must not be published as a snapshot.");
  console.log("Consistent DB/image snapshots, storage locking, and atomic failure behavior passed.");
} finally {
  await rm(temporary, { recursive: true, force: true });
}
