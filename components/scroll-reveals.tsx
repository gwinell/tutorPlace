'use client';

import { useEffect } from 'react';

export function ScrollReveals() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-motion="reveal"]'));
    if (!targets.length || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.motionVisible = 'true';
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    root.classList.add('motion-ready');
    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      root.classList.remove('motion-ready');
      targets.forEach((target) => delete target.dataset.motionVisible);
    };
  }, []);

  return null;
}
