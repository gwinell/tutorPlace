import { apiResponse, json } from '@/lib/api-response';
import { db, requirePlatformAdmin } from '@/lib/server';

export const GET = (request: Request) => apiResponse(request, async () => {
  await requirePlatformAdmin(request);
  const pending = (await db().prepare(`SELECT u.id,u.name,u.login,u.email,u.created_at,p.headline,p.bio,p.subjects_json,p.experience,p.qualification,p.portrait_url,p.price_per_lesson FROM users u JOIN tutor_profiles p ON p.tutor_id=u.id WHERE p.approved=0 ORDER BY p.created_at`).all()).results;
  return json({ tutors: pending });
});
