import assert from 'node:assert/strict';
import { randomUUID, webcrypto } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { mkdtemp, rm } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const temporary = await mkdtemp(path.join(os.tmpdir(), 'codetogether-image-api-'));
const databasePath = path.join(temporary, 'api.sqlite');
const imageDirectory = path.join(temporary, 'private-images');
const portServer = net.createServer();
await new Promise(resolve => portServer.listen(0, '127.0.0.1', resolve));
const port = portServer.address().port;
await new Promise(resolve => portServer.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const ids = { teacher: `teacher-${randomUUID()}`, student: `student-${randomUUID()}`, outsider: `outsider-${randomUUID()}` };
const password = `Test-${randomUUID()}-Aa1`;
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
let server;
let serverOutput = '';

async function passwordHash(value) {
  const salt = randomUUID();
  const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(value), 'PBKDF2', false, ['deriveBits']);
  const bits = await webcrypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return `${salt}:${Buffer.from(bits).toString('hex')}`;
}

async function request(pathname, method = 'GET', body, cookie, expected = 200) {
  const response = await fetch(origin + pathname, {
    method,
    headers: { Origin: origin, ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(cookie ? { Cookie: cookie } : {}) },
    ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}),
  });
  assert.equal(response.status, expected, `${method} ${pathname}: ${await response.clone().text()}`);
  return response;
}

try {
  const migration = spawnSync(process.execPath, ['scripts/migrate-sqlite.mjs'], { encoding: 'utf8', env: { ...process.env, DATABASE_PATH: databasePath } });
  assert.equal(migration.status, 0, migration.stderr || migration.stdout);
  const database = new DatabaseSync(databasePath);
  try {
    const hash = await passwordHash(password);
    for (const role of ['teacher', 'student', 'outsider']) {
      const userId = ids[role];
      database.prepare('INSERT INTO users (id,login,password,name,role,balance,created_at) VALUES (?,?,?,?,?,0,?)').run(userId, userId, hash, role, role === 'teacher' ? 'teacher' : 'student', new Date().toISOString());
    }
  } finally {
    database.close();
  }

  server = spawn(process.execPath, ['dist/standalone/server.js'], {
    cwd: process.cwd(),
    env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), DATABASE_PATH: databasePath, ASSIGNMENT_IMAGE_DIRECTORY: imageDirectory },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.setEncoding('utf8').on('data', chunk => { serverOutput = (serverOutput + chunk).slice(-4000); });
  server.stderr.setEncoding('utf8').on('data', chunk => { serverOutput = (serverOutput + chunk).slice(-4000); });

  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) break;
    try {
      const health = await fetch(origin + '/api/health');
      if (health.ok) { ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, `Standalone server did not become ready. ${serverOutput}`);

  const login = async userId => {
    const response = await request('/api/login', 'POST', { login: userId, password });
    const cookie = response.headers.get('set-cookie')?.split(';')[0];
    assert.ok(cookie, 'Login did not issue a session cookie.');
    return cookie;
  };
  const teacherCookie = await login(ids.teacher);
  const studentCookie = await login(ids.student);
  const outsiderCookie = await login(ids.outsider);
  const assignmentId = `image-test-${randomUUID()}`;
  const imageId = randomUUID();
  const placeholder = `![diagram](codetogether-pending:${imageId})`;
  await request('/api/assignments', 'POST', { id: assignmentId, student_id: ids.student, title: 'Image test', kind: 'text', prompt: placeholder }, teacherCookie);

  const form = new FormData();
  form.append('file', new Blob([png], { type: 'image/png' }), 'diagram.png');
  form.append('placeholder', placeholder);
  const uploaded = await (await request(`/api/assignments/${assignmentId}/images`, 'POST', form, teacherCookie, 201)).json();
  assert.equal(uploaded.url, `/api/assignment-images/${imageId}`);

  const imageResponse = await request(uploaded.url, 'GET', undefined, studentCookie);
  assert.equal(imageResponse.headers.get('content-type'), 'image/png');
  assert.equal(imageResponse.headers.get('cache-control'), 'private, no-store');
  assert.deepEqual(new Uint8Array(await imageResponse.arrayBuffer()), png);
  await request(uploaded.url, 'GET', undefined, outsiderCookie, 403);

  const stored = new DatabaseSync(databasePath);
  try {
    const image = stored.prepare('SELECT storage_backend,object_key FROM assignment_images WHERE id=?').get(imageId);
    assert.equal(image.storage_backend, 'filesystem');
    assert.ok(image.object_key.includes('/' + assignmentId + '/'));
  } finally {
    stored.close();
  }
  console.log('Standalone image upload, private student read, and cross-student denial passed.');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await new Promise(resolve => server.once('exit', resolve));
  }
  await rm(temporary, { recursive: true, force: true });
}
