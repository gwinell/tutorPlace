type Environment = Record<string, unknown>;

type SdkKey = {
  projectId: string;
  key: JsonWebKey & { kid?: string; crv?: string };
};

const API = 'https://api.salutejazz.ru/v1';
// Примерный UUID пользователя из официального руководства SaluteJazz по транспортному JWT:
// https://developers.sber.ru/docs/ru/jazz/api/authorization — поле sub обозначает ID пользователя в приложении.
const SERVICE_SUBJECT = '15eca6c5-fb2d-48f2-804a-f97e542ebd33';
const ACCESS_TOKEN_TTL_MS = 5 * 60 * 1000;
let cachedAccessToken: { value: string; expiresAt: number } | null = null;
let accessTokenRequest: Promise<string> | null = null;

export function saluteJazzConfigured(environment: Environment): boolean {
  return typeof environment.SALUTEJAZZ_SDK_KEY === 'string' && Boolean(environment.SALUTEJAZZ_SDK_KEY);
}

function base64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function encodeJson(value: unknown): string {
  return base64Url(new TextEncoder().encode(JSON.stringify(value)));
}

export function parseSdkKey(value: string): SdkKey {
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const bytes = Uint8Array.from(atob(normalized), character => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as SdkKey;
    if (!parsed.projectId || !parsed.key?.kid || !parsed.key.d || !parsed.key.crv) throw new Error('Invalid SDK key.');
    return parsed;
  } catch {
    throw new Error('SaluteJazz SDK key is invalid.');
  }
}

async function transportToken(environment: Environment): Promise<string> {
  const encodedKey = environment.SALUTEJAZZ_SDK_KEY;
  if (typeof encodedKey !== 'string' || !encodedKey) throw new Error('SaluteJazz is not configured.');
  const sdkKey = parseSdkKey(encodedKey);
  const curves: Record<string, { alg: string; hash: string }> = {
    'P-256': { alg: 'ES256', hash: 'SHA-256' },
    'P-384': { alg: 'ES384', hash: 'SHA-384' },
    'P-521': { alg: 'ES512', hash: 'SHA-512' },
  };
  const signing = curves[sdkKey.key.crv || ''];
  if (!signing) throw new Error('SaluteJazz SDK key uses an unsupported curve.');

  const header = encodeJson({ typ: 'JWT', alg: signing.alg, kid: sdkKey.key.kid });
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = encodeJson({
    iat: issuedAt,
    exp: issuedAt + 120,
    jti: crypto.randomUUID(),
    sdkProjectId: sdkKey.projectId,
    iss: 'codeTogether',
    sub: SERVICE_SUBJECT,
  });
  const message = `${header}.${payload}`;
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    {
      crv: sdkKey.key.crv,
      d: sdkKey.key.d,
      ext: true,
      key_ops: ['sign'],
      kty: sdkKey.key.kty,
      x: sdkKey.key.x,
      y: sdkKey.key.y,
    },
    { name: 'ECDSA', namedCurve: sdkKey.key.crv! },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: signing.hash },
    privateKey,
    new TextEncoder().encode(message),
  );
  return `${message}.${base64Url(new Uint8Array(signature))}`;
}

async function accessToken(environment: Environment): Promise<string> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) return cachedAccessToken.value;
  if (accessTokenRequest) return accessTokenRequest;
  accessTokenRequest = (async () => {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${await transportToken(environment)}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`SaluteJazz authentication failed (${response.status}).`);
    const data = await response.json() as { token?: unknown; expiresIn?: unknown; expires_in?: unknown };
    if (typeof data.token !== 'string' || !data.token) throw new Error('SaluteJazz returned no access token.');
    const reportedTtl = Number(data.expiresIn ?? data.expires_in);
    const ttl = Number.isFinite(reportedTtl) && reportedTtl > 0
      ? Math.min(reportedTtl * 1000, ACCESS_TOKEN_TTL_MS)
      : ACCESS_TOKEN_TTL_MS;
    cachedAccessToken = { value: data.token, expiresAt: Date.now() + ttl - 15_000 };
    return data.token;
  })();
  try { return await accessTokenRequest; }
  finally { accessTokenRequest = null; }
}

async function request<T>(path: string, method: string, environment: Environment, body?: unknown): Promise<T | undefined> {
  const token = await accessToken(environment);
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 204) return undefined;
  if (!response.ok) throw new Error(`SaluteJazz request failed (${response.status}).`);
  return await response.json() as T;
}

export async function createSaluteJazzRoom(roomTitle: string, environment: Environment): Promise<{ roomId: string; roomUrl: string }> {
  const room = await request<{ roomId?: unknown; roomUrl?: unknown }>('/room/create', 'POST', environment, { roomTitle, roomType: 'MEETING' });
  if (typeof room?.roomId !== 'string' || typeof room.roomUrl !== 'string') {
    throw new Error('SaluteJazz returned an invalid room.');
  }
  let url: URL;
  try { url = new URL(room.roomUrl); } catch {
    await disableSaluteJazzRoom(room.roomId, environment).catch(() => undefined);
    throw new Error('SaluteJazz returned an invalid room URL.');
  }
  if (url.protocol !== 'https:' || !['salutejazz.ru', 'jazz.sber.ru', 'jazz.sberbank.ru'].some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`))) {
    await disableSaluteJazzRoom(room.roomId, environment).catch(() => undefined);
    throw new Error('SaluteJazz returned an unexpected room URL.');
  }
  return { roomId: room.roomId, roomUrl: url.href };
}

export async function disableSaluteJazzRoom(roomId: string, environment: Environment, timeoutMs = 10000): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const token = await accessToken(environment);
      const response = await fetch(`${API}/room/${encodeURIComponent(roomId)}/disable`, {
        method: 'POST',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: '{}',
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (response.status === 204 || response.status === 404 || response.status === 410) return;
      if (!response.ok) throw new Error(`SaluteJazz room shutdown failed (${response.status}).`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  throw lastError;
}
