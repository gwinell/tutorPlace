import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { transformSync } from 'esbuild';

const origin = 'http://test.local';
const migrationDir = new URL('../drizzle/', import.meta.url);
const migrations = readdirSync(migrationDir).filter(name => name.endsWith('.sql')).sort();
const require = createRequire(import.meta.url);
const sources = [
  ['@/lib/domain', 'lib/domain.ts'],
  ['@/lib/assignment-prompt-format.mjs', 'lib/assignment-prompt-format.mjs'],
  ['@/lib/github-source', 'lib/github-source.ts'],
  ['@/lib/room-presets', 'lib/room-presets.ts'],
  ['@/lib/server', 'lib/server.ts'],
  ['@/lib/collaboration', 'lib/collaboration.ts'],
  ['@/lib/trial-booking', 'lib/trial-booking.ts'],
  ['@/lib/lesson-move', 'lib/lesson-move.ts'],
  ['@/lib/salutejazz-real', 'lib/salutejazz.ts'],
  ['route', 'app/api/[...path]/route.ts'],
].map(([name, file]) => [
  name,
  transformSync(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), {
    loader: 'ts', format: 'cjs', target: 'es2022', sourcefile: file,
  }).code,
]);

function setup(beforeRecovery = () => {}) {
  const sql = new DatabaseSync(':memory:');
  for (const file of migrations) {
    if (file.endsWith('_booking_recovery.sql')) beforeRecovery(sql);
    sql.exec(readFileSync(new URL(file, migrationDir), 'utf8'));
  }

  function prepare(query) {
    const statement = sql.prepare(query);
    function command(args) {
      return {
        bind: (...bound) => command(bound),
        first: async () => statement.get(...args) ?? null,
        all: async () => ({ results: statement.all(...args) }),
        run: () => {
          if (query.startsWith('DELETE FROM assignment_images') && network.beforeAssignmentImageMetadataDelete) {
            const callback = network.beforeAssignmentImageMetadataDelete;
            network.beforeAssignmentImageMetadataDelete = null;
            callback();
          }
          if (query.startsWith("INSERT INTO lessons (id,student_id,name,start,end,type,status,event_id,operation_started_at,meet_url,topic) SELECT ?,id,?,?,?")) {
            const callback = network.beforeManualInsert;
            network.beforeManualInsert = null;
            callback?.();
          }
          if (query.startsWith('INSERT INTO rooms (id,student_id,name,language,student_code,teacher_code,revision,last_active) SELECT ?,id')) {
            const callback = network.beforeRoomInsert;
            network.beforeRoomInsert = null;
            callback?.();
          }
          return { meta: { changes: statement.run(...args).changes } };
        },
      };
    }
    return command([]);
  }

  const env = {
    DB: {
      prepare,
      async batch(commands) {
        sql.exec('BEGIN');
        try {
          const result = commands.map(command => command.run());
          sql.exec('COMMIT');
          return result;
        } catch (error) {
          sql.exec('ROLLBACK');
          throw error;
        }
      },
    },
    GOOGLE_CLIENT_ID: 'fixture',
    GOOGLE_CLIENT_SECRET: 'fixture',
    GOOGLE_REFRESH_TOKEN: 'fixture',
    GOOGLE_CALENDAR_ID: 'fixture-calendar',
  };

  const date = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  const at = hour => new Date(date + 'T' + String(hour).padStart(2, '0') + ':00:00+03:00').toISOString();
  sql.prepare("INSERT INTO settings(key,value) VALUES ('schedule',?)").run(JSON.stringify({
    days: [0, 1, 2, 3, 4, 5, 6], from: '10:00', to: '19:00', timezone: 'Europe/Moscow', meetUrl: '',
  }));
  const events = new Map();
  let etag = 0;
  const network = { lostResponse: false, unavailableAfterPatch: false, unavailable: false, skipPatch: false, failDelete: false, failJazzDisable: false, afterFreeBusy: null, beforeManualInsert: null, beforeRoomInsert: null, beforeAssignmentImageMetadataDelete: null, jazzEnabled: false, jazzRoom: null, disabledRooms: [], busy: [], r2Uploads: [], r2Deletes: [] };
  const calendarFetch = async (url, options) => {
    const path = new URL(url).pathname;
    if (path === '/token') return Response.json({ access_token: 'fixture', expires_in: 3600 });
    if (path.endsWith('/freeBusy')) {
      const callback = network.afterFreeBusy;
      network.afterFreeBusy = null;
      callback?.();
      return Response.json({ calendars: { 'fixture-calendar': { busy: network.busy } } });
    }
    if (path.endsWith('/events') && options.method === 'GET') return Response.json({ items: [...events.values()] });
    if (path.endsWith('/events') && options.method === 'POST') {
      const event = { ...JSON.parse(options.body), etag: '"' + ++etag + '"' };
      events.set(event.id, event);
      return Response.json(event);
    }

    const eventId = path.split('/').at(-1);
    if (options.method === 'DELETE') {
      if (network.failDelete) throw new Error('Calendar delete failed');
      events.delete(eventId);
      return new Response(null, { status: 204 });
    }
    const previous = events.get(eventId);
    if (!previous) return new Response(null, { status: 404 });
    if (options.method === 'GET') {
      if (network.unavailable) throw new Error('Calendar unavailable');
      return Response.json(previous);
    }
    assert.equal(options.method, 'PATCH');
    assert.equal(options.headers['If-Match'], previous.etag);
    const event = { ...previous, ...JSON.parse(options.body), etag: '"' + ++etag + '"' };
    if (!network.skipPatch) events.set(eventId, event);
    if (network.unavailableAfterPatch) network.unavailable = true;
    if (network.lostResponse) throw new Error('Calendar response lost');
    return Response.json(event);
  };

  const modules = {
    'cloudflare:workers': { env },
    '@/lib/runtime-env': { getRuntimeEnvironment: () => env },
    '@/lib/assignment-images': {
      assignmentImageExtension: () => 'png', assignmentImageStorageBackend: environment => environment.R2_ACCOUNT_ID ? 'r2' : null,
      canReadAssignmentImage: ({ role, targetBelongsToUser, lessonBelongsToUser }) => role === 'teacher' || (targetBelongsToUser && lessonBelongsToUser),
      deleteQueuedR2Object: async (_database, key) => network.r2Deletes.push(key), deleteQueuedAssignmentImage: async (_database, _settingKey, _settingValue, key) => network.r2Deletes.push(key), getR2Object: async () => Uint8Array.from([137,80,78,71,13,10,26,10]),
      getAssignmentImageObject: async () => Uint8Array.from([137,80,78,71,13,10,26,10]), putAssignmentImageObject: async (key, bytes, contentType) => network.r2Uploads.push({ key, size: bytes.length, contentType }),
      MAX_ASSIGNMENT_IMAGE_BYTES: 8 * 1024 * 1024, putR2Object: async (key, bytes, contentType) => network.r2Uploads.push({ key, size: bytes.length, contentType }),
      r2S3Config: environment => environment.R2_ACCOUNT_ID ? { fixture: true } : null,
      cleanupOrphanedAssignmentImages: async () => {},
      pendingAssignmentImageId: placeholder => {
        const marker = /^!\[([^\]\r\n]{0,180})\]\(codetogether-pending:([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\)$/i.exec(placeholder);
        return marker ? { id: marker[2], alt: marker[1] } : null;
      },
      replacePendingAssignmentImage: (prompt, placeholder, imageId) => {
        if (!placeholder || prompt.indexOf(placeholder) < 0 || prompt.indexOf(placeholder) !== prompt.lastIndexOf(placeholder)) return null;
        const marker = /^!\[([^\]\r\n]{0,180})\]\(codetogether-pending:([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\)$/i.exec(placeholder);
        if (!marker || marker[2] !== imageId) return null;
        return prompt.replace(placeholder, `![${marker[1].replace(/[\[\]\\()\r\n]/g, '').slice(0, 120).trim() || 'Изображение'}](/api/assignment-images/${imageId})`);
      },
      sanitizeAssignmentImageName: fileName => fileName,
      validateAssignmentImage: (bytes, type) => type === 'image/png' && [137,80,78,71,13,10,26,10].every((byte, index) => bytes[index] === byte),
      R2StorageError: class R2StorageError extends Error {}, AssignmentImageStorageError: class AssignmentImageStorageError extends Error {},
    },
    '@/lib/sqlite-db': { getSqliteDatabase: () => { throw new Error('SQLite fallback is not used by booking fixtures'); } },
    '@/lib/salutejazz': {
      saluteJazzConfigured: () => network.jazzEnabled,
      createSaluteJazzRoom: async () => network.jazzRoom || { roomId: 'fixture-room', roomUrl: 'https://meeting.example/fixture-room' },
      disableSaluteJazzRoom: async roomId => { if (network.failJazzDisable) throw new Error('SaluteJazz disable failed'); network.disabledRooms.push(roomId); },
    },
  };
  for (const [name, source] of sources) {
    const loaded = { exports: {} };
    runInNewContext(source, {
      module: loaded, exports: loaded.exports,
      require: path => modules[path.startsWith('./') ? '@/lib/' + path.slice(2) : path] ?? require(path),
      Response, Request, URL, URLSearchParams, FormData, File, Headers, Intl, TextEncoder, TextDecoder, AbortSignal, crypto,
      fetch: calendarFetch, console: { error() {} }, btoa, atob,
    });
    modules[name] = loaded.exports;
  }

  async function request(path, body, cookie, ip = '192.0.2.1', requestedMethod) {
    const method = requestedMethod || (body === undefined ? 'GET' : 'POST');
    const send = modules.route[method];
    const response = await send(new Request(origin + '/api/' + path, {
      method,
      headers: { Origin: origin, 'Content-Type': 'application/json', 'cf-connecting-ip': ip, ...(cookie ? { Cookie: cookie } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    }));
    return { status: response.status, data: await response.json(), headers: response.headers };
  }

  async function teacherSession() {
    sql.prepare("INSERT INTO users(id,login,password,name,role,created_at) VALUES ('teacher','teacher','fixture','QA','teacher',?)").run(new Date().toISOString());
    const token = 'fixture-token';
    const digest = await modules['@/lib/server'].hash(token);
    sql.prepare("INSERT INTO sessions(id,user_id,expires_at) VALUES (?,'teacher',?)").run(digest, Date.now() + 60000);
    return 'ct-session=' + token;
  }

  async function studentSession(studentId) {
    const token = 'student-token-' + studentId;
    const digest = await modules['@/lib/server'].hash(token);
    sql.prepare('INSERT INTO sessions(id,user_id,expires_at) VALUES (?,?,?)').run(digest, studentId, Date.now() + 60000);
    return 'ct-session=' + token;
  }

  async function createStudent(cookie, overrides = {}) {
    const suffix = crypto.randomUUID().slice(0, 8);
    const result = await request('students', {
      name: overrides.name || 'Synthetic Student', age: 12, parent_name: 'QA Parent',
      login: 'student_' + suffix, password: 'test-password-123', balance: overrides.balance ?? 0,
      ...(overrides.price_per_lesson === undefined ? {} : { price_per_lesson: overrides.price_per_lesson }),
    }, cookie);
    assert.equal(result.status, 200);
    const student = sql.prepare("SELECT * FROM users WHERE login=?").get('student_' + suffix);
    return { student, cookie: await studentSession(student.id) };
  }

  const book = (phone, hour, ip) => request('book', {
    name: 'Synthetic QA', phone, start: at(hour), minutes: 45, consent: true, goals: ['Python'],
  }, undefined, ip);
  const lesson = id => sql.prepare('SELECT * FROM lessons WHERE id=?').get(id);
  const locks = id => sql.prepare('SELECT COUNT(*) AS n FROM slot_locks WHERE lesson_id=?').get(id).n;
  return { sql, request, teacherSession, studentSession, createStudent, book, lesson, locks, events, network, at, date, modules };
}

test('parseSdkKey принимает Base64 SDK key и отклоняет повреждённые данные', () => {
  const sdkKey = { projectId: 'project-id', key: { kid: 'key-id', crv: 'P-384', d: 'private' } };
  const encoded = Buffer.from(JSON.stringify(sdkKey)).toString('base64');
  assert.deepEqual(JSON.parse(JSON.stringify(setup().modules['@/lib/salutejazz-real'].parseSdkKey(encoded))), sdkKey);
  assert.throws(() => setup().modules['@/lib/salutejazz-real'].parseSdkKey('not a key'), /SDK key is invalid/);
});

test('SaluteJazz кеширует access token и не запрашивает его для каждой комнаты', async () => {
  const keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const jwk = { ...await crypto.subtle.exportKey('jwk', keys.privateKey), kid: 'fixture-key' };
  const sdkKey = Buffer.from(JSON.stringify({ projectId: 'fixture-project', key: jwk })).toString('base64');
  let logins = 0;
  let rooms = 0;
  const saluteFetch = async url => {
    if (new URL(url).pathname === '/v1/auth/login') {
      logins++;
      return Response.json({ token: 'cached-token' });
    }
    rooms++;
    return Response.json({ roomId: 'room-' + rooms, roomUrl: 'https://meeting.salutejazz.ru/room-' + rooms });
  };
  const loaded = { exports: {} };
  runInNewContext(sources.find(([name]) => name === '@/lib/salutejazz-real')[1], {
    module: loaded, exports: loaded.exports, fetch: saluteFetch, crypto, URL,
    TextEncoder, TextDecoder, AbortSignal, btoa, atob,
  });
  await loaded.exports.createSaluteJazzRoom('one', { SALUTEJAZZ_SDK_KEY: sdkKey });
  await loaded.exports.createSaluteJazzRoom('two', { SALUTEJAZZ_SDK_KEY: sdkKey });
  assert.equal(logins, 1);
  assert.equal(rooms, 2);
});

test('normalizeSchedule переводит старый формат дней и часов в недельные интервалы', () => {
  const normalized = setup().modules['@/lib/server'].normalizeSchedule({
    days: [1, 4], from: '10:00', to: '16:30', meetUrl: 'https://example.test/call', availabilityCalendarIds: ['work'],
  });
  assert.deepEqual(JSON.parse(JSON.stringify(normalized.weeklyAvailability)), {
    1: [{ from: '10:00', to: '16:30' }], 4: [{ from: '10:00', to: '16:30' }],
  });
  assert.deepEqual(JSON.parse(JSON.stringify(normalized.days)), [1, 4]);
  assert.equal(normalized.timezone, 'Europe/Moscow');
  assert.equal(normalized.availabilityCalendarIds[0], 'work');
});

test('Миграция сохраняет старые записи и блокирует новый дубль в другом формате', async () => {
  const qa = setup(sql => {
    const insert = sql.prepare("INSERT INTO lessons (id,name,phone,start,end,type,status) VALUES (?, 'QA', ?, ?, ?, 'trial', 'scheduled')");
    insert.run('legacy-one', '8 (916) 111-22-33', '2000-01-01T07:00:00.000Z', '2000-01-01T07:45:00.000Z');
    insert.run('legacy-two', '+79161112233', '2000-01-01T09:00:00.000Z', '2000-01-01T09:45:00.000Z');
  });
  assert.equal(qa.lesson('legacy-one').phone, '8 (916) 111-22-33');
  assert.equal(qa.lesson('legacy-one').trial_phone, qa.lesson('legacy-two').trial_phone);
  assert.equal((await qa.book('+7 (916) 111-22-33', 10)).status, 409);
});

test('Запись отклоняет пустой номер, атомарно блокирует дубли и ограничивает попытки', async () => {
  const qa = setup();
  assert.equal((await qa.book('----------', 10)).status, 400);
  const concurrent = await Promise.all([
    qa.book('+7 (916) 123-45-67', 10),
    qa.book('8 916 123 45 67', 12),
  ]);
  assert.deepEqual(concurrent.map(result => result.status).sort(), [201, 409]);
  assert.equal(qa.events.size, 1);
  assert.equal((await qa.book('+79161234568', 14)).status, 201);
  assert.equal((await qa.book('+79161234569', 16)).status, 429);
  assert.equal((await qa.book('+79161234569', 16, '192.0.2.2')).status, 201);
});

test('Пробная запись создаёт кабинет, сохраняет цели занятий и автоматически входит в него', async () => {
  const qa = setup();
  const booked = await qa.request('book', {
    name: 'Synthetic Trial', phone: '+7 (916) 123-45-67', start: qa.at(10), minutes: 45,
    consent: true, goals: ['ЕГЭ', 'Python', 'Pandas', 'МЦКО', 'ОГЭ', 'Информатика', 'Повышение успеваемости'],
    comment: 'Нужно подготовиться к экзамену и повторить основы.',
  });
  assert.equal(booked.status, 201);
  assert.equal(booked.data.trialAccount.autoLogin, true);
  assert.match(booked.data.trialAccount.credentials.login, /^trial_[a-z2-9]{10}$/);
  assert.equal(booked.data.trialAccount.credentials.password.length, 16);
  assert.equal(booked.data.trialAccount.user.account_type, 'trial');
  assert.match(booked.headers.get('set-cookie') || '', /^ct-session=.+HttpOnly/);

  const student = qa.sql.prepare('SELECT * FROM users WHERE id=?').get(booked.data.trialAccount.user.id);
  assert.equal(student.role, 'student');
  assert.equal(student.account_type, 'trial');
  assert.equal(student.phone, '+79161234567');
  assert.equal(student.balance, 0);
  assert.equal(student.price_per_lesson, 1000);
  assert.notEqual(student.password, booked.data.trialAccount.credentials.password);
  assert.equal(await qa.modules['@/lib/server'].verifyPassword(booked.data.trialAccount.credentials.password, student.password), true);

  const lesson = qa.lesson(booked.data.lesson.id);
  assert.equal(lesson.student_id, student.id);
  assert.deepEqual(JSON.parse(lesson.trial_goals), ['ЕГЭ', 'Python', 'Pandas', 'МЦКО', 'ОГЭ', 'Информатика', 'Повышение успеваемости']);
  assert.equal(lesson.trial_comment, 'Нужно подготовиться к экзамену и повторить основы.');

  const cookie = booked.headers.get('set-cookie').split(';')[0];
  const workspace = await qa.request('workspace', undefined, cookie);
  assert.equal(workspace.status, 200);
  assert.equal(workspace.data.user.id, student.id);
  assert.equal(workspace.data.lessons.length, 1);
  assert.equal(workspace.data.lessons[0].id, lesson.id);
  const teacher = await qa.teacherSession();
  const teacherWorkspace = await qa.request('workspace', undefined, teacher);
  assert.ok(teacherWorkspace.data.students.some(account => account.id === student.id && account.account_type === 'trial'));
  assert.ok(teacherWorkspace.data.lessons.some(item => item.id === lesson.id && item.trial_comment === lesson.trial_comment));

  const missingGoal = await qa.request('book', { name: 'No Goal', phone: '+79161234568', start: qa.at(12), minutes: 45, consent: true });
  assert.equal(missingGoal.status, 400);
});

test('Репетитор выдаёт доступ к будущим старым пробным записям один раз и переводит аккаунт', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const phone = '+79161234567';
  for (const [id, hour] of [['old-trial-one', 10], ['old-trial-two', 12]]) {
    qa.sql.prepare("INSERT INTO lessons (id,name,phone,trial_phone,start,end,type,status) VALUES (?,'Legacy QA',?,?,?,?,'trial','scheduled')")
      .run(id, '8 (916) 123-45-67', phone, qa.at(hour), new Date(Date.parse(qa.at(hour)) + 45 * 60000).toISOString());
  }

  const migrated = await qa.request('trial-accounts/backfill', {}, teacher);
  assert.equal(migrated.status, 200, JSON.stringify(migrated.data));
  assert.equal(migrated.data.linked, 2);
  assert.equal(migrated.data.accounts.length, 1);
  const [{ id: studentId, login, password }] = migrated.data.accounts;
  assert.match(login, /^trial_[a-z2-9]{10}$/);
  assert.equal(password.length, 16);
  assert.equal(qa.sql.prepare('SELECT COUNT(*) AS count FROM lessons WHERE student_id=?').get(studentId).count, 2);

  const repeated = await qa.request('trial-accounts/backfill', {}, teacher);
  assert.deepEqual({ linked: repeated.data.linked, accounts: repeated.data.accounts.length }, { linked: 0, accounts: 0 });
  const promoted = await qa.request('students/' + studentId + '/promote', {}, teacher);
  assert.equal(promoted.status, 200);
  assert.equal(qa.sql.prepare('SELECT account_type FROM users WHERE id=?').get(studentId).account_type, 'regular');
});

test('Потерянный ответ PATCH сверяется с календарём и подтверждает перенос', async () => {
  const qa = setup();
  const created = await qa.book('+79161234567', 10);
  assert.equal(created.status, 201);
  const { id, event_id } = created.data.lesson;
  const cookie = await qa.teacherSession();
  qa.network.lostResponse = true;
  const moved = await qa.request('lessons/' + id, { start: qa.at(12) }, cookie);
  assert.equal(moved.status, 200);
  assert.equal(qa.lesson(id).start, qa.at(12));
  assert.equal(qa.events.get(event_id).start.dateTime, qa.at(12));
  assert.equal(qa.lesson(id).move_id, null);
  assert.equal(qa.locks(id), 9);
});

test('При недоступной сверке оба окна удерживаются, повторная проверка завершает перенос', async () => {
  const qa = setup();
  const created = await qa.book('+79161234567', 10);
  const { id, event_id } = created.data.lesson;
  const cookie = await qa.teacherSession();
  Object.assign(qa.network, { lostResponse: true, unavailableAfterPatch: true, skipPatch: true });
  assert.equal((await qa.request('lessons/' + id, { start: qa.at(12) }, cookie)).status, 503);
  assert.equal(qa.lesson(id).status, 'updating');
  assert.equal(qa.lesson(id).start, qa.at(10));
  assert.equal(qa.lesson(id).move_start, qa.at(12));
  assert.equal(qa.locks(id), 18);
  const slots = await qa.request('slots?date=' + qa.date);
  assert.ok(!slots.data.slots.some(slot => slot.start === qa.at(10) || slot.start === qa.at(12)));

  Object.assign(qa.network, { lostResponse: false, unavailableAfterPatch: false, unavailable: false, skipPatch: false });
  const retried = await qa.request('lessons/' + id + '/move-retry', {}, cookie);
  assert.equal(retried.status, 200);
  assert.equal(qa.lesson(id).start, qa.at(12));
  assert.equal(qa.events.get(event_id).start.dateTime, qa.at(12));
  assert.equal(qa.locks(id), 9);
});

test('Репетитор вручную назначает уроки вне доступности, поверх занятых событий и без баланса', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const { student, cookie } = await qa.createStudent(teacher);
  qa.network.busy = [{ start: qa.at(11), end: qa.at(13) }];

  const first = await qa.request('lessons', { studentId: student.id, start: qa.at(12) }, teacher);
  const second = await qa.request('lessons', { studentId: student.id, start: qa.at(12) }, teacher);
  assert.equal(first.status, 201);
  assert.equal(second.status, 201);
  assert.equal(first.data.lesson.end, new Date(Date.parse(qa.at(12)) + 55 * 60000).toISOString());
  assert.equal(qa.locks(first.data.lesson.id), 0);
  assert.equal(qa.events.size, 2);

  const blockedByCalendar = await qa.request('book', { minutes: 55, start: qa.at(12) }, cookie);
  assert.equal(blockedByCalendar.status, 409);
  qa.network.busy = [];
  const blockedByBalance = await qa.request('book', { minutes: 55, start: qa.at(15) }, cookie);
  assert.equal(blockedByBalance.status, 409);
  assert.equal((await qa.request('lessons', { studentId: student.id, start: qa.at(15) }, cookie)).status, 403);

  qa.sql.prepare('UPDATE users SET balance=-1 WHERE id=?').run(student.id);
  const outsideHours = await qa.request('lessons', { studentId: student.id, start: qa.at(22) }, teacher);
  assert.equal(outsideHours.status, 201);
  qa.sql.prepare('UPDATE lessons SET start=?,end=? WHERE id=?').run('2000-01-01T07:00:00.000Z', '2000-01-01T07:55:00.000Z', outsideHours.data.lesson.id);
  const completed = await qa.request('lessons/' + outsideHours.data.lesson.id + '/complete', {}, teacher);
  assert.equal(completed.status, 200);
  assert.equal(qa.sql.prepare('SELECT balance FROM users WHERE id=?').get(student.id).balance, -2);
});

test('Обычная запись повторно проверяет занятость после ответа FreeBusy', async () => {
  const qa = setup();
  qa.network.afterFreeBusy = () => qa.sql.prepare("INSERT INTO lessons(id,name,start,end,type,status) VALUES ('racing-event','Racing event',?,?, 'trial','scheduled')").run(qa.at(12), new Date(Date.parse(qa.at(12)) + 45 * 60000).toISOString());
  const result = await qa.book('+79161234567', 12);
  assert.equal(result.status, 409);
  assert.equal(qa.sql.prepare("SELECT COUNT(*) AS count FROM lessons WHERE id='racing-event'").get().count, 1);
  assert.equal(qa.sql.prepare("SELECT COUNT(*) AS count FROM lessons WHERE trial_phone='+79161234567'").get().count, 0);
  assert.equal(qa.events.size, 0);
});

test('Платная запись повторно проверяет занятость после ответа FreeBusy', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const { student, cookie } = await qa.createStudent(teacher, { balance: 1 });
  qa.network.afterFreeBusy = () => qa.sql.prepare("INSERT INTO lessons(id,name,start,end,type,status) VALUES ('racing-event','Racing event',?,?, 'trial','scheduled')").run(qa.at(12), new Date(Date.parse(qa.at(12)) + 45 * 60000).toISOString());

  const result = await qa.request('book', { minutes: 55, start: qa.at(12) }, cookie);
  assert.equal(result.status, 409);
  assert.equal(qa.sql.prepare("SELECT COUNT(*) AS count FROM lessons WHERE student_id=? AND type='paid'").get(student.id).count, 0);
  assert.equal(qa.events.size, 0);
});

test('Списание при завершении удерживает баланс для параллельной записи', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const { student, cookie } = await qa.createStudent(teacher, { balance: 1 });
  const manual = await qa.request('lessons', { studentId: student.id, start: qa.at(12) }, teacher);
  assert.equal(manual.status, 201);
  qa.sql.prepare("UPDATE lessons SET status='completing',operation_started_at=? WHERE id=?").run(new Date().toISOString(), manual.data.lesson.id);

  const booking = await qa.request('book', { minutes: 55, start: qa.at(15) }, cookie);
  assert.equal(booking.status, 409);
  assert.equal(qa.sql.prepare('SELECT balance FROM users WHERE id=?').get(student.id).balance, 1);
  assert.equal(qa.sql.prepare("SELECT COUNT(*) AS count FROM lessons WHERE student_id=? AND status='completing'").get(student.id).count, 1);
});

