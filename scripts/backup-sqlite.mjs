import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { chmod, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { getR2Object, r2S3Config, validateAssignmentImage } from "../lib/assignment-images.ts";
import { readAssignmentImageFile } from "../lib/assignment-image-filesystem.ts";
import { withAssignmentImageStorageLock } from "../lib/assignment-image-lock.mjs";

const databasePath = path.resolve(process.env.DATABASE_PATH || ".data/codetogether.sqlite");
const backupDirectory = path.resolve(process.env.BACKUP_DIRECTORY || path.join(path.dirname(databasePath), "backups"));
const imageDirectory = process.env.ASSIGNMENT_IMAGE_DIRECTORY ? path.resolve(process.env.ASSIGNMENT_IMAGE_DIRECTORY) : null;
const tarCommand = process.env.ASSIGNMENT_IMAGE_TAR || "tar";
const timestamp = new Date();
const stamp = timestamp.toISOString().replace(/\D/g, "").slice(0, 17);
const snapshotId = `snapshot-${stamp}-${process.pid}`;
const stagingDirectory = path.join(backupDirectory, `.${snapshotId}.tmp`);
const snapshotDirectory = path.join(backupDirectory, snapshotId);
const latestPath = path.join(backupDirectory, "latest");
const latestTemporaryPath = path.join(backupDirectory, `.latest-${process.pid}`);
const imageKeyPattern = /^assignment-images\/[A-Za-z0-9_-]{1,100}\/[0-9a-f-]{36}\.(?:jpg|png|gif|webp)$/i;
const maximumImageBytes = 8 * 1024 * 1024;

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.setEncoding("utf8").on("data", chunk => { stderr = (stderr + chunk).slice(-4000); });
    child.once("error", reject);
    child.once("close", code => code === 0 ? resolve() : reject(new Error(stderr || `${command} exited with code ${code}`)));
  });
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

function assertImageBytes(row, bytes) {
  if (bytes.byteLength !== Number(row.size_bytes) || bytes.byteLength < 1 || bytes.byteLength > maximumImageBytes || !validateAssignmentImage(bytes, row.content_type)) {
    throw new Error(`Assignment image failed backup verification: ${row.id}`);
  }
}

function relativeImagePath(objectKey) {
  if (typeof objectKey !== "string" || !imageKeyPattern.test(objectKey)) throw new Error("Assignment image has an invalid object key.");
  return objectKey.slice("assignment-images/".length);
}

async function writeImage(imageRoot, row, bytes) {
  const relative = relativeImagePath(row.object_key);
  const target = path.resolve(imageRoot, relative);
  if (!target.startsWith(path.resolve(imageRoot) + path.sep)) throw new Error("Assignment image escaped the snapshot directory.");
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  await writeFile(target, bytes, { flag: "wx", mode: 0o600 });
}

function preflightImages() {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  try {
    const imageCount = database.prepare("SELECT COUNT(*) AS count FROM assignment_images").get()?.count || 0;
    if (Number(imageCount) > 0 && !imageDirectory) {
      throw new Error("Assignment images exist; set ASSIGNMENT_IMAGE_DIRECTORY so the database and image files can be backed up together.");
    }
    return Number(imageCount);
  } finally {
    database.close();
  }
}

