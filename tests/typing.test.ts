import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateTypingMetrics, keepLatestTypingAttempts } from '../lib/typing.ts';

test('скорость и точность считаются по набранному тексту', () => {
  assert.deepEqual(calculateTypingMetrics('hello', 'hello', 60_000), { wpm: 1, accuracy: 100, durationMs: 60_000 });
  assert.deepEqual(calculateTypingMetrics('hello', 'hxllo', 60_000), { wpm: 1, accuracy: 80, durationMs: 60_000 });
});

test('пустая или очень короткая попытка не ломает расчёт скорости', () => {
  assert.deepEqual(calculateTypingMetrics('abc', '', 0), { wpm: 0, accuracy: 0, durationMs: 1 });
  assert.equal(calculateTypingMetrics('abc', 'a', 60_000).accuracy, 100);
  assert.equal(calculateTypingMetrics('abc', 'abc', 1).wpm, 250);
});

test('история ограничивается тридцатью результатами на язык', () => {
  const attempts = Array.from({ length: 70 }, (_, index) => ({ id: String(index), language: index % 2 ? 'en' as const : 'ru' as const }));
  const saved = keepLatestTypingAttempts(attempts, 30);
  assert.equal(saved.filter(item => item.language === 'ru').length, 30);
  assert.equal(saved.filter(item => item.language === 'en').length, 30);
  assert.equal(saved[0].id, '0');
});
