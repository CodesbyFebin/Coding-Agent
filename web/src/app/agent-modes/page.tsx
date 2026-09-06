import type { Metadata } from 'next';
import { AgentModesPage } from '../../features/knowledge/AgentModesPage';
import { getPublicRoutes, getBase } from '../../lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const base = getBase();
  const r = getPublicRoutes().find((x) => x.path === '/agent-modes');
  return { title: r?.title, description: r?.description, alternates: { canonical: base + '/agent-modes' } };
}

export default function Page() {
  return <AgentModesPage />;
}
