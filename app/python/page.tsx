import { ServiceLandingPage } from '@/components/service-landing-page';
import { servicePages } from '@/lib/service-pages';
import { createPageMetadata } from '@/lib/seo';

const page = servicePages.python;

export const metadata = createPageMetadata(page);

export default function PythonPage() {
  return <ServiceLandingPage page={page}/>;
}
