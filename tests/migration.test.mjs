import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';

test('миграции создают таблицу результатов печати и проверяют диапазоны', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'codetogether-migration-'));
  const databasePath = path.join(directory, 'test.sqlite');
  try {
    const result = spawnSync(process.execPath, ['scripts/migrate-sqlite.mjs'], {
      cwd: process.cwd(), encoding: 'utf8', env: { ...process.env, DATABASE_PATH: databasePath },
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const database = new DatabaseSync(databasePath);
    try {
      const columns = database.prepare('PRAGMA table_info(typing_results)').all();
      assert.deepEqual(columns.map(column => column.name), ['id', 'student_id', 'room_id', 'language', 'exercise_id', 'wpm', 'accuracy', 'duration_ms', 'created_at']);
      assert.equal(database.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
      assert.throws(() => database.prepare('INSERT INTO typing_results VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run('id', 's', 'r', 'fr', 'exercise', 30, 90, 1000, 'now'));
      assert.throws(() => database.prepare('INSERT INTO typing_results VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run('id', 's', 'r', 'ru', 'exercise', 300, 90, 1000, 'now'));
    } finally {
      database.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
