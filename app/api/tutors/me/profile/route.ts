import { apiResponse, json, requestJson } from '@/lib/api-response';
import { auth, db, HttpError, now, requireValue } from '@/lib/server';

export const GET = (request: Request) => apiResponse(request, async () => {
  const user = await auth(request,true);
  const profile = await db().prepare('SELECT * FROM tutor_profiles WHERE tutor_id=?').bind(user.id).first<Record<string,unknown>>();
  if (!profile) throw new HttpError('Анкета репетитора не найдена.',404);
  return json({ profile: { ...profile, subjects: JSON.parse(String(profile.subjects_json || '[]')) } });
});

export const PATCH = (request: Request) => apiResponse(request, async () => {
  const user = await auth(request,true), body = await requestJson(request);
  const headline = typeof body.headline === 'string' ? body.headline.trim().slice(0,180) : '';
  const bio = typeof body.bio === 'string' ? body.bio.trim().slice(0,5000) : '';
  const experience = typeof body.experience === 'string' ? body.experience.trim().slice(0,1000) : '';
  const qualification = typeof body.qualification === 'string' ? body.qualification.trim().slice(0,1000) : '';
  const portraitUrl = typeof body.portrait_url === 'string' ? body.portrait_url.trim().slice(0,1000) : '';
  const price = Number(body.price_per_lesson ?? 1000);
  const subjects = Array.isArray(body.subjects) ? [...new Set(body.subjects.filter((item): item is string => typeof item === 'string').map(item=>item.trim().slice(0,60)).filter(Boolean))].slice(0,12) : [];
  requireValue(subjects.length>0 && Number.isInteger(price) && price>=1 && price<=1000000,'Проверь направления и стоимость занятия.');
  if (portraitUrl) { let parsed: URL; try { parsed = new URL(portraitUrl, new URL(request.url).origin); } catch { throw new HttpError('Некорректная ссылка на фото.',400); } requireValue(parsed.protocol==='https:' || parsed.origin===new URL(request.url).origin,'Ссылка на фото должна вести на безопасный адрес.'); }
  await db().prepare('UPDATE tutor_profiles SET headline=?,bio=?,subjects_json=?,experience=?,qualification=?,portrait_url=?,price_per_lesson=?,published=?,updated_at=? WHERE tutor_id=?').bind(headline,bio,JSON.stringify(subjects),experience,qualification,portraitUrl||null,price,body.published===true?1:0,now(),user.id).run();
  return json({ ok:true, submittedForReview:true });
});
