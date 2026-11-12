import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';

test('HTML-условия мигрируют в Markdown один раз, сохраняя задание и ответы', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'codetogether-prompt-migration-'));
  const databasePath = path.join(directory, 'prompts.sqlite');
  const runMigration = () => spawnSync(process.execPath, ['scripts/migrate-sqlite.mjs'], {
    cwd: process.cwd(), encoding: 'utf8', env: { ...process.env, DATABASE_PATH: databasePath },
  });
  try {
    const first = runMigration();
    assert.equal(first.status, 0, first.stderr || first.stdout);
    const database = new DatabaseSync(databasePath);
    try {
      database.prepare("INSERT INTO users(id,login,password,name,role,created_at) VALUES ('html-student','html-student','hash','HTML student','student','now')").run();
      database.prepare('INSERT INTO assignments(id,topic_id,student_id,lesson_id,title,kind,prompt) VALUES (?,?,?,?,?,?,?)')
        .run('html-assignment', null, 'html-student', null, 'HTML prompt', 'text', '<h2>Условие</h2><p>Вычисли <strong>2 + 2</strong><br>и выведи ответ.</p><img src="/api/assignment-images/image-1" alt="Схема">');
      database.prepare('INSERT INTO submissions(id,assignment_id,student_id,content,result,created_at) VALUES (?,?,?,?,?,?)')
        .run('html-submission', 'html-assignment', 'html-student', 'ответ', '{"status":"pending"}', 'now');
      database.prepare("DELETE FROM d1_migrations WHERE name='0018_normalize_assignment_html'").run();
    } finally { database.close(); }

    const migrated = runMigration();
    assert.equal(migrated.status, 0, migrated.stderr || migrated.stdout);
    const databaseAfter = new DatabaseSync(databasePath);
    let prompt;
    try {
      const assignment = databaseAfter.prepare('SELECT id,title,kind,prompt FROM assignments WHERE id=?').get('html-assignment');
      prompt = assignment.prompt;
      assert.equal(assignment.id, 'html-assignment');
      assert.equal(assignment.title, 'HTML prompt');
      assert.equal(assignment.kind, 'text');
      assert.match(prompt, /## Условие/);
      assert.match(prompt, /Вычисли \*\*2 \+ 2\*\*/);
      assert.match(prompt, /!\[Схема\]\(<\/api\/assignment-images\/image-1>\)/);
      assert.equal(databaseAfter.prepare("SELECT COUNT(*) AS count FROM submissions WHERE id='html-submission'").get().count, 1);
      assert.equal(databaseAfter.prepare("SELECT COUNT(*) AS count FROM d1_migrations WHERE name='0018_normalize_assignment_html'").get().count, 1);
    } finally { databaseAfter.close(); }

    const rerun = runMigration();
    assert.equal(rerun.status, 0, rerun.stderr || rerun.stdout);
    const finalDatabase = new DatabaseSync(databasePath);
    try { assert.equal(finalDatabase.prepare('SELECT prompt FROM assignments WHERE id=?').get('html-assignment').prompt, prompt); }
    finally { finalDatabase.close(); }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
