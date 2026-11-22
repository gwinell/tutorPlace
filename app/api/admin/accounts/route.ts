import { apiResponse, json, requestJson } from '@/lib/api-response';
import { db, HttpError, id, now, passwordHash, requirePlatformAdmin, requireValue } from '@/lib/server';

export const POST = (request: Request) => apiResponse(request, async () => {
  await requirePlatformAdmin(request);
  const body = await requestJson(request);
  const role = body.role === 'support' ? 'support' : body.role === 'teacher' ? 'teacher' : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0,100) : '';
  const login = typeof body.login === 'string' ? body.login.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  requireValue(role && name.length>=2 && /^[a-z0-9._-]{3,100}$/.test(login) && password.length>=10 && password.length<=128,'Укажи имя, логин и пароль от 10 символов.');
  const userId = id(), timestamp = now();
  try {
    await db().prepare('INSERT INTO users (id,login,password,name,role,created_at,registration_status) VALUES (?,?,?,?,?,?,?)').bind(userId,login,await passwordHash(password),name,role,timestamp,'active').run();
  } catch (error) {
    if (error instanceof Error && /UNIQUE constraint failed/.test(error.message)) throw new HttpError('Этот логин уже используется.',409);
    throw error;
  }
  if (role === 'teacher') await db().prepare("INSERT INTO tutor_profiles (tutor_id,headline,subjects_json,created_at,updated_at) VALUES (?,'','[]',?,?)").bind(userId,timestamp,timestamp).run();
  return json({ ok: true, user: { id: userId, name, login, role } },201);
});
