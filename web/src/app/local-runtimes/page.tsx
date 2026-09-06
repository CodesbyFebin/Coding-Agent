import type { Metadata } from 'next';
import { LocalRuntimesPage } from '../../features/knowledge/LocalRuntimesPage';
import { getPublicRoutes, getBase } from '../../lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const base = getBase();
  const r = getPublicRoutes().find((x) => x.path === '/local-runtimes');
  return { title: r?.title, description: r?.description, alternates: { canonical: base + '/local-runtimes' } };
}

export default function Page() {
  return <LocalRuntimesPage />;
}