test('Удаление ученика перед вставкой не создаёт урок без профиля', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const { student } = await qa.createStudent(teacher);
  qa.network.beforeManualInsert = () => {
    qa.sql.prepare('DELETE FROM users WHERE id=?').run(student.id);
  };

  const result = await qa.request('lessons', { studentId: student.id, start: qa.at(12) }, teacher);
  assert.equal(result.status, 404);
  assert.equal(qa.sql.prepare('SELECT COUNT(*) AS count FROM lessons WHERE student_id=?').get(student.id).count, 0);
  assert.equal(qa.events.size, 0);
});

test('Удаление ученика перед созданием комнаты не оставляет осиротевшую комнату', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const { student, cookie } = await qa.createStudent(teacher);
  qa.network.beforeRoomInsert = () => qa.sql.prepare('DELETE FROM users WHERE id=?').run(student.id);

  const result = await qa.request('rooms', {}, cookie);
  assert.equal(result.status, 404);
  assert.equal(qa.sql.prepare('SELECT COUNT(*) AS count FROM rooms WHERE student_id=?').get(student.id).count, 0);
});

test('Не отключает SaluteJazz, если событие урока не удалось удалить', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const { student } = await qa.createStudent(teacher);
  qa.network.jazzEnabled = true;
  qa.network.jazzRoom = { roomId: 'qa-room', roomUrl: 'https://meet.example/qa-room' };
  qa.sql.exec("CREATE TRIGGER fail_manual_schedule BEFORE UPDATE OF status ON lessons WHEN OLD.status='pending' AND NEW.status='scheduled' BEGIN SELECT RAISE(ABORT, 'injected schedule failure'); END");
  qa.network.failDelete = true;

  const result = await qa.request('lessons', { studentId: student.id, start: qa.at(12) }, teacher);
  assert.equal(result.status, 503);
  const pending = qa.sql.prepare("SELECT * FROM lessons WHERE student_id=? AND status='pending'").get(student.id);
  assert.ok(pending);
  assert.equal(pending.meet_url, 'https://meet.example/qa-room');
  assert.deepEqual(qa.network.disabledRooms, []);
  assert.equal(qa.events.size, 1);
});

