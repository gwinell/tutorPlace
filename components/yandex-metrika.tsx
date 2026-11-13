'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

const COUNTER_ID = 114240976;
const PUBLIC_PATHS = new Set([
  '/',
  '/python',
  '/oge-informatika',
  '/ege-informatika',
  '/mcko-informatika',
  '/offer',
  '/privacy',
]);

type Metrika = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };

declare global {
  interface Window {
    ym?: Metrika;
    dataLayer?: unknown[];
  }
}

function subscribe(listener: () => void) {
  window.addEventListener('popstate', listener);
  window.addEventListener('codetogether:navigate', listener);
  window.addEventListener('codetogether:analytics-scope', listener);
  return () => {
    window.removeEventListener('popstate', listener);
    window.removeEventListener('codetogether:navigate', listener);
    window.removeEventListener('codetogether:analytics-scope', listener);
  };
}

function snapshot() {
  return `${window.location.pathname}${window.location.search}|${document.documentElement.dataset.metrikaScope || 'public'}`;
}

function serverSnapshot() {
  return '/|public';
}

function installTag() {
  window.dataLayer ||= [];
  if (!window.ym) {
    const ym: Metrika = (...args) => {
      (ym.a ||= []).push(args);
    };
    ym.a = [];
    ym.l = Date.now();
    window.ym = ym;

    const tagUrl = `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}`;
    const existing = [...document.scripts].some((script) => script.src === tagUrl);
    if (!existing) {
      const script = document.createElement('script');
      script.async = true;
      script.src = tagUrl;
      document.head.appendChild(script);
    }
  }
}

export default function YandexMetrika() {
  const locationAndScope = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const active = useRef(false);
  const lastCountedLocation = useRef('');
  const previousUrl = useRef('');

  useEffect(() => {
    const separator = locationAndScope.lastIndexOf('|');
    const location = locationAndScope.slice(0, separator);
    const scope = locationAndScope.slice(separator + 1);
    const current = new URL(location, window.location.origin);
    const isPublic = PUBLIC_PATHS.has(current.pathname)
      && !current.searchParams.has('demo')
      && current.searchParams.get('view') !== 'cabinet'
      && scope !== 'private';

    if (!isPublic) {
      if (active.current) window.ym?.(COUNTER_ID, 'destruct');
      active.current = false;
      return;
    }

    installTag();
    const ym = window.ym;
    if (!ym) return;

    const url = window.location.href;
    const referer = previousUrl.current || document.referrer;
    if (!active.current) {
      ym(COUNTER_ID, 'init', {
        ssr: true,
        defer: true,
        webvisor: true,
        clickmap: true,
        ecommerce: 'dataLayer',
        referrer: referer,
        url,
        accurateTrackBounce: true,
        trackLinks: true,
      });
      active.current = true;
    }
    if (lastCountedLocation.current !== location) {
      ym(COUNTER_ID, 'hit', url, { referer: previousUrl.current || document.referrer });
      lastCountedLocation.current = location;
    }

    previousUrl.current = url;
  }, [locationAndScope]);

  return null;
}
