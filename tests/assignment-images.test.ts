import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,rm,stat,symlink,utimes} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {DatabaseSync,type SQLInputValue} from 'node:sqlite';
import {assignmentImageDirectory,assignmentImageExtension,assignmentImageStorageBackend,canReadAssignmentImage,cleanupExpiredPersonalAssignments,cleanupOrphanedAssignmentImages,deleteAssignmentImageObject,deleteQueuedR2Object,deleteR2Object,getAssignmentImageObject,getR2Object,MAX_ASSIGNMENT_IMAGE_BYTES,pendingAssignmentImageId,putAssignmentImageObject,putR2Object,r2S3Config,replacePendingAssignmentImage,R2StorageError,sanitizeAssignmentImageName,validateAssignmentImage,type AssignmentImageStorageBackend,type R2S3Config} from '../lib/assignment-images.ts';

const png=Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
const jpeg=Uint8Array.from([0xff,0xd8,0xff,0x00]);
const gif=new TextEncoder().encode('GIF89a');
const webp=new TextEncoder().encode('RIFF0000WEBP');
const config:R2S3Config={accountId:'0123456789abcdef0123456789abcdef',accessKeyId:'test-access-key',secretAccessKey:'test-secret-key',bucketName:'private-images'};

function databaseAdapter(connection:DatabaseSync){
 return {
  prepare(sql:string){
   const statement=connection.prepare(sql);let values:unknown[]=[];
   const bound={
    bind(...next:unknown[]){values=next;return bound;},
    async all<T=Record<string,unknown>>(){return{results:statement.all(...values as SQLInputValue[]) as T[]};},
    async first<T=Record<string,unknown>>(){return(statement.get(...values as SQLInputValue[]) as T|undefined)||null;},
    async run(){const result=statement.run(...values as SQLInputValue[]);return{success:true as const,meta:{changes:Number(result.changes),last_row_id:Number(result.lastInsertRowid)}};},
    execute(){const result=statement.run(...values as SQLInputValue[]);return{success:true as const,meta:{changes:Number(result.changes),last_row_id:Number(result.lastInsertRowid)}};},
   };
   return bound;
  },
  async batch(statements:{execute:()=>{meta:{changes:number;last_row_id:number}}}[]){
   connection.exec('BEGIN IMMEDIATE');try{const results=statements.map(statement=>statement.execute());connection.exec('COMMIT');return results;}catch(error){connection.exec('ROLLBACK');throw error;}
  },
 };
}

test('Допустимые MIME сверяются с сигнатурой файла и ограничением 8 МБ',()=>{
 assert.equal(validateAssignmentImage(png,'image/png'),true);
 assert.equal(validateAssignmentImage(jpeg,'image/jpeg'),true);
 assert.equal(validateAssignmentImage(gif,'image/gif'),true);
 assert.equal(validateAssignmentImage(webp,'image/webp'),true);
 assert.equal(validateAssignmentImage(png,'image/jpeg'),false);
 assert.equal(validateAssignmentImage(new TextEncoder().encode('<script>'),'image/png'),false);
 assert.equal(validateAssignmentImage(new Uint8Array(MAX_ASSIGNMENT_IMAGE_BYTES+1),'image/png'),false);
 assert.equal(assignmentImageExtension('image/jpeg'),'jpg');
 assert.equal(sanitizeAssignmentImageName('lesson-file.png'),'lesson-file.png');
 assert.equal(sanitizeAssignmentImageName('path\\lesson\n.png'),'path_lesson_.png');
 assert.equal(sanitizeAssignmentImageName(''), 'image');
});

test('R2 env должен быть полностью задан и имя bucket проверяется',()=>{
 assert.equal(r2S3Config({}),null);
 assert.deepEqual(r2S3Config({R2_ACCOUNT_ID:config.accountId,R2_ACCESS_KEY_ID:config.accessKeyId,R2_SECRET_ACCESS_KEY:config.secretAccessKey,R2_BUCKET_NAME:config.bucketName}),config);
 assert.throws(()=>r2S3Config({R2_BUCKET_NAME:'private-images'}),R2StorageError);
 assert.throws(()=>r2S3Config({...config,R2_BUCKET_NAME:'invalid bucket'}),R2StorageError);
});

