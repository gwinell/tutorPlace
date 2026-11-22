import { apiResponse, json, requestJson } from '@/lib/api-response';
import { db, HttpError, id, now, passwordHash, requireValue } from '@/lib/server';

export const POST = (request: Request) => apiResponse(request, async () => {
  const body = await requestJson(request);
  const login = typeof body.login === 'string' ? body.login.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0,100) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0,254) : '';
  const headline = typeof body.headline === 'string' ? body.headline.trim().slice(0,180) : '';
  const subjects = Array.isArray(body.subjects) ? [...new Set(body.subjects.filter((item): item is string => typeof item === 'string').map(item => item.trim().slice(0,60)).filter(Boolean))].slice(0,12) : [];
  requireValue(/^[a-z0-9._-]{3,100}$/.test(login) && password.length >= 10 && password.length <= 128 && name.length >= 2, 'Укажи имя, логин и пароль от 10 символов.');
  requireValue(!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Проверь адрес электронной почты.');
  requireValue(subjects.length > 0, 'Добавь хотя бы одно направление занятий.');
  const database = db(), userId = id(), timestamp = now();
  try {
    await database.batch([
      database.prepare("INSERT INTO users (id,login,password,name,role,email,created_at,registration_status) VALUES (?,?,?,?,'teacher',?,?, 'pending')")
        .bind(userId,login,await passwordHash(password),name,email || null,timestamp),
      database.prepare('INSERT INTO tutor_profiles (tutor_id,headline,subjects_json,created_at,updated_at) VALUES (?,?,?,?,?)')
        .bind(userId,headline,JSON.stringify(subjects),timestamp,timestamp),
    ]);
  } catch (error) {
    if (error instanceof Error && /UNIQUE constraint failed: users\.(login|email)/.test(error.message)) throw new HttpError('Этот логин или адрес уже зарегистрирован.',409);
    throw error;
  }
  return json({ ok: true, tutorId: userId, reviewStatus: 'pending' }, 201);
});
