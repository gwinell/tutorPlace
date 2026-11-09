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
  ['@/lib/server', 'lib/server.ts'],
  ['@/lib/collaboration', 'lib/collaboration.ts'],
  ['@/lib/trial-booking', 'lib/trial-booking.ts'],
  ['@/lib/lesson-move', 'lib/lesson-move.ts'],
  ['@/lib/salutejazz', 'lib/salutejazz.ts'],
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
        run: () => ({ meta: { changes: statement.run(...args).changes } }),
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
  const network = { lostResponse: false, unavailableAfterPatch: false, unavailable: false, skipPatch: false };
  const calendarFetch = async (url, options) => {
    const path = new URL(url).pathname;
    if (path === '/token') return Response.json({ access_token: 'fixture', expires_in: 3600 });
    if (path.endsWith('/freeBusy')) {
      return Response.json({ calendars: { 'fixture-calendar': { busy: [] } } });
    }
    if (path.endsWith('/events') && options.method === 'GET') return Response.json({ items: [...events.values()] });
    if (path.endsWith('/events') && options.method === 'POST') {
      const event = { ...JSON.parse(options.body), etag: '"' + ++etag + '"' };
      events.set(event.id, event);
      return Response.json(event);
    }

    const eventId = path.split('/').at(-1);
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
    '@/lib/sqlite-db': { getSqliteDatabase: () => { throw new Error('SQLite fallback is not used by booking fixtures'); } },
    '@/lib/salutejazz': {
      saluteJazzConfigured: () => false,
      createSaluteJazzRoom: async () => { throw new Error('SaluteJazz is disabled in booking tests'); },
      disableSaluteJazzRoom: async () => {},
    },
  };
  for (const [name, source] of sources) {
    const loaded = { exports: {} };
    runInNewContext(source, {
      module: loaded, exports: loaded.exports,
      require: path => modules[path.startsWith('./') ? '@/lib/' + path.slice(2) : path] ?? require(path),
      Response, Request, URL, URLSearchParams, Intl, TextEncoder, TextDecoder, AbortSignal, crypto,
      fetch: calendarFetch, console: { error() {} }, btoa, atob,
    });
    modules[name] = loaded.exports;
  }

  async function request(path, body, cookie, ip = '192.0.2.1') {
    const send = body === undefined ? modules.route.GET : modules.route.POST;
    const response = await send(new Request(origin + '/api/' + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json', 'cf-connecting-ip': ip, ...(cookie ? { Cookie: cookie } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    }));
    return { status: response.status, data: await response.json() };
  }

  async function teacherSession() {
    sql.prepare("INSERT INTO users(id,login,password,name,role,created_at) VALUES ('teacher','teacher','fixture','QA','teacher',?)").run(new Date().toISOString());
    const token = 'fixture-token';
    const digest = await modules['@/lib/server'].hash(token);
    sql.prepare("INSERT INTO sessions(id,user_id,expires_at) VALUES (?,'teacher',?)").run(digest, Date.now() + 60000);
    return 'ct-session=' + token;
  }

  const book = (phone, hour, ip) => request('book', {
    name: 'Synthetic QA', phone, start: at(hour), minutes: 45, consent: true,
  }, undefined, ip);
  const lesson = id => sql.prepare('SELECT * FROM lessons WHERE id=?').get(id);
  const locks = id => sql.prepare('SELECT COUNT(*) AS n FROM slot_locks WHERE lesson_id=?').get(id).n;
  return { sql, request, teacherSession, book, lesson, locks, events, network, at, date, modules };
}

test('parseSdkKey принимает Base64 SDK key и отклоняет повреждённые данные', () => {
  const sdkKey = { projectId: 'project-id', key: { kid: 'key-id', crv: 'P-384', d: 'private' } };
  const encoded = Buffer.from(JSON.stringify(sdkKey)).toString('base64');
  assert.deepEqual(JSON.parse(JSON.stringify(setup().modules['@/lib/salutejazz'].parseSdkKey(encoded))), sdkKey);
  assert.throws(() => setup().modules['@/lib/salutejazz'].parseSdkKey('not a key'), /SDK key is invalid/);
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
  runInNewContext(sources.find(([name]) => name === '@/lib/salutejazz')[1], {
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
