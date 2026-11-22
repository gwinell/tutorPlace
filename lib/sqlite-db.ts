import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";

type QueryResult<T = Record<string, unknown>> = { results: T[] };
type RunResult = { success: true; meta: { changes: number; last_row_id: number } };
type SqlStatement = {
  bind(...values: unknown[]): SqlStatement;
  all<T = Record<string, unknown>>(): Promise<QueryResult<T>>;
  first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>;
  run(): Promise<RunResult>;
  execute(): RunResult;
};

function sqliteValue(value: unknown): SQLInputValue {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") return value;
  if (value instanceof Uint8Array) return value;
  throw new TypeError(`Unsupported SQLite bind value: ${typeof value}`);
}

class BoundStatement implements SqlStatement {
  private values: SQLInputValue[] = [];

  constructor(private readonly statement: ReturnType<DatabaseSync["prepare"]>) {}

  bind(...values: unknown[]) {
    this.values = values.map(sqliteValue);
    return this;
  }

  async all<T = Record<string, unknown>>() {
    return { results: this.statement.all(...this.values) as T[] };
  }

  async first<T = Record<string, unknown>>(columnName?: string) {
    const row = this.statement.get(...this.values) as Record<string, unknown> | undefined;
    if (!row) return null;
    return (columnName ? row[columnName] : row) as T;
  }

  async run(): Promise<RunResult> {
    const result = this.statement.run(...this.values);
    return {
      success: true,
      meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) },
    };
  }

  execute(): RunResult {
    const result = this.statement.run(...this.values);
    return {
      success: true,
      meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) },
    };
  }
}

export class SqliteDatabase {
  private readonly connection: DatabaseSync;

  constructor(databasePath = process.env.DATABASE_PATH || path.resolve(".data/tutorplace.sqlite")) {
    mkdirSync(path.dirname(databasePath), { recursive: true, mode: 0o700 });
    this.connection = new DatabaseSync(databasePath);
    this.connection.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;");
  }

  prepare(sql: string): SqlStatement {
    return new BoundStatement(this.connection.prepare(sql));
  }

  async batch(statements: SqlStatement[]) {
    this.connection.exec("BEGIN IMMEDIATE");
    try {
      const results = statements.map((statement) => statement.execute());
      this.connection.exec("COMMIT");
      return results;
    } catch (error) {
      this.connection.exec("ROLLBACK");
      throw error;
    }
  }

}

let database: SqliteDatabase | undefined;

export function getSqliteDatabase() {
  database ??= new SqliteDatabase();
  return database;
}
