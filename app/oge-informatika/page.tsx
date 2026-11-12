import { ServiceLandingPage } from '@/components/service-landing-page';
import { servicePages } from '@/lib/service-pages';
import { createPageMetadata } from '@/lib/seo';

const page = servicePages.oge;

export const metadata = createPageMetadata(page);

export default function OgeInformaticsPage() {
  return <ServiceLandingPage page={page}/>;
}
