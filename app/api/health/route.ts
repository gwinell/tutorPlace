import { db } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db().prepare("SELECT 1 AS ok").first<{ ok: number }>();
    if (result?.ok !== 1) return Response.json({ ok: false }, { status: 503 });
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
