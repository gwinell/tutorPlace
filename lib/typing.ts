export type TypingLanguage = 'ru' | 'en';

export type TypingMetrics = {
  wpm: number;
  accuracy: number;
  durationMs: number;
};

export function keepLatestTypingAttempts<T extends { language: TypingLanguage }>(attempts: T[], limit = 30): T[] {
  const seen: Record<TypingLanguage, number> = { ru: 0, en: 0 };
  return attempts.filter(attempt => {
    if (seen[attempt.language] >= limit) return false;
    seen[attempt.language] += 1;
    return true;
  });
}

export function calculateTypingMetrics(target: string, typed: string, elapsedMs: number): TypingMetrics {
  const durationMs = Math.max(1, Math.round(elapsedMs));
  const sample = typed.slice(0, target.length);
  let correct = 0;
  for (let index = 0; index < sample.length; index += 1) {
    if (sample[index] === target[index]) correct += 1;
  }
  const minutes = durationMs / 60_000;
  return {
    wpm: Math.min(250, Math.max(0, Math.round((typed.length / 5) / minutes))),
    accuracy: typed.length ? Math.round((correct / typed.length) * 1000) / 10 : 0,
    durationMs,
  };
}
