import { getPublicRoutes, getBase } from '../lib/site';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBase();
  const today = new Date().toISOString().slice(0, 10);
  return getPublicRoutes().map((r) => ({
    url: `${base}${r.path}`,
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: r.path === '/' ? 1.0 : 0.7,
  }));
}
