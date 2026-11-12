'use client';

import type { ReactNode } from 'react';
import { Check, FileCode2, Send, MessageSquare } from 'lucide-react';
import MarkdownContent from './markdown-content';

type AssignmentKind = 'code' | 'quiz' | 'text';
const kindLabels: Record<AssignmentKind, string> = {
  code: 'Задание с кодом',
  quiz: 'Вопрос с выбором ответа',
  text: 'Текстовый ответ',
};

export function assignmentKindLabel(kind: string) {
  return kindLabels[kind as AssignmentKind] || 'Задание';
}

export function AssignmentSheet({ title, kind, prompt, teacher, children, action, allowLocalBlob = false }: { title: string; kind: string; prompt: string; teacher?: boolean; children?: ReactNode; action?: ReactNode; allowLocalBlob?: boolean }) {
  const available = Boolean(prompt.trim());
  return <article className="assignment-sheet" data-kind={kind}>
    <header className="task-heading">
      <div className="task-heading-copy">
        <span className="task-kind-label">{assignmentKindLabel(kind)}</span>
        <h3>{title}</h3>
      </div>
      {action}
    </header>
    {available ? <div className="task-prompt"><MarkdownContent content={prompt} allowLocalBlob={allowLocalBlob} preserveLineBreaks/></div> : <div className="task-prompt-missing" role="status"><strong>Условие задания недоступно</strong><p>{teacher ? 'Добавь условие, чтобы ученик мог выполнить задание.' : 'Попроси репетитора восстановить условие задания.'}</p></div>}
    {children}
  </article>;
}

export function AssignmentAnswerPreview({ kind, options }: { kind: string; options?: string[] }) {
  return <section className="assignment-answer-preview" aria-label="Предпросмотр ответа">
    <strong className="task-answer-label">{kind === 'code' ? 'Твоё решение' : kind === 'quiz' ? 'Выбери ответ' : 'Твоё решение'}</strong>
    {kind === 'code' ? <div className="assignment-code-placeholder">Здесь появится пустой редактор кода</div> : kind === 'quiz' ? <div className="assignment-preview-options">{(options?.length ? options : ['Первый вариант', 'Второй вариант']).map((option, index) => <span key={`${index}-${option}`}><i/>{option}</span>)}</div> : <div className="assignment-text-placeholder">Напиши свой ответ…</div>}
  </section>;
}

export function AssignmentResult({ status, message, tests }: { status: string; message?: string; tests?: { number: number; passed: boolean }[] }) {
  const title = status === 'passed' ? 'Ответ принят' : status === 'pending' ? 'Отправлено репетитору на проверку' : status === 'unavailable' ? 'Проверка ещё не подключена' : status === 'error' ? 'Не удалось отправить' : 'Попробуй ещё раз';
  return <div className={'task-result ' + status}><strong>{title}</strong>{message && <p>{message}</p>}{tests?.length ? <div className="test-results">{tests.map(test => <span className={test.passed ? 'passed' : 'failed'} key={test.number}>{test.passed ? <Check size={12}/> : <span>×</span>}Тест {test.number}</span>)}</div> : null}</div>;
}

export function AssignmentFeedback({ feedback, date }: { feedback: string; date?: string }) {
  return <div className="feedback-box"><strong><MessageSquare size={14}/>Комментарий репетитора{date ? ` · ${date}` : ''}</strong><p>{feedback}</p></div>;
}

export function assignmentTypeIcon(kind: string) {
  return kind === 'code' ? FileCode2 : kind === 'quiz' ? Check : Send;
}
