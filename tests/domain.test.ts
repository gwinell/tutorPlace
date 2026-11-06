import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cancellationPolicy,canReschedule,createSlots,monthKey,overlaps,type Lesson} from '../lib/domain.ts';
const lesson=(extra:Partial<Lesson>={}):Lesson=>({id:'test',name:'test',start:'2026-11-07T13:00:00.000Z',end:'2026-11-07T13:55:00.000Z',type:'paid',status:'scheduled',...extra});
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
