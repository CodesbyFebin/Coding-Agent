import type { Metadata } from 'next';
import { FaqPage } from '../../features/knowledge/FaqPage';
import { getPublicRoutes, getBase } from '../../lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const base = getBase();
  const r = getPublicRoutes().find((x) => x.path === '/faq');
  return { title: r?.title, description: r?.description, alternates: { canonical: base + '/faq' } };
}

export default function Page() {
  return <FaqPage />;
}
