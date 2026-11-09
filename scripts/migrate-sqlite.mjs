import { DatabaseSync } from "node:sqlite";
import { readdirSync, mkdirSync } from "node:fs";
import path from "node:path";

const databasePath = process.env.DATABASE_PATH || path.resolve(".data/codetogether.sqlite");
mkdirSync(path.dirname(databasePath), { recursive: true, mode: 0o700 });
const database = new DatabaseSync(databasePath);
database.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;");
database.exec("CREATE TABLE IF NOT EXISTS d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");

const directory = path.resolve("drizzle");
const migrations = readdirSync(directory).filter((name) => /^\d+_.*\.sql$/.test(name)).sort();
for (const name of migrations) {
  const existing = database.prepare("SELECT 1 AS applied FROM d1_migrations WHERE name=?").get(name);
  if (existing) continue;
  const source = await (await import("node:fs/promises")).readFile(path.join(directory, name), "utf8");
  database.exec("BEGIN IMMEDIATE");
  try {
    database.exec(source);
    database.prepare("INSERT INTO d1_migrations (name) VALUES (?)").run(name);
    database.exec("COMMIT");
    console.log(`Applied ${name}`);
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

const integrity = database.prepare("PRAGMA integrity_check").get();
if (integrity?.integrity_check !== "ok") throw new Error(`SQLite integrity check failed: ${JSON.stringify(integrity)}`);
console.log(`SQLite schema is current: ${databasePath}`);
database.close();
