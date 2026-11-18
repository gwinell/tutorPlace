'use client';

import {useMemo,useState} from 'react';
import {ChevronLeft,ChevronRight,Clock3,Info,Save} from 'lucide-react';
import {Modal,Button} from './site-ui';
import {addMonthsToMonthKey,calendarMonthGrid,dateKeyInTimeZone,dateLabel,dateTimeInTimeZone,User} from '@/lib/domain';

const WEEKDAYS=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

function moscowDefaults(){
 const date=new Date(Date.now()+30*60_000);
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const get=(name:string)=>parts.find(part=>part.type===name)?.value||'';
 let hour=Number(get('hour')),minute=Math.ceil(Number(get('minute'))/5)*5;
 let year=Number(get('year')),month=Number(get('month')),day=Number(get('day'));
 if(minute===60){minute=0;hour+=1;}
 if(hour===24){hour=0;const next=new Date(Date.UTC(year,month-1,day+1));year=next.getUTCFullYear();month=next.getUTCMonth()+1;day=next.getUTCDate();}
 return {date:`${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,time:`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`};
}

export default function ManualLesson({students,initialStudentId,calendarConfigured,demo=false,onClose,onCreate}:{students:User[];initialStudentId?:string;calendarConfigured:boolean;demo?:boolean;onClose:()=>void;onCreate:(studentId:string,start:string)=>Promise<void>}){
 const defaults=moscowDefaults();
 const [studentId,setStudentId]=useState(initialStudentId||students[0]?.id||'');
 const [date,setDate]=useState(defaults.date);
 const [calendarMonth,setCalendarMonth]=useState(()=>defaults.date.slice(0,7));
 const [time,setTime]=useState(defaults.time);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const calendarDays=useMemo(()=>calendarMonthGrid(calendarMonth),[calendarMonth]);
 const today=dateKeyInTimeZone(new Date(),'Europe/Moscow');
 const monthLabel=dateLabel(`${calendarMonth}-15T12:00:00Z`,{month:'long',year:'numeric'});
 function changeMonth(amount:number){setCalendarMonth(current=>addMonthsToMonthKey(current,amount));}
 async function submit(event:React.FormEvent){
  event.preventDefault();
  if(!students.some(student=>student.id===studentId)){setError('Выбери ученика.');return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)){setError('Укажи время в формате 24 часа, например 17:30.');return;}
  const start=new Date(dateTimeInTimeZone(date,time,'Europe/Moscow'));
  if(!Number.isFinite(start.getTime())){setError('Проверь дату и время.');return;}
  setSaving(true);setError('');
  try{await onCreate(studentId,start.toISOString());onClose();}
  catch(error){setError((error as Error).message);}
  finally{setSaving(false);}
 }
 return <Modal title="Добавить урок вручную" onClose={onClose}>
  <span className="eyebrow"><Clock3 size={14}/> Без онлайн-бронирования</span>
  <h2>Добавить урок вручную</h2>
  <p className="modal-description">Урок длится 55 минут. Не проверяются рабочие часы, свободные слоты и баланс. {demo?'В демоверсии урок сохранится здесь без синхронизации календаря.':'Событие будет создано в Google Календаре.'}</p>
  <form onSubmit={submit}>
   <label className="field"><span>Ученик</span><select value={studentId} onChange={event=>setStudentId(event.target.value)} required>{students.map(student=><option key={student.id} value={student.id}>{student.name} · {student.balance} занятий</option>)}</select></label>
   <div className="manual-lesson-date-control">
    <span className="booking-date-label">Дата занятия</span>
    <div className="booking-calendar" aria-label="Выбор даты занятия">
     <div className="booking-calendar-header">
      <button type="button" className="icon-button booking-calendar-nav" aria-label="Предыдущий месяц" onClick={()=>changeMonth(-1)}><ChevronLeft size={17}/></button>
      <strong aria-live="polite">{monthLabel}</strong>
      <button type="button" className="icon-button booking-calendar-nav" aria-label="Следующий месяц" onClick={()=>changeMonth(1)}><ChevronRight size={17}/></button>
     </div>
     <div className="booking-calendar-weekdays" aria-hidden="true">{WEEKDAYS.map(day=><span key={day}>{day}</span>)}</div>
     <div className="booking-calendar-days">{calendarDays.map((dayKey,index)=>dayKey?<button type="button" className={'booking-calendar-day '+(date===dayKey?'selected ':'')+(today===dayKey?'today':'')} key={dayKey} aria-label={dateLabel(`${dayKey}T12:00:00Z`,{weekday:'long',day:'numeric',month:'long'})} aria-pressed={date===dayKey} onClick={()=>setDate(dayKey)}>{Number(dayKey.slice(-2))}</button>:<span className="booking-calendar-empty-day" key={'empty-'+index} aria-hidden="true"/>)}</div>
    </div>
    <span className="booking-calendar-selected" aria-live="polite">Выбрано: {dateLabel(`${date}T12:00:00Z`,{weekday:'long',day:'numeric',month:'long'})}</span>
   </div>
   <label className="field"><span>Время начала · Москва (UTC+3)</span><input type="text" autoComplete="off" placeholder="17:30" maxLength={5} pattern="(?:[01][0-9]|2[0-3]):[0-5][0-9]" value={time} onChange={event=>setTime(event.target.value)} aria-describedby="manual-lesson-time-hint" required/></label>
   <p className="field-hint" id="manual-lesson-time-hint">Вводи время в 24-часовом формате, например 17:30. Дата и время будут сохранены по Москве (UTC+3).</p>
   {!demo&&<div className="info-box"><Info size={16}/><span>Для сохранения урока Google Календарь должен быть подключён. Время можно указать вне рабочего расписания.</span></div>}
   {!calendarConfigured&&!demo&&<div className="form-error" role="alert">Сначала подключи Google Календарь в настройках репетитора.</div>}
   {error&&<div className="form-error" role="alert">{error}</div>}
   <div className="modal-actions"><Button className="button-outline" type="button" onClick={onClose} disabled={saving}>Отмена</Button><Button type="submit" loading={saving} disabled={(!calendarConfigured&&!demo)||!students.length}><Save size={16}/>Добавить урок</Button></div>
  </form>
 </Modal>;
}
