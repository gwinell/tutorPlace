// Uses disposable fixtures in the local D1 database. Never runs against a hosted origin.
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,unlinkSync} from 'node:fs';
import {randomUUID,webcrypto} from 'node:crypto';
import assert from 'node:assert/strict';
import * as Y from 'yjs';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:5173';
const dbState=process.env.TEST_DB_STATE||'.wrangler/state';
assert.ok(/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin),'Integration tests are local-only.');
const suffix=randomUUID().slice(0,8),prefix='qa-'+suffix,teacherId=prefix+'-teacher',studentId=prefix+'-student',password=randomUUID()+'Aa1';
mkdirSync('outputs',{recursive:true});
function sql(query){const file='outputs/qa-fixture.sql';writeFileSync(file,query);const r=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to',dbState,'--file',file],{encoding:'utf8'});unlinkSync(file);if(r.status!==0)throw Error(r.stderr||'Fixture command failed');}
async function passwordHash(value){const salt=randomUUID(),key=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(value),'PBKDF2',false,['deriveBits']);const bits=await webcrypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},key,256);return salt+':'+Buffer.from(bits).toString('hex');}
async function request(path,method='GET',body,cookie,expected=200){const r=await fetch(origin+'/api/'+path,{method,headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();assert.equal(r.status,expected,path+': '+JSON.stringify(d));return {data:d,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
const encoded=doc=>Buffer.from(Y.encodeStateAsUpdate(doc)).toString('base64');
const makeDoc=code=>{const d=new Y.Doc(),cid=d.clientID;d.clientID=1;d.getText('code').insert(0,code);d.clientID=cid;return d;};
let checks=0;const pass=label=>{checks++;console.log('✓ '+label);};
const stored=await passwordHash(password);
sql("INSERT INTO users(id,login,password,name,role,balance,created_at) VALUES ('"+teacherId+"','"+teacherId+"','"+stored+"','QA teacher','teacher',0,datetime('now')),('"+studentId+"','"+studentId+"','"+stored+"','QA student','student',4,datetime('now'));");
try{
 await request('workspace','GET',null,null,401);pass('Защищённый кабинет отклоняет анонимные запросы');
 const csrf=await fetch(origin+'/api/login',{method:'POST',headers:{Origin:'null','Content-Type':'application/json'},body:JSON.stringify({login:teacherId,password})});assert.equal(csrf.status,403);pass('Запросы из изолированной среды не могут менять платформу');
 const t=(await request('login','POST',{login:teacherId,password})).cookie;
 const s=(await request('login','POST',{login:studentId,password})).cookie;assert.ok(t&&s);pass('Авторизация и HttpOnly-сессии работают');
 await request('students','POST',{name:'Incomplete'},t,400);pass('Создание ученика проверяет обязательные поля');
 const newId=prefix+'-new';await request('students','POST',{id:undefined,name:'QA new',age:15,parent_name:'QA parent',login:newId,password,balance:4},t);
 const n=(await request('login','POST',{login:newId,password})).cookie;assert.ok(n);pass('Созданный репетитором ученик может войти');
 await request('topics','POST',{id:prefix+'-topic',title:'QA topic',content:'# Private material',description:'test',format:'md'},t);
 let workspace=(await request('workspace','GET',null,s)).data;let topic=workspace.topics.find(x=>x.id===prefix+'-topic');assert.equal(topic.locked,1);assert.equal(topic.content,'');
 await request('access','POST',{topicId:prefix+'-topic',studentId,enabled:true},t);workspace=(await request('workspace','GET',null,s)).data;assert.equal(workspace.topics.find(x=>x.id===prefix+'-topic').content,'# Private material');pass('Закрытые материалы скрыты, доступ открывается адресно');
 await request('assignments','POST',{id:prefix+'-quiz',topic_id:prefix+'-topic',title:'QA quiz',kind:'quiz',prompt:'2+2?',options:['3','4'],answer:'1'},t);
 await request('assignments','POST',{id:prefix+'-code',topic_id:prefix+'-topic',title:'QA code',kind:'code',prompt:'Solve',tests:JSON.stringify([{stdin:'secret-input',expected:'secret-output'}])},t);
 workspace=(await request('workspace','GET',null,s)).data;const a=workspace.assignments.find(x=>x.id===prefix+'-quiz'),c=workspace.assignments.find(x=>x.id===prefix+'-code');assert.equal(a.answer,undefined);assert.equal(c.tests,undefined);assert.equal(JSON.stringify(workspace).includes('secret-input'),false);
 const submitted=(await request('submit','POST',{assignmentId:a.id,content:'1'},s)).data;assert.equal(JSON.parse(submitted.submission.result).status,'passed');pass('Квиз проверяется на сервере, ответы и скрытые тесты не раскрываются');
 const room=(await request('rooms','POST',{},s,201)).data.room;
 await request('rooms/'+room.id,'GET',null,n,404);await request('rooms/'+room.id,'POST',{file:'teacher',update:'AA=='},s,403);pass('Чужие комнаты и файл репетитора защищены сервером');
 const d1=makeDoc(room.student_code),d2=makeDoc(room.student_code);d1.getText('code').insert(0,'# student edit\n');d2.getText('code').insert(0,'# teacher edit\n');
 await Promise.all([request('rooms/'+room.id,'POST',{file:'student',update:encoded(d1)},s),request('rooms/'+room.id,'POST',{file:'student',update:encoded(d2)},t)]);
 const merged=(await request('rooms/'+room.id,'GET',null,s)).data.room;assert.match(merged.student_code,/student edit/);assert.match(merged.student_code,/teacher edit/);pass('Одновременные правки двух сессий объединяются на сервере');
 await request('notifications','POST',{student_id:studentId,title:'QA payment',body:'QA reminder'},t);workspace=(await request('workspace','GET',null,s)).data;assert.ok(workspace.notifications.some(x=>x.title==='QA payment'));pass('Внутреннее уведомление доставляется нужному ученику');
 sql("UPDATE rooms SET last_active=0 WHERE id='"+room.id+"';");await request('rooms/'+room.id,'GET',null,s,404);pass('Комната с истёкшими 30 минутами удаляется');
 await request('logout','POST',{},s);await request('workspace','GET',null,s,401);pass('Выход отзывает серверную сессию');
 console.log('Integration checks passed: '+checks);
}finally{
 sql("DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE login LIKE '"+prefix+"%'); DELETE FROM notifications WHERE student_id IN (SELECT id FROM users WHERE login LIKE '"+prefix+"%'); DELETE FROM rooms WHERE student_id IN (SELECT id FROM users WHERE login LIKE '"+prefix+"%'); DELETE FROM submissions WHERE assignment_id LIKE '"+prefix+"%'; DELETE FROM assignments WHERE id LIKE '"+prefix+"%'; DELETE FROM topic_access WHERE topic_id LIKE '"+prefix+"%'; DELETE FROM topics WHERE id LIKE '"+prefix+"%'; DELETE FROM users WHERE login LIKE '"+prefix+"%';");
}
