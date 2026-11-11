export type Role = 'student' | 'teacher';
export type User = { id: string; name: string; role: Role; login?: string; age?: number; parent_name?: string; phone?: string; parent_phone?: string; balance: number; price_per_lesson?: number };
export type PaymentRequest = {
  id: string;
  student_id: string;
  amount_rub: number;
  price_per_lesson: number;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  credited_lessons: number | null;
  review_note: string | null;
  reviewed_by: string | null;
  created_at: string;
  reviewed_at: string | null;
};
export type Lesson = { id: string; student_id?: string; name: string; start: string; end: string; type: string; status: string; meet_url?: string; jazz_room_id?: string | null; jazz_room_needs_recreation?: number; topic?: string; cancelled_at?: string; cancelled_by?: Role | null; charged?: number; homework?: string; move_id?: string | null; move_start?: string | null; operation_started_at?: string | null; privacy_consent_at?: string | null; privacy_policy_version?: string | null };
export type Course = { id: string; title: string; description?: string; position: number };
export type CourseEnrollment = { course_id: string; student_id: string };
export type Topic = { id: string; course_id: string; title: string; description: string; content?: string; format: string; colab_url?: string; github_url?: string | null; parent_topic_id?: string | null; locked?: boolean | number; position?: number };
export type Assignment = { id: string; topic_id?: string | null; student_id?: string | null; lesson_id?: string; title: string; kind: string; prompt: string; options?: string | string[] };
export type TopicAccess = { topic_id: string; student_id: string };
export type LessonPreparationItem = { id: string; lesson_id: string; kind: 'topic' | 'assignment'; topic_id: string | null; assignment_id: string | null; position: number; completed_at: string | null };
export type LessonPreparationSelection = {kind:'topic'|'assignment';id:string};
export function serializeLessonPreparation(keys:string[]):LessonPreparationSelection[]{
 return keys.map(key=>{
  const separator=key.indexOf(':'),kind=key.slice(0,separator),id=key.slice(separator+1);
  if(separator<1||(kind!=='topic'&&kind!=='assignment')||!id)throw new Error('Некорректный пункт подготовки.');
  return {kind,id};
 });
}
export type Submission = { id: string; assignment_id: string; student_id: string; content: string; result: string; created_at: string; feedback?: string; feedback_at?: string };
export type Room = { id: string; student_id: string; name: string; language: string; student_code: string; teacher_code: string; student_state?:string;teacher_state?:string; revision: number; last_active: number };
export type Notice = { id: string; title: string; body: string; created_at: string; student_id?: string; read?: number };
export type AvailabilityWindow = { from: string; to: string };
export type Schedule = {
  days: number[];
  from: string;
  to: string;
  timezone: string;
  meetUrl: string;
  weeklyAvailability?: Record<number, AvailabilityWindow[]>;
  dateOverrides?: Record<string, AvailabilityWindow[]>;
  availabilityCalendarIds?: string[];
};
export const DEFAULT_SCHEDULE: Schedule = { days: [], from: '14:00', to: '20:00', timezone: 'Europe/Moscow', meetUrl: '' };
export const DEFAULT_TIME_ZONE = 'Europe/Moscow';
export const PRICES = [{count:1,total:1000,each:1000},{count:4,total:3800,each:950},{count:8,total:7200,each:900},{count:12,total:10200,each:850}];
const dateLabelFormatters = new Map<string, Intl.DateTimeFormat>();
export const dateLabel = (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => {
  const key = JSON.stringify(options ?? {});
  let formatter = dateLabelFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('ru-RU', { timeZone:'Europe/Moscow', ...options });
    dateLabelFormatters.set(key, formatter);
  }
  return formatter.format(new Date(value));
};
const monthKeyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone:'Europe/Moscow', year:'numeric',month:'2-digit' });
export const monthKey = (value: string | number | Date) => monthKeyFormatter.format(new Date(value));
export function monthBounds(value: string | number | Date) {
  // Cancellation months are always measured in Moscow time, independent of the server timezone.
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: DEFAULT_TIME_ZONE, year: 'numeric', month: '2-digit' }).formatToParts(new Date(value));
  const year = Number(parts.find(part => part.type === 'year')?.value);
  const month = Number(parts.find(part => part.type === 'month')?.value);
  const start = new Date(Date.UTC(year, month - 1, 1) - 3 * 60 * 60 * 1000);
  const end = new Date(Date.UTC(year, month, 1) - 3 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}
