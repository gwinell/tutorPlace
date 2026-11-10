'use client';

import {useState} from 'react';
import {Clock3,Info,Save} from 'lucide-react';
import {Modal,Button} from './site-ui';
import {User} from '@/lib/domain';

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
 const [time,setTime]=useState(defaults.time);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 async function submit(event:React.FormEvent){
  event.preventDefault();
  if(!students.some(student=>student.id===studentId)){setError('Выбери ученика.');return;}
  const start=new Date(`${date}T${time}:00+03:00`);
  if(!date||!time||!Number.isFinite(start.getTime())){setError('Проверь дату и время.');return;}
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
   <div className="manual-lesson-datetime">
    <label className="field"><span>Дата</span><input type="date" value={date} onChange={event=>setDate(event.target.value)} required/></label>
    <label className="field"><span>Время · Москва (UTC+3)</span><input type="time" value={time} onChange={event=>setTime(event.target.value)} required/></label>
   </div>
   <p className="field-hint">Дата и время трактуются по московскому часовому поясу (UTC+3).</p>
   {!demo&&<div className="info-box"><Info size={16}/><span>Для сохранения урока Google Календарь должен быть подключён. Время можно указать вне рабочего расписания.</span></div>}
   {!calendarConfigured&&!demo&&<div className="form-error" role="alert">Сначала подключи Google Календарь в настройках репетитора.</div>}
   {error&&<div className="form-error" role="alert">{error}</div>}
   <div className="modal-actions"><Button className="button-outline" type="button" onClick={onClose} disabled={saving}>Отмена</Button><Button type="submit" loading={saving} disabled={(!calendarConfigured&&!demo)||!students.length}><Save size={16}/>Добавить урок</Button></div>
  </form>
 </Modal>;
}
