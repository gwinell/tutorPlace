import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import { normalizeAssignmentPrompt } from '../lib/assignment-prompt-format.mjs';
import { remarkLineBreaks } from '../lib/remark-line-breaks.mjs';

function renderMarkdown(source) {
  return renderToStaticMarkup(React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, source));
}

test('преобразует структуру HTML-условия в Markdown с переносами и списками', () => {
  const prompt = '<h2>Задание</h2><p>Вычисли <strong>2 + 2</strong><br>и выведи результат.</p><ol><li>Создай переменную</li><li>Покажи её значение</li></ol>';
  const markdown = normalizeAssignmentPrompt(prompt);
  assert.match(markdown, /^## Задание/);
  assert.match(renderMarkdown(markdown), /Вычисли <strong>2 \+ 2<\/strong>/);
  assert.match(renderMarkdown(markdown), /2 \+ 2<\/strong><br\/>\s*и выведи результат\./);
  assert.match(markdown, /1\. Создай переменную\n2\. Покажи её значение/);
});

test('сохраняет HTML-ссылки, изображения, блоки кода и неизвестные теги безопасным текстом', () => {
  const prompt = '<p><a href="https://example.test/task">Открой условие</a> <img src="/api/assignment-images/abc" alt="Схема"></p><pre><code>print("ok")</code></pre><custom-item data-value="x">пояснение</custom-item>';
  const markdown = normalizeAssignmentPrompt(prompt);
  assert.match(markdown, /\[Открой условие\]\(<https:\/\/example\.test\/task>\)/);
  assert.match(markdown, /!\[Схема\]\(<\/api\/assignment-images\/abc>\)/);
  assert.match(markdown, /```\nprint\("ok"\)\n```/);
  assert.match(markdown, /&lt;custom-item data-value="x"&gt;пояснение&lt;\/custom-item&gt;/);
  assert.doesNotMatch(markdown, /<custom-item/);
});

test('отделяет изображение после HTML-списка и сохраняет переносы внутри пунктов', () => {
  const markdown = normalizeAssignmentPrompt('<ul><li>Первая строка<br>Вторая строка</li></ul><img src="/api/assignment-images/image-id" alt="Схема">');
  assert.match(markdown, /- Первая строка\\\n  Вторая строка\n\n!\[Схема\]/);
});

test('отображает старые Markdown-переносы без перезаписи сохранённого условия', () => {
  const tree = { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Первая строка\nВторая строка' }] }] };
  remarkLineBreaks()(tree);
  assert.deepEqual(tree.children[0].children.map(node => node.type === 'break' ? '<br>' : node.value), ['Первая строка', '<br>', 'Вторая строка']);
});

test('оставляет Markdown без HTML-разметки как есть и не превращает URL в тег', () => {
  const markdown = '# Условие\n\nСравни `a < b` и открой <https://example.test>.\n';
  assert.equal(normalizeAssignmentPrompt(markdown), markdown);
});

test('сохраняет знаки сравнения внутри HTML-текста', () => {
  const markdown = normalizeAssignmentPrompt('<p>Символы: x < y и 2 > 1.</p>');
  assert.equal(renderMarkdown(markdown), '<p>Символы: x &lt; y и 2 &gt; 1.</p>');
  assert.equal(renderMarkdown(normalizeAssignmentPrompt('<p>Проверь x<y и a<b.</p>')), '<p>Проверь x&lt;y и a&lt;b.</p>');
  assert.equal(normalizeAssignmentPrompt('<p>Код: <code>x < y</code>.</p>'), 'Код: `x < y`\\.');
  assert.doesNotMatch(markdown, /<\/y>/);
});

test('сохраняет угловые автоссылки и подчёркивания в HTML-тексте', () => {
  const markdown = normalizeAssignmentPrompt('<p>Ссылка: <https://example.test>.</p><p>Переменные _hidden_ и __init__.</p>');
  const html = renderMarkdown(markdown);
  assert.match(html, /href="https:\/\/example\.test"/);
  assert.match(html, /Переменные _hidden_ и __init__\./);
  assert.doesNotMatch(html, /<em>|<strong>/);
});

test('оставляет Markdown-блоки и inline-фрагменты кода нетронутыми при HTML-нормализации', () => {
  const source = 'Пример HTML:\n\n```html\n<div>текст</div>\n```\n\nMarkdown-код: `<span>`.\n\n<p>Сравни x < y.</p>\n';
  const markdown = normalizeAssignmentPrompt(source);
  assert.match(markdown, /```html\n<div>текст<\/div>\n```/);
  assert.match(markdown, /`<span>`/);
  assert.match(renderMarkdown(markdown), /Сравни x &lt; y\./);
});

test('блокирует небезопасные схемы HTML-ссылок и изображений', () => {
  const markdown = normalizeAssignmentPrompt('<p><a href="javascript:alert(1)">текст</a><img src="data:text/html,x" alt="вложение"></p>');
  assert.doesNotMatch(markdown, /javascript:|data:text/);
  assert.match(markdown, /текст/);
  assert.match(markdown, /вложение/);
});

test('подписи HTML-ссылок и изображений не могут внедрить дополнительную Markdown-ссылку', () => {
  const markdown = normalizeAssignmentPrompt('<p><a href="https://safe.example">x](https://evil.example)</a> <img src="/image.png" alt="y](https://evil.example)"></p>');
  const html = renderMarkdown(markdown);
  assert.equal((html.match(/<a\b/g) || []).length, 1);
  assert.match(html, /href="https:\/\/safe\.example"/);
  assert.doesNotMatch(html, /href="https:\/\/evil\.example"/);
  assert.match(html, /alt="y\]\(https:\/\/evil\.example\)"/);
});

test('сохраняет многострочный inline-код и отступные блоки при HTML-нормализации', () => {
  const prompt = 'До ``<div>\nтекст</div>`` после\n\nExample:\n\n    <section>literal</section>\n    print("ok")\n\n>     <article>quoted literal</article>\n\n<p>Готово</p>';
  const markdown = normalizeAssignmentPrompt(prompt);
  assert.match(markdown, /``<div>\nтекст<\/div>``/);
  assert.match(markdown, /    <section>literal<\/section>\n    print\("ok"\)/);
  assert.match(markdown, />     <article>quoted literal<\/article>/);
  assert.match(markdown, /Готово$/);
});

test('HTML-сущности не декодируются повторно в видимой подписи задания', () => {
  const markdown = normalizeAssignmentPrompt('<p>Текст: &amp;lt;b&amp;gt;.</p>');
  assert.equal(renderMarkdown(markdown), '<p>Текст: &amp;lt;b&amp;gt;.</p>');
});

test('сохраняет вложенность HTML-списков и продолжение пункта', () => {
  const markdown = normalizeAssignmentPrompt('<ol start="3"><li><p>Внешний пункт</p><ul><li>Вложенный <em>пункт</em></li><li>Второй вложенный</li></ul><p>Продолжение.</p></li><li>Следующий внешний</li></ol>');
  assert.match(markdown, /^3\. Внешний пункт\n {3}- Вложенный \*пункт\*\n {3}- Второй вложенный\n {3}Продолжение\\\.\n4\. Следующий внешний$/);
});
