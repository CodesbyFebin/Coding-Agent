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
    {
      heading: 'Debugging MCP connections in practice',
      paragraphs: [
        'Most MCP failures fit a short list of patterns, and each has a deterministic diagnostic path. A server that never answers the handshake is usually an executable-path or environment problem: run the same command in a plain terminal, check stderr, and confirm the binary and its runtime dependencies exist inside the sandbox the agent uses, which is often narrower than your shell. A connection that works and then dies mid-session is a lifecycle problem: long-running stdio servers get killed by OOM, block on a prompt written to stdout, or corrupt the JSON-RPC framing by printing logs into the protocol stream. The fixes are mechanical: logs to stderr, heartbeats with restart backoff, and buffer limits in both directions.',
        'Timeouts on remote transports add network diagnostics: verify TLS, authentication token expiry and proxy behavior in that order, because a silently expiring bearer token looks exactly like a hung server. For capability surprises, a tool that was callable yesterday and missing today, compare the current manifest against the version recorded in the audit ledger; servers that change capabilities without version bumps are the most common source of silent agent degradation, and manifest diffing turns that from a mystery into a review comment.',
        'The resilience pillar packages these patterns into self-healing defaults: health probes before dispatch, automatic reconnection with exponential backoff, and connection state surfaced in the operator interface rather than buried in logs. An agent that quietly loses its database tools and keeps improvising is worse than one that stops loudly; recovery should be visible.',
      ],
    },
    {
      heading: 'Where MCP sits in the CodingAgent architecture',
      paragraphs: [
        'MCP is one of two tool paths in the runtime, not a replacement for the native layer. Filesystem, git and shell primitives remain native and sandboxed for latency and audit tightness; MCP carries the long tail of internal services, third-party SaaS and experimental tooling through one governed interface. Both paths converge on the same policy engine, the same taint tracking and the same audit ledger, so a tool\u2019s transport never changes its authority.',
        'The bidirectional story matters for teams scaling agent programs: CodingAgent can also expose governed capabilities as an MCP server, which turns a reviewed, verified agent workflow into something an IDE assistant or CI pipeline can invoke. Capability tokens and mutual authentication bound what external callers may reach, keeping the mesh useful without becoming an unauthenticated remote-procedure free-for-all.',
      ],
    },
    {
      heading: 'A security review checklist for MCP servers',
      paragraphs: [
        'Treat every MCP server, internal or third-party, as privileged software under review. The checklist below is the minimum bar before a server enters any shared routing policy, and each item is phrased so it can be checked mechanically rather than argued.',
      ],
      bullets: [
        'Provenance and versioning: the server ships from a known source, pins its dependencies, and publishes a versioned capability manifest; unreproducible builds are rejected.',
        'Least privilege: the server runs with scoped credentials for exactly the resources it declares, never a standing admin token, and credentials rotate on a schedule.',
        'Schema strictness: every tool declares complete JSON-Schema input contracts, and unknown or under-specified tools are treated as DENY until reviewed.',
        'Output hygiene: responses are size-bounded, secret patterns are redacted before results enter model context, and structured errors replace raw stack traces.',
        'Namespace isolation: tool names cannot shadow core safety tools or other servers\u2019 registrations, and capability intersections are recomputed on every version change.',
        'Auditability: every invocation, decision and manifest version lands in the tamper-evident ledger, with the server\u2019s identity attached.',
        'Behavioral tests: contract tests over schemas, negative tests for malformed arguments, and policy tests proving the effective capability set matches intent per role.',
      ],
    },
    {
      heading: 'Review cadence and supply-chain discipline',
      paragraphs: [
        'Apply the same review cadence as any supply-chain dependency: re-review on version bumps, watch for capability additions that arrive without review, and remove servers that fail re-validation. The defense matters because a malicious or compromised server sits inside the trust boundary with model attention as its amplifier; the intersect-and-record model exists precisely so that one bad server cannot reach tools policy never granted.',
      ],
    },
    {
      heading: 'MCP in evaluation, testing and team workflow',
      paragraphs: [
        'Because MCP standardizes the tool boundary, it also standardizes how agents are tested against tools. A repository of contract fixtures, one fixture set per server version, lets CI replay every tool the policy allows with representative arguments and assert both the results and the policy decisions. That turns agent upgrades from hopeful re-tests into regression suites: pin the manifest, replay the fixtures, diff the decisions. Teams adopting this pattern find that most agent regressions are tool-layer events, a schema changed, a response shape drifted, a capability moved, and the fixture suite catches them before any mission does.',
        'In daily workflow, the MCP surface changes how engineers think about tooling investments. An integration written once as a server is instantly available to every agent surface, IDE, CLI, CI and the web cockpit, so the build-vs-buy conversation shifts from per-agent connectors to organizational capability. The practical governance loop that keeps it healthy: propose the server with its manifest, review the effective capability set per role, run the fixtures, register the endpoints with jurisdictions, and let the audit ledger report usage. Teams that skip the review step inherit the risk; teams that keep it get an integration fabric that grows without becoming an unmanaged attack surface.',
        'For teams starting now, the sequence is deliberately boring: pick one real workflow, often ticket triage or schema lookup; expose the smallest useful read-only server; prove the policy intersection and fixture suite; then grow the capability set one reviewed tool at a time. MCP rewards incremental governance precisely because the protocol was designed for capability negotiation rather than blanket trust.',
      ],
    },
  ],
  faq: [
    {
      question: 'What is the Model Context Protocol in one sentence?',
      answer:
        'An open, JSON-RPC-based standard through which AI agents discover and invoke external tools, resources and prompts with schema-validated, policy-governed, auditable calls.'
    },
    {
      question: 'How many MCP servers can one agent use at once?',
      answer:
        'As many as policy allows, each in its own namespace. The practical limit is attention and review discipline rather than the protocol: the effective capability set should stay small enough that operators can actually reason about it, and the audit ledger will show which servers earn their place.'
    },
    {
      question: 'Does MCP work for read-only introspection as well as actions?',
      answer:
        'Yes. Resources and read-only tools are first-class primitives, and schema lookup, documentation search or dependency-graph queries are often the highest-value, lowest-risk first integrations for a team.'
    },
    {
      question: 'What happens when two servers expose overlapping tools?',
      answer:
        'Namespace isolation keeps them distinct, and the policy layer decides which is callable in each context. Overlaps are a review signal, not a runtime conflict, because the effective capability set is computed, not assumed.'
    },
    {
      question: 'Is MCP suitable for streaming or long-running operations?',
      answer:
        'Yes, with engineering care: progress notifications and chunked outputs exist for long operations, and the resilience layer, heartbeats, backoff and buffer limits, exists precisely for servers that take minutes rather than milliseconds.'
    },
    {
      question: 'How does MCP relate to agent memory and context management?',
      answer:
        'Tool outputs become part of model context, which makes MCP a context-management concern as much as an integration one: size-bounded responses, summarized large results and redaction keep the capability fabric from consuming the window the reasoning actually needs.'
    },
    {
      question: 'Can one MCP server serve multiple agents with different permissions?',
      answer:
        'Yes, and that is the recommended pattern: the server declares capabilities once while each agent\u2019s policy layer computes its own effective set, so a read-only CI agent and a privileged operator agent can share the same server safely.'
    },
    {
      question: 'How do I version an MCP server safely?',
      answer:
        'Publish a versioned capability manifest with every release, run contract fixtures against each version, and require manifest diffs in review; agents then recompute the policy intersection on version change instead of inheriting silent capability drift.'
    },
    {
      question: 'What does a well-behaved MCP error look like?',
      answer:
        'A structured, bounded message the agent can act on: which argument failed which schema constraint, and what a valid shape would be. Raw stack traces and unbounded dumps are treated as hygiene failures because they waste context and can leak internals.'
    },
    {
      question: 'Is MCP only for large organizations?',
      answer:
        'No. A two-person team benefits the first time one integration, say a schema lookup server, serves both an IDE assistant and a CI reviewer. The protocol removes per-agent connector work regardless of scale.'
    },
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
