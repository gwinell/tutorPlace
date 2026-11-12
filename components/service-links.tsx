import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { serviceLinks } from '@/lib/service-links';

export function ServiceLinks() {
  return <section className="section container service-links-section" aria-labelledby="service-links-title">
    <div className="section-heading">
      <div><span className="eyebrow">Направления занятий</span><h2 id="service-links-title">Выбрать тему</h2></div>
      <p>Отдельно о занятиях по Python и подготовке по информатике.</p>
    </div>
    <nav className="service-links-grid" aria-label="Направления занятий">
      {serviceLinks.map((service) => <Link className="service-link-card" href={service.href} key={service.href}>
        <span>{service.label}</span><ArrowUpRight size={17} aria-hidden="true"/>
      </Link>)}
    </nav>
  </section>;
}
