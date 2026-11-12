'use client';

import { useState } from 'react';
import { RotateCw } from 'lucide-react';

type ServiceExampleData = {
  title: string;
  task: string;
  code: string[];
  output: string;
  note: string;
};

export function ServiceExample({ example }: { example: ServiceExampleData }) {
  const [run, setRun] = useState(0);

  return <section className="container service-example-section" aria-labelledby="service-example-title" data-motion="reveal">
    <div className="service-example-intro">
      <span className="eyebrow">Фрагмент практики</span>
      <h2 id="service-example-title">Посмотрим, как задача становится кодом</h2>
      <p>{example.note}</p>
    </div>
    <article className="service-example-card">
      <div className="service-example-prompt">
        <span className="service-example-label">Задача</span>
        <h3>{example.title}</h3>
        <p>{example.task}</p>
      </div>
      <div className="service-example-solution">
        <div className="service-example-code-heading"><span>Решение на Python</span><button className="service-example-replay" type="button" onClick={() => setRun((value) => value + 1)}><RotateCw size={14} aria-hidden="true"/>Показать по шагам</button></div>
        <pre className="service-example-code" data-playing={run > 0 ? 'true' : undefined} key={run}><code>{example.code.map((line, index) => <span className="service-code-line" key={`${index}-${line}`}><span className="service-code-number" aria-hidden="true">{index + 1}</span>{line || ' '}</span>)}</code></pre>
        <p className="service-example-output"><span>Результат</span><code>{example.output}</code></p>
      </div>
    </article>
  </section>;
}
