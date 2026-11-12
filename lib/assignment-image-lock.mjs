import { mkdir, readFile, rename, rm, stat, utimes, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const LOCK_TIMEOUT_MS = 120_000;
const STALE_LOCK_MS = 5 * 60_000;

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code !== 'ESRCH';
  }
}

async function removeStaleLock(lockPath, staleBefore) {
  let lockStat;
  try {
    lockStat = await stat(lockPath);
  } catch (error) {
    if (error?.code === 'ENOENT') return true;
    throw error;
  }
  if (!lockStat.isDirectory() || lockStat.mtimeMs >= staleBefore) return false;

  let owner = '';
  try { owner = await readFile(path.join(lockPath, 'owner'), 'utf8'); } catch {}
  const pid = Number(owner.split('\n')[0]);
  if (processIsAlive(pid)) return false;

  const stalePath = `${lockPath}.stale-${randomUUID()}`;
  try {
    await rename(lockPath, stalePath);
    await rm(stalePath, { recursive: true, force: true });
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return true;
    if (error?.code === 'EEXIST') return false;
    throw error;
  }
}

/** Serialize server image writes/deletes with a database+filesystem backup snapshot. */
export async function withAssignmentImageStorageLock(root, action, options = {}) {
  const absoluteRoot = path.resolve(root);
  const lockPath = `${absoluteRoot}.lock`;
  const timeoutMs = options.timeoutMs ?? LOCK_TIMEOUT_MS;
  const staleAfterMs = options.staleAfterMs ?? STALE_LOCK_MS;
  const token = randomUUID();
  const ownerPath = path.join(lockPath, 'owner');
  const started = Date.now();

  await mkdir(path.dirname(lockPath), { recursive: true, mode: 0o700 });
  while (true) {
    try {
      await mkdir(lockPath, { mode: 0o700 });
      await writeFile(ownerPath, `${process.pid}\n${token}\n${Date.now()}\n`, { flag: 'wx', mode: 0o600 });
      break;
    } catch (error) {
      if (error?.code !== 'EEXIST') {
        await rm(lockPath, { recursive: true, force: true }).catch(() => undefined);
        throw error;
      }
      const recovered = await removeStaleLock(lockPath, Date.now() - staleAfterMs);
      if (recovered) continue;
      if (Date.now() - started >= timeoutMs) throw new Error('Timed out waiting for assignment image storage lock.');
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  const heartbeat = setInterval(() => {
    const now = new Date();
    void utimes(lockPath, now, now).catch(() => undefined);
  }, 30_000);
  heartbeat.unref?.();
  try {
    return await action();
  } finally {
    clearInterval(heartbeat);
    let owner = '';
    try { owner = await readFile(ownerPath, 'utf8'); } catch {}
    if (owner.split('\n')[1] === token) await rm(lockPath, { recursive: true, force: true });
  }
}
