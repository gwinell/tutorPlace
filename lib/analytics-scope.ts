'use client';

const privateScopes = new Set<string>();

export function setAnalyticsPrivate(scope: string, isPrivate: boolean) {
  if (typeof window === 'undefined') return;

  if (isPrivate) privateScopes.add(scope);
  else privateScopes.delete(scope);

  document.documentElement.dataset.metrikaScope = privateScopes.size ? 'private' : 'public';
  window.dispatchEvent(new Event('codetogether:analytics-scope'));
}
