import type { PillarEditorial } from './types';
import { wordCount } from './types';
import { aiCodingAgents } from './editorials/ai-coding-agents';
import { modelContextProtocol } from './editorials/model-context-protocol';
import { dpdpCompliance } from './editorials/dpdp-compliance';
import { localLlmCoding } from './editorials/local-llm-coding';

// Registry of completed long-form editorials. A pillar page is only
// considered publishable (indexable, in the sitemap, in llms surfaces) when
// a substantive editorial exists here — the single indexability policy that
// every public discovery surface shares.
export const REGISTRY: Record<string, PillarEditorial> = {
  [aiCodingAgents.pillarId]: aiCodingAgents,
  [modelContextProtocol.pillarId]: modelContextProtocol,
  [dpdpCompliance.pillarId]: dpdpCompliance,
  [localLlmCoding.pillarId]: localLlmCoding,
};

export function getEditorial(pillarId: string): PillarEditorial | undefined {
  return REGISTRY[pillarId];
}

// Publish bar: a pillar editorial is indexable only at substantive depth
// (>= MIN_EDITORIAL_WORDS). Shorter entries remain drafts: rendered with
// noindex and excluded from the sitemap until extended.
export const MIN_EDITORIAL_WORDS = 2000;

export function isContentIndexable(pillarId: string): boolean {
  const e = REGISTRY[pillarId];
  return Boolean(e) && wordCount(e) >= MIN_EDITORIAL_WORDS;
}

export function completedEditorialCount(): number {
  return Object.keys(REGISTRY).length;
}
