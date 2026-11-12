import Application from '@/components/application';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  path: '/',
  title: 'codeTogether — репетитор по информатике и Python',
  description: 'Индивидуальные онлайн-занятия по информатике и Python с Русланом Гильметдиновым. Подготовка к школьным темам и экзаменам, основы программирования и проекты. Пробный урок — 45 минут.',
});

export default function Page(){return <Application/>;}