test('серверное хранилище имеет приоритет над R2 и поддерживает приватный цикл записи',async()=>{
 const temporary=await mkdtemp(path.join(os.tmpdir(),'codetogether-assignment-images-'));
 const environment={ASSIGNMENT_IMAGE_DIRECTORY:temporary,R2_ACCOUNT_ID:config.accountId,R2_ACCESS_KEY_ID:config.accessKeyId,R2_SECRET_ACCESS_KEY:config.secretAccessKey,R2_BUCKET_NAME:config.bucketName};
 const backend=assignmentImageStorageBackend(environment) as AssignmentImageStorageBackend;
 const key='assignment-images/student-1/11111111-1111-4111-8111-111111111111.png';
 try{
  assert.equal(assignmentImageDirectory(environment),temporary);
  assert.equal(backend,'filesystem');
  await putAssignmentImageObject(key,png,'image/png',backend,environment);
  assert.deepEqual(await getAssignmentImageObject(key,backend,environment),png);
  const file=path.join(temporary,'student-1','11111111-1111-4111-8111-111111111111.png');
  assert.deepEqual(new Uint8Array(await readFile(file)),png);
  assert.equal((await stat(file)).mode&0o777,0o600);
  await assert.rejects(putAssignmentImageObject('../outside.png',png,'image/png',backend,environment));
  await deleteAssignmentImageObject(key,backend,environment);
  await deleteAssignmentImageObject(key,backend,environment);
  assert.equal(await getAssignmentImageObject(key,backend,environment).catch(error=>error.status),404);

  const escaped=path.join(temporary,'outside');
  await mkdir(escaped);
  await rm(path.join(temporary,'student-2'),{recursive:true,force:true});
  await symlink(escaped,path.join(temporary,'student-2'));
  const symlinkKey='assignment-images/student-2/22222222-2222-4222-8222-222222222222.png';
  await assert.rejects(putAssignmentImageObject(symlinkKey,png,'image/png',backend,environment));
  assert.deepEqual(await (await import('node:fs/promises')).readdir(escaped),[]);
 }finally{await rm(temporary,{recursive:true,force:true});}
});

test('Доступ к приватному изображению требует назначения и совпадения урока',()=>{
 assert.equal(canReadAssignmentImage({role:'teacher',targetBelongsToUser:false,lessonBelongsToUser:false}),true);
 assert.equal(canReadAssignmentImage({role:'student',targetBelongsToUser:true,lessonBelongsToUser:true}),true);
 assert.equal(canReadAssignmentImage({role:'student',targetBelongsToUser:false,lessonBelongsToUser:true}),false);
 assert.equal(canReadAssignmentImage({role:'student',targetBelongsToUser:true,lessonBelongsToUser:false}),false);
});

test('Загрузка заменяет ровно один безопасный маркер в условии',()=>{
 const marker='![example](codetogether-pending:11111111-1111-4111-8111-111111111111)';
 const imageId='11111111-1111-4111-8111-111111111111';
 assert.deepEqual(pendingAssignmentImageId(marker),{id:imageId,alt:'example'});
 assert.equal(replacePendingAssignmentImage('До\n'+marker+'\nПосле',marker,imageId),'До\n![example](/api/assignment-images/'+imageId+')\nПосле');
 assert.equal(replacePendingAssignmentImage(marker+' '+marker,marker,imageId),null);
 assert.equal(replacePendingAssignmentImage('нет маркера',marker,imageId),null);
 assert.equal(replacePendingAssignmentImage(marker,'![example](codetogether-pending:not-a-uuid)',imageId),null);
 assert.equal(replacePendingAssignmentImage(marker,'![x](codetogether-pending:22222222-2222-4222-8222-222222222222)',imageId),null);
 assert.equal(replacePendingAssignmentImage('x'.repeat(20000)+marker,marker,imageId),null);
});

