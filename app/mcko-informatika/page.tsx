import { ServiceLandingPage } from '@/components/service-landing-page';
import { servicePages } from '@/lib/service-pages';
import { createPageMetadata } from '@/lib/seo';

const page = servicePages.mcko;

export const metadata = createPageMetadata(page);

export default function MckoInformaticsPage() {
  return <ServiceLandingPage page={page}/>;
}
