export type Role = 'student' | 'teacher';
export type User = { id: string; name: string; role: Role; login?: string; age?: number; parent_name?: string; phone?: string; parent_phone?: string; balance: number };
export type Lesson = { id: string; student_id?: string; name: string; start: string; end: string; type: string; status: string; meet_url?: string; jazz_room_id?: string | null; topic?: string; cancelled_at?: string; charged?: number; homework?: string; move_id?: string | null; move_start?: string | null; operation_started_at?: string | null; privacy_consent_at?: string | null; privacy_policy_version?: string | null };
export type Course = { id: string; title: string; description?: string; position: number };
export type CourseEnrollment = { course_id: string; student_id: string };
export type Topic = { id: string; course_id: string; title: string; description: string; content: string; format: string; colab_url?: string; locked?: boolean | number; position?: number };
export type Assignment = { id: string; topic_id?: string | null; student_id?: string | null; lesson_id?: string; title: string; kind: string; prompt: string; options?: string | string[] };
export type Submission = { id: string; assignment_id: string; student_id: string; content: string; result: string; created_at: string; feedback?: string; feedback_at?: string };
export type Room = { id: string; student_id: string; name: string; language: string; student_code: string; teacher_code: string; student_state?:string;teacher_state?:string; revision: number; last_active: number };
export type Notice = { id: string; title: string; body: string; created_at: string; read?: number };
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
export const PRICES = [{count:1,total:1000,each:1000},{count:4,total:3800,each:950},{count:8,total:7200,each:900},{count:12,total:10200,each:850}];
export const dateLabel = (value: string, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('ru-RU', { timeZone:'Europe/Moscow', ...options }).format(new Date(value));
export const monthKey = (value: string | number | Date) => new Intl.DateTimeFormat('en-CA', { timeZone:'Europe/Moscow', year:'numeric',month:'2-digit' }).format(new Date(value));
export function cancellationPolicy(lessons: Lesson[], now = new Date()) {
  const count = lessons.filter(l => l.type === 'paid' && l.status === 'cancelled' && l.cancelled_at && monthKey(l.cancelled_at) === monthKey(now)).length;
  return { count, freeLeft: Math.max(0, 3-count), charged: count >= 3 };
}
export function canReschedule(lesson: Lesson, now = Date.now()) { return lesson.status === 'scheduled' && new Date(lesson.start).getTime()-now >= 2*60*60*1000; }
export function overlaps(start: string, end: string, otherStart: string, otherEnd: string) { return start < otherEnd && end > otherStart; }
export function createSlots(date: string, minutes: number, schedule: Schedule, busy: {start:string;end:string}[], now=Date.now()) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const weekday = new Date(date+'T12:00:00+03:00').getUTCDay();
  const overrides=schedule.dateOverrides||{};
  const ranges=Object.prototype.hasOwnProperty.call(overrides,date)
    ?overrides[date]
    :schedule.weeklyAvailability
      ?schedule.weeklyAvailability[weekday]||[]
      :schedule.days.includes(weekday)?[{from:schedule.from,to:schedule.to}]:[];
  const slots=new Map<string,{start:string;end:string}>();
  for(const range of ranges){
    if(!/^\d{2}:\d{2}$/.test(range.from)||!/^\d{2}:\d{2}$/.test(range.to)||range.from>=range.to)continue;
    const start=new Date(date+'T'+range.from+':00+03:00').getTime();
    const end=new Date(date+'T'+range.to+':00+03:00').getTime();
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
  const passedCount = (a: Assignment) => { const s = latest.get(a.id); if (!s) return 0; try { return JSON.parse(s.result).status === 'passed' ? 1 : 0; } catch { return 0; } };
  const per = topics.map(t => { const tasks = assignments.filter(a => a.topic_id === t.id); return { topic: t, total: tasks.length, passed: tasks.reduce((n, a) => n + passedCount(a), 0) }; });
  const total = per.reduce((n, p) => n + p.total, 0), passed = per.reduce((n, p) => n + p.passed, 0);
  return { per, total, passed, percent: total ? Math.round((passed / total) * 100) : 0 };
}