test('S3 API использует приватный PUT/GET/DELETE и подписывает запросы SigV4',async()=>{
 const calls:{url:string;method:string;headers:Headers;body?:BodyInit|null}[]=[];
 const fetchMock:typeof fetch=async(input,init={})=>{const headers=new Headers(init.headers);calls.push({url:String(input),method:init.method||'GET',headers,body:init.body});return init.method==='GET'?new Response(png,{status:200}):new Response(null,{status:200});};
 await putR2Object('assignment-images/task-1/image.png',png,'image/png',config,fetchMock);
 assert.equal(calls[0].method,'PUT');assert.equal(calls[0].url,'https://0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/private-images/assignment-images/task-1/image.png');
 assert.equal(calls[0].headers.get('Content-Type'),'image/png');assert.match(calls[0].headers.get('Authorization')||'',/^AWS4-HMAC-SHA256 Credential=test-access-key\/\d{8}\/auto\/s3\/aws4_request, SignedHeaders=/);
 assert.equal(new Uint8Array(calls[0].body as ArrayBuffer)[0],0x89);
 assert.deepEqual(await getR2Object('assignment-images/task-1/image.png',config,fetchMock),png);assert.equal(calls[1].method,'GET');
 await deleteR2Object('assignment-images/task-1/image.png',config,fetchMock);assert.equal(calls[2].method,'DELETE');
});

test('maintenance удаляет осиротевшие R2 объекты и D1 metadata только после успешного удаления',async()=>{
 const images=[{id:'orphan-1',object_key:'assignment-images/deleted-1/11111111-1111-4111-8111-111111111111.png'},{id:'orphan-2',object_key:'assignment-images/deleted-2/22222222-2222-4222-8222-222222222222.jpg'}];
 const deletedRows:string[]=[],deletedObjects:string[]=[];
 const database={prepare:(query:string)=>({all:async()=>({results:query.includes('assignment-image-delete:')?[]:images}),bind:(...values:unknown[])=>({run:async()=>{deletedRows.push(String(values[0]));return{success:true,meta:{changes:1,last_row_id:0}};}})})};
 const fetchMock:typeof fetch=async(input)=>{deletedObjects.push(String(input));return new Response(null,{status:204});};
 await cleanupOrphanedAssignmentImages(database as unknown as Parameters<typeof cleanupOrphanedAssignmentImages>[0],{
  R2_ACCOUNT_ID:config.accountId,R2_ACCESS_KEY_ID:config.accessKeyId,R2_SECRET_ACCESS_KEY:config.secretAccessKey,R2_BUCKET_NAME:config.bucketName,
 },fetchMock);
 assert.equal(deletedObjects.length,2);
 assert.deepEqual(deletedRows.sort(),['orphan-1','orphan-2']);
});

test('повторяет неудачное удаление R2 через очередь settings',async()=>{
 const saved=new Map<string,string>(),deletedKeys:string[]=[];
 const database={prepare:(query:string)=>({all:async()=>({results:query.includes('assignment-image-delete:')?[...saved].map(([key,value])=>({key,value})):[]}),bind:(...values:unknown[])=>({run:async()=>{
  if(query.startsWith('INSERT INTO settings'))saved.set(String(values[0]),String(values[1]));
  if(query.startsWith('DELETE FROM settings'))saved.delete(String(values[0]));
  return{success:true,meta:{changes:1,last_row_id:0}};
 }})})};
 const objectKey='assignment-images/task-1/22222222-2222-4222-8222-222222222222.png';
 saved.set('assignment-image-delete:retry-id',JSON.stringify({object_key:objectKey}));
 const failingFetch:typeof fetch=async()=>{throw new Error('R2 unavailable');};
 assert.equal(await deleteQueuedR2Object(database as unknown as Parameters<typeof deleteQueuedR2Object>[0],objectKey,'retry-id',config,failingFetch),false);
 assert.equal(saved.has('assignment-image-delete:retry-id'),true);
 const retryFetch:typeof fetch=async(input)=>{deletedKeys.push(String(input));return new Response(null,{status:204});};
 await cleanupOrphanedAssignmentImages(database as unknown as Parameters<typeof cleanupOrphanedAssignmentImages>[0],{
  R2_ACCOUNT_ID:config.accountId,R2_ACCESS_KEY_ID:config.accessKeyId,R2_SECRET_ACCESS_KEY:config.secretAccessKey,R2_BUCKET_NAME:config.bucketName,
 },retryFetch);
 assert.equal(deletedKeys.length,1);
 assert.equal(saved.size,0);
});

