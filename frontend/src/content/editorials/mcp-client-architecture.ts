import type { PillarEditorial } from '../types';

// Batch-converted editorial. Claim-audited; publish bar decides.
export const mcpClientArchitecture: PillarEditorial = {
  "pillarId": "mcp-client-architecture",
  "updated": "2026-09-06",
  "definition": "The agent-side client implementation that discovers, negotiates, scopes, and governs tools exposed by external MCP servers through a four-stage pipeline: discover, scope, authorize, execute.",
  "sections": [
    {
      "heading": "Understanding the MCP Client Role",
      "paragraphs": [
        "The MCP client is the component within CodingAgent that connects to external MCP servers and makes their tools available to agents. It serves as the bridge between the agent's need for external capabilities and the governed, secure access to those capabilities. The client doesn't just pass through tool calls—it actively manages the entire lifecycle of tool discovery, capability negotiation, permission enforcement, and execution governance.",
        "The client architecture is designed around four core responsibilities: discovery (finding what tools are available from connected servers), scoping (determining which tools are appropriate for the current agent and mission), authorization (enforcing permission policies on each invocation), and execution (dispatching tool calls within sandboxed environments). Each responsibility is handled by a dedicated subsystem that works in coordination with the others.",
        "The client maintains a registry of connected servers, each with its own manifest of capabilities. When an agent requests a tool, the client looks up which server provides it, checks the permission policy, and dispatches the invocation. This indirection layer is essential for governance—it ensures that no tool invocation can bypass the permission system, even if the agent or server is compromised.",
        "Connection management is sophisticated: the client handles reconnection after failures, heartbeats to detect unresponsive servers, and graceful degradation when servers become unavailable. Connection state is surfaced in the operator interface for visibility, enabling operators to monitor the health of external integrations and respond to issues before they impact agent missions."
      ]
    },
    {
      "heading": "The Four-Stage Pipeline",
      "paragraphs": [
        "Every tool invocation flows through a four-stage pipeline that ensures governance and security at each step. This pipeline is the core of the client architecture and cannot be bypassed.",
        "**Stage 1: Discovery** - The client queries connected MCP servers for their available tools, resources, and prompts. Each server responds with a manifest that lists capabilities with their schemas, descriptions, and metadata. The client validates these manifests for schema correctness and builds an internal registry of available capabilities. Discovery happens at connection time and is refreshed periodically to detect changes.",
        "**Stage 2: Scoping** - Not all tools a server offers are appropriate for every agent or mission. The scoping stage intersects the available capabilities with the agent's permissions, the mission's requirements, and the repository's policies. For example, a security audit mission might scope out all write tools, while a refactoring mission might scope out network access tools. Scoping produces a filtered list of tools that are candidates for invocation.",
        "**Stage 3: Authorization** - Even if a tool is in scope, each invocation must be explicitly permitted. The authorization stage evaluates the tool name, arguments, context, and current mission state against the permission policy. The policy can return ALLOW (proceed automatically), ASK (pause for human approval), or DENY (reject the invocation). Authorization decisions are logged with full context for audit purposes.",
        "**Stage 4: Execution** - The tool call is dispatched within a sandboxed runner. The invocation is logged with full provenance (arguments, timestamp, mission ID), the response is validated against the declared schema, and the result is returned to the agent. If the invocation fails, the error is captured and handled according to the mission's error recovery policy.",
        "This pipeline ensures that governance is applied consistently to every tool invocation, regardless of which agent is making the request or which server is providing the tool."
      ]
    },
    {
      "heading": "Connection Management and Resilience",
      "paragraphs": [
        "The client must maintain reliable connections to multiple MCP servers, each of which may have different availability characteristics. Connection management handles the full lifecycle: initial connection, health monitoring, reconnection after failures, and graceful shutdown.",
        "Initial connection involves establishing the transport (stdio, SSE, or WebSocket), performing the handshake protocol, exchanging capabilities, and validating the connection. The client supports connection pooling to reduce overhead when multiple agents need to access the same server. Connections are reused across missions when possible, reducing latency and resource consumption.",
        "Health monitoring uses heartbeat mechanisms to detect unresponsive servers. The client sends periodic heartbeat messages and expects responses within a configurable timeout. If a server fails to respond, the client marks it as unhealthy and stops routing invocations to it. Health status is surfaced in the operator interface, enabling proactive intervention before servers fail completely.",
        "Reconnection after failures uses exponential backoff to avoid overwhelming recovering servers. The client attempts to reconnect with increasing delays between attempts, up to a maximum retry count. If reconnection fails after all retries, the server is marked as unavailable and invocations are routed to alternative servers if available. The client can also perform capability reconciliation after reconnection to detect any changes that occurred during the outage.",
        "Graceful degradation ensures that server failures don't cascade into mission failures. When a server becomes unavailable, the client can: route invocations to alternative servers (if capabilities are duplicated), pause missions that require the unavailable server, or fail missions with clear error messages. The choice of degradation strategy is configurable per mission type, allowing critical missions to have stricter availability requirements."
      ]
    },
    {
      "heading": "Capability Versioning and Change Detection",
      "paragraphs": [
        "MCP servers can update their tool manifests over time: adding new tools, deprecating old ones, or modifying existing tool schemas. The client must detect these changes and adapt accordingly to prevent silent capability drift that could lead to security issues or incorrect behavior.",
        "Capability versioning uses manifest version numbers that servers increment when they change their capabilities. The client tracks the version of each server's manifest and periodically checks for updates. When a new version is detected, the client downloads the updated manifest, diffs it against the previous version, and updates its internal registry.",
        "Change detection identifies three types of changes: additions (new tools), removals (deprecated tools), and modifications (schema changes). Each type of change triggers different responses:",
        "**Additions** - New tools are evaluated against the permission policy before becoming available to agents. If a new tool requires approval, it's added to the policy with the appropriate posture. The operator is notified of the new capability so they can review and configure it.",
        "**Removals** - Deprecated tools are withdrawn from the agent's usable set. If an agent attempts to invoke a removed tool, it receives a clear error message explaining that the tool is no longer available. The client can also suggest alternative tools if available.",
        "**Modifications** - Schema changes trigger re-evaluation of any cached invocations. If a tool's schema has changed in a way that makes cached invocations invalid, the cache is invalidated. The operator is notified of schema changes so they can review and update any dependent configurations.",
        "All changes are logged in the audit trail with full details: what changed, when it changed, and what the impact is. This audit trail supports compliance reporting and enables post-incident analysis if capability changes lead to issues."
      ]
    },
    {
      "heading": "Security Considerations",
      "paragraphs": [
        "The client architecture implements multiple layers of security to protect against various attack vectors: server impersonation, tool poisoning, response tampering, and privilege escalation.",
        "**Server Authentication** - The client authenticates servers before trusting their manifests. Authentication uses mutual TLS for high-security environments, API keys for simpler integrations, or OAuth tokens for user-delegated access. The client verifies server identity against a trusted list before accepting any capabilities.",
        "**Manifest Validation** - Server manifests are validated for schema correctness and checked for suspicious patterns. The validation includes: checking that all tools have valid schemas, verifying that tool names don't conflict with core safety tools, and detecting patterns that might indicate tool poisoning (attempts to override critical tools with malicious versions).",
        "**Response Validation** - Tool responses are validated against declared schemas before being passed to agents. This prevents malformed responses from causing unexpected behavior. The validation includes type checking, size limits, and pattern matching for known malicious payloads. Responses that fail validation are rejected and logged as security events.",
        "**Taint Tracking** - Data from external sources (server responses) is marked as tainted and tracked through the agent's processing pipeline. Tainted data cannot influence security-critical decisions without explicit approval. This prevents indirect prompt injection where a tool's output contains instructions that the agent follows.",
        "**Capability Isolation** - Each server's tools operate in their own isolated capability domain. A server's tools cannot access another server's state, and a server cannot invoke another server's tools directly. This isolation prevents a compromised server from affecting other servers or escalating its privileges.",
        "These security measures work together to create a defense-in-depth architecture that protects against both known and unknown attack vectors."
      ]
    },
    {
      "heading": "Performance Optimization",
      "paragraphs": [
        "The client architecture includes several optimizations to minimize latency and resource consumption while maintaining governance and security.",
        "**Connection Pooling** - Multiple agents can share connections to the same server, reducing the overhead of establishing new connections. The pool maintains a configurable number of idle connections and scales up based on demand. Connection reuse also reduces the latency of tool invocations since the handshake and capability exchange have already been performed.",
        "**Caching** - Tool schemas and server capabilities are cached to reduce the overhead of repeated queries. The cache is invalidated when capability changes are detected, ensuring that agents always have access to the latest capabilities. Cache hits significantly reduce latency for frequently-used tools.",
        "**Batching** - When multiple tool invocations are needed, the client can batch them into a single request to reduce round-trip overhead. Batching is particularly effective for read-only operations where multiple pieces of information are needed. The client intelligently groups invocations that can be batched while respecting dependency ordering.",
        "**Compression** - Large payloads (tool arguments or responses) are compressed to reduce network bandwidth and latency. The client negotiates compression algorithms with servers during the handshake and uses the most efficient algorithm supported by both parties. Compression is particularly important for tools that transfer large amounts of data.",
        "**Async Execution** - Tool invocations are executed asynchronously, allowing agents to continue working while waiting for responses. The client manages the lifecycle of async invocations, handling timeouts, cancellations, and error recovery. Async execution improves throughput for missions that invoke multiple tools.",
        "These optimizations are applied transparently—agents don't need to be aware of the optimization strategies. The client automatically applies the appropriate optimizations based on the invocation pattern and server capabilities."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is the MCP client?",
      "answer": "The MCP client is the component within CodingAgent that connects to external MCP servers and makes their tools available to agents. It manages the full lifecycle of tool discovery, capability negotiation, permission enforcement, and execution governance."
    },
    {
      "question": "How does the four-stage pipeline work?",
      "answer": "Every tool invocation flows through: Discovery (finding available tools), Scoping (filtering by permissions and mission requirements), Authorization (enforcing permission policies), and Execution (dispatching within sandboxed environments). This pipeline ensures governance is applied consistently."
    },
    {
      "question": "What happens if an MCP server goes down?",
      "answer": "The client detects server failures through heartbeat monitoring and can gracefully degrade: route to alternative servers, pause affected missions, or fail with clear error messages. Reconnection uses exponential backoff to avoid overwhelming recovering servers."
    },
    {
      "question": "How does the client handle capability changes?",
      "answer": "The client tracks manifest versions and detects additions, removals, and modifications. New tools are evaluated against permissions, removed tools are withdrawn, and schema changes trigger cache invalidation. All changes are logged for audit purposes."
    },
    {
      "question": "Is the client secure against malicious servers?",
      "answer": "Yes. The client implements multiple security layers: server authentication, manifest validation, response validation, taint tracking, and capability isolation. These measures protect against server impersonation, tool poisoning, response tampering, and privilege escalation."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
