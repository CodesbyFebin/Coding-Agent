import type { PillarEditorial } from './types';
import { aiCodingAgents } from './editorials/ai-coding-agents';
import { modelContextProtocol } from './editorials/model-context-protocol';

// Registry of completed long-form editorials. A pillar page is only
// considered publishable (indexable, in the sitemap, in llms surfaces) when
// a substantive editorial exists here — the single indexability policy that
// every public discovery surface shares.
export const REGISTRY: Record<string, PillarEditorial> = {
  [aiCodingAgents.pillarId]: aiCodingAgents,
  [modelContextProtocol.pillarId]: modelContextProtocol,
};

export function getEditorial(pillarId: string): PillarEditorial | undefined {
  return REGISTRY[pillarId];
}

export function isContentIndexable(pillarId: string): boolean {
  return pillarId in REGISTRY;
}

export function completedEditorialCount(): number {
  return Object.keys(REGISTRY).length;
}
