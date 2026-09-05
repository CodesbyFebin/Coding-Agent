import type { PillarEditorial } from '../types';

export const modelContextProtocol: PillarEditorial = {
  pillarId: 'model-context-protocol',
  updated: '2026-09-06',
  definition:
    'The Model Context Protocol (MCP) is an open standard that connects AI assistants and agents to external data sources, tools and environments through a typed, auditable interface. Instead of hand-wiring every integration, an agent discovers what an MCP server exposes — tools, prompts, resources — over a JSON-RPC session, negotiates capabilities, and invokes them with schema-validated arguments. CodingAgent.in treats MCP as a governed capability layer: discovery tells you what is possible, but effective access is the intersection of declared capabilities, agent scope, project policy and operator approval.',
  sections: [
    {
      heading: 'Why a protocol, and not just more plugins',
      paragraphs: [
        'Before MCP, every agent-to-tool integration was a bespoke adapter: the agent vendor defined a function-calling format, and each tool author wrote a connector against it. The result was N×M duplication, inconsistent schemas, and no common story for authentication, permissions or auditing. MCP replaces that matrix with one client-side contract and one server-side contract, so a database, a design tool or an internal compiler service can be exposed once and consumed by any MCP-capable agent.',
        'The protocol models three primitives. Tools are executable functions with JSON-Schema input contracts — run a query, render a diagram, create a ticket. Resources are addressable content the agent can read — files, documents, database schemas. Prompts are reusable, parameterized templates. Because all three travel over a standardized JSON-RPC session (stdio for local processes, HTTP-based transports for remote services), the agent\u2019s tool surface becomes discoverable, testable and policy-checkable as a whole.',
        'For engineering teams the practical consequence is composability: a governed internal MCP server that exposes your build system, ticket tracker and schema registry instantly becomes available to every agent in the organization, with one place to enforce authentication, redaction and rate limits.',
      ],
    },
    {
      heading: 'How a governed MCP session works',
      paragraphs: [
        'A CodingAgent MCP session follows a discovery-then-contract pattern. The agent launches or connects to the server over the configured transport, performs the protocol handshake, and receives the server\u2019s capability manifest. Each declared tool is then evaluated against policy before it ever appears callable to the model.',
      ],
      bullets: [
        'Discovery — enumerate tools, prompts and resources; record the server version and capability manifest for the audit log.',
        'Policy intersection — for each tool, intersect what the server offers with what the agent\u2019s mode allows and what project policy permits; the result is the effective capability set.',
        'Schema validation — every invocation\u2019s arguments are validated against the tool\u2019s JSON Schema before dispatch; malformed calls die at the boundary, not inside your infrastructure.',
        'Execution with taint tracking — outputs from MCP servers are treated as untrusted input: sanitized before model ingestion and traced so tainted data cannot flow into privileged calls.',
        'Decision recording — every ALLOW, ASK and DENY decision is written to the audit ledger with the manifest version, so capability drift between servers is visible in review.',
      ],
    },
    {
      heading: 'The intersection rule: why governance works',
      paragraphs: [
        'The intersection rule is the core of governance. A database MCP server may declare db.query, db.describe_tables, db.alter_table and db.drop_table; policy may allow the first two read-only on staging and deny the destructive pair outright. The model never faces the denied tools as options, which removes an entire class of prompt-injection risk: an instruction cannot call a tool that is not in the effective set.',
      ],
    },
    {
      heading: 'Transports: stdio for local, HTTP for remote',
      paragraphs: [
        'MCP\u2019s stdio transport runs the server as a local subprocess — zero network surface, OS-level process isolation, and the lowest latency available, which makes it the right default for filesystem, git and build-tool servers on a developer machine. Remote transports (streamable HTTP and, historically, SSE) connect agents to shared team services: a schema registry, a ticketing integration, a documentation server used by dozens of engineers.',
        'Each transport has failure modes worth engineering for. Local stdio servers crash, hang, or flood stdout; resilience means heartbeat health checks, restart with backoff, and buffer discipline so a chatty server cannot starve the agent\u2019s context. Remote servers add authentication, token rotation and network egress policy to the checklist — and secrets must be brokered at connection time, never placed in model-visible context. The MCP connection-resilience pillar documents the diagnostic playbooks for timeouts and crashes.',
      ],
    },
    {
      heading: 'Building your own MCP integrations',
      paragraphs: [
        'The highest-leverage MCP work in most organizations is exposing what already exists: the internal compiler service, the deploy gate, the incident tracker. The recipe is consistent — define a narrow tool set with strict JSON-Schema inputs, return structured, size-bounded outputs, and fail with actionable error messages the agent can act on. Every tool should declare its side-effect class (read, write, external) so policy has something deterministic to evaluate.',
        'Test MCP servers like you test APIs: contract tests over the schema for every tool, negative tests for malformed arguments, and policy tests asserting that the effective capability set matches the intended one for each role. Version the server and publish the manifest diff with each release — agents and their operators should see capability changes in review, not discover them at runtime.',
      ],
    },
    {
      heading: 'Security posture for MCP in production',
      paragraphs: [
        'An MCP server is privileged software. It runs with credentials, sees sensitive payloads, and its outputs flow into model context where they can influence code. The hardening baseline: least-privilege credentials per server, namespace isolation so one server cannot shadow another\u2019s tools, output size limits and secret redaction before results enter model context, and immutable audit logs for every invocation. Treat third-party MCP servers with the same supply-chain scrutiny as npm dependencies — provenance, versioning, and periodic re-review of their declared capabilities.',
      ],
    },
  ],
  faq: [
    {
      question: 'What is the Model Context Protocol in one sentence?',
      answer:
        'An open, JSON-RPC-based standard through which AI agents discover and invoke external tools, resources and prompts with schema-validated, policy-governed, auditable calls.',
    },
    {
      question: 'How does MCP differ from ordinary function calling?',
      answer:
        'Function calling is an agent-vendor format for describing callable functions to a model. MCP is a transport- and vendor-neutral protocol for discovering, negotiating, executing and auditing those capabilities across many tools and agents — with policy evaluation as a first-class step.',
    },
    {
      question: 'Which transport should a local coding agent use?',
      answer:
        'stdio for local tools such as filesystem, git and build servers — it is a local subprocess with no network surface and minimal latency. Use HTTP-based transports for shared team services, and pair them with authentication and egress policy.',
    },
    {
      question: 'Can MCP tools access data the agent should not see?',
      answer:
        'Only if policy allows it. The effective capability set is the intersection of server capabilities, agent mode and project policy; destructive or sensitive tools can be excluded from that set entirely, so the model never sees them as callable options.',
    },
    {
      question: 'How do I stop a misbehaving MCP server from polluting the agent?',
      answer:
        'Treat server output as untrusted input: sanitize before model ingestion, bound output sizes, redact secrets, taint-track flows, and record every decision in the audit ledger so anomalies are visible in review.',
    },
  ],
  sources: [
    { label: 'Model Context Protocol specification', href: 'https://modelcontextprotocol.io/' },
    { label: 'CodingAgent MCP security pillar', href: '/mcp-security' },
    { label: 'MCP transport pillar', href: '/mcp-transport' },
  ],
};
