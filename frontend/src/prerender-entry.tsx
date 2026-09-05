import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { AppRoutes } from './routes';
import {
  getPublicRoutes,
  getAllPillarRoutes,
  getBase,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from './lib/publicRoutes';
import { REGISTRY } from './content/registry';
import { ALL_PILLARS } from './data/pillarsData';

// Build-time prerender entry. Renders public routes to static HTML so the
// deployed page ships full content in the initial response, and exports the
// shared route inventory for the sitemap/llms generators. Invoked only by
// scripts/prerender.mjs — never part of the client bundle.
export function render(url: string): string {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} resetCSS>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export function getEditorialDetails() {
  return Object.values(REGISTRY).map((e) => {
    const pillar = ALL_PILLARS.find((p) => p.id === e.pillarId);
    return {
      path: pillar?.href ?? '',
      title: pillar?.label ?? e.pillarId,
      updated: e.updated,
      definition: e.definition,
      sections: e.sections,
      faq: e.faq,
      sources: e.sources,
    };
  });
}

export {
  getPublicRoutes,
  getAllPillarRoutes,
  getBase,
  SITE_TITLE,
  SITE_DESCRIPTION,
};
