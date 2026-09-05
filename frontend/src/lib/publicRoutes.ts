import { ALL_PILLARS } from '../data/pillarsData';
import { getEditorial, isContentIndexable } from '../content/registry';

// Single source of truth for the public knowledge surface: route inventory,
// per-route metadata and indexability, shared by the PillarDetailPage, the
// prerender script and the sitemap/llms generators.

export const SITE_TITLE =
  'CodingAgent.in — Sovereign AI Coding Agents & Agentic Engineering';
export const SITE_DESCRIPTION =
  'CodingAgent.in is a sovereign, open-source, local-LLM-first agentic engineering platform for AI coding agents, MCP-native tooling, and verification-first workflows.';

const BASE = 'https://codingagent.in';

export interface PublicRoute {
  path: string;
  title: string;
  description: string;
  pillarId?: string;
  /** False only for template-only pillar pages pending editorial completion. */
  indexable: boolean;
}

const KNOWLEDGE_PAGES: PublicRoute[] = [
  {
    path: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    indexable: true,
  },
  {
    path: '/pillars',
    title:
      'Pillar Directory — 80 Architectural Pillars of Agentic Engineering | CodingAgent.in',
    description:
      'The CodingAgent.in knowledge graph: 80 architectural pillars of agentic engineering across agents, MCP, local LLMs, security, verification, enterprise tooling and India-first solutions — with long-form editorials added continuously.',
    indexable: true,
  },
  {
    path: '/platform',
    title: 'Platform — Build Agents Like Production Systems | CodingAgent.in',
    description:
      'CodingAgent.in treats an AI coding agent as a controlled engineering runtime: context, model policy, tools, workspaces, memory, permissions, evidence and independent verification are explicit components.',
    indexable: true,
  },
  {
    path: '/agent-modes',
    title:
      'Agent Modes — Plan, Code, Debug, Review, Security, Ask | CodingAgent.in',
    description:
      'Six governed agent modes for agentic engineering: Plan decomposes goals into task DAGs, Code synthesizes surgical diffs, Debug verifies hypotheses with tests, Review audits independently, Security hunts CVEs, and Ask explains without writing.',
    indexable: true,
  },
  {
    path: '/local-runtimes',
    title:
      'Local LLM Runtimes — Ollama, vLLM, llama.cpp, LM Studio | CodingAgent.in',
    description:
      'Local-LLM-first coding agents: run Ollama, vLLM, llama.cpp and LM Studio as first-class inference targets for private repositories, offline work, air-gapped environments and hardware-aware routing.',
    indexable: true,
  },
  {
    path: '/security-matrix',
    title:
      'Security Matrix — ALLOW / ASK / DENY Policy Posture | CodingAgent.in',
    description:
      'Autonomy without unbounded authority: the CodingAgent.in permission matrix showing ALLOW, ASK and DENY postures for filesystem, network, git, deploy, database, shell and secrets capabilities — with rationale and mitigation for each.',
    indexable: true,
  },
  {
    path: '/faq',
    title: 'FAQ — Sovereign AI Coding Agents | CodingAgent.in',
    description:
      'Frequently asked questions about CodingAgent.in: what an AI coding agent is, local-LLM-first architecture, MCP governance, agent security posture, and what is honestly live versus architectural direction.',
    indexable: true,
  },
];

function pillarRoute(pillarId: string): PublicRoute | undefined {
  const pillar = ALL_PILLARS.find((p) => p.id === pillarId);
  if (!pillar || pillar.external || !pillar.href.startsWith('/')) {
    return undefined;
  }
  const editorial = getEditorial(pillarId);
  return {
    path: pillar.href,
    pillarId,
    title: `${pillar.label} | CodingAgent.in — Governed AI Coding Agents`,
    description: editorial?.definition ?? pillar.description,
    indexable: isContentIndexable(pillarId),
  };
}

/** Every pillar route, indexable or not (prerender needs them all). */
export function getAllPillarRoutes(): PublicRoute[] {
  return ALL_PILLARS.filter(
    (p) => !p.external && p.href.startsWith('/') && p.href !== '/pillars'
  )
    .map((p) => pillarRoute(p.id))
    .filter((r): r is PublicRoute => Boolean(r));
}

/** Indexable routes only — the sitemap, llms and prerender-index set. */
export function getPublicRoutes(): PublicRoute[] {
  return [...KNOWLEDGE_PAGES, ...getAllPillarRoutes().filter((r) => r.indexable)];
}

export function getBase(): string {
  return BASE;
}
