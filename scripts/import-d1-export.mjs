import { DatabaseSync } from "node:sqlite";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";

const source = process.env.D1_EXPORT;
if (!source) throw new Error("Set D1_EXPORT to a Cloudflare D1 SQL export.");
const databasePath = process.env.DATABASE_PATH || path.resolve(".data/codetogether.sqlite");
await mkdir(path.dirname(databasePath), { recursive: true, mode: 0o700 });
const database = new DatabaseSync(databasePath);
try {
  const existing = database.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
  if (existing) throw new Error("Target already contains an application schema; refusing to overwrite it.");
  database.exec(await readFile(source, "utf8"));
  const integrity = database.prepare("PRAGMA integrity_check").get();
  if (integrity?.integrity_check !== "ok") throw new Error(`SQLite integrity check failed: ${JSON.stringify(integrity)}`);
  const counts = database.prepare("SELECT (SELECT COUNT(*) FROM users) AS users, (SELECT COUNT(*) FROM lessons) AS lessons").get();
  console.log(`Imported database is valid: ${JSON.stringify(counts)}`);
} finally {
  database.close();
}
