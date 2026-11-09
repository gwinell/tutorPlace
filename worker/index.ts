import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import { calendar, calendarConfigured, cleanup, db, eventPath } from "../lib/server";
import { confirmLessonMove } from "../lib/lesson-move";
import { createSaluteJazzRoom, disableSaluteJazzRoom, saluteJazzConfigured } from "../lib/salutejazz";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

async function maintain(environment: Cloudflare.Env) {
  const serverEnv = environment as unknown as Record<string, any>;
  await cleanup(serverEnv);
  const database = db(serverEnv);
  const closeJazzRoom = async (lesson: Record<string, any>) => {
    if (!lesson.jazz_room_id) return true;
    try {
      await disableSaluteJazzRoom(lesson.jazz_room_id, serverEnv);
      await database.prepare("UPDATE lessons SET jazz_room_id=NULL,jazz_room_needs_recreation=0 WHERE id=? AND jazz_room_id=?").bind(lesson.id, lesson.jazz_room_id).run();
      return true;
    } catch (error) {
      console.error("SaluteJazz room cleanup:", lesson.id, error instanceof Error ? error.message : "Unknown error");
      return false;
    }
  };
  const deferJazzRoomClose = async (roomId: string, error: unknown) => {
    const key = `salutejazz-close:${roomId}`;
    const existing = await database.prepare('SELECT value FROM settings WHERE key=?').bind(key).first<{value:string}>();
    let attempts = 0;
    try { attempts = Number(JSON.parse(existing?.value || '{}').attempts) || 0; } catch {}
    await database.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key, JSON.stringify({attempts:attempts+1,nextAttemptAt:Date.now()+Math.min(60,2**Math.min(attempts,5))*60_000})).run();
    console.error('SaluteJazz replaced room cleanup deferred:', roomId, error instanceof Error ? error.message : 'Unknown error');
  };
  const retryDeferredJazzRoomClosures = async () => {
    const queued = await database.prepare("SELECT key,value FROM settings WHERE key LIKE 'salutejazz-close:%'").all<{key:string;value:string}>();
    for (const item of queued.results) {
      let nextAttemptAt = 0;
      try { nextAttemptAt = Number(JSON.parse(item.value).nextAttemptAt) || 0; } catch {}
      if (nextAttemptAt > Date.now()) continue;
      const roomId = item.key.slice('salutejazz-close:'.length);
      try {
        await disableSaluteJazzRoom(roomId, serverEnv);
        await database.prepare('DELETE FROM settings WHERE key=?').bind(item.key).run();
      } catch (error) {
        await deferJazzRoomClose(roomId, error);
      }
    }
  };
  await retryDeferredJazzRoomClosures();
  const cutoff = new Date(Date.now() - 5 * 60_000).toISOString();
  const stale = await database.prepare("SELECT * FROM lessons WHERE status IN ('pending','updating','completing') AND operation_started_at IS NOT NULL AND operation_started_at<?").bind(cutoff).all<Record<string, any>>();
  for (const lesson of stale.results) {
    try {
      if (lesson.status === "completing") {
        await database.batch([
          database.prepare("UPDATE users SET balance=MAX(0,balance-1) WHERE id=(SELECT student_id FROM lessons WHERE id=? AND status='completing' AND type='paid')").bind(lesson.id),
          database.prepare("UPDATE lessons SET status='completed',operation_started_at=NULL WHERE id=? AND status='completing'").bind(lesson.id),
          database.prepare("DELETE FROM slot_locks WHERE lesson_id=?").bind(lesson.id),
        ]);
        continue;
      }
      if (!calendarConfigured(serverEnv)) continue;
      if (!lesson.event_id) {
        if (lesson.status === "pending" && await closeJazzRoom(lesson)) await database.batch([
          database.prepare("DELETE FROM slot_locks WHERE lesson_id=?").bind(lesson.id),
          database.prepare("DELETE FROM lessons WHERE id=? AND status='pending' AND operation_started_at<?").bind(lesson.id, cutoff),
        ]);
        else if (lesson.status === "updating" && !lesson.move_id) await database.batch([
          database.prepare("UPDATE users SET balance=MAX(0,balance-1) WHERE id=(SELECT student_id FROM lessons WHERE id=? AND status='updating' AND type='paid' AND charged=1)").bind(lesson.id),
          database.prepare("UPDATE lessons SET status='cancelled',cancelled_at=COALESCE(cancelled_at,operation_started_at),operation_started_at=NULL WHERE id=? AND status='updating' AND move_id IS NULL").bind(lesson.id),
          database.prepare("DELETE FROM slot_locks WHERE lesson_id=?").bind(lesson.id),
          database.prepare("DELETE FROM settings WHERE key=? AND value=?").bind('cancel-lock:'+lesson.student_id,lesson.id),
        ]);
        continue;
      }
      if (lesson.status === "pending") {
        const event = await calendar(eventPath(lesson.event_id, serverEnv), 'GET', undefined, {}, serverEnv) as any;
        const matches = event && event.status !== "cancelled" && Date.parse(event.start?.dateTime || "") === Date.parse(lesson.start) && Date.parse(event.end?.dateTime || "") === Date.parse(lesson.end);
        if (matches && [1, 2].includes(Number(lesson.jazz_room_needs_recreation))) {
          if (!saluteJazzConfigured(serverEnv)) continue;
          if (Number(lesson.jazz_room_needs_recreation) === 2) {
            const reset = await database.prepare("UPDATE lessons SET jazz_room_needs_recreation=1 WHERE id=? AND status='pending' AND jazz_room_needs_recreation=2").bind(lesson.id).run();
            if (!reset.meta.changes) continue;
          }
          const claim = await database.prepare("UPDATE lessons SET jazz_room_needs_recreation=2 WHERE id=? AND status='pending' AND jazz_room_needs_recreation=1").bind(lesson.id).run();
          if (!claim.meta.changes) continue;
          let replacement: { roomId: string; roomUrl: string } | undefined;
          try {
            replacement = await createSaluteJazzRoom("codeTogether · " + (lesson.type === "trial" ? "Пробный урок" : "Урок"), serverEnv);
            await calendar(eventPath(lesson.event_id, serverEnv), "PATCH", { location: replacement.roomUrl }, {}, serverEnv);
            const changed = await database.prepare("UPDATE lessons SET jazz_room_id=?,meet_url=?,jazz_room_needs_recreation=0,status='scheduled',operation_started_at=NULL WHERE id=? AND status='pending' AND jazz_room_needs_recreation=2").bind(replacement.roomId,replacement.roomUrl,lesson.id).run();
            if (!changed.meta.changes) {
              try { await disableSaluteJazzRoom(replacement.roomId, serverEnv); }
              catch (error) { await deferJazzRoomClose(replacement.roomId, error); }
            } else if (lesson.jazz_room_id) {
              try { await disableSaluteJazzRoom(lesson.jazz_room_id, serverEnv); }
              catch (error) { await deferJazzRoomClose(lesson.jazz_room_id, error); }
            }
          } catch (error) {
            if (replacement) {
              try { await disableSaluteJazzRoom(replacement.roomId, serverEnv); }
              catch (cleanupError) { await deferJazzRoomClose(replacement.roomId, cleanupError); }
            }
            await database.prepare("UPDATE lessons SET jazz_room_needs_recreation=1 WHERE id=? AND status='pending' AND jazz_room_needs_recreation=2").bind(lesson.id).run();
            throw error;
          }
        } else if (matches) await database.prepare("UPDATE lessons SET status='scheduled',operation_started_at=NULL WHERE id=? AND status='pending'").bind(lesson.id).run();
        else if ((!event || event.status === "cancelled") && await closeJazzRoom(lesson)) await database.batch([
          database.prepare("DELETE FROM slot_locks WHERE lesson_id=?").bind(lesson.id),
          database.prepare("DELETE FROM lessons WHERE id=? AND status='pending' AND operation_started_at<?").bind(lesson.id, cutoff),
        ]);
        continue;
      }
      if (lesson.move_id) {
        await confirmLessonMove({lessonId:lesson.id,eventId:lesson.event_id,operationId:lesson.move_id,original:{start:lesson.start,end:lesson.end},target:{start:lesson.move_start,end:lesson.move_end}}, serverEnv);
        continue;
      }
      const event = await calendar(eventPath(lesson.event_id, serverEnv), 'GET', undefined, {}, serverEnv) as any;
      const removed = !event || event.status === "cancelled";
      const unchanged = event && event.status !== "cancelled" && Date.parse(event.start?.dateTime || "") === Date.parse(lesson.start) && Date.parse(event.end?.dateTime || "") === Date.parse(lesson.end);
      if (removed) {
        await database.batch([
          database.prepare("UPDATE users SET balance=MAX(0,balance-1) WHERE id=(SELECT student_id FROM lessons WHERE id=? AND status='updating' AND type='paid' AND charged=1)").bind(lesson.id),
          database.prepare("UPDATE lessons SET status='cancelled',cancelled_at=COALESCE(cancelled_at,operation_started_at),operation_started_at=NULL WHERE id=? AND status='updating' AND move_id IS NULL").bind(lesson.id),
          database.prepare("DELETE FROM slot_locks WHERE lesson_id=?").bind(lesson.id),
          database.prepare("DELETE FROM settings WHERE key=? AND value=?").bind('cancel-lock:'+lesson.student_id,lesson.id),
        ]);
      } else if (unchanged) {
        await database.batch([
          database.prepare("UPDATE lessons SET status='scheduled',charged=0,operation_started_at=NULL WHERE id=? AND status='updating' AND move_id IS NULL").bind(lesson.id),
          database.prepare("DELETE FROM settings WHERE key=? AND value=?").bind('cancel-lock:'+lesson.student_id,lesson.id),
        ]);
      }
    } catch (error) {
      console.error("codeTogether maintenance recovery:", lesson.id, error instanceof Error ? error.message : "Unknown error");
    }
  }
  const expiredAt = new Date(Date.now() - 30 * 60_000).toISOString();
  const roomsToClose = await database.prepare("SELECT id,jazz_room_id FROM lessons WHERE jazz_room_id IS NOT NULL AND (status IN ('cancelled','completed') OR (status='scheduled' AND end<?))").bind(expiredAt).all<Record<string, any>>();
  for (const lesson of roomsToClose.results) await closeJazzRoom(lesson);
}

const worker = {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
  },
  async scheduled(_controller: ScheduledController, env: Cloudflare.Env, _ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    try {
      await maintain(env);
    } catch (error) {
      console.error("codeTogether scheduled maintenance failed:", error instanceof Error ? error.stack : error);
    }
  },
};

export default worker;
