import { db, hash, requireValue } from './server';

export function normalizeTrialPhone(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 32) return null;
  const phone = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(phone)) return null;
  const digits = phone.replace(/\D/g, '');

  if (phone.startsWith('+')) {
    if (!/^[1-9]\d{7,14}$/.test(digits)) return null;
    if (digits.startsWith('7') && digits.length !== 11) return null;
    return '+' + digits;
  }
  if (digits.length === 10) return '+7' + digits;
  if (/^[78]\d{10}$/.test(digits)) return '+7' + digits.slice(1);
  return null;
}

export async function limitTrialBooking(request: Request) {
  const client = await hash(request.headers.get('cf-connecting-ip') || 'local');
  const hour = 60 * 60 * 1000;
  const now = Date.now();
  const windowStart = Math.floor(now / hour) * hour;
  const database = db();
  const [, limit] = await database.batch([
    database.prepare('DELETE FROM trial_booking_limits WHERE window_start < ?').bind(windowStart - hour),
    database.prepare(`
      INSERT INTO trial_booking_limits (client, window_start, attempts) VALUES (?, ?, 1)
      ON CONFLICT(client) DO UPDATE SET
        window_start = excluded.window_start,
        attempts = CASE WHEN window_start = excluded.window_start THEN attempts + 1 ELSE 1 END
      WHERE window_start <> excluded.window_start OR attempts < 3
    `).bind(client, windowStart),
  ]);
  requireValue(limit.meta.changes, 'Слишком много попыток записи. Попробуй в следующем часу.', 429);
}
