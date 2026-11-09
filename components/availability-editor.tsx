'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus, Trash2 } from 'lucide-react';
import type { AvailabilityWindow, Schedule } from '@/lib/domain';

export type CalendarChoice = { id: string; summary: string; primary: boolean; target: boolean; accessRole: string };

const week = [
  { day: 1, name: 'Понедельник', short: 'Пн' },
  { day: 2, name: 'Вторник', short: 'Вт' },
  { day: 3, name: 'Среда', short: 'Ср' },
  { day: 4, name: 'Четверг', short: 'Чт' },
  { day: 5, name: 'Пятница', short: 'Пт' },
  { day: 6, name: 'Суббота', short: 'Сб' },
  { day: 0, name: 'Воскресенье', short: 'Вс' },
];
const emptyRange: AvailabilityWindow = { from: '14:00', to: '17:00' };
const nextRange = (ranges: AvailabilityWindow[]) => {
  if (!ranges.length) return { ...emptyRange };
  const from = ranges[ranges.length - 1].to;
  const [hours, minutes] = from.split(':').map(Number);
  const endMinute = Math.min(hours * 60 + minutes + 180, 23 * 60 + 30);
  const to = `${String(Math.floor(endMinute / 60)).padStart(2, '0')}:${String(endMinute % 60).padStart(2, '0')}`;
  return { from, to };
};
const dateAtMoscow = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
const plusDays = (date: string, amount: number) => {
  const value = new Date(date + 'T12:00:00+03:00');
  value.setUTCDate(value.getUTCDate() + amount);
  return dateAtMoscow(value);
};
const weekDay = (date: string) => new Date(date + 'T12:00:00+03:00').getUTCDay();
const own = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);

