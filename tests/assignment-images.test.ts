import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assignmentImageExtension,canReadAssignmentImage,cleanupOrphanedAssignmentImages,deleteQueuedR2Object,deleteR2Object,getR2Object,MAX_ASSIGNMENT_IMAGE_BYTES,pendingAssignmentImageId,putR2Object,r2S3Config,replacePendingAssignmentImage,R2StorageError,sanitizeAssignmentImageName,validateAssignmentImage,type R2S3Config} from '../lib/assignment-images.ts';

const png=Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
const jpeg=Uint8Array.from([0xff,0xd8,0xff,0x00]);
const gif=new TextEncoder().encode('GIF89a');
const webp=new TextEncoder().encode('RIFF0000WEBP');
const config:R2S3Config={accountId:'0123456789abcdef0123456789abcdef',accessKeyId:'test-access-key',secretAccessKey:'test-secret-key',bucketName:'private-images'};

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
 const images=[{id:'orphan-1',object_key:'assignment-images/deleted-1/image.png'},{id:'orphan-2',object_key:'assignment-images/deleted-2/image.jpg'}];
 const deletedRows:string[]=[],deletedObjects:string[]=[];
 const database={prepare:(query:string)=>({all:async()=>({results:query.includes('assignment-image-delete:')?[]:images}),bind:(...values:unknown[])=>({run:async()=>{deletedRows.push(String(values[0]));return{success:true,meta:{changes:1,last_row_id:0}};}})})};
 const fetchMock:typeof fetch=async(input)=>{deletedObjects.push(String(input));return new Response(null,{status:204});};
 await cleanupOrphanedAssignmentImages(database as unknown as Parameters<typeof cleanupOrphanedAssignmentImages>[0],{
  R2_ACCOUNT_ID:config.accountId,R2_ACCESS_KEY_ID:config.accessKeyId,R2_SECRET_ACCESS_KEY:config.secretAccessKey,R2_BUCKET_NAME:config.bucketName,
 },fetchMock);
 assert.equal(deletedObjects.length,2);
 assert.deepEqual(deletedRows,['orphan-1','orphan-2']);
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
