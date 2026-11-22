import type { db } from './server';

export const MAX_ASSIGNMENT_IMAGE_BYTES = 8 * 1024 * 1024;

export const ASSIGNMENT_IMAGE_TYPES = {
  "image/jpeg": { extension: "jpg", signature: (bytes: Uint8Array) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  "image/png": { extension: "png", signature: (bytes: Uint8Array) => bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a },
  "image/gif": { extension: "gif", signature: (bytes: Uint8Array) => bytes.length >= 6 && (ascii(bytes.slice(0, 6)) === "GIF87a" || ascii(bytes.slice(0, 6)) === "GIF89a") },
  "image/webp": { extension: "webp", signature: (bytes: Uint8Array) => bytes.length >= 12 && ascii(bytes.slice(0, 4)) === "RIFF" && ascii(bytes.slice(8, 12)) === "WEBP" },
} as const;

export type AssignmentImageContentType = keyof typeof ASSIGNMENT_IMAGE_TYPES;
export type R2S3Config = { accountId: string; accessKeyId: string; secretAccessKey: string; bucketName: string };
export type AssignmentImageStorageBackend = 'filesystem' | 'r2';
export type AssignmentImageAccess = { role: string; targetBelongsToUser: boolean; lessonBelongsToUser: boolean };

export function canReadAssignmentImage(access: AssignmentImageAccess) {
  return access.targetBelongsToUser && access.lessonBelongsToUser;
}

export class AssignmentImageStorageError extends Error {
  public status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = "AssignmentImageStorageError";
  }
}

export class R2StorageError extends AssignmentImageStorageError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = 'R2StorageError';
  }
}

function ascii(bytes: Uint8Array) {
  return String.fromCharCode(...bytes);
}

export function validateAssignmentImage(bytes: Uint8Array, contentType: string): contentType is AssignmentImageContentType {
  if (bytes.length < 1 || bytes.length > MAX_ASSIGNMENT_IMAGE_BYTES) return false;
  const entry = ASSIGNMENT_IMAGE_TYPES[contentType as AssignmentImageContentType];
  return Boolean(entry?.signature(bytes));
}

export function assignmentImageExtension(contentType: AssignmentImageContentType) {
  return ASSIGNMENT_IMAGE_TYPES[contentType].extension;
}

export function sanitizeAssignmentImageName(fileName: string) {
  const safeName = Array.from(fileName, character => {
    const code = character.charCodeAt(0);
    return character === '/' || character === '\\' || code < 0x20 || code === 0x7f ? '_' : character;
  }).join('').slice(0, 180);
  return safeName || 'image';
}

export function pendingAssignmentImageId(placeholder: string) {
  const marker = /^!\[([^\]\r\n]{0,180})\]\(codetogether-pending:([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\)$/i.exec(placeholder);
  return marker ? { id: marker[2], alt: marker[1] } : null;
}

export function replacePendingAssignmentImage(prompt: string, placeholder: string, imageId: string) {
  const marker = pendingAssignmentImageId(placeholder);
  if (!marker || marker.id !== imageId || prompt.indexOf(placeholder) < 0 || prompt.indexOf(placeholder) !== prompt.lastIndexOf(placeholder)) return null;
  const alt = marker.alt.replace(/[\[\]\\()\r\n]/g, '').slice(0, 120).trim() || 'Изображение';
  const nextPrompt = prompt.replace(placeholder, `![${alt}](/api/assignment-images/${imageId})`);
  return nextPrompt.length <= 20000 ? nextPrompt : null;
}

export function r2S3Config(environment: Record<string, unknown>): R2S3Config | null {
  const accountId = stringValue(environment.R2_ACCOUNT_ID);
  const accessKeyId = stringValue(environment.R2_ACCESS_KEY_ID);
  const secretAccessKey = stringValue(environment.R2_SECRET_ACCESS_KEY);
  const bucketName = stringValue(environment.R2_BUCKET_NAME);
  if (!accountId && !accessKeyId && !secretAccessKey && !bucketName) return null;
  if (!/^[a-f0-9]{32}$/i.test(accountId) || !accessKeyId || !secretAccessKey || !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucketName)) {
    throw new R2StorageError("Cloudflare R2 is not configured correctly.");
  }
  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

export function assignmentImageDirectory(environment: Record<string, unknown>) {
  return stringValue(environment.ASSIGNMENT_IMAGE_DIRECTORY);
}

export function assignmentImageStorageBackend(environment: Record<string, unknown>): AssignmentImageStorageBackend | null {
  return assignmentImageDirectory(environment) ? 'filesystem' : null;
}

async function withAssignmentImageStorageLock<T>(environment: Record<string, unknown>, action: () => Promise<T>) {
  const directory = assignmentImageDirectory(environment);
  if (!directory) return action();
  const lock = await import('./assignment-image-lock.mjs');
  return lock.withAssignmentImageStorageLock(directory, action);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function hex(bytes: Uint8Array) {
  return Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
}

function arrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

async function sha256(value: string | Uint8Array) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", arrayBuffer(bytes))));
}

async function hmac(key: Uint8Array | string, value: string) {
  const rawKey = typeof key === "string" ? new TextEncoder().encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey("raw", arrayBuffer(rawKey), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(value)));
}

