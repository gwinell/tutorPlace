'use client';
import {useState,useEffect,useCallback,useRef,useSyncExternalStore,useMemo} from 'react';
import type {LucideIcon} from 'lucide-react';
import {CalendarDays,BookOpen,Code2,Users,Settings,LogOut,ArrowUpRight,Plus,ChevronLeft,ChevronRight,Clock3,Video,Bell,Check,FileCode2,RefreshCw,Info,Menu,Wallet,GraduationCap,Search,ClipboardCheck,CalendarPlus,BarChart3,CreditCard,Copy,Phone} from 'lucide-react';
import {Brand,Button,ThemeToggle,Tag,Empty,Modal,api} from './site-ui';
import {User,Lesson,Topic,Assignment,Submission,Room,Notice,Schedule,Course,CourseEnrollment,LessonPreparationItem,TopicAccess,PaymentRequest,DEFAULT_SCHEDULE,dateLabel,monthKey,dateKeyInTimeZone,cancellationPolicy,canReschedule,resultStatus,topicProgress,downloadIcs} from '@/lib/domain';
import {demoStudent,demoLessons,demoTopics,demoAssignments,demoRoom,demoCourses,demoCourseEnrollments} from '@/lib/demo';
import Booking from './booking';
import Materials from './materials';
import CodeRoom, { type RoomSaveHandle } from './code-room';
import TeacherModal from './teacher-tools';
import ReviewQueue from './review-queue';
import StudentWorkFolders from './student-work-folders';
import ManualLesson from './manual-lesson';
import Payments from './payments';
import {courseProgressForStudent} from '@/lib/student-progress';
import {hasUnreadNotifications,markNotificationsRead} from '@/lib/notifications';
import {trapDrawerTab} from '@/lib/mobile-drawer';
type Data={lessons:Lesson[];courses:Course[];courseEnrollments:CourseEnrollment[];topics:Topic[];topicAccess:TopicAccess[];assignments:Assignment[];preparationItems:LessonPreparationItem[];submissions:Submission[];rooms:Room[];students:User[];notifications:Notice[];schedule:Schedule;paymentLink:string|null;paymentRequests:PaymentRequest[];paymentReminderPopupEnabled:boolean;configured?:boolean;saluteJazzConfigured?:boolean};
type WorkspaceData=Data&{user?:User};
type TrialAccountCredential={id:string;name:string;phone:string|null;start:string;login:string;password:string};
type NavItem={id:string;icon:LucideIcon;label:string;count?:number};
const demoData=():Data=>({lessons:demoLessons(),courses:demoCourses,courseEnrollments:demoCourseEnrollments,topics:demoTopics,topicAccess:['first','conditions','loops','functions'].map(topic_id=>({topic_id,student_id:'demo-student'})),assignments:demoAssignments,preparationItems:[{id:'demo-prep-topic',lesson_id:'demo-lesson-0',kind:'topic',topic_id:'functions',assignment_id:null,position:0,completed_at:null},{id:'demo-prep-task',lesson_id:'demo-lesson-0',kind:'assignment',topic_id:null,assignment_id:'task-code',position:1,completed_at:null}],submissions:[{id:'demo-sub-1',assignment_id:'task-text',student_id:'demo-student',content:'Хочу написать викторину про космос: программа задаёт вопросы, считает очки и в конце показывает результат. Вопросы буду хранить в списке, ответы проверять через if.',result:JSON.stringify({status:'pending'}),created_at:new Date().toISOString()}],rooms:[],students:[{...demoStudent,price_per_lesson:1000}],notifications:[{id:'welcome',title:'Добро пожаловать в codeTogether!',body:'Здесь будут напоминания об оплате и важные новости от репетитора.',created_at:new Date().toISOString()}],schedule:{...DEFAULT_SCHEDULE,days:[1,2,3,4,5]},paymentLink:'https://example.com/pay',paymentRequests:[],paymentReminderPopupEnabled:true,configured:false});
function normalizeDemoData(value:unknown):Data{
 const defaults=demoData();
 const saved=value&&typeof value==='object'?value as Partial<Data>:{};
 const courses=Array.isArray(saved.courses)?saved.courses:defaults.courses;
 const topics=Array.isArray(saved.topics)?saved.topics.map((topic,index)=>({...topic,course_id:topic.course_id||courses[0]?.id||'course-python',position:typeof topic.position==='number'?topic.position:index})):defaults.topics;
 const schedule=saved.schedule&&typeof saved.schedule==='object'?{...defaults.schedule,...saved.schedule,days:Array.isArray(saved.schedule.days)?saved.schedule.days:defaults.schedule.days}:defaults.schedule;
 return {...defaults,...saved,lessons:Array.isArray(saved.lessons)?saved.lessons:defaults.lessons,courses,courseEnrollments:Array.isArray(saved.courseEnrollments)?saved.courseEnrollments:defaults.courseEnrollments,topics,topicAccess:Array.isArray(saved.topicAccess)?saved.topicAccess:defaults.topicAccess,assignments:Array.isArray(saved.assignments)?saved.assignments:defaults.assignments,preparationItems:Array.isArray(saved.preparationItems)?saved.preparationItems:defaults.preparationItems,submissions:Array.isArray(saved.submissions)?saved.submissions:defaults.submissions,rooms:Array.isArray(saved.rooms)?saved.rooms:defaults.rooms,students:Array.isArray(saved.students)?saved.students:defaults.students,notifications:Array.isArray(saved.notifications)?saved.notifications:defaults.notifications,schedule};
}
const emptyData:Data={lessons:[],courses:[],courseEnrollments:[],topics:[],topicAccess:[],assignments:[],preparationItems:[],submissions:[],rooms:[],students:[],notifications:[],schedule:DEFAULT_SCHEDULE,paymentLink:null,paymentRequests:[],paymentReminderPopupEnabled:true};
function subscribeClock(listener:()=>void){const timer=setInterval(listener,15000);return()=>clearInterval(timer);}
function clockSnapshot(){return Math.floor(Date.now()/60000)*60000;}
export default function Platform({user,demo,dark,toggle,home,logout,notify,onUser,refresh}:{user:User;demo:boolean;dark:boolean;toggle:()=>void;home:()=>void;logout:()=>void;notify:(s:string)=>void;onUser:(u:User)=>void;refresh:number}){
 const [tab,setTab]=useState('calendar'),[data,setData]=useState<Data>(demo?demoData():emptyData),[loading,setLoading]=useState(!demo),[error,setError]=useState(''),[mobileNav,setMobileNav]=useState(false),[booking,setBooking]=useState(false),[manualLessonStudentId,setManualLessonStudentId]=useState<string|null>(null),[reschedule,setReschedule]=useState<Lesson>(),[cancel,setCancel]=useState<Lesson>(),[busy,setBusy]=useState(false),[notifications,setNotifications]=useState(false),[tool,setTool]=useState<{type:string;value?:object}|null>(null),[room,setRoom]=useState<Room|null>(null),[search,setSearch]=useState(''),[backfillingTrials,setBackfillingTrials]=useState(false),[promotingStudentId,setPromotingStudentId]=useState(''),[backfillCredentials,setBackfillCredentials]=useState<TrialAccountCredential[]|null>(null);
 const roomSaveHandle=useRef<RoomSaveHandle>(null);
 const sidebarRef=useRef<HTMLElement>(null);
 const mobileMenuButtonRef=useRef<HTMLButtonElement>(null);
 const drawerWasOpen=useRef(false);
 const seenPaymentReminderIds=useRef(new Set<string>());
 const balanceSyncInFlight=useRef(false);
 const [activePaymentReminder,setActivePaymentReminder]=useState<Notice|null>(null);
 const leavingRoom=useRef(false);
 const teacher=user.role==='teacher';
 useEffect(()=>{
   if(!mobileNav){if(drawerWasOpen.current)mobileMenuButtonRef.current?.focus();drawerWasOpen.current=false;return;}
   const mobileViewport=window.matchMedia('(max-width: 760px)');
   drawerWasOpen.current=true;
   const sidebar=sidebarRef.current;
   const focusable=Array.from(sidebar?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])')||[]);
   focusable[0]?.focus();
   const onKeyDown=(event:KeyboardEvent)=>{
     if(event.key==='Escape'){event.preventDefault();setMobileNav(false);return;}
     if(event.key==='Tab'&&sidebar&&!sidebar.contains(document.activeElement)){
       event.preventDefault();(event.shiftKey?focusable.at(-1):focusable[0])?.focus();return;
     }
     trapDrawerTab(event,document.activeElement,focusable);
   };
   const onViewportChange=()=>{if(!mobileViewport.matches)setMobileNav(false);};
   document.addEventListener('keydown',onKeyDown);
   mobileViewport.addEventListener('change',onViewportChange);
   return()=>{document.removeEventListener('keydown',onKeyDown);mobileViewport.removeEventListener('change',onViewportChange);};
 },[mobileNav]);
 const currentTime=useSyncExternalStore(subscribeClock,clockSnapshot,()=>0);
 const reload=useCallback(async()=>{if(demo)return;try{const d=await api<WorkspaceData>('workspace');setData(d);if(d.user)onUser(d.user);setError('');}catch(e){setError((e as Error).message);}finally{setLoading(false);}},[demo,onUser]);
 useEffect(()=>{if(demo){const loadSaved=()=>{try{const saved=localStorage.getItem('ct-demo-v2');if(saved){const normalized=normalizeDemoData(JSON.parse(saved));setData(normalized);const migrated=JSON.stringify(normalized);if(migrated!==saved)localStorage.setItem('ct-demo-v2',migrated);}}catch{}};const timer=window.setTimeout(loadSaved,0);const update=(e:StorageEvent)=>{if(e.key==='ct-demo-v2'&&e.newValue){try{setData(normalizeDemoData(JSON.parse(e.newValue)));}catch{}}};window.addEventListener('storage',update);return()=>{window.clearTimeout(timer);window.removeEventListener('storage',update);};}const request=window.setTimeout(()=>{void reload();},0);return()=>window.clearTimeout(request);},[demo,refresh,reload]);
 useEffect(()=>{
   if(demo)return;
   let active=true;
   const syncBalance=async()=>{
     if(!active||document.visibilityState==='hidden'||balanceSyncInFlight.current)return;
     balanceSyncInFlight.current=true;
     try{
       if(teacher){
         const result=await api<{balances:{id:string;balance:number}[]}>('balances');
         if(!active)return;
         const balances=new Map(result.balances.map(item=>[item.id,item.balance]));
         setData(current=>({...current,students:current.students.map(student=>balances.has(student.id)?{...student,balance:balances.get(student.id)!}:student)}));
       }else{
         const result=await api<{user:User|null}>('me');
         const latest=result.user;
         if(!active||!latest||latest.id!==user.id)return;
         onUser(latest);
         setData(current=>({...current,students:current.students.some(student=>student.id===latest.id)?current.students.map(student=>student.id===latest.id?{...student,balance:latest.balance}:student):[{...latest},...current.students]}));
       }
     }catch{/* Keep the last known balance until the next refresh. */}
     finally{balanceSyncInFlight.current=false;}
   };
   const onVisibilityChange=()=>{if(document.visibilityState==='visible')void syncBalance();};
   window.addEventListener('focus',syncBalance);
   document.addEventListener('visibilitychange',onVisibilityChange);
   const timer=window.setInterval(()=>void syncBalance(),15000);
   return()=>{active=false;window.clearInterval(timer);window.removeEventListener('focus',syncBalance);document.removeEventListener('visibilitychange',onVisibilityChange);};
 },[demo,teacher,user.id,onUser]);
 useEffect(()=>{if(demo||room||tab!=='rooms')return;let active=true;const refreshRooms=async()=>{try{const result=await api<{rooms:Room[]}>('rooms');if(active)setData(current=>({...current,rooms:result.rooms}));}catch{}};void refreshRooms();const poll=setInterval(()=>void refreshRooms(),8000);return()=>{active=false;clearInterval(poll);};},[demo,room,tab]);
 useEffect(()=>{if(demo||teacher||!data.paymentReminderPopupEnabled)return;let active=true;const poll=async()=>{try{const result=await api<{notifications:Notice[]}>('notifications/pending');if(!active)return;const pending=result.notifications||[];setData(current=>({...current,notifications:[...pending.filter(item=>!current.notifications.some(existing=>existing.id===item.id)),...current.notifications]}));}catch{/* Актуальность списка обновится при следующем опросе. */}};void poll();const timer=window.setInterval(()=>void poll(),10000);return()=>{active=false;window.clearInterval(timer);};},[demo,teacher,data.paymentReminderPopupEnabled]);
 useEffect(()=>{if(teacher||!data.paymentReminderPopupEnabled||activePaymentReminder)return;const reminder=data.notifications.find(item=>item.type==='payment_reminder'&&item.popup===1&&!item.read&&!item.popup_dismissed_at&&!seenPaymentReminderIds.current.has(item.id));if(reminder){seenPaymentReminderIds.current.add(reminder.id);setActivePaymentReminder(reminder);}},[teacher,data.paymentReminderPopupEnabled,data.notifications,activePaymentReminder]);
 const dismissPaymentReminder=useCallback((reminder:Notice)=>{setData(current=>{const updated={...current,notifications:current.notifications.map(item=>item.id===reminder.id?{...item,read:1,popup_dismissed_at:new Date().toISOString()}:item)};if(demo)localStorage.setItem('ct-demo-v2',JSON.stringify(updated));return updated;});setActivePaymentReminder(null);if(!demo)void api('notifications/'+encodeURIComponent(reminder.id)+'/dismiss','POST',{}).catch(()=>{});},[demo]);
 useEffect(()=>{if(!activePaymentReminder)return;const timer=window.setTimeout(()=>dismissPaymentReminder(activePaymentReminder),8000);return()=>window.clearTimeout(timer);},[activePaymentReminder,dismissPaymentReminder]);
 const mutate=(fn:(d:Data)=>Data)=>setData(d=>{const n=fn(d);if(demo)localStorage.setItem('ct-demo-v2',JSON.stringify(n));return n;});
 async function openNotifications(){
   setNotifications(true);
   if(teacher||!hasUnreadNotifications(data.notifications))return;
   if(demo){mutate(current=>({...current,notifications:markNotificationsRead(current.notifications)}));return;}
   try{await api('notifications/read','POST',{});setData(current=>({...current,notifications:markNotificationsRead(current.notifications)}));}
   catch(e){notify((e as Error).message);}
 }
 const liveStudent=data.students.find(s=>s.id===user.id)||user;
 const unlinkedFutureTrials=teacher?data.lessons.filter(lesson=>lesson.type==='trial'&&lesson.status==='scheduled'&&!lesson.student_id&&Date.parse(lesson.start)>currentTime):[];
 const relevantLessons=teacher?data.lessons:data.lessons.filter(l=>l.student_id===user.id||demo);
 const policy=cancellationPolicy(relevantLessons);
 const cancelPolicy=cancellationPolicy(relevantLessons.filter(l=>l.student_id===cancel?.student_id));
 const scheduled=relevantLessons.filter(l=>l.status==='scheduled').sort((a,b)=>a.start.localeCompare(b.start));
 const balance=teacher?0:liveStudent.balance;
