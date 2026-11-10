'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from './site-ui';
import { calculateTypingMetrics, keepLatestTypingAttempts, type TypingLanguage } from '@/lib/typing';
import { Check, Clock3, Keyboard, RotateCcw, Target, Trophy } from 'lucide-react';

type TypingAttempt = {
  id: string;
  language: TypingLanguage;
  exercise_id: string;
  wpm: number;
  accuracy: number;
  duration_ms: number;
  created_at: string;
};

const exercises: Record<TypingLanguage, { id: string; text: string }[]> = {
  ru: [
    { id: 'ru-first-steps', text: 'Каждый день я узнаю что-то новое. Сегодня я напишу программу и проверю, как она работает.' },
    { id: 'ru-small-project', text: 'Сначала придумай идею, затем разбей её на небольшие шаги. Так большой проект становится понятнее.' },
    { id: 'ru-loops', text: 'Цикл помогает повторить действие несколько раз. Например, можно вывести числа от одного до десяти.' },
    { id: 'ru-python', text: 'В Python переменная хранит значение. Дай ей понятное имя, чтобы к программе было легко вернуться.' },
    { id: 'ru-debug', text: 'Если программа ошиблась, проверь строку кода и значения переменных. Ошибка подсказывает, где искать.' },
  ],
  en: [
    { id: 'en-first-steps', text: 'Every day I learn something new. Today I will write a program and see how it works.' },
    { id: 'en-small-project', text: 'Start with an idea, then split it into small steps. A big project becomes easier to understand.' },
    { id: 'en-loops', text: 'A loop repeats an action. For example, it can print the numbers from one to ten.' },
    { id: 'en-python', text: 'In Python, a variable stores a value. Give it a clear name so your code is easy to read.' },
    { id: 'en-debug', text: 'When a program fails, check the line and the values. The error points you toward the problem.' },
  ],
};

const keyboardRows: Record<TypingLanguage, string[][]> = {
  ru: [['й','ц','у','к','е','н','г','ш','щ','з','х'], ['ф','ы','в','а','п','р','о','л','д','ж','э'], ['я','ч','с','м','и','т','ь','б','ю']],
  en: [['q','w','e','r','t','y','u','i','o','p'], ['a','s','d','f','g','h','j','k','l'], ['z','x','c','v','b','n','m']],
};

