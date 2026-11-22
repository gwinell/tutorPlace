import { constants } from 'node:fs';
import { chmod, lstat, mkdir, open, readdir, realpath, rmdir, unlink } from 'node:fs/promises';
import path from 'node:path';

const objectKeyPattern = /^assignment-images\/[A-Za-z0-9_-]{1,100}\/[0-9a-f-]{36}\.(?:jpg|png|gif|webp)$/i;

function safeTarget(root: string, objectKey: string) {
  if (!objectKeyPattern.test(objectKey)) throw new Error('Invalid assignment image key.');
  const absoluteRoot = path.resolve(root);
  const target = path.resolve(absoluteRoot, objectKey.slice('assignment-images/'.length));
  if (!target.startsWith(absoluteRoot + path.sep)) throw new Error('Invalid assignment image path.');
  return { absoluteRoot, target };
}

async function secureParent(absoluteRoot: string, target: string, create: boolean) {
  if (create) await mkdir(absoluteRoot, { recursive: true, mode: 0o700 });
  let realRoot: string;
  try {
    realRoot = await realpath(absoluteRoot);
  } catch (error) {
    if (!create && (error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
  await chmod(realRoot, 0o700);
  const parent = path.dirname(target);
  if (create) await mkdir(parent, { recursive: true, mode: 0o700 });
  let realParent: string;
  try {
    realParent = await realpath(parent);
  } catch (error) {
    if (!create && (error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
  const relativeParent = path.relative(absoluteRoot, parent);
  const expectedParent = path.resolve(realRoot, relativeParent);
  if (realParent !== expectedParent || !realParent.startsWith(realRoot + path.sep)) throw new Error('Invalid assignment image directory.');
  await chmod(realParent, 0o700);
  return realParent;
}

export async function writeAssignmentImageFile(root: string, objectKey: string, bytes: Uint8Array) {
  const { absoluteRoot, target } = safeTarget(root, objectKey);
  const parent = await secureParent(absoluteRoot, target, true);
  if (!parent) throw new Error('Assignment image directory is unavailable.');
  const handle = await open(target, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW || 0), 0o600);
  try {
    await handle.writeFile(bytes);
    await handle.sync();
  } catch (error) {
    await handle.close();
    await unlink(target).catch(() => undefined);
    throw error;
  }
  await handle.close();
  const directoryHandle = await open(parent, constants.O_RDONLY | (constants.O_DIRECTORY || 0));
  try {
    await directoryHandle.sync();
  } finally {
    await directoryHandle.close();
  }
}

export async function readAssignmentImageFile(root: string, objectKey: string) {
  const { absoluteRoot, target } = safeTarget(root, objectKey);
  const parent = await secureParent(absoluteRoot, target, false);
  if (!parent) return null;
  try {
    const handle = await open(target, constants.O_RDONLY | (constants.O_NOFOLLOW || 0));
    try {
      const stat = await handle.stat();
      if (!stat.isFile()) throw new Error('Assignment image is not a regular file.');
      return new Uint8Array(await handle.readFile());
    } finally {
      await handle.close();
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

export async function deleteAssignmentImageFile(root: string, objectKey: string) {
  const { absoluteRoot, target } = safeTarget(root, objectKey);
  const parent = await secureParent(absoluteRoot, target, false);
  if (!parent) return;
  try {
    await unlink(target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  await rmdir(parent).catch(error => {
    if (!['ENOENT', 'ENOTEMPTY', 'EEXIST'].includes((error as NodeJS.ErrnoException).code || '')) throw error;
  });
}

/** Remove files left between a successful filesystem write and its SQLite metadata commit. */
export async function removeUntrackedAssignmentImageFiles(
  root: string,
  isTracked: (objectKey: string) => Promise<boolean>,
  options: { olderThan?: number; limit?: number } = {},
) {
  let realRoot: string;
  try {
    realRoot = await realpath(path.resolve(root));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return 0;
    throw error;
  }
  const olderThan = options.olderThan ?? Date.now() - 24 * 60 * 60 * 1000;
  const limit = Math.max(1, options.limit ?? 100);
  const directories = await readdir(realRoot, { withFileTypes: true });
  let removed = 0;
  for (const directory of directories) {
    if (!directory.isDirectory() || !/^[A-Za-z0-9_-]{1,100}$/.test(directory.name)) continue;
    const directoryPath = path.join(realRoot, directory.name);
    const files = await readdir(directoryPath, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !/^[0-9a-f-]{36}\.(?:jpg|png|gif|webp)$/i.test(file.name)) continue;
      const objectKey = `assignment-images/${directory.name}/${file.name}`;
      if (!objectKeyPattern.test(objectKey)) continue;
      const filePath = path.join(directoryPath, file.name);
      const fileStat = await lstat(filePath);
      if (!fileStat.isFile() || fileStat.isSymbolicLink() || fileStat.mtimeMs >= olderThan) continue;
      if (await isTracked(objectKey)) continue;
      await unlink(filePath).catch(error => {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      });
      await rmdir(directoryPath).catch(error => {
        if (!['ENOENT', 'ENOTEMPTY', 'EEXIST'].includes((error as NodeJS.ErrnoException).code || '')) throw error;
      });
      removed++;
      if (removed >= limit) return removed;
    }
  }
  return removed;
}
