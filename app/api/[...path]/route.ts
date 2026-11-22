import {db,secrets,HttpError,requireValue,auth,currentUser,safeUser,passwordHash,verifyPassword,hash,now,id,schedule,clearScheduleCache,normalizeSchedule,calendarConfigured,calendar,eventPath,slots,slotKeys,httpsUrl,cleanup} from '@/lib/server';
import {Lesson,canReschedule,lessonDurationMinutes,monthBounds,resultStatus,PYTHON_START,TEACHER_START} from '@/lib/domain';
import {documentFrom,encode,decode,replaceText,Y} from '@/lib/collaboration';
import {ROOM_STARTERS,starterLanguage,type RoomLanguage} from '@/lib/room-presets';
import {normalizeTrialPhone,limitTrialBooking} from '@/lib/trial-booking';
import {reserveLessonMove,confirmLessonMove,reconcileLessonMoveFromCalendar} from '@/lib/lesson-move';
import {createSaluteJazzRoom,disableSaluteJazzRoom,saluteJazzConfigured} from '@/lib/salutejazz';
import {isGithubMaterialContentType,normalizeGithubSource} from '@/lib/github-source';
import {assignmentImageExtension,assignmentImageStorageBackend,canReadAssignmentImage,cleanupOrphanedAssignmentImages,deleteQueuedAssignmentImage,getAssignmentImageObject,MAX_ASSIGNMENT_IMAGE_BYTES,pendingAssignmentImageId,putAssignmentImageObject,replacePendingAssignmentImage,sanitizeAssignmentImageName,validateAssignmentImage,type AssignmentImageContentType,type AssignmentImageStorageBackend,AssignmentImageStorageError} from '@/lib/assignment-images';
import {normalizeAssignmentPrompt} from '@/lib/assignment-prompt-format.mjs';
export const dynamic='force-dynamic';
// Query results are intentionally typed at the database edge; request payloads use endpoint-specific fields.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row=Record<string,any>;
type ApiBody = {
 login?:string;password?:string;name?:string;body?:string;phone?:string;parent_name?:string;parent_phone?:string;goals?:unknown[];
 age?:number;balance?:number;price_per_lesson?:number;rating?:number;position?:number;minutes?:number;answer?:number;amount?:number;credits?:number;
 consent?:boolean;enabled?:boolean;expectedCharged?:boolean;published?:boolean;
 assignmentId?:string;studentId?:string;studentIds?:unknown[];courseId?:string;course_id?:string;
 title?:string;description?:string;format?:string;content?:string;kind?:string;prompt?:string;feedback?:string;status?:string;
 start?:string;dateOverrides?:Record<string,unknown>;weeklyAvailability?:Record<string,unknown>;days?:unknown[];from?:string;to?:string;timezone?:string;availabilityCalendarIds?:unknown[];
 options?:unknown[];topicIds?:unknown[];topicId?:string;topic_id?:string;parentTopicId?:string;parent_topic_id?:string;github_url?:string;lesson_id?:string;student_id?:string;
 meetUrl?:string;meet_url?:string;colab_url?:string;topic?:string;preparation?:unknown[];completed?:boolean;file?:string;update?:string;language?:string;id?:string;
 exerciseId?:string;wpm?:number;accuracy?:number;durationMs?:number;
 code?:string;url?:string;comment?:string;note?:string;type?:string;
};
type CalendarItem={id?:string;accessRole?:string;summary?:string;summaryOverride?:string;primary?:boolean};
const PRIVACY_POLICY_VERSION='2026-11-14';
function json(data:unknown,status=200,headers:Record<string,string>={}){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});}
function ifNoneMatchMatches(header:string|null,etag:string){
 if(!header)return false;
 const value=header.trim();
 if(value==='*')return true;
 const current=etag.startsWith('W/')?etag.slice(2):etag;
 let index=0;
 while(index<value.length){
  while(index<value.length&&(value[index]===' '||value[index]==='\t'||value[index]===','))index++;
  if(index>=value.length)break;
  const start=index;
  if(value.startsWith('W/',index))index+=2;
  if(value[index]!=='"'){
   while(index<value.length&&value[index]!==',')index++;
   continue;
  }
  index++;
  let valid=true;
  while(index<value.length&&value[index]!=='"'){
   const code=value.charCodeAt(index);
   if(!(code===0x21||(code>=0x23&&code<=0x7e)||code>=0x80))valid=false;
   index++;
  }
  if(index>=value.length)break;
  index++;
  const candidate=value.slice(start,index).replace(/^W\//,'');
  if(valid&&candidate===current)return true;
  while(index<value.length&&(value[index]===' '||value[index]==='\t'))index++;
  if(index<value.length&&value[index]===',')index++;
  else if(index<value.length){
   while(index<value.length&&value[index]!==',')index++;
  }
 }
 return false;
}
async function all(sql:string,...values:unknown[]){return (await db().prepare(sql).bind(...values).all<Row>()).results;}
const text=(v:unknown,max=200)=>typeof v==='string'?v.trim().slice(0,max):'';
const TRIAL_GOALS=['ЕГЭ','Python','Pandas','МЦКО','ОГЭ','Информатика','Повышение успеваемости'] as const;
const CREDENTIAL_CHARACTERS='abcdefghjkmnpqrstuvwxyz23456789';
function randomCredential(length:number){const limit=Math.floor(256/CREDENTIAL_CHARACTERS.length)*CREDENTIAL_CHARACTERS.length;let value='';while(value.length<length){const bytes=crypto.getRandomValues(new Uint8Array(Math.max(16,(length-value.length)*2)));for(const byte of bytes){if(byte>=limit)continue;value+=CREDENTIAL_CHARACTERS[byte%CREDENTIAL_CHARACTERS.length];if(value.length===length)break;}}return value;}
function trialLogin(){return 'trial_'+randomCredential(10);}
function validDateKey(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const time=Date.parse(value+'T00:00:00Z');return Number.isFinite(time)&&new Date(time).toISOString().slice(0,10)===value;}
function githubSource(value:string){
 try{return normalizeGithubSource(value);}catch(error){throw new HttpError(error instanceof Error?error.message:'Некорректная ссылка GitHub.',400);}
}
async function readLimitedText(response:Response,maxBytes:number){
 const declared=Number(response.headers.get('content-length')||0);if(declared>maxBytes){await response.body?.cancel();throw new HttpError('Файл GitHub слишком большой.',413);}
 const reader=response.body?.getReader();if(!reader)return '';
 const chunks:Uint8Array[]=[];let total=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>maxBytes){await reader.cancel();throw new HttpError('Файл GitHub слишком большой.',413);}chunks.push(value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 return new TextDecoder('utf-8',{fatal:false}).decode(bytes);
}
async function readLimitedBytes(request:Request,maxBytes:number){
 const declared=Number(request.headers.get('content-length')||0);requireValue(!declared||declared<=maxBytes,'Изображение слишком большое.',413);
 const reader=request.body?.getReader();requireValue(reader,'Файл не получен.',400);const chunks:Uint8Array[]=[];let total=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>maxBytes){await reader.cancel();throw new HttpError('Изображение слишком большое.',413);}chunks.push(value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return bytes;
}
function validateNotebook(content:string){let parsed:unknown;try{parsed=JSON.parse(content);}catch{throw new HttpError('Файл .ipynb содержит некорректный JSON.',422);}requireValue(!!parsed&&typeof parsed==='object'&&'cells'in parsed&&Array.isArray((parsed as {cells?:unknown}).cells),'Файл .ipynb не содержит список ячеек.',422);}
async function studentCanReadTopic(studentId:string,topicId:string){return !!await db().prepare(`SELECT t.id FROM topics t JOIN course_enrollments e ON e.course_id=t.course_id AND e.student_id=? JOIN topic_access a ON a.topic_id=COALESCE(t.parent_topic_id,t.id) AND a.student_id=? WHERE t.id=?`).bind(studentId,studentId,topicId).first();}
async function compileKumirSource(code:string){
 const compilerUrl=secrets.QUMIR_COMPILER_URL;
 requireValue(compilerUrl,'Компилятор Кумир пока не настроен.',503);
 let compiled:Response;
 try{compiled=await fetch(new URL('/compile',compilerUrl),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code}),signal:AbortSignal.timeout(6800)});}
 catch{throw new HttpError('Компилятор не ответил вовремя. Попробуй ещё раз.',503);}
 if(!compiled.ok){const result=await compiled.json().catch(()=>({error:'Не удалось скомпилировать программу.'})) as {error?:string};throw new HttpError((result.error||'Не удалось скомпилировать программу.').slice(0,4000),compiled.status===422?422:compiled.status===408?408:compiled.status===429?429:503);}
 const wasm=await compiled.arrayBuffer();requireValue(wasm.byteLength>=8&&wasm.byteLength<=4*1024*1024,'Компилятор вернул некорректный размер программы.',502);
 return new Response(wasm,{status:200,headers:{'Content-Type':'application/wasm','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
async function retireMeeting(lessonId:string,roomId:string|undefined|null){
 if(!roomId)return;
 try{await disableSaluteJazzRoom(roomId,secrets,2500);await db().prepare('UPDATE lessons SET jazz_room_id=NULL,jazz_room_needs_recreation=0 WHERE id=? AND jazz_room_id=?').bind(lessonId,roomId).run();}
 catch(error){console.error('SaluteJazz room cleanup:',lessonId,error instanceof Error?error.message:'Unknown error');}
}
async function deferSaluteJazzRoomClose(roomId:string,error:unknown){
 const database=db(),key='salutejazz-close:'+roomId;
 try{
   const existing=await database.prepare('SELECT value FROM settings WHERE key=?').bind(key).first<{value:string}>();
   let attempts=0;try{attempts=Number(JSON.parse(existing?.value||'{}').attempts)||0;}catch{}
   await database.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key,JSON.stringify({attempts:attempts+1,nextAttemptAt:Date.now()+Math.min(60,2**Math.min(attempts,5))*60_000})).run();
   console.error('SaluteJazz room cleanup deferred:',roomId,error instanceof Error?error.message:'Unknown error');
 }catch(queueError){console.error('SaluteJazz room cleanup could not be queued:',roomId,queueError instanceof Error?queueError.message:'Unknown error');}
}
async function teacher(request:Request){return auth(request,true);}
async function lessonAccess(request:Request,lessonId:string){const u=await auth(request);const l=await db().prepare('SELECT * FROM lessons WHERE id=?').bind(lessonId).first<Row>();requireValue(l&&((u.role==='teacher'&&l.tutor_id===u.id)||(u.role==='student'&&l.student_id===u.id)||Boolean(u.is_platform_admin)),'Урок не найден.',404);return {u,l:l!};}
async function route(request:Request){
 const url=new URL(request.url),path=url.pathname.replace(/^\/api\//,'').split('/').filter(Boolean),method=request.method;
 const imageUpload=path[0]==='assignments'&&path[1]&&path[2]==='images'&&method==='POST';
 if(method!=='GET'){
   const origin=request.headers.get('origin');
   const proxyProto=request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
   const proxyHost=(request.headers.get('x-forwarded-host')||request.headers.get('host'))?.split(',')[0]?.trim();
   const proxyOrigin=proxyProto&&proxyHost?`${proxyProto}://${proxyHost}`:null;
   requireValue(origin===url.origin||origin===proxyOrigin,'Запрос с другого сайта запрещён.',403);
   const length=Number(request.headers.get('content-length')||0);requireValue(imageUpload?(!length||length<=MAX_ASSIGNMENT_IMAGE_BYTES+65536):length<2200000,'Размер запроса слишком большой.',413);
 }
 if(imageUpload){
   const imageOwner=await teacher(request),assignmentId=path[1];
   requireValue(/^[a-zA-Z0-9_-]{1,100}$/.test(assignmentId),'Некорректный номер задания.',400);
   const assignment=await db().prepare("SELECT a.id,a.prompt FROM assignments a WHERE a.id=? AND (?=1 OR (a.student_id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status='active')) OR a.topic_id IN (SELECT t.id FROM topics t JOIN courses c ON c.id=t.course_id WHERE c.tutor_id=?))").bind(assignmentId,imageOwner.is_platform_admin?1:0,imageOwner.id,imageOwner.id).first<Row>();requireValue(assignment,'Сначала сохрани задание.',404);
   const contentType=request.headers.get('content-type')||'';requireValue(contentType.toLowerCase().startsWith('multipart/form-data;'),'Отправь изображение как multipart/form-data.',415);
   const bytes=await readLimitedBytes(request,MAX_ASSIGNMENT_IMAGE_BYTES+65536);let data:FormData;try{data=await new Request(url,{method:'POST',headers:{'Content-Type':contentType},body:bytes.slice().buffer as ArrayBuffer}).formData();}catch{throw new HttpError('Не удалось прочитать изображение.',400);}
   const file=data.get('file');requireValue(file instanceof File,'Выбери изображение.',400);requireValue(file.size>0&&file.size<=MAX_ASSIGNMENT_IMAGE_BYTES,'Размер изображения не должен превышать 8 МБ.',413);
   const placeholder=data.get('placeholder');requireValue(typeof placeholder==='string','Сохрани условие с местом изображения перед загрузкой.',400);
   const pending=pendingAssignmentImageId(placeholder);requireValue(pending,'Некорректное место для изображения.',400);
   const imageId=pending!.id,imageUrl=`/api/assignment-images/${imageId}`,database=db();
   const existingImage=await database.prepare('SELECT id,assignment_id,content_type,size_bytes FROM assignment_images WHERE id=?').bind(imageId).first<Row>();
   if(existingImage){
     requireValue(existingImage!.assignment_id===assignmentId,'Идентификатор изображения уже использован.',409);
     const restoredPrompt=replacePendingAssignmentImage(String(assignment!.prompt||''),placeholder,imageId);
     if(restoredPrompt){
       const restored=await database.prepare('UPDATE assignments SET prompt=? WHERE id=? AND prompt=? AND EXISTS (SELECT 1 FROM assignment_images WHERE id=? AND assignment_id=?)').bind(restoredPrompt,assignmentId,assignment!.prompt,imageId,assignmentId).run();
       if(restored.meta.changes===1)return json({id:imageId,url:imageUrl,content_type:String(existingImage!.content_type),size_bytes:Number(existingImage!.size_bytes)},200);
     }
     const latest=await database.prepare('SELECT prompt FROM assignments WHERE id=?').bind(assignmentId).first<Row>();
     requireValue(String(latest?.prompt||'').includes(imageUrl),'Идентификатор изображения уже использован.',409);
     return json({id:imageId,url:imageUrl,content_type:String(existingImage!.content_type),size_bytes:Number(existingImage!.size_bytes)},200);
   }
   const mime=file.type.toLowerCase() as AssignmentImageContentType;requireValue(['image/jpeg','image/png','image/webp','image/gif'].includes(mime),'Поддерживаются PNG, JPEG, WebP и GIF.',415);
   const imageBytes=new Uint8Array(await file.arrayBuffer());requireValue(validateAssignmentImage(imageBytes,mime),'Файл не соответствует заявленному формату изображения.',415);
   const backend=assignmentImageStorageBackend(secrets);requireValue(backend,'Загрузка изображений временно недоступна.',503);
   const objectId=id(),key=`assignment-images/${assignmentId}/${objectId}.${assignmentImageExtension(mime)}`;
   const updatedPrompt=replacePendingAssignmentImage(String(assignment!.prompt||''),placeholder,imageId);
   requireValue(updatedPrompt,'Место для изображения не найдено в сохранённом условии. Сохрани условие и попробуй ещё раз.',409);
   try{await putAssignmentImageObject(key,imageBytes,mime,backend,secrets);}catch(error){if(error instanceof AssignmentImageStorageError)throw new HttpError('Хранилище изображений временно недоступно.',503);throw error;}
   const cleanupUnreferencedUpload=async()=>{
     const stored=await database.prepare('SELECT object_key FROM assignment_images WHERE id=?').bind(imageId).first<Row>();
     const queueId=`${imageId}:${objectId}`,queueKey=`assignment-image-delete:${queueId}`,queueValue=JSON.stringify({object_key:key,storage_backend:backend});
     if(stored?.object_key===key){
       const deleted=await database.batch([
         database.prepare("INSERT INTO settings (key,value) SELECT ?,? WHERE EXISTS (SELECT 1 FROM assignment_images WHERE id=? AND object_key=? AND NOT EXISTS (SELECT 1 FROM assignments WHERE id=? AND instr(prompt,?)>0)) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(queueKey,queueValue,imageId,key,assignmentId,imageUrl),
         database.prepare('DELETE FROM assignment_images WHERE id=? AND object_key=? AND NOT EXISTS (SELECT 1 FROM assignments WHERE id=? AND instr(prompt,?)>0)').bind(imageId,key,assignmentId,imageUrl),
       ]);
       if(deleted[0]?.meta?.changes===1&&deleted[1]?.meta?.changes===1)await deleteQueuedAssignmentImage(database,queueKey,queueValue,key,backend,secrets);
       else if(deleted[0]?.meta?.changes===1)await database.prepare('DELETE FROM settings WHERE key=? AND value=?').bind(queueKey,queueValue).run();
     }else{
       await database.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(queueKey,queueValue).run();
       await deleteQueuedAssignmentImage(database,queueKey,queueValue,key,backend,secrets);
     }
   };
   let saved:{meta:{changes:number}}[];
   try{
     saved=await database.batch([
       database.prepare('INSERT INTO assignment_images (id,assignment_id,object_key,content_type,size_bytes,original_name,created_at,storage_backend) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM assignments WHERE id=? AND prompt=?)').bind(imageId,assignmentId,key,mime,imageBytes.byteLength,sanitizeAssignmentImageName(file.name),now(),backend,assignmentId,assignment!.prompt),
       database.prepare('UPDATE assignments SET prompt=? WHERE id=? AND prompt=?').bind(updatedPrompt,assignmentId,assignment!.prompt),
     ]);
   }catch(error){try{await cleanupUnreferencedUpload();}catch(cleanupError){console.error('Uncommitted assignment image cleanup deferred:',imageId,cleanupError instanceof Error?cleanupError.message:'Unknown error');}throw error;}
   if(saved[0]?.meta?.changes!==1||saved[1]?.meta?.changes!==1){
     try{await cleanupUnreferencedUpload();}catch(cleanupError){console.error('Uncommitted assignment image cleanup deferred:',imageId,cleanupError instanceof Error?cleanupError.message:'Unknown error');}
     throw new HttpError('Условие изменилось во время загрузки. Повтори сохранение задания.',409);
   }
   return json({id:imageId,url:imageUrl,content_type:mime,size_bytes:imageBytes.byteLength},201);
 }
 if(path[0]==='assignment-images'&&path[1]&&method==='GET'){
   const user=await auth(request),image=await db().prepare('SELECT i.id,i.object_key,i.content_type,i.size_bytes,i.storage_backend,a.id AS assignment_id,a.topic_id,a.student_id,a.lesson_id FROM assignment_images i JOIN assignments a ON a.id=i.assignment_id WHERE i.id=?').bind(path[1]).first<Row>();
   requireValue(image,'Изображение не найдено.',404);
   const studentCourseAccess=user.role==='student'&&!!image!.topic_id&&!!await db().prepare(`SELECT a.id FROM assignments a JOIN topics t ON t.id=a.topic_id JOIN course_enrollments e ON e.course_id=t.course_id AND e.student_id=? JOIN topic_access x ON x.topic_id=COALESCE(t.parent_topic_id,t.id) AND x.student_id=? WHERE a.id=?`).bind(user.id,user.id,image!.assignment_id).first();
   const tutorOwnsAssignment=user.role==='teacher'&&(Boolean(user.is_platform_admin)||Boolean(image!.student_id&&await db().prepare("SELECT student_id FROM tutor_students WHERE tutor_id=? AND student_id=? AND status='active'").bind(user.id,image!.student_id).first())||Boolean(image!.topic_id&&await db().prepare('SELECT t.id FROM topics t JOIN courses c ON c.id=t.course_id WHERE t.id=? AND c.tutor_id=?').bind(image!.topic_id,user.id).first()));
   const lessonBelongsToUser=!image!.lesson_id||!!await db().prepare(user.role==='teacher'?'SELECT id FROM lessons WHERE id=? AND (?=1 OR tutor_id=?)':'SELECT id FROM lessons WHERE id=? AND student_id=?').bind(...(user.role==='teacher'?[image!.lesson_id,user.is_platform_admin?1:0,user.id]:[image!.lesson_id,user.id])).first();
   requireValue(canReadAssignmentImage({role:user.role,targetBelongsToUser:user.role==='teacher'?tutorOwnsAssignment:Boolean(image!.student_id===user.id||studentCourseAccess),lessonBelongsToUser}),'Изображение недоступно.',403);
   const backend:AssignmentImageStorageBackend=image!.storage_backend==='filesystem'?'filesystem':'r2';
   let bytes:Uint8Array;try{bytes=await getAssignmentImageObject(String(image!.object_key),backend,secrets);}catch(error){if(error instanceof AssignmentImageStorageError)throw new HttpError(error.status===404?'Изображение не найдено.':'Хранилище изображений временно недоступно.',error.status===404?404:503);throw error;}
   requireValue(bytes.byteLength===Number(image!.size_bytes)&&bytes.byteLength<=MAX_ASSIGNMENT_IMAGE_BYTES,'Изображение повреждено.',502);
   return new Response(bytes.slice().buffer as ArrayBuffer,{headers:{'Content-Type':String(image!.content_type),'Content-Length':String(bytes.byteLength),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin'}});
 }
 const body:ApiBody=method==='GET'?{}:await request.json().catch(()=>({})) as ApiBody;
 if(path[0]==='demo'&&path[1]==='compile-kumir'){
   requireValue(method==='POST','Компиляция принимает только POST.',404);
   requireValue(typeof body.code==='string'&&body.code.trim().length>0&&body.code.length<=100000,'Исходный файл должен содержать от 1 до 100 000 символов.');
   const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
   const clientHash=await hash(`demo-kumir:${ip.slice(0,200)}`),windowStart=Math.floor(Date.now()/60000)*60000,database=db();
   const [,limit]=await database.batch([
     database.prepare('DELETE FROM demo_kumir_compile_limits WHERE window_start < ?').bind(windowStart-120000),
     database.prepare(`INSERT INTO demo_kumir_compile_limits (client_hash,window_start,attempts) VALUES (?, ?, 1)
       ON CONFLICT(client_hash) DO UPDATE SET window_start=excluded.window_start,
         attempts=CASE WHEN demo_kumir_compile_limits.window_start<excluded.window_start THEN 1 ELSE demo_kumir_compile_limits.attempts+1 END
       WHERE demo_kumir_compile_limits.window_start<excluded.window_start
         OR (demo_kumir_compile_limits.window_start=excluded.window_start AND demo_kumir_compile_limits.attempts<5)`)
       .bind(clientHash,windowStart),
   ]);
   if(limit.meta.changes!==1)return json({error:'Демо-режим ограничивает запуск до 5 программ в минуту. Подожди минуту и попробуй снова.'},429,{'Retry-After':'60'});
   return compileKumirSource(body.code);
 }
 if(path[0]==='reviews'&&method==='GET')return json({reviews:await all('SELECT id,name,body,rating FROM reviews WHERE published=1')});
 if(path[0]==='reviews'&&method==='POST'){await teacher(request);requireValue(text(body.name)&&text(body.body,5000)&&Number.isInteger(body.rating)&&body.rating!>=1&&body.rating!<=5,'Проверь имя, текст и оценку.');await db().prepare('INSERT INTO reviews (id,name,body,rating,published) VALUES (?,?,?,?,?)').bind(id(),text(body.name),text(body.body,5000),body.rating,body.published?1:0).run();return json({ok:true});}
 if(path[0]==='me')return json({user:await currentUser(request)});
 if(path[0]==='topics'&&path[1]&&path[2]==='content'&&method==='GET'){
   const user=await auth(request),topic=await db().prepare('SELECT id,format,content,github_url FROM topics WHERE id=?').bind(path[1]).first<Row>();
   requireValue(topic,'Материал не найден.',404);
   if(user.role!=='teacher')requireValue(await studentCanReadTopic(user.id,path[1]),'Материал недоступен.',403);
   let content=String(topic!.content||'');
   if(topic!.github_url){
     const source=githubSource(String(topic!.github_url));requireValue(source.format===topic!.format,'Формат материала не совпадает со ссылкой GitHub.',409);
     let response:Response;try{response=await fetch(source.url,{redirect:'error',signal:AbortSignal.timeout(10000),headers:{'Accept':'text/plain, text/markdown, application/json, application/octet-stream','User-Agent':'codeTogether-course-materials'}});}catch{throw new HttpError('Не удалось загрузить файл из публичного GitHub. Проверь ссылку и повтори попытку.',502);}
     requireValue(response.ok,'Файл GitHub не найден или репозиторий закрыт.',502);
     requireValue(isGithubMaterialContentType(response.headers.get('content-type')),'GitHub вернул неподдерживаемый тип файла.',502);
     content=await readLimitedText(response,source.format==='ipynb'?5_000_000:2_000_000);
     if(source.format==='ipynb')validateNotebook(content);
   }
   return json({content,format:topic!.format});
 }
 if(path[0]==='logout'&&method==='POST'){const token=request.headers.get('cookie')?.match(/(?:^|;\s*)ct-session=([^;]+)/)?.[1];if(token)await db().prepare('DELETE FROM sessions WHERE id=?').bind(await hash(token)).run();return json({ok:true},200,{'Set-Cookie':'ct-session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'+(url.protocol==='https:'?'; Secure':'')});}
 if(path[0]==='login'&&method==='POST'){
   requireValue(typeof body.login==='string'&&body.login.length<=100&&typeof body.password==='string'&&body.password.length<=128,'Проверь логин и пароль.');
   const rateKey='login:'+await hash(request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local')+':'+Math.floor(Date.now()/60000);
   await db().prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=CAST(CAST(value AS INTEGER)+1 AS TEXT)').bind(rateKey,'1').run();
   const rate=await db().prepare('SELECT value FROM settings WHERE key=?').bind(rateKey).first<{value:string}>();requireValue(Number(rate?.value)<=12,'Слишком много попыток. Подожди минуту.',429);
   let user=await db().prepare('SELECT * FROM users WHERE login=?').bind(body.login.trim()).first<Row>();
   if(!user&&secrets.ADMIN_LOGIN&&secrets.ADMIN_PASSWORD&&body.login===secrets.ADMIN_LOGIN&&await hash(body.password)===await hash(secrets.ADMIN_PASSWORD)){
     const uid=id(),timestamp=now();await db().prepare('INSERT OR IGNORE INTO users (id,login,password,name,role,balance,created_at,is_platform_admin) VALUES (?,?,?,?,?,?,?,1)').bind(uid,secrets.ADMIN_LOGIN,await passwordHash(body.password),'Администратор','teacher',0,timestamp).run();await db().prepare("INSERT OR IGNORE INTO tutor_profiles(tutor_id,headline,subjects_json,published,approved,created_at,updated_at) SELECT id,'','[]',0,0,?,? FROM users WHERE login=?").bind(timestamp,timestamp,secrets.ADMIN_LOGIN).run();user=await db().prepare('SELECT * FROM users WHERE login=?').bind(body.login).first<Row>();
   }
   const valid=await verifyPassword(body.password,user?.password||'nonexistent:0000000000000000000000000000000000000000000000000000000000000000');requireValue(user&&valid,'Неверный логин или пароль.',401);requireValue(user.registration_status!=='pending','Анкета ещё на проверке. Войти можно после одобрения.',403);
   const token=crypto.randomUUID()+crypto.randomUUID();await db().prepare('INSERT INTO sessions (id,user_id,expires_at) VALUES (?,?,?)').bind(await hash(token),user!.id,Date.now()+7*86400000).run();
   return json({user:safeUser(user)},200,{'Set-Cookie':'ct-session='+token+'; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800'+(url.protocol==='https:'?'; Secure':'')});
 }
 if(path[0]==='slots'&&method==='GET'){
   const minutes=Number(url.searchParams.get('minutes')||45);requireValue(minutes===45||minutes===55,'Некорректная длительность.');if(minutes===55)await auth(request);
   const exclude=url.searchParams.get('exclude')||undefined;let tutorId=url.searchParams.get('tutorId')||undefined;if(exclude){const access=await lessonAccess(request,exclude);tutorId=String(access.l.tutor_id||tutorId||'');}
   if(tutorId)requireValue(!!await db().prepare('SELECT tutor_id FROM tutor_profiles WHERE tutor_id=? AND approved=1').bind(tutorId).first(),'Анкета репетитора не найдена.',404);
   return json(await slots(url.searchParams.get('date')||'',minutes,exclude,tutorId));
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
   const lessonStart=new Date(startMs).toISOString(),lessonEnd=new Date(startMs+55*60000).toISOString();
   const lessonId=id(),eventId=lessonId.replaceAll('-',''),scheduleValue=await schedule((await teacher(request)).id);
   const topic=text(body.topic,200)||'Индивидуальное занятие';
   const tutorUser=await teacher(request);
   const inserted=await db().prepare("INSERT INTO lessons (id,student_id,tutor_id,name,start,end,type,status,event_id,operation_started_at,meet_url,topic) SELECT ?,id,?,?,?,?,'paid','pending',?,?,?,? FROM users WHERE id=? AND role='student' AND EXISTS (SELECT 1 FROM tutor_students WHERE tutor_id=? AND student_id=? AND status='active')")
     .bind(lessonId,tutorUser.id,student!.name,lessonStart,lessonEnd,eventId,now(),scheduleValue.meetUrl,topic,student!.id,tutorUser.id,student!.id).run();
   requireValue(inserted.meta.changes===1,'Ученик не найден.',404);
   let jazzRoomId:string|null=null,meetingUrl=scheduleValue.meetUrl,calendarAttempted=false;
   try{
     if(saluteJazzConfigured(secrets)){
       const room=await createSaluteJazzRoom('TutorPlace · Урок',secrets);
       jazzRoomId=room.roomId;meetingUrl=room.roomUrl;
       await db().prepare("UPDATE lessons SET jazz_room_id=?,meet_url=? WHERE id=? AND status='pending'").bind(jazzRoomId,meetingUrl,lessonId).run();
     }
     if(calendarConfigured()){calendarAttempted=true;await calendar(eventPath(),'POST',{id:eventId,summary:'TutorPlace · Урок · '+student!.name,description:topic,start:{dateTime:lessonStart,timeZone:'Europe/Moscow'},end:{dateTime:lessonEnd,timeZone:'Europe/Moscow'},...(meetingUrl?{location:meetingUrl}:{})});}
     const scheduled=await db().prepare("UPDATE lessons SET status='scheduled',operation_started_at=NULL WHERE id=? AND status='pending'").bind(lessonId).run();
     requireValue(scheduled.meta.changes===1,'Не удалось сохранить урок. Обнови расписание.',409);
   }catch(error){
     let calendarCleared=!calendarAttempted,roomCleared=!jazzRoomId;
     if(calendarAttempted){try{await calendar(eventPath(eventId),'DELETE');calendarCleared=true;}catch{calendarCleared=false;}}
     // If Calendar deletion failed, recovery may keep this pending lesson and its
     // event. Leave its meeting room active so the recovered lesson link still works.
     if(jazzRoomId&&calendarCleared){try{await disableSaluteJazzRoom(jazzRoomId,secrets);roomCleared=true;}catch(error){roomCleared=false;await deferSaluteJazzRoomClose(jazzRoomId,error);}}
     if(calendarCleared&&roomCleared)await db().prepare("DELETE FROM lessons WHERE id=? AND status='pending'").bind(lessonId).run();
     else throw new HttpError('Не удалось безопасно завершить назначение. Урок оставлен для сверки.',503);
     throw error;
   }
   return json({lesson:await db().prepare('SELECT * FROM lessons WHERE id=?').bind(lessonId).first()},201);
 }
 if(path[0]==='book'&&method==='POST'){
   let u=await currentUser(request);const paid=body.minutes===55;if(paid&&u?.role==='teacher'){const target=await db().prepare("SELECT * FROM users WHERE id=? AND role='student'").bind(body.studentId).first<Row>();requireValue(target,'Выбери ученика.');u=safeUser(target);}requireValue(!paid||u?.role==='student','Урок бронируется из кабинета ученика.',403);
   const requestedTutorId=text(body.tutorId,100);const tutor=requestedTutorId?await db().prepare("SELECT u.id FROM users u JOIN tutor_profiles p ON p.tutor_id=u.id WHERE u.id=? AND p.approved=1 AND p.published=1").bind(requestedTutorId).first<{id:string}>():u?.role==='student'?await db().prepare('SELECT tutor_id id FROM tutor_students WHERE student_id=? AND status="active" ORDER BY created_at LIMIT 1').bind(u.id).first<{id:string}>():await db().prepare("SELECT u.id FROM users u JOIN tutor_profiles p ON p.tutor_id=u.id WHERE p.approved=1 AND p.published=1 ORDER BY p.created_at LIMIT 1").first<{id:string}>();requireValue(tutor,'Пока нет доступных анкет для записи.',404);const tutorId=tutor.id;
   const name=paid?u!.name:text(body.name,80);
   const phone=paid?null:normalizeTrialPhone(body.phone);
   const goals=paid?[]:Array.isArray(body.goals)?[...new Set(body.goals.filter((goal):goal is string=>typeof goal==='string'&&TRIAL_GOALS.includes(goal as typeof TRIAL_GOALS[number])))]:[];
   const trialComment=paid?null:text(body.comment,2000)||null;
   requireValue(name,'Укажи имя.');
   if(!paid)requireValue(body.consent===true&&phone,'Укажи корректный телефон и согласие на обработку данных.');
   if(!paid)requireValue(Array.isArray(body.goals)&&body.goals.every(goal=>typeof goal==='string'&&TRIAL_GOALS.includes(goal as typeof TRIAL_GOALS[number]))&&goals.length>0,'Выбери хотя бы одну цель занятий.');
   const start=text(body.start,40);
   requireValue(Number.isFinite(Date.parse(start)),'Выбери время.');
   if(!paid)await limitTrialBooking(request);
   const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(start));
   const available=await slots(date,paid?55:45,undefined,tutorId);
   const slot=available.slots.find(s=>s.start===start);
   requireValue(slot,'Это время уже занято или пока недоступно.',409);
   const lid=id(),eventId=lid.replaceAll('-',''),s=await schedule(tutorId);
   const database=db(),trialUserId=paid?null:id(),trialPassword=paid?null:randomCredential(16),trialPasswordHash=trialPassword?await passwordHash(trialPassword):null;
   let trialUserLogin=paid?null:trialLogin();
   const sessionToken=!paid&&!u?crypto.randomUUID()+crypto.randomUUID():null;
   const sessionHash=sessionToken?await hash(sessionToken):null,sessionExpires=Date.now()+7*86400000;
   const paidInsert=database.prepare("INSERT INTO lessons (id,student_id,tutor_id,name,start,end,type,status,event_id,operation_started_at,meet_url,topic) SELECT ?,id,?,?,?,?,?,'pending',?,?,?,? WHERE 1=1 AND NOT EXISTS (SELECT 1 FROM lessons WHERE tutor_id=? AND status IN ('scheduled','pending','updating') AND start<? AND end>?) AND NOT EXISTS (SELECT 1 FROM lessons WHERE tutor_id=? AND status='updating' AND move_start<? AND move_end>?)")
     .bind(lid,tutorId,name,slot.start,slot.end,'paid',eventId,now(),s.meetUrl,'Индивидуальное занятие',tutorId,slot.end,slot.start,tutorId,slot.end,slot.start);
   const trialUserInsert=()=>database.prepare(`
     INSERT INTO users (id,login,password,name,role,phone,account_type,created_at)
     SELECT ?,?,?,?,'student',?,'trial',?
     WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE trial_phone=? AND type='trial' AND status IN ('scheduled','pending','updating'))
       AND NOT EXISTS (SELECT 1 FROM lessons WHERE status IN ('scheduled','pending','updating') AND start<? AND end>?)
       AND NOT EXISTS (SELECT 1 FROM lessons WHERE status='updating' AND move_start<? AND move_end>?)
   `).bind(trialUserId,trialUserLogin,trialPasswordHash,name,phone,now(),phone,slot.end,slot.start,slot.end,slot.start);
   const trialLessonInsert=()=>database.prepare(`
     INSERT INTO lessons (id,student_id,tutor_id,name,phone,trial_phone,trial_goals,trial_comment,start,end,type,status,event_id,operation_started_at,privacy_consent_at,privacy_policy_version,meet_url,topic)
     SELECT ?,?,?,?,?,?,?,?,?,?,'trial','pending',?,?,?,?,?,?
     WHERE EXISTS (SELECT 1 FROM users WHERE id=? AND role='student' AND account_type='trial')
       AND NOT EXISTS (SELECT 1 FROM lessons WHERE trial_phone=? AND type='trial' AND status IN ('scheduled','pending','updating'))
       AND NOT EXISTS (SELECT 1 FROM lessons WHERE status IN ('scheduled','pending','updating') AND start<? AND end>?)
       AND NOT EXISTS (SELECT 1 FROM lessons WHERE status='updating' AND move_start<? AND move_end>?)
   `).bind(lid,trialUserId,tutorId,name,phone,phone,JSON.stringify(goals),trialComment,slot.start,slot.end,eventId,now(),now(),PRIVACY_POLICY_VERSION,s.meetUrl,'Бесплатный пробный урок',trialUserId,phone,slot.end,slot.start,slot.end,slot.start);
   const locks=slotKeys(slot.start,slot.end).map(key=>database.prepare(
     'INSERT INTO tutor_slot_locks (tutor_id,slot,lesson_id) SELECT ?,?,? WHERE EXISTS (SELECT 1 FROM lessons WHERE id=?)'
   ).bind(tutorId,key,lid,lid));
   let reserved=false;
   for(let attempt=0;attempt<(paid?1:6);attempt++){
     try{
       const results=await database.batch(paid?[paidInsert,...locks]:[trialUserInsert(),trialLessonInsert(),...locks,database.prepare("DELETE FROM users WHERE id=? AND account_type='trial' AND NOT EXISTS (SELECT 1 FROM lessons WHERE student_id=?)").bind(trialUserId,trialUserId)]);
       const lessonResult=results[paid?0:1];
       if(lessonResult.meta.changes){reserved=true;break;}
       if(paid)throw new HttpError('Время заняли или на балансе недостаточно свободных занятий.',409);
       const duplicate=await database.prepare("SELECT 1 FROM lessons WHERE trial_phone=? AND type='trial' AND status IN ('scheduled','pending','updating')").bind(phone).first();
       throw new HttpError(duplicate?'На этот телефон уже записан пробный урок. Свяжись с репетитором для изменения записи.':'Это время только что заняли. Выбери другое окно.',409);
     }catch(e){
       const message=e instanceof Error?e.message:'';
       if(!paid&&/UNIQUE constraint failed: users\.login/i.test(message)&&attempt<5){trialUserLogin=trialLogin();continue;}
       if(e instanceof HttpError)throw e;
       if(/UNIQUE constraint failed: lessons\.trial_phone/i.test(message))throw new HttpError('На этот телефон уже записан пробный урок. Свяжись с репетитором для изменения записи.',409);
       if(/UNIQUE constraint failed: tutor_slot_locks\.(tutor_id|slot)|SQLITE_CONSTRAINT_UNIQUE/i.test(message))throw new HttpError('Это время только что заняли. Выбери другое окно.',409);
       console.error('Booking reservation failed:',message||'Unknown error');
       throw new HttpError('Не удалось зарезервировать время. Попробуй ещё раз.',503);
     }
   }
   requireValue(reserved,'Не удалось зарезервировать время. Попробуй ещё раз.',503);
   let jazzRoomId:string|null=null,meetingUrl=s.meetUrl,calendarAttempted=false;
   try{
     if(saluteJazzConfigured(secrets)){
       const room=await createSaluteJazzRoom('TutorPlace · '+(paid?'Урок':'Пробный урок'),secrets);
       jazzRoomId=room.roomId;meetingUrl=room.roomUrl;
       await db().prepare("UPDATE lessons SET jazz_room_id=?,meet_url=? WHERE id=? AND status='pending'").bind(jazzRoomId,meetingUrl,lid).run();
     }
     if(calendarConfigured()){calendarAttempted=true;await calendar(eventPath(),'POST',{id:eventId,summary:'TutorPlace · '+(paid?'Урок':'Пробный урок')+' · '+name,description:paid?'Индивидуальное занятие':'Пробный урок, 45 минут.',start:{dateTime:slot!.start,timeZone:'Europe/Moscow'},end:{dateTime:slot!.end,timeZone:'Europe/Moscow'},...(meetingUrl?{location:meetingUrl}:{})});}
     const finalized=await database.batch([
       database.prepare("UPDATE lessons SET status='scheduled',operation_started_at=NULL WHERE id=? AND status='pending'").bind(lid),
       ...(sessionToken?[database.prepare("INSERT INTO sessions (id,user_id,expires_at) SELECT ?,?,? WHERE EXISTS (SELECT 1 FROM lessons WHERE id=? AND status='scheduled')").bind(sessionHash,trialUserId,sessionExpires,lid)]:[]),
     ]);
     requireValue(finalized[0]?.meta.changes===1,'Не удалось сохранить урок. Обнови расписание.',409);
     if(sessionToken)requireValue(finalized[1]?.meta.changes===1,'Не удалось открыть личный кабинет. Попробуй войти с созданными данными.',503);
   }catch(e){
     let calendarCleared=!calendarAttempted,roomCleared=!jazzRoomId;
     if(calendarAttempted){try{await calendar(eventPath(eventId),'DELETE');calendarCleared=true;}catch{calendarCleared=false;}}
     if(jazzRoomId){try{await db().prepare("UPDATE lessons SET jazz_room_id=?,jazz_room_needs_recreation=1 WHERE id=? AND status='pending'").bind(jazzRoomId,lid).run();try{await disableSaluteJazzRoom(jazzRoomId,secrets);roomCleared=true;}catch{roomCleared=false;}}catch{roomCleared=false;}}
     if(calendarCleared&&roomCleared)await database.batch([database.prepare('DELETE FROM slot_locks WHERE lesson_id=?').bind(lid),database.prepare('DELETE FROM tutor_slot_locks WHERE lesson_id=?').bind(lid),database.prepare("DELETE FROM lessons WHERE id=? AND status='pending'").bind(lid),...(trialUserId?[database.prepare('DELETE FROM sessions WHERE user_id=?').bind(trialUserId),database.prepare("DELETE FROM users WHERE id=? AND account_type='trial' AND NOT EXISTS (SELECT 1 FROM lessons WHERE student_id=?)").bind(trialUserId,trialUserId)]:[])]);
     else throw new HttpError('Не удалось безопасно завершить создание встречи. Время оставлено зарезервированным для сверки; свяжись с репетитором.',503);
     throw e;
   }
   await database.prepare("INSERT OR IGNORE INTO tutor_students(tutor_id,student_id,status,created_at) VALUES(?,?,'active',?)").bind(tutorId,trialUserId||u?.id,now()).run();
   await database.prepare('INSERT OR IGNORE INTO conversations(id,tutor_id,student_id,created_at,updated_at) VALUES(?,?,?,?,?)').bind(id(),tutorId,trialUserId||u?.id,now(),now()).run();
   const lesson=await database.prepare('SELECT * FROM lessons WHERE id=?').bind(lid).first();
   const trialAccount=trialUserId?{user:{id:trialUserId,name,role:'student',account_type:'trial',login:trialUserLogin,balance:0,price_per_lesson:1000},credentials:{login:trialUserLogin,password:trialPassword},autoLogin:!u}:undefined;
   const cookie=sessionToken?'ct-session='+sessionToken+'; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800'+(url.protocol==='https:'?'; Secure':''):undefined;
   return json({lesson,...(trialAccount?{trialAccount}:{})},201,cookie?{'Set-Cookie':cookie}:{});
 }
 if(path[0]==='balances'&&method==='GET'){
   const balanceOwner=await teacher(request);
   return json({balances:await all("SELECT id,balance FROM users WHERE role='student' AND (?=1 OR id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status='active'))",balanceOwner.is_platform_admin?1:0,balanceOwner.id)});
 }
 if(path[0]==='workspace'&&method==='GET'){
   const u=await auth(request);await cleanup();const isTeacher=u.role==='teacher';
   if(u.role==='support')return json({user:u,lessons:[],courses:[],courseEnrollments:[],topics:[],topicAccess:[],assignments:[],preparationItems:[],submissions:[],students:[],rooms:[],notifications:[],paymentLink:null,paymentRequests:[],paymentReminderPopupEnabled:false,schedule:undefined,configured:false});
   const courses=isTeacher?await all('SELECT * FROM courses WHERE tutor_id=? ORDER BY position,title',u.id):await all('SELECT c.* FROM courses c JOIN course_enrollments e ON e.course_id=c.id WHERE e.student_id=? ORDER BY c.position,c.title',u.id);
   const courseEnrollments=isTeacher?await all('SELECT course_id,student_id FROM course_enrollments WHERE course_id IN (SELECT id FROM courses WHERE tutor_id=?)',u.id):[];
   const topics=isTeacher?await all('SELECT id,course_id,parent_topic_id,title,description,format,colab_url,github_url,position FROM topics WHERE course_id IN (SELECT id FROM courses WHERE tutor_id=?) ORDER BY course_id,parent_topic_id,position,title',u.id):await all('SELECT t.id,t.course_id,t.parent_topic_id,t.title,t.description,t.format,t.position,CASE WHEN a.id IS NULL THEN NULL ELSE t.github_url END github_url,CASE WHEN a.id IS NULL THEN 1 ELSE 0 END locked,CASE WHEN a.id IS NULL THEN NULL ELSE t.colab_url END colab_url FROM topics t JOIN course_enrollments e ON e.course_id=t.course_id AND e.student_id=? LEFT JOIN topic_access a ON a.topic_id=COALESCE(t.parent_topic_id,t.id) AND a.student_id=? ORDER BY t.course_id,t.parent_topic_id,t.position,t.title',u.id,u.id);
   const assignments=isTeacher?await all("SELECT * FROM assignments WHERE student_id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status='active') OR topic_id IN (SELECT t.id FROM topics t JOIN courses c ON c.id=t.course_id WHERE c.tutor_id=?)",u.id,u.id):await all(`SELECT a.id,a.topic_id,a.student_id,a.lesson_id,a.title,a.kind,a.prompt,a.options FROM assignments a
     WHERE ((a.topic_id IS NOT NULL AND EXISTS (SELECT 1 FROM topics t JOIN course_enrollments e ON e.course_id=t.course_id AND e.student_id=? JOIN topic_access x ON x.topic_id=COALESCE(t.parent_topic_id,t.id) AND x.student_id=? WHERE t.id=a.topic_id))
       OR (a.topic_id IS NULL AND a.student_id=?))
       AND (a.lesson_id IS NULL OR EXISTS (SELECT 1 FROM lessons l WHERE l.id=a.lesson_id AND l.student_id=?))`,u.id,u.id,u.id,u.id);
   const topicAccess=isTeacher?await all('SELECT topic_id,student_id FROM topic_access WHERE student_id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status="active")',u.id):[];
   const preparationItems=isTeacher?await all('SELECT p.* FROM lesson_preparation_items p JOIN lessons l ON l.id=p.lesson_id WHERE l.tutor_id=? ORDER BY p.lesson_id,p.position',u.id):await all('SELECT p.* FROM lesson_preparation_items p JOIN lessons l ON l.id=p.lesson_id WHERE l.student_id=? ORDER BY p.lesson_id,p.position',u.id);
   const [paymentLink,paymentRequests,paymentReminderPopupSetting]=await Promise.all([
     db().prepare("SELECT value FROM settings WHERE key='payment-link'").first<{value:string}>(),
     isTeacher?all('SELECT * FROM payment_requests WHERE student_id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status="active") ORDER BY created_at DESC',u.id):all('SELECT * FROM payment_requests WHERE student_id=? ORDER BY created_at DESC',u.id),
     db().prepare("SELECT value FROM settings WHERE key='payment-reminder-popup'").first<{value:string}>(),
   ]);
   return json({user:u,lessons:isTeacher?await all('SELECT * FROM lessons WHERE tutor_id=? ORDER BY start',u.id):await all('SELECT * FROM lessons WHERE student_id=? ORDER BY start',u.id),courses,courseEnrollments,topics,topicAccess,assignments,preparationItems,submissions:isTeacher?await all('SELECT * FROM submissions WHERE student_id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status="active") ORDER BY created_at',u.id):await all('SELECT * FROM submissions WHERE student_id=? ORDER BY created_at',u.id),students:isTeacher?(await all("SELECT u.* FROM users u JOIN tutor_students ts ON ts.student_id=u.id WHERE ts.tutor_id=? AND ts.status='active'",u.id)).map(safeUser):[u],rooms:isTeacher?await all('SELECT * FROM rooms WHERE student_id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status="active")',u.id):await all('SELECT * FROM rooms WHERE student_id=?',u.id),notifications:isTeacher?await all('SELECT * FROM notifications WHERE student_id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status="active") ORDER BY created_at DESC',u.id):await all('SELECT * FROM notifications WHERE student_id=? ORDER BY created_at DESC',u.id),paymentLink:paymentLink?.value||null,paymentRequests,paymentReminderPopupEnabled:paymentReminderPopupSetting?.value!=='0',schedule:isTeacher?await schedule(u.id):undefined,configured:true,saluteJazzConfigured:saluteJazzConfigured(secrets)});
 }
 if(path[0]==='trial-accounts'&&path[1]==='backfill'&&method==='POST'){
   const actingTutor=await teacher(request);
   const database=db(),current=now(),appointments=await all("SELECT id,name,phone,trial_phone,start FROM lessons WHERE type='trial' AND tutor_id=? AND status='scheduled' AND start>? AND student_id IS NULL ORDER BY start,id",actingTutor.id,current);
   const grouped=new Map<string,Row[]>();
   for(const appointment of appointments){const phone=normalizeTrialPhone(appointment.trial_phone||appointment.phone),key=phone||'lesson:'+appointment.id,group=grouped.get(key)||[];group.push(appointment);grouped.set(key,group);}
   const accounts:{id:string;name:string;phone:string|null;start:string;login:string;password:string}[]=[];let linked=0;
   for(const [key,group] of grouped){
     const phone=key.startsWith('lesson:')?normalizeTrialPhone(group[0].phone):key;
     const existing=phone?await database.prepare("SELECT u.id FROM users u JOIN tutor_students ts ON ts.student_id=u.id AND ts.tutor_id=? AND ts.status='active' WHERE u.role='student' AND u.account_type='trial' AND u.phone=? ORDER BY u.created_at LIMIT 1").bind(actingTutor.id,phone).first<{id:string}>():null;
     if(existing){
       const updates=group.map(lesson=>database.prepare("UPDATE lessons SET student_id=? WHERE id=? AND student_id IS NULL AND type='trial' AND status='scheduled' AND start>?").bind(existing.id,lesson.id,current));
       const results=await database.batch(updates);const attached=results.reduce((count,result)=>count+result.meta.changes,0);if(attached){await database.prepare("INSERT OR IGNORE INTO tutor_students(tutor_id,student_id,status,created_at) VALUES(?,?,'active',?)").bind(actingTutor.id,existing.id,now()).run();await database.prepare('INSERT OR IGNORE INTO conversations(id,tutor_id,student_id,created_at,updated_at) VALUES(?,?,?,?,?)').bind(id(),actingTutor.id,existing.id,now(),now()).run();}linked+=attached;continue;
     }
     const userId=id(),name=text(group[0].name,80)||'Ученик',password=randomCredential(16),passwordDigest=await passwordHash(password),createdAt=now();
     let login=trialLogin(),migrated=0;
     for(let attempt=0;attempt<6;attempt++){
       try{
         const statements=[
           database.prepare("INSERT INTO users (id,login,password,name,role,phone,account_type,created_at) VALUES (?,?,?,?,'student',?,'trial',?)").bind(userId,login,passwordDigest,name,phone,createdAt),
           ...group.map(lesson=>database.prepare("UPDATE lessons SET student_id=? WHERE id=? AND student_id IS NULL AND type='trial' AND status='scheduled' AND start>?").bind(userId,lesson.id,current)),
           database.prepare("DELETE FROM users WHERE id=? AND account_type='trial' AND NOT EXISTS (SELECT 1 FROM lessons WHERE student_id=?)").bind(userId,userId),
         ];
         const results=await database.batch(statements);migrated=results.slice(1,1+group.length).reduce((count,result)=>count+result.meta.changes,0);break;
       }catch(error){const message=error instanceof Error?error.message:'';if(/UNIQUE constraint failed: users\.login/i.test(message)&&attempt<5){login=trialLogin();continue;}throw error;}
     }
     linked+=migrated;
     if(migrated){await database.prepare("INSERT OR IGNORE INTO tutor_students(tutor_id,student_id,status,created_at) VALUES(?,?,'active',?)").bind(actingTutor.id,userId,now()).run();await database.prepare('INSERT OR IGNORE INTO conversations(id,tutor_id,student_id,created_at,updated_at) VALUES(?,?,?,?,?)').bind(id(),actingTutor.id,userId,now(),now()).run();accounts.push({id:userId,name,phone,start:group[0].start,login,password});}
   }
   return json({accounts,linked});
 }
 if(path[0]==='students'&&!path[1]&&method==='POST'){
   const actingTutor=await teacher(request);requireValue(text(body.name)&&text(body.parent_name)&&text(body.login),'Обязательны имя, возраст, родитель и логин.');requireValue(Number.isInteger(body.age)&&body.age!>=1&&body.age!<=100,'Укажи корректный возраст.');requireValue(Number.isSafeInteger(body.balance)&&body.balance!>=-1000000&&body.balance!<=1000000&&(!body.balance||body.balance>=0||Boolean(body.id)),'Баланс должен быть целым числом от -1 000 000 до 1 000 000.');requireValue(body.price_per_lesson===undefined||Number.isInteger(body.price_per_lesson)&&body.price_per_lesson!>=1&&body.price_per_lesson!<=1000000,'Цена занятия должна быть целым числом от 1 до 1 000 000 ₽.');requireValue(!body.password||typeof body.password==='string'&&body.password.length>=8&&body.password.length<=128,'Пароль — от 8 до 128 символов.');
   const uid=body.id||id();const existing=body.id?await db().prepare("SELECT id,price_per_lesson FROM users WHERE id=? AND role='student' AND (?=1 OR EXISTS (SELECT 1 FROM tutor_students WHERE tutor_id=? AND student_id=users.id AND status='active'))").bind(body.id,actingTutor.is_platform_admin?1:0,actingTutor.id).first<{id:string;price_per_lesson:number}>():null;requireValue(!body.id||existing,'Ученик не найден.',404);if(!existing)requireValue(body.password,'Укажи пароль.');const pricePerLesson=body.price_per_lesson??existing?.price_per_lesson??1000;
   try{if(existing){await db().prepare('UPDATE users SET name=?,age=?,parent_name=?,login=?,phone=?,parent_phone=?,balance=?,price_per_lesson=? WHERE id=?').bind(text(body.name),body.age,text(body.parent_name),text(body.login,100),text(body.phone),text(body.parent_phone),body.balance,pricePerLesson,uid).run();if(body.password)await db().batch([db().prepare('UPDATE users SET password=? WHERE id=?').bind(await passwordHash(body.password),uid),db().prepare('DELETE FROM sessions WHERE user_id=?').bind(uid)]);}else{await db().prepare("INSERT INTO users (id,name,age,parent_name,login,password,phone,parent_phone,balance,price_per_lesson,role,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,'student',?)").bind(uid,text(body.name),body.age,text(body.parent_name),text(body.login,100),await passwordHash(body.password!),text(body.phone),text(body.parent_phone),body.balance,pricePerLesson,now()).run();await db().prepare("INSERT OR IGNORE INTO tutor_students(tutor_id,student_id,status,created_at) VALUES(?,?,'active',?)").bind(actingTutor.id,uid,now()).run();await db().prepare('INSERT OR IGNORE INTO conversations(id,tutor_id,student_id,created_at,updated_at) VALUES(?,?,?,?,?)').bind(id(),actingTutor.id,uid,now(),now()).run();}}catch(e){if(e instanceof HttpError)throw e;throw new HttpError('Этот логин уже используется. Выбери другой.',409);}
   return json({ok:true});
 }
 if(path[0]==='students'&&path[1]&&path[2]==='promote'&&method==='POST'){
   await teacher(request);
   const actingTutor=await teacher(request),studentId=text(path[1],100),student=await db().prepare("SELECT id,account_type FROM users WHERE id=? AND role='student' AND (?=1 OR EXISTS (SELECT 1 FROM tutor_students WHERE tutor_id=? AND student_id=users.id AND status='active'))").bind(studentId,actingTutor.is_platform_admin?1:0,actingTutor.id).first<{id:string;account_type:string}>();
   requireValue(student,'Ученик не найден.',404);
   if(student!.account_type==='trial')await db().prepare("UPDATE users SET account_type='regular' WHERE id=? AND role='student' AND account_type='trial'").bind(studentId).run();
   return json({ok:true,account_type:'regular'});
 }
 if(path[0]==='students'&&path[1]&&method==='DELETE'){
   await teacher(request);
   const actingTutor=await teacher(request),studentId=path[1];
   const student=await db().prepare("SELECT id FROM users WHERE id=? AND role='student' AND (?=1 OR EXISTS (SELECT 1 FROM tutor_students WHERE tutor_id=? AND student_id=users.id AND status='active'))").bind(studentId,actingTutor.is_platform_admin?1:0,actingTutor.id).first();
   requireValue(student,'Ученик не найден.',404);
   const otherTutor=await db().prepare("SELECT tutor_id FROM tutor_students WHERE student_id=? AND tutor_id<>? AND status='active' LIMIT 1").bind(studentId,actingTutor.id).first();
   if(otherTutor&&!actingTutor.is_platform_admin){await db().prepare("UPDATE tutor_students SET status='archived' WHERE tutor_id=? AND student_id=?").bind(actingTutor.id,studentId).run();return json({ok:true,detached:true});}
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
     database.prepare(`DELETE FROM lesson_preparation_items WHERE lesson_id IN (SELECT id FROM lessons WHERE student_id=?) AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM lesson_preparation_items WHERE assignment_id IN (SELECT id FROM assignments WHERE student_id=? OR lesson_id IN (SELECT id FROM lessons WHERE student_id=?)) AND ${absent}`).bind(studentId,studentId,studentId),
     database.prepare(`INSERT INTO settings (key,value)
       SELECT 'assignment-image-delete:student:' || ? || ':' || i.id,
              json_object('object_key',i.object_key,'storage_backend',i.storage_backend)
       FROM assignment_images i JOIN assignments a ON a.id=i.assignment_id
       WHERE (a.student_id=? OR a.lesson_id IN (SELECT id FROM lessons WHERE student_id=?))
         AND ${absent} ON CONFLICT(key) DO NOTHING`).bind(studentId,studentId,studentId,studentId),
     database.prepare(`DELETE FROM assignments WHERE (student_id=? OR lesson_id IN (SELECT id FROM lessons WHERE student_id=?)) AND ${absent}`).bind(studentId,studentId,studentId),
     database.prepare(`DELETE FROM slot_locks WHERE lesson_id IN (SELECT id FROM lessons WHERE student_id=?) AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM payment_requests WHERE student_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM lessons WHERE student_id=? AND ${absent}`).bind(studentId,studentId),
     database.prepare(`DELETE FROM settings WHERE key=? AND ${absent}`).bind('cancel-lock:'+studentId,studentId),
   ]);
   requireValue(results[0]?.meta.changes,'Активный урок не позволяет удалить ученика. Обнови список и попробуй снова.',409);
   try{await cleanupOrphanedAssignmentImages(database,secrets);}catch(error){console.error('Assignment image cleanup deferred after student deletion:',error instanceof Error?error.message:'Unknown error');}
   return json({ok:true});
 }
 if(path[0]==='settings'&&path[1]==='payment-reminders'&&method==='POST'){
   await teacher(request);requireValue(typeof body.enabled==='boolean','Выбери, показывать ли всплывающие напоминания.');
   const statements=[db().prepare("INSERT INTO settings (key,value) VALUES ('payment-reminder-popup',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(body.enabled?'1':'0')];
   if(!body.enabled)statements.push(db().prepare("UPDATE notifications SET read=1,popup_dismissed_at=COALESCE(popup_dismissed_at,?) WHERE type='payment_reminder' AND popup=1 AND popup_dismissed_at IS NULL").bind(now()));
   await db().batch(statements);return json({ok:true,enabled:body.enabled});
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
   const meetUrl=text(body.meetUrl,2000).trim();const normalized=normalizeSchedule({weeklyAvailability,dateOverrides,availabilityCalendarIds:selectedCalendars,timezone:text(body.timezone,64)||'Europe/Moscow',meetUrl:meetUrl?httpsUrl(meetUrl):''});
   await db().prepare("INSERT INTO tutor_settings (tutor_id,key,value) VALUES (?,'schedule',?) ON CONFLICT(tutor_id,key) DO UPDATE SET value=excluded.value").bind((await teacher(request)).id,JSON.stringify(normalized)).run();clearScheduleCache((await teacher(request)).id);return json({ok:true});
 }
 if(path[0]==='courses'&&path[1]&&method==='DELETE'){
   const actingTutor=await teacher(request),courseId=text(path[1],100);requireValue(courseId,'Курс не найден.',404);requireValue(await db().prepare('SELECT id FROM courses WHERE id=? AND (?=1 OR tutor_id=?)').bind(courseId,actingTutor.is_platform_admin?1:0,actingTutor.id).first(),'Курс не найден.',404);
   const results=await db().batch([
     db().prepare(`INSERT INTO settings (key,value)
       SELECT 'assignment-image-delete:course:' || ? || ':' || i.id, json_object('object_key',i.object_key,'storage_backend',i.storage_backend)
       FROM assignment_images i JOIN assignments a ON a.id=i.assignment_id JOIN topics t ON t.id=a.topic_id
       WHERE t.course_id=? ON CONFLICT(key) DO NOTHING`).bind(courseId,courseId),
     db().prepare(`DELETE FROM lesson_preparation_items
       WHERE topic_id IN (SELECT id FROM topics WHERE course_id=?)
          OR assignment_id IN (SELECT id FROM assignments WHERE topic_id IN (SELECT id FROM topics WHERE course_id=?))`).bind(courseId,courseId),
     db().prepare('DELETE FROM submissions WHERE assignment_id IN (SELECT id FROM assignments WHERE topic_id IN (SELECT id FROM topics WHERE course_id=?))').bind(courseId),
     db().prepare('DELETE FROM assignment_images WHERE assignment_id IN (SELECT id FROM assignments WHERE topic_id IN (SELECT id FROM topics WHERE course_id=?))').bind(courseId),
     db().prepare('DELETE FROM assignments WHERE topic_id IN (SELECT id FROM topics WHERE course_id=?)').bind(courseId),
     db().prepare('DELETE FROM topic_access WHERE topic_id IN (SELECT id FROM topics WHERE course_id=?)').bind(courseId),
     db().prepare('DELETE FROM course_enrollments WHERE course_id=?').bind(courseId),
     db().prepare('DELETE FROM topics WHERE course_id=?').bind(courseId),
     db().prepare('DELETE FROM courses WHERE id=?').bind(courseId),
   ]);
   requireValue(results.at(-1)?.meta.changes===1,'Курс уже удалён. Обнови список.',404);
   try{await cleanupOrphanedAssignmentImages(db(),secrets);}catch(error){console.error('Assignment image cleanup deferred after course deletion:',courseId,error instanceof Error?error.message:'Unknown error');}
   return json({ok:true});
 }
 if(path[0]==='courses'&&method==='POST'){
   const actingTutor=await teacher(request),courseId=text(body.id,100)||id(),title=text(body.title,120),description=text(body.description,1000);requireValue(title,'Укажи название курса.');
   const existing=body.id?await db().prepare('SELECT id,position FROM courses WHERE id=? AND (?=1 OR tutor_id=?)').bind(courseId,actingTutor.is_platform_admin?1:0,actingTutor.id).first<Row>():null;requireValue(!body.id||existing,'Курс не найден.',404);
   const studentIds=Array.isArray(body.studentIds)?[...new Set(body.studentIds.filter((x):x is string=>typeof x==='string'&&x.length<=100))]:[];requireValue(studentIds.length<=200,'В одном курсе может быть не более 200 учеников.');
   if(studentIds.length){const found=await all(`SELECT id FROM users WHERE role='student' AND id IN (${studentIds.map(()=>'?').join(',')})`,...studentIds);requireValue(found.length===studentIds.length,'В списке есть неизвестный ученик.');}
   if(studentIds.length){const linked=await all(`SELECT student_id id FROM tutor_students WHERE tutor_id=? AND status='active' AND student_id IN (${studentIds.map(()=>'?').join(',')})`,actingTutor.id,...studentIds);requireValue(actingTutor.is_platform_admin||linked.length===studentIds.length,'В списке есть ученик другого репетитора.',403);}
   const position=Number.isInteger(body.position)&&body.position!>=0?body.position!:existing?.position??Number((await db().prepare('SELECT COALESCE(MAX(position),-1)+1 position FROM courses WHERE tutor_id=?').bind(actingTutor.id).first<Row>())?.position||0);
   const statements=[db().prepare('INSERT INTO courses (id,tutor_id,title,description,position) VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,position=excluded.position WHERE courses.tutor_id=excluded.tutor_id').bind(courseId,actingTutor.id,title,description||null,position)];
   if(studentIds.length)statements.push(db().prepare(`DELETE FROM course_enrollments WHERE course_id=? AND student_id NOT IN (${studentIds.map(()=>'?').join(',')})`).bind(courseId,...studentIds));else statements.push(db().prepare('DELETE FROM course_enrollments WHERE course_id=?').bind(courseId));
   statements.push(...studentIds.map(studentId=>db().prepare('INSERT OR IGNORE INTO course_enrollments (id,course_id,student_id) VALUES (?,?,?)').bind(id(),courseId,studentId)));
   await db().batch(statements);return json({ok:true,id:courseId});
 }
 if(path[0]==='topics'&&path[1]==='order'&&method==='POST'){
   const actingTutor=await teacher(request),courseId=text(body.courseId,100),parentTopicId=text(body.parentTopicId,100)||null,topicIds=Array.isArray(body.topicIds)?body.topicIds:[];requireValue(await db().prepare('SELECT id FROM courses WHERE id=? AND (?=1 OR tutor_id=?)').bind(courseId,actingTutor.is_platform_admin?1:0,actingTutor.id).first(),'Курс не найден.');
   if(parentTopicId)requireValue(await db().prepare('SELECT id FROM topics WHERE id=? AND course_id=? AND parent_topic_id IS NULL').bind(parentTopicId,courseId).first(),'Основная тема не найдена.',404);
   requireValue(topicIds.length<=500&&topicIds.every((x):x is string=>typeof x==='string')&&new Set(topicIds).size===topicIds.length,'Некорректный порядок тем.');
   const topics=await all('SELECT id FROM topics WHERE course_id=? AND parent_topic_id IS ?',courseId,parentTopicId);requireValue(topics.length===topicIds.length&&topics.every(t=>topicIds.includes(t.id)),'Список тем изменился. Обнови страницу.',409);
   await db().batch(topicIds.map((topicId:string,position:number)=>db().prepare('UPDATE topics SET position=? WHERE id=? AND course_id=? AND parent_topic_id IS ?').bind(position,topicId,courseId,parentTopicId)));return json({ok:true});
 }
 if(path[0]==='topics'&&method==='POST'){
   const actingTutor=await teacher(request),courseId=text(body.course_id,100),topicId=text(body.id,100)||id(),parentTopicId=text(body.parent_topic_id,100)||null;let githubUrl=text(body.github_url,2000)||null;const existing=await db().prepare('SELECT id,course_id,parent_topic_id FROM topics WHERE id=?').bind(topicId).first<Row>();
   requireValue(text(body.title)&&['md','ipynb'].includes(body.format||''),'Проверь название и формат материала.');requireValue(await db().prepare('SELECT id FROM courses WHERE id=? AND (?=1 OR tutor_id=?)').bind(courseId,actingTutor.is_platform_admin?1:0,actingTutor.id).first(),'Курс не найден.');
   if(existing)requireValue(existing.course_id===courseId,'Нельзя переместить существующую тему в другой курс.',409);
   if(parentTopicId){const parent=await db().prepare('SELECT id FROM topics WHERE id=? AND course_id=? AND parent_topic_id IS NULL').bind(parentTopicId,courseId).first();requireValue(parent&&parentTopicId!==topicId,'Подтема должна относиться к основной теме этого курса.');requireValue(!await db().prepare('SELECT id FROM topics WHERE parent_topic_id=? LIMIT 1').bind(topicId).first(),'Тема с подтемами не может стать подтемой.',409);}
   else if(existing?.parent_topic_id){/* Saving a subtopic without its parent is rejected below rather than silently promoting it. */requireValue(Object.prototype.hasOwnProperty.call(body,'parent_topic_id'),'Укажи основную тему для подтемы.');}
   let content=typeof body.content==='string'?body.content:'';const format=body.format!;
   if(githubUrl){const source=githubSource(githubUrl);requireValue(source.format===format,'Формат материала должен совпадать с расширением файла GitHub.');githubUrl=source.url;content='';}
   else{requireValue(content.length>0&&content.length<=2000000,'Добавь содержимое материала размером до 2 МБ.');if(format==='ipynb')validateNotebook(content);}
   const colab=httpsUrl(body.colab_url);if(colab)requireValue(new URL(colab).hostname==='colab.research.google.com','Укажи ссылку Google Colab.');
   const position=Number.isInteger(body.position)&&body.position!>=0?body.position!:Number((await db().prepare('SELECT COALESCE(MAX(position),-1)+1 position FROM topics WHERE course_id=? AND parent_topic_id IS ?').bind(courseId,parentTopicId).first<Row>())?.position||0);
   await db().prepare('INSERT INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET parent_topic_id=excluded.parent_topic_id,title=excluded.title,description=excluded.description,content=excluded.content,format=excluded.format,colab_url=excluded.colab_url,github_url=excluded.github_url,position=excluded.position').bind(topicId,courseId,parentTopicId,text(body.title),text(body.description,500),content,format,colab,githubUrl,position).run();return json({ok:true,id:topicId});
 }
 if(path[0]==='access'&&method==='POST'){
   await teacher(request);requireValue(await db().prepare("SELECT id FROM users WHERE id=? AND role='student'").bind(body.studentId).first(),'Ученик не найден.');const topic=await db().prepare('SELECT course_id,parent_topic_id FROM topics WHERE id=?').bind(body.topicId).first<Row>();requireValue(topic,'Тема не найдена.');requireValue(!topic!.parent_topic_id,'Доступ настраивается у основной темы и наследуется подтемами.');requireValue(await db().prepare('SELECT id FROM course_enrollments WHERE course_id=? AND student_id=?').bind(topic!.course_id,body.studentId).first(),'Сначала открой доступ ученику к курсу.');if(body.enabled)await db().prepare('INSERT OR IGNORE INTO topic_access (id,topic_id,student_id) VALUES (?,?,?)').bind(id(),body.topicId,body.studentId).run();else await db().prepare('DELETE FROM topic_access WHERE topic_id=? AND student_id=?').bind(body.topicId,body.studentId).run();return json({ok:true});
 }
 if(path[0]==='notifications'&&path[1]==='pending'&&method==='GET'){
   const u=await auth(request);requireValue(u.role==='student','Всплывающие напоминания доступны ученику.',403);
   const setting=await db().prepare("SELECT value FROM settings WHERE key='payment-reminder-popup'").first<{value:string}>();
   if(setting?.value==='0')return json({notifications:[]});
   const notifications=await all("SELECT id,student_id,title,body,created_at,read,type,popup,popup_dismissed_at FROM notifications WHERE student_id=? AND type='payment_reminder' AND popup=1 AND COALESCE(read,0)=0 AND popup_dismissed_at IS NULL ORDER BY created_at LIMIT 20",u.id);
   return json({notifications});
 }
 if(path[0]==='notifications'&&path[1]==='read'&&method==='POST'){
   const u=await auth(request);requireValue(u.role==='student','Отметить уведомления прочитанными может только ученик.',403);
   await db().prepare('UPDATE notifications SET read=1 WHERE student_id=? AND COALESCE(read,0)=0').bind(u.id).run();
   return json({ok:true});
 }
 if(path[0]==='notifications'&&path[1]&&path[2]==='dismiss'&&method==='POST'){
   const u=await auth(request);requireValue(u.role==='student','Уведомление может закрыть только ученик.',403);
   const result=await db().prepare('UPDATE notifications SET read=1,popup_dismissed_at=COALESCE(popup_dismissed_at,?) WHERE id=? AND student_id=?').bind(now(),path[1],u.id).run();
   requireValue(result.meta.changes===1,'Уведомление не найдено.',404);return json({ok:true});
 }
 if(path[0]==='notifications'&&method==='POST'){
   const notificationOwner=await teacher(request);requireValue(await db().prepare("SELECT id FROM users WHERE id=? AND role='student' AND (?=1 OR EXISTS (SELECT 1 FROM tutor_students WHERE tutor_id=? AND student_id=users.id AND status='active'))").bind(body.student_id,notificationOwner.is_platform_admin?1:0,notificationOwner.id).first(),'Выбери ученика.');requireValue(text(body.title)&&text(body.body,4000),'Добавь заголовок и сообщение.');requireValue(body.type===undefined||body.type==='general'||body.type==='payment_reminder','Неизвестный тип уведомления.');
   const type=body.type==='payment_reminder'?'payment_reminder':'general',setting=await db().prepare("SELECT value FROM settings WHERE key='payment-reminder-popup'").first<{value:string}>(),popup=type==='payment_reminder'&&setting?.value!=='0'?1:0;
   await db().prepare('INSERT INTO notifications (id,student_id,title,body,created_at,read,type,popup) VALUES (?,?,?,?,?,0,?,?)').bind(id(),body.student_id,text(body.title),text(body.body,4000),now(),type,popup).run();return json({ok:true});
 }
 if(path[0]==='assignments'&&method==='POST'){
   const assignmentOwner=await teacher(request);const title=text(body.title),rawPrompt=text(body.prompt,20001);requireValue(title&&rawPrompt&&rawPrompt.length<=20000&&['code','quiz','text'].includes(body.kind||''),'Проверь данные задания.');const prompt=normalizeAssignmentPrompt(rawPrompt);requireValue(prompt.length<=20000&&prompt.trim(),'Условие после форматирования должно содержать от 1 до 20 000 символов.');const topicId=text(body.topic_id,100)||null,studentId=text(body.student_id,100)||null;requireValue(Boolean(topicId)!==Boolean(studentId),'Выбери тему курса или одного ученика.');if(topicId)requireValue(await db().prepare('SELECT t.id FROM topics t JOIN courses c ON c.id=t.course_id WHERE t.id=? AND (?=1 OR c.tutor_id=?)').bind(topicId,assignmentOwner.is_platform_admin?1:0,assignmentOwner.id).first(),'Тема не найдена.');if(studentId)requireValue(await db().prepare("SELECT id FROM users WHERE id=? AND role='student' AND (?=1 OR EXISTS (SELECT 1 FROM tutor_students WHERE tutor_id=? AND student_id=users.id AND status='active'))").bind(studentId,assignmentOwner.is_platform_admin?1:0,assignmentOwner.id).first(),'Ученик не найден.');if(body.kind==='quiz')requireValue(Array.isArray(body.options)&&body.options.length>=2&&body.options.length<=20&&Number(body.answer)>=0&&Number(body.answer)<body.options.length,'Проверь варианты и номер правильного ответа.');const lessonId=text(body.lesson_id,100)||null;if(lessonId){const {l:lesson}=await lessonAccess(request,lessonId);requireValue(lesson,'Урок не найден.');if(studentId)requireValue(lesson!.student_id===studentId,'Урок не принадлежит выбранному ученику.');if(topicId)requireValue(!!lesson!.student_id&&await studentCanReadTopic(lesson!.student_id,topicId),'У ученика нет доступа к теме, связанной с уроком.',403);}
   const assignmentId=text(body.id,100)||id(),existingAssignment=await db().prepare("SELECT id FROM assignments WHERE id=? AND (?=1 OR student_id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status='active') OR topic_id IN (SELECT t.id FROM topics t JOIN courses c ON c.id=t.course_id WHERE c.tutor_id=?) OR lesson_id IN (SELECT id FROM lessons WHERE tutor_id=?))").bind(assignmentId,assignmentOwner.is_platform_admin?1:0,assignmentOwner.id,assignmentOwner.id,assignmentOwner.id).first();
   requireValue(!body.id||existingAssignment,'Задание не найдено.',404);
   if(!existingAssignment)requireValue(!await db().prepare('SELECT id FROM assignment_images WHERE assignment_id=?').bind(assignmentId).first(),'Этот идентификатор уже использовался. Создай задание заново.',409);
   const savedAt=now(),lessonExists=lessonId?'EXISTS (SELECT 1 FROM lessons WHERE id=?)':'1',lessonBindings=lessonId?[lessonId]:[];
   const saved=await db().batch([
     db().prepare(`INSERT INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests,created_at,completed_at)
       SELECT ?,?,?,?,?,?,?,?,?,?,?,NULL WHERE ${lessonExists}
       ON CONFLICT(id) DO UPDATE SET topic_id=excluded.topic_id,student_id=excluded.student_id,lesson_id=excluded.lesson_id,title=excluded.title,kind=excluded.kind,prompt=excluded.prompt,options=excluded.options,answer=excluded.answer,tests=NULL,created_at=excluded.created_at,completed_at=NULL`).bind(assignmentId,topicId,studentId,lessonId,title,body.kind,prompt,body.kind==='quiz'?JSON.stringify(body.options):null,body.kind==='quiz'?String(body.answer):null,null,savedAt,...lessonBindings),
     db().prepare(`INSERT INTO settings (key,value)
       SELECT 'assignment-image-delete:edit:' || ? || ':' || i.id,
              json_object('object_key',i.object_key,'storage_backend',i.storage_backend)
       FROM assignment_images i
       WHERE i.assignment_id=? AND ${lessonExists} AND instr(?, '/api/assignment-images/' || i.id)=0
       ON CONFLICT(key) DO NOTHING`).bind(assignmentId,assignmentId,...lessonBindings,prompt),
     db().prepare(`DELETE FROM assignment_images WHERE assignment_id=? AND ${lessonExists} AND instr(?, '/api/assignment-images/' || id)=0`).bind(assignmentId,...lessonBindings,prompt),
   ]);
   requireValue(saved[0]?.meta.changes===1,'Урок уже изменён. Обнови страницу и повтори попытку.',409);
   try{await cleanupOrphanedAssignmentImages(db(),secrets);}catch(error){console.error('Assignment image cleanup deferred after assignment edit:',assignmentId,error instanceof Error?error.message:'Unknown error');}
   return json({ok:true});
 }
 if(path[0]==='submit'&&method==='POST'){
   const u=await auth(request);requireValue(u.role==='student','Отправка доступна ученику.',403);const a=await db().prepare(`SELECT a.* FROM assignments a WHERE a.id=? AND ((a.student_id=? AND a.topic_id IS NULL) OR (a.topic_id IS NOT NULL AND EXISTS (SELECT 1 FROM topics t JOIN course_enrollments e ON e.course_id=t.course_id AND e.student_id=? JOIN topic_access x ON x.topic_id=COALESCE(t.parent_topic_id,t.id) AND x.student_id=? WHERE t.id=a.topic_id))) AND (a.lesson_id IS NULL OR EXISTS (SELECT 1 FROM lessons l WHERE l.id=a.lesson_id AND l.student_id=?))`).bind(body.assignmentId,u.id,u.id,u.id,u.id).first<Row>();requireValue(a,'Задание недоступно.',403);const content=text(body.content,50000);requireValue(content,'Добавь решение.');
   let result:{status:string;tests?:{number:number;passed:boolean}[]}={status:'pending'};
   if(a!.kind==='quiz')result={status:content===a!.answer?'passed':'failed',tests:[{number:1,passed:content===a!.answer}]};
   const submittedAt=now(),submission={id:id(),assignment_id:a!.id,student_id:u.id,content,result:JSON.stringify(result),created_at:submittedAt};
   const saved=await db().batch([
     db().prepare('UPDATE assignments SET completed_at=? WHERE id=?').bind(result.status==='pending'?null:submittedAt,a!.id),
     db().prepare('INSERT INTO submissions (id,assignment_id,student_id,content,result,created_at) SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM assignments WHERE id=?)').bind(submission.id,submission.assignment_id,submission.student_id,submission.content,submission.result,submission.created_at,submission.assignment_id),
   ]);
   requireValue(saved[1]?.meta.changes===1,'Задание уже удалено. Обнови страницу.',404);return json({submission});
 }
 if(path[0]==='submissions'&&path[1]&&method==='POST'){
   const reviewer=await teacher(request);requireValue(body.status==='passed'||body.status==='needs_work','Некорректный результат.');const submission=await db().prepare("SELECT s.assignment_id,s.result FROM submissions s JOIN assignments a ON a.id=s.assignment_id WHERE s.id=? AND (?=1 OR a.student_id IN (SELECT student_id FROM tutor_students WHERE tutor_id=? AND status='active') OR a.topic_id IN (SELECT t.id FROM topics t JOIN courses c ON c.id=t.course_id WHERE c.tutor_id=?) OR a.lesson_id IN (SELECT id FROM lessons WHERE tutor_id=?))").bind(path[1],reviewer.is_platform_admin?1:0,reviewer.id,reviewer.id,reviewer.id).first<Row>();requireValue(submission,'Работа не найдена.',404);requireValue(resultStatus(submission!.result)==='pending','Эта работа уже проверена.',409);const feedback=text(body.feedback,2000),reviewedAt=now(),updatedResult=JSON.stringify({status:body.status});
   const updated=await db().batch([
     db().prepare('UPDATE submissions SET result=?,feedback=?,feedback_at=? WHERE id=? AND result=?').bind(updatedResult,feedback||null,feedback?reviewedAt:null,path[1],submission!.result),
     db().prepare('UPDATE assignments SET completed_at=? WHERE id=? AND EXISTS (SELECT 1 FROM submissions WHERE id=? AND result=?)').bind(reviewedAt,submission!.assignment_id,path[1],updatedResult),
   ]);
   requireValue(updated[0]?.meta.changes===1,'Эта работа уже проверена.',409);return json({ok:true});
 }
 if(path[0]==='lesson-details'&&method==='POST'){
   await teacher(request);const lessonId=text(body.id,100),l=await db().prepare('SELECT * FROM lessons WHERE id=?').bind(lessonId).first<Row>();requireValue(l,'Урок не найден.',404);
   const meet=httpsUrl(body.meet_url),topicLabel=text(body.topic,200);
   const statements=[db().prepare('UPDATE lessons SET topic=?,meet_url=? WHERE id=?').bind(topicLabel,meet,lessonId)];
   if(body.preparation!==undefined){
     requireValue(Array.isArray(body.preparation)&&body.preparation.length<=100,'Список подготовки должен содержать не более 100 пунктов.');
     const emptyTrialChecklist=l!.student_id===null&&l!.status==='scheduled'&&body.preparation.length===0;
     if(!emptyTrialChecklist)requireValue(l!.student_id&&l!.status==='scheduled','Подготовку можно назначить только к запланированному уроку ученика.',409);
     const parsed:{kind:'topic'|'assignment';targetId:string;key:string}[]=[];
     for(const item of body.preparation){
       requireValue(!!item&&typeof item==='object'&&'kind'in item&&'id'in item,'Некорректный пункт подготовки.');
       const value=item as {kind?:unknown;id?:unknown};requireValue((value.kind==='topic'||value.kind==='assignment')&&typeof value.id==='string'&&value.id.length<=100,'Некорректный пункт подготовки.');
       const key=value.kind+':'+value.id;requireValue(!parsed.some(existing=>existing.key===key),'В списке подготовки есть повтор.');
       if(value.kind==='topic'){
         requireValue(await db().prepare('SELECT id FROM topics WHERE id=?').bind(value.id).first(),'Тема не найдена.',404);
         requireValue(await studentCanReadTopic(l!.student_id,value.id),'Сначала открой ученику доступ к курсу и основной теме.',403);
       }else{
         const assignment=await db().prepare('SELECT topic_id,student_id,lesson_id FROM assignments WHERE id=?').bind(value.id).first<Row>();requireValue(assignment,'Задание не найдено.',404);requireValue(!assignment!.lesson_id||assignment!.lesson_id===lessonId,'Задание уже привязано к другому уроку.',409);
         if(assignment!.topic_id)requireValue(await studentCanReadTopic(l!.student_id,assignment!.topic_id),'У ученика нет доступа к теме этого задания.',403);
         else requireValue(assignment!.student_id===l!.student_id,'Личное задание принадлежит другому ученику.',403);
       }
       parsed.push({kind:value.kind,targetId:value.id,key});
     }
     const keepConditions:string[]=[],keepBindings:unknown[]=[];
     for(const kind of ['topic','assignment'] as const){
       const targetIds=parsed.filter(item=>item.kind===kind).map(item=>item.targetId);if(!targetIds.length)continue;
       const column=kind==='topic'?'topic_id':'assignment_id';keepConditions.push(`(kind='${kind}' AND ${column} IN (${targetIds.map(()=>'?').join(',')}))`);keepBindings.push(...targetIds);
     }
     statements.push(db().prepare(`DELETE FROM lesson_preparation_items WHERE lesson_id=? AND NOT (${keepConditions.join(' OR ')||'0'})`).bind(lessonId,...keepBindings));
     statements.push(...parsed.map((item,position)=>{
       const topic=item.kind==='topic',conflictTarget=topic?'topic_id':'assignment_id';
       return db().prepare(`INSERT INTO lesson_preparation_items (id,lesson_id,kind,topic_id,assignment_id,position,completed_at) VALUES (?,?,?,?,?,?,NULL) ON CONFLICT(lesson_id,${conflictTarget}) DO UPDATE SET position=excluded.position`).bind(id(),lessonId,item.kind,topic?item.targetId:null,topic?null:item.targetId,position);
     }));
   }
   if(l!.event_id&&l!.status==='scheduled')await calendar(eventPath(l!.event_id),'PATCH',{summary:'codeTogether · '+topicLabel,location:meet});
   await db().batch(statements);return json({ok:true});
 }
 if(path[0]==='lesson-preparation'&&path[1]&&method==='POST'){
   const user=await auth(request);requireValue(user.role==='student','Отмечать подготовку может ученик.',403);requireValue(typeof body.completed==='boolean','Укажи состояние пункта.');
   const item=await db().prepare("SELECT p.topic_id FROM lesson_preparation_items p JOIN lessons l ON l.id=p.lesson_id WHERE p.id=? AND p.kind='topic' AND l.student_id=? AND l.status='scheduled'").bind(path[1],user.id).first<{topic_id:string}>();requireValue(item,'Пункт подготовки не найден или недоступен.',404);
   if(body.completed)requireValue(await studentCanReadTopic(user.id,item!.topic_id),'Доступ к теме закрыт.',403);
   const completedAt=body.completed?now():null,result=await db().prepare("UPDATE lesson_preparation_items SET completed_at=? WHERE id=? AND kind='topic' AND EXISTS (SELECT 1 FROM lessons l WHERE l.id=lesson_preparation_items.lesson_id AND l.student_id=? AND l.status='scheduled')").bind(completedAt,path[1],user.id).run();
   requireValue(result.meta.changes===1,'Пункт подготовки не найден или недоступен.',404);return json({ok:true,completed_at:completedAt});
 }
 if(path[0]==='lessons'&&path[1]&&method==='POST'){
   const {u,l}=await lessonAccess(request,path[1]);
   if(path[2]==='move-delete'){
     requireValue(u.role==='teacher','Удалить зависший урок может только репетитор.',403);
     requireValue((l.status==='updating'||l.status==='deleting')&&l.move_id&&l.move_start&&l.move_end,
       'Нет зависшего переноса, который можно удалить.',409);
     if(l.status==='updating'){
       const claimed=await db().prepare(`
         UPDATE lessons SET status='deleting',operation_started_at=?
         WHERE id=? AND status='updating' AND move_id=? AND start=? AND end=? AND move_start=? AND move_end=?
       `).bind(now(),l.id,l.move_id,l.start,l.end,l.move_start,l.move_end).run();
       requireValue(claimed.meta.changes===1,'Состояние переноса уже изменилось. Обнови расписание.',409);
     }

     // Calendar DELETE is idempotent: a missing or already deleted event is success.
     // Keep the lesson in `deleting` if the calendar request fails so the tutor can retry.
     if(l.event_id)await calendar(eventPath(l.event_id),'DELETE');
     if(l.jazz_room_id){
       try{await disableSaluteJazzRoom(l.jazz_room_id,secrets,2500);}
       catch(error){await deferSaluteJazzRoomClose(l.jazz_room_id,error);}
     }

     const moveBindings=[l.id,l.move_id,l.start,l.end,l.move_start,l.move_end];
     const moveStillDeleting="EXISTS (SELECT 1 FROM lessons WHERE id=? AND status='deleting' AND move_id=? AND start=? AND end=? AND move_start=? AND move_end=?)";
     const statements=[
       db().prepare(`DELETE FROM slot_locks WHERE lesson_id=? AND ${moveStillDeleting}`).bind(l.id,...moveBindings),
       db().prepare(`DELETE FROM tutor_slot_locks WHERE lesson_id=? AND ${moveStillDeleting}`).bind(l.id,...moveBindings),
       db().prepare(`UPDATE assignments SET lesson_id=NULL WHERE lesson_id=? AND ${moveStillDeleting}`).bind(l.id,...moveBindings),
       db().prepare(`DELETE FROM lesson_preparation_items WHERE lesson_id=? AND ${moveStillDeleting}`).bind(l.id,...moveBindings),
       ...(l.student_id?[db().prepare(`DELETE FROM settings WHERE key=? AND value=? AND ${moveStillDeleting}`).bind('cancel-lock:'+l.student_id,l.id,...moveBindings)]:[]),
       db().prepare(`DELETE FROM lessons WHERE id=? AND status='deleting' AND move_id=? AND start=? AND end=? AND move_start=? AND move_end=?`).bind(...moveBindings),
     ];
     const deleted=await db().batch(statements);
     requireValue(deleted[deleted.length-1]?.meta.changes===1,'Перенос уже изменён. Обнови расписание и повтори удаление.',409);
     return json({deleted:true});
   }
   if(path[2]==='move-retry'){
     requireValue(l.status==='updating'&&l.move_id&&l.move_start&&l.move_end&&l.event_id,'Нет переноса, ожидающего подтверждения.',409);
     await confirmLessonMove({
       lessonId:l.id,eventId:l.event_id,operationId:l.move_id,
       original:{start:l.start,end:l.end},target:{start:l.move_start,end:l.move_end},
     });
     return json({lesson:await db().prepare('SELECT * FROM lessons WHERE id=?').bind(l.id).first()});
   }
   if(path[2]==='move-reconcile'){
     requireValue(u.role==='teacher','Сверить время с Google Календарём может только репетитор.',403);
     requireValue(l.status==='updating'&&l.move_id&&l.move_start&&l.move_end&&l.event_id,'Нет переноса, ожидающего сверки.',409);
     const calendarInterval=await reconcileLessonMoveFromCalendar({
       lessonId:l.id,eventId:l.event_id,operationId:l.move_id,
       original:{start:l.start,end:l.end},target:{start:l.move_start,end:l.move_end},
     },lessonDurationMinutes(l.type));
     return json({lesson:await db().prepare('SELECT * FROM lessons WHERE id=?').bind(l.id).first(),calendarInterval});
   }
   requireValue(l.status==='scheduled','Урок уже изменён. Обнови расписание.',409);
   if(!path[2]){
     requireValue(l.event_id,'У этого урока нет события Google Календаря.',409);
     requireValue(canReschedule(l as Lesson),'До начала осталось менее 2 часов. Перенос недоступен, но можно отменить урок.');
     const start=text(body.start,40);
     requireValue(Number.isFinite(Date.parse(start)),'Выбери время.');
     requireValue(Date.parse(start)>Date.now(),'Укажи будущее время.');
     let target:{start:string;end:string};
     if(u.role==='teacher'){
       const normalizedStart=new Date(start).toISOString();
       target={start:normalizedStart,end:new Date(Date.parse(normalizedStart)+lessonDurationMinutes(l.type)*60_000).toISOString()};
     }else{
       const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Moscow'}).format(new Date(start));
       const available=await slots(date,lessonDurationMinutes(l.type),l.id);
       const slot=available.slots.find(s=>s.start===start);
       requireValue(slot,'Это время уже занято.',409);
       target=slot!;
     }
     if(target.start===l.start&&target.end===l.end)return json({lesson:l});
     requireValue(canReschedule(l as Lesson),'До начала осталось менее 2 часов. Перенос недоступен, но можно отменить урок.');
     const move={
       lessonId:l.id,eventId:l.event_id,operationId:id(),
       original:{start:l.start,end:l.end},target,
     };
     try{
       await reserveLessonMove(move,{allowOverlappingSlots:u.role==='teacher'});
     }catch(e){
       if(e instanceof HttpError)throw e;
       throw new HttpError('Это окно только что заняли. Выбери другое время.',409);
     }
     await confirmLessonMove(move);
     return json({lesson:await db().prepare('SELECT * FROM lessons WHERE id=?').bind(l.id).first()});
   }
   requireValue(path[2]==='cancel'||path[2]==='complete','Действие с уроком не найдено.',404);
   if(path[2]==='complete'){requireValue(u.role==='teacher','Только репетитор завершает урок.',403);requireValue(Date.parse(l.end)<=Date.now(),'Урок ещё не завершился.');const r=await db().prepare("UPDATE lessons SET status='completing',operation_started_at=? WHERE id=? AND status='scheduled'").bind(now(),l.id).run();requireValue(r.meta.changes,'Урок уже изменён.',409);await db().batch([db().prepare("UPDATE users SET balance=balance-1 WHERE id=? AND EXISTS (SELECT 1 FROM lessons WHERE id=? AND status='completing' AND type='paid')").bind(l.student_id,l.id),db().prepare("UPDATE lessons SET status='completed',operation_started_at=NULL WHERE id=? AND status='completing'").bind(l.id),db().prepare('DELETE FROM slot_locks WHERE lesson_id=?').bind(l.id),db().prepare('DELETE FROM tutor_slot_locks WHERE lesson_id=?').bind(l.id)]);await retireMeeting(l.id,l.jazz_room_id);return json({ok:true});}
   const claimed=await db().prepare("UPDATE lessons SET status='updating',operation_started_at=? WHERE id=? AND status='scheduled'").bind(now(),l.id).run();requireValue(claimed.meta.changes,'Изменение уже выполняется. Обнови расписание.',409);
   let cancelExternalActionStarted=false;
   try{
    if(path[2]==='cancel'){
      requireValue(Date.parse(l.start)>Date.now()||u.role==='teacher','Уже начавшийся урок может отменить только репетитор.',400);
      // Serialize cancellation count per pupil, so concurrent cancellations cannot both be free.
      const lock='cancel-lock:'+l.student_id;
      try{if(l.student_id)await db().prepare('INSERT INTO settings (key,value) VALUES (?,?)').bind(lock,l.id).run();}catch{throw new HttpError('Другая отмена ещё выполняется. Повтори через несколько секунд.',409);}
      const bounds=monthBounds(new Date());const count=await db().prepare("SELECT COUNT(*) n FROM lessons WHERE student_id=? AND type='paid' AND status='cancelled' AND (cancelled_by IS NULL OR cancelled_by='student') AND cancelled_at>=? AND cancelled_at<?").bind(l.student_id,bounds.start,bounds.end).first<{n:number}>();const charged=u.role==='student'&&l.type==='paid'&&Number(count?.n)>=3;requireValue(u.role==='teacher'||Boolean(body.expectedCharged)===charged,'Условия отмены изменились. Обнови расписание и проверь списание.',409);await db().prepare("UPDATE lessons SET charged=? WHERE id=? AND status='updating'").bind(charged?1:0,l.id).run();cancelExternalActionStarted=true;await calendar(eventPath(l.event_id),'DELETE');await db().batch([db().prepare("UPDATE lessons SET status='cancelled',cancelled_at=?,cancelled_by=?,charged=?,operation_started_at=NULL WHERE id=? AND status='updating'").bind(now(),u.role,charged?1:0,l.id),db().prepare('DELETE FROM slot_locks WHERE lesson_id=?').bind(l.id),db().prepare('DELETE FROM tutor_slot_locks WHERE lesson_id=?').bind(l.id),...(charged?[db().prepare('UPDATE users SET balance=balance-1 WHERE id=?').bind(l.student_id)]:[]),db().prepare('DELETE FROM settings WHERE key=? AND value=?').bind(lock,l.id)]);await retireMeeting(l.id,l.jazz_room_id);return json({ok:true,charged});
    }
   }catch(e){if(path[2]==='cancel'&&!cancelExternalActionStarted){await db().prepare("UPDATE lessons SET status='scheduled',charged=0,operation_started_at=NULL WHERE id=? AND status='updating'").bind(l.id).run();if(l.student_id)await db().prepare('DELETE FROM settings WHERE key=? AND value=?').bind('cancel-lock:'+l.student_id,l.id).run();}throw e;}
 }
 if(path[0]==='rooms'){
   const u=await auth(request);await cleanup();
   if(!path[1]&&method==='GET'){
     const rooms=await all('SELECT id,student_id,name,language,revision,last_active FROM rooms WHERE last_active>?'+(u.role==='teacher'?'':' AND student_id=?')+' ORDER BY id',Date.now()-1800000,...(u.role==='teacher'?[]:[u.id]));
     const summaryKey=JSON.stringify(rooms);
     const etag=`W/"rooms-${await hash(`${u.role}:${u.id}:${summaryKey}`)}"`;
     const headers={'ETag':etag,'Cache-Control':'private, no-cache'};
     if(ifNoneMatchMatches(request.headers.get('if-none-match'),etag))return new Response(null,{status:304,headers});
     return json({rooms},200,headers);
   }
   if(!path[1]&&method==='POST'){requireValue(u.role==='student','Комнату создаёт ученик.',403);const count=await db().prepare('SELECT COUNT(*) n FROM rooms WHERE student_id=?').bind(u.id).first<{n:number}>();requireValue(Number(count?.n)<3,'Можно открыть до трёх комнат одновременно.');const r={id:id(),student_id:u.id,name:'Комната · '+u.name,language:'python',student_code:PYTHON_START,teacher_code:TEACHER_START,revision:0,last_active:Date.now()};const created=await db().prepare("INSERT INTO rooms (id,student_id,name,language,student_code,teacher_code,revision,last_active) SELECT ?,id,?,?,?,?,?,? FROM users WHERE id=? AND role='student'").bind(r.id,r.name,r.language,r.student_code,r.teacher_code,r.revision,r.last_active,u.id).run();requireValue(created.meta.changes===1,'Ученик не найден.',404);return json({room:r},201);}
   const r=await db().prepare('SELECT * FROM rooms WHERE id=?').bind(path[1]).first<Row>();requireValue(r&&(u.role==='teacher'||r.student_id===u.id),'Комната удалена или недоступна.',404);
   if(path[2]==='compile-kumir'){
    requireValue(method==='POST','Компиляция принимает только POST.',404);
    requireValue(r!.language==='kumir','В этой комнате не выбран КуМир.',409);
    requireValue(typeof body.code==='string'&&body.code.length>0&&body.code.length<=100000,'Исходный файл должен содержать от 1 до 100 000 символов.');
    return compileKumirSource(body.code);
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
   if(method==='GET'){
    const etag=`W/"room-${r!.revision}-${r!.last_active}"`;
    const headers={'ETag':etag,'Cache-Control':'private, no-cache'};
    if(ifNoneMatchMatches(request.headers.get('if-none-match'),etag))return new Response(null,{status:304,headers});
    return json({room:r},200,headers);
   }
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