export function dateKeyInTimeZone(value: Date, timeZone = DEFAULT_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(value);
  return `${parts.find(part => part.type === 'year')?.value}-${parts.find(part => part.type === 'month')?.value}-${parts.find(part => part.type === 'day')?.value}`;
}
export function addDaysToDateKey(value: string, days: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Некорректная календарная дата.');
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}
export function resultStatus(submission: Pick<Submission, 'result'> | string | null | undefined): string {
  if (!submission) return 'unknown';
  try {
    const parsed = JSON.parse(typeof submission === 'string' ? submission : submission.result) as { status?: unknown };
    return typeof parsed?.status === 'string' ? parsed.status : 'unknown';
  } catch { return 'unknown'; }
}
export function cancellationPolicy(lessons: Lesson[], now = new Date()) {
  const count = lessons.filter(l => l.type === 'paid' && l.status === 'cancelled' && l.cancelled_by !== 'teacher' && l.cancelled_at && monthKey(l.cancelled_at) === monthKey(now)).length;
  return { count, freeLeft: Math.max(0, 3-count), charged: count >= 3 };
}
export function canReschedule(lesson: Lesson, now = Date.now()) { return lesson.status === 'scheduled' && new Date(lesson.start).getTime()-now >= 2*60*60*1000; }
export function overlaps(start: string, end: string, otherStart: string, otherEnd: string) { return start < otherEnd && end > otherStart; }
export function dateTimeInTimeZone(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const desired = Date.UTC(year, month - 1, day, hour, minute);
  let timestamp = desired;
  const formatter = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  for (let attempt = 0; attempt < 2; attempt++) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).map(part => [part.type, part.value]));
    const represented = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
    timestamp += desired - represented;
  }
  return timestamp;
}
export function createSlots(date: string, minutes: number, schedule: Schedule, busy: {start:string;end:string}[], now=Date.now()) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const timeZone = schedule.timezone || DEFAULT_TIME_ZONE;
  let weekday: number, dayStart: number;
  try {
    dayStart = dateTimeInTimeZone(date, '12:00', timeZone);
    weekday = new Date(dayStart).getUTCDay();
  } catch { return []; }
  const overrides=schedule.dateOverrides||{};
  const ranges=Object.prototype.hasOwnProperty.call(overrides,date)
    ?overrides[date]
    :schedule.weeklyAvailability
      ?schedule.weeklyAvailability[weekday]||[]
      :schedule.days.includes(weekday)?[{from:schedule.from,to:schedule.to}]:[];
  const slots=new Map<string,{start:string;end:string}>();
  for(const range of ranges){
    if(!/^\d{2}:\d{2}$/.test(range.from)||!/^\d{2}:\d{2}$/.test(range.to)||range.from>=range.to)continue;
    let start: number, end: number;
    try { start=dateTimeInTimeZone(date,range.from,timeZone); end=dateTimeInTimeZone(date,range.to,timeZone); } catch { continue; }
    for(let n=start;n+minutes*60000<=end;n+=30*60000){
      const slot={start:new Date(n).toISOString(),end:new Date(n+minutes*60000).toISOString()};
      if(n>now&&!busy.some(b=>overlaps(slot.start,slot.end,b.start,b.end)))slots.set(slot.start,slot);
    }
  }
  return [...slots.values()].sort((a,b)=>a.start.localeCompare(b.start));
}
export const PYTHON_START = '# Твоя первая программа\nname = input("Как тебя зовут? ")\nprint(f"Привет, {name}! Давай программировать вместе.")\n';
export const TEACHER_START = '# Разберём решение вместе\ndef greet(name):\n    return f"Привет, {name}!"\n\nprint(greet("мир"))\n';

// ── Добавление урока в календарь ученика ──
const calDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
export const lessonTitle = (l: Lesson) => (l.type === 'trial' ? 'Пробный урок' : 'Урок Python') + ' · codeTogether';
const lessonDetails = (l: Lesson) => [l.topic || '', l.meet_url ? 'Ссылка на созвон: ' + l.meet_url : ''].filter(Boolean).join('\n');
export function googleCalendarUrl(l: Lesson): string {
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&' + new URLSearchParams({ text: lessonTitle(l), dates: calDate(l.start) + '/' + calDate(l.end), details: lessonDetails(l), ...(l.meet_url ? { location: l.meet_url } : {}) });
}
export function lessonIcs(l: Lesson): string {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//codeTogether//lessons//RU', 'BEGIN:VEVENT', 'UID:' + l.id + '@codetogether', 'DTSTAMP:' + calDate(new Date().toISOString()), 'DTSTART:' + calDate(l.start), 'DTEND:' + calDate(l.end), 'SUMMARY:' + esc(lessonTitle(l)), 'DESCRIPTION:' + esc(lessonDetails(l)), ...(l.meet_url ? ['LOCATION:' + esc(l.meet_url)] : []), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
// Вызывать только в браузере.
export function downloadIcs(l: Lesson) {
  const url = URL.createObjectURL(new Blob([lessonIcs(l)], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'urok-' + l.start.slice(0, 10) + '.ics'; a.click(); URL.revokeObjectURL(url);
}

// ── Прогресс ученика по курсу ──
export function latestSubmissions(submissions: Submission[], studentId: string) {
  const map = new Map<string, Submission>();
  for (const s of submissions) { if (s.student_id !== studentId) continue; const prev = map.get(s.assignment_id); if (!prev || s.created_at > prev.created_at) map.set(s.assignment_id, s); }
  return map;
}
export function topicProgress(topics: Topic[], assignments: Assignment[], submissions: Submission[], studentId: string) {
  const latest = latestSubmissions(submissions, studentId);
  const passedCount = (a: Assignment) => resultStatus(latest.get(a.id)) === 'passed' ? 1 : 0;
  const per = topics.map(t => { const tasks = assignments.filter(a => a.topic_id === t.id); return { topic: t, total: tasks.length, passed: tasks.reduce((n, a) => n + passedCount(a), 0) }; });
  const total = per.reduce((n, p) => n + p.total, 0), passed = per.reduce((n, p) => n + p.passed, 0);
  return { per, total, passed, percent: total ? Math.round((passed / total) * 100) : 0 };
}