test('SaluteJazz cleanup is queued when room persistence and shutdown both fail', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const { student } = await qa.createStudent(teacher);
  qa.network.jazzEnabled = true;
  qa.network.jazzRoom = { roomId: 'qa-room', roomUrl: 'https://meet.example/qa-room' };
  qa.network.failJazzDisable = true;
  qa.sql.exec("CREATE TRIGGER fail_manual_room_persist BEFORE UPDATE OF jazz_room_id ON lessons WHEN NEW.jazz_room_id IS NOT NULL BEGIN SELECT RAISE(ABORT, 'injected room persistence failure'); END");

  const result = await qa.request('lessons', { studentId: student.id, start: qa.at(12) }, teacher);
  assert.equal(result.status, 503);
  assert.ok(qa.sql.prepare("SELECT value FROM settings WHERE key='salutejazz-close:qa-room'").get());
  assert.deepEqual(qa.network.disabledRooms, []);
});

test('Цена ученика по умолчанию, изменение цены и заявка с ручным начислением', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const { student, cookie } = await qa.createStudent(teacher);
  const other = await qa.createStudent(teacher, { name: 'Other Student' });
  assert.equal(student.price_per_lesson, 1000);

  const edited = await qa.request('students', {
    id: student.id, name: student.name, age: student.age, parent_name: student.parent_name,
    login: student.login, balance: student.balance, price_per_lesson: 1500,
  }, teacher);
  assert.equal(edited.status, 200);
  assert.equal(qa.sql.prepare('SELECT price_per_lesson FROM users WHERE id=?').get(student.id).price_per_lesson, 1500);
  assert.equal((await qa.request('payment-link', { url: 'https://pay.example/universal' }, teacher)).status, 200);
  assert.equal((await qa.request('payment-link', { url: 'http://unsafe.example/pay' }, teacher)).status, 400);

  const submitted = await qa.request('payment-requests', { amount: 4500, comment: 'Перевёл утром' }, cookie);
  assert.equal(submitted.status, 201);
  assert.equal(submitted.data.request.price_per_lesson, 1500);
  assert.equal(qa.sql.prepare('SELECT balance FROM users WHERE id=?').get(student.id).balance, 0);
  assert.equal((await qa.request('payment-link', { url: 'https://attacker.example' }, cookie)).status, 403);
  assert.equal((await qa.request('payment-requests/' + submitted.data.request.id + '/approve', { credits: 4 }, cookie)).status, 403);

  const studentWorkspace = await qa.request('workspace', undefined, cookie);
  const otherWorkspace = await qa.request('workspace', undefined, other.cookie);
  assert.equal(studentWorkspace.data.paymentLink, 'https://pay.example/universal');
  assert.equal(studentWorkspace.data.paymentRequests.length, 1);
  assert.equal(otherWorkspace.data.paymentRequests.length, 0);
  assert.equal(studentWorkspace.data.user.price_per_lesson, 1500);

  const approved = await qa.request('payment-requests/' + submitted.data.request.id + '/approve', { credits: 3, note: 'Подтверждено' }, teacher);
  assert.equal(approved.status, 200);
  assert.equal(approved.data.request.credited_lessons, 3);
  assert.equal(qa.sql.prepare('SELECT balance FROM users WHERE id=?').get(student.id).balance, 3);
  assert.equal((await qa.request('payment-requests/' + submitted.data.request.id + '/approve', { credits: 3 }, teacher)).status, 409);
  assert.equal(qa.sql.prepare('SELECT balance FROM users WHERE id=?').get(student.id).balance, 3);

  const declined = await qa.request('payment-requests', { amount: 1000 }, cookie);
  assert.equal(declined.status, 201);
  assert.equal((await qa.request('payment-requests/' + declined.data.request.id + '/reject', { note: 'Перевод не найден' }, teacher)).status, 200);
  assert.equal(qa.sql.prepare('SELECT balance FROM users WHERE id=?').get(student.id).balance, 3);
  assert.equal((await qa.request('payment-requests/' + declined.data.request.id + '/approve', { credits: 1 }, teacher)).status, 409);
});

