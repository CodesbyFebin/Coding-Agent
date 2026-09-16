import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const codingagentKnowledgeGraph: PillarEditorial = {
  "pillarId": "codingagent-knowledge-graph",
  "updated": "2026-09-24",
  "definition": "The interconnected ontology of 80 sovereign engineering pillars designed for human engineers and AI search engines — establishing authoritative domain concepts for agentic engineering without vague marketing buzzwords.",
  "sections": [
    {
      "heading": "Knowledge Graph Fundamentals",
      "paragraphs": [
        "The knowledge graph provides the interconnected ontology of sovereign engineering pillars, establishing authoritative domain concepts for both human engineers and AI search engines. The graph contains 80 pillars, each representing a distinct concept or capability within the agentic engineering discipline. The graph is designed to: avoid vague marketing buzzwords, provide precise technical definitions, and enable semantic search across the entire discipline. Each pillar is interconnected through relatedPillarIds, enabling traversal from one concept to related concepts.",
        "The knowledge graph serves multiple purposes: for human engineers, it provides a structured learning path through the discipline of agentic engineering; for AI search engines, it provides authoritative context and disambiguation; for the pillar directory, it serves as the single source of truth for all 80 pillars. The graph is stored as schema.org JSON-LD metadata, validated against JSON-LD standards, and made available through the /knowledge-graph route.",
        "Each pillar in the graph includes: a precise definition, related pillars (enabling navigation), search keywords (for SEO and search engine discovery), and a unique identifier (pillarId). The graph structure enables: semantic search (finding pillars by concept, not just keywords), navigation (traversing from one pillar to related pillars), and disambiguation (distinguishing between similar concepts through precise definitions and related connections)."
      ]
    },
    {
      "heading": "Graph Structure and Navigation",
      "paragraphs": [
        "The knowledge graph is a directed graph where each node is a pillar and each edge represents a relatedPillarId relationship. The graph is: connected (every pillar is reachable from any other pillar through a series of relatedPillarId hops), weighted (edges have weights based on the strength of the relationship: 'closely related', 'moderately related', 'loosely related'), and typed (edges have types: 'extends', 'complements', 'contrasts', 'depends-on'). This structured graph enables sophisticated navigation and search algorithms.",
        "Navigation algorithms include: breadth-first search (finding pillars within N hops of a starting pillar), shortest path (finding the minimal sequence of related pillars between two concepts), and centrality analysis (identifying the most influential pillars in the graph). These algorithms power the /pillars route's fuzzy search and category filtering functionality.",
        "The graph is continuously updated: new pillars are added as the discipline evolves, relatedPillarId relationships are reviewed and updated, and the schema.org JSON-LD metadata is regenerated. The graph's evolution is tracked through versioned metadata, enabling change detection and impact analysis."
      ]
    },
    {
      "heading": "Search Engine Optimization and Discoverability",
      "paragraphs": [
        "The knowledge graph is designed for search engine optimization: each pillar's schema.org JSON-LD metadata includes: precise type definitions (schema.org Person, Organization, or custom types for engineering concepts), authoritative descriptions ( concise, precise definitions without marketing language), search keywords (high-intent search terms that developers use), and interlinked relationships (enabling search engines to understand the graph structure and rank related content appropriately).",
        "The SEO benefits include: improved rankings for discipline-specific searches (e.g., 'sovereign AI coding agent', 'DPDP compliant coding agent'), rich search results (knowledge graph cards in search engine results), and entity disambiguation (search engines understanding the precise meaning of engineering concepts). The graph also enables: federated search across all 80 pillars, semantic query expansion (related concepts suggested by the graph), and entity-based ranking (ranking by authority within the discipline, not just keyword matching)."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is the knowledge graph?",
      "answer": "The interconnected ontology of 80 sovereign engineering pillars designed for human engineers and AI search engines, establishing authoritative domain concepts without vague marketing buzzwords."
    },
    {
      "question": "How many pillars are in the graph?",
      "answer": "80 pillars, each representing a distinct concept or capability within agentic engineering."
    },
    {
      "question": "How does the graph enable search?",
      "answer": "Through schema.org JSON-LD metadata with precise definitions, search keywords, and interlinked relationships. This enables semantic search, entity disambiguation, and improved rankings for discipline-specific searches."
    },
    {
      "question": "Can I navigate between related pillars?",
      "answer": "Yes. Each pillar includes relatedPillarId relationships enabling traversal from one concept to related concepts. Navigation algorithms include breadth-first search, shortest path, and centrality analysis."
    },
    {
      "question": "Is the graph updated over time?",
      "answer": "Yes. New pillars are added as the discipline evolves, relatedPillarId relationships are reviewed, and schema.org JSON-LD metadata is regenerated. Evolution is tracked through versioned metadata."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};