export default function TypingPractice({ roomId, studentId, teacher, demo }: { roomId: string; studentId: string; teacher: boolean; demo: boolean }) {
  const [language, setLanguage] = useState<TypingLanguage>('ru');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [attempts, setAttempts] = useState<TypingAttempt[]>([]);
  const [loading, setLoading] = useState(!demo);
  const [saveError, setSaveError] = useState('');
  const [completed, setCompleted] = useState(false);
  const exercise = exercises[language][exerciseIndex % exercises[language].length];
  const metrics = useMemo(() => startedAt && elapsed > 0 ? calculateTypingMetrics(exercise.text, typed, elapsed) : null, [exercise.text, typed, elapsed, startedAt]);

  useEffect(() => {
    let alive = true;
    if (demo) {
      void Promise.resolve().then(() => {
        try {
          const saved = JSON.parse(localStorage.getItem(`ct-demo-typing-v1:${studentId}`) || '[]') as TypingAttempt[];
          if (alive) setAttempts(saved.filter(item => item.language === 'ru' || item.language === 'en').slice(0, 60));
        } catch { if (alive) setAttempts([]); }
        if (alive) setLoading(false);
      });
      return () => { alive = false; };
    }
    void api<{ results: TypingAttempt[] }>(`rooms/${roomId}/typing-results`)
      .then(data => { if (alive) setAttempts(data.results || []); })
      .catch(() => { if (alive) setSaveError('Не удалось загрузить историю. Попробуй обновить комнату.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [demo, roomId, studentId]);

  useEffect(() => {
    if (!startedAt || completed) return;
    const timer = window.setInterval(() => setElapsed(performance.now() - startedAt), 200);
    return () => window.clearInterval(timer);
  }, [startedAt, completed]);

  function reset(nextExercise = false) {
    setTyped(''); setStartedAt(null); setElapsed(0); setCompleted(false); setSaveError('');
    if (nextExercise) setExerciseIndex(current => (current + 1) % exercises[language].length);
  }

  async function finish(value: string, start: number) {
    const durationMs = Math.max(1, Math.round(performance.now() - start));
    const result = calculateTypingMetrics(exercise.text, value, durationMs);
    setElapsed(durationMs); setCompleted(true);
    const attempt: TypingAttempt = { id: crypto.randomUUID(), language, exercise_id: exercise.id, wpm: result.wpm, accuracy: result.accuracy, duration_ms: result.durationMs, created_at: new Date().toISOString() };
    if (demo) {
      const bounded = keepLatestTypingAttempts([attempt, ...attempts.filter(item => item.id !== attempt.id)]);
      setAttempts(bounded);
      try { localStorage.setItem(`ct-demo-typing-v1:${studentId}`, JSON.stringify(bounded)); } catch { setSaveError('Браузер не сохранил результат.'); }
      return;
    }
    try {
      const data = await api<{ result: TypingAttempt }>(`rooms/${roomId}/typing-results`, 'POST', {
        language, exerciseId: exercise.id, wpm: result.wpm, accuracy: result.accuracy, durationMs: result.durationMs,
      });
      setAttempts(current => keepLatestTypingAttempts([data.result, ...current.filter(item => item.id !== data.result.id)]));
    } catch { setSaveError('Результат пока не сохранён. Историю можно обновить после восстановления связи.'); }
  }

  function onType(value: string) {
    if (teacher || completed) return;
    const next = value.slice(0, exercise.text.length);
    const start = startedAt ?? performance.now();
    if (!startedAt && next.length) setStartedAt(start);
    setTyped(next);
    if (next.length === exercise.text.length) void finish(next, start);
  }

  const languageAttempts = attempts.filter(item => item.language === language);
  const best = languageAttempts.reduce((score, item) => Math.max(score, item.wpm), 0);
  const currentWpm = metrics?.wpm || 0;

  return <section className="typing-practice" aria-labelledby="typing-title">
    <div className="typing-header">
      <div><span className="eyebrow">Короткая практика</span><h2 id="typing-title">Тренировка слепой печати</h2><p>Печатай, глядя на текст, а не на клавиши. История доступна ученику и репетитору.</p></div>
      <div className="typing-languages" role="group" aria-label="Язык упражнения">
        <button type="button" className={language === 'ru' ? 'active' : ''} onClick={() => { setLanguage('ru'); reset(); }}>Русский</button>
        <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => { setLanguage('en'); reset(); }}>English</button>
      </div>
    </div>
    <div className="typing-layout">
      <div className="typing-main">
        <div className="typing-stats">
          <div><Clock3 size={17}/><span><small>Время</small><strong>{(elapsed / 1000).toFixed(1)} с</strong></span></div>
          <div><Target size={17}/><span><small>Точность</small><strong>{metrics?.accuracy ?? 100}%</strong></span></div>
          <div><Keyboard size={17}/><span><small>Скорость</small><strong>{currentWpm} сл/мин</strong></span></div>
        </div>
        <div className="typing-prompt" aria-label="Текст для набора">
          {Array.from(exercise.text).map((character, index) => {
            const actual = typed[index];
            const state = actual === undefined ? '' : actual === character ? 'correct' : 'incorrect';
            return <span className={state} key={index}>{character}</span>;
          })}
        </div>
        {teacher ? <div className="typing-readonly"><Check size={16}/>Режим просмотра: ученик выполняет упражнения самостоятельно.</div> : <textarea
          className="typing-input" aria-label="Поле тренировки печати" value={typed} onChange={event => onType(event.target.value)}
          onPaste={event => event.preventDefault()} spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off"
          placeholder="Начни печатать здесь…" disabled={completed} rows={3}
        />}
        <div className="typing-actions">
          {completed ? <div className="typing-complete"><Check size={17}/><span>Готово: {metrics?.wpm} слов/мин, точность {metrics?.accuracy}%</span></div> : <span>{teacher ? 'История результатов ученика' : `${typed.length} из ${exercise.text.length} символов`}</span>}
          {!teacher && <div><button type="button" className="text-link" onClick={() => reset()}><RotateCcw size={15}/>Начать заново</button>{completed && <button type="button" className="button button-small" onClick={() => reset(true)}>Следующий текст</button>}</div>}
        </div>
        <div className="typing-keyboard" aria-label={`Подсказка по клавиатуре ${language === 'ru' ? 'русской' : 'английской'} раскладки`}>
          {keyboardRows[language].map((row, rowIndex) => <div className={`typing-key-row row-${rowIndex}`} key={rowIndex}>{row.map(key => <span key={key}>{key}</span>)}</div>)}
          <div className="typing-key-row typing-space"><span>пробел / space</span></div>
        </div>
        {saveError && <p className="typing-error" role="status">{saveError}</p>}
      </div>
      <aside className="typing-history">
        <div className="typing-history-title"><div><Trophy size={18}/><h3>{teacher ? 'Прогресс ученика' : 'Твой прогресс'}</h3></div><span>{languageAttempts.length}/30</span></div>
        {loading ? <p className="typing-muted">Загружаем историю…</p> : languageAttempts.length ? <>
          <div className="typing-best"><span>Лучшая скорость</span><strong>{best}<small> сл/мин</small></strong></div>
          <div className="typing-bars" aria-label="Последние результаты скорости">
            {languageAttempts.slice(0, 10).reverse().map((item, index) => <span key={item.id} title={`${item.wpm} слов/мин`} style={{ height: `${Math.max(8, Math.min(100, item.wpm / Math.max(best, 1) * 100))}%` }}><i className="sr-only">Попытка {index + 1}: {item.wpm} слов в минуту</i></span>)}
          </div>
          <ol className="typing-attempts">{languageAttempts.slice(0, 5).map(item => <li key={item.id}><span>{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span><strong>{item.wpm} сл/мин</strong><small>{item.accuracy}%</small></li>)}</ol>
        </> : <p className="typing-muted">После первого текста здесь появятся скорость и точность.</p>}
      </aside>
    </div>
  </section>;
}
