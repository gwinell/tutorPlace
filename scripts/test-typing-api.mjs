// End-to-end typing-history checks against a disposable standalone SQLite app.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { spawn, spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { webcrypto, randomUUID } from 'node:crypto';

const directory = mkdtempSync(path.join(os.tmpdir(), 'codetogether-typing-api-'));
const databasePath = path.join(directory, 'test.sqlite');
const port = 18000 + Math.floor(Math.random() * 20000);
const compilerPort = port === 38000 ? 38001 : port + 1;
const origin = `http://127.0.0.1:${port}`;
const compilerOrigin = `http://127.0.0.1:${compilerPort}`;
const password = 'typing-api-test-pass';
const identities = [
  { id: 'typing-teacher', login: 'typing-teacher', name: 'Teacher', role: 'teacher' },
  { id: 'typing-student', login: 'typing-student', name: 'Student', role: 'student' },
  { id: 'typing-other', login: 'typing-other', name: 'Other', role: 'student' },
];
let server;
let compiler;

async function storedPassword(value) {
  const salt = randomUUID();
  const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(value), 'PBKDF2', false, ['deriveBits']);
  const bits = await webcrypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return `${salt}:${Buffer.from(bits).toString('hex')}`;
}

async function request(pathname, method = 'GET', body, cookie, status = 200) {
  const response = await fetch(`${origin}/api/${pathname}`, {
    method,
    headers: { Origin: origin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  assert.equal(response.status, status, `${method} ${pathname}: ${JSON.stringify(data)}`);
  return { data, cookie: response.headers.get('set-cookie')?.split(';')[0] };
}

async function compileDemo(code, ip) {
  return fetch(`${origin}/api/demo/compile-kumir`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json', 'cf-connecting-ip': ip },
    body: JSON.stringify({ code }),
  });
}

try {
  const migration = spawnSync(process.execPath, ['scripts/migrate-sqlite.mjs'], { cwd: process.cwd(), encoding: 'utf8', env: { ...process.env, DATABASE_PATH: databasePath } });
  assert.equal(migration.status, 0, migration.stderr || migration.stdout);
  const database = new DatabaseSync(databasePath);
  const statement = database.prepare('INSERT INTO users (id,login,password,name,role,balance,created_at) VALUES (?,?,?,?,?,0,?)');
  for (const identity of identities) statement.run(identity.id, identity.login, await storedPassword(password), identity.name, identity.role, new Date().toISOString());
  database.close();

  const fakeCompiler = path.join(directory, 'fake-qumirc');
  writeFileSync(fakeCompiler, `#!/usr/bin/env node
const fs=require('node:fs');
const args=process.argv.slice(2);
const output=args[args.indexOf('-o')+1];
const source=fs.readFileSync(args.at(-1),'utf8');
if(source.includes('COMPILER_ERROR')){process.stderr.write('Тестовая ошибка синтаксиса Кумир.');process.exit(1);}
const symbol=[['использовать Черепаха','turtle_forward'],['использовать Робот','robot_paint'],['использовать Чертежник','drawer_move_to'],['использовать Рисователь','painter_rect']].find(([directive])=>source.includes(directive))?.[1];
const encodeLength=value=>{const bytes=[];do{let byte=value&127;value>>>=7;if(value)byte|=128;bytes.push(byte);}while(value);return bytes;};
const encodeString=value=>{const bytes=Buffer.from(value);return [...encodeLength(bytes.length),...bytes];};
const section=(id,payload)=>[id,...encodeLength(payload.length),...payload];
const bytes=[0,97,115,109,1,0,0,0];
if(symbol)bytes.push(...section(1,[1,0x60,0,0]),...section(2,[1,...encodeString('env'),...encodeString(symbol),0,0]));
fs.writeFileSync(output,Buffer.from(bytes));
`, { mode: 0o700 });
  chmodSync(fakeCompiler, 0o700);
  compiler = spawn(process.execPath, ['scripts/qumir-compiler-service.mjs'], { cwd: process.cwd(), env: { ...process.env, QUMIR_COMPILER_HOST: '127.0.0.1', QUMIR_COMPILER_PORT: String(compilerPort), QUMIRC_PATH: fakeCompiler, QUMIR_USE_PRLIMIT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let compilerReady = false;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (compiler.exitCode !== null) throw new Error('Compiler service exited before startup.');
    try { const response = await fetch(`${compilerOrigin}/health`); if (response.ok) { compilerReady = true; break; } } catch {}
    await wait(100);
  }
  assert.ok(compilerReady, 'Compiler service did not start.');

  server = spawn(process.execPath, ['dist/standalone/server.js'], { cwd: process.cwd(), env: { ...process.env, DATABASE_PATH: databasePath, PORT: String(port), HOST: '127.0.0.1', NODE_ENV: 'production', QUMIR_COMPILER_URL: compilerOrigin }, stdio: ['ignore', 'pipe', 'pipe'] });
  let serverOutput = '';
  server.stdout.on('data', chunk => { serverOutput += chunk; });
  server.stderr.on('data', chunk => { serverOutput += chunk; });
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Standalone server exited early: ${serverOutput}`);
    try { await fetch(origin); ready = true; break; } catch { await wait(100); }
  }
  assert.ok(ready, `Standalone server did not start: ${serverOutput}`);

  const teacher = (await request('login', 'POST', { login: identities[0].login, password })).cookie;
  const student = (await request('login', 'POST', { login: identities[1].login, password })).cookie;
  const other = (await request('login', 'POST', { login: identities[2].login, password })).cookie;
  const room = (await request('rooms', 'POST', {}, student, 201)).data.room;
  const kumirRoom = (await request(`rooms/${room.id}`, 'POST', { language: 'kumir' }, student)).data.room;
  assert.equal(kumirRoom.language, 'kumir');
  assert.match(kumirRoom.student_code, /использовать Черепаха/);
  assert.match(kumirRoom.teacher_code, /использовать Робот/);
  const endpoint = `rooms/${room.id}/typing-results`;
  const compiled = await fetch(`${origin}/api/rooms/${room.id}/compile-kumir`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', Cookie: student }, body: JSON.stringify({ code: 'алг main\nнач\nкон' }) });
  assert.equal(compiled.status, 200);
  assert.equal(compiled.headers.get('content-type'), 'application/wasm');
  assert.deepEqual([...new Uint8Array(await compiled.arrayBuffer())], [0, 97, 115, 109, 1, 0, 0, 0]);
  const painterSource = 'использовать Рисователь\nалг\nнач\n    новый лист(600, 200, белый)\n    кисть(HSL(0, 100, 50))\n    прямоугольник(0, 0, 6, 200)\nкон\n';
  const painterResponse = await fetch(`${origin}/api/rooms/${room.id}/compile-kumir`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', Cookie: student }, body: JSON.stringify({ code: painterSource }) });
  assert.equal(painterResponse.status, 200);
  const painterModule = await WebAssembly.compile(await painterResponse.arrayBuffer());
  assert.ok(WebAssembly.Module.imports(painterModule).some(item => item.module === 'env' && item.name.startsWith('painter_')));
  const compileForbidden = await fetch(`${origin}/api/rooms/${room.id}/compile-kumir`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', Cookie: other }, body: JSON.stringify({ code: 'алг main' }) });
  assert.equal(compileForbidden.status, 404);
  const compileUnauthenticated = await fetch(`${origin}/api/rooms/${room.id}/compile-kumir`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ code: 'алг main' }) });
  assert.equal(compileUnauthenticated.status, 401);
  const compileOversized = await fetch(`${origin}/api/rooms/${room.id}/compile-kumir`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', Cookie: student }, body: JSON.stringify({ code: 'x'.repeat(100001) }) });
  assert.equal(compileOversized.status, 400);

  const emptyDemo = await compileDemo('   ', '203.0.113.20');
  assert.equal(emptyDemo.status, 400);
  const oversizedDemo = await compileDemo('x'.repeat(100001), '203.0.113.20');
  assert.equal(oversizedDemo.status, 400);
  const syntaxErrorDemo = await compileDemo('COMPILER_ERROR', '198.51.100.12');
  assert.equal(syntaxErrorDemo.status, 422);
  assert.match((await syntaxErrorDemo.json()).error, /ошибка синтаксиса Кумир/i);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const demoCompiled = await compileDemo('алг main\nнач\nкон', '203.0.113.20');
    assert.equal(demoCompiled.status, 200, `Demo compile #${attempt + 1}: ${await demoCompiled.text()}`);
    assert.equal(demoCompiled.headers.get('content-type'), 'application/wasm');
  }
  const demoLimited = await compileDemo('алг main\nнач\nкон', '203.0.113.20');
  assert.equal(demoLimited.status, 429);
  assert.equal(demoLimited.headers.get('retry-after'), '60');
  assert.match((await demoLimited.json()).error, /5 программ в минуту/);

  await request(endpoint, 'POST', { language: 'ru', exerciseId: 'ru-first-steps', wpm: 42, accuracy: 98.5, durationMs: 45000 }, student, 201);
  assert.equal((await request(endpoint, 'GET', undefined, student)).data.results.length, 1);
  assert.equal((await request(endpoint, 'GET', undefined, teacher)).data.results.length, 1);
  await request(endpoint, 'GET', undefined, other, 404);
  await request(endpoint, 'POST', { language: 'en', exerciseId: 'en-first-steps', wpm: 40, accuracy: 99, durationMs: 45000 }, teacher, 403);
  await request(endpoint, 'POST', { language: 'ru', exerciseId: '../invalid', wpm: 42, accuracy: 98, durationMs: 45000 }, student, 400);
  await request(endpoint, 'POST', { language: 'ru', exerciseId: 'ru-first-steps', wpm: 42, accuracy: 101, durationMs: 45000 }, student, 400);

  for (let attempt = 0; attempt < 31; attempt += 1) {
    await request(endpoint, 'POST', { language: 'ru', exerciseId: 'ru-loops', wpm: 20 + attempt, accuracy: 90, durationMs: 30000 }, student, 201);
    await request(endpoint, 'POST', { language: 'en', exerciseId: 'en-loops', wpm: 25 + attempt, accuracy: 91, durationMs: 30000 }, student, 201);
  }
  const results = (await request(endpoint, 'GET', undefined, teacher)).data.results;
  assert.equal(results.filter(result => result.language === 'ru').length, 30);
  assert.equal(results.filter(result => result.language === 'en').length, 30);
  assert.equal(JSON.stringify(results).includes('typed'), false);
  console.log('Typing API integration checks passed: student/tutor access, validation, privacy, and 30-result retention per language.');
} finally {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await new Promise(resolve => server.once('exit', resolve));
  }
  if (compiler && compiler.exitCode === null) {
    compiler.kill('SIGTERM');
    await new Promise(resolve => compiler.once('exit', resolve));
  }
  rmSync(directory, { recursive: true, force: true });
}
