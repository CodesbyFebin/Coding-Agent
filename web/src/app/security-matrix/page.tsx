import type { Metadata } from 'next';
import { SecurityMatrixPage } from '../../features/knowledge/SecurityMatrixPage';
import { getPublicRoutes, getBase } from '../../lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const base = getBase();
  const r = getPublicRoutes().find((x) => x.path === '/security-matrix');
  return { title: r?.title, description: r?.description, alternates: { canonical: base + '/security-matrix' } };
}

export default function Page() {
  return <SecurityMatrixPage />;
}
