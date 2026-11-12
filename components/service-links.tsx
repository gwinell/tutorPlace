import { ArrowUpRight } from 'lucide-react';
import { serviceLinks } from '@/lib/service-links';

export function ServiceLinks() {
  return <section className="section container service-links-section" aria-labelledby="service-links-title" data-motion="reveal">
    <div className="section-heading">
      <div><span className="eyebrow">Направления занятий</span><h2 id="service-links-title">С чего начнём?</h2></div>
      <p>Python с нуля, школьная информатика, ОГЭ, ЕГЭ или МЦКО. Выбери цель и посмотри, как строятся занятия.</p>
    </div>
    <nav className="service-links-grid" aria-label="Направления занятий">
      {serviceLinks.map((service) => <a className="service-link-card" href={service.href} key={service.href}>
        <span>{service.label}</span><ArrowUpRight size={17} aria-hidden="true"/>
      </a>)}
    </nav>
  </section>;
}
