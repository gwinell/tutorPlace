import { ServiceLandingPage } from '@/components/service-landing-page';
import { servicePages } from '@/lib/service-pages';
import { createPageMetadata } from '@/lib/seo';

const page = servicePages.ege;

export const metadata = createPageMetadata(page);

export default function EgeInformaticsPage() {
  return <ServiceLandingPage page={page}/>;
}
