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
      const userColumns = database.prepare('PRAGMA table_info(users)').all();
      assert.ok(userColumns.some(column => column.name === 'price_per_lesson' && column.dflt_value === '1000'));
      const paymentColumns = database.prepare('PRAGMA table_info(payment_requests)').all();
      assert.ok(paymentColumns.some(column => column.name === 'amount_rub'));
      assert.ok(paymentColumns.some(column => column.name === 'credited_lessons'));
      assert.equal(database.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
      assert.throws(() => database.prepare('INSERT INTO typing_results VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run('id', 's', 'r', 'fr', 'exercise', 30, 90, 1000, 'now'));
      assert.throws(() => database.prepare('INSERT INTO typing_results VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run('id', 's', 'r', 'ru', 'exercise', 300, 90, 1000, 'now'));
      database.prepare("INSERT INTO users(id,login,password,name,role,created_at) VALUES ('student','student','hash','QA student','student','now')").run();
      database.prepare("INSERT INTO payment_requests(id,student_id,amount_rub,price_per_lesson,created_at) VALUES ('request','student',2500,1000,'now')").run();
      assert.equal(database.prepare('SELECT price_per_lesson FROM users WHERE id=?').get('student').price_per_lesson, 1000);
      assert.equal(database.prepare('SELECT status FROM payment_requests WHERE id=?').get('request').status, 'pending');
      assert.throws(() => database.prepare("INSERT INTO payment_requests(id,student_id,amount_rub,price_per_lesson,created_at) VALUES ('bad','missing',2500,1000,'now')").run(), /payment request student does not exist/);
      assert.throws(() => database.prepare("INSERT INTO payment_requests(id,student_id,amount_rub,price_per_lesson,created_at) VALUES ('invalid-amount','student',0,1000,'now')").run());
    } finally {
      database.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
