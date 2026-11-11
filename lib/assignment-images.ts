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
export type AssignmentImageAccess = { role: string; targetBelongsToUser: boolean; lessonBelongsToUser: boolean };

export function canReadAssignmentImage(access: AssignmentImageAccess) {
  return access.role === "teacher" || (access.targetBelongsToUser && access.lessonBelongsToUser);
}

export class R2StorageError extends Error {
  public status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = "R2StorageError";
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

type OrphanedAssignmentImage = { id: string; object_key: string };
type QueuedAssignmentImageDelete = { key: string; value: string };

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

export async function cleanupOrphanedAssignmentImages(database: ReturnType<typeof db>, environment: Record<string, unknown>, fetchImpl?: typeof fetch) {
  let config: R2S3Config | null;
  try {
    config = r2S3Config(environment);
  } catch (error) {
    console.error('Assignment image cleanup skipped: invalid R2 configuration.', error instanceof Error ? error.message : 'Unknown error');
    return;
  }
  if (!config) return;

  const queued = await database.prepare("SELECT key,value FROM settings WHERE key LIKE 'assignment-image-delete:%' ORDER BY key LIMIT 10").all<QueuedAssignmentImageDelete>();
  for (const item of queued.results) {
    let objectKey = '';
    try { objectKey = String(JSON.parse(item.value)?.object_key || ''); } catch {}
    if (!/^assignment-images\/[A-Za-z0-9_-]{1,100}\/[0-9a-f-]{36}\.(?:jpg|png|gif|webp)$/i.test(objectKey)) {
      console.error('Assignment image deletion queue entry is invalid:', item.key);
      continue;
    }
    try {
      await deleteR2Object(objectKey, config, fetchImpl);
      await database.prepare('DELETE FROM settings WHERE key=? AND value=?').bind(item.key, item.value).run();
    } catch (error) {
      console.error('Queued assignment image deletion deferred:', item.key, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  const result = await database.prepare(`
    SELECT i.id, i.object_key
    FROM assignment_images i
    LEFT JOIN assignments a ON a.id=i.assignment_id
    WHERE a.id IS NULL
    ORDER BY i.created_at, i.id
    LIMIT 10
  `).all<OrphanedAssignmentImage>();
  await Promise.all(result.results.map(async image => {
    try {
      await deleteR2Object(image.object_key, config, fetchImpl);
      await database.prepare('DELETE FROM assignment_images WHERE id=? AND NOT EXISTS (SELECT 1 FROM assignments WHERE id=assignment_images.assignment_id)').bind(image.id).run();
    } catch (error) {
      console.error('Assignment image cleanup deferred:', image.id, error instanceof Error ? error.message : 'Unknown error');
    }
  }));
}
