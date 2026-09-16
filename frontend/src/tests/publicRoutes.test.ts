import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../content/registry';
import { getAllPillarRoutes, getPublicRoutes } from '../lib/publicRoutes';

describe('public SEO routes', () => {
  it('exposes one canonical route for every publish-ready editorial', () => {
    const pillarRoutes = getAllPillarRoutes();
    const routeIds = new Set(pillarRoutes.map((route) => route.pillarId));

    expect(pillarRoutes).toHaveLength(35);
    expect(routeIds.size).toBe(35);
    for (const pillarId of Object.keys(REGISTRY)) {
      expect(routeIds.has(pillarId)).toBe(true);
    }
  });

  it('publishes 7 fixed knowledge routes plus 35 editorial routes', () => {
    const routes = getPublicRoutes();
    expect(routes).toHaveLength(42);
    expect(new Set(routes.map((route) => route.path)).size).toBe(42);
  });
});
