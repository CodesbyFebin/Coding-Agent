import type { Metadata } from 'next';
import { PillarsDirectoryPage } from '../../features/pillars/PillarsDirectoryPage';
import { getPublicRoutes, getBase } from '../../lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const base = getBase();
  const r = getPublicRoutes().find((x) => x.path === '/pillars');
  return { title: r?.title, description: r?.description, alternates: { canonical: base + '/pillars' } };
}

export default function Page() {
  return <PillarsDirectoryPage />;
}