const studentProgress=useMemo(()=>{
 const result=new Map<string,ReturnType<typeof topicProgress>>();
 const students=data.students.some(student=>student.id===user.id)?data.students:[...data.students,user];
 for(const student of students){
   result.set(student.id,teacher
     ?courseProgressForStudent(student.id,data.topics,data.assignments,data.lessons,data.submissions,data.courseEnrollments,data.topicAccess)
     :topicProgress(data.topics,data.assignments,data.submissions,student.id));
 }
 return result;
},[user,teacher,data.students,data.topics,data.assignments,data.lessons,data.submissions,data.courseEnrollments,data.topicAccess]);
const progress=studentProgress.get(user.id)||{per:[],total:0,passed:0,percent:0};
 async function review(s:Submission,status:'passed'|'needs_work',comment=''){const feedback=comment.trim();setBusy(true);try{if(demo)mutate(d=>({...d,submissions:d.submissions.map(x=>x.id===s.id?{...x,result:JSON.stringify({status}),feedback:feedback||undefined,feedback_at:feedback?new Date().toISOString():undefined}:x)}));else{await api('submissions/'+s.id,'POST',{status,feedback});await reload();}notify(status==='passed'?'Работа принята'+(feedback?', комментарий отправлен ученику.':'.'):'Работа возвращена с комментарием.');return true;}catch(e){notify((e as Error).message);return false;}finally{setBusy(false);}}
 const upcoming=scheduled.filter(l=>new Date(l.start).getTime()>currentTime);
 const pendingReviews=data.submissions.filter(s=>resultStatus(s)==='pending');
 const visibleCourses=data.courses;
 const nav:NavItem[]= [{id:'calendar',icon:CalendarDays,label:'Расписание'},{id:'materials',icon:BookOpen,label:teacher?'Курсы':'Курсы и задания'},{id:'rooms',icon:Code2,label:'Совместный код'},...(teacher?[{id:'students',icon:Users,label:'Ученики'},{id:'payments',icon:CreditCard,label:'Оплаты',count:data.paymentRequests.filter(request=>request.status==='pending').length},{id:'review',icon:ClipboardCheck,label:'На проверку',count:pendingReviews.length},{id:'results',icon:BarChart3,label:'Результаты'},{id:'settings',icon:Settings,label:'Настройки'}]:[{id:'payments',icon:CreditCard,label:'Оплата'}])];
 async function leaveRoom(action:()=>void|Promise<void>){
   if(leavingRoom.current)return;
   leavingRoom.current=true;
   try {
     if(!roomSaveHandle.current||await roomSaveHandle.current.flush())await action();
   } catch(e) {
     notify((e as Error).message);
   } finally {
     leavingRoom.current=false;
   }
 }
 const select=(id:string)=>leaveRoom(()=>{setTab(id);setMobileNav(false);setRoom(null);setSearch('');});
 const closeBooking=useCallback(()=>{
   setBooking(false);
   setReschedule(undefined);
   if(reschedule&&!demo)void reload();
 },[reschedule,demo,reload]);
 async function retryMove(lesson:Lesson){
   setBusy(true);
   try {
     await api('lessons/'+lesson.id+'/move-retry','POST',{});
     notify('Календарь подтвердил перенос.');
   } catch(e) {
     notify((e as Error).message);
   } finally {
     await reload();
     setBusy(false);
   }
 }
 async function reconcileMove(lesson:Lesson){
   setBusy(true);
   try {
     await api('lessons/'+encodeURIComponent(lesson.id)+'/move-reconcile','POST',{});
     notify('Время урока сверено с Google Календарём.');
   } catch(e) {
     notify((e as Error).message);
   } finally {
     await reload();
     setBusy(false);
   }
 }
 async function booked(lesson?:Lesson){if(demo&&lesson)mutate(d=>({...d,lessons:[...d.lessons.filter(l=>l.id!==lesson.id),lesson]}));else await reload();}
 async function backfillTrialAccounts(){setBackfillingTrials(true);try{const result=await api<{accounts:TrialAccountCredential[];linked:number}>('trial-accounts/backfill','POST',{});await reload();if(result.accounts.length)setBackfillCredentials(result.accounts);else notify(result.linked?`Подключено пробных уроков: ${result.linked}.`:'Новых будущих пробных записей без аккаунта нет.');}catch(error){notify((error as Error).message);}finally{setBackfillingTrials(false);}}
 async function promoteTrialStudent(studentId:string){setPromotingStudentId(studentId);try{await api('students/'+encodeURIComponent(studentId)+'/promote','POST',{});await reload();notify('Пробный аккаунт переведён в обычные ученики. Логин, пароль и история сохранены.');}catch(error){notify((error as Error).message);}finally{setPromotingStudentId('');}}
 async function deleteStudent(studentId:string){
   if(demo){
     const active=data.lessons.some(lesson=>lesson.student_id===studentId&&['scheduled','pending','updating','completing'].includes(lesson.status));
     if(active)throw new Error('Сначала отмени или заверши активные уроки ученика.');
     mutate(current=>{const lessonIds=new Set(current.lessons.filter(lesson=>lesson.student_id===studentId).map(lesson=>lesson.id));const assignmentIds=new Set(current.assignments.filter(assignment=>assignment.student_id===studentId||(assignment.lesson_id&&lessonIds.has(assignment.lesson_id))).map(assignment=>assignment.id));return {...current,students:current.students.filter(student=>student.id!==studentId),lessons:current.lessons.filter(lesson=>lesson.student_id!==studentId),paymentRequests:current.paymentRequests.filter(request=>request.student_id!==studentId),courseEnrollments:current.courseEnrollments.filter(enrollment=>enrollment.student_id!==studentId),assignments:current.assignments.filter(assignment=>!assignmentIds.has(assignment.id)),submissions:current.submissions.filter(submission=>submission.student_id!==studentId&&!assignmentIds.has(submission.assignment_id)),rooms:current.rooms.filter(room=>room.student_id!==studentId),notifications:current.notifications.filter(notification=>notification.student_id!==studentId)};});
   }else{await api('students/'+encodeURIComponent(studentId),'DELETE');await reload();}
   notify('Ученик и связанные с ним данные удалены.');
 }
 async function deleteCourse(courseId:string){
   const topicIds=new Set(data.topics.filter(topic=>topic.course_id===courseId).map(topic=>topic.id));
   const assignmentIds=new Set(data.assignments.filter(assignment=>!!assignment.topic_id&&topicIds.has(assignment.topic_id)).map(assignment=>assignment.id));
   if(demo){mutate(current=>({...current,courses:current.courses.filter(course=>course.id!==courseId),topics:current.topics.filter(topic=>!topicIds.has(topic.id)),assignments:current.assignments.filter(assignment=>!assignmentIds.has(assignment.id)),topicAccess:current.topicAccess.filter(access=>!topicIds.has(access.topic_id)),courseEnrollments:current.courseEnrollments.filter(enrollment=>enrollment.course_id!==courseId),submissions:current.submissions.filter(submission=>!assignmentIds.has(submission.assignment_id)),preparationItems:current.preparationItems.filter(item=>!(item.topic_id&&topicIds.has(item.topic_id))&&!(item.assignment_id&&assignmentIds.has(item.assignment_id)))}));}
   else{await api('courses/'+encodeURIComponent(courseId),'DELETE');await reload();}
   notify('Курс и связанные учебные данные удалены.');
 }
 async function createManualLesson(studentId:string,start:string){
   const student=data.students.find(item=>item.id===studentId);if(!student)throw new Error('Ученик не найден. Обнови список и попробуй снова.');
   const lessonStart=new Date(start),lessonEnd=new Date(lessonStart.getTime()+55*60_000);
   if(demo){const lesson:Lesson={id:crypto.randomUUID(),student_id:student.id,name:student.name,start:lessonStart.toISOString(),end:lessonEnd.toISOString(),type:'paid',status:'scheduled',topic:'Индивидуальное занятие'};mutate(current=>({...current,lessons:[...current.lessons,lesson]}));}
   else{await api('lessons','POST',{studentId,start:lessonStart.toISOString()});await reload();}
   notify('Урок назначен на 55 минут.');
 }
 async function savePaymentLink(url:string){
   const normalized=url.trim();if(normalized){let parsed:URL;try{parsed=new URL(normalized);}catch{throw new Error('Укажи корректную HTTPS-ссылку.');}if(parsed.protocol!=='https:'||parsed.username||parsed.password)throw new Error('Для оплаты нужна HTTPS-ссылка без логина и пароля.');}
   if(demo)mutate(current=>({...current,paymentLink:normalized||null}));else{await api('payment-link','POST',{url:normalized});await reload();}
 }
 async function setPaymentReminderPopupEnabled(enabled:boolean){
   if(demo){mutate(current=>({...current,paymentReminderPopupEnabled:enabled,notifications:enabled?current.notifications:current.notifications.map(item=>item.type==='payment_reminder'&&item.popup===1&&!item.read?{...item,read:1,popup_dismissed_at:new Date().toISOString()}:item)}));}
   else{await api('settings/payment-reminders','POST',{enabled});await reload();}
   notify(enabled?'Всплывающие напоминания об оплате включены.':'Всплывающие напоминания об оплате выключены.');
 }
 async function submitPaymentRequest(amount:number,comment:string){
   if(demo){const request:PaymentRequest={id:crypto.randomUUID(),student_id:user.id,amount_rub:amount,price_per_lesson:liveStudent.price_per_lesson||1000,comment:comment||null,status:'pending',credited_lessons:null,review_note:null,reviewed_by:null,created_at:new Date().toISOString(),reviewed_at:null};mutate(current=>({...current,paymentRequests:[request,...current.paymentRequests]}));}
   else{await api('payment-requests','POST',{amount,comment});await reload();}
 }
 async function approvePaymentRequest(requestId:string,credits:number,note:string){
   if(demo){const request=data.paymentRequests.find(item=>item.id===requestId&&item.status==='pending');if(!request)throw new Error('Заявка уже обработана или не найдена.');mutate(current=>({...current,paymentRequests:current.paymentRequests.map(item=>item.id===requestId?{...item,status:'approved',credited_lessons:credits,review_note:note||null,reviewed_by:user.id,reviewed_at:new Date().toISOString()}:item),students:current.students.map(student=>student.id===request.student_id?{...student,balance:student.balance+credits}:student)}));}
   else{await api('payment-requests/'+encodeURIComponent(requestId)+'/approve','POST',{credits,note});await reload();}
   notify(`Начислено занятий: ${credits}.`);
 }
 async function rejectPaymentRequest(requestId:string,note:string){
   if(demo){if(!data.paymentRequests.some(item=>item.id===requestId&&item.status==='pending'))throw new Error('Заявка уже обработана или не найдена.');mutate(current=>({...current,paymentRequests:current.paymentRequests.map(item=>item.id===requestId?{...item,status:'rejected',review_note:note||null,reviewed_by:user.id,reviewed_at:new Date().toISOString()}:item)}));}
   else{await api('payment-requests/'+encodeURIComponent(requestId)+'/reject','POST',{note});await reload();}
   notify('Заявка отклонена.');
 }
 async function cancelLesson(){if(!cancel)return;setBusy(true);try{if(demo){const charge=!teacher&&cancel.type==='paid'&&cancelPolicy.charged;mutate(d=>({...d,lessons:d.lessons.map(l=>l.id===cancel.id?{...l,status:'cancelled',cancelled_at:new Date().toISOString(),cancelled_by:teacher?'teacher':'student',charged:charge?1:0}:l),students:d.students.map(s=>s.id===cancel.student_id?{...s,balance:s.balance-(charge?1:0)}:s)}));notify(charge?'Урок отменён. Одно занятие списано с баланса.':'Урок отменён без списания с баланса.');}else{const r=await api<{charged:boolean}>('lessons/'+cancel.id+'/cancel','POST',{expectedCharged:!teacher&&cancel.type==='paid'&&cancelPolicy.charged});await reload();notify(r.charged?'Урок отменён. Занятие списано.':'Урок отменён без списания.');}setCancel(undefined);}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
 async function createRoom(){setBusy(true);try{let r:Room;if(demo){r={...demoRoom(),id:crypto.randomUUID(),name:'Новая комната'};mutate(d=>({...d,rooms:[...d.rooms,r]}));}else{r=(await api<{room:Room}>('rooms','POST',{})).room;await reload();}setRoom(r);}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
 async function openRoom(summary:Room){if(demo){setRoom(summary);return;}setBusy(true);try{const result=await api<{room:Room}>('rooms/'+summary.id);setRoom(result.room);}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
 async function saveTool(payload:Record<string,unknown>){
   if(!tool)return;
   if(!demo){
     try{await api(tool.type,'POST',payload);}
     catch(error){
       // Saving an existing course is idempotent: its ID and complete enrollment
       // list are part of the request, so retrying a lost response cannot create
       // a duplicate course or add duplicate enrollments.
       if(tool.type!=='courses'||typeof payload.id!=='string'||!(error instanceof TypeError))throw error;
       try{await api(tool.type,'POST',payload);}
       catch(retryError){
         if(retryError instanceof TypeError)throw new Error('Сервер не подтвердил сохранение курса. Обнови список и проверь, появился ли ученик; если нет — повтори сохранение.');
         throw retryError;
       }
     }
     await reload();
   }
   else mutate(current=>{
     if(tool.type==='students'){
       const studentId=typeof payload.id==='string'?payload.id:crypto.randomUUID();
       const student:User={id:studentId,name:typeof payload.name==='string'?payload.name:'',role:'student',balance:Number(payload.balance)||0,price_per_lesson:Number(payload.price_per_lesson)||1000,...(typeof payload.login==='string'?{login:payload.login}:{}),...(typeof payload.age==='number'?{age:payload.age}:{}),...(typeof payload.parent_name==='string'?{parent_name:payload.parent_name}:{}),...(typeof payload.phone==='string'?{phone:payload.phone}:{}),...(typeof payload.parent_phone==='string'?{parent_phone:payload.parent_phone}:{})};
       return {...current,students:[...current.students.filter(existing=>existing.id!==student.id),student]};
     }
     if(tool.type==='courses'){
       const courseId=typeof payload.id==='string'?payload.id:crypto.randomUUID();
       const course:Course={id:courseId,title:typeof payload.title==='string'?payload.title:'',description:typeof payload.description==='string'?payload.description:undefined,position:typeof payload.position==='number'?payload.position:current.courses.length};
       const ids=new Set(Array.isArray(payload.studentIds)?payload.studentIds.filter((id):id is string=>typeof id==='string'):[]);
       return {...current,courses:[...current.courses.filter(existing=>existing.id!==course.id),course],courseEnrollments:[...current.courseEnrollments.filter(enrollment=>enrollment.course_id!==course.id),...Array.from(ids).map(student_id=>({course_id:course.id,student_id}))]};
     }
     if(tool.type==='topics'){
       const topicId=typeof payload.id==='string'?payload.id:crypto.randomUUID();
       const parentTopicId=typeof payload.parent_topic_id==='string'&&payload.parent_topic_id?payload.parent_topic_id:null;
       const topic={...payload,parent_topic_id:parentTopicId,id:topicId,position:typeof payload.position==='number'?payload.position:current.topics.filter(existing=>existing.course_id===payload.course_id&&(existing.parent_topic_id||null)===parentTopicId).length} as unknown as Topic;
       return {...current,topics:[...current.topics.filter(existing=>existing.id!==topic.id),topic]};
     }
     if(tool.type==='assignments'){
       const assignment={...payload,id:typeof payload.id==='string'?payload.id:crypto.randomUUID()} as unknown as Assignment;
       return {...current,assignments:[...current.assignments.filter(existing=>existing.id!==assignment.id),assignment]};
     }
     if(tool.type==='settings')return {...current,schedule:payload as unknown as Schedule};
     if(tool.type==='notifications'){
       const notification={...payload,id:crypto.randomUUID(),created_at:new Date().toISOString(),read:0,popup:payload.type==='payment_reminder'&&current.paymentReminderPopupEnabled?1:0,popup_dismissed_at:null} as unknown as Notice;
       return {...current,notifications:[notification,...current.notifications]};
     }
     if(tool.type==='access'){
       const topicId=typeof payload.topicId==='string'?payload.topicId:'';
       const studentId=typeof payload.studentId==='string'?payload.studentId:'';
       const enabled=payload.enabled===true;
       return {...current,topicAccess:[...current.topicAccess.filter(access=>!(access.topic_id===topicId&&access.student_id===studentId)),...(enabled?[{topic_id:topicId,student_id:studentId}]:[])],topics:current.topics.map(topic=>topic.id===topicId||topic.parent_topic_id===topicId?{...topic,locked:!enabled}:topic)};
     }
     if(tool.type==='lesson-details'){
       const lessonId=typeof payload.id==='string'?payload.id:'';
       const selected=Array.isArray(payload.preparation)?payload.preparation.flatMap(value=>{
         if(typeof value==='string')return[value];
         if(value&&typeof value==='object'&&'kind'in value&&'id'in value){const item=value as {kind?:unknown;id?:unknown};return(item.kind==='topic'||item.kind==='assignment')&&typeof item.id==='string'?[item.kind+':'+item.id]:[];}
         return[];
       }):[];
       const oldItems=current.preparationItems.filter(item=>item.lesson_id===lessonId);
       const oldByKey=new Map(oldItems.map(item=>[item.kind+':'+(item.topic_id||item.assignment_id),item]));
       const newItems=selected.flatMap((key,position)=>{
         const separator=key.indexOf(':');if(separator<1)return[];
         const kind=key.slice(0,separator),targetId=key.slice(separator+1);if((kind!=='topic'&&kind!=='assignment')||!targetId)return[];
         const old=oldByKey.get(key);
         return [{id:old?.id||crypto.randomUUID(),lesson_id:lessonId,kind:kind as 'topic'|'assignment',topic_id:kind==='topic'?targetId:null,assignment_id:kind==='assignment'?targetId:null,position,completed_at:old?.completed_at||null} satisfies LessonPreparationItem];
       });
       return {...current,lessons:current.lessons.map(lesson=>lesson.id===lessonId?{...lesson,...(typeof payload.topic==='string'?{topic:payload.topic}:{}),...(typeof payload.meet_url==='string'?{meet_url:payload.meet_url}:{})}:lesson),preparationItems:[...current.preparationItems.filter(item=>item.lesson_id!==lessonId),...newItems]};
     }
     return current;
   });
   notify(demo?'Сохранено в демоверсии на этом устройстве.':'Изменения сохранены.');
   if(tool.type!=='students'||typeof payload.id==='string')setTool(null);
 }
 async function reorderTopics(courseId:string,parentTopicId:string|null,topicIds:string[]){if(demo)mutate(d=>({...d,topics:d.topics.map(t=>({...t,position:t.course_id===courseId&&(t.parent_topic_id||null)===parentTopicId&&topicIds.indexOf(t.id)>=0?topicIds.indexOf(t.id):t.position}))}));else{try{await api('topics/order','POST',{courseId,parentTopicId,topicIds});await reload();}catch(e){notify((e as Error).message);}}}
 async function togglePreparation(item:LessonPreparationItem,completed:boolean){
   if(demo){mutate(current=>({...current,preparationItems:current.preparationItems.map(existing=>existing.id===item.id?{...existing,completed_at:completed?new Date().toISOString():null}:existing)}));return;}
   try{await api('lesson-preparation/'+encodeURIComponent(item.id),'POST',{completed});await reload();}catch(e){notify((e as Error).message);}
 }
 async function complete(l:Lesson){try{if(demo)mutate(d=>({...d,lessons:d.lessons.map(x=>x.id===l.id?{...x,status:'completed'}:x),students:d.students.map(s=>s.id===l.student_id&&l.type==='paid'?{...s,balance:s.balance-1}:s)}));else{await api('lessons/'+l.id+'/complete','POST');await reload();}notify('Урок завершён, баланс обновлён.');}catch(e){notify((e as Error).message);}}
 return <div className="platform-app">
  <aside id="workspace-sidebar" ref={sidebarRef} className={'app-sidebar '+(mobileNav?'nav-open':'')} role={mobileNav?'dialog':undefined} aria-modal={mobileNav?true:undefined} aria-label={mobileNav?'Меню кабинета':undefined}><Brand onClick={()=>leaveRoom(home)}/><div className="workspace-label">{teacher?'ПРОСТРАНСТВО РЕПЕТИТОРА':'ТВОЁ ПРОСТРАНСТВО'}</div><nav aria-label="Разделы кабинета">{nav.map(n=><button key={n.id} className={tab===n.id?'active':''} onClick={()=>select(n.id)}><n.icon size={19}/>{n.label}{(n.count||0)>0&&<span className="nav-badge" aria-label={n.count+' непроверенных работ'}>{n.count}</span>}{n.id==='rooms'&&data.rooms.filter(r=>currentTime-r.last_active<1800000).length>0&&<span>{data.rooms.filter(r=>currentTime-r.last_active<1800000).length}</span>}</button>)}</nav><div className="sidebar-bottom">{!teacher&&<div className="sidebar-balance"><Wallet size={19}/><span><strong>{balance} занятия</strong><small>на твоём балансе</small></span><Tag color="neutral">55 мин</Tag></div>}<div className="sidebar-help"><span className="tiny-avatar">Р</span><div><strong>Учимся вместе</strong><p>Не бойся задавать вопросы.<br/>Для этого и нужны занятия.</p></div></div><button className="sidebar-home" onClick={()=>leaveRoom(home)}>На главную <ArrowUpRight size={15}/></button></div></aside>
  {mobileNav&&<button className="sidebar-overlay" type="button" tabIndex={-1} aria-label="Закрыть меню" onClick={()=>setMobileNav(false)}/>}
  <div className="app-main"><header className="app-topbar"><div><button ref={mobileMenuButtonRef} className="icon-button app-menu" onClick={()=>setMobileNav(open=>!open)} aria-controls="workspace-sidebar" aria-expanded={mobileNav} aria-label={mobileNav?'Закрыть меню':'Открыть меню'}><Menu size={20}/></button><span className="app-breadcrumb">{teacher?'Кабинет репетитора':'Личный кабинет'}<ChevronRight size={13}/><strong>{nav.find(n=>n.id===tab)?.label}</strong></span></div><div className={'app-topbar-actions'+(teacher?' teacher-topbar-actions':'')}>{teacher&&<Button className="button-small button-outline teacher-lesson-action" onClick={()=>setManualLessonStudentId('')} disabled={!data.students.length} title="Назначить урок" aria-label="Назначить урок"><Plus size={16}/><span className="teacher-lesson-wide-label">Назначить урок</span><span className="teacher-lesson-compact-label">Урок</span></Button>}<ThemeToggle dark={dark} toggle={toggle}/><button className="icon-button notice-button" onClick={()=>void openNotifications()} aria-label="Уведомления"><Bell size={18}/>{!teacher&&hasUnreadNotifications(data.notifications)&&<i aria-hidden="true"/>}</button><span className="topbar-divider"/><span className="user-avatar">{user.name.charAt(0)}</span><div className="topbar-user"><strong>{user.name}</strong><small>{teacher?'Репетитор':'Ученик'}</small></div><button className="icon-button" onClick={()=>leaveRoom(logout)} aria-label="Выйти"><LogOut size={16}/></button></div></header>
  {demo&&<div className="demo-banner"><Info size={14}/><span>Демоверсия · Примеры данных, изменения сохраняются на этом устройстве.</span><button onClick={()=>{localStorage.removeItem('ct-demo-v2');setData(demoData());notify('Демонстрационные данные восстановлены.');}}>Сбросить</button></div>}
  <main className={'workspace-content '+(room?'workspace-room':'')}>{error&&<div className="form-error" role="alert">{error}<button className="text-link" onClick={reload} style={{marginLeft:15}}>Повторить</button></div>}{loading?<Empty title="Открываем твоё пространство…" icon={RefreshCw}/>:room?<CodeRoom key={room.id} initial={room} saveHandle={roomSaveHandle} demo={demo} user={user} notify={notify} onExit={()=>leaveRoom(()=>{setRoom(null);void reload();})} onDemoUpdate={r=>mutate(d=>({...d,rooms:d.rooms.map(x=>x.id===r.id?r:x)}))}/>:<>
   <div className="workspace-heading"><div><span className="eyebrow">{teacher?'Всё для хорошего занятия':'Маленький шаг сегодня — большой проект завтра'}</span><h1>{tab==='calendar'?(teacher?'Привет, Руслан.':'Привет, '+user.name+'!'):tab==='materials'?(teacher?'Курсы и домашние задания':'Твои знания. Твоя практика.'):tab==='rooms'?'Программируем вместе.':tab==='students'?'Твои ученики.':tab==='review'?'Домашние задания на проверку.':tab==='results'?'Как продвигаются ученики.':tab==='payments'?(teacher?'Заявки на оплату.':'Пополнить баланс.'):'Настроим рабочий ритм.'}{tab==='calendar'&&<Code2 className="greeting-code-icon" size={30} strokeWidth={1.7} aria-hidden="true"/>}</h1><p>{tab==='calendar'?'Здесь твои занятия, планы и следующие шаги.':tab==='materials'?'Выбирай курс, открывай темы и назначай личные задания.':tab==='rooms'?'Два файла, один общий процесс. Создавай и разбирайся вместе.':tab==='students'?'Учётные записи, баланс занятий и доступ к материалам.':tab==='review'?'Новые ответы учеников ждут твоего комментария.':tab==='results'?'История ответов и прогресс учеников.':tab==='payments'?(teacher?'Проверяй переводы и вручную подтверждай пополнения.':'Оплати занятие и отправь заявку репетитору.'):'Рабочие часы, ссылки на созвоны и подключение календаря.'}</p></div>{tab==='calendar'&&!teacher&&<Button onClick={()=>setBooking(true)} disabled={balance<=upcoming.filter(l=>l.type==='paid').length}><Plus size={17}/>Записаться на урок</Button>}{tab==='students'&&<div className="workspace-heading-actions">{unlinkedFutureTrials.length>0&&<Button className="button-outline" onClick={()=>void backfillTrialAccounts()} loading={backfillingTrials}><Users size={16}/>Создать доступ для прежних записей · {unlinkedFutureTrials.length}</Button>}<Button onClick={()=>setTool({type:'students'})}><Plus size={17}/>Добавить ученика</Button></div>}{tab==='rooms'&&!teacher&&<Button onClick={createRoom} loading={busy}><Plus size={17}/>Создать комнату</Button>}</div>
   {tab==='calendar'&&<><div className="dashboard-stats"><div className="stat-card"><span className="stat-icon"><CalendarDays size={21}/></span><div><span>{teacher?'Предстоящие уроки':'Следующая встреча'}</span><strong>{teacher?upcoming.length:upcoming[0]?dateLabel(upcoming[0].start,{day:'numeric',month:'long'}):'Пока не назначена'}</strong><small>{upcoming[0]?dateLabel(upcoming[0].start,{hour:'2-digit',minute:'2-digit'})+' · Москва':'Выбери удобное время'}</small></div></div><div className="stat-card"><span className="stat-icon green"><Wallet size={21}/></span><div><span>{teacher?'Ученики на платформе':'Занятия на балансе'}</span><strong>{teacher?data.students.length:balance}<em>{teacher?'чел.':'урока'}</em></strong><small>{teacher?'Индивидуальный подход к каждому':upcoming.filter(l=>l.type==='paid').length+' зарезервировано в расписании'}</small></div></div><div className="stat-card"><span className="stat-icon amber"><FileCode2 size={21}/></span><div><span>{teacher?'Работы на проверку':'Твоя практика'}</span><strong>{teacher?data.submissions.filter(s=>resultStatus(s)==='pending').length:progress.passed+' из '+progress.total}<em>{teacher?'работ':'заданий'}</em></strong>{!teacher&&<div className="progress-track stat-progress"><i style={{width:progress.percent+'%'}}/></div>}<small>{teacher?'Текстовые ответы учеников':progress.percent+'% курса освоено'}<button className="stat-arrow" aria-label={teacher?'Открыть очередь':'Открыть задания'} onClick={()=>select(teacher?'review':'materials')}><ArrowUpRight size={16}/></button></small></div></div></div><Calendar now={currentTime} lessons={relevantLessons} assignments={data.assignments} submissions={data.submissions} topics={data.topics} preparationItems={data.preparationItems} teacher={teacher} onTogglePreparation={togglePreparation} onCancel={setCancel} onReschedule={l=>{setReschedule(l);setBooking(true);}} onDetails={l=>setTool({type:'lesson-details',value:l})} onComplete={complete} onRetryMove={retryMove} onReconcileMove={reconcileMove} busy={busy} onHomework={()=>select('materials')}/>{!teacher&&<div className="calendar-policy"><Info size={17}/><span><strong>{policy.freeLeft} из 3 отмен без списания осталось в этом месяце.</strong> Перенести урок можно не позднее чем за 2 часа. Начиная с четвёртой отмены оплаченное занятие списывается. Пробный урок не учитывается.</span></div>}</>}
   {tab==='materials'&&<Materials courses={visibleCourses} topics={data.topics} assignments={data.assignments} submissions={data.submissions} teacher={teacher} demo={demo} user={user} notify={notify} onCourse={c=>setTool({type:'courses',value:c?{...c,studentIds:data.courseEnrollments.filter(e=>e.course_id===c.id).map(e=>e.student_id)}:undefined})} onTopic={(t,courseId,parentTopicId)=>setTool({type:'topics',value:t?{...t}:{course_id:courseId,parent_topic_id:parentTopicId||''}})} onAccess={t=>setTool({type:'access',value:t})} onAssignment={value=>setTool({type:'assignments',value})} onReorder={reorderTopics} onSubmission={s=>{if(demo)mutate(d=>({...d,submissions:[...d.submissions,s]}));else reload();}}/>}
   {tab==='review'&&teacher&&<ReviewQueue submissions={pendingReviews} assignments={data.assignments} students={data.students} busy={busy} onReview={review}/>}
   {tab==='rooms'&&<div className="rooms-content">{data.rooms.filter(r=>currentTime-r.last_active<1800000).length?<div className="room-grid">{data.rooms.filter(r=>currentTime-r.last_active<1800000).map(r=><div className="room-card" key={r.id}><div className="room-card-top"><span className="room-icon"><Code2 size={24}/></span><Tag color="green"><span className="status-dot"/>Открыта</Tag></div><h3>{r.name}</h3><p>{teacher?(data.students.find(s=>s.id===r.student_id)?.name||'Ученик'):'Твоя комната'} · {r.language==='lua'?'Lua':'Python'}</p><div className="room-file-row"><FileCode2 size={14}/> student.{r.language==='lua'?'lua':'py'}<span>+ teacher.{r.language==='lua'?'lua':'py'}</span></div><Button className="button-outline button-full" onClick={()=>void openRoom(r)} loading={busy}>Подключиться <ArrowUpRight size={16}/></Button></div>)}</div>:<Empty icon={Code2} title={teacher?'Ждём первую комнату':'Здесь начнётся твой следующий проект'} action={!teacher&&<Button onClick={createRoom} loading={busy}><Plus size={16}/>Создать комнату</Button>}>{teacher?'Когда ученик создаст комнату, она появится здесь. Подключайся, чтобы писать код вместе.':'Создай комнату — Руслан увидит её в своём кабинете и сможет подключиться.'}</Empty>}<div className="info-box"><Clock3 size={17}/><span>Комната автоматически удаляется после <strong>30 минут бездействия</strong>. Файл ученика редактируют оба участника, файл репетитора — только репетитор. Запускать оба файла может каждый.</span></div></div>}
   {tab==='students'&&<><div className="search-input"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Найти ученика по имени"/></div>{data.students.length?<div className="students-grid">{data.students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())).map(s=>{const p=studentProgress.get(s.id)||{total:0,passed:0,percent:0};return <div className="student-card" key={s.id}><div className="student-card-header"><span className="student-avatar">{s.name.charAt(0)}</span><div><h3>{s.name}</h3><span>{s.age?`${s.age} лет · `:''}{s.login}</span>{s.account_type==='trial'&&<Tag color="amber">Пробный аккаунт</Tag>}</div><Tag color={s.balance?'green':'red'}>{s.balance} занятий</Tag></div><div className="student-detail"><span>Родитель</span><strong>{s.parent_name||'Не указан'}</strong></div><div className="student-detail"><span>Контакт ученика</span><strong>{s.phone||'Не указан'}</strong></div><div className="student-detail"><span>Контакт родителя</span><strong>{s.parent_phone||'Не указан'}</strong></div><div className="student-detail"><span>Цена за занятие</span><strong>{(s.price_per_lesson||1000).toLocaleString('ru-RU')} ₽</strong></div><div className="student-progress"><div className="progress-track"><i style={{width:p.percent+'%'}}/></div><small>{p.passed} из {p.total} заданий · {p.percent}% курса</small></div><div className="student-actions"><Button className="button-small" onClick={()=>setManualLessonStudentId(s.id)}><Clock3 size={15}/>Добавить урок</Button><Button className="button-outline button-small" onClick={()=>setTool({type:'students',value:s})}>Данные и баланс</Button>{s.account_type==='trial'&&<Button className="button-outline button-small" loading={promotingStudentId===s.id} onClick={()=>void promoteTrialStudent(s.id)}><GraduationCap size={15}/>Перевести в ученика</Button>}<button className="icon-button" onClick={()=>setTool({type:'notifications',value:{student_id:s.id}})} aria-label={'Уведомить об оплате: '+s.name}><Bell size={17}/></button></div></div>;})}</div>:<Empty icon={Users} title="Знакомство — первый шаг">Пробные записи и кабинеты появятся здесь. После знакомства переведи ученика в обычный аккаунт.</Empty>}</>}
   {tab==='payments'&&<Payments teacher={teacher} student={teacher?undefined:liveStudent} students={data.students} paymentLink={data.paymentLink} requests={data.paymentRequests} onSaveLink={savePaymentLink} onSubmitRequest={submitPaymentRequest} onApprove={approvePaymentRequest} onReject={rejectPaymentRequest}/>}
   {tab==='results'&&<StudentWorkFolders submissions={data.submissions} assignments={data.assignments} students={data.students} mode="history"/>}
   {tab==='settings'&&<div className="settings-grid"><div className="settings-card"><span className="stat-icon amber"><Bell size={23}/></span><h3>Напоминания об оплате</h3><p>Репетитор отправляет напоминание из карточки ученика. Ученик видит короткое всплывающее окно и может открыть его позже в уведомлениях.</p><label className="checkbox-label payment-reminder-setting"><input type="checkbox" checked={data.paymentReminderPopupEnabled} onChange={event=>void setPaymentReminderPopupEnabled(event.target.checked).catch(error=>notify((error as Error).message))}/><span>Показывать всплывающее окно ученику</span></label></div><div className="settings-card"><span className="stat-icon"><GraduationCap size={23}/></span><h3>Отзывы и оценки</h3><p>Добавляй только настоящие отзывы учеников и родителей с их согласия. Опубликованные отзывы появятся на главной.</p><Button className="button-outline" onClick={()=>setTool({type:'reviews'})}>Добавить реальный отзыв <Plus size={15}/></Button></div><div className="settings-card"><span className="stat-icon"><CalendarDays size={23}/></span><h3>Твоё рабочее расписание</h3><p>Окна для бронирования находятся внутри этих часов и дополнительно проверяются по Google Календарю.</p><div className="schedule-days">{['Вс','Пн','Вт','Ср','Чт','Пт','Сб'].map((d,i)=><span className={data.schedule.days.includes(i)?'selected':''} key={d}>{d}</span>)}</div><strong className="schedule-time">Дней с повтором: {data.schedule.days.length} <small>Москва</small></strong><p className="field-hint">{Object.keys(data.schedule.dateOverrides||{}).length} отдельных дат · часы указаны для каждого дня</p><Button className="button-outline" onClick={()=>setTool({type:'settings',value:data.schedule})}>Изменить расписание <ArrowUpRight size={15}/></Button></div><div className="settings-card"><span className="stat-icon green"><CalendarDays size={23}/></span><h3>Google Календарь</h3><Tag color={data.configured?'green':'amber'}>{data.configured?'Подключён':'Ожидает подключения'}</Tag><p>Для реальной записи нужны серверные настройки OAuth вашего календаря. Секреты не хранятся в браузере.</p><div className="info-box"><Info size={16}/><span>{data.configured?'Записи и изменения синхронизируются с календарём.':'Пока календарь не подключён, реальные окна для записи не публикуются. Инструкция — в README проекта.'}</span></div></div><div className="settings-card"><span className="stat-icon"><Video size={23}/></span><h3>SaluteJazz</h3><Tag color={data.saluteJazzConfigured?'green':'amber'}>{data.saluteJazzConfigured?'Подключён':'Ожидает ключа'}</Tag><p>При записи создаётся отдельная видеокомната, а ссылка добавляется в карточку урока и событие календаря.</p><div className="info-box"><Info size={16}/><span>{data.saluteJazzConfigured?'Ключ настроен на сервере. Новые бронирования получат ссылку SaluteJazz.':'Добавь SALUTEJAZZ_SDK_KEY в секреты Worker. Инструкция — в README проекта.'}</span></div></div><div className="settings-card"><span className="stat-icon"><Video size={23}/></span><h3>Ссылка на созвоны</h3><p>{data.schedule.meetUrl||'Общая ссылка пока не добавлена. Можно задать её для всех новых уроков или для каждого урока отдельно.'}</p><Button className="button-outline" onClick={()=>setTool({type:'settings',value:data.schedule})}>Настроить <ArrowUpRight size={15}/></Button></div><div className="settings-card"><span className="stat-icon amber"><ClipboardCheck size={23}/></span><h3>Проверка заданий</h3><p>Текстовые ответы и код проверяются вручную. Новые работы попадут во вкладку «На проверку».</p></div></div>}
  </>}</main></div>
  {backfillCredentials&&<TrialCredentialModal accounts={backfillCredentials} onClose={()=>setBackfillCredentials(null)}/>}
  {activePaymentReminder&&!teacher&&<aside className="payment-reminder-toast" role="status" aria-live="polite"><button type="button" className="payment-reminder-close" aria-label="Закрыть напоминание" onClick={()=>dismissPaymentReminder(activePaymentReminder)}><span aria-hidden="true">×</span></button><span className="eyebrow">Сообщение от репетитора</span><strong>{activePaymentReminder.title}</strong><p>{activePaymentReminder.body}</p><small>Исчезнет через несколько секунд</small></aside>}
  {booking&&<Booking onClose={closeBooking} student teacher={teacher} demo={demo} students={teacher?data.students:undefined} reschedule={reschedule} onBooked={booked}/>}
  {manualLessonStudentId!==null&&teacher&&<ManualLesson students={data.students} initialStudentId={manualLessonStudentId||undefined} calendarConfigured={!!data.configured} demo={demo} onClose={()=>setManualLessonStudentId(null)} onCreate={createManualLesson}/>}
  {cancel&&<Modal title="Отменить занятие" onClose={()=>!busy&&setCancel(undefined)}><span className="eyebrow">Планы иногда меняются</span><h2>Отменить этот урок?</h2><p className="modal-description">{dateLabel(cancel.start,{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})} · Москва</p><div className="info-box"><Info size={19}/><span><strong>{teacher?'Репетитор отменяет урок без списания занятия.':cancel.type==='trial'?'Пробный урок отменяется бесплатно.':cancelPolicy.charged?'Будет списано 1 занятие с баланса.':'Занятие не будет списано с баланса.'}</strong><br/>{teacher?'Отмена репетитором не входит в месячный счётчик ученика.':cancel.type==='trial'?'Отмена не входит в месячный счётчик.':cancelPolicy.charged?'Это четвёртая или следующая отмена оплаченного урока в этом календарном месяце.':'Это '+(cancelPolicy.count+1)+'-я из трёх отмен без списания в этом месяце.'}</span></div><div className="modal-actions"><Button className="button-outline" onClick={()=>setCancel(undefined)} disabled={busy}>Оставить урок</Button><Button className="button-danger" onClick={cancelLesson} loading={busy}>{!teacher&&cancel.type==='paid'&&cancelPolicy.charged?'Отменить и списать 1 занятие':'Отменить без списания'}</Button></div></Modal>}
  {notifications&&<Modal title="Уведомления" onClose={()=>setNotifications(false)}><span className="eyebrow">{teacher?'Отправленные ученикам':'Важное не потеряется'}</span><h2>{teacher?'Уведомления ученикам':'Твои уведомления'}</h2>{data.notifications.length?data.notifications.map(n=><article className="notification-item" key={n.id}><span className="stat-icon"><Bell size={17}/></span><div><h3>{n.title}</h3><p>{n.body}</p><small>{dateLabel(n.created_at,{day:'numeric',month:'long'})}</small></div></article>):<Empty icon={Bell} title="Всё спокойно">{teacher?'Отправленные ученикам сообщения появятся здесь.':'Здесь появятся сообщения и напоминания об оплате.'}</Empty>}</Modal>}
  {tool&&<TeacherModal tool={tool} data={data} onClose={()=>setTool(null)} onReschedule={lesson=>{setTool(null);setReschedule(lesson);setBooking(true);}} save={saveTool} onDelete={deleteStudent} onDeleteCourse={deleteCourse}/>}
 </div>;
}

function TrialCredentialModal({accounts,onClose}:{accounts:TrialAccountCredential[];onClose:()=>void}){
 const [copied,setCopied]=useState(false),[error,setError]=useState('');
 const credentialsText=accounts.map((account,index)=>`${index+1}. ${account.name}${account.phone?' · '+account.phone:''}\n${dateLabel(account.start,{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})} · Москва\nЛогин: ${account.login}\nПароль: ${account.password}`).join('\n\n');
 async function copyAll(){try{await navigator.clipboard.writeText(credentialsText);setCopied(true);setError('');window.setTimeout(()=>setCopied(false),1800);}catch{setError('Не удалось скопировать автоматически. Выдели данные вручную.');}}
 return <Modal title="Доступы для пробных учеников" onClose={onClose} wide><span className="eyebrow">Сохрани и передай ученикам</span><h2>Созданы кабинеты: {accounts.length}</h2><p className="modal-description">Пароли показаны только сейчас и не хранятся в открытом виде. Если данные потеряются, сбрось пароль в карточке ученика.</p><div className="trial-backfill-list">{accounts.map(account=><article className="trial-backfill-card" key={account.id}><strong>{account.name}</strong><span>{account.phone||'Телефон не указан'} · {dateLabel(account.start,{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</span><code>Логин: {account.login}</code><code>Пароль: {account.password}</code></article>)}</div>{error&&<div className="form-error" role="alert">{error}</div>}<div className="modal-actions"><Button className="button-outline" onClick={onClose}>Закрыть</Button><Button onClick={()=>void copyAll()}><Copy size={16}/>{copied?'Скопировано':'Скопировать все доступы'}</Button></div></Modal>;
}

function Calendar({now,lessons,assignments,submissions,topics,preparationItems,teacher,onTogglePreparation,onCancel,onReschedule,onDetails,onComplete,onRetryMove,onReconcileMove,busy,onHomework}:{now:number;lessons:Lesson[];assignments:Assignment[];submissions:Submission[];topics:Topic[];preparationItems:LessonPreparationItem[];teacher:boolean;onTogglePreparation:(item:LessonPreparationItem,completed:boolean)=>void;onCancel:(l:Lesson)=>void;onReschedule:(l:Lesson)=>void;onDetails:(l:Lesson)=>void;onComplete:(l:Lesson)=>void;onRetryMove:(l:Lesson)=>void;onReconcileMove:(l:Lesson)=>void;busy:boolean;onHomework:()=>void}){
const [month,setMonth]=useState(()=>new Date()),[selected,setSelected]=useState<number|null>(null);
const year=month.getFullYear(),m=month.getMonth(),days=new Date(year,m+1,0).getDate(),offset=(new Date(year,m,1).getDay()+6)%7;
const visibleMonth=monthKey(new Date(year,m,15));
const monthLessons=lessons.filter(lesson=>monthKey(lesson.start)===visibleMonth);
const lessonsByDay=new Map<number,Lesson[]>();
for(const lesson of monthLessons){const day=Number(dateLabel(lesson.start,{day:'numeric'}));const group=lessonsByDay.get(day)||[];group.push(lesson);lessonsByDay.set(day,group);}
const list=monthLessons.filter(lesson=>selected===null?new Date(lesson.end).getTime()>=now:Number(dateLabel(lesson.start,{day:'numeric'}))===selected).sort((a,b)=>a.start.localeCompare(b.start));
const todayKey=dateKeyInTimeZone(new Date(now));
const homeworkByLesson=useMemo(()=>{
 const assignmentsByLesson=new Map<string,Assignment[]>();
 for(const assignment of assignments){if(!assignment.lesson_id)continue;const group=assignmentsByLesson.get(assignment.lesson_id)||[];group.push(assignment);assignmentsByLesson.set(assignment.lesson_id,group);}
 const latestByStudentAssignment=new Map<string,Submission>();
 for(const submission of submissions){const key=`${submission.student_id}\u0000${submission.assignment_id}`;const previous=latestByStudentAssignment.get(key);if(!previous||submission.created_at>previous.created_at)latestByStudentAssignment.set(key,submission);}
 const prepByLesson=new Map<string,LessonPreparationItem[]>();for(const item of preparationItems){const group=prepByLesson.get(item.lesson_id)||[];group.push(item);prepByLesson.set(item.lesson_id,group);}
 const statusByLesson=new Map<string,string>();
 for(const lesson of lessons){const items=prepByLesson.get(lesson.id)||[],legacy=assignmentsByLesson.get(lesson.id)||[];if(!items.length&&!legacy.length){statusByLesson.set(lesson.id,lesson.homework||'none');continue;}const states=[...items.map(item=>item.kind==='topic'?!!item.completed_at:resultStatus(latestByStudentAssignment.get(`${lesson.student_id||''}\u0000${item.assignment_id||''}`))==='passed'),...legacy.map(task=>resultStatus(latestByStudentAssignment.get(`${lesson.student_id||''}\u0000${task.id}`))==='passed')];if(states.every(Boolean))statusByLesson.set(lesson.id,'done');else statusByLesson.set(lesson.id,states.some(Boolean)||[...items.filter(item=>item.kind==='assignment').map(item=>latestByStudentAssignment.get(`${lesson.student_id||''}\u0000${item.assignment_id||''}`)),...legacy.map(task=>latestByStudentAssignment.get(`${lesson.student_id||''}\u0000${task.id}`))].some(Boolean)?'partial':'todo');}
 return statusByLesson;
},[lessons,assignments,submissions,preparationItems]);
const preparationsByLesson=new Map<string,LessonPreparationItem[]>();for(const item of preparationItems){const group=preparationsByLesson.get(item.lesson_id)||[];group.push(item);preparationsByLesson.set(item.lesson_id,group);}
const move=(n:number)=>{setMonth(new Date(year,m+n,1));setSelected(null);};
return <div className="calendar-layout">
 <section className="calendar-panel">
  <div className="panel-title"><h2>Твоё расписание</h2><div className="calendar-controls"><button className="icon-button" onClick={()=>move(-1)} aria-label="Предыдущий месяц"><ChevronLeft size={17}/></button><strong>{new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(month)}</strong><button className="icon-button" onClick={()=>move(1)} aria-label="Следующий месяц"><ChevronRight size={17}/></button></div></div>
  <div className="calendar-weekdays">{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d=><span key={d}>{d}</span>)}</div>
  <div className="calendar-grid">{Array.from({length:offset},(_,i)=><span className="calendar-blank" key={'empty'+i}/>)}{Array.from({length:days},(_,i)=>{const day=i+1,ls=lessonsByDay.get(day)||[],dayKey=`${year}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,today=dayKey===todayKey;return <button key={day} className={'calendar-day '+(selected===day?'selected ':'')+(today?'today ':'')+(ls.some(l=>l.status==='scheduled')?'has-lesson':'')} onClick={()=>setSelected(selected===day?null:day)} aria-label={day+' '+new Intl.DateTimeFormat('ru-RU',{month:'long'}).format(month)+', '+ls.length+' уроков'}><span>{day}</span>{ls.slice(0,2).map(l=><div className={'calendar-event '+(l.status==='cancelled'?'cancelled':'')} key={l.id}><i/>{dateLabel(l.start,{hour:'2-digit',minute:'2-digit'})}<small>{teacher?l.name:'Python'}</small></div>)}</button>;})}</div>
  <div className="calendar-legend"><span><i/>Запланирован урок</span><span><i/>Отменён</span><button onClick={()=>{setMonth(new Date());setSelected(null);}}>Сегодня</button></div>
 </section>
 <section className="lesson-list">
  <div className="panel-title"><h2>{selected?selected+' '+new Intl.DateTimeFormat('ru-RU',{month:'long'}).format(month):'Ближайшие занятия'}</h2><Tag color="neutral">{list.length}</Tag></div>
  {list.length?list.map(l=>{
   const hw=homeworkByLesson.get(l.id)||'none',past=new Date(l.end).getTime()<now,started=new Date(l.start).getTime()<=now,prep=preparationsByLesson.get(l.id)||[];
   return <article className={'lesson-card '+(l.status==='cancelled'?'lesson-cancelled':'')} key={l.id}>
    <div className="lesson-card-top"><span className="lesson-day">{dateLabel(l.start,{day:'numeric'})}<small>{dateLabel(l.start,{month:'short'})}</small></span><div><Tag color={l.status==='cancelled'?'neutral':l.status==='completed'?'green':'purple'}>{l.status==='cancelled'?'Отменён':l.status==='completed'?'Проведён':l.type==='trial'?'Пробный урок':'Индивидуальный урок'}</Tag><h3>{teacher?l.name:l.topic||'Занятие по Python'}</h3><p><Clock3 size={12}/>{dateLabel(l.start,{hour:'2-digit',minute:'2-digit'})}–{dateLabel(l.end,{hour:'2-digit',minute:'2-digit'})}<span>· Москва</span></p></div></div>
    {teacher&&l.type==='trial'&&l.phone&&<p className="trial-contact"><Phone size={12}/>{l.phone}</p>}
    {l.type==='trial'&&l.trial_goals&&<p className="trial-goals"><strong>Цель занятий:</strong> {(()=>{try{const value=JSON.parse(l.trial_goals);return Array.isArray(value)?value.join(' · '):l.trial_goals;}catch{return l.trial_goals;}})()}</p>}
    {l.type==='trial'&&l.trial_comment&&<p className="trial-comment"><strong>Комментарий:</strong> {l.trial_comment}</p>}
    {prep.length>0&&<div className="lesson-preparation-checklist"><strong>Подготовка к уроку</strong>{prep.map(item=>{
     const targetTopic=item.topic_id?topics.find(topic=>topic.id===item.topic_id):undefined,targetAssignment=item.assignment_id?assignments.find(assignment=>assignment.id===item.assignment_id):undefined;
     const latest=item.assignment_id?submissions.filter(submission=>submission.assignment_id===item.assignment_id&&submission.student_id===l.student_id).sort((a,b)=>b.created_at.localeCompare(a.created_at))[0]:undefined;
     const done=item.kind==='topic'?!!item.completed_at:resultStatus(latest)==='passed';
     const status=item.kind==='topic'?(done?'Пройдено':'Отметь после изучения'):resultStatus(latest)==='passed'?'Выполнено':resultStatus(latest)==='pending'?'На проверке':'Не выполнено';
     return <label className="lesson-preparation-item" key={item.id}><input type="checkbox" checked={done} disabled={teacher||item.kind==='assignment'||l.status!=='scheduled'} onChange={event=>onTogglePreparation(item,event.target.checked)}/><span><span>{item.kind==='topic'?targetTopic?.title||'Тема курса':targetAssignment?.title||'Задание'}</span><small>{status}</small></span></label>;
    })}</div>}
    {hw!=='none'&&<button className={'homework-status '+hw} onClick={onHomework}><FileCode2 size={13}/>{hw==='done'?'Подготовка завершена':hw==='partial'?'Подготовка выполнена частично':'Есть невыполненная подготовка'}<ArrowUpRight size={12}/></button>}
    {l.move_id&&l.move_start&&<div className="lesson-secondary-actions lesson-move-pending"><span>{teacher?'Google Календарь ещё не подтвердил перенос':'Перенос синхронизируется с календарём'} · {dateLabel(l.move_start,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</span><button type="button" onClick={()=>onRetryMove(l)} disabled={busy}><RefreshCw size={12}/>{teacher?'Сверить календарь':'Проверить перенос'}</button>{teacher&&<><button type="button" className="lesson-calendar-reconcile" onClick={()=>onReconcileMove(l)} disabled={busy} aria-label="Использовать время события Google Календаря"><CalendarDays size={13}/>Принять время календаря</button><small className="lesson-move-reconcile-hint">Использует фактическое время события и освобождает оба удерживаемых окна.</small></>}</div>}
    {l.status==='scheduled'&&<><div className="lesson-primary-actions">{l.meet_url&&!past?<a className="button button-small" href={l.meet_url} target="_blank" rel="noreferrer"><Video size={14}/>На созвон <ArrowUpRight size={13}/></a>:past?<span className="no-call-link"><Video size={13}/>Время урока прошло</span>:<span className="no-call-link"><Video size={13}/>Ссылка появится перед уроком</span>}{!teacher&&<button className="icon-button" title="Добавить в календарь (.ics)" aria-label="Добавить урок в календарь" onClick={()=>downloadIcs(l)}><CalendarPlus size={15}/></button>}{teacher&&<button className="icon-button" onClick={()=>onDetails(l)} aria-label="Настроить урок"><Settings size={15}/></button>}</div><div className="lesson-secondary-actions">{!past&&<><button onClick={()=>onReschedule(l)} disabled={!canReschedule(l)} title={!canReschedule(l)?'До урока осталось меньше 2 часов':'Перенести урок'}><RefreshCw size={12}/>Перенести</button>{(teacher||!started)&&<button onClick={()=>onCancel(l)}>Отменить</button>}</>}{teacher&&past&&<button onClick={()=>onComplete(l)}><Check size={13}/>Завершить урок</button>}</div></>}
    {l.status==='cancelled'&&<p className="cancellation-caption">{l.charged?'Списано 1 занятие':'Без списания с баланса'}</p>}
   </article>;
  }):<Empty icon={CalendarDays} title="Пока нет занятий">Выбери другой день или запланируй новый урок.</Empty>}
 </section>
</div>;
}
