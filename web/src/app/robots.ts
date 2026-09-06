import { getBase } from '../lib/site';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/register', '/settings', '/projects', '/missions', '/api/'],
      },
    ],
    sitemap: getBase() + '/sitemap.xml',
  };
}