async function createImageArchive(databaseSnapshot, imageArchive, imageInputDirectory) {
  const snapshot = new DatabaseSync(databaseSnapshot);
  let rows;
  try {
    rows = snapshot.prepare("SELECT id,object_key,content_type,size_bytes,storage_backend FROM assignment_images ORDER BY id").all();
  } finally {
    snapshot.close();
  }

  if (!imageDirectory && rows.length === 0) return null;
  const filesystemRows = rows.filter(row => row.storage_backend === "filesystem");
  const r2Rows = rows.filter(row => row.storage_backend === "r2");
  if (filesystemRows.length && !imageDirectory) throw new Error("Filesystem-backed assignment images have no configured directory.");
  await mkdir(imageInputDirectory, { recursive: true, mode: 0o700 });

  for (const row of filesystemRows) {
    const bytes = await readAssignmentImageFile(imageDirectory, row.object_key);
    if (!bytes) throw new Error(`Assignment image is missing from server storage: ${row.id}`);
    assertImageBytes(row, bytes);
    await writeImage(imageInputDirectory, row, bytes);
  }

  if (r2Rows.length) {
    const config = r2S3Config(process.env);
    if (!config) throw new Error("R2-backed assignment images exist, but backup R2 credentials are not configured.");
    if (!imageDirectory) throw new Error("R2-backed assignment images require ASSIGNMENT_IMAGE_DIRECTORY to coordinate snapshots and deletions.");
    for (const row of r2Rows) {
      const bytes = await getR2Object(row.object_key, config);
      assertImageBytes(row, bytes);
      await writeImage(imageInputDirectory, row, bytes);
    }

    const writableSnapshot = new DatabaseSync(databaseSnapshot);
    try {
      writableSnapshot.exec("BEGIN IMMEDIATE");
      writableSnapshot.prepare("UPDATE assignment_images SET storage_backend='filesystem' WHERE storage_backend='r2'").run();
      writableSnapshot.exec("COMMIT");
    } catch (error) {
      writableSnapshot.exec("ROLLBACK");
      throw error;
    } finally {
      writableSnapshot.close();
    }
  }

  await run(tarCommand, ["-czf", imageArchive, "-C", imageInputDirectory, "."]);
  await run(tarCommand, ["-tzf", imageArchive]);
  await chmod(imageArchive, 0o640);
  return { file: "assignment-images.tar.gz", sha256: await sha256(imageArchive), objectCount: rows.length, convertedFromR2: r2Rows.length };
}

async function createSnapshot() {
  const databaseSnapshot = path.join(stagingDirectory, "database.sqlite");
  const imageArchive = path.join(stagingDirectory, "assignment-images.tar.gz");
  const imageInputDirectory = path.join(stagingDirectory, ".assignment-images-input");
  const quotedSnapshot = databaseSnapshot.replaceAll("'", "''");
  const database = new DatabaseSync(databasePath);
  try {
    database.exec(`VACUUM INTO '${quotedSnapshot}'`);
  } finally {
    database.close();
  }

  const imageMetadata = await createImageArchive(databaseSnapshot, imageArchive, imageInputDirectory);
  await rm(imageInputDirectory, { recursive: true, force: true });

  const snapshot = new DatabaseSync(databaseSnapshot, { readOnly: true });
  try {
    const result = snapshot.prepare("PRAGMA integrity_check").get();
    if (result?.integrity_check !== "ok") throw new Error(`Snapshot integrity check failed: ${JSON.stringify(result)}`);
    const unbackedImages = snapshot.prepare("SELECT COUNT(*) AS count FROM assignment_images WHERE storage_backend!='filesystem'").get()?.count || 0;
    if (Number(unbackedImages) !== 0) throw new Error("Snapshot still contains images backed by external storage.");
  } finally {
    snapshot.close();
  }
  await chmod(databaseSnapshot, 0o640);

  const manifest = {
    formatVersion: 1,
    snapshotId,
    createdAt: timestamp.toISOString(),
    database: { file: "database.sqlite", sha256: await sha256(databaseSnapshot) },
    assignmentImages: imageMetadata,
  };
  await writeFile(path.join(stagingDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o640, flag: "wx" });
  await chmod(stagingDirectory, 0o750);
}

await mkdir(backupDirectory, { recursive: true, mode: 0o750 });
await rm(stagingDirectory, { recursive: true, force: true });
await mkdir(stagingDirectory, { mode: 0o700 });
try {
  preflightImages();
  if (imageDirectory) await withAssignmentImageStorageLock(imageDirectory, createSnapshot);
  else await createSnapshot();

  await rename(stagingDirectory, snapshotDirectory);
  await chmod(snapshotDirectory, 0o750);
  await writeFile(latestTemporaryPath, `${snapshotId}\n`, { mode: 0o640, flag: "wx" });
  await rename(latestTemporaryPath, latestPath);
  await chmod(latestPath, 0o640);

  const snapshots = (await (await import("node:fs/promises")).readdir(backupDirectory, { withFileTypes: true }))
    .filter(entry => entry.isDirectory() && /^snapshot-\d{17}-\d+$/.test(entry.name))
    .map(entry => entry.name)
    .sort()
    .reverse();
  await Promise.all(snapshots.slice(2).map(name => rm(path.join(backupDirectory, name), { recursive: true, force: true })));
  console.log(`Published consistent database and assignment image snapshot: ${snapshotDirectory}`);
} catch (error) {
  await rm(stagingDirectory, { recursive: true, force: true });
  await rm(latestTemporaryPath, { force: true });
  throw error;
}
