import {db,secrets,HttpError,requireValue,auth,currentUser,safeUser,passwordHash,verifyPassword,hash,now,id,schedule,calendarConfigured,calendar,eventPath,slots,slotKeys,httpsUrl,cleanup} from '@/lib/server';
import {Lesson,canReschedule,PYTHON_START,TEACHER_START} from '@/lib/domain';
import {documentFrom,encode,decode,Y} from '@/lib/collaboration';
import {normalizeTrialPhone,limitTrialBooking} from '@/lib/trial-booking';
import {reserveLessonMove,confirmLessonMove} from '@/lib/lesson-move';
export const dynamic='force-dynamic';
type Row=Record<string,any>;
function json(data:unknown,status=200,headers:Record<string,string>={}){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});}
async function all(sql:string,...values:any[]){return (await db().prepare(sql).bind(...values).all<Row>()).results;}
const text=(v:unknown,max=200)=>typeof v==='string'?v.trim().slice(0,max):'';
async function teacher(request:Request){return auth(request,true);}
async function lessonAccess(request:Request,lessonId:string){const u=await auth(request);const l=await db().prepare('SELECT * FROM lessons WHERE id=?').bind(lessonId).first<Row>();requireValue(l&&(u.role==='teacher'||l.student_id===u.id),'Урок не найден.',404);return {u,l:l!};}
async function route(request:Request){
 const url=new URL(request.url),path=url.pathname.replace(/^\/api\//,'').split('/').filter(Boolean),method=request.method;
 if(method!=='GET'){const origin=request.headers.get('origin');requireValue(origin===url.origin,'Запрос с другого сайта запрещён.',403);const length=Number(request.headers.get('content-length')||0);requireValue(length<2200000,'Размер запроса слишком большой.',413);}
 const body:Row=method==='GET'?{}:await request.json().catch(()=>({})) as Row;
 if(path[0]==='reviews'&&method==='GET')return json({reviews:await all('SELECT id,name,body,rating FROM reviews WHERE published=1')});
 if(path[0]==='reviews'&&method==='POST'){await teacher(request);requireValue(text(body.name)&&text(body.body,5000)&&Number.isInteger(body.rating)&&body.rating>=1&&body.rating<=5,'Проверь имя, текст и оценку.');await db().prepare('INSERT INTO reviews (id,name,body,rating,published) VALUES (?,?,?,?,?)').bind(id(),text(body.name),text(body.body,5000),body.rating,body.published?1:0).run();return json({ok:true});}
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
     ? database.prepare("INSERT INTO lessons (id,student_id,name,start,end,type,status,event_id,meet_url,topic) SELECT ?,?,?,?,?,?,'pending',?,?,? WHERE (SELECT balance FROM users WHERE id=?)>(SELECT COUNT(*) FROM lessons WHERE student_id=? AND type='paid' AND status IN ('scheduled','pending','updating'))")
         .bind(lid,u!.id,name,slot.start,slot.end,'paid',eventId,s.meetUrl,'Индивидуальное занятие',u!.id,u!.id)
     : database.prepare(`
         INSERT INTO lessons (id,name,phone,trial_phone,start,end,type,status,event_id,meet_url,topic)
         SELECT ?,?,?,?,?,?,'trial','pending',?,?,?
         WHERE NOT EXISTS (
           SELECT 1 FROM lessons WHERE trial_phone = ? AND type = 'trial'
             AND status IN ('scheduled','pending','updating')
         )
       `).bind(lid,name,phone,phone,slot.start,slot.end,eventId,s.meetUrl,'Бесплатный пробный урок',phone);
   const locks=slotKeys(slot.start,slot.end).map(key=>database.prepare(
     'INSERT INTO slot_locks (slot,lesson_id) SELECT ?,? WHERE EXISTS (SELECT 1 FROM lessons WHERE id=?)'
   ).bind(key,lid,lid));
   try {
     const [result]=await database.batch([insert,...locks]);
     requireValue(result.meta.changes,paid
       ?'Недостаточно свободных занятий на балансе.'
       :'На этот телефон уже записан пробный урок. Свяжись с репетитором для изменения записи.',409);
   } catch(e) {
     if(e instanceof HttpError)throw e;
     throw new HttpError('Это время только что заняли. Выбери другое окно.',409);
   }
   try{await calendar(eventPath(),'POST',{id:eventId,summary:'codeTogether · '+(paid?'Урок':'Пробный урок')+' · '+name,description:paid?'Индивидуальное занятие по Python':'Пробный урок, 45 минут. Телефон: '+phone,start:{dateTime:slot!.start,timeZone:'Europe/Moscow'},end:{dateTime:slot!.end,timeZone:'Europe/Moscow'},...(s.meetUrl?{location:s.meetUrl}:{})});await db().prepare("UPDATE lessons SET status='scheduled' WHERE id=?").bind(lid).run();}
   catch(e){try{await calendar(eventPath(eventId),'DELETE');await db().batch([db().prepare('DELETE FROM slot_locks WHERE lesson_id=?').bind(lid),db().prepare("DELETE FROM lessons WHERE id=? AND status='pending'").bind(lid)]);}catch{throw new HttpError('Календарь не ответил однозначно. Время временно зарезервировано; свяжись с репетитором, прежде чем повторять запись.',503);}throw e;}
   return json({lesson:await db().prepare('SELECT * FROM lessons WHERE id=?').bind(lid).first()},201);
 }
 if(path[0]==='workspace'&&method==='GET'){
   const u=await auth(request);await cleanup();const isTeacher=u.role==='teacher';
   const topics=isTeacher?await all('SELECT * FROM topics ORDER BY position,title'):await all('SELECT t.id,t.title,t.description,t.format,t.position,CASE WHEN a.id IS NULL THEN 1 ELSE 0 END locked,CASE WHEN a.id IS NULL THEN ? ELSE t.content END content,CASE WHEN a.id IS NULL THEN NULL ELSE t.colab_url END colab_url FROM topics t LEFT JOIN topic_access a ON a.topic_id=t.id AND a.student_id=? ORDER BY t.position,t.title','',u.id);
   const assignments=isTeacher?await all('SELECT * FROM assignments'):await all('SELECT a.id,a.topic_id,a.lesson_id,a.title,a.kind,a.prompt,a.options FROM assignments a JOIN topic_access t ON t.topic_id=a.topic_id AND t.student_id=? WHERE a.lesson_id IS NULL OR a.lesson_id IN (SELECT id FROM lessons WHERE student_id=?)',u.id,u.id);
   return json({user:u,lessons:isTeacher?await all('SELECT * FROM lessons ORDER BY start'):await all('SELECT * FROM lessons WHERE student_id=? ORDER BY start',u.id),topics,assignments,submissions:isTeacher?await all('SELECT * FROM submissions ORDER BY created_at'):await all('SELECT * FROM submissions WHERE student_id=? ORDER BY created_at',u.id),students:isTeacher?(await all("SELECT * FROM users WHERE role='student'")).map(safeUser):[u],rooms:isTeacher?await all('SELECT * FROM rooms'):await all('SELECT * FROM rooms WHERE student_id=?',u.id),notifications:isTeacher?await all('SELECT * FROM notifications ORDER BY created_at DESC'):await all('SELECT * FROM notifications WHERE student_id=? ORDER BY created_at DESC',u.id),schedule:isTeacher?await schedule():undefined,configured:calendarConfigured(),runnerConfigured:!!(secrets.JUDGE0_URL&&secrets.JUDGE0_PYTHON_LANGUAGE_ID)});
 }
 if(path[0]==='students'&&method==='POST'){
   await teacher(request);requireValue(text(body.name)&&text(body.parent_name)&&text(body.login),'Обязательны имя, возраст, родитель и логин.');requireValue(Number.isInteger(body.age)&&body.age>=1&&body.age<=100,'Укажи корректный возраст.');requireValue(Number.isInteger(body.balance)&&body.balance>=0,'Баланс — целое неотрицательное число.');requireValue(!body.password||typeof body.password==='string'&&body.password.length>=8&&body.password.length<=128,'Пароль — от 8 до 128 символов.');
   const uid=body.id||id();const existing=body.id?await db().prepare("SELECT id FROM users WHERE id=? AND role='student'").bind(body.id).first():null;requireValue(!body.id||existing,'Ученик не найден.',404);if(!existing)requireValue(body.password,'Укажи пароль.');
   try{if(existing){await db().prepare('UPDATE users SET name=?,age=?,parent_name=?,login=?,phone=?,parent_phone=?,balance=? WHERE id=?').bind(text(body.name),body.age,text(body.parent_name),text(body.login,100),text(body.phone),text(body.parent_phone),body.balance,uid).run();if(body.password)await db().batch([db().prepare('UPDATE users SET password=? WHERE id=?').bind(await passwordHash(body.password),uid),db().prepare('DELETE FROM sessions WHERE user_id=?').bind(uid)]);}else{await db().prepare("INSERT INTO users (id,name,age,parent_name,login,password,phone,parent_phone,balance,role,created_at) VALUES (?,?,?,?,?,?,?,?,?,'student',?)").bind(uid,text(body.name),body.age,text(body.parent_name),text(body.login,100),await passwordHash(body.password),text(body.phone),text(body.parent_phone),body.balance,now()).run();}}catch(e){if(e instanceof HttpError)throw e;throw new HttpError('Этот логин уже используется. Выбери другой.',409);}
   return json({ok:true});
 }
 if(path[0]==='settings'&&method==='POST'){
   await teacher(request);requireValue(Array.isArray(body.days)&&body.days.every((d:any)=>Number.isInteger(d)&&d>=0&&d<7),'Проверь рабочие дни.');requireValue(/^\d{2}:\d{2}$/.test(body.from)&&/^\d{2}:\d{2}$/.test(body.to)&&body.from<body.to&&body.to<='23:59','Проверь рабочие часы.');const s={days:[...new Set(body.days)],from:body.from,to:body.to,timezone:'Europe/Moscow',meetUrl:httpsUrl(body.meetUrl)};await db().prepare("INSERT INTO settings (key,value) VALUES ('schedule',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(JSON.stringify(s)).run();return json({ok:true});
 }
 if(path[0]==='topics'&&method==='POST'){
   await teacher(request);requireValue(text(body.title)&&['md','ipynb'].includes(body.format)&&typeof body.content==='string'&&body.content.length<=2000000,'Проверь название, формат и размер материала.');if(body.format==='ipynb'){let parsed:any;try{parsed=JSON.parse(body.content);}catch{}requireValue(Array.isArray(parsed?.cells),'Некорректный блокнот Jupyter.');}const colab=httpsUrl(body.colab_url);if(colab)requireValue(new URL(colab).hostname==='colab.research.google.com','Укажи ссылку Google Colab.');
   await db().prepare('INSERT INTO topics (id,title,description,content,format,colab_url,position) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,content=excluded.content,format=excluded.format,colab_url=excluded.colab_url').bind(body.id||id(),text(body.title),text(body.description,500),body.content,body.format,colab,Number(body.position)||0).run();return json({ok:true});
 }
 if(path[0]==='access'&&method==='POST'){
   await teacher(request);requireValue(await db().prepare("SELECT id FROM users WHERE id=? AND role='student'").bind(body.studentId).first(),'Ученик не найден.');requireValue(await db().prepare('SELECT id FROM topics WHERE id=?').bind(body.topicId).first(),'Тема не найдена.');if(body.enabled)await db().prepare('INSERT OR IGNORE INTO topic_access (id,topic_id,student_id) VALUES (?,?,?)').bind(id(),body.topicId,body.studentId).run();else await db().prepare('DELETE FROM topic_access WHERE topic_id=? AND student_id=?').bind(body.topicId,body.studentId).run();return json({ok:true});
 }
 if(path[0]==='notifications'&&method==='POST'){
   await teacher(request);requireValue(await db().prepare("SELECT id FROM users WHERE id=? AND role='student'").bind(body.student_id).first(),'Выбери ученика.');requireValue(text(body.title)&&text(body.body,4000),'Добавь заголовок и сообщение.');await db().prepare('INSERT INTO notifications (id,student_id,title,body,created_at) VALUES (?,?,?,?,?)').bind(id(),body.student_id,text(body.title),text(body.body,4000),now()).run();return json({ok:true});
 }
 if(path[0]==='assignments'&&method==='POST'){
   await teacher(request);requireValue(text(body.title)&&text(body.prompt,20000)&&['code','quiz','text'].includes(body.kind),'Проверь данные задания.');requireValue(await db().prepare('SELECT id FROM topics WHERE id=?').bind(body.topic_id).first(),'Тема не найдена.');if(body.kind==='quiz')requireValue(Array.isArray(body.options)&&body.options.length>=2&&body.options.length<=20&&Number(body.answer)>=0&&Number(body.answer)<body.options.length,'Проверь варианты и номер правильного ответа.');if(body.kind==='code'){let tests:any;try{tests=JSON.parse(body.tests);}catch{}requireValue(Array.isArray(tests)&&tests.length>0&&tests.length<=20&&tests.every((t:any)=>typeof t.stdin==='string'&&typeof t.expected==='string'),'Тесты — JSON-массив объектов stdin и expected (до 20).');}if(body.lesson_id)requireValue(await db().prepare('SELECT id FROM lessons WHERE id=?').bind(body.lesson_id).first(),'Урок не найден.');
   await db().prepare('INSERT INTO assignments (id,topic_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET topic_id=excluded.topic_id,lesson_id=excluded.lesson_id,title=excluded.title,kind=excluded.kind,prompt=excluded.prompt,options=excluded.options,answer=excluded.answer,tests=excluded.tests').bind(body.id||id(),body.topic_id,body.lesson_id||null,text(body.title),body.kind,text(body.prompt,20000),body.kind==='quiz'?JSON.stringify(body.options):null,body.kind==='quiz'?String(body.answer):null,body.kind==='code'?body.tests:null).run();return json({ok:true});
 }
 if(path[0]==='submit'&&method==='POST'){
   const u=await auth(request);requireValue(u.role==='student','Отправка доступна ученику.',403);const a=await db().prepare('SELECT a.* FROM assignments a JOIN topic_access t ON t.topic_id=a.topic_id AND t.student_id=? WHERE a.id=?').bind(u.id,body.assignmentId).first<Row>();requireValue(a,'Задание недоступно.',403);if(a!.lesson_id)requireValue(await db().prepare('SELECT id FROM lessons WHERE id=? AND student_id=?').bind(a!.lesson_id,u.id).first(),'Это задание назначено другому ученику.',403);const content=text(body.content,50000);requireValue(content,'Добавь решение.');
   let result:any={status:'pending'};
   if(a!.kind==='quiz')result={status:content===a!.answer?'passed':'failed',tests:[{number:1,passed:content===a!.answer}]};
   if(a!.kind==='code'){
     requireValue(secrets.JUDGE0_URL&&secrets.JUDGE0_PYTHON_LANGUAGE_ID,'Сервис автопроверки ещё не настроен. Можно запустить код в терминале, а решение обсудить на уроке.',503);
     const tests=JSON.parse(a!.tests);const results=[];for(let i=0;i<tests.length;i++){const t=tests[i];const response=await fetch(secrets.JUDGE0_URL.replace(/\/$/,'')+'/submissions?base64_encoded=false&wait=true',{method:'POST',headers:{'Content-Type':'application/json',...(secrets.JUDGE0_TOKEN?{'X-Auth-Token':secrets.JUDGE0_TOKEN}:{})},body:JSON.stringify({language_id:Number(secrets.JUDGE0_PYTHON_LANGUAGE_ID),source_code:content,stdin:t.stdin,expected_output:t.expected,cpu_time_limit:2,wall_time_limit:5,memory_limit:65536,enable_network:false}),signal:AbortSignal.timeout(12000)});requireValue(response.ok,'Сервис проверки временно недоступен.',503);const r=await response.json() as any;requireValue(r.status?.id>=3,'Проверка ещё выполняется. Попробуй позже.',503);results.push({number:i+1,passed:r.status.id===3});}result={status:results.every(t=>t.passed)?'passed':'partial',tests:results};
   }
   const submission={id:id(),assignment_id:a!.id,student_id:u.id,content,result:JSON.stringify(result),created_at:now()};await db().prepare('INSERT INTO submissions (id,assignment_id,student_id,content,result,created_at) VALUES (?,?,?,?,?,?)').bind(...Object.values(submission)).run();return json({submission});
 }
 if(path[0]==='submissions'&&path[1]&&method==='POST'){await teacher(request);requireValue(body.status==='passed'||body.status==='needs_work','Некорректный результат.');requireValue(await db().prepare('SELECT id FROM submissions WHERE id=?').bind(path[1]).first(),'Работа не найдена.',404);const feedback=text(body.feedback,2000);await db().prepare('UPDATE submissions SET result=?,feedback=?,feedback_at=? WHERE id=?').bind(JSON.stringify({status:body.status}),feedback||null,feedback?now():null,path[1]).run();return json({ok:true});}
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
   if(path[2]==='complete'){requireValue(u.role==='teacher','Только репетитор завершает урок.',403);requireValue(Date.parse(l.end)<=Date.now(),'Урок ещё не завершился.');const r=await db().prepare("UPDATE lessons SET status='completing' WHERE id=? AND status='scheduled'").bind(l.id).run();requireValue(r.meta.changes,'Урок уже изменён.',409);await db().batch([db().prepare("UPDATE users SET balance=MAX(0,balance-1) WHERE id=? AND EXISTS (SELECT 1 FROM lessons WHERE id=? AND type='paid')").bind(l.student_id,l.id),db().prepare("UPDATE lessons SET status='completed' WHERE id=?").bind(l.id),db().prepare('DELETE FROM slot_locks WHERE lesson_id=?').bind(l.id)]);return json({ok:true});}
   const claimed=await db().prepare("UPDATE lessons SET status='updating' WHERE id=? AND status='scheduled'").bind(l.id).run();requireValue(claimed.meta.changes,'Изменение уже выполняется. Обнови расписание.',409);
   try{
    if(path[2]==='cancel'){
      requireValue(Date.parse(l.start)>Date.now(),'Уже начавшийся урок отменяет репетитор.',400);
      // Serialize cancellation count per pupil, so concurrent cancellations cannot both be free.
      const lock='cancel-lock:'+l.student_id;
      try{if(l.student_id)await db().prepare('INSERT INTO settings (key,value) VALUES (?,?)').bind(lock,l.id).run();}catch{throw new HttpError('Другая отмена ещё выполняется. Повтори через несколько секунд.',409);}
      try{const month=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit'}).format(new Date());const count=await db().prepare("SELECT COUNT(*) n FROM lessons WHERE student_id=? AND type='paid' AND status='cancelled' AND strftime('%Y-%m',cancelled_at,'+3 hours')=?").bind(l.student_id,month).first<{n:number}>();const charged=l.type==='paid'&&Number(count?.n)>=3;requireValue(u.role==='teacher'||Boolean(body.expectedCharged)===charged,'Условия отмены изменились. Обнови расписание и проверь списание.',409);await calendar(eventPath(l.event_id),'DELETE');await db().batch([db().prepare("UPDATE lessons SET status='cancelled',cancelled_at=?,charged=? WHERE id=?").bind(now(),charged?1:0,l.id),db().prepare('DELETE FROM slot_locks WHERE lesson_id=?').bind(l.id),...(charged?[db().prepare('UPDATE users SET balance=MAX(0,balance-1) WHERE id=?').bind(l.student_id)]:[])]);return json({ok:true,charged});}finally{if(l.student_id)await db().prepare('DELETE FROM settings WHERE key=? AND value=?').bind(lock,l.id).run();}
    }
   }catch(e){await db().prepare("UPDATE lessons SET status='scheduled' WHERE id=? AND status='updating'").bind(l.id).run();throw e;}
 }
 if(path[0]==='rooms'){
   const u=await auth(request);await cleanup();
   if(!path[1]&&method==='POST'){requireValue(u.role==='student','Комнату создаёт ученик.',403);const count=await db().prepare('SELECT COUNT(*) n FROM rooms WHERE student_id=?').bind(u.id).first<{n:number}>();requireValue(Number(count?.n)<3,'Можно открыть до трёх комнат одновременно.');const r={id:id(),student_id:u.id,name:'Комната · '+u.name,language:'python',student_code:PYTHON_START,teacher_code:TEACHER_START,revision:0,last_active:Date.now()};await db().prepare('INSERT INTO rooms (id,student_id,name,language,student_code,teacher_code,revision,last_active) VALUES (?,?,?,?,?,?,?,?)').bind(...Object.values(r)).run();return json({room:r},201);}
   const r=await db().prepare('SELECT * FROM rooms WHERE id=?').bind(path[1]).first<Row>();requireValue(r&&(u.role==='teacher'||r.student_id===u.id),'Комната удалена или недоступна.',404);if(method==='GET')return json({room:r});
   if(method==='POST'){
    requireValue(!body.language||['python','lua'].includes(body.language),'Поддерживаются Python и Lua.');
    requireValue(body.file!=='teacher'||u.role==='teacher','Файл репетитора доступен ученику только для чтения.',403);
    requireValue(!body.file||['student','teacher'].includes(body.file),'Неизвестный файл.');
    if(body.file){
      requireValue(typeof body.update==='string'&&body.update.length<500000,'Некорректное изменение файла.');
      const column=body.file==='teacher'?'teacher_code':'student_code',stateColumn=body.file==='teacher'?'teacher_state':'student_state';
      let saved=false;
      for(let attempt=0;attempt<5;attempt++){
        const latest=await db().prepare('SELECT * FROM rooms WHERE id=?').bind(r!.id).first<Row>();requireValue(latest&&latest.last_active>Date.now()-1800000,'Комната удалена или недоступна.',404);
        const doc=documentFrom(latest![stateColumn],latest![column]);try{Y.applyUpdate(doc,decode(body.update));}catch{doc.destroy();throw new HttpError('Некорректное изменение файла.');}
        const code=doc.getText('code').toString();requireValue(code.length<100000,'Максимальный размер файла — 100 000 символов.');const state=encode(doc);doc.destroy();requireValue(state.length<500000,'История комнаты слишком большая. Создай новую комнату.');
        const result=await db().prepare('UPDATE rooms SET '+column+'=?,'+stateColumn+'=?,revision=revision+1,last_active=? WHERE id=? AND revision=?').bind(code,state,Date.now(),r!.id,latest!.revision).run();if(result.meta.changes){saved=true;break;}
      }
      requireValue(saved,'Не удалось синхронизировать код. Изменения сохранены локально, повторим отправку.',409);
    }else if(body.language)await db().prepare('UPDATE rooms SET language=?,revision=revision+1,last_active=? WHERE id=?').bind(body.language,Date.now(),r!.id).run();
    else await db().prepare('UPDATE rooms SET last_active=? WHERE id=?').bind(Date.now(),r!.id).run();
    return json({room:await db().prepare('SELECT * FROM rooms WHERE id=?').bind(r!.id).first()});
   }
 }
 throw new HttpError('Страница API не найдена.',404);
}
async function handle(request:Request){try{return await route(request);}catch(e){if(e instanceof HttpError)return json({error:e.message},e.status);console.error('codeTogether API:',e instanceof Error?e.message:'Unknown error');return json({error:'Сервис временно недоступен. Попробуй ещё раз.'},503);}}
export const GET=handle;
export const POST=handle;
