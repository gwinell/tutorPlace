import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import { calendar, calendarConfigured, cleanup, db, eventPath } from "../lib/server";
import { confirmLessonMove } from "../lib/lesson-move";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

async function maintain(environment: Cloudflare.Env) {
  const serverEnv = environment as unknown as Record<string, any>;
  await cleanup(serverEnv);
  const database = db(serverEnv);
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
        if (lesson.status === "pending") await database.batch([
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
        if (matches) await database.prepare("UPDATE lessons SET status='scheduled',operation_started_at=NULL WHERE id=? AND status='pending'").bind(lesson.id).run();
        else if (!event || event.status === "cancelled") await database.batch([
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
