import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';

const pythonCourseManifest = JSON.parse(readFileSync(new URL('../course-data/python/CODETOGETHER_COURSE.json', import.meta.url), 'utf8'));
const pythonAssignments = JSON.parse(readFileSync(new URL('../course-data/python/CODETOGETHER_ASSIGNMENTS.json', import.meta.url), 'utf8'));

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
      const topicColumns = database.prepare('PRAGMA table_info(topics)').all();
      assert.ok(topicColumns.some(column => column.name === 'parent_topic_id'));
      assert.ok(topicColumns.some(column => column.name === 'github_url'));
      const preparationColumns = database.prepare('PRAGMA table_info(lesson_preparation_items)').all();
      assert.deepEqual(preparationColumns.map(column => column.name), ['id', 'lesson_id', 'kind', 'topic_id', 'assignment_id', 'position', 'completed_at']);
      const imageColumns = database.prepare('PRAGMA table_info(assignment_images)').all();
      assert.deepEqual(imageColumns.map(column => column.name), ['id', 'assignment_id', 'object_key', 'content_type', 'size_bytes', 'original_name', 'created_at', 'storage_backend']);
      assert.ok(imageColumns.some(column => column.name === 'storage_backend' && column.dflt_value === "'r2'"));
      const assignmentColumns = database.prepare('PRAGMA table_info(assignments)').all();
      assert.ok(assignmentColumns.some(column => column.name === 'created_at'));
      assert.ok(assignmentColumns.some(column => column.name === 'completed_at'));
      const notificationColumns = database.prepare('PRAGMA table_info(notifications)').all();
      assert.ok(notificationColumns.some(column => column.name === 'type' && column.dflt_value === "'general'"));
      assert.ok(notificationColumns.some(column => column.name === 'popup' && column.dflt_value === '0'));
      assert.ok(notificationColumns.some(column => column.name === 'popup_dismissed_at'));
      database.prepare("INSERT INTO assignment_images(id,assignment_id,object_key,content_type,size_bytes,original_name,created_at) VALUES ('image','assignment','assignment-images/assignment/image.png','image/png',8,'fixture.png','now')").run();
      assert.equal(database.prepare("SELECT storage_backend FROM assignment_images WHERE id='image'").get().storage_backend, 'r2');
      assert.throws(() => database.prepare("INSERT INTO assignment_images(id,assignment_id,object_key,content_type,size_bytes,original_name,created_at) VALUES ('bad-type','assignment','bad-type','image/svg+xml',8,'fixture.svg','now')").run());
      assert.throws(() => database.prepare("INSERT INTO assignment_images(id,assignment_id,object_key,content_type,size_bytes,original_name,created_at) VALUES ('too-large','assignment','too-large','image/png',8388609,'fixture.png','now')").run());
      const pythonCourse = database.prepare('SELECT id,title FROM courses WHERE id=?').get('python-course');
      assert.equal(pythonCourse.id, 'python-course');
      assert.equal(pythonCourse.title, 'Python');
      assert.equal(database.prepare("SELECT COUNT(*) AS count FROM topics WHERE course_id='python-course' AND parent_topic_id IS NULL").get().count, pythonCourseManifest.themes.length);
      assert.equal(database.prepare("SELECT COUNT(*) AS count FROM topics WHERE course_id='python-course' AND parent_topic_id IS NOT NULL").get().count, pythonCourseManifest.themes.flatMap(theme => theme.subtopics).length);
      assert.equal(database.prepare("SELECT COUNT(*) AS count FROM assignments a JOIN topics t ON t.id=a.topic_id WHERE t.course_id='python-course'").get().count, pythonAssignments.metadata.counts.assignments);
      assert.equal(database.prepare("SELECT COUNT(*) AS count FROM topics WHERE course_id='python-course' AND parent_topic_id IS NOT NULL AND github_url LIKE 'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/%'").get().count, pythonCourseManifest.themes.flatMap(theme => theme.subtopics).length);
      assert.equal(database.prepare("SELECT COUNT(*) AS count FROM course_enrollments WHERE course_id='python-course'").get().count, 0);
      assert.equal(database.prepare("SELECT COUNT(*) AS count FROM topic_access x JOIN topics t ON t.id=x.topic_id WHERE t.course_id='python-course'").get().count, 0);
      assert.equal(database.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
      assert.throws(() => database.prepare('INSERT INTO typing_results VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run('id', 's', 'r', 'fr', 'exercise', 30, 90, 1000, 'now'));
      assert.throws(() => database.prepare('INSERT INTO typing_results VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run('id', 's', 'r', 'ru', 'exercise', 300, 90, 1000, 'now'));
      database.prepare("INSERT INTO users(id,login,password,name,role,created_at) VALUES ('student','student','hash','QA student','student','now')").run();
      database.prepare("INSERT INTO notifications(id,student_id,title,body,created_at) VALUES ('legacy-notice','student','Legacy notice','History only','now')").run();
      const legacyNotice = database.prepare("SELECT type,popup,read FROM notifications WHERE id='legacy-notice'").get();
      assert.equal(legacyNotice.type, 'general');
      assert.equal(legacyNotice.popup, 0);
      assert.equal(legacyNotice.read, 0);
      database.prepare("INSERT INTO payment_requests(id,student_id,amount_rub,price_per_lesson,created_at) VALUES ('request','student',2500,1000,'now')").run();
      assert.equal(database.prepare('SELECT price_per_lesson FROM users WHERE id=?').get('student').price_per_lesson, 1000);
      assert.equal(database.prepare('SELECT status FROM payment_requests WHERE id=?').get('request').status, 'pending');
      assert.throws(() => database.prepare("INSERT INTO payment_requests(id,student_id,amount_rub,price_per_lesson,created_at) VALUES ('bad','missing',2500,1000,'now')").run(), /payment request student does not exist/);
      assert.throws(() => database.prepare("INSERT INTO rooms(id,student_id,name,language,student_code,teacher_code,revision,last_active) VALUES ('orphan','missing','Room','python','','',0,0)").run(), /room student does not exist/);
      assert.throws(() => database.prepare("INSERT INTO payment_requests(id,student_id,amount_rub,price_per_lesson,created_at) VALUES ('invalid-amount','student',0,1000,'now')").run());
      database.prepare("INSERT INTO courses(id,title,description,position) VALUES ('course-review','Review course',NULL,0)").run();
      database.prepare("INSERT INTO topics(id,course_id,title,description,content,format) VALUES ('root','course-review','Root',NULL,'# root','md')").run();
      database.prepare("INSERT INTO topics(id,course_id,parent_topic_id,title,description,content,format) VALUES ('child','course-review','root','Child',NULL,'# child','md')").run();
      assert.throws(() => database.prepare("INSERT INTO topics(id,course_id,parent_topic_id,title,content,format) VALUES ('grandchild','course-review','child','Grandchild','','md')").run(), /topic parent must be a root/);
      database.prepare("INSERT INTO topics(id,course_id,title,content,format) VALUES ('root-2','course-review','Second root','','md')").run();
      assert.throws(() => database.prepare("UPDATE topics SET parent_topic_id='root-2' WHERE id='root'").run(), /topic parent must be a root/);
      assert.throws(() => database.prepare("UPDATE topics SET parent_topic_id='root-2' WHERE id='root-2'").run(), /topic parent must be a root/);
      assert.throws(() => database.prepare("INSERT OR REPLACE INTO topics(id,course_id,parent_topic_id,title,content,format) VALUES ('root','course-review','root-2','Replaced root','','md')").run(), /topic parent must be a root/);
      assert.throws(() => database.prepare("INSERT OR REPLACE INTO topics(id,course_id,parent_topic_id,title,content,format) VALUES ('root-2','course-review','root-2','Self parent','','md')").run(), /topic parent must be a root/);
      database.prepare("INSERT INTO courses(id,title,position) VALUES ('other-course','Other course',1)").run();
      assert.throws(() => database.prepare("UPDATE topics SET course_id='other-course' WHERE id='root'").run(), /topic parent must be a root/);
      assert.throws(() => database.prepare("INSERT OR REPLACE INTO topics(id,course_id,title,content,format) VALUES ('root','other-course','Replaced root','','md')").run(), /topic parent must be a root/);
      assert.throws(() => database.prepare("INSERT INTO topics(id,course_id,parent_topic_id,title,content,format) VALUES ('wrong-course','other-course','root','Wrong course','','md')").run(), /topic parent must be a root/);
      database.prepare("INSERT INTO lessons(id,student_id,name,start,end,type,status) VALUES ('prep-lesson','student','QA student','2026-11-12T10:00:00Z','2026-11-12T10:55:00Z','paid','scheduled')").run();
      database.prepare("INSERT INTO lesson_preparation_items(id,lesson_id,kind,topic_id,position) VALUES ('prep-topic','prep-lesson','topic','child',0)").run();
      assert.equal(database.prepare("SELECT topic_id FROM lesson_preparation_items WHERE id='prep-topic'").get().topic_id, 'child');
      assert.throws(() => database.prepare("INSERT INTO lesson_preparation_items(id,lesson_id,kind,topic_id,assignment_id,position) VALUES ('bad-prep','prep-lesson','topic','child','task',1)").run());
      assert.throws(() => database.prepare("INSERT INTO lesson_preparation_items(id,lesson_id,kind,topic_id,position) VALUES ('orphan-prep','missing-lesson','topic','child',0)").run(), /preparation item requires a student lesson/);
    } finally {
      database.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('миграция цены сохраняет существующих учеников и баланс', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'codetogether-upgrade-'));
  const databasePath = path.join(directory, 'existing.sqlite');
  const migrationDirectory = new URL('../drizzle/', import.meta.url);
  const files = readdirSync(migrationDirectory).filter(name => /^\d+_.*\.sql$/.test(name)).sort();
  try {
    const database = new DatabaseSync(databasePath);
    try {
      database.exec('CREATE TABLE d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
      for (const name of files.filter(name => name < '0011_curly_purple_man.sql')) {
        database.exec(readFileSync(new URL(name, migrationDirectory), 'utf8'));
        database.prepare('INSERT INTO d1_migrations(name) VALUES (?)').run(name);
      }
      database.prepare("INSERT INTO users(id,login,password,name,role,balance,created_at) VALUES ('legacy','legacy','hash','Existing student','student',7,'2024-01-01T00:00:00.000Z')").run();
      database.prepare("INSERT INTO courses(id,title,position) VALUES ('legacy-course','Legacy course',0)").run();
      database.prepare("INSERT INTO topics(id,course_id,title,content,format,position) VALUES ('legacy-topic','legacy-course','Legacy topic','# Preserve this','md',0)").run();
    } finally {
      database.close();
    }

    const result = spawnSync(process.execPath, ['scripts/migrate-sqlite.mjs'], {
      cwd: process.cwd(), encoding: 'utf8', env: { ...process.env, DATABASE_PATH: databasePath },
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const upgraded = new DatabaseSync(databasePath);
    try {
      const student = upgraded.prepare('SELECT id,balance,price_per_lesson FROM users WHERE id=?').get('legacy');
      assert.equal(student.id, 'legacy');
      assert.equal(student.balance, 7);
      assert.equal(student.price_per_lesson, 1000);
      const topic = upgraded.prepare('SELECT course_id,parent_topic_id,github_url,content FROM topics WHERE id=?').get('legacy-topic');
      assert.equal(topic.course_id, 'legacy-course');
      assert.equal(topic.parent_topic_id, null);
      assert.equal(topic.github_url, null);
      assert.equal(topic.content, '# Preserve this');
    } finally {
      upgraded.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('миграция задаёт срок хранения только по последней проверке и нормализует даты', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'codetogether-assignment-retention-migration-'));
  const databasePath = path.join(directory, 'legacy.sqlite');
  const migrationDirectory = new URL('../drizzle/', import.meta.url);
  const files = readdirSync(migrationDirectory).filter(name => /^\d+_.*\.sql$/.test(name)).sort();
  try {
    const database = new DatabaseSync(databasePath);
    try {
      database.exec('CREATE TABLE d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
      for (const name of files.filter(name => name < '0018_assignment_image_server_storage_and_retention.sql')) {
        database.exec(readFileSync(new URL(name, migrationDirectory), 'utf8'));
        database.prepare('INSERT INTO d1_migrations(name) VALUES (?)').run(name);
      }
      database.prepare("INSERT INTO users(id,login,password,name,role,created_at) VALUES ('legacy','legacy','hash','Legacy','student','2024-01-01T00:00:00.000Z')").run();
      for (const id of ['latest-passed', 'latest-pending', 'latest-needs-work']) {
        database.prepare('INSERT INTO assignments(id,student_id,title,kind,prompt) VALUES (?,?,?,?,?)').run(id, 'legacy', id, 'text', 'Prompt');
      }
      const insertSubmission = database.prepare('INSERT INTO submissions(id,assignment_id,student_id,content,result,created_at) VALUES (?,?,?,?,?,?)');
      insertSubmission.run('passed-old', 'latest-pending', 'legacy', 'old', '{"status":"passed"}', '2025-01-01T00:00:00.000Z');
      insertSubmission.run('pending-new', 'latest-pending', 'legacy', 'new', '{"status":"pending"}', '2026-11-12T00:00:00.000Z');
      insertSubmission.run('passed-current', 'latest-passed', 'legacy', 'answer', '{"status":"passed"}', '2026-11-10T00:00:00.000Z');
      insertSubmission.run('needs-work-current', 'latest-needs-work', 'legacy', 'answer', '{"status":"needs_work"}', '2026-11-11T00:00:00.000Z');
      database.prepare('UPDATE submissions SET feedback_at=? WHERE id=?').run('2026-11-11T18:30:00.000Z', 'needs-work-current');
    } finally {
      database.close();
    }

    const result = spawnSync(process.execPath, ['scripts/migrate-sqlite.mjs'], {
      cwd: process.cwd(), encoding: 'utf8', env: { ...process.env, DATABASE_PATH: databasePath },
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const migrated = new DatabaseSync(databasePath);
    try {
      const state = migrated.prepare('SELECT id,created_at,completed_at FROM assignments WHERE id LIKE \'latest-%\' ORDER BY id').all();
      const byId = Object.fromEntries(state.map(row => [row.id, row]));
      assert.match(byId['latest-passed'].created_at, /^\d{4}-\d\d-\d\dT/);
      assert.equal(byId['latest-passed'].completed_at, '2026-11-10T00:00:00.000Z');
      assert.equal(byId['latest-needs-work'].completed_at, '2026-11-11T18:30:00.000Z');
      assert.equal(byId['latest-pending'].completed_at, null, 'An older passed attempt must not hide the latest pending submission.');
    } finally {
      migrated.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('миграция условий Python сохраняет правки преподавателя и решения учеников', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'codetogether-python-prompts-'));
  const databasePath = path.join(directory, 'before-standardization.sqlite');
  const migrationDirectory = new URL('../drizzle/', import.meta.url);
  const files = readdirSync(migrationDirectory).filter(name => /^\d+_.*\.sql$/.test(name)).sort();
  const assignments = pythonAssignments.topics.flatMap(theme => theme.subtopics.flatMap(subtopic => subtopic.assignments));
  const promptUpdates = assignments.filter(task => task.prompt);
  const titleUpdates = assignments.filter(task => task.id === 'python-task-525cb5793df3b1f3'
    || task.id === 'python-task-0a527d306edd6de6'
    || task.id === 'python-task-6d4c00ca79b76db3'
    || task.id === 'python-task-30ce9a461c912350'
    || task.id === 'python-task-a7ecc49e7e8047e1'
    || task.id === 'python-task-9887d02ff779e965');

  try {
    const database = new DatabaseSync(databasePath);
    try {
      database.exec('PRAGMA foreign_keys=ON; CREATE TABLE d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
      for (const name of files.filter(name => name < '0015_standardize_python_assignment_prompts.sql')) {
        database.exec(readFileSync(new URL(name, migrationDirectory), 'utf8'));
        database.prepare('INSERT INTO d1_migrations(name) VALUES (?)').run(name);
      }

      const standardId = promptUpdates[0].id;
      const tutorEditedId = promptUpdates[1].id;
      const blankId = promptUpdates[2].id;
      const untouchedTitleId = titleUpdates[0].id;
      const tutorTitleId = titleUpdates[1].id;
      const tutorPrompt = 'Условие, вручную изменённое преподавателем';
      const tutorTitle = 'Заголовок преподавателя';
      const legacyPrompt = 'Выведи название любимой книги или игры в кавычках. Пока не добавляй к ответу поясняющий текст.';
      const legacyTitle = 'Создай переменную с понятным именем для любимого предмета и выведи оба значения.';
      assert.equal(standardId, 'python-task-9d28301184e99d2f');
      assert.equal(untouchedTitleId, 'python-task-525cb5793df3b1f3');
      const beforeStandard = database.prepare('SELECT prompt FROM assignments WHERE id=?').get(standardId);
      const beforeTutorTitle = database.prepare('SELECT title FROM assignments WHERE id=?').get(tutorTitleId);
      assert.ok(beforeStandard?.prompt);
      assert.ok(beforeTutorTitle?.title);

      database.prepare('UPDATE assignments SET prompt=? WHERE id=?').run(legacyPrompt, standardId);
      database.prepare('UPDATE assignments SET title=? WHERE id=?').run(legacyTitle, untouchedTitleId);
      database.prepare('UPDATE assignments SET prompt=? WHERE id=?').run(tutorPrompt, tutorEditedId);
      database.prepare("UPDATE assignments SET prompt='' WHERE id=?").run(blankId);
      database.prepare('UPDATE assignments SET title=? WHERE id=?').run(tutorTitle, tutorTitleId);
      database.prepare("INSERT INTO users(id,login,password,name,role,created_at) VALUES ('qa-student','qa-student','hash','QA student','student','2026-11-12T00:00:00.000Z')").run();
      database.prepare('INSERT INTO submissions(id,assignment_id,student_id,content,result,created_at) VALUES (?, ?, ?, ?, ?, ?)')
        .run('preserved-submission', tutorEditedId, 'qa-student', 'print(1)', '{"status":"pending"}', '2026-11-12T00:00:00.000Z');
      const beforeIds = database.prepare('SELECT id FROM assignments ORDER BY id').all().map(row => row.id);

      database.exec(readFileSync(new URL('0015_standardize_python_assignment_prompts.sql', migrationDirectory), 'utf8'));

      const standard = database.prepare('SELECT prompt FROM assignments WHERE id=?').get(standardId);
      const edited = database.prepare('SELECT prompt FROM assignments WHERE id=?').get(tutorEditedId);
      const blank = database.prepare('SELECT prompt FROM assignments WHERE id=?').get(blankId);
      const untouchedTitle = database.prepare('SELECT title FROM assignments WHERE id=?').get(untouchedTitleId);
      const editedTitle = database.prepare('SELECT title FROM assignments WHERE id=?').get(tutorTitleId);
      assert.equal(standard.prompt, assignments.find(task => task.id === standardId).prompt);
      assert.equal(edited.prompt, tutorPrompt);
      assert.equal(blank.prompt, assignments.find(task => task.id === blankId).prompt);
      assert.equal(untouchedTitle.title, assignments.find(task => task.id === untouchedTitleId).title);
      assert.equal(editedTitle.title, tutorTitle);
      const migratedAssignments = database.prepare('SELECT id,title,prompt FROM assignments ORDER BY id').all();
      assert.deepEqual(migratedAssignments.map(row => row.id), beforeIds);
      for (const row of migratedAssignments) {
        const expected = assignments.find(task => task.id === row.id);
        assert.ok(expected, `assignment ${row.id} remains in the source export`);
        assert.equal(row.prompt, row.id === tutorEditedId ? tutorPrompt : expected.prompt, `${row.id} prompt is migrated or preserved`);
        assert.equal(row.title, row.id === tutorTitleId ? tutorTitle : expected.title, `${row.id} title is migrated or preserved`);
      }
      assert.deepEqual({ ...database.prepare('SELECT id,assignment_id,student_id,content,result,created_at FROM submissions WHERE id=?').get('preserved-submission') }, {
        id: 'preserved-submission', assignment_id: tutorEditedId, student_id: 'qa-student', content: 'print(1)', result: '{"status":"pending"}', created_at: '2026-11-12T00:00:00.000Z',
      });
      assert.equal(migratedAssignments.length, beforeIds.length);
      assert.equal(assignments.length, 371);
      for (const task of assignments) {
        assert.equal(task.prompt.split('**Задача.**').length, 2, `${task.id} should have one task section`);
        assert.equal(task.prompt.split('**Ожидаемый результат.**').length, 2, `${task.id} should have one expected-result section`);
      }
    } finally {
      database.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
