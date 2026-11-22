import Application from '@/components/application';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  path: '/',
  title: 'TutorPlace — найдите своего репетитора',
  description: 'Каталог репетиторов разных направлений, индивидуальные онлайн-занятия и личное пространство для учёбы.',
});

export default function Page(){return <Application/>;}
