import {test} from 'node:test';
import assert from 'node:assert/strict';
import {addDaysToDateKey,cancellationPolicy,canReschedule,createSlots,dateKeyInTimeZone,monthBounds,monthKey,overlaps,resultStatus,serializeLessonPreparation,type Lesson} from '../lib/domain.ts';
import {normalizeGithubSource} from '../lib/github-source.ts';
const lesson=(extra:Partial<Lesson>={}):Lesson=>({id:'test',name:'test',start:'2026-11-07T13:00:00.000Z',end:'2026-11-07T13:55:00.000Z',type:'paid',status:'scheduled',...extra});
test('Пункты подготовки формы сериализуются в API-контракт',()=>{
 assert.deepEqual(serializeLessonPreparation(['topic:unit-1','assignment:task-2']),[{kind:'topic',id:'unit-1'},{kind:'assignment',id:'task-2'}]);
 assert.throws(()=>serializeLessonPreparation(['unknown:item']),/Некорректный пункт/);
});
test('Ссылка GitHub приводится к raw и блокирует посторонние хосты и типы файлов',()=>{
 assert.deepEqual(normalizeGithubSource('https://github.com/octocat/Hello-World/blob/main/notes/intro.md'),{url:'https://raw.githubusercontent.com/octocat/Hello-World/main/notes/intro.md',format:'md'});
 assert.deepEqual(normalizeGithubSource('https://github.com/octocat/Hello-World/blob/feature/course-notes/notes/intro.md'),{url:'https://raw.githubusercontent.com/octocat/Hello-World/feature/course-notes/notes/intro.md',format:'md'});
 assert.throws(()=>normalizeGithubSource('https://evil.example/notes.md'),/Разрешены только/);
 assert.throws(()=>normalizeGithubSource('https://github.com/octocat/Hello-World/blob/main/notes.txt'),/Поддерживаются только/);
 assert.throws(()=>normalizeGithubSource('https://github.com/octocat/Hello-World/blob/main/%2e%2e/notes.md'),/недопустимый сегмент/);
});
test('Перенос разрешён ровно за два часа, за миллисекунду позднее запрещён',()=>{
 const l=lesson();const start=Date.parse(l.start);
 assert.equal(canReschedule(l,start-7200000),true);assert.equal(canReschedule(l,start-7199999),false);assert.equal(canReschedule(lesson({status:'cancelled'}),start-86400000),false);
});
test('Три бесплатных отмены, четвёртая со списанием; пробные не входят в счётчик',()=>{
 const cancelled=lesson({status:'cancelled',cancelled_at:'2026-11-06T10:00:00Z'});
 const list=[cancelled,cancelled,lesson({...cancelled,type:'trial'})];
 assert.deepEqual(cancellationPolicy(list,new Date('2026-11-06T12:00:00Z')),{count:2,freeLeft:1,charged:false});
 list.push(cancelled);assert.equal(cancellationPolicy(list,new Date('2026-11-06T12:00:00Z')).charged,true);
});
test('Счётчик отмен обнуляется по календарному месяцу Москвы',()=>{
 assert.equal(monthKey('2026-10-31T21:00:00Z'),monthKey('2026-11-01T00:00:00+03:00'));
 const list=[lesson({status:'cancelled',cancelled_at:'2026-10-31T20:59:59Z'}),lesson({status:'cancelled',cancelled_at:'2026-10-31T21:00:00Z'})];
 assert.equal(cancellationPolicy(list,new Date('2026-11-01T00:01:00+03:00')).count,1);
});
test('Границы месяца для SQL совпадают с календарным месяцем Москвы',()=>{
 const bounds=monthBounds('2026-10-31T21:00:00.000Z');
 assert.equal(bounds.start,'2026-10-31T21:00:00.000Z');
 assert.equal(bounds.end,'2026-11-30T21:00:00.000Z');
 assert.equal(monthKey(bounds.start),'2026-11');
 assert.equal(monthKey(new Date(Date.parse(bounds.end)-1)),'2026-11');
});
test('Окна только внутри рабочих дней и часов; 45/55 минут не выходят за границы',()=>{
 const schedule={days:[6],from:'14:00',to:'16:00',timezone:'Europe/Moscow',meetUrl:''};
 const now=Date.parse('2026-11-01T00:00:00Z');
 const trial=createSlots('2026-11-07',45,schedule,[],now),paid=createSlots('2026-11-07',55,schedule,[],now);
 assert.equal(trial.length,3);assert.equal(paid.length,3);assert.equal(paid.at(-1)?.end,'2026-11-07T12:55:00.000Z');
 assert.equal(createSlots('2026-11-08',45,schedule,[],now).length,0);
});
test('Пересекающиеся события скрывают окно, смежные уроки не пересекаются',()=>{
 const schedule={days:[6],from:'14:00',to:'16:00',timezone:'Europe/Moscow',meetUrl:''};
 const slots=createSlots('2026-11-07',55,schedule,[{start:'2026-11-07T11:30:00.000Z',end:'2026-11-07T12:00:00.000Z'}],0);
 assert.deepEqual(slots.map(s=>s.start),['2026-11-07T12:00:00.000Z']);
 assert.equal(overlaps('2026-11-07T11:00:00Z','2026-11-07T12:00:00Z','2026-11-07T12:00:00Z','2026-11-07T13:00:00Z'),false);
});
test('Дата исключения заменяет недельное расписание, включая закрытый день',()=>{
 const date='2026-11-08';
 const schedule={days:[0],from:'10:00',to:'12:00',timezone:'Europe/Moscow',meetUrl:'',dateOverrides:{[date]:[{from:'14:00',to:'16:00'}]}};
 const slots=createSlots(date,55,schedule,[],0);
 assert.deepEqual(slots.map(slot=>slot.start),['2026-11-08T11:00:00.000Z','2026-11-08T11:30:00.000Z','2026-11-08T12:00:00.000Z']);
 assert.deepEqual(createSlots(date,55,{...schedule,dateOverrides:{[date]:[]}},[],0),[]);
});
test('Расчёт слотов учитывает временную зону расписания',()=>{
 const schedule={days:[0],from:'10:00',to:'11:00',timezone:'America/New_York',meetUrl:''};
 const slots=createSlots('2026-11-08',55,schedule,[],0);
 assert.equal(slots[0]?.start,'2026-11-08T15:00:00.000Z');
});
test('Календарные поля формы используют московскую дату и переход через месяц',()=>{
 assert.equal(dateKeyInTimeZone(new Date('2026-11-08T21:30:00.000Z')),'2026-11-09');
 assert.equal(addDaysToDateKey('2026-12-31',1),'2027-01-01');
});
test('Повреждённый результат отправки не ломает отображение статуса',()=>{
 assert.equal(resultStatus('{broken'),'unknown');
 assert.equal(resultStatus('{"status":"passed"}'),'passed');
 assert.equal(resultStatus('{"status":42}'),'unknown');
});