export default function AvailabilityEditor({
  value,
  onChange,
  calendars,
  calendarsLoading,
  calendarsError,
  connected,
}: {
  value: Schedule;
  onChange: (next: Schedule) => void;
  calendars: CalendarChoice[];
  calendarsLoading: boolean;
  calendarsError: string;
  connected: boolean;
}) {
  const today = useMemo(() => dateAtMoscow(new Date()), []);
  const lastDate = useMemo(() => plusDays(today, 365), [today]);
  const [date, setDate] = useState(today);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(`${today}T12:00:00+03:00`));
  const [scope, setScope] = useState<'date' | 'weekly'>('date');
  const weekly = value.weeklyAvailability || Object.fromEntries((value.days || []).map(day => [day, [{ from: value.from, to: value.to }]]));
  const overrides = value.dateOverrides || {};
  const day = weekDay(date);
  const dateHasOverride = own(overrides, date);
  const ranges: AvailabilityWindow[] = scope === 'weekly'
    ? (weekly[day] || [])
    : dateHasOverride ? overrides[date] : weekly[day] || [];
  const dayName = week.find(item => item.day === day)?.name || 'день';
  const exceptionEntries = Object.entries(overrides).filter(([key]) => key >= today).sort(([a], [b]) => a.localeCompare(b));
  const monthYear = calendarMonth.getFullYear();
  const monthIndex = calendarMonth.getMonth();
  const monthDays = new Date(monthYear, monthIndex + 1, 0).getDate();
  const monthOffset = (new Date(monthYear, monthIndex, 1).getDay() + 6) % 7;

  function selectDate(nextDate: string) {
    setDate(nextDate);
    setScope('date');
    setCalendarMonth(new Date(`${nextDate}T12:00:00+03:00`));
  }

  function moveMonth(amount: number) {
    setCalendarMonth(new Date(monthYear, monthIndex + amount, 1, 12));
  }

  function publish(nextWeekly: Record<number, AvailabilityWindow[]>, nextOverrides: Record<string, AvailabilityWindow[]>, nextCalendars = value.availabilityCalendarIds || []) {
    const days = week.map(item => item.day).filter(item => (nextWeekly[item] || []).length);
    const first = days.flatMap(item => nextWeekly[item])[0];
    onChange({
      ...value,
      days,
      from: first?.from || value.from,
      to: first?.to || value.to,
      timezone: 'Europe/Moscow',
      weeklyAvailability: nextWeekly,
      dateOverrides: nextOverrides,
      availabilityCalendarIds: nextCalendars,
    });
  }

  function updateRanges(nextRanges: AvailabilityWindow[]) {
    if (scope === 'weekly') {
      const nextWeekly = { ...weekly, [day]: nextRanges };
      const nextOverrides = { ...overrides };
      delete nextOverrides[date];
      publish(nextWeekly, nextOverrides);
    } else {
      publish(weekly, { ...overrides, [date]: nextRanges });
    }
  }

  function toggleCalendar(calendarId: string, checked: boolean) {
    const selected = new Set(value.availabilityCalendarIds || []);
    if (checked) selected.add(calendarId); else selected.delete(calendarId);
    publish(weekly, overrides, [...selected]);
  }

  function removeOverride() {
    const nextOverrides = { ...overrides };
    delete nextOverrides[date];
    publish(weekly, nextOverrides);
  }

  function rangeSummary(items: AvailabilityWindow[]) {
    return items.length ? items.map(item => `${item.from}–${item.to}`).join(', ') : 'Выходной';
  }

  return <div className="availability-editor">
    <section className="availability-section availability-month-section">
      <div className="availability-heading">
        <span className="availability-icon"><CalendarDays size={18} /></span>
        <div><h3>Доступность по датам</h3><p>Выбери день, чтобы посмотреть или изменить часы работы.</p></div>
      </div>
      <div className="availability-month-header">
        <strong>{new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(calendarMonth)}</strong>
        <div className="availability-month-controls">
          <button type="button" aria-label="Предыдущий месяц" disabled={`${monthYear}-${String(monthIndex + 1).padStart(2, '0')}` <= today.slice(0, 7)} onClick={() => moveMonth(-1)}><ChevronLeft size={17} /></button>
          <button type="button" aria-label="Следующий месяц" disabled={`${monthYear}-${String(monthIndex + 1).padStart(2, '0')}` >= lastDate.slice(0, 7)} onClick={() => moveMonth(1)}><ChevronRight size={17} /></button>
        </div>
      </div>
      <div className="availability-month-weekdays">{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(item => <span key={item}>{item}</span>)}</div>
      <div className="availability-month-grid">
        {Array.from({ length: monthOffset }, (_, index) => <span className="availability-month-blank" key={'blank-' + index} />)}
        {Array.from({ length: monthDays }, (_, index) => {
          const dayNumber = index + 1;
          const dayDate = `${monthYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
          const dayRanges = own(overrides, dayDate) ? overrides[dayDate] : weekly[weekDay(dayDate)] || [];
          const isSelected = date === dayDate;
          const isToday = today === dayDate;
          return <button type="button" key={dayDate} disabled={dayDate < today || dayDate > lastDate} className={'availability-month-day ' + (isSelected ? 'selected ' : '') + (isToday ? 'today ' : '') + (dayRanges.length ? 'available' : 'closed')} onClick={() => selectDate(dayDate)} aria-pressed={isSelected} aria-label={`${dayNumber} ${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(calendarMonth)}, ${dayRanges.length ? rangeSummary(dayRanges) : 'нет доступных часов'}`}>
            <span>{dayNumber}</span><i />
          </button>;
        })}
      </div>
      <div className="availability-month-legend"><span><i className="open" />Есть часы</span><span><i className="closed" />Выходной</span><span className="availability-selected-label">Выбрано: <strong>{new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', day: 'numeric', month: 'long' }).format(new Date(date + 'T12:00:00+03:00'))}</strong></span></div>
    </section>

    <section className="availability-section">
      <div className="availability-heading">
        <span className="availability-icon"><CalendarDays size={18} /></span>
        <div><h3>Занятость в Google Calendar</h3><p>Слоты будут скрываться, если время занято в выбранном календаре.</p></div>
      </div>
      {!connected ? <div className="availability-note">Подключи Google Calendar, чтобы выбрать календарь занятости.</div>
        : calendarsLoading ? <div className="availability-note">Загружаю список календарей…</div>
          : calendarsError ? <div className="availability-note" role="status">{calendarsError} Рабочие часы и исключения по датам можно сохранить; выбор календарей останется без изменений.</div>
            : <div className="availability-calendar-list">{calendars.map(calendar => {
              const selected = calendar.target || (value.availabilityCalendarIds || []).includes(calendar.id);
              return <label className={'availability-calendar ' + (calendar.target ? 'is-target' : '')} key={calendar.id}>
                <input type="checkbox" checked={selected} disabled={calendar.target} onChange={event => toggleCalendar(calendar.id, event.target.checked)} />
                <span><strong>{calendar.summary}</strong><small>{calendar.target ? 'Куда добавляются уроки · уже проверяется' : calendar.primary ? 'Основной календарь' : 'Проверять занятость'}</small></span>
              </label>;
            })}</div>}
      {calendarsError.toLowerCase().includes('разреш') && <p className="field-hint">Нужен OAuth-доступ `calendar.calendarlist.readonly`. После его добавления обнови Google refresh token.</p>}
    </section>

    <section className="availability-section">
      <div className="availability-heading">
        <span className="availability-icon"><Clock3 size={18} /></span>
        <div><h3>Каждую неделю</h3><p>Для каждого дня можно указать несколько временных окон. Шаг записи — 30 минут.</p></div>
      </div>
      <div className="availability-week">{week.map(item => {
        const dayRanges = weekly[item.day] || [];
        return <div className={'availability-day ' + (!dayRanges.length ? 'is-off' : '')} key={item.day}>
          <div className="availability-day-label"><strong>{item.name}</strong><small>{dayRanges.length ? 'Каждую неделю' : 'Нет доступа для записи'}</small></div>
          <div className="availability-ranges">{dayRanges.map((range, index) => <div className="availability-range" key={item.day + '-' + index}>
            <input type="time" step={1800} aria-label={`${item.name}, начало интервала ${index + 1}`} value={range.from} onChange={event => { const next = [...dayRanges]; next[index] = { ...range, from: event.target.value }; publish({ ...weekly, [item.day]: next }, overrides); }} />
            <span>—</span>
            <input type="time" step={1800} aria-label={`${item.name}, конец интервала ${index + 1}`} value={range.to} onChange={event => { const next = [...dayRanges]; next[index] = { ...range, to: event.target.value }; publish({ ...weekly, [item.day]: next }, overrides); }} />
            <button type="button" className="availability-remove" aria-label={`Удалить интервал ${index + 1} для ${item.name}`} onClick={() => publish({ ...weekly, [item.day]: dayRanges.filter((_, i) => i !== index) }, overrides)}><Trash2 size={16} /></button>
          </div>)}
            <button type="button" className="availability-add" onClick={() => publish({ ...weekly, [item.day]: [...dayRanges, nextRange(dayRanges)] }, overrides)} disabled={dayRanges.length >= 10 || (dayRanges.length > 0 && dayRanges[dayRanges.length - 1].to >= '23:30')}><Plus size={15} />Добавить время</button>
          </div>
        </div>;
      })}</div>
    </section>

    <section className="availability-section date-availability">
      <div className="availability-heading">
        <span className="availability-icon"><CalendarDays size={18} /></span>
        <div><h3>Изменить отдельную дату</h3><p>Можно закрыть день или задать другие часы, не меняя остальную неделю.</p></div>
      </div>
      <label className="field availability-date-field"><span>Выбранная дата</span><input type="date" min={today} max={lastDate} value={date} onChange={event => selectDate(event.target.value)} /></label>
      <div className="availability-scope" role="radiogroup" aria-label="Область изменения доступности">
        <label><input type="radio" name="availability-scope" checked={scope === 'date'} onChange={() => setScope('date')} /><span><strong>Только {date}</strong><small>Изменить или закрыть эту дату</small></span></label>
        <label><input type="radio" name="availability-scope" checked={scope === 'weekly'} onChange={() => setScope('weekly')} /><span><strong>Каждую неделю</strong><small>Изменить {dayName.toLocaleLowerCase()} во всех неделях</small></span></label>
      </div>
      <p className="availability-effective">{scope === 'date' ? dateHasOverride ? 'Для этой даты уже задано отдельное правило.' : 'Сейчас действует недельное расписание этого дня.' : `Редактируется правило: ${dayName.toLocaleLowerCase()}.`}</p>
      <div className="availability-ranges date-ranges">{ranges.map((range, index) => <div className="availability-range" key={'selected-' + index}>
        <input type="time" step={1800} aria-label={`Начало интервала ${index + 1}`} value={range.from} onChange={event => { const next = [...ranges]; next[index] = { ...range, from: event.target.value }; updateRanges(next); }} />
        <span>—</span>
        <input type="time" step={1800} aria-label={`Конец интервала ${index + 1}`} value={range.to} onChange={event => { const next = [...ranges]; next[index] = { ...range, to: event.target.value }; updateRanges(next); }} />
        <button type="button" className="availability-remove" aria-label={`Удалить интервал ${index + 1}`} onClick={() => updateRanges(ranges.filter((_, i) => i !== index))}><Trash2 size={16} /></button>
      </div>)}
        <button type="button" className="availability-add" onClick={() => updateRanges([...ranges, nextRange(ranges)])} disabled={ranges.length >= 10 || (ranges.length > 0 && ranges[ranges.length - 1].to >= '23:30')}><Plus size={15} />Добавить время</button>
      </div>
      <div className="availability-date-actions">
        {scope === 'date' && dateHasOverride && <button type="button" className="availability-text-button" onClick={removeOverride}>Вернуть недельное расписание</button>}
        <button type="button" className="availability-close-date" onClick={() => updateRanges([])}>{scope === 'date' ? `Закрыть ${date}` : `Убрать ${dayName.toLocaleLowerCase()} каждую неделю`}</button>
      </div>
      {exceptionEntries.length > 0 && <div className="availability-exceptions"><h4>Даты с отдельными правилами</h4>{exceptionEntries.map(([key, items]) => <button type="button" key={key} onClick={() => selectDate(key)}><span>{new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(key + 'T12:00:00+03:00'))}</span><small>{rangeSummary(items)}</small></button>)}</div>}
    </section>
  </div>;
}
