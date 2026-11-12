import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAssignmentPrompt } from '../lib/assignment-prompt-format.mjs';

test('преобразует структуру HTML-условия в Markdown с переносами и списками', () => {
  const prompt = '<h2>Задание</h2><p>Вычисли <strong>2 + 2</strong><br>и выведи результат.</p><ol><li>Создай переменную</li><li>Покажи её значение</li></ol>';
  const markdown = normalizeAssignmentPrompt(prompt);
  assert.match(markdown, /^## Задание/);
  assert.match(markdown, /Вычисли \*\*2 \+ 2\*\*/);
  assert.match(markdown, /2 \+ 2\*\*\nи выведи результат\./);
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

test('оставляет Markdown без HTML-разметки как есть и не превращает URL в тег', () => {
  const markdown = '# Условие\n\nСравни `a < b` и открой <https://example.test>.\n';
  assert.equal(normalizeAssignmentPrompt(markdown), markdown);
});

test('блокирует небезопасные схемы HTML-ссылок и изображений', () => {
  const markdown = normalizeAssignmentPrompt('<p><a href="javascript:alert(1)">текст</a><img src="data:text/html,x" alt="вложение"></p>');
  assert.doesNotMatch(markdown, /javascript:|data:text/);
  assert.match(markdown, /текст/);
  assert.match(markdown, /вложение/);
});

test('сохраняет вложенность HTML-списков и продолжение пункта', () => {
  const markdown = normalizeAssignmentPrompt('<ol start="3"><li><p>Внешний пункт</p><ul><li>Вложенный <em>пункт</em></li><li>Второй вложенный</li></ul><p>Продолжение.</p></li><li>Следующий внешний</li></ol>');
  assert.match(markdown, /^3\. Внешний пункт\n {3}- Вложенный \*пункт\*\n {3}- Второй вложенный\n {3}Продолжение\.\n4\. Следующий внешний$/);
});
