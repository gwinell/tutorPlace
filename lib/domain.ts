export type Role = 'student' | 'teacher';
export type User = { id: string; name: string; role: Role; login?: string; age?: number; parent_name?: string; phone?: string; parent_phone?: string; balance: number };
export type Lesson = { id: string; student_id?: string; name: string; start: string; end: string; type: string; status: string; meet_url?: string; topic?: string; cancelled_at?: string; charged?: number; homework?: string };
export type Topic = { id: string; title: string; description: string; content: string; format: string; colab_url?: string; locked?: boolean; position?: number };
export type Assignment = { id: string; topic_id: string; lesson_id?: string; title: string; kind: string; prompt: string; options?: string | string[] };
export type Submission = { id: string; assignment_id: string; student_id: string; content: string; result: string; created_at: string };
export type Room = { id: string; student_id: string; name: string; language: string; student_code: string; teacher_code: string; student_state?:string;teacher_state?:string; revision: number; last_active: number };
export type Notice = { id: string; title: string; body: string; created_at: string; read?: number };
export type Schedule = { days: number[]; from: string; to: string; timezone: string; meetUrl: string };
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
  if(!schedule.days.includes(weekday)) return [];
  const start = new Date(date+'T'+schedule.from+':00+03:00').getTime();
  const end = new Date(date+'T'+schedule.to+':00+03:00').getTime();
  const slots: {start:string;end:string}[]=[];
  for(let n=start;n+minutes*60000<=end;n+=30*60000){
    const slot={start:new Date(n).toISOString(),end:new Date(n+minutes*60000).toISOString()};
    if(n>now && !busy.some(b=>overlaps(slot.start,slot.end,b.start,b.end))) slots.push(slot);
  }
  return slots;
}
export const PYTHON_START = '# Твоя первая программа\nname = input("Как тебя зовут? ")\nprint(f"Привет, {name}! Давай программировать вместе.")\n';
export const TEACHER_START = '# Разберём решение вместе\ndef greet(name):\n    return f"Привет, {name}!"\n\nprint(greet("мир"))\n';
