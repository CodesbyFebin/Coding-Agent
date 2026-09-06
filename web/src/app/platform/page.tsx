import type { Metadata } from 'next';
import { PlatformPage } from '../../features/knowledge/PlatformPage';
import { getPublicRoutes, getBase } from '../../lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const base = getBase();
  const r = getPublicRoutes().find((x) => x.path === '/platform');
  return { title: r?.title, description: r?.description, alternates: { canonical: base + '/platform' } };
}

export default function Page() {
  return <PlatformPage />;
}
