import { apiResponse, json } from '@/lib/api-response';
import { db, HttpError, requirePlatformAdmin, now } from '@/lib/server';

type Context = { params: Promise<{ id: string }> };
export async function POST(request: Request, context: Context) {
  return apiResponse(request, async () => {
    await requirePlatformAdmin(request);
    const { id: tutorId } = await context.params;
    const profile = await db().prepare('SELECT tutor_id FROM tutor_profiles WHERE tutor_id=?').bind(tutorId).first();
    if (!profile) throw new HttpError('Анкета не найдена.',404);
    const body = await request.json().catch(() => ({})) as { approved?: boolean; published?: boolean };
    await db().batch([
      db().prepare('UPDATE tutor_profiles SET approved=?,published=?,updated_at=? WHERE tutor_id=?').bind(body.approved===false?0:1,body.approved===false?0:body.published===false?0:1,now(),tutorId),
      db().prepare("UPDATE users SET registration_status='active' WHERE id=? AND role='teacher'").bind(tutorId),
    ]);
    return json({ ok: true });
  });
}
