'use client';
/* eslint-disable @next/next/no-img-element -- tutor portraits come from moderator-approved profiles. */

import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, GraduationCap, Search, Video, X } from 'lucide-react';
import { api, ThemeToggle } from './site-ui';

type PublicTutor = {
  id: string;
  name: string;
  headline?: string | null;
  bio?: string | null;
  subjects: string[];
  price_per_lesson?: number | null;
  portrait_url?: string | null;
  experience?: string | null;
  qualification?: string | null;
};

type DirectoryResponse = { tutors: PublicTutor[]; subjects: string[] };

export default function Marketing({
  book,
  login,
  dark,
  toggle,
}: {
  book: (tutorId?: string) => void;
  login: () => void;
  dark: boolean;
  toggle: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [tutors, setTutors] = useState<PublicTutor[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (subject) params.set('subject', subject);
      if (query.trim()) params.set('q', query.trim());
      void api<DirectoryResponse>(`public/tutors${params.size ? `?${params}` : ''}`, 'GET', undefined, controller.signal)
        .then((result) => {
          setTutors(Array.isArray(result?.tutors) ? result.tutors : []);
          setSubjects(Array.isArray(result?.subjects) ? result.subjects : []);
          setError('');
        })
        .catch((requestError: unknown) => {
          if (controller.signal.aborted) return;
          setError(requestError instanceof Error ? requestError.message : 'Каталог временно недоступен. Попробуйте позже.');
          setTutors([]);
          setSubjects([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, query ? 220 : 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, subject, reload]);

  function jumpToCatalog() {
    document.getElementById('tutors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  }

  function formatPrice(price?: number | null) {
    if (!price || price < 1) return null;
    return `${new Intl.NumberFormat('ru-RU').format(price)} ₽ за занятие`;
  }

  const navClass = menuOpen ? 'tp-nav tp-nav-open' : 'tp-nav';

  return (
    <div className="marketing tp-shell" id="top">
      <header className="tp-header">
        <div className="tp-container tp-header-inner">
          <a className="tp-brand" href="#top" aria-label="TutorPlace — главная">
            <span className="tp-brand-mark" aria-hidden="true"><span /></span>
            <span>TutorPlace</span>
          </a>
          <nav className={navClass} aria-label="Основная навигация">
            <button type="button" onClick={jumpToCatalog}>Репетиторы</button>
            <a href="#how" onClick={() => setMenuOpen(false)}>Как это работает</a>
            <a href="#for-tutors" onClick={() => setMenuOpen(false)}>Для репетиторов</a>
          </nav>
          <div className="tp-header-actions">
            <ThemeToggle dark={dark} toggle={toggle} />
            <button type="button" className="tp-login" onClick={login}>Войти <ArrowUpRight size={15} /></button>
            <button type="button" className="tp-menu-button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenuOpen((value) => !value)}>
              {menuOpen ? <X size={20} /> : <span className="tp-menu-lines" />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="tp-hero tp-container">
          <div className="tp-hero-copy">
            <span className="tp-kicker"><span className="tp-kicker-mark" /> Учёба в своём темпе</span>
            <h1>Найдите репетитора для <span>своей цели</span></h1>
            <p className="tp-hero-lead">Разные предметы, разные подходы. Выберите преподавателя, договоритесь о занятии и учитесь онлайн в одном пространстве.</p>
            <div className="tp-hero-actions">
              <button type="button" className="tp-button tp-button-primary" onClick={jumpToCatalog}>Найти репетитора <ArrowRight size={17} /></button>
              <a className="tp-text-link" href="/?register=tutor">Я репетитор <ArrowUpRight size={15} /></a>
            </div>
            <div className="tp-hero-note"><Check size={15} /><span>Видеовстреча, общая доска и материалы для урока</span></div>
          </div>

          <div className="tp-hero-art" aria-label="Рабочее пространство онлайн-урока">
            <div className="tp-paper-shadow" />
            <div className="tp-lesson-card">
              <div className="tp-lesson-top"><span>УРОК ОНЛАЙН</span><span className="tp-live-mark"><i /> Встреча</span></div>
              <div className="tp-board-scene">
                <div className="tp-board-tabs"><span className="tp-board-tab-active">Доска</span><span>Заметки</span></div>
                <div className="tp-board-content">
                  <span className="tp-board-stroke tp-stroke-one" />
                  <span className="tp-board-stroke tp-stroke-two" />
                  <span className="tp-board-stroke tp-stroke-three" />
                  <span className="tp-board-dot" />
                  <span className="tp-board-label">обсуждаем вместе</span>
                </div>
              </div>
              <div className="tp-lesson-tools">
                <span><Video size={16} /> Видеовстреча</span>
                <span><BookOpen size={16} /> Материалы</span>
                <span><CalendarDays size={16} /> Расписание</span>
              </div>
            </div>
            <span className="tp-art-caption"><GraduationCap size={18} /> Урок, где можно спрашивать</span>
          </div>
        </section>

        <section className="tp-directory tp-container" id="tutors" aria-labelledby="tp-directory-title">
          <div className="tp-section-heading">
            <div>
              <span className="tp-kicker"><span className="tp-kicker-mark tp-kicker-mark-green" /> Каталог преподавателей</span>
              <h2 id="tp-directory-title">Выберите своё направление</h2>
            </div>
            <p>Откройте анкету и подберите время для первого занятия.</p>
          </div>

          <div className="tp-directory-controls">
            <label className="tp-search">
              <Search size={18} aria-hidden="true" />
              <span className="tp-visually-hidden">Поиск по имени, предмету или описанию</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Предмет или имя репетитора" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="Очистить поиск"><X size={16} /></button>}
            </label>
            <div className="tp-subject-filters" aria-label="Фильтр по предмету">
              <button type="button" className={!subject ? 'tp-filter-active' : ''} aria-pressed={!subject} onClick={() => setSubject('')}>Все направления</button>
              {subjects.map((item) => <button type="button" className={subject === item ? 'tp-filter-active' : ''} aria-pressed={subject === item} key={item} onClick={() => setSubject(subject === item ? '' : item)}>{item}</button>)}
            </div>
          </div>

          {loading ? (
            <div className="tp-directory-state" role="status">Загружаем анкеты репетиторов…</div>
          ) : error ? (
            <div className="tp-directory-state tp-state-error" role="alert"><strong>Не удалось открыть каталог</strong><span>{error}</span><button type="button" onClick={() => setReload((value) => value + 1)}>Повторить запрос</button></div>
          ) : tutors.length ? (
            <div className="tp-tutor-grid">
              {tutors.map((tutor, index) => (
                <article className={`tp-tutor-card tp-tutor-tone-${index % 3}`} key={tutor.id}>
                  <div className="tp-tutor-card-top">
                    {tutor.portrait_url ? <img className="tp-tutor-avatar" src={tutor.portrait_url} alt={tutor.name} loading="lazy" /> : <span className="tp-tutor-avatar tp-avatar-initials" aria-hidden="true">{tutor.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('ru-RU')}</span>}
                    <div className="tp-tutor-card-heading"><span className="tp-profile-label">Репетитор</span><h3>{tutor.name}</h3><p>{tutor.headline || tutor.qualification || 'Индивидуальные занятия онлайн'}</p></div>
                  </div>
                  {tutor.subjects.length > 0 && <div className="tp-tutor-subjects">{tutor.subjects.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>}
                  {(tutor.bio || tutor.experience) && <p className="tp-tutor-bio">{tutor.bio || tutor.experience}</p>}
                  <div className="tp-tutor-card-bottom">
                    <span className="tp-tutor-price">{formatPrice(tutor.price_per_lesson) || 'Условия в анкете'}</span>
                    <button type="button" className="tp-book-link" onClick={() => book(tutor.id)}>Выбрать время <ArrowRight size={15} /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="tp-directory-empty">
              <div className="tp-empty-mark"><BookOpen size={23} /></div>
              <div><h3>{query || subject ? 'По вашему запросу пока нет анкет' : 'Анкеты появятся после проверки'}</h3><p>{query || subject ? 'Измените предмет или поисковый запрос.' : 'Репетиторы создают профили, а администратор проверяет их перед публикацией.'}</p></div>
              {(query || subject) && <button type="button" className="tp-text-link" onClick={() => { setQuery(''); setSubject(''); }}>Сбросить фильтры <X size={14} /></button>}
            </div>
          )}
        </section>

        <section className="tp-how tp-container" id="how">
          <div className="tp-section-heading">
            <div><span className="tp-kicker"><span className="tp-kicker-mark tp-kicker-mark-blue" /> Как начать</span><h2>От поиска — к первому уроку</h2></div>
            <p>Вы выбираете преподавателя и время. Дальше урок проходит в личном пространстве.</p>
          </div>
          <ol className="tp-steps">
            <li><span>01</span><div><h3>Выберите репетитора</h3><p>Сравните предметы, подход и условия занятий в анкетах.</p></div></li>
            <li><span>02</span><div><h3>Подберите время</h3><p>Посмотрите доступные окна и отправьте заявку на урок.</p></div></li>
            <li><span>03</span><div><h3>Учитесь онлайн</h3><p>Общайтесь с репетитором, встречайтесь и работайте на общей доске.</p></div></li>
          </ol>
        </section>

        <section className="tp-for-tutors tp-container" id="for-tutors">
          <div className="tp-tutor-callout-art" aria-hidden="true"><span className="tp-book-line" /><span className="tp-book-line" /><span className="tp-book-line" /><span className="tp-book-marker" /></div>
          <div><span className="tp-kicker"><span className="tp-kicker-mark tp-kicker-mark-coral" /> Для репетиторов</span><h2>Ведите занятия и учеников в одном месте</h2><p>Создайте анкету, добавьте учеников и планируйте уроки. Публичный профиль появится в каталоге после проверки.</p></div>
          <a className="tp-button tp-button-paper" href="/?register=tutor">Зарегистрироваться <ArrowRight size={17} /></a>
        </section>
      </main>

      <footer className="tp-footer tp-container">
        <a className="tp-brand" href="#top"><span className="tp-brand-mark" aria-hidden="true"><span /></span><span>TutorPlace</span></a>
        <nav aria-label="Документы"><a href="/offer">Условия использования</a><a href="/privacy">Обработка данных</a></nav>
        <span>Уроки, которые подходят именно вам</span>
      </footer>
    </div>
  );
}
