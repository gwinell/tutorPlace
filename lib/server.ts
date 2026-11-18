import { getSqliteDatabase } from './sqlite-db';
import { getRuntimeEnvironment } from './runtime-env';
import {User,Schedule,AvailabilityWindow,DEFAULT_SCHEDULE,createSlots,dateTimeInTimeZone} from './domain';
export type ServerEnv={
  DB?: unknown;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
  GOOGLE_CALENDAR_ID?: string;
  [key: string]: unknown;
};
export type CalendarResponse={
  status?: string;
  etag?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
  location?: string;
  calendars?: Record<string,{ busy?: { start: string; end: string }[]; errors?: { domain?: string; reason?: string }[] }>;
  [key: string]: unknown;
};
export const secrets=new Proxy({} as Record<string,string>,{get:(_target,key)=>getRuntimeEnvironment()[key as string] as string|undefined});
export const db=(environment:ServerEnv=getRuntimeEnvironment() as ServerEnv)=>{
 if(environment.DB)return environment.DB as ReturnType<typeof getSqliteDatabase>;
 return getSqliteDatabase();
};
export class HttpError extends Error{constructor(message:string,public status=400){super(message);}}
export function requireValue(condition:unknown,message:string,status=400):asserts condition {if(!condition)throw new HttpError(message,status);}
export const now=()=>new Date().toISOString();
export const id=()=>crypto.randomUUID();
export async function hash(value:string){const result=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(result),n=>n.toString(16).padStart(2,'0')).join('');}
export async function passwordHash(password:string,salt=crypto.randomUUID()){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},key,256);return salt+':'+Array.from(new Uint8Array(bits),n=>n.toString(16).padStart(2,'0')).join('');}
export async function verifyPassword(password:string,stored:string){if(!stored)return false;const actual=await passwordHash(password,stored.split(':')[0]);if(actual.length!==stored.length)return false;let diff=0;for(let i=0;i<stored.length;i++)diff|=actual.charCodeAt(i)^stored.charCodeAt(i);return diff===0;}
export function safeUser(row:Record<string,unknown>):User{const {password,created_at,...user}=row;void password;void created_at;return user as User;}
export async function currentUser(request:Request):Promise<User|null>{const token=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('ct-session='))?.slice(11);if(!token)return null;const row=await db().prepare('SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.id=? AND s.expires_at>?').bind(await hash(token),Date.now()).first();return row?safeUser(row):null;}
export async function auth(request:Request,teacher=false){const user=await currentUser(request);if(!user)throw new HttpError('Войди в личный кабинет.',401);if(teacher&&user.role!=='teacher')throw new HttpError('Это действие доступно только репетитору.',403);return user;}
function validWindows(value:unknown):AvailabilityWindow[]{
 if(!Array.isArray(value))return [];
 return value.filter((range):range is AvailabilityWindow=>!!range&&typeof range.from==='string'&&/^\d{2}:\d{2}$/.test(range.from)&&typeof range.to==='string'&&/^\d{2}:\d{2}$/.test(range.to)&&range.from<range.to).slice(0,10);
}
export function normalizeSchedule(value:unknown):Schedule{
 const raw=value&&typeof value==='object'?value as Record<string,unknown>:{};
 let weeklyAvailability:Record<number,AvailabilityWindow[]>;
 if(raw.weeklyAvailability&&typeof raw.weeklyAvailability==='object'&&!Array.isArray(raw.weeklyAvailability)){
   weeklyAvailability=Object.fromEntries(Object.entries(raw.weeklyAvailability as Record<string,unknown>).filter(([day])=>/^[0-6]$/.test(day)).map(([day,ranges])=>[Number(day),validWindows(ranges)]));
 }else{
   const days=Array.isArray(raw.days)?(raw.days as unknown[]).filter((day):day is number=>Number.isInteger(day)&&typeof day==='number'&&day>=0&&day<7):[];
   weeklyAvailability=Object.fromEntries(days.map((day:number)=>[day,validWindows([{from:String(raw.from||DEFAULT_SCHEDULE.from),to:String(raw.to||DEFAULT_SCHEDULE.to)}])]));
 }
 const dateOverrides=raw.dateOverrides&&typeof raw.dateOverrides==='object'&&!Array.isArray(raw.dateOverrides)
   ?Object.fromEntries(Object.entries(raw.dateOverrides as Record<string,unknown>).filter(([date])=>/^\d{4}-\d{2}-\d{2}$/.test(date)).map(([date,ranges])=>[date,validWindows(ranges)]))
   :{};
 const days=Object.keys(weeklyAvailability).map(Number).filter(day=>weeklyAvailability[day]?.length);
 const firstRange=days.flatMap(day=>weeklyAvailability[day])[0];
 let timezone=typeof raw.timezone==='string'?raw.timezone:DEFAULT_SCHEDULE.timezone;
 try{new Intl.DateTimeFormat('en',{timeZone:timezone});}catch{timezone=DEFAULT_SCHEDULE.timezone;}
 return {...DEFAULT_SCHEDULE,...raw,timezone,days,from:firstRange?.from||String(raw.from||DEFAULT_SCHEDULE.from),to:firstRange?.to||String(raw.to||DEFAULT_SCHEDULE.to),weeklyAvailability,dateOverrides,availabilityCalendarIds:Array.isArray(raw.availabilityCalendarIds)?[...new Set((raw.availabilityCalendarIds as unknown[]).filter((calendarId):calendarId is string=>typeof calendarId==='string'))].slice(0,10):[]};
}
let cachedSchedule:{value:Schedule;expires:number}|null=null;
export async function schedule():Promise<Schedule>{if(cachedSchedule&&cachedSchedule.expires>Date.now())return cachedSchedule.value;const row=await db().prepare("SELECT value FROM settings WHERE key='schedule'").first<{value:string}>();const value=row?normalizeSchedule(JSON.parse(row.value)):DEFAULT_SCHEDULE;cachedSchedule={value,expires:Date.now()+45000};return value;}
export function calendarConfigured(environment:ServerEnv=secrets){return !!(environment.GOOGLE_CLIENT_ID&&environment.GOOGLE_CLIENT_SECRET&&environment.GOOGLE_REFRESH_TOKEN&&environment.GOOGLE_CALENDAR_ID);}
let cachedToken:{value:string;expires:number}|null=null;
async function calendarToken(environment:ServerEnv=secrets){if(!calendarConfigured(environment))throw new HttpError('Google Календарь пока не подключён. Запись ещё не открыта.',503);if(cachedToken&&cachedToken.expires>Date.now())return cachedToken.value;const res=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({client_id:environment.GOOGLE_CLIENT_ID!,client_secret:environment.GOOGLE_CLIENT_SECRET!,refresh_token:environment.GOOGLE_REFRESH_TOKEN!,grant_type:'refresh_token'}),signal:AbortSignal.timeout(12000)});if(!res.ok)throw new HttpError('Не удалось связаться с Google Календарём. Попробуй позже.',503);const d=await res.json() as {access_token?:string;expires_in?:number};const token=d.access_token||'';cachedToken={value:token,expires:Date.now()+Math.max(1,(d.expires_in||3600)-60)*1000};return token;}
export async function calendar(path:string,method='GET',body?:unknown,headers:Record<string,string>={},environment:ServerEnv=secrets):Promise<CalendarResponse|null>{const token=await calendarToken(environment);const response=await fetch('https://www.googleapis.com/calendar/v3/'+path,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',...headers},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(12000)});if(method==='DELETE'&&(response.ok||response.status===404||response.status===410))return {};if(method==='GET'&&(response.status===404||response.status===410))return null;if(!response.ok)throw new HttpError('Календарь не подтвердил изменение. Запись не изменена. Попробуй ещё раз.',503);return response.status===204?{}:await response.json() as CalendarResponse;}
export const eventPath=(eventId?:string,environment:ServerEnv=secrets)=>'calendars/'+encodeURIComponent(environment.GOOGLE_CALENDAR_ID||'primary')+'/events'+(eventId?'/'+eventId:'');
export async function slots(date:string,minutes:number,exclude?:string){requireValue(/^\d{4}-\d{2}-\d{2}$/.test(date),'Некорректная дата.');const s=await schedule();if(!calendarConfigured())return {configured:false,slots:[]};let min:string,max:string;try{min=new Date(dateTimeInTimeZone(date,'00:00',s.timezone)).toISOString();max=new Date(dateTimeInTimeZone(new Date(Date.parse(date+'T12:00:00Z')+86400000).toISOString().slice(0,10),'00:00',s.timezone)).toISOString();}catch{throw new HttpError('Не удалось обработать дату в часовом поясе расписания.');}const reservations=await db().prepare(
    "SELECT start,end FROM lessons WHERE status IN ('scheduled','pending','updating') AND start<? AND end>? AND id!=? " +
    "UNION ALL SELECT move_start,move_end FROM lessons WHERE status='updating' AND move_start<? AND move_end>? AND id!=?"
  ).bind(max,min,exclude||'',max,min,exclude||'').all<{start:string;end:string}>();const busy=reservations.results.map(l=>({start:l.start,end:l.end}));const ignored=exclude?await db().prepare('SELECT event_id FROM lessons WHERE id=?').bind(exclude).first<{event_id:string}>():null;
 const targetCalendarId=secrets.GOOGLE_CALENDAR_ID;
 const availabilityCalendarIds=[...new Set([targetCalendarId,...(s.availabilityCalendarIds||[])])];
 const appendFreeBusy=async(ids:string[],subtract?:{start:string;end:string})=>{
   if(!ids.length)return;
   const response=await calendar('freeBusy','POST',{timeMin:min,timeMax:max,timeZone:s.timezone,items:ids.map(id=>({id}))});
   for(const calendarId of ids){
     const item=response?.calendars?.[calendarId];
     if(!item||item.errors?.length)throw new HttpError('Не удалось проверить доступность календаря. Запись временно недоступна.',503);
     for(const interval of item.busy||[]){
       let pieces=[{start:new Date(interval.start).toISOString(),end:new Date(interval.end).toISOString()}];
       if(subtract&&calendarId===targetCalendarId)pieces=pieces.flatMap(piece=>{
         if(subtract.end<=piece.start||subtract.start>=piece.end)return[piece];
         const remaining:{start:string;end:string}[]=[];
         if(subtract.start>piece.start)remaining.push({start:piece.start,end:subtract.start});
         if(subtract.end<piece.end)remaining.push({start:subtract.end,end:piece.end});
         return remaining;
       });
       busy.push(...pieces);
     }
   }
 };
 if(ignored?.event_id){
   const ownWindow=await db().prepare('SELECT start,end FROM lessons WHERE id=?').bind(exclude).first<{start:string;end:string}>();
   await appendFreeBusy(availabilityCalendarIds,ownWindow||undefined);
 }else await appendFreeBusy(availabilityCalendarIds);
 return {configured:true,slots:createSlots(date,minutes,s,busy)};
}
export function slotKeys(start:string,end:string){const keys=[];for(let t=new Date(start).getTime();t<new Date(end).getTime();t+=5*60000)keys.push(String(Math.floor(t/300000)));return keys;}
export function httpsUrl(value:unknown){if(!value)return '';try{const u=new URL(String(value));if(u.protocol==='https:')return u.href;}catch{}throw new HttpError('Нужна корректная ссылка, начинающаяся с https://.');}
export async function cleanup(environment:ServerEnv=secrets){const database=db(environment);await database.batch([database.prepare('DELETE FROM rooms WHERE last_active<?').bind(Date.now()-1800000),database.prepare('DELETE FROM sessions WHERE expires_at<?').bind(Date.now()),database.prepare("DELETE FROM settings WHERE key LIKE 'login:%' AND CAST(substr(key,72) AS INTEGER)<?").bind(Math.floor(Date.now()/60000)-2)]);}
