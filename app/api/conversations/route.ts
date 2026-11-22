import { apiResponse, json } from '@/lib/api-response';
import { auth, db, id, now, requireValue } from '@/lib/server';

export const GET = (request: Request) => apiResponse(request, async () => {
  const user = await auth(request);
  requireValue(user.role !== 'support', 'Личные чаты недоступны аккаунту поддержки.', 403);
  const rows = (await db().prepare(`SELECT c.id,c.tutor_id,c.student_id,c.updated_at,
    CASE WHEN c.tutor_id=? THEN s.id ELSE t.id END participant_id,
    CASE WHEN c.tutor_id=? THEN s.name ELSE t.name END participant_name,
    CASE WHEN c.tutor_id=? THEN 'student' ELSE 'teacher' END participant_role,
    (SELECT body FROM conversation_messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) last_body,
    (SELECT author_id FROM conversation_messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) last_sender,
    (SELECT created_at FROM conversation_messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) last_at
    FROM conversations c JOIN users t ON t.id=c.tutor_id JOIN users s ON s.id=c.student_id
    WHERE c.tutor_id=? OR c.student_id=? ORDER BY c.updated_at DESC`).bind(user.id,user.id,user.id,user.id,user.id).all()).results;
  return json({ conversations: rows.map((r: Record<string, unknown>) => ({ id:r.id,tutorId:r.tutor_id,studentId:r.student_id,participant:{id:r.participant_id,name:r.participant_name,role:r.participant_role},subject:null,lessonId:null,unreadCount:0,updatedAt:r.updated_at,lastMessage:r.last_body?{body:r.last_body,senderId:r.last_sender,createdAt:r.last_at}:null })) });
});

export const POST = (request: Request) => apiResponse(request, async () => {
  const user = await auth(request); const body = await request.json().catch(()=>({})) as Record<string,unknown>;
  const tutorId = user.role==='teacher' ? user.id : String(body.tutorId||'');
  const studentId = user.role==='student' ? user.id : String(body.studentId||'');
  requireValue(user.role==='teacher'||user.role==='student','Личный чат недоступен.',403);
  requireValue(tutorId&&studentId,'Нужен репетитор и ученик.');
  if (user.role==='student') requireValue(!!await db().prepare("SELECT id FROM tutor_profiles WHERE tutor_id=? AND approved=1 AND published=1").bind(tutorId).first(),'Анкета репетитора не найдена.',404);
  else requireValue(!!await db().prepare('SELECT student_id FROM tutor_students WHERE tutor_id=? AND student_id=? AND status="active"').bind(tutorId,studentId).first(),'Ученик не связан с этим репетитором.',403);
  const existing=await db().prepare('SELECT id FROM conversations WHERE tutor_id=? AND student_id=?').bind(tutorId,studentId).first<{id:string}>();
  const conversationId=existing?.id||id(); const timestamp=now();
  if(!existing) await db().prepare('INSERT INTO conversations(id,tutor_id,student_id,created_at,updated_at) VALUES(?,?,?,?,?)').bind(conversationId,tutorId,studentId,timestamp,timestamp).run();
  return json({conversationId},existing?200:201);
});
