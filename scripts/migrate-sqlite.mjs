import { DatabaseSync } from "node:sqlite";
import { readdirSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { normalizeAssignmentPrompt } from "../lib/assignment-prompt-format.mjs";

const databasePath = process.env.DATABASE_PATH || path.resolve(".data/tutorplace.sqlite");
mkdirSync(path.dirname(databasePath), { recursive: true, mode: 0o700 });
const database = new DatabaseSync(databasePath);
database.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;");
database.exec("CREATE TABLE IF NOT EXISTS d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");

function rollbackIfActive() {
  if (typeof database.isTransaction === "boolean" && !database.isTransaction) return;
  try {
    database.exec("ROLLBACK");
  } catch {
    // Preserve the migration error; rollback can fail after SQLite already ended the transaction.
  }
}

function sqliteDiagnostics() {
  const readPragma = (sql) => {
    try {
      const row = database.prepare(sql).get();
      return row ? String(Object.values(row)[0]) : "unavailable";
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return `error:${message.replace(/\s+/g, " ").slice(0, 120)}`;
    }
  };
  const fileMetadata = (file) => {
    try {
      const metadata = statSync(file);
      return `${path.basename(file)}=${metadata.size}B/mode-${metadata.mode.toString(8).slice(-3)}`;
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "unavailable";
      return `${path.basename(file)}=${code}`;
    }
  };

  return [
    `quick_check=${readPragma("PRAGMA quick_check(1)")}`,
    `page_count=${readPragma("PRAGMA page_count")}`,
    `freelist_count=${readPragma("PRAGMA freelist_count")}`,
    `journal_mode=${readPragma("PRAGMA journal_mode")}`,
    `assignments=${readPragma("SELECT COUNT(*) FROM assignments")}`,
    `assignment_triggers=${readPragma("SELECT group_concat(name, ',') FROM sqlite_schema WHERE type='trigger' AND tbl_name='assignments'")}`,
    fileMetadata(databasePath),
    fileMetadata(`${databasePath}-wal`),
    fileMetadata(`${databasePath}-shm`),
  ].join(" ");
}

function sqliteErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (!error || typeof error !== "object") return message;
  const details = [];
  if ("errcode" in error) details.push(`errcode=${String(error.errcode)}`);
  if ("errstr" in error) details.push(`errstr=${String(error.errstr).replace(/\s+/g, " ").slice(0, 80)}`);
  return details.length ? `${message} (SQLite ${details.join(" ")})` : message;
}

const directory = path.resolve("drizzle");
const migrations = readdirSync(directory).filter((name) => /^\d+_.*\.sql$/.test(name)).sort();
for (const name of migrations) {
  const existing = database.prepare("SELECT 1 AS applied FROM d1_migrations WHERE name=?").get(name);
  if (existing) continue;
  const source = await (await import("node:fs/promises")).readFile(path.join(directory, name), "utf8");
  const statements = source.split(/--> statement-breakpoint/g).map((statement) => statement.trim()).filter(Boolean);
  let step = "begin transaction";
  try {
    database.exec("BEGIN IMMEDIATE");
    for (let index = 0; index < statements.length; index += 1) {
      step = `SQL chunk ${index + 1}/${statements.length}`;
      database.exec(statements[index]);
    }
    step = "record migration";
    database.prepare("INSERT INTO d1_migrations (name) VALUES (?)").run(name);
    step = "commit transaction";
    database.exec("COMMIT");
    console.log(`Applied ${name}`);
  } catch (error) {
    rollbackIfActive();
    const message = sqliteErrorMessage(error);
    throw new Error(`Failed to apply SQLite migration ${name} at ${step}: ${message}; SQLite status: ${sqliteDiagnostics()}`, { cause: error });
  }
}

const promptMigration = "0018_normalize_assignment_html";
if (!database.prepare("SELECT 1 AS applied FROM d1_migrations WHERE name=?").get(promptMigration)) {
  database.exec("BEGIN IMMEDIATE");
  try {
    const assignments = database.prepare("SELECT id,prompt FROM assignments").all();
    const update = database.prepare("UPDATE assignments SET prompt=? WHERE id=? AND prompt=?");
    let changed = 0;
    for (const assignment of assignments) {
      const prompt = String(assignment.prompt || "");
      const normalized = normalizeAssignmentPrompt(prompt);
      if (normalized !== prompt) changed += update.run(normalized, assignment.id, assignment.prompt).changes;
    }
    database.prepare("INSERT INTO d1_migrations (name) VALUES (?)").run(promptMigration);
    database.exec("COMMIT");
    console.log(`Applied ${promptMigration}: normalized ${changed} assignment prompts`);
  } catch (error) {
    rollbackIfActive();
    const message = sqliteErrorMessage(error);
    throw new Error(`Failed to apply SQLite migration ${promptMigration}: ${message}; SQLite status: ${sqliteDiagnostics()}`, { cause: error });
  }
}

const integrity = database.prepare("PRAGMA integrity_check").get();
if (integrity?.integrity_check !== "ok") throw new Error(`SQLite integrity check failed: ${JSON.stringify(integrity)}`);
console.log(`SQLite schema is current: ${databasePath}`);
database.close();