test('Удаление ученика работает через DELETE и удаляет его заявки и сессии', async () => {
  const qa = setup();
  const teacher = await qa.teacherSession();
  const { student, cookie } = await qa.createStudent(teacher);
  await qa.request('payment-link', { url: 'https://pay.example/universal' }, teacher);
  const request = await qa.request('payment-requests', { amount: 1000 }, cookie);
  assert.equal(request.status, 201);
  const removed = await qa.request('students/' + student.id, undefined, teacher, undefined, 'DELETE');
  assert.equal(removed.status, 200);
  assert.equal(qa.sql.prepare('SELECT COUNT(*) AS n FROM users WHERE id=?').get(student.id).n, 0);
  assert.equal(qa.sql.prepare('SELECT COUNT(*) AS n FROM sessions WHERE user_id=?').get(student.id).n, 0);
  assert.equal(qa.sql.prepare('SELECT COUNT(*) AS n FROM payment_requests WHERE student_id=?').get(student.id).n, 0);
  assert.equal((await qa.request('workspace', undefined, cookie)).status, 401);
});

test('API сохраняет условия задания в Markdown вместо HTML', async () => {
  const s = setup();
  const teacher = await s.teacherSession();
  const student = await s.createStudent(teacher);
  const saved = await s.request('assignments', {
    id: 'normalized-html-assignment', student_id: student.student.id, title: 'Условие из HTML', kind: 'text',
    prompt: '<p>Первая строка<br>Вторая строка с <strong>выделением</strong>.</p>',
  }, teacher);
  assert.equal(saved.status, 200);
  const assignment = s.sql.prepare('SELECT id,kind,prompt FROM assignments WHERE id=?').get('normalized-html-assignment');
  assert.equal(assignment.kind, 'text');
  assert.match(assignment.prompt, /Первая строка\\\nВторая строка с \*\*выделением\*\*/);
  assert.doesNotMatch(assignment.prompt, /<p>|<br|<strong>/);
});

