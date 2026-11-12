import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const [snapshotDirectory, expectedSnapshotId] = process.argv.slice(2);
if (!snapshotDirectory || !/^snapshot-\d{17}-\d+$/.test(expectedSnapshotId || "")) throw new Error("Pass a snapshot directory and snapshot ID.");
const root = path.resolve(snapshotDirectory);
const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
assert.equal(manifest.formatVersion, 1);
assert.equal(manifest.snapshotId, expectedSnapshotId);
assert.equal(manifest.database?.file, "database.sqlite", "Manifest contains an unexpected database path.");
assert.match(manifest.database?.sha256 || "", /^[a-f0-9]{64}$/i, "Manifest database checksum is invalid.");

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

const databasePath = path.join(root, manifest.database.file);
assert.equal(await sha256(databasePath), manifest.database.sha256, "Database checksum does not match manifest.");
const database = new DatabaseSync(databasePath, { readOnly: true });
let imageRows;
try {
  assert.equal(database.prepare("PRAGMA integrity_check").get()?.integrity_check, "ok", "SQLite snapshot is corrupt.");
  imageRows = database.prepare("SELECT object_key,storage_backend FROM assignment_images ORDER BY object_key").all();
  assert.ok(imageRows.every(row => row.storage_backend === "filesystem"), "Snapshot database still depends on external image storage.");
} finally {
  database.close();
}

if (imageRows.length > 0) assert.ok(manifest.assignmentImages, "Image metadata has no archive.");
if (manifest.assignmentImages) {
  assert.equal(manifest.assignmentImages.file, "assignment-images.tar.gz", "Manifest contains an unexpected image archive path.");
  assert.match(manifest.assignmentImages.sha256 || "", /^[a-f0-9]{64}$/i, "Manifest image archive checksum is invalid.");
  assert.equal(manifest.assignmentImages.objectCount, imageRows.length, "Manifest image count does not match database metadata.");
  const archivePath = path.join(root, manifest.assignmentImages.file);
  assert.equal(await sha256(archivePath), manifest.assignmentImages.sha256, "Assignment image archive checksum does not match manifest.");
  const archiveEntries = await new Promise((resolve, reject) => {
    const child = spawn(process.env.ASSIGNMENT_IMAGE_TAR || "tar", ["-tzf", archivePath], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    child.stdout.setEncoding("utf8").on("data", chunk => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", chunk => { stderr += chunk; });
    child.once("error", reject);
    child.once("close", code => code === 0 ? resolve(stdout.split("\n").map(entry => entry.replace(/^\.\//, "").replace(/\/$/, ""))) : reject(new Error(stderr || "Assignment image archive is corrupt.")));
  });
  const archivedFiles = new Set(archiveEntries);
  for (const row of imageRows) {
    assert.match(row.object_key, /^assignment-images\/[A-Za-z0-9_-]{1,100}\/[0-9a-f-]{36}\.(?:jpg|png|gif|webp)$/i);
    assert.ok(archivedFiles.has(row.object_key.slice("assignment-images/".length)), `Snapshot archive is missing ${row.object_key}.`);
  }
}
console.log(`Verified database and image snapshot ${expectedSnapshotId}.`);
