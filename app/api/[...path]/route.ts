import {db,secrets,HttpError,requireValue,auth,currentUser,safeUser,passwordHash,verifyPassword,hash,now,id,schedule,normalizeSchedule,calendarConfigured,calendar,eventPath,slots,slotKeys,httpsUrl,cleanup} from '@/lib/server';
import {Lesson,canReschedule,monthBounds,resultStatus,PYTHON_START,TEACHER_START} from '@/lib/domain';
import {documentFrom,encode,decode,replaceText,Y} from '@/lib/collaboration';
import {ROOM_STARTERS,starterLanguage,type RoomLanguage} from '@/lib/room-presets';
import {normalizeTrialPhone,limitTrialBooking} from '@/lib/trial-booking';
import {reserveLessonMove,confirmLessonMove} from '@/lib/lesson-move';
import {createSaluteJazzRoom,disableSaluteJazzRoom,saluteJazzConfigured} from '@/lib/salutejazz';
export const dynamic='force-dynamic';
// D1 projects differ per query; request bodies below use endpoint-specific fields.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row=Record<string,any>;
type ApiBody = {
 login?:string;password?:string;name?:string;body?:string;phone?:string;parent_name?:string;parent_phone?:string;
 age?:number;balance?:number;price_per_lesson?:number;rating?:number;position?:number;minutes?:number;answer?:number;amount?:number;credits?:number;
 consent?:boolean;enabled?:boolean;expectedCharged?:boolean;published?:boolean;
 assignmentId?:string;studentId?:string;studentIds?:unknown[];courseId?:string;course_id?:string;
 title?:string;description?:string;format?:string;content?:string;kind?:string;prompt?:string;feedback?:string;status?:string;
 start?:string;dateOverrides?:Record<string,unknown>;weeklyAvailability?:Record<string,unknown>;days?:unknown[];from?:string;to?:string;timezone?:string;availabilityCalendarIds?:unknown[];
 options?:unknown[];topicIds?:unknown[];topicId?:string;topic_id?:string;lesson_id?:string;student_id?:string;
 meetUrl?:string;meet_url?:string;colab_url?:string;topic?:string;file?:string;update?:string;language?:string;id?:string;
 exerciseId?:string;wpm?:number;accuracy?:number;durationMs?:number;
 code?:string;url?:string;comment?:string;note?:string;
};
type CalendarItem={id?:string;accessRole?:string;summary?:string;summaryOverride?:string;primary?:boolean};
const PRIVACY_POLICY_VERSION='2026-11-09';
function json(data:unknown,status=200,headers:Record<string,string>={}){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});}
async function all(sql:string,...values:unknown[]){return (await db().prepare(sql).bind(...values).all<Row>()).results;}
const text=(v:unknown,max=200)=>typeof v==='string'?v.trim().slice(0,max):'';
function validDateKey(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const time=Date.parse(value+'T00:00:00Z');return Number.isFinite(time)&&new Date(time).toISOString().slice(0,10)===value;}
async function retireMeeting(lessonId:string,roomId:string|undefined|null){
 if(!roomId)return;
 try{await disableSaluteJazzRoom(roomId,secrets,2500);await db().prepare('UPDATE lessons SET jazz_room_id=NULL,jazz_room_needs_recreation=0 WHERE id=? AND jazz_room_id=?').bind(lessonId,roomId).run();}
 catch(error){console.error('SaluteJazz room cleanup:',lessonId,error instanceof Error?error.message:'Unknown error');}
}
async function teacher(request:Request){return auth(request,true);}
async function lessonAccess(request:Request,lessonId:string){const u=await auth(request);const l=await db().prepare('SELECT * FROM lessons WHERE id=?').bind(lessonId).first<Row>();requireValue(l&&(u.role==='teacher'||l.student_id===u.id),'Урок не найден.',404);return {u,l:l!};}
async function route(request:Request){
 const url=new URL(request.url),path=url.pathname.replace(/^\/api\//,'').split('/').filter(Boolean),method=request.method;
 if(method!=='GET'){
   const origin=request.headers.get('origin');
   const proxyProto=request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
   const proxyHost=(request.headers.get('x-forwarded-host')||request.headers.get('host'))?.split(',')[0]?.trim();
   const proxyOrigin=proxyProto&&proxyHost?`${proxyProto}://${proxyHost}`:null;
   requireValue(origin===url.origin||origin===proxyOrigin,'Запрос с другого сайта запрещён.',403);
   const length=Number(request.headers.get('content-length')||0);requireValue(length<2200000,'Размер запроса слишком большой.',413);
 }
 const body:ApiBody=method==='GET'?{}:await request.json().catch(()=>({})) as ApiBody;
 if(path[0]==='reviews'&&method==='GET')return json({reviews:await all('SELECT id,name,body,rating FROM reviews WHERE published=1')});
 if(path[0]==='reviews'&&method==='POST'){await teacher(request);requireValue(text(body.name)&&text(body.body,5000)&&Number.isInteger(body.rating)&&body.rating!>=1&&body.rating!<=5,'Проверь имя, текст и оценку.');await db().prepare('INSERT INTO reviews (id,name,body,rating,published) VALUES (?,?,?,?,?)').bind(id(),text(body.name),text(body.body,5000),body.rating,body.published?1:0).run();return json({ok:true});}
 if(path[0]==='me')return json({user:await currentUser(request)});
 if(path[0]==='logout'&&method==='POST'){const token=request.headers.get('cookie')?.match(/(?:^|;\s*)ct-session=([^;]+)/)?.[1];if(token)await db().prepare('DELETE FROM sessions WHERE id=?').bind(await hash(token)).run();return json({ok:true},200,{'Set-Cookie':'ct-session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'+(url.protocol==='https:'?'; Secure':'')});}
 if(path[0]==='login'&&method==='POST'){
   requireValue(typeof body.login==='string'&&body.login.length<=100&&typeof body.password==='string'&&body.password.length<=128,'Проверь логин и пароль.');
   // D1 serializes this counter across Worker instances. No in-memory-only throttling.
   const rateKey='login:'+await hash(request.headers.get('cf-connecting-ip')||'local')+':'+Math.floor(Date.now()/60000);
   await db().prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=CAST(CAST(value AS INTEGER)+1 AS TEXT)').bind(rateKey,'1').run();
   const rate=await db().prepare('SELECT value FROM settings WHERE key=?').bind(rateKey).first<{value:string}>();requireValue(Number(rate?.value)<=12,'Слишком много попыток. Подожди минуту.',429);
   let user=await db().prepare('SELECT * FROM users WHERE login=?').bind(body.login.trim()).first<Row>();
   if(!user&&secrets.ADMIN_LOGIN&&secrets.ADMIN_PASSWORD&&body.login===secrets.ADMIN_LOGIN&&await hash(body.password)===await hash(secrets.ADMIN_PASSWORD)){
     const uid=id();await db().prepare('INSERT OR IGNORE INTO users (id,login,password,name,role,balance,created_at) VALUES (?,?,?,?,?,?,?)').bind(uid,secrets.ADMIN_LOGIN,await passwordHash(body.password),'Руслан','teacher',0,now()).run();user=await db().prepare('SELECT * FROM users WHERE login=?').bind(body.login).first<Row>();
   }
   const valid=await verifyPassword(body.password,user?.password||'nonexistent:0000000000000000000000000000000000000000000000000000000000000000');requireValue(user&&valid,'Неверный логин или пароль.',401);
   const token=crypto.randomUUID()+crypto.randomUUID();await db().prepare('INSERT INTO sessions (id,user_id,expires_at) VALUES (?,?,?)').bind(await hash(token),user!.id,Date.now()+7*86400000).run();
   return json({user:safeUser(user)},200,{'Set-Cookie':'ct-session='+token+'; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800'+(url.protocol==='https:'?'; Secure':'')});
 }
 if(path[0]==='slots'&&method==='GET'){
   const minutes=Number(url.searchParams.get('minutes')||45);requireValue(minutes===45||minutes===55,'Некорректная длительность.');if(minutes===55)await auth(request);
   const exclude=url.searchParams.get('exclude')||undefined;if(exclude)await lessonAccess(request,exclude);
   return json(await slots(url.searchParams.get('date')||'',minutes,exclude));
 }
 if(path[0]==='payment-link'&&method==='POST'){
   await teacher(request);
   requireValue(typeof body.url==='string'&&body.url.length<=2000,'Укажи корректную ссылку для оплаты длиной не более 2 000 символов.');
   const paymentLink=body.url.trim()?httpsUrl(body.url.trim()):'';
   if(paymentLink){const parsed=new URL(paymentLink);requireValue(!parsed.username&&!parsed.password,'Ссылка для оплаты не должна содержать логин или пароль.');}
   if(paymentLink)await db().prepare("INSERT INTO settings (key,value) VALUES ('payment-link',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(paymentLink).run();
   else await db().prepare("DELETE FROM settings WHERE key='payment-link'").run();
   return json({ok:true,paymentLink:paymentLink||null});
 }
 if(path[0]==='payment-requests'&&!path[1]&&method==='POST'){
   const user=await auth(request);requireValue(user.role==='student','Заявку на оплату отправляет ученик.',403);
   requireValue(Number.isSafeInteger(body.amount)&&body.amount!>=1&&body.amount!<=1000000,'Укажи сумму оплаты целым числом от 1 до 1 000 000 ₽.');
   const paymentLink=await db().prepare("SELECT value FROM settings WHERE key='payment-link'").first<{value:string}>();
   requireValue(paymentLink?.value,'Репетитор пока не добавил ссылку для оплаты.',409);
   const comment=text(body.comment,500)||null,requestId=id(),createdAt=now();
   const result=await db().prepare("INSERT INTO payment_requests (id,student_id,amount_rub,price_per_lesson,comment,status,created_at) SELECT ?,id,?,price_per_lesson,?,'pending',? FROM users WHERE id=? AND role='student'")
     .bind(requestId,body.amount,comment,createdAt,user.id).run();
   requireValue(result.meta.changes,'Ученик не найден.',404);
   return json({request:await db().prepare('SELECT * FROM payment_requests WHERE id=?').bind(requestId).first()},201);
 }
 if(path[0]==='payment-requests'&&path[1]&&path[2]==='approve'&&method==='POST'){
   const reviewer=await teacher(request),requestId=path[1];
   requireValue(Number.isInteger(body.credits)&&body.credits!>=1&&body.credits!<=100,'Укажи от 1 до 100 занятий.');
   const reviewNote=text(body.note,500)||null,reviewedAt=now(),database=db();
   const [credited,approved]=await database.batch([
     database.prepare("UPDATE users SET balance=balance+? WHERE id=(SELECT student_id FROM payment_requests WHERE id=? AND status='pending') AND role='student'").bind(body.credits,requestId),
     database.prepare("UPDATE payment_requests SET status='approved',credited_lessons=?,review_note=?,reviewed_by=?,reviewed_at=? WHERE id=? AND status='pending' AND EXISTS (SELECT 1 FROM users WHERE id=student_id AND role='student')").bind(body.credits,reviewNote,reviewer.id,reviewedAt,requestId),
   ]);
   requireValue(credited.meta.changes===1&&approved.meta.changes===1,'Заявка уже обработана или не найдена.',409);
   const paymentRequest=await db().prepare('SELECT * FROM payment_requests WHERE id=?').bind(requestId).first();
   return json({request:paymentRequest});
 }
 if(path[0]==='payment-requests'&&path[1]&&path[2]==='reject'&&method==='POST'){
   const reviewer=await teacher(request),requestId=path[1],reviewNote=text(body.note,500)||null,reviewedAt=now();
   const rejected=await db().prepare("UPDATE payment_requests SET status='rejected',review_note=?,reviewed_by=?,reviewed_at=? WHERE id=? AND status='pending'").bind(reviewNote,reviewer.id,reviewedAt,requestId).run();
   requireValue(rejected.meta.changes===1,'Заявка уже обработана или не найдена.',409);
   return json({request:await db().prepare('SELECT * FROM payment_requests WHERE id=?').bind(requestId).first()});
 }
 if(path[0]==='google'&&path[1]==='calendars'&&method==='GET'){
   await teacher(request);requireValue(calendarConfigured(),'Сначала подключи Google Календарь.',503);
   try{
     const result=await calendar('users/me/calendarList?maxResults=250');
     const items=(result?.items||[]) as CalendarItem[];const calendars=items.filter(item=>item.id&&['owner','writer','writerWithoutPrivateAccess','reader','freeBusyReader'].includes(item.accessRole||'')).map(item=>({id:item.id!,summary:item.summaryOverride||item.summary||item.id!,primary:!!item.primary,accessRole:item.accessRole,target:item.id===secrets.GOOGLE_CALENDAR_ID||(secrets.GOOGLE_CALENDAR_ID==='primary'&&item.primary)}));
     return json({calendars});
   }catch(error){
     if(error instanceof HttpError)throw new HttpError('Google не разрешил показать список календарей. Обнови разрешения Calendar List в настройках OAuth и подключи Google Календарь снова.',503);
     throw error;
   }
 }
 if(path[0]==='lessons'&&!path[1]&&method==='POST'){
   await teacher(request);
   const studentId=text(body.studentId,100);
   const student=await db().prepare("SELECT id,name FROM users WHERE id=? AND role='student'").bind(studentId).first<{id:string;name:string}>();
   requireValue(student,'Выбери ученика.',404);
   const start=text(body.start,40),startMs=Date.parse(start);
   requireValue(Number.isFinite(startMs)&&startMs>Date.now(),'Укажи будущее время урока.');
   requireValue(calendarConfigured(),'Сначала подключи Google Календарь.',503);
   const lessonStart=new Date(startMs).toISOString(),lessonEnd=new Date(startMs+55*60000).toISOString();
   const lessonId=id(),eventId=lessonId.replaceAll('-',''),scheduleValue=await schedule();
   const topic=text(body.topic,200)||'Индивидуальное занятие';
   await db().prepare("INSERT INTO lessons (id,student_id,name,start,end,type,status,event_id,operation_started_at,meet_url,topic) VALUES (?,?,?,?,?,'paid','pending',?,?,?,?)")
     .bind(lessonId,student!.id,student!.name,lessonStart,lessonEnd,eventId,now(),scheduleValue.meetUrl,topic).run();
   let jazzRoomId:string|null=null,meetingUrl=scheduleValue.meetUrl,calendarAttempted=false;
   try{
     if(saluteJazzConfigured(secrets)){
       const room=await createSaluteJazzRoom('codeTogether · Урок',secrets);
       jazzRoomId=room.roomId;meetingUrl=room.roomUrl;
       await db().prepare("UPDATE lessons SET jazz_room_id=?,meet_url=? WHERE id=? AND status='pending'").bind(jazzRoomId,meetingUrl,lessonId).run();
     }
     calendarAttempted=true;
     await calendar(eventPath(),'POST',{id:eventId,summary:'codeTogether · Урок · '+student!.name,description:topic,start:{dateTime:lessonStart,timeZone:'Europe/Moscow'},end:{dateTime:lessonEnd,timeZone:'Europe/Moscow'},...(meetingUrl?{location:meetingUrl}:{})});
     const scheduled=await db().prepare("UPDATE lessons SET status='scheduled',operation_started_at=NULL WHERE id=? AND status='pending'").bind(lessonId).run();
     requireValue(scheduled.meta.changes===1,'Не удалось сохранить урок. Обнови расписание.',409);
   }catch(error){
     let calendarCleared=!calendarAttempted,roomCleared=!jazzRoomId;
     if(calendarAttempted){try{await calendar(eventPath(eventId),'DELETE');calendarCleared=true;}catch{calendarCleared=false;}}
     if(jazzRoomId){try{await disableSaluteJazzRoom(jazzRoomId,secrets);roomCleared=true;}catch{roomCleared=false;}}
     if(calendarCleared&&roomCleared)await db().prepare("DELETE FROM lessons WHERE id=? AND status='pending'").bind(lessonId).run();
     else throw new HttpError('Не удалось безопасно завершить назначение. Урок оставлен для сверки.',503);
     throw error;
   }
   return json({lesson:await db().prepare('SELECT * FROM lessons WHERE id=?').bind(lessonId).first()},201);
 }
 if(path[0]==='book'&&method==='POST'){
   let u=await currentUser(request);const paid=body.minutes===55;if(paid&&u?.role==='teacher'){const target=await db().prepare("SELECT * FROM users WHERE id=? AND role='student'").bind(body.studentId).first<Row>();requireValue(target,'Выбери ученика.');u=safeUser(target);}requireValue(!paid||u?.role==='student','Урок бронируется из кабинета ученика.',403);
   const name=paid?u!.name:text(body.name,80);
   const phone=paid?null:normalizeTrialPhone(body.phone);
   requireValue(name,'Укажи имя.');
   if(!paid)requireValue(body.consent===true&&phone,'Укажи корректный телефон и согласие на обработку данных.');
   const start=text(body.start,40);
   requireValue(Number.isFinite(Date.parse(start)),'Выбери время.');
   if(!paid)await limitTrialBooking(request);
   const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(start));
   const available=await slots(date,paid?55:45);
   const slot=available.slots.find(s=>s.start===start);
   requireValue(slot,'Это время уже занято или пока недоступно.',409);
   const lid=id(),eventId=lid.replaceAll('-',''),s=await schedule();
   const database=db();
   const insert=paid
     ? database.prepare("INSERT INTO lessons (id,student_id,name,start,end,type,status,event_id,operation_started_at,meet_url,topic) SELECT ?,?,?,?,?,?,'pending',?,?,?,? WHERE (SELECT balance FROM users WHERE id=?)>(SELECT COUNT(*) FROM lessons WHERE student_id=? AND type='paid' AND status IN ('scheduled','pending','updating')) AND NOT EXISTS (SELECT 1 FROM lessons WHERE status IN ('scheduled','pending','updating') AND start<? AND end>?) AND NOT EXISTS (SELECT 1 FROM lessons WHERE status='updating' AND move_start<? AND move_end>?)")
         .bind(lid,u!.id,name,slot.start,slot.end,'paid',eventId,now(),s.meetUrl,'Индивидуальное занятие',u!.id,u!.id,slot.end,slot.start,slot.end,slot.start)
     : database.prepare(`
         INSERT INTO lessons (id,name,phone,trial_phone,start,end,type,status,event_id,operation_started_at,privacy_consent_at,privacy_policy_version,meet_url,topic)
         SELECT ?,?,?,?,?,?,'trial','pending',?,?,?,?,?,?
         WHERE NOT EXISTS (
           SELECT 1 FROM lessons WHERE trial_phone = ? AND type = 'trial'
             AND status IN ('scheduled','pending','updating')
         )
         AND NOT EXISTS (SELECT 1 FROM lessons WHERE status IN ('scheduled','pending','updating') AND start<? AND end>?)
         AND NOT EXISTS (SELECT 1 FROM lessons WHERE status='updating' AND move_start<? AND move_end>?)
       `).bind(lid,name,phone,phone,slot.start,slot.end,eventId,now(),now(),PRIVACY_POLICY_VERSION,s.meetUrl,'Бесплатный пробный урок',phone,slot.end,slot.start,slot.end,slot.start);
   const locks=slotKeys(slot.start,slot.end).map(key=>database.prepare(
     'INSERT INTO slot_locks (slot,lesson_id) SELECT ?,? WHERE EXISTS (SELECT 1 FROM lessons WHERE id=?)'
   ).bind(key,lid,lid));
   try {
     const [result]=await database.batch([insert,...locks]);
     if(!result.meta.changes){
       if(paid)throw new HttpError('Время заняли или на балансе недостаточно свободных занятий.',409);
       const duplicate=await db().prepare("SELECT 1 FROM lessons WHERE trial_phone=? AND type='trial' AND status IN ('scheduled','pending','updating')").bind(phone).first();
       throw new HttpError(duplicate?'На этот телефон уже записан пробный урок. Свяжись с репетитором для изменения записи.':'Это время только что заняли. Выбери другое окно.',409);
     }
   } catch(e) {
     if(e instanceof HttpError)throw e;
     const message=e instanceof Error?e.message:'';
     if(/UNIQUE constraint failed: lessons\.trial_phone/i.test(message))throw new HttpError('На этот телефон уже записан пробный урок. Свяжись с репетитором для изменения записи.',409);
     if(/UNIQUE constraint failed: slot_locks\.slot|SQLITE_CONSTRAINT_UNIQUE/i.test(message))throw new HttpError('Это время только что заняли. Выбери другое окно.',409);
     console.error('Booking reservation failed:',message||'Unknown error');
     throw new HttpError('Не удалось зарезервировать время. Попробуй ещё раз.',503);
   }
   let jazzRoomId:string|null=null,meetingUrl=s.meetUrl,calendarAttempted=false;
   try{
     if(saluteJazzConfigured(secrets)){
       const room=await createSaluteJazzRoom('codeTogether · '+(paid?'Урок':'Пробный урок'),secrets);
       jazzRoomId=room.roomId;meetingUrl=room.roomUrl;
       await db().prepare("UPDATE lessons SET jazz_room_id=?,meet_url=? WHERE id=? AND status='pending'").bind(jazzRoomId,meetingUrl,lid).run();
     }
     calendarAttempted=true;
     await calendar(eventPath(),'POST',{id:eventId,summary:'codeTogether · '+(paid?'Урок':'Пробный урок')+' · '+name,description:paid?'Индивидуальное занятие по Python':'Пробный урок, 45 минут. Телефон: '+phone,start:{dateTime:slot!.start,timeZone:'Europe/Moscow'},end:{dateTime:slot!.end,timeZone:'Europe/Moscow'},...(meetingUrl?{location:meetingUrl}:{})});
     await db().prepare("UPDATE lessons SET status='scheduled',operation_started_at=NULL WHERE id=? AND status='pending'").bind(lid).run();
   }catch(e){
     let calendarCleared=!calendarAttempted,roomCleared=!jazzRoomId;
     if(calendarAttempted){try{await calendar(eventPath(eventId),'DELETE');calendarCleared=true;}catch{calendarCleared=false;}}
     if(jazzRoomId){try{await db().prepare("UPDATE lessons SET jazz_room_id=?,jazz_room_needs_recreation=1 WHERE id=? AND status='pending'").bind(jazzRoomId,lid).run();try{await disableSaluteJazzRoom(jazzRoomId,secrets);roomCleared=true;}catch{roomCleared=false;}}catch{roomCleared=false;}}
     if(calendarCleared&&roomCleared)await db().batch([db().prepare('DELETE FROM slot_locks WHERE lesson_id=?').bind(lid),db().prepare("DELETE FROM lessons WHERE id=? AND status='pending'").bind(lid)]);
     else throw new HttpError('Не удалось безопасно завершить создание встречи. Время оставлено зарезервированным для сверки; свяжись с репетитором.',503);
     throw e;
   }
   return json({lesson:await db().prepare('SELECT * FROM lessons WHERE id=?').bind(lid).first()},201);
 }
 if(path[0]==='workspace'&&method==='GET'){
   const u=await auth(request);await cleanup();const isTeacher=u.role==='teacher';
   const courses=isTeacher?await all('SELECT * FROM courses ORDER BY position,title'):await all('SELECT c.* FROM courses c JOIN course_enrollments e ON e.course_id=c.id WHERE e.student_id=? ORDER BY c.position,c.title',u.id);
   const courseEnrollments=isTeacher?await all('SELECT course_id,student_id FROM course_enrollments'):[];
   const topics=isTeacher?await all('SELECT * FROM topics ORDER BY course_id,position,title'):await all('SELECT t.id,t.course_id,t.title,t.description,t.format,t.position,CASE WHEN a.id IS NULL THEN 1 ELSE 0 END locked,CASE WHEN a.id IS NULL THEN \'\' ELSE t.content END content,CASE WHEN a.id IS NULL THEN NULL ELSE t.colab_url END colab_url FROM topics t JOIN course_enrollments e ON e.course_id=t.course_id AND e.student_id=? LEFT JOIN topic_access a ON a.topic_id=t.id AND a.student_id=? ORDER BY t.course_id,t.position,t.title',u.id,u.id);
   const assignments=isTeacher?await all('SELECT * FROM assignments'):await all(`SELECT a.id,a.topic_id,a.student_id,a.lesson_id,a.title,a.kind,a.prompt,a.options FROM assignments a
     WHERE ((a.topic_id IS NOT NULL AND EXISTS (SELECT 1 FROM topics t JOIN course_enrollments e ON e.course_id=t.course_id AND e.student_id=? JOIN topic_access x ON x.topic_id=t.id AND x.student_id=? WHERE t.id=a.topic_id))
       OR (a.topic_id IS NULL AND a.student_id=?))
       AND (a.lesson_id IS NULL OR EXISTS (SELECT 1 FROM lessons l WHERE l.id=a.lesson_id AND l.student_id=?))`,u.id,u.id,u.id,u.id);
   const [paymentLink,paymentRequests]=await Promise.all([
     db().prepare("SELECT value FROM settings WHERE key='payment-link'").first<{value:string}>(),
     isTeacher?all('SELECT * FROM payment_requests ORDER BY created_at DESC'):all('SELECT * FROM payment_requests WHERE student_id=? ORDER BY created_at DESC',u.id),
   ]);
   return json({user:u,lessons:isTeacher?await all('SELECT * FROM lessons ORDER BY start'):await all('SELECT * FROM lessons WHERE student_id=? ORDER BY start',u.id),courses,courseEnrollments,topics,assignments,submissions:isTeacher?await all('SELECT * FROM submissions ORDER BY created_at'):await all('SELECT * FROM submissions WHERE student_id=? ORDER BY created_at',u.id),students:isTeacher?(await all("SELECT * FROM users WHERE role='student'")).map(safeUser):[u],rooms:isTeacher?await all('SELECT * FROM rooms'):await all('SELECT * FROM rooms WHERE student_id=?',u.id),notifications:isTeacher?await all('SELECT * FROM notifications ORDER BY created_at DESC'):await all('SELECT * FROM notifications WHERE student_id=? ORDER BY created_at DESC',u.id),paymentLink:paymentLink?.value||null,paymentRequests,schedule:isTeacher?await schedule():undefined,configured:calendarConfigured(),saluteJazzConfigured:saluteJazzConfigured(secrets)});
 }
 if(path[0]==='students'&&method==='POST'){
   await teacher(request);requireValue(text(body.name)&&text(body.parent_name)&&text(body.login),'Обязательны имя, возраст, родитель и логин.');requireValue(Number.isInteger(body.age)&&body.age!>=1&&body.age!<=100,'Укажи корректный возраст.');requireValue(Number.isSafeInteger(body.balance)&&body.balance!>=-1000000&&body.balance!<=1000000&&(!body.balance||body.balance>=0||Boolean(body.id)),'Баланс должен быть целым числом от -1 000 000 до 1 000 000.');requireValue(body.price_per_lesson===undefined||Number.isInteger(body.price_per_lesson)&&body.price_per_lesson!>=1&&body.price_per_lesson!<=1000000,'Цена занятия должна быть целым числом от 1 до 1 000 000 ₽.');requireValue(!body.password||typeof body.password==='string'&&body.password.length>=8&&body.password.length<=128,'Пароль — от 8 до 128 символов.');
   const uid=body.id||id();const existing=body.id?await db().prepare("SELECT id,price_per_lesson FROM users WHERE id=? AND role='student'").bind(body.id).first<{id:string;price_per_lesson:number}>():null;requireValue(!body.id||existing,'Ученик не найден.',404);if(!existing)requireValue(body.password,'Укажи пароль.');const pricePerLesson=body.price_per_lesson??existing?.price_per_lesson??1000;
   try{if(existing){await db().prepare('UPDATE users SET name=?,age=?,parent_name=?,login=?,phone=?,parent_phone=?,balance=?,price_per_lesson=? WHERE id=?').bind(text(body.name),body.age,text(body.parent_name),text(body.login,100),text(body.phone),text(body.parent_phone),body.balance,pricePerLesson,uid).run();if(body.password)await db().batch([db().prepare('UPDATE users SET password=? WHERE id=?').bind(await passwordHash(body.password),uid),db().prepare('DELETE FROM sessions WHERE user_id=?').bind(uid)]);}else{await db().prepare("INSERT INTO users (id,name,age,parent_name,login,password,phone,parent_phone,balance,price_per_lesson,role,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,'student',?)").bind(uid,text(body.name),body.age,text(body.parent_name),text(body.login,100),await passwordHash(body.password!),text(body.phone),text(body.parent_phone),body.balance,pricePerLesson,now()).run();}}catch(e){if(e instanceof HttpError)throw e;throw new HttpError('Этот логин уже используется. Выбери другой.',409);}
   return json({ok:true});
 }
 if(path[0]==='students'&&path[1]&&method==='DELETE'){
   await teacher(request);
   const studentId=path[1];
   const student=await db().prepare("SELECT id FROM users WHERE id=? AND role='student'").bind(studentId).first();
   requireValue(student,'Ученик не найден.',404);
   const active=await db().prepare("SELECT COUNT(*) AS count FROM lessons WHERE student_id=? AND status IN ('scheduled','pending','updating','completing')").bind(studentId).first<{count:number}>();
   requireValue(Number(active?.count)===0,'Сначала отмени или заверши активные уроки ученика.',409);
   const database=db(),absent="NOT EXISTS (SELECT 1 FROM users WHERE id=? AND role='student')";
   const results=await database.batch([
     database.prepare("DELETE FROM users WHERE id=? AND role='student' AND NOT EXISTS (SELECT 1 FROM lessons WHERE student_id=? AND status IN ('scheduled','pending','updating','completing'))").bind(studentId,studentId),
     database.prepare("INSERT INTO settings (key,value) SELECT 'salutejazz-close:'||jazz_room_id,? FROM lessons WHERE student_id=? AND jazz_room_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE id=? AND role='student') GROUP BY jazz_room_id ON CONFLICT(key) DO NOTHING").bind(JSON.stringify({attempts:0,nextAttemptAt:0}),studentId,studentId),
     database.prepare(`DELETE FROM sessions WHERE user_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM notifications WHERE student_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM rooms WHERE student_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM typing_results WHERE student_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM course_enrollments WHERE student_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM topic_access WHERE student_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM submissions WHERE (student_id=? OR assignment_id IN (SELECT id FROM assignments WHERE student_id=? OR lesson_id IN (SELECT id FROM lessons WHERE student_id=?))) AND ${absent}`).bind(studentId,studentId,studentId,studentId),
     database.prepare(`DELETE FROM assignments WHERE (student_id=? OR lesson_id IN (SELECT id FROM lessons WHERE student_id=?)) AND ${absent}`).bind(studentId,studentId,studentId),
     database.prepare(`DELETE FROM slot_locks WHERE lesson_id IN (SELECT id FROM lessons WHERE student_id=?) AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM payment_requests WHERE student_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM lessons WHERE student_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM settings WHERE key=? AND ${absent}`).bind('cancel-lock:'+studentId,studentId),
   ]);
   requireValue(results[0]?.meta.changes,'Активный урок не позволяет удалить ученика. Обнови список и попробуй снова.',409);
   return json({ok:true});
 }
 if(path[0]==='settings'&&method==='POST'){
   await teacher(request);
   const hasWeekly=body.weeklyAvailability&&typeof body.weeklyAvailability==='object'&&!Array.isArray(body.weeklyAvailability);
   const weeklyAvailability:Record<number,{from:string;to:string}[]>={};
   if(hasWeekly){
     for(const [day,value] of Object.entries(body.weeklyAvailability!)){
       requireValue(/^[0-6]$/.test(day)&&Array.isArray(value)&&value.length<=10,'Проверь рабочие часы по дням недели.');
       const ranges=(value as unknown[]).map(range=>{const item=range&&typeof range==='object'?range as Record<string,unknown>:{};return {from:text(item.from,5),to:text(item.to,5)};}).sort((a,b)=>a.from.localeCompare(b.from));
       for(let i=0;i<ranges.length;i++){
         const range=ranges[i];requireValue(/^([01]\d|2[0-3]):[0-5]\d$/.test(range.from)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(range.to)&&range.from<range.to,'Укажи корректное время доступности.');
         requireValue(i===0||ranges[i-1].to<=range.from,'Интервалы в одном дне не должны пересекаться.');
       }
       weeklyAvailability[Number(day)]=ranges;
     }
   }else{
     requireValue(Array.isArray(body.days)&&body.days.every((d:unknown)=>typeof d==='number'&&Number.isInteger(d)&&d>=0&&d<7),'Проверь рабочие дни.');
     requireValue(/^\d{2}:\d{2}$/.test(body.from||'')&&/^\d{2}:\d{2}$/.test(body.to||'')&&(body.from||'')<(body.to||'')&&(body.to||'')<='23:59','Проверь рабочие часы.');
     for(const day of [...new Set(body.days!)] as number[])weeklyAvailability[day]=[{from:body.from!,to:body.to!}];
   }
   const incomingOverrides=body.dateOverrides??{};requireValue(incomingOverrides&&typeof incomingOverrides==='object'&&!Array.isArray(incomingOverrides)&&Object.keys(incomingOverrides).length<=365,'Слишком много изменений для отдельных дат.');
   const dateOverrides:Record<string,{from:string;to:string}[]>={};
   for(const [date,value] of Object.entries(incomingOverrides)){
     requireValue(validDateKey(date)&&Array.isArray(value)&&(value as unknown[]).length<=10,'Проверь изменение для выбранной даты.');
     const ranges=(value as unknown[]).map(range=>{const item=range&&typeof range==='object'?range as Record<string,unknown>:{};return {from:text(item.from,5),to:text(item.to,5)};}).sort((a,b)=>a.from.localeCompare(b.from));
     for(let i=0;i<ranges.length;i++){
       const range=ranges[i];requireValue(/^([01]\d|2[0-3]):[0-5]\d$/.test(range.from)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(range.to)&&range.from<range.to,'Укажи корректное время для отдельной даты.');
       requireValue(i===0||ranges[i-1].to<=range.from,'Интервалы в одном дне не должны пересекаться.');
     }
     dateOverrides[date]=ranges;
   }
   const selectedCalendars=Array.isArray(body.availabilityCalendarIds)?[...new Set(body.availabilityCalendarIds.filter((calendarId):calendarId is string=>typeof calendarId==='string'&&calendarId.length<=255))]:[];
   requireValue(selectedCalendars.length<=10,'Можно выбрать до 10 календарей для проверки занятости.');
   const currentCalendars=(await schedule()).availabilityCalendarIds||[];
   const calendarsChanged=selectedCalendars.length!==currentCalendars.length||selectedCalendars.some(calendarId=>!currentCalendars.includes(calendarId));
   let calendarList:{items:CalendarItem[]}={items:[]};
   if(selectedCalendars.length&&calendarsChanged){calendarList=await calendar('users/me/calendarList?maxResults=250') as {items:CalendarItem[]};const accessible=new Set(calendarList.items.filter(item=>['owner','writer','writerWithoutPrivateAccess','reader','freeBusyReader'].includes(item.accessRole||'')).map(item=>item.id));requireValue(selectedCalendars.every(calendarId=>accessible.has(calendarId)),'Один из календарей недоступен. Обнови список и выбери календарь снова.',409);}
   const targetIds=new Set(calendarList.items.filter(item=>item.id===secrets.GOOGLE_CALENDAR_ID||(secrets.GOOGLE_CALENDAR_ID==='primary'&&item.primary)).map(item=>item.id));
   if(calendarsChanged&&selectedCalendars.length)requireValue(!selectedCalendars.some(calendarId=>targetIds.has(calendarId)),'Календарь для новых уроков уже проверяется автоматически.');
   const normalized=normalizeSchedule({weeklyAvailability,dateOverrides,availabilityCalendarIds:selectedCalendars,timezone:text(body.timezone,64)||'Europe/Moscow',meetUrl:httpsUrl(body.meetUrl)});
   await db().prepare("INSERT INTO settings (key,value) VALUES ('schedule',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(JSON.stringify(normalized)).run();return json({ok:true});
 }
 if(path[0]==='courses'&&method==='POST'){
   await teacher(request);const courseId=text(body.id,100)||id(),title=text(body.title,120),description=text(body.description,1000);requireValue(title,'Укажи название курса.');
   const existing=body.id?await db().prepare('SELECT id,position FROM courses WHERE id=?').bind(courseId).first<Row>():null;
   const studentIds=Array.isArray(body.studentIds)?[...new Set(body.studentIds.filter((x):x is string=>typeof x==='string'&&x.length<=100))]:[];requireValue(studentIds.length<=200,'В одном курсе может быть не более 200 учеников.');
   if(studentIds.length){const found=await all(`SELECT id FROM users WHERE role='student' AND id IN (${studentIds.map(()=>'?').join(',')})`,...studentIds);requireValue(found.length===studentIds.length,'В списке есть неизвестный ученик.');}
   const position=Number.isInteger(body.position)&&body.position!>=0?body.position!:existing?.position??Number((await db().prepare('SELECT COALESCE(MAX(position),-1)+1 position FROM courses').first<Row>())?.position||0);
   const statements=[db().prepare('INSERT INTO courses (id,title,description,position) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,position=excluded.position').bind(courseId,title,description||null,position)];
   if(studentIds.length)statements.push(db().prepare(`DELETE FROM course_enrollments WHERE course_id=? AND student_id NOT IN (${studentIds.map(()=>'?').join(',')})`).bind(courseId,...studentIds));else statements.push(db().prepare('DELETE FROM course_enrollments WHERE course_id=?').bind(courseId));
   statements.push(...studentIds.map(studentId=>db().prepare('INSERT OR IGNORE INTO course_enrollments (id,course_id,student_id) VALUES (?,?,?)').bind(id(),courseId,studentId)));
   await db().batch(statements);return json({ok:true,id:courseId});
 }
 if(path[0]==='topics'&&path[1]==='order'&&method==='POST'){
   await teacher(request);const courseId=text(body.courseId,100),topicIds=Array.isArray(body.topicIds)?body.topicIds:[];requireValue(await db().prepare('SELECT id FROM courses WHERE id=?').bind(courseId).first(),'Курс не найден.');
   requireValue(topicIds.length<=500&&topicIds.every((x):x is string=>typeof x==='string')&&new Set(topicIds).size===topicIds.length,'Некорректный порядок тем.');
   const topics=await all('SELECT id FROM topics WHERE course_id=?',courseId);requireValue(topics.length===topicIds.length&&topics.every(t=>topicIds.includes(t.id)),'Список тем курса изменился. Обнови страницу.',409);
   await db().batch(topicIds.map((topicId:string,position:number)=>db().prepare('UPDATE topics SET position=? WHERE id=? AND course_id=?').bind(position,topicId,courseId)));return json({ok:true});
 }
 if(path[0]==='topics'&&method==='POST'){
   await teacher(request);requireValue(text(body.title)&&['md','ipynb'].includes(body.format||'')&&typeof body.content==='string'&&body.content.length<=2000000,'Проверь название, формат и размер материала.');const courseId=text(body.course_id,100);requireValue(await db().prepare('SELECT id FROM courses WHERE id=?').bind(courseId).first(),'Курс не найден.');if(body.format==='ipynb'){let parsed:{cells?:unknown[]}={};try{parsed=JSON.parse(body.content!) as {cells?:unknown[]};}catch{}requireValue(Array.isArray(parsed.cells),'Некорректный блокнот Jupyter.');}const colab=httpsUrl(body.colab_url);if(colab)requireValue(new URL(colab).hostname==='colab.research.google.com','Укажи ссылку Google Colab.');
   const position=Number.isInteger(body.position)&&body.position!>=0?body.position!:Number((await db().prepare('SELECT COALESCE(MAX(position),-1)+1 position FROM topics WHERE course_id=?').bind(courseId).first<Row>())?.position||0);
   await db().prepare('INSERT INTO topics (id,course_id,title,description,content,format,colab_url,position) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET course_id=excluded.course_id,title=excluded.title,description=excluded.description,content=excluded.content,format=excluded.format,colab_url=excluded.colab_url,position=excluded.position').bind(body.id||id(),courseId,text(body.title),text(body.description,500),body.content,body.format,colab,position).run();return json({ok:true});
 }
 if(path[0]==='access'&&method==='POST'){
   await teacher(request);requireValue(await db().prepare("SELECT id FROM users WHERE id=? AND role='student'").bind(body.studentId).first(),'Ученик не найден.');const topic=await db().prepare('SELECT course_id FROM topics WHERE id=?').bind(body.topicId).first<Row>();requireValue(topic,'Тема не найдена.');requireValue(await db().prepare('SELECT id FROM course_enrollments WHERE course_id=? AND student_id=?').bind(topic!.course_id,body.studentId).first(),'Сначала открой доступ ученику к курсу.');if(body.enabled)await db().prepare('INSERT OR IGNORE INTO topic_access (id,topic_id,student_id) VALUES (?,?,?)').bind(id(),body.topicId,body.studentId).run();else await db().prepare('DELETE FROM topic_access WHERE topic_id=? AND student_id=?').bind(body.topicId,body.studentId).run();return json({ok:true});
 }
 if(path[0]==='notifications'&&method==='POST'){
   await teacher(request);requireValue(await db().prepare("SELECT id FROM users WHERE id=? AND role='student'").bind(body.student_id).first(),'Выбери ученика.');requireValue(text(body.title)&&text(body.body,4000),'Добавь заголовок и сообщение.');await db().prepare('INSERT INTO notifications (id,student_id,title,body,created_at) VALUES (?,?,?,?,?)').bind(id(),body.student_id,text(body.title),text(body.body,4000),now()).run();return json({ok:true});
 }
 if(path[0]==='assignments'&&method==='POST'){
   await teacher(request);requireValue(text(body.title)&&text(body.prompt,20000)&&['code','quiz','text'].includes(body.kind||''),'Проверь данные задания.');const topicId=text(body.topic_id,100)||null,studentId=text(body.student_id,100)||null;requireValue(Boolean(topicId)!==Boolean(studentId),'Выбери тему курса или одного ученика.');if(topicId)requireValue(await db().prepare('SELECT id FROM topics WHERE id=?').bind(topicId).first(),'Тема не найдена.');if(studentId)requireValue(await db().prepare("SELECT id FROM users WHERE id=? AND role='student'").bind(studentId).first(),'Ученик не найден.');if(body.kind==='quiz')requireValue(Array.isArray(body.options)&&body.options.length>=2&&body.options.length<=20&&Number(body.answer)>=0&&Number(body.answer)<body.options.length,'Проверь варианты и номер правильного ответа.');const lessonId=text(body.lesson_id,100)||null;if(lessonId){const lesson=await db().prepare('SELECT student_id FROM lessons WHERE id=?').bind(lessonId).first<Row>();requireValue(lesson,'Урок не найден.');if(studentId)requireValue(lesson!.student_id===studentId,'Урок не принадлежит выбранному ученику.');}
   await db().prepare('INSERT INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET topic_id=excluded.topic_id,student_id=excluded.student_id,lesson_id=excluded.lesson_id,title=excluded.title,kind=excluded.kind,prompt=excluded.prompt,options=excluded.options,answer=excluded.answer,tests=NULL').bind(body.id||id(),topicId,studentId,lessonId,text(body.title),body.kind,text(body.prompt,20000),body.kind==='quiz'?JSON.stringify(body.options):null,body.kind==='quiz'?String(body.answer):null,null).run();return json({ok:true});
 }
 if(path[0]==='submit'&&method==='POST'){
   const u=await auth(request);requireValue(u.role==='student','Отправка доступна ученику.',403);const a=await db().prepare(`SELECT a.* FROM assignments a WHERE a.id=? AND ((a.student_id=? AND a.topic_id IS NULL) OR (a.topic_id IS NOT NULL AND EXISTS (SELECT 1 FROM topics t JOIN course_enrollments e ON e.course_id=t.course_id AND e.student_id=? JOIN topic_access x ON x.topic_id=t.id AND x.student_id=? WHERE t.id=a.topic_id))) AND (a.lesson_id IS NULL OR EXISTS (SELECT 1 FROM lessons l WHERE l.id=a.lesson_id AND l.student_id=?))`).bind(body.assignmentId,u.id,u.id,u.id,u.id).first<Row>();requireValue(a,'Задание недоступно.',403);const content=text(body.content,50000);requireValue(content,'Добавь решение.');
   let result:{status:string;tests?:{number:number;passed:boolean}[]}={status:'pending'};
   if(a!.kind==='quiz')result={status:content===a!.answer?'passed':'failed',tests:[{number:1,passed:content===a!.answer}]};
   const submission={id:id(),assignment_id:a!.id,student_id:u.id,content,result:JSON.stringify(result),created_at:now()};await db().prepare('INSERT INTO submissions (id,assignment_id,student_id,content,result,created_at) VALUES (?,?,?,?,?,?)').bind(...Object.values(submission)).run();return json({submission});
 }
 if(path[0]==='submissions'&&path[1]&&method==='POST'){await teacher(request);requireValue(body.status==='passed'||body.status==='needs_work','Некорректный результат.');const submission=await db().prepare('SELECT result FROM submissions WHERE id=?').bind(path[1]).first<Row>();requireValue(submission,'Работа не найдена.',404);requireValue(resultStatus(submission!.result)==='pending','Эта работа уже проверена.',409);const feedback=text(body.feedback,2000);await db().prepare('UPDATE submissions SET result=?,feedback=?,feedback_at=? WHERE id=?').bind(JSON.stringify({status:body.status}),feedback||null,feedback?now():null,path[1]).run();return json({ok:true});}
 if(path[0]==='lesson-details'&&method==='POST'){await teacher(request);const l=await db().prepare('SELECT * FROM lessons WHERE id=?').bind(body.id).first<Row>();requireValue(l,'Урок не найден.',404);const meet=httpsUrl(body.meet_url);if(l!.event_id&&l!.status==='scheduled')await calendar(eventPath(l!.event_id),'PATCH',{summary:'codeTogether · '+text(body.topic),location:meet});await db().prepare('UPDATE lessons SET topic=?,meet_url=? WHERE id=?').bind(text(body.topic),meet,body.id).run();return json({ok:true});}
 if(path[0]==='lessons'&&path[1]&&method==='POST'){
   const {u,l}=await lessonAccess(request,path[1]);
   if(path[2]==='move-retry'){
     requireValue(l.status==='updating'&&l.move_id&&l.move_start&&l.move_end&&l.event_id,'Нет переноса, ожидающего подтверждения.',409);
     await confirmLessonMove({
       lessonId:l.id,eventId:l.event_id,operationId:l.move_id,
       original:{start:l.start,end:l.end},target:{start:l.move_start,end:l.move_end},
     });
     return json({lesson:await db().prepare('SELECT * FROM lessons WHERE id=?').bind(l.id).first()});
   }
   requireValue(l.status==='scheduled','Урок уже изменён. Обнови расписание.',409);
   if(!path[2]){
     requireValue(l.event_id,'У этого урока нет события Google Календаря.',409);
     requireValue(canReschedule(l as Lesson),'До начала осталось менее 2 часов. Перенос недоступен, но можно отменить урок.');
     const start=text(body.start,40);
     requireValue(Number.isFinite(Date.parse(start)),'Выбери время.');
     const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Moscow'}).format(new Date(start));
     const available=await slots(date,l.type==='trial'?45:55,l.id);
     const slot=available.slots.find(s=>s.start===start);
     requireValue(slot,'Это время уже занято.',409);
     if(slot.start===l.start&&slot.end===l.end)return json({lesson:l});
     requireValue(canReschedule(l as Lesson),'До начала осталось менее 2 часов. Перенос недоступен, но можно отменить урок.');
     const move={
       lessonId:l.id,eventId:l.event_id,operationId:id(),
       original:{start:l.start,end:l.end},target:slot,
     };
     try{
       await reserveLessonMove(move);
     }catch(e){
       if(e instanceof HttpError)throw e;
       throw new HttpError('Это окно только что заняли. Выбери другое время.',409);
     }
     await confirmLessonMove(move);
     return json({lesson:await db().prepare('SELECT * FROM lessons WHERE id=?').bind(l.id).first()});
   }
   requireValue(path[2]==='cancel'||path[2]==='complete','Действие с уроком не найдено.',404);
   if(path[2]==='complete'){requireValue(u.role==='teacher','Только репетитор завершает урок.',403);requireValue(Date.parse(l.end)<=Date.now(),'Урок ещё не завершился.');const r=await db().prepare("UPDATE lessons SET status='completing',operation_started_at=? WHERE id=? AND status='scheduled'").bind(now(),l.id).run();requireValue(r.meta.changes,'Урок уже изменён.',409);await db().batch([db().prepare("UPDATE users SET balance=balance-1 WHERE id=? AND EXISTS (SELECT 1 FROM lessons WHERE id=? AND status='completing' AND type='paid')").bind(l.student_id,l.id),db().prepare("UPDATE lessons SET status='completed',operation_started_at=NULL WHERE id=? AND status='completing'").bind(l.id),db().prepare('DELETE FROM slot_locks WHERE lesson_id=?').bind(l.id)]);await retireMeeting(l.id,l.jazz_room_id);return json({ok:true});}
   const claimed=await db().prepare("UPDATE lessons SET status='updating',operation_started_at=? WHERE id=? AND status='scheduled'").bind(now(),l.id).run();requireValue(claimed.meta.changes,'Изменение уже выполняется. Обнови расписание.',409);
   let cancelExternalActionStarted=false;
   try{
    if(path[2]==='cancel'){
      requireValue(Date.parse(l.start)>Date.now()||u.role==='teacher','Уже начавшийся урок может отменить только репетитор.',400);
      // Serialize cancellation count per pupil, so concurrent cancellations cannot both be free.
      const lock='cancel-lock:'+l.student_id;
      try{if(l.student_id)await db().prepare('INSERT INTO settings (key,value) VALUES (?,?)').bind(lock,l.id).run();}catch{throw new HttpError('Другая отмена ещё выполняется. Повтори через несколько секунд.',409);}
      const bounds=monthBounds(new Date());const count=await db().prepare("SELECT COUNT(*) n FROM lessons WHERE student_id=? AND type='paid' AND status='cancelled' AND (cancelled_by IS NULL OR cancelled_by='student') AND cancelled_at>=? AND cancelled_at<?").bind(l.student_id,bounds.start,bounds.end).first<{n:number}>();const charged=u.role==='student'&&l.type==='paid'&&Number(count?.n)>=3;requireValue(u.role==='teacher'||Boolean(body.expectedCharged)===charged,'Условия отмены изменились. Обнови расписание и проверь списание.',409);await db().prepare("UPDATE lessons SET charged=? WHERE id=? AND status='updating'").bind(charged?1:0,l.id).run();cancelExternalActionStarted=true;await calendar(eventPath(l.event_id),'DELETE');await db().batch([db().prepare("UPDATE lessons SET status='cancelled',cancelled_at=?,cancelled_by=?,charged=?,operation_started_at=NULL WHERE id=? AND status='updating'").bind(now(),u.role,charged?1:0,l.id),db().prepare('DELETE FROM slot_locks WHERE lesson_id=?').bind(l.id),...(charged?[db().prepare('UPDATE users SET balance=balance-1 WHERE id=?').bind(l.student_id)]:[]),db().prepare('DELETE FROM settings WHERE key=? AND value=?').bind(lock,l.id)]);await retireMeeting(l.id,l.jazz_room_id);return json({ok:true,charged});
    }
   }catch(e){if(path[2]==='cancel'&&!cancelExternalActionStarted){await db().prepare("UPDATE lessons SET status='scheduled',charged=0,operation_started_at=NULL WHERE id=? AND status='updating'").bind(l.id).run();if(l.student_id)await db().prepare('DELETE FROM settings WHERE key=? AND value=?').bind('cancel-lock:'+l.student_id,l.id).run();}throw e;}
 }
 if(path[0]==='rooms'){
   const u=await auth(request);await cleanup();
   if(!path[1]&&method==='GET'){
     const rooms=await all('SELECT id,student_id,name,language,revision,last_active FROM rooms WHERE last_active>?'+(u.role==='teacher'?'':' AND student_id=?')+' ORDER BY id',Date.now()-1800000,...(u.role==='teacher'?[]:[u.id]));
     const revisionKey=rooms.map(room=>`${room.id}:${room.revision}`).join('|');
     const etag=`W/"rooms-${await hash(`${u.role}:${u.id}:${revisionKey}`)}"`;
     const headers={'ETag':etag,'Cache-Control':'private, no-cache'};
     if(request.headers.get('if-none-match')?.split(',').map(value=>value.trim()).includes(etag))return new Response(null,{status:304,headers});
     return json({rooms},200,headers);
   }
   if(!path[1]&&method==='POST'){requireValue(u.role==='student','Комнату создаёт ученик.',403);const count=await db().prepare('SELECT COUNT(*) n FROM rooms WHERE student_id=?').bind(u.id).first<{n:number}>();requireValue(Number(count?.n)<3,'Можно открыть до трёх комнат одновременно.');const r={id:id(),student_id:u.id,name:'Комната · '+u.name,language:'python',student_code:PYTHON_START,teacher_code:TEACHER_START,revision:0,last_active:Date.now()};await db().prepare('INSERT INTO rooms (id,student_id,name,language,student_code,teacher_code,revision,last_active) VALUES (?,?,?,?,?,?,?,?)').bind(...Object.values(r)).run();return json({room:r},201);}
   const r=await db().prepare('SELECT * FROM rooms WHERE id=?').bind(path[1]).first<Row>();requireValue(r&&(u.role==='teacher'||r.student_id===u.id),'Комната удалена или недоступна.',404);
   if(path[2]==='compile-kumir'){
    requireValue(method==='POST','Компиляция принимает только POST.',404);
    requireValue(typeof body.code==='string'&&body.code.length>0&&body.code.length<=100000,'Исходный файл должен содержать от 1 до 100 000 символов.');
    const compilerUrl=secrets.QUMIR_COMPILER_URL;
    requireValue(compilerUrl,'Компилятор Кумир пока не настроен.',503);
    let compiled:Response;
    try{compiled=await fetch(new URL('/compile',compilerUrl),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:body.code}),signal:AbortSignal.timeout(6800)});}
    catch{throw new HttpError('Компилятор не ответил вовремя. Попробуй ещё раз.',503);}
    if(!compiled.ok){const result=await compiled.json().catch(()=>({error:'Не удалось скомпилировать программу.'})) as {error?:string};throw new HttpError((result.error||'Не удалось скомпилировать программу.').slice(0,4000),compiled.status===422?422:compiled.status===408?408:compiled.status===429?429:503);}
    const wasm=await compiled.arrayBuffer();requireValue(wasm.byteLength>=8&&wasm.byteLength<=4*1024*1024,'Компилятор вернул некорректный размер программы.',502);
    return new Response(wasm,{status:200,headers:{'Content-Type':'application/wasm','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
   }
   if(path[2]==='typing-results'){
    if(method==='GET'){
     const results=await all('SELECT id,language,exercise_id,wpm,accuracy,duration_ms,created_at FROM typing_results WHERE student_id=? ORDER BY created_at DESC,rowid DESC LIMIT 60',r!.student_id);
     return json({results});
    }
    requireValue(method==='POST','Действие с результатами тренировки не найдено.',404);
    requireValue(u.role==='student'&&r!.student_id===u.id,'Результат может отправить только ученик этой комнаты.',403);
    requireValue(typeof body.language==='string'&&['ru','en'].includes(body.language),'Выбери русский или английский язык тренировки.');
    requireValue(typeof body.exerciseId==='string'&&/^[a-z0-9-]{1,64}$/.test(body.exerciseId),'Некорректное упражнение.');
    requireValue(Number.isInteger(body.wpm)&&body.wpm!>=0&&body.wpm!<=250,'Проверь скорость печати.');
    requireValue(typeof body.accuracy==='number'&&Number.isFinite(body.accuracy)&&body.accuracy>=0&&body.accuracy<=100,'Проверь точность печати.');
    requireValue(Number.isInteger(body.durationMs)&&body.durationMs!>=1&&body.durationMs!<=900000,'Проверь длительность упражнения.');
    const resultId=id(),createdAt=now();
    await db().batch([
     db().prepare('INSERT INTO typing_results (id,student_id,room_id,language,exercise_id,wpm,accuracy,duration_ms,created_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(resultId,u.id,r!.id,body.language,body.exerciseId,body.wpm,body.accuracy,body.durationMs,createdAt),
     db().prepare('DELETE FROM typing_results WHERE student_id=? AND language=? AND id NOT IN (SELECT id FROM typing_results WHERE student_id=? AND language=? ORDER BY rowid DESC LIMIT 30)').bind(u.id,body.language,u.id,body.language),
    ]);
    return json({result:{id:resultId,language:body.language,exercise_id:body.exerciseId,wpm:body.wpm,accuracy:body.accuracy,duration_ms:body.durationMs,created_at:createdAt}},201);
   }
   if(method==='GET')return json({room:r});
   if(method==='POST'){
    requireValue(!body.language||['python','lua','kumir'].includes(body.language),'Поддерживаются Python, Lua и Кумир.');
    requireValue(body.file!=='teacher'||u.role==='teacher','Файл репетитора доступен ученику только для чтения.',403);
    requireValue(!body.file||['student','teacher'].includes(body.file),'Неизвестный файл.');
    if(body.file){
      requireValue(typeof body.update==='string'&&body.update.length<500000,'Некорректное изменение файла.');
      const column=body.file==='teacher'?'teacher_code':'student_code',stateColumn=body.file==='teacher'?'teacher_state':'student_state';
      let saved=false;
      for(let attempt=0;attempt<5;attempt++){
        const latest=await db().prepare('SELECT * FROM rooms WHERE id=?').bind(r!.id).first<Row>();requireValue(latest&&latest.last_active>Date.now()-1800000,'Комната удалена или недоступна.',404);
        const doc=documentFrom(latest![stateColumn],latest![column]);try{Y.applyUpdate(doc,decode(body.update));}catch{doc.destroy();throw new HttpError('Некорректное изменение файла.');}
        const code=doc.getText('code').toString();requireValue(code.length<=100000,'Максимальный размер файла — 100 000 символов.');const state=encode(doc);doc.destroy();requireValue(state.length<500000,'История комнаты слишком большая. Создай новую комнату.');
        const result=await db().prepare('UPDATE rooms SET '+column+'=?,'+stateColumn+'=?,revision=revision+1,last_active=? WHERE id=? AND revision=?').bind(code,state,Date.now(),r!.id,latest!.revision).run();if(result.meta.changes){saved=true;break;}
      }
      requireValue(saved,'Не удалось синхронизировать код. Изменения сохранены локально, повторим отправку.',409);
    }else if(body.language){
      let saved=false;
      for(let attempt=0;attempt<5;attempt++){
        const latest=await db().prepare('SELECT * FROM rooms WHERE id=?').bind(r!.id).first<Row>();
        requireValue(latest&&latest.last_active>Date.now()-1800000,'Комната удалена или недоступна.',404);
        const values:{student_code:string;student_state:string;teacher_code:string;teacher_state:string}={student_code:latest.student_code,student_state:latest.student_state||'',teacher_code:latest.teacher_code,teacher_state:latest.teacher_state||''};
        for(const file of ['student','teacher'] as const){
          const codeKey=file==='student'?'student_code':'teacher_code';
          const stateKey=file==='student'?'student_state':'teacher_state';
          if(starterLanguage(values[codeKey],file)!==latest.language)continue;
          const doc=documentFrom(values[stateKey],values[codeKey]);
          replaceText(doc,ROOM_STARTERS[body.language as RoomLanguage][file]);
          values[codeKey]=doc.getText('code').toString();
          values[stateKey]=encode(doc);
          doc.destroy();
        }
        const result=await db().prepare('UPDATE rooms SET language=?,student_code=?,student_state=?,teacher_code=?,teacher_state=?,revision=revision+1,last_active=? WHERE id=? AND revision=?').bind(body.language,values.student_code,values.student_state,values.teacher_code,values.teacher_state,Date.now(),r!.id,latest.revision).run();
        if(result.meta.changes){saved=true;break;}
      }
      requireValue(saved,'Не удалось обновить язык комнаты. Попробуй ещё раз.',409);
    }
    else await db().prepare('UPDATE rooms SET last_active=? WHERE id=?').bind(Date.now(),r!.id).run();
    return json({room:await db().prepare('SELECT * FROM rooms WHERE id=?').bind(r!.id).first()});
   }
 }
 throw new HttpError('Страница API не найдена.',404);
}
async function handle(request:Request){try{return await route(request);}catch(e){if(e instanceof HttpError)return json({error:e.message},e.status);console.error('codeTogether API:',e instanceof Error?e.message:'Unknown error');return json({error:'Сервис временно недоступен. Попробуй ещё раз.'},503);}}
export const GET=handle;
export const POST=handle;
export const DELETE=handle;
