import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const host = process.env.QUMIR_COMPILER_HOST || '127.0.0.1';
const port = Number(process.env.QUMIR_COMPILER_PORT || 3101);
const compilerPath = process.env.QUMIRC_PATH || 'qumirc';
const sourceLimit = 100_000;
const wasmLimit = 4 * 1024 * 1024;
const compileTimeout = 6_000;
let active = false;

function respond(response, status, message, type = 'application/json; charset=utf-8') {
  const body = type.startsWith('application/json') ? Buffer.from(JSON.stringify({ error: message })) : Buffer.from(message);
  response.writeHead(status, { 'Content-Type': type, 'Content-Length': body.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  response.end(body);
}

async function readRequest(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 400_000) throw Object.assign(new Error('Исходный файл превышает 100 000 символов.'), { status: 413 });
    chunks.push(chunk);
  }
  let body;
  try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('Некорректный запрос компилятора.'), { status: 400 }); }
  if (typeof body.code !== 'string' || !body.code.length || body.code.length > sourceLimit) {
    throw Object.assign(new Error('Исходный файл должен содержать от 1 до 100 000 символов.'), { status: 400 });
  }
  return body.code;
}

function compile(source, outputFile, sourceFile, directory) {
  return new Promise((resolve, reject) => {
    const resourceLimit = process.platform === 'linux' && process.env.QUMIR_USE_PRLIMIT !== '0';
    const command = resourceLimit ? (process.env.PRLIMIT_PATH || 'prlimit') : compilerPath;
    const compilerArgs = ['--wasm', '-O0', '-o', outputFile, sourceFile];
    const args = resourceLimit ? ['--cpu=5', '--as=1073741824', '--fsize=4194304', '--nofile=64', '--', compilerPath, ...compilerArgs] : compilerArgs;
    const child = spawn(command, args, { cwd: directory, stdio: ['ignore', 'ignore', 'pipe'], env: { PATH: process.env.PATH || '', HOME: directory, LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8' } });
    let diagnostics = '';
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(diagnostics.trim());
    };
    child.stderr.on('data', chunk => { diagnostics = (diagnostics + chunk.toString()).slice(-20_000); });
    child.once('error', error => finish(Object.assign(new Error(error.code === 'ENOENT' ? 'Компилятор Кумир не установлен.' : 'Не удалось запустить компилятор Кумир.'), { status: 503 })));
    child.once('close', code => code === 0 ? finish() : finish(Object.assign(new Error(diagnostics.trim().slice(0, 4000) || 'Компиляция Кумир завершилась с ошибкой.'), { status: 422 })));
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish(Object.assign(new Error('Компиляция не уложилась в 6 секунд.'), { status: 408 }));
    }, compileTimeout);
  });
}

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/health') return respond(response, 200, 'ok', 'text/plain; charset=utf-8');
  if (request.method !== 'POST' || request.url !== '/compile') return respond(response, 404, 'Неизвестный адрес компилятора.');
  if (active) return respond(response, 429, 'Компилятор занят другой программой. Попробуй ещё раз через несколько секунд.');
  active = true;
  let directory;
  try {
    const source = await readRequest(request);
    directory = await mkdtemp(path.join(tmpdir(), 'codetogether-qumir-'));
    const sourceFile = path.join(directory, 'program.kum');
    const outputFile = path.join(directory, 'program.wasm');
    await writeFile(sourceFile, source, { encoding: 'utf8', mode: 0o600 });
    const diagnostic = await compile(source, outputFile, sourceFile, directory);
    const info = await stat(outputFile).catch(() => null);
    if (!info || info.size < 8 || info.size > wasmLimit) return respond(response, 422, 'Компилятор вернул пустую или слишком большую WASM-программу.');
    const wasm = await readFile(outputFile);
    response.writeHead(200, { 'Content-Type': 'application/wasm', 'Content-Length': wasm.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...(diagnostic ? { 'X-Qumir-Warning': encodeURIComponent(diagnostic.slice(0, 500)) } : {}) });
    response.end(wasm);
  } catch (error) {
    const status = Number(error?.status) || 500;
    if (status === 500) console.error('Qumir compiler service failed:', error instanceof Error ? error.message : 'unknown error');
    respond(response, status, error instanceof Error ? error.message : 'Ошибка компиляции.');
  } finally {
    active = false;
    if (directory) await rm(directory, { recursive: true, force: true });
  }
});

server.listen(port, host, () => console.log(`Qumir compiler listening on ${host}:${port}`));
