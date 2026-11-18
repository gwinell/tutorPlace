import { calendar, db, eventPath, HttpError, requireValue, slotKeys, type ServerEnv } from './server';

type Interval = { start: string; end: string };
type Move = { lessonId: string; eventId: string; operationId: string; original: Interval; target: Interval };
type CalendarEvent = { status?: string; etag?: string; start?: { dateTime?: string }; end?: { dateTime?: string } } | null;

function matches(event: CalendarEvent, interval: Interval) {
  return !!event && event.status !== 'cancelled' &&
    Date.parse(event.start?.dateTime ?? '') === Date.parse(interval.start) &&
    Date.parse(event.end?.dateTime ?? '') === Date.parse(interval.end);
}

export async function reserveLessonMove(move: Move, { allowOverlappingSlots = false }: { allowOverlappingSlots?: boolean } = {}) {
  const database = db();
  const oldKeys = new Set(slotKeys(move.original.start, move.original.end));
  const newKeys = slotKeys(move.target.start, move.target.end).filter(key => !oldKeys.has(key));
  const claim = database.prepare(`
    UPDATE lessons SET status = 'updating', operation_started_at = ?, move_id = ?, move_start = ?, move_end = ?
    WHERE id = ? AND status = 'scheduled' AND start = ? AND end = ?
  `).bind(new Date().toISOString(), move.operationId, move.target.start, move.target.end, move.lessonId, move.original.start, move.original.end);

  const [result] = await database.batch([
    claim,
    ...(allowOverlappingSlots ? [] : newKeys.map(key => database.prepare(`
      INSERT INTO slot_locks (slot, lesson_id)
      SELECT ?, ? WHERE EXISTS (SELECT 1 FROM lessons WHERE id = ? AND move_id = ?)
    `).bind(key, move.lessonId, move.lessonId, move.operationId))),
  ]);
  requireValue(result.meta.changes, 'Урок уже изменён. Обнови расписание.', 409);
}

export async function confirmLessonMove(move: Move, environment?: ServerEnv) {
  const path = eventPath(move.eventId, environment);
  const pendingMessage = 'Перенос ожидает подтверждения календаря. Оба окна удерживаются. Повтори проверку в расписании.';
  let event: CalendarEvent;
  try {
    event = await calendar(path, 'GET', undefined, {}, environment);
  } catch {
    throw new HttpError(pendingMessage, 503);
  }

  if (!matches(event, move.target)) {
    requireValue(matches(event, move.original) && event?.etag,
      'Время урока изменилось в Google Календаре. Оба окна удерживаются до сверки с репетитором.', 409);
    requireValue(Date.parse(move.target.start) > Date.now(),
      'Выбранное время уже прошло. Сверь запись с репетитором.', 409);
    try {
      event = await calendar(path, 'PATCH', {
        start: { dateTime: move.target.start, timeZone: 'Europe/Moscow' },
        end: { dateTime: move.target.end, timeZone: 'Europe/Moscow' },
      }, { 'If-Match': event!.etag! }, environment);
    } catch {
      // A lost response does not tell us whether Google applied the write.
      try {
        event = await calendar(path, 'GET', undefined, {}, environment);
      } catch {
        throw new HttpError(pendingMessage, 503);
      }
    }
    requireValue(matches(event, move.target), pendingMessage, 503);
  }

  const database = db(environment);
  const targetKeys = new Set(slotKeys(move.target.start, move.target.end));
  const obsoleteKeys = slotKeys(move.original.start, move.original.end).filter(key => !targetKeys.has(key));
  await database.batch([
    ...obsoleteKeys.map(key => database.prepare(`
      DELETE FROM slot_locks WHERE slot = ? AND lesson_id = ?
      AND EXISTS (SELECT 1 FROM lessons WHERE id = ? AND status = 'updating' AND move_id = ?)
    `).bind(key, move.lessonId, move.lessonId, move.operationId)),
    database.prepare(`
      UPDATE lessons SET start = ?, end = ?, status = 'scheduled', operation_started_at = NULL,
        move_id = NULL, move_start = NULL, move_end = NULL
      WHERE id = ? AND status = 'updating' AND move_id = ?
    `).bind(move.target.start, move.target.end, move.lessonId, move.operationId),
  ]);
}