test('личные задания удаляются через 7 дней после проверки или 14 дней без проверки',async()=>{
 const temporary=await mkdtemp(path.join(os.tmpdir(),'codetogether-assignment-retention-'));
 const databasePath=path.join(temporary,'retention.sqlite'),imageDirectory=path.join(temporary,'assignment-images');
 const migrated=spawnSync(process.execPath,['scripts/migrate-sqlite.mjs'],{cwd:process.cwd(),encoding:'utf8',env:{...process.env,DATABASE_PATH:databasePath}});
 assert.equal(migrated.status,0,migrated.stderr||migrated.stdout);
 const connection=new DatabaseSync(databasePath),database=databaseAdapter(connection),now=Date.parse('2026-11-13T12:00:00.000Z'),old=new Date(now-100*24*60*60*1000).toISOString();
 try{
  await database.prepare("INSERT INTO users(id,login,password,name,role,created_at) VALUES ('student','student','hash','QA student','student',?)").bind(old).run();
  await database.prepare("INSERT INTO lessons(id,student_id,name,start,end,type,status) VALUES ('completed-lesson','student','QA student',?,?, 'paid','completed'),('future-lesson','student','QA student','2026-12-01T10:00:00.000Z','2026-12-01T10:55:00.000Z','paid','scheduled')").bind(old,old).run();
  const addAssignment=async(id:string,topicId:string|null,studentId:string|null,lessonId:string|null,createdAt:string,completedAt:string|null)=>database.prepare('INSERT INTO assignments(id,topic_id,student_id,lesson_id,title,kind,prompt,created_at,completed_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,topicId,studentId,lessonId,'Retention test','text','Prompt',createdAt,completedAt).run();
  const addSubmission=async(id:string,assignmentId:string,status:string,createdAt:string)=>database.prepare('INSERT INTO submissions(id,assignment_id,student_id,content,result,created_at) VALUES (?,?,\'student\',\'answer\',?,?)').bind(id,assignmentId,JSON.stringify({status}),createdAt).run();
  await addAssignment('expired-reviewed',null,'student',null,old,old);
  await addAssignment('reviewed-seven-days',null,'student',null,old,'2026-11-06 12:00:00');
  await addAssignment('reviewed-under-seven-days',null,'student',null,old,'2026-11-06 13:00:00');
  await addAssignment('never-submitted-expired',null,'student',null,old,null);
  await addAssignment('never-submitted-under-14',null,'student',null,'2026-10-30 13:00:00',null);
  await addAssignment('pending-expired',null,'student',null,old,null);
  await addAssignment('previously-passed-pending',null,'student',null,old,old);
  await addAssignment('edited-recently',null,'student',null,'2026-11-12T12:00:00.000Z',null);
  await addAssignment('prepared-for-active-lesson',null,'student',null,old,old);
  await addAssignment('future-personal',null,'student','future-lesson',old,old);
  await addAssignment('course-assignment','course-topic',null,null,old,old);
  await addSubmission('expired-submission','expired-reviewed','passed',old);
  await addSubmission('reviewed-seven-submission','reviewed-seven-days','needs_work','2026-11-06 12:00:00');
  await addSubmission('reviewed-under-seven-submission','reviewed-under-seven-days','passed','2026-11-06 13:00:00');
  await addSubmission('pending-expired-submission','pending-expired','pending','2026-10-29T12:00:00.000Z');
  await addSubmission('old-passed-submission','previously-passed-pending','passed',old);
  await addSubmission('new-pending-submission','previously-passed-pending','pending','2026-11-12T12:00:00.000Z');
  await addSubmission('old-passed-edited-submission','edited-recently','passed',old);
  await addSubmission('reviewed-before-upcoming-lesson','prepared-for-active-lesson','passed',old);
  await database.prepare("INSERT INTO lesson_preparation_items(id,lesson_id,kind,assignment_id,position) VALUES ('expired-preparation','completed-lesson','assignment','expired-reviewed',0),('future-preparation','future-lesson','assignment','prepared-for-active-lesson',0)").run();
  const imageId='33333333-3333-4333-8333-333333333333',objectKey='assignment-images/expired-reviewed/'+imageId+'.png';
  await putAssignmentImageObject(objectKey,png,'image/png','filesystem',{ASSIGNMENT_IMAGE_DIRECTORY:imageDirectory});
  await database.prepare('INSERT INTO assignment_images(id,assignment_id,object_key,content_type,size_bytes,original_name,created_at,storage_backend) VALUES (?,?,?,?,?,?,?,?)').bind(imageId,'expired-reviewed',objectKey,'image/png',png.byteLength,'fixture.png',old,'filesystem').run();
  const pendingImageId='66666666-6666-4666-8666-666666666666',pendingObjectKey='assignment-images/pending-expired/'+pendingImageId+'.png';
  await putAssignmentImageObject(pendingObjectKey,png,'image/png','filesystem',{ASSIGNMENT_IMAGE_DIRECTORY:imageDirectory});
  await database.prepare('INSERT INTO assignment_images(id,assignment_id,object_key,content_type,size_bytes,original_name,created_at,storage_backend) VALUES (?,?,?,?,?,?,?,?)').bind(pendingImageId,'pending-expired',pendingObjectKey,'image/png',png.byteLength,'pending.png',old,'filesystem').run();

  const d1=database as unknown as Parameters<typeof cleanupExpiredPersonalAssignments>[0];
  assert.equal(await cleanupExpiredPersonalAssignments(d1,now),4);
  for(const id of ['expired-reviewed','reviewed-seven-days','never-submitted-expired','pending-expired'])assert.equal(await database.prepare('SELECT id FROM assignments WHERE id=?').bind(id).first(),null,id);
  for(const id of ['reviewed-under-seven-days','never-submitted-under-14','previously-passed-pending','edited-recently','prepared-for-active-lesson'])assert.ok(await database.prepare('SELECT id FROM assignments WHERE id=?').bind(id).first(),id);
  assert.ok(await database.prepare('SELECT id FROM assignments WHERE id=?').bind('future-personal').first());
  assert.ok(await database.prepare('SELECT id FROM assignments WHERE id=?').bind('course-assignment').first());
  assert.equal(await database.prepare('SELECT id FROM submissions WHERE id=?').bind('expired-submission').first(),null);
  assert.equal(await database.prepare('SELECT id FROM lesson_preparation_items WHERE id=?').bind('expired-preparation').first(),null);
  assert.ok(await database.prepare('SELECT key FROM settings WHERE key LIKE ?').bind('assignment-image-delete:personal:expired-reviewed:%').first());
  assert.ok(await database.prepare('SELECT key FROM settings WHERE key LIKE ?').bind('assignment-image-delete:personal:pending-expired:%').first());

  const staleId='44444444-4444-4444-8444-444444444444',freshId='55555555-5555-4555-8555-555555555555';
  const staleKey=`assignment-images/crash-leftover/${staleId}.png`,freshKey=`assignment-images/recent-upload/${freshId}.png`;
  await putAssignmentImageObject(staleKey,png,'image/png','filesystem',{ASSIGNMENT_IMAGE_DIRECTORY:imageDirectory});
  await putAssignmentImageObject(freshKey,png,'image/png','filesystem',{ASSIGNMENT_IMAGE_DIRECTORY:imageDirectory});
  const twoDaysAgo=new Date(now-2*24*60*60*1000);
  await utimes(path.join(imageDirectory,'crash-leftover',staleId+'.png'),twoDaysAgo,twoDaysAgo);
  await cleanupOrphanedAssignmentImages(d1,{ASSIGNMENT_IMAGE_DIRECTORY:imageDirectory});
  await assert.rejects(readFile(path.join(imageDirectory,'expired-reviewed',imageId+'.png')),{code:'ENOENT'});
  await assert.rejects(readFile(path.join(imageDirectory,'pending-expired',pendingImageId+'.png')),{code:'ENOENT'});
  assert.equal(await database.prepare('SELECT id FROM assignment_images WHERE id IN (?,?)').bind(imageId,pendingImageId).first(),null);
  await assert.rejects(readFile(path.join(imageDirectory,'crash-leftover',staleId+'.png')),{code:'ENOENT'});
  assert.deepEqual(new Uint8Array(await readFile(path.join(imageDirectory,'recent-upload',freshId+'.png'))),png);
  assert.equal(await database.prepare('SELECT key FROM settings WHERE key LIKE ?').bind('assignment-image-delete:personal:expired-reviewed:%').first(),null);
 }finally{
  connection.close();
  await rm(temporary,{recursive:true,force:true});
 }
});
