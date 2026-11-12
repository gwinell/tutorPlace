'use client';
import {useState,useEffect,useEffectEvent,useImperativeHandle,useRef,type Ref} from 'react';
import {ArrowLeft,Clock3,Users,FileCode2,Keyboard,Info,Check,RefreshCw} from 'lucide-react';
import {Room,User} from '@/lib/domain';
import {ROOM_STARTERS,starterLanguage,type RoomLanguage,type RoomFile} from '@/lib/room-presets';
import {Tag,Button,api} from './site-ui';
import {documentFrom,replaceText,encode,encodeUpdate,decode,Y} from '@/lib/collaboration';
import CodeEditor, { RuntimeProvider } from './code-editor';
import TypingPractice from './typing-practice';
export type RoomSaveHandle = { flush: () => Promise<boolean> };

type CodeRoomProps = {
  initial: Room;
  demo: boolean;
  user: User;
  notify: (message: string) => void;
  onExit: () => void;
  onDemoUpdate: (room: Room) => void;
  saveHandle: Ref<RoomSaveHandle>;
};

export default function CodeRoom({ initial, demo, user, notify, onExit, onDemoUpdate, saveHandle }: CodeRoomProps) {
 const [room, setRoom] = useState(initial);
 const [mobileFile, setMobileFile] = useState('student');
 const [view, setView] = useState<'code'|'typing'>('code');
 const [status, setStatus] = useState('saved');
 const [expired, setExpired] = useState(false);
 const current = useRef(initial);
 const pending = useRef(new Map<RoomFile, { version: number; persisted: boolean; keys: string[] }>());
 const inFlight = useRef<Promise<boolean> | null>(null);
 const mounted = useRef(false);
 const restored = useRef(false);
 const touchPending = useRef(false);
 const counter = useRef(0);
 const [docs] = useState(() => ({
   student: documentFrom(initial.student_state, initial.student_code),
   teacher: documentFrom(initial.teacher_state, initial.teacher_code),
 }));
 const teacher = user.role === 'teacher';
 const endpoint = 'rooms/' + initial.id;

 function draftPrefix(file: RoomFile) {
   return 'ct-room-draft:' + user.id + ':' + initial.id + ':' + file + ':';
 }

 function removeDrafts(keys: string[]) {
   for (const key of keys) {
     try { localStorage.removeItem(key); } catch {}
   }
 }

 function persistDraft(file: RoomFile, update: Uint8Array, previous: string[]) {
   try {
     const older = previous.flatMap(key => {
       const value = localStorage.getItem(key);
       return value ? [decode(value)] : [];
     });
     const key = draftPrefix(file) + crypto.randomUUID();
     localStorage.setItem(key, encodeUpdate(Y.mergeUpdates([...older, update])));
     // A new immutable key prevents an acknowledgement from deleting a newer edit.
     removeDrafts(previous);
     return [key];
   } catch {
     return null;
   }
 }

 function merge(received: Room) {
   if (received.student_state) Y.applyUpdate(docs.student, decode(received.student_state));
   if (received.teacher_state) Y.applyUpdate(docs.teacher, decode(received.teacher_state));
   const latest = received.revision >= current.current.revision ? received : current.current;
   const merged = {
     ...latest,
     last_active: Math.max(received.last_active, current.current.last_active),
     student_code: docs.student.getText('code').toString(),
     teacher_code: docs.teacher.getText('code').toString(),
   };
   current.current = merged;
   setRoom(merged);
 }

 async function syncRoom() {
   const signal = AbortSignal.timeout(8000);
   const entry = pending.current.entries().next().value;
   try {
     if (entry) {
       const [file, edit] = entry;
       const data = await api<{ room: Room }>(endpoint, 'POST', { file, update: encode(docs[file]) }, signal);
       if (!mounted.current) return true;
       if (pending.current.get(file)?.version === edit.version) pending.current.delete(file);
       removeDrafts(edit.keys);
       merge(data.room);
       setStatus(pending.current.size ? 'saving' : 'saved');
     } else if (touchPending.current) {
       touchPending.current = false;
       const data = await api<{ room: Room }>(endpoint, 'POST', {}, signal);
       if (mounted.current) merge(data.room);
     } else {
       const data = await api<{ room: Room } | null>(endpoint, 'GET', undefined, signal, { 'If-None-Match': `W/"${current.current.revision}"` });
       if (mounted.current && data?.room) merge(data.room);
     }
     return true;
   } catch (error) {
     if (!mounted.current) return false;
     const message = (error as Error).message;
     if (message.includes('удалена')) setExpired(true);
     else if (entry) {
       setStatus('error');
       notify('Не удалось синхронизировать код. ' + (entry[1].persisted ? 'Черновик сохранён в браузере.' : message));
     }
     return false;
   }
 }

 function sync() {
   if (!inFlight.current) {
     inFlight.current = syncRoom().finally(() => { inFlight.current = null; });
   }
   return inFlight.current;
 }

 async function flush() {
   if (demo || expired || !pending.current.size) return true;
   if (inFlight.current) await inFlight.current;
   while (pending.current.size) {
     if (!await sync()) {
       const persisted = [...pending.current.values()].every(edit => edit.persisted);
       if (persisted) notify('Черновик сохранён в браузере. Он восстановится при повторном открытии комнаты.');
       return persisted;
     }
   }
   return true;
 }
 useImperativeHandle(saveHandle, () => ({ flush }));

 const restoreDraft = useEffectEvent(() => {
   if (demo || restored.current) return;
   restored.current = true;
   const files: RoomFile[] = teacher ? ['student', 'teacher'] : ['student'];
   try {
     const keys = Object.keys(localStorage);
     for (const file of files) {
       const recovered = [];
       for (const key of keys.filter(key => key.startsWith(draftPrefix(file)))) {
         const draft = localStorage.getItem(key);
         if (!draft) continue;
         try {
           Y.applyUpdate(docs[file], decode(draft));
           recovered.push(key);
         } catch {
           removeDrafts([key]);
         }
       }
       if (recovered.length) {
         pending.current.set(file, { version: ++counter.current, persisted: true, keys: recovered });
       }
     }
   } catch {}
   if (pending.current.size) {
     merge(current.current);
     setStatus('saving');
     void sync();
   }
 });

 const poll = useEffectEvent(() => {
   if (Date.now() - current.current.last_active > 1800000) {
     setExpired(true);
     return;
   }
   if (demo) {
     try {
       const data = JSON.parse(localStorage.getItem('ct-demo-v2') || '{}');
       const latest = data.rooms?.find((candidate: Room) => candidate.id === initial.id);
       if (latest) merge(latest);
     } catch {}
     return;
   }
   if (!expired) void sync();
 });

 useEffect(() => {
   mounted.current = true;
   restoreDraft();
   const timer = setInterval(poll, 1200);
   const warnIfUnrecoverable = (event: BeforeUnloadEvent) => {
     if ([...pending.current.values()].some(edit => !edit.persisted)) {
       event.preventDefault();
       event.returnValue = '';
     }
   };
   window.addEventListener('beforeunload', warnIfUnrecoverable);
   return () => {
     mounted.current = false;
     clearInterval(timer);
     window.removeEventListener('beforeunload', warnIfUnrecoverable);
   };
 }, []);
 function persistDemo(n:Room){try{const latest=JSON.parse(localStorage.getItem('ct-demo-v2')||'{}').rooms?.find((r:Room)=>r.id===n.id);if(latest?.student_state)Y.applyUpdate(docs.student,decode(latest.student_state));if(latest?.teacher_state)Y.applyUpdate(docs.teacher,decode(latest.teacher_state));}catch{}const next={...n,student_code:docs.student.getText('code').toString(),teacher_code:docs.teacher.getText('code').toString(),student_state:encode(docs.student),teacher_state:encode(docs.teacher)};current.current=next;setRoom(next);onDemoUpdate(next);}
 function change(file: RoomFile, code: string) {
   const doc = docs[file];
   const before = demo ? null : Y.encodeStateVector(doc);
   replaceText(doc, code);
   const next = {
     ...current.current,
     [file === 'student' ? 'student_code' : 'teacher_code']: code,
     last_active: Date.now(),
   };
   current.current = next;
   setRoom(next);
   if (before) {
     const previous = pending.current.get(file);
     const update = previous?.persisted === false ? Y.encodeStateAsUpdate(doc) : Y.encodeStateAsUpdate(doc, before);
     const keys = persistDraft(file, update, previous?.keys ?? []);
     pending.current.set(file, { version: ++counter.current, persisted: keys !== null, keys: keys ?? previous?.keys ?? [] });
     setStatus('saving');
   } else {
     persistDemo(next);
     setStatus('saved');
   }
 }
 function activity(){const n={...current.current,last_active:Date.now()};current.current=n;setRoom(n);if(demo)persistDemo(n);else touchPending.current=true;}
 async function language(value:string){
  const previous=current.current.language as RoomLanguage;
  const next=value as RoomLanguage;
  if(!['python','lua','kumir'].includes(next))return;
  try{
   let updated:Room={...current.current,language:next,last_active:Date.now()};
   if(demo){
    persistDemo(updated);
    for(const file of ['student','teacher'] as RoomFile[]){
     if(starterLanguage(docs[file].getText('code').toString(),file)===previous)change(file,ROOM_STARTERS[next][file]);
    }
   }else{
    updated=(await api<{room:Room}>('rooms/'+room.id,'POST',{language:next})).room;
    merge(updated);
   }
   const untouched=['student','teacher'].some(file=>starterLanguage(docs[file as RoomFile].getText('code').toString(),file as RoomFile)===previous);
   const custom=['student','teacher'].some(file=>starterLanguage(docs[file as RoomFile].getText('code').toString(),file as RoomFile)===null);
   if(custom)notify('Язык изменён. Твой код сохранён без изменений.');
   else if(!untouched)notify('Язык комнаты обновлён.');
  }catch(e){notify((e as Error).message);}
 }
 if(expired)return <div className="empty-state"><Clock3 size={35}/><h3>Комната завершена</h3><p>После 30 минут бездействия комната автоматически удаляется.</p><Button onClick={onExit}>Вернуться к комнатам</Button></div>;
 return <div className="code-room">
  <div className="room-heading"><div><button className="text-link" onClick={onExit}><ArrowLeft size={15}/>Все комнаты</button><h1>{room.name}</h1><p><Users size={13}/>{demo?'Демонстрационная комната':'Совместная комната'}<span>·</span><Clock3 size={13}/>Удаление через 30 минут бездействия</p></div><div className="room-heading-actions"><Tag color={status==='error'?'red':'green'}>{status==='saving'?<RefreshCw size={11}/>:<Check size={11}/>} {status==='saving'?'Сохраняем…':status==='error'?'Повторяем синхронизацию':'Сохранено'}</Tag><select value={room.language} onChange={e=>language(e.target.value)} aria-label="Язык программирования"><option value="python">Python</option><option value="lua">Lua</option><option value="kumir">Кумир</option></select></div></div>
  <div className="room-view-tabs" role="tablist" aria-label="Инструменты комнаты">
   <button type="button" role="tab" aria-selected={view==='code'} className={view==='code'?'active':''} onClick={()=>setView('code')}><FileCode2 size={16}/>Комната кода</button>
   <button type="button" role="tab" aria-selected={view==='typing'} className={view==='typing'?'active':''} onClick={()=>setView('typing')}><Keyboard size={16}/>Слепая печать</button>
  </div>
  {view==='code' ? <>
   {room.language==='kumir'?<div className="kumir-file-tabs" role="tablist" aria-label="Файлы комнаты Кумир">
    <button type="button" role="tab" aria-selected={mobileFile==='student'} className={mobileFile==='student'?'active':''} onClick={()=>setMobileFile('student')}><FileCode2 size={17}/><span>Файл ученика<small>Общий доступ</small></span></button>
    <button type="button" role="tab" aria-selected={mobileFile==='teacher'} className={mobileFile==='teacher'?'active':''} onClick={()=>setMobileFile('teacher')}><FileCode2 size={17}/><span>Файл репетитора<small>{teacher?'Только ты можешь редактировать':'Только чтение'}</small></span></button>
   </div>:<div className="mobile-file-tabs"><button className={mobileFile==='student'?'active':''} onClick={()=>setMobileFile('student')}><FileCode2 size={15}/>Файл ученика</button><button className={mobileFile==='teacher'?'active':''} onClick={()=>setMobileFile('teacher')}><FileCode2 size={15}/>Файл репетитора</button></div>}
   <RuntimeProvider><div className={'room-editors'+(room.language==='kumir'?' kumir-workspace':'')}>
    <section className={mobileFile==='student'?'selected':''}><div className="room-file-heading"><span className="user-avatar small">У</span><div><strong>Файл ученика</strong><small>Можем редактировать вместе</small></div><Tag color="neutral">Общий доступ</Tag></div><CodeEditor key={'s-'+room.language} value={room.student_code} onChange={v=>change('student',v)} language={room.language} roomId={demo?undefined:room.id} demo={demo} filename={'student.'+(room.language==='lua'?'lua':room.language==='kumir'?'kum':'py')} kumirWorkspace={room.language==='kumir'} onActivity={activity}/></section>
    <section className={mobileFile==='teacher'?'selected':''}><div className="room-file-heading"><span className="user-avatar small teacher">Р</span><div><strong>Файл репетитора</strong><small>{teacher?'Только ты можешь редактировать':'Смотри, разбирайся и запускай'}</small></div><Tag color="neutral">{teacher?'Твой файл':'Только чтение'}</Tag></div><CodeEditor key={'t-'+room.language} value={room.teacher_code} onChange={v=>change('teacher',v)} language={room.language} roomId={demo?undefined:room.id} demo={demo} filename={'teacher.'+(room.language==='lua'?'lua':room.language==='kumir'?'kum':'py')} readOnly={!teacher} kumirWorkspace={room.language==='kumir'} onActivity={activity}/></section>
   </div></RuntimeProvider>
   <div className={room.language==='kumir'?'info-box kumir-workspace-info':'info-box'}><Info size={16}/><span>{room.language==='kumir'?'Пиши программу в редакторе и наблюдай за исполнителем на поле. Данные для команды «ввод» укажи в панели «Ввод программы».':'В каждом файле свой терминал. Если программа ожидает ввод, поле появится под выводом. Код выполняется в браузере.'} {demo?'Синхронизацию между ролями можно проверить в двух вкладках демоверсии на этом устройстве.':''}</span></div>
  </> : <TypingPractice roomId={room.id} studentId={room.student_id} teacher={teacher} demo={demo}/>}
 </div>;
}
