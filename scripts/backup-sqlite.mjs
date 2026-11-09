import { DatabaseSync } from "node:sqlite";
import { chmod, mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const databasePath = process.env.DATABASE_PATH || path.resolve(".data/codetogether.sqlite");
const backupDirectory = process.env.BACKUP_DIRECTORY || path.join(path.dirname(databasePath), "backups");
const target = path.join(backupDirectory, "latest.sqlite");
const temporary = path.join(backupDirectory, `.latest-${process.pid}.sqlite`);
await mkdir(backupDirectory, { recursive: true, mode: 0o700 });
await rm(temporary, { force: true });

const database = new DatabaseSync(databasePath);
try {
  database.exec(`VACUUM INTO '${temporary.replaceAll("'", "''")}'`);
} finally {
  database.close();
}

const snapshot = new DatabaseSync(temporary, { readOnly: true });
try {
  const result = snapshot.prepare("PRAGMA integrity_check").get();
  if (result?.integrity_check !== "ok") throw new Error(`Snapshot integrity check failed: ${JSON.stringify(result)}`);
} catch (error) {
  await rm(temporary, { force: true });
  throw error;
} finally {
  snapshot.close();
}

await rename(temporary, target);
await chmod(target, 0o640);
console.log(`Verified daily snapshot: ${target}`);
