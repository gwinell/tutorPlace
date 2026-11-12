import { ArrowUpRight, Clock3, Video } from 'lucide-react';
import { serviceLinks } from '@/lib/service-links';
import type { ServicePageData } from '@/lib/service-pages';
import { SITE_URL } from '@/lib/seo';
import { TrialBookingButton } from '@/components/trial-booking-button';
import { ScrollReveals } from '@/components/scroll-reveals';
import { ServiceExample } from '@/components/service-example';

/* eslint-disable @next/next/no-img-element -- local WebP already has the right dimensions and needs no image runtime */
/* eslint-disable @next/next/no-html-link-for-pages -- public routes use full browser navigation because the client router can leave the URL unchanged */

function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function ServiceLandingPage({ page }: { page: ServicePageData }) {
  const canonical = new URL(page.path, SITE_URL).toString();
  const teacherId = `${SITE_URL}/#ruslan-gilmetdinov`;
  const personDescription = 'Руслан Гильметдинов — репетитор по информатике и Python, учится на третьем курсе прикладной информатики и изучает Data Science в Школе 21.';
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: page.label, item: canonical },
    ],
  };
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': teacherId,
        name: 'Руслан Гильметдинов',
        jobTitle: 'Репетитор по информатике и Python',
        image: `${SITE_URL}/tutor.webp`,
        description: personDescription,
      },
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: page.heading,
        serviceType: page.heading,
        description: page.focus,
        url: canonical,
        provider: { '@id': teacherId },
      },
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name: page.heading,
        description: page.lead,
        inLanguage: 'ru',
        mainEntity: { '@id': `${canonical}#service` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      { ...breadcrumb, '@id': `${canonical}#breadcrumb` },
    ],
  };
  const related = serviceLinks.filter((item) => item.href !== page.path);

  return <div className="marketing service-page">
    <ScrollReveals/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}/>
    <header className="site-header"><div className="container service-header-inner">
      <a className="brand" href="/" aria-label="codeTogether — главная">
        <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span><span>code<span className="brand-accent">Together</span><span className="brand-dot">.</span></span>
      </a>
      <nav className="service-header-nav" aria-label="Направления занятий">
        {serviceLinks.map((item) => <a href={item.href} aria-current={item.href === page.path ? 'page' : undefined} key={item.href}>{item.label}</a>)}
        <a href="/#pricing">Стоимость</a>
      </nav>
      <a className="button button-outline service-cabinet-link" href="/?view=cabinet">Личный кабинет</a>
    </div></header>

    <main>
      <nav className="container service-breadcrumbs" aria-label="Хлебные крошки">
        <a href="/">Главная</a><span aria-hidden="true">/</span><span aria-current="page">{page.label}</span>
      </nav>

      <section className="container service-hero">
        <div className="service-hero-copy">
          <span className="eyebrow"><span className="short-line"/>Индивидуальные онлайн-занятия</span>
          <h1>{page.heading}</h1>
          <p className="service-lead">{page.lead}</p>
          <div className="service-hero-facts">
            <span><Video size={16} aria-hidden="true"/>Онлайн, один на один</span>
            <span><Clock3 size={16} aria-hidden="true"/>55 минут</span>
          </div>
          <div className="service-hero-actions">
            <TrialBookingButton/>
            <a className="text-link" href="/#pricing">Посмотреть стоимость <ArrowUpRight size={15} aria-hidden="true"/></a>
          </div>
        </div>
        <aside className="service-teacher-card" aria-label="О преподавателе">
          <img src="/tutor-1024.webp" width={1024} height={682} alt="Руслан Гильметдинов, репетитор по информатике и Python" fetchPriority="high" decoding="async"/>
          <div><span className="eyebrow">Преподаватель</span><h2>Руслан Гильметдинов</h2><p>{personDescription}</p></div>
        </aside>
      </section>

      <section className="container service-section" aria-labelledby="service-topics-title" data-motion="reveal">
        <div className="service-section-heading"><span className="eyebrow">Содержание занятий</span><h2 id="service-topics-title">Что будем разбирать</h2><p>Темы подбираются под уровень ученика, цель и актуальные учебные материалы.</p></div>
        <div className="service-topic-grid">{page.topics.map((topic, index) => <article className="service-topic-card" key={topic.title}>
          <span className="service-topic-number">{String(index + 1).padStart(2, '0')}</span><h3>{topic.title}</h3><p>{topic.text}</p>
        </article>)}</div>
      </section>

      <ServiceExample example={page.example}/>

      <section className="service-process-band" data-motion="reveal">
        <div className="container service-section">
          <div className="service-section-heading"><span className="eyebrow">Как строится подготовка</span><h2>От цели — к практике</h2><p>{page.focus}.</p></div>
          <ol className="service-step-list">{page.steps.map((step, index) => <li key={step.title}>
            <span className="service-topic-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.text}</p></div>
          </li>)}</ol>
        </div>
      </section>

      <section className="container service-section service-faq-section" aria-labelledby="service-faq-title" data-motion="reveal">
        <div className="service-section-heading"><span className="eyebrow">Перед началом</span><h2 id="service-faq-title">Частые вопросы</h2></div>
        <div className="service-faq-list">{page.faqs.map((faq) => <details key={faq.question}>
          <summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p>
        </details>)}</div>
      </section>

      <section className="container service-section service-sources-section" aria-labelledby="service-sources-title" data-motion="reveal">
        <div className="service-section-heading"><span className="eyebrow">Материалы</span><h2 id="service-sources-title">На что опираемся</h2><p>Для подготовки используем проверяемые учебные и официальные источники.</p></div>
        <ul className="service-source-list">{page.sources.map((source) => <li key={source.href}>
          <a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}<ArrowUpRight size={16} aria-hidden="true"/></a><p>{source.note}</p>
        </li>)}</ul>
      </section>

      <section className="container service-related-section" aria-labelledby="service-related-title" data-motion="reveal">
        <div><span className="eyebrow">Другие направления</span><h2 id="service-related-title">Занятия по информатике и программированию</h2></div>
        <nav className="service-related-links" aria-label="Другие направления занятий">{related.map((item) => <a href={item.href} key={item.href}>{item.label}<ArrowUpRight size={15} aria-hidden="true"/></a>)}</nav>
      </section>

      <section className="container service-final-cta" data-motion="reveal">
        <div><span className="eyebrow">Пробный урок · 45 минут</span><h2>Обсудим цель и план занятий</h2><p>Познакомимся, разберём вопрос ученика и решим, с чего начать.</p></div>
        <TrialBookingButton label="Записаться на пробный урок"/>
      </section>
    </main>

    <footer className="container footer service-footer">
      <div><a className="brand" href="/"><span className="brand-mark" aria-hidden="true">&lt;/&gt;</span><span>code<span className="brand-accent">Together</span><span className="brand-dot">.</span></span></a><p>Репетитор по информатике и Python. Индивидуальные онлайн-занятия.</p></div>
      <nav className="footer-links" aria-label="Ссылки сайта"><a href="/">Главная</a><a href="/#pricing">Стоимость</a><a href="/offer">Оферта</a><a href="/privacy">Обработка данных</a></nav>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} codeTogether · Руслан Гильметдинов</span><span>Информация о форматах занятий размещена на сайте.</span></div>
    </footer>
  </div>;
}