test('Изображение задания выдаётся только ученику с доступом к заданию и его уроку', async () => {
  const s = setup();
  const teacher = await s.teacherSession();
  const owner = await s.createStudent(teacher);
  const stranger = await s.createStudent(teacher);
  Object.assign(s.modules['@/lib/runtime-env'].getRuntimeEnvironment(), {
    R2_ACCOUNT_ID: 'fixture-account', R2_ACCESS_KEY_ID: 'fixture-key',
    R2_SECRET_ACCESS_KEY: 'fixture-secret', R2_BUCKET_NAME: 'fixture-bucket',
  });
  const insertImage = (imageId, assignmentId, topicId, studentId, lessonId) => {
    s.sql.prepare('INSERT INTO assignments(id,topic_id,student_id,lesson_id,title,kind,prompt) VALUES (?,?,?,?,?,?,?)')
      .run(assignmentId, topicId, studentId, lessonId, 'Fixture', 'text', 'Prompt');
    s.sql.prepare('INSERT INTO assignment_images(id,assignment_id,object_key,content_type,size_bytes,original_name,created_at) VALUES (?,?,?,?,?,?,?)')
      .run(imageId, assignmentId, 'assignment-images/' + assignmentId + '/' + imageId + '.png', 'image/png', 8, 'fixture.png', new Date().toISOString());
  };
  insertImage('orphan-image', 'orphan-assignment', null, owner.student.id, null);
  s.sql.prepare('DELETE FROM assignments WHERE id=?').run('orphan-assignment');
  const reusedId = await s.request('assignments', { id: 'orphan-assignment', student_id: owner.student.id, title: 'Reused', kind: 'text', prompt: 'Prompt' }, teacher);
  assert.equal(reusedId.status, 409);
  const imageResponse = async (imageId, cookie) => s.modules.route.GET(new Request(origin + '/api/assignment-images/' + imageId, { headers: { Cookie: cookie } }));

  insertImage('personal-image', 'personal-assignment', null, owner.student.id, null);
  const marker = '![uploaded](codetogether-pending:11111111-1111-4111-8111-111111111111)';
  s.sql.prepare('UPDATE assignments SET prompt=? WHERE id=?').run('Prompt\n' + marker, 'personal-assignment');
  assert.equal((await imageResponse('personal-image', stranger.cookie)).status, 403);
  const personal = await imageResponse('personal-image', owner.cookie);
  assert.equal(personal.status, 200);
  assert.equal(personal.headers.get('content-type'), 'image/png');
  assert.equal(personal.headers.get('cache-control'), 'private, no-store');
  assert.deepEqual([...new Uint8Array(await personal.arrayBuffer())], [137,80,78,71,13,10,26,10]);

  s.sql.prepare("INSERT INTO courses(id,title,position) VALUES ('image-course','Image course',0)").run();
  s.sql.prepare("INSERT INTO topics(id,course_id,title,position,content,format) VALUES ('image-topic','image-course','Topic',0,'','md')").run();
  s.sql.prepare("INSERT INTO course_enrollments(id,course_id,student_id) VALUES ('image-enrollment','image-course',?)").run(owner.student.id);
  s.sql.prepare("INSERT INTO topic_access(id,topic_id,student_id) VALUES ('image-access','image-topic',?)").run(owner.student.id);
  insertImage('course-image', 'course-assignment', 'image-topic', null, null);
  assert.equal((await imageResponse('course-image', stranger.cookie)).status, 403);
  assert.equal((await imageResponse('course-image', owner.cookie)).status, 200);

  s.sql.prepare("INSERT INTO lessons(id,student_id,name,start,end,type,status) VALUES ('other-student-lesson',?,'Other','2026-11-12T10:00:00Z','2026-11-12T10:55:00Z','paid','scheduled')").run(stranger.student.id);
  insertImage('lesson-image', 'lesson-assignment', null, owner.student.id, 'other-student-lesson');
  assert.equal((await imageResponse('lesson-image', owner.cookie)).status, 403);
  assert.equal((await imageResponse('personal-image', teacher)).status, 200);

  const upload = async (cookie, type = 'image/png', bytes = Uint8Array.from([137,80,78,71,13,10,26,10])) => {
    const body = new FormData();
    body.append('file', new File([bytes], 'uploaded.png', { type }));
    body.append('placeholder', marker);
    return s.modules.route.POST(new Request(origin + '/api/assignments/personal-assignment/images', {
      method: 'POST', headers: { Origin: origin, Cookie: cookie }, body,
    }));
  };
  assert.equal((await upload(owner.cookie)).status, 403);
  assert.equal((await upload(teacher, 'image/svg+xml')).status, 415);
  assert.equal((await upload(teacher, 'image/png', new TextEncoder().encode('<svg/>'))).status, 415);
  const uploadedCountBeforeOversize = s.network.r2Uploads.length;
  assert.equal((await upload(teacher, 'image/png', new Uint8Array(8 * 1024 * 1024 + 1))).status, 413);
  assert.equal(s.network.r2Uploads.length, uploadedCountBeforeOversize);
  const uploaded = await upload(teacher);
  assert.equal(uploaded.status, 201);
  const uploadedMetadata = await uploaded.json();
  assert.match(uploadedMetadata.url, /^\/api\/assignment-images\//);
  assert.match(s.network.r2Uploads.at(-1).key, /^assignment-images\/personal-assignment\/[0-9a-f-]{36}\.png$/);
  assert.equal(s.network.r2Uploads.at(-1).size, 8);
  assert.equal(s.network.r2Uploads.at(-1).contentType, 'image/png');
  assert.equal(s.sql.prepare('SELECT prompt FROM assignments WHERE id=?').get('personal-assignment').prompt, 'Prompt\n![uploaded](' + uploadedMetadata.url + ')');
  assert.equal((await imageResponse(uploadedMetadata.id, owner.cookie)).status, 200);
  const uploadCountAfterSuccess = s.network.r2Uploads.length;
  s.sql.prepare('UPDATE assignments SET prompt=? WHERE id=?').run('Prompt\n' + marker, 'personal-assignment');
  const retry = await upload(teacher);
  assert.equal(retry.status, 200);
  assert.equal((await retry.json()).id, uploadedMetadata.id);
  assert.equal(s.network.r2Uploads.length, uploadCountAfterSuccess);
  assert.equal(s.sql.prepare('SELECT prompt FROM assignments WHERE id=?').get('personal-assignment').prompt, 'Prompt\n![uploaded](' + uploadedMetadata.url + ')');

  const failedMarker = '![failed](codetogether-pending:33333333-3333-4333-8333-333333333333)';
  s.sql.prepare('UPDATE assignments SET prompt=? WHERE id=?').run(failedMarker, 'personal-assignment');
  s.sql.exec("CREATE TRIGGER ignore_assignment_image_marker BEFORE UPDATE OF prompt ON assignments WHEN NEW.id='personal-assignment' BEGIN SELECT RAISE(IGNORE); END");
  s.network.beforeAssignmentImageMetadataDelete = () => {
    s.sql.exec('DROP TRIGGER ignore_assignment_image_marker');
    s.sql.prepare('UPDATE assignments SET prompt=? WHERE id=?').run('![uploaded](/api/assignment-images/33333333-3333-4333-8333-333333333333)', 'personal-assignment');
  };
  const failedUpload = await (async () => {
    const body = new FormData();
    body.append('file', new File([Uint8Array.from([137,80,78,71,13,10,26,10])], 'uploaded.png', { type: 'image/png' }));
    body.append('placeholder', failedMarker);
    return s.modules.route.POST(new Request(origin + '/api/assignments/personal-assignment/images', {
      method: 'POST', headers: { Origin: origin, Cookie: teacher }, body,
    }));
  })();
  assert.equal(failedUpload.status, 409);
  assert.equal(s.sql.prepare("SELECT COUNT(*) AS count FROM assignment_images WHERE assignment_id='personal-assignment'").get().count, 3);
  assert.equal(s.network.r2Deletes.includes(s.network.r2Uploads.at(-1).key), false);
  assert.equal((await imageResponse('33333333-3333-4333-8333-333333333333', owner.cookie)).status, 200);
  const retryBody = new FormData();
  retryBody.append('file', new File([Uint8Array.from([137,80,78,71,13,10,26,10])], 'uploaded.png', { type: 'image/png' }));
  retryBody.append('placeholder', failedMarker);
  const retryFailedUpload = await s.modules.route.POST(new Request(origin + '/api/assignments/personal-assignment/images', {
    method: 'POST', headers: { Origin: origin, Cookie: teacher }, body: retryBody,
  }));
  assert.equal(retryFailedUpload.status, 200);
  assert.equal((await retryFailedUpload.json()).id, '33333333-3333-4333-8333-333333333333');
  assert.equal(s.network.r2Uploads.length, uploadCountAfterSuccess + 1);
});
