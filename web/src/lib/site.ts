export {
  getPublicRoutes,
  getAllPillarRoutes,
  getBase,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from '../../../frontend/src/lib/publicRoutes';
import { ALL_PILLARS } from '../../../frontend/src/data/pillarsData';
import { getBase } from '../../../frontend/src/lib/publicRoutes';

export function pillarBySlug(slug: string) {
  return ALL_PILLARS.find((p) => p.href === `/${slug}`) ?? null;
}

export function pillarStaticParams() {
  const base = getBase();
  return ALL_PILLARS.filter((p) => !p.external && p.href.startsWith('/') && p.href !== '/pillars').map(
    (p) => ({ slug: p.href.replace(/^\//, '') })
  );
}

export function pillarMetadata(slug: string) {
  const base = getBase();
  const pillar = pillarBySlug(slug);
  if (!pillar) {return {};}
  const isDraft = !isIndexable(pillar.id);
  return {
    title: `${pillar.label} | CodingAgent.in — Governed AI Coding Agents`,
    description: pillar.description,
    alternates: { canonical: `${base}${pillar.href}` },
    robots: isDraft ? { index: false, follow: true } : { index: true, follow: true },
  };
}

// Keep the publish bar in one place: reuse the frontend registry policy.
import { isContentIndexable } from '../../../frontend/src/content/registry';
function isIndexable(pillarId: string): boolean {
  return isContentIndexable(pillarId);
}