function amzTimestamp(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function encodePath(path: string) {
  return path.split("/").map(part => encodeURIComponent(part).replace(/[!'()*]/g, value => `%${value.charCodeAt(0).toString(16).toUpperCase()}`)).join("/");
}

async function signedR2Request(method: "PUT" | "GET" | "DELETE", key: string, config: R2S3Config, options: { body?: Uint8Array; contentType?: string; fetchImpl?: typeof fetch; date?: Date } = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const date = options.date || new Date();
  const timestamp = amzTimestamp(date);
  const shortDate = timestamp.slice(0, 8);
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${encodePath(config.bucketName)}/${encodePath(key)}`;
  const payloadHash = await sha256(options.body || new Uint8Array());
  const headersToSign: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": timestamp,
  };
  if (options.contentType) headersToSign["content-type"] = options.contentType;
  const signedHeaderNames = Object.keys(headersToSign).sort();
  const canonicalHeaders = signedHeaderNames.map(name => `${name}:${headersToSign[name].trim().replace(/\s+/g, " ")}`).join("\n") + "\n";
  const signedHeaders = signedHeaderNames.join(";");
  const canonicalRequest = [method, canonicalUri, "", canonicalHeaders + signedHeaders, payloadHash].join("\n");
  const scope = `${shortDate}/auto/s3/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${timestamp}\n${scope}\n${await sha256(canonicalRequest)}`;
  const dateKey = await hmac(`AWS4${config.secretAccessKey}`, shortDate);
  const regionKey = await hmac(dateKey, "auto");
  const serviceKey = await hmac(regionKey, "s3");
  const signingKey = await hmac(serviceKey, "aws4_request");
  const signature = hex(await hmac(signingKey, stringToSign));
  const url = `https://${host}${canonicalUri}`;
  const headers = new Headers({
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": timestamp,
    Authorization: `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  });
  if (options.contentType) headers.set("Content-Type", options.contentType);
  let response: Response;
  try {
    response = await fetchImpl(url, {
      method,
      headers,
      ...(options.body ? { body: arrayBuffer(options.body) } : {}),
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new R2StorageError("Cloudflare R2 could not be reached.");
  }
  if (!response.ok) throw new R2StorageError("Cloudflare R2 rejected the image request.", response.status);
  return response;
}

export async function putR2Object(key: string, body: Uint8Array, contentType: AssignmentImageContentType, config: R2S3Config, fetchImpl?: typeof fetch) {
  await signedR2Request("PUT", key, config, { body, contentType, fetchImpl });
}

export async function getR2Object(key: string, config: R2S3Config, fetchImpl?: typeof fetch) {
  const response = await signedR2Request("GET", key, config, { fetchImpl });
  return new Uint8Array(await response.arrayBuffer());
}

export async function deleteR2Object(key: string, config: R2S3Config, fetchImpl?: typeof fetch) {
  try {
    await signedR2Request("DELETE", key, config, { fetchImpl });
  } catch (error) {
    if (error instanceof R2StorageError && error.status === 404) return;
    throw error;
  }
}

export async function putAssignmentImageObject(key: string, body: Uint8Array, contentType: AssignmentImageContentType, backend: AssignmentImageStorageBackend, environment: Record<string, unknown>, fetchImpl?: typeof fetch) {
  if (backend === 'r2') {
    const config = r2S3Config(environment);
    if (!config) throw new AssignmentImageStorageError('Assignment image storage is not configured.');
    return withAssignmentImageStorageLock(environment, () => putR2Object(key, body, contentType, config, fetchImpl));
  }
  const directory = assignmentImageDirectory(environment);
  if (!directory) throw new AssignmentImageStorageError('Assignment image directory is not configured.');
  try {
    const [storage, lock] = await Promise.all([import('./assignment-image-filesystem.ts'), import('./assignment-image-lock.mjs')]);
    await lock.withAssignmentImageStorageLock(directory, () => storage.writeAssignmentImageFile(directory, key, body));
  } catch {
    throw new AssignmentImageStorageError('Assignment image could not be written to the server.');
  }
}

export async function getAssignmentImageObject(key: string, backend: AssignmentImageStorageBackend, environment: Record<string, unknown>, fetchImpl?: typeof fetch) {
  if (backend === 'r2') {
    const config = r2S3Config(environment);
    if (!config) throw new AssignmentImageStorageError('Assignment image storage is not configured.');
    return getR2Object(key, config, fetchImpl);
  }
  const directory = assignmentImageDirectory(environment);
  if (!directory) throw new AssignmentImageStorageError('Assignment image directory is not configured.');
  try {
    const storage = await import('./assignment-image-filesystem.ts');
    const bytes = await storage.readAssignmentImageFile(directory, key);
    if (!bytes) throw new AssignmentImageStorageError('Assignment image was not found.', 404);
    return bytes;
  } catch (error) {
    if (error instanceof AssignmentImageStorageError) throw error;
    throw new AssignmentImageStorageError('Assignment image could not be read from the server.');
  }
}

export async function deleteAssignmentImageObject(key: string, backend: AssignmentImageStorageBackend, environment: Record<string, unknown>, fetchImpl?: typeof fetch) {
  if (backend === 'r2') {
    const config = r2S3Config(environment);
    if (!config) throw new AssignmentImageStorageError('Assignment image storage is not configured.');
    return withAssignmentImageStorageLock(environment, () => deleteR2Object(key, config, fetchImpl));
  }
  const directory = assignmentImageDirectory(environment);
  if (!directory) throw new AssignmentImageStorageError('Assignment image directory is not configured.');
  try {
    const [storage, lock] = await Promise.all([import('./assignment-image-filesystem.ts'), import('./assignment-image-lock.mjs')]);
    await lock.withAssignmentImageStorageLock(directory, () => storage.deleteAssignmentImageFile(directory, key));
  } catch {
    throw new AssignmentImageStorageError('Assignment image could not be deleted from the server.');
  }
}

type OrphanedAssignmentImage = { id: string; object_key: string; storage_backend?: string };
type QueuedAssignmentImageDelete = { key: string; value: string };
type QueuedImageValue = { object_key?: unknown; storage_backend?: unknown };
export const PERSONAL_ASSIGNMENT_REVIEWED_RETENTION_DAYS = 7;
export const PERSONAL_ASSIGNMENT_UNREVIEWED_RETENTION_DAYS = 14;

function storedBackend(value: unknown): AssignmentImageStorageBackend {
  return value === 'r2' ? 'r2' : 'filesystem';
}

function validObjectKey(value: string) {
  return /^assignment-images\/[A-Za-z0-9_-]{1,100}\/[0-9a-f-]{36}\.(?:jpg|png|gif|webp)$/i.test(value);
}

export async function deleteQueuedR2Object(database: ReturnType<typeof db>, key: string, queueId: string, config: R2S3Config, fetchImpl?: typeof fetch) {
  try {
    await deleteR2Object(key, config, fetchImpl);
    await database.prepare('DELETE FROM settings WHERE key=?').bind(`assignment-image-delete:${queueId}`).run();
    return true;
  } catch (error) {
    console.error('Assignment image object deletion deferred:', queueId, error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export async function deleteQueuedAssignmentImage(database: ReturnType<typeof db>, settingKey: string, settingValue: string, objectKey: string, backend: AssignmentImageStorageBackend, environment: Record<string, unknown>, fetchImpl?: typeof fetch) {
  try {
    await deleteAssignmentImageObject(objectKey, backend, environment, fetchImpl);
    await database.prepare('DELETE FROM settings WHERE key=? AND value=?').bind(settingKey, settingValue).run();
    return true;
  } catch (error) {
    console.error('Assignment image object deletion deferred:', settingKey, error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

function personalAssignmentExpiry(alias: string) {
  const latestStatus = `(SELECT json_extract(s.result,'$.status') FROM submissions s WHERE s.assignment_id=${alias}.id ORDER BY julianday(s.created_at) DESC,s.id DESC LIMIT 1)`;
  const latestCreatedAt = `(SELECT s.created_at FROM submissions s WHERE s.assignment_id=${alias}.id ORDER BY julianday(s.created_at) DESC,s.id DESC LIMIT 1)`;
  const unreviewedAt = `(CASE WHEN ${latestStatus} IS NULL OR (${latestStatus} IN ('passed','failed','needs_work') AND ${alias}.completed_at IS NULL) THEN ${alias}.created_at ELSE COALESCE(${latestCreatedAt},${alias}.created_at) END)`;
  return `${alias}.topic_id IS NULL AND ${alias}.student_id IS NOT NULL
    AND (${alias}.lesson_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM lessons l WHERE l.id=${alias}.lesson_id AND l.status IN ('scheduled','pending','updating','completing')
    ))
    AND NOT EXISTS (
      SELECT 1 FROM lesson_preparation_items p JOIN lessons l ON l.id=p.lesson_id
      WHERE p.assignment_id=${alias}.id AND l.status IN ('scheduled','pending','updating','completing')
    )
    AND (
      (${latestStatus} IN ('passed','failed','needs_work') AND julianday(${alias}.completed_at)<=julianday(?))
      OR ((${latestStatus} IS NULL OR ${latestStatus}='pending' OR (${latestStatus} IN ('passed','failed','needs_work') AND ${alias}.completed_at IS NULL)) AND julianday(${unreviewedAt})<=julianday(?))
    )`;
}

export async function cleanupExpiredPersonalAssignments(database: ReturnType<typeof db>, timestamp = Date.now()) {
  const reviewedCutoff = new Date(timestamp - PERSONAL_ASSIGNMENT_REVIEWED_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const unreviewedCutoff = new Date(timestamp - PERSONAL_ASSIGNMENT_UNREVIEWED_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const expiry = personalAssignmentExpiry('assignments');
  const candidates = await database.prepare(`
    SELECT id FROM assignments
    WHERE ${expiry}
    ORDER BY COALESCE(completed_at,created_at), id LIMIT 10
  `).bind(reviewedCutoff, unreviewedCutoff).all<{ id: string }>();
  let deleted = 0;
  for (const { id: assignmentId } of candidates.results) {
    const marker = `retention-delete:${timestamp}:${assignmentId}`;
    const candidateExpiry = personalAssignmentExpiry('a');
    const results = await database.batch([
      database.prepare(`
        INSERT INTO settings (key,value)
        SELECT 'assignment-image-delete:personal:' || ? || ':' || i.id,
               json_object('object_key',i.object_key,'storage_backend',i.storage_backend)
        FROM assignment_images i
        WHERE i.assignment_id=? AND EXISTS (
          SELECT 1 FROM assignments a WHERE a.id=? AND ${candidateExpiry}
        )
        ON CONFLICT(key) DO NOTHING
      `).bind(assignmentId, assignmentId, assignmentId, reviewedCutoff, unreviewedCutoff),
      database.prepare(`UPDATE assignments SET completed_at=? WHERE id=? AND ${expiry}`).bind(marker, assignmentId, reviewedCutoff, unreviewedCutoff),
      database.prepare(`DELETE FROM lesson_preparation_items WHERE assignment_id=? AND EXISTS (SELECT 1 FROM assignments WHERE id=? AND completed_at=?)`).bind(assignmentId, assignmentId, marker),
      database.prepare(`DELETE FROM submissions WHERE assignment_id=? AND EXISTS (SELECT 1 FROM assignments WHERE id=? AND completed_at=?)`).bind(assignmentId, assignmentId, marker),
      database.prepare(`DELETE FROM assignment_images WHERE assignment_id=? AND EXISTS (SELECT 1 FROM assignments WHERE id=? AND completed_at=?)`).bind(assignmentId, assignmentId, marker),
      database.prepare(`DELETE FROM assignments WHERE id=? AND topic_id IS NULL AND student_id IS NOT NULL AND completed_at=?`).bind(assignmentId, marker),
    ]);
    if (results.at(-1)?.meta.changes === 1) deleted++;
  }
  return deleted;
}

/** @deprecated Use cleanupExpiredPersonalAssignments. */
export const cleanupCompletedPersonalAssignments = cleanupExpiredPersonalAssignments;

export async function cleanupOrphanedAssignmentImages(database: ReturnType<typeof db>, environment: Record<string, unknown>, fetchImpl?: typeof fetch) {
  const queued = await database.prepare("SELECT key,value FROM settings WHERE key LIKE 'assignment-image-delete:%' ORDER BY key LIMIT 10").all<QueuedAssignmentImageDelete>();
  for (const item of queued.results) {
    let queuedValue: QueuedImageValue = {};
    try { queuedValue = JSON.parse(item.value) as QueuedImageValue; } catch {}
    const objectKey = typeof queuedValue.object_key === 'string' ? queuedValue.object_key : '';
    if (!validObjectKey(objectKey)) {
      console.error('Assignment image deletion queue entry is invalid:', item.key);
      continue;
    }
    await deleteQueuedAssignmentImage(database, item.key, item.value, objectKey, storedBackend(queuedValue.storage_backend), environment, fetchImpl);
  }

  const result = await database.prepare(`
    SELECT i.id, i.object_key, i.storage_backend
    FROM assignment_images i
    LEFT JOIN assignments a ON a.id=i.assignment_id
    WHERE a.id IS NULL
    ORDER BY i.created_at, i.id
    LIMIT 10
  `).all<OrphanedAssignmentImage>();
  await Promise.all(result.results.map(async image => {
    if (!validObjectKey(image.object_key)) {
      console.error('Orphaned assignment image key is invalid:', image.id);
      return;
    }
    try {
      await deleteAssignmentImageObject(image.object_key, storedBackend(image.storage_backend), environment, fetchImpl);
      await database.prepare('DELETE FROM assignment_images WHERE id=? AND NOT EXISTS (SELECT 1 FROM assignments WHERE id=assignment_images.assignment_id)').bind(image.id).run();
    } catch (error) {
      console.error('Assignment image cleanup deferred:', image.id, error instanceof Error ? error.message : 'Unknown error');
    }
  }));

  const directory = assignmentImageDirectory(environment);
  if (directory) {
    try {
      const [storage, lock] = await Promise.all([import('./assignment-image-filesystem.ts'), import('./assignment-image-lock.mjs')]);
      await lock.withAssignmentImageStorageLock(directory, () => storage.removeUntrackedAssignmentImageFiles(
        directory,
        async objectKey => Boolean(await database.prepare('SELECT id FROM assignment_images WHERE object_key=? LIMIT 1').bind(objectKey).first()),
        { olderThan: Date.now() - 24 * 60 * 60 * 1000, limit: 100 },
      ));
    } catch (error) {
      console.error('Untracked assignment image cleanup deferred:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
