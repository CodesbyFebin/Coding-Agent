import type { PillarEditorial } from '../types';

// Batch-converted editorial. Claim-audited; publish bar decides.
export const mcpToolDiscovery: PillarEditorial = {
  "pillarId": "mcp-tool-discovery",
  "updated": "2026-09-06",
  "definition": "Dynamic negotiation and registration of available tools, prompts, and resources from attached MCP server processes with manifest versioning, capability diffing, and change detection.",
  "sections": [
    {
      "heading": "The Discovery Process",
      "paragraphs": [
        "Tool discovery is the process by which an MCP client learns what tools are available from a connected server. When a client connects to a server, the server provides a manifest that lists all available tools with their complete schemas, descriptions, and metadata. The client processes this manifest to determine which tools are usable within the current permission context.",
        "The discovery process is not a one-time event—it's continuous. Servers can update their manifests over time: adding new tools, deprecating old ones, or modifying existing tool schemas. The client must detect these changes and adapt accordingly to prevent silent capability drift that could lead to security issues or incorrect behavior.",
        "Discovery involves several steps: establishing the connection, performing the handshake protocol, exchanging capabilities, validating manifests, and building the internal registry. Each step is designed to be robust and handle various failure modes: network interruptions, malformed manifests, schema validation failures, and capability conflicts.",
        "The discovery process also handles capability negotiation: determining what features the server supports (streaming responses, cancellation, progress reporting) and what the client can provide (authentication methods, compression, batching). This negotiation ensures that both parties understand each other's capabilities and limitations before any tool invocations occur."
      ]
    },
    {
      "heading": "Manifest Structure and Validation",
      "paragraphs": [
        "A server manifest is a structured document that describes all capabilities provided by the server. The manifest includes three types of capabilities: tools (functions the agent can invoke), resources (data the agent can read), and prompts (templates the agent can use). Each capability is described with a complete schema that defines its interface.",
        "For tools, the manifest includes: the tool name (unique identifier), description (human-readable explanation), input schema (JSON Schema defining accepted arguments), output schema (JSON Schema defining returned results), rate limits (maximum invocations per time period), authentication requirements (how clients must authenticate), and metadata (version, tags, examples).",
        "The manifest is validated by the client for schema correctness and checked for suspicious patterns. Validation includes: verifying that all tools have valid schemas, checking that tool names don't conflict with core safety tools, detecting patterns that might indicate tool poisoning (attempts to override critical tools with malicious versions), and ensuring that rate limits and authentication requirements are reasonable.",
        "Invalid manifests are rejected and the connection is terminated. This strict validation prevents malformed or malicious manifests from affecting the client. All validation failures are logged as security events for investigation.",
        "The manifest also includes a version number that the server increments when it changes its capabilities. The client tracks this version to detect changes and trigger re-discovery when needed."
      ]
    },
    {
      "heading": "Change Detection and Capability Diffing",
      "paragraphs": [
        "Servers can update their tool manifests over time, and the client must detect these changes to maintain an accurate view of available capabilities. Change detection uses manifest versioning: the server increments the version number when it changes its capabilities, and the client periodically checks for version updates.",
        "When a new manifest version is detected, the client downloads the updated manifest and performs capability diffing: comparing the new manifest against the previous version to identify what changed. The diff identifies three types of changes:",
        "**Additions** - New tools that weren't in the previous manifest. These tools are evaluated against the permission policy before becoming available to agents. If a new tool requires approval, it's added to the policy with the appropriate posture (ALLOW, ASK, or DENY). The operator is notified of the new capability so they can review and configure it.",
        "**Removals** - Tools that were in the previous manifest but aren't in the new one. These tools are withdrawn from the agent's usable set. If an agent attempts to invoke a removed tool, it receives a clear error message explaining that the tool is no longer available. The client can also suggest alternative tools if available.",
        "**Modifications** - Tools that exist in both manifests but have different schemas. Schema changes trigger re-evaluation of any cached invocations. If a tool's schema has changed in a way that makes cached invocations invalid, the cache is invalidated. The operator is notified of schema changes so they can review and update any dependent configurations.",
        "All changes are logged in the audit trail with full details: what changed, when it changed, and what the impact is. This audit trail supports compliance reporting and enables post-incident analysis if capability changes lead to issues.",
        "The diff algorithm is designed to be efficient, handling large manifests with thousands of tools without excessive memory or CPU usage. It uses structural comparison to identify changes quickly, focusing on the parts of the manifest that have actually changed rather than re-processing the entire manifest."
      ]
    },
    {
      "heading": "Dynamic Registration and Deregistration",
      "paragraphs": [
        "Tool discovery supports dynamic registration and deregistration of servers. Servers can join the network at any time, exposing their capabilities to clients. Servers can also leave the network, withdrawing their capabilities. The client handles both scenarios gracefully, updating its registry and notifying agents of the changes.",
        "When a new server joins the network, the client performs the full discovery process: connection, handshake, manifest exchange, validation, and registration. The new server's capabilities are added to the client's registry and become available to agents (subject to permission policies). Agents that are waiting for specific capabilities are notified that the capabilities are now available.",
        "When a server leaves the network (either gracefully or due to failure), the client removes its capabilities from the registry. Agents that were using those capabilities receive notifications and can adapt: switching to alternative providers, pausing missions that require the unavailable capabilities, or failing with clear error messages.",
        "Dynamic registration also supports capability hot-swapping: a server can update its capabilities without disconnecting. The client detects the update through manifest versioning and performs capability diffing to identify the changes. Agents are notified of the changes and can adapt their behavior accordingly.",
        "This dynamic approach enables flexible, resilient agent networks where servers can join and leave without disrupting ongoing operations. It also enables scaling: new servers can be added to handle increased load, and servers can be removed for maintenance without affecting the overall network."
      ]
    },
    {
      "heading": "Discovery Optimization and Caching",
      "paragraphs": [
        "Tool discovery can be expensive, especially for servers with large manifests or when many clients are connecting simultaneously. The discovery process includes several optimizations to minimize overhead while maintaining accuracy.",
        "**Manifest Caching** - Clients cache manifests to avoid re-downloading them on every connection. The cache is invalidated when the manifest version changes, ensuring that clients always have the latest capabilities. Cache hits significantly reduce discovery latency and server load.",
        "**Incremental Updates** - Instead of downloading the full manifest on every version change, clients can request incremental updates that include only the changes since the last known version. This reduces bandwidth and processing time for large manifests with infrequent changes.",
        "**Batch Discovery** - When connecting to multiple servers simultaneously, clients can batch discovery requests to reduce round-trip overhead. The client sends discovery requests to all servers in parallel and processes the responses as they arrive.",
        "**Capability Prediction** - For servers with stable capabilities, clients can predict what capabilities will be available based on historical data. This prediction enables agents to start planning before discovery completes, reducing overall mission latency. Predictions are validated when discovery completes, and any discrepancies are handled gracefully.",
        "**Selective Discovery** - Clients can request discovery of specific capability types (tools, resources, or prompts) rather than all capabilities. This reduces overhead when agents only need certain types of capabilities.",
        "These optimizations are applied transparently—agents don't need to be aware of the optimization strategies. The client automatically applies the appropriate optimizations based on the server characteristics and network conditions."
      ]
    },
    {
      "heading": "Security Considerations in Discovery",
      "paragraphs": [
        "Tool discovery is a critical security boundary: if an attacker can control what capabilities a client discovers, they can influence agent behavior in malicious ways. The discovery process implements multiple security measures to prevent this.",
        "**Server Authentication** - Clients authenticate servers before trusting their manifests. Authentication uses mutual TLS for high-security environments, API keys for simpler integrations, or OAuth tokens for user-delegated access. The client verifies server identity against a trusted list before accepting any capabilities.",
        "**Manifest Integrity** - Manifests are cryptographically signed by the server. The client verifies the signature before processing the manifest, ensuring that the manifest hasn't been tampered with in transit. Signatures use strong cryptographic algorithms (RSA-2048 or ECDSA-256) to prevent forgery.",
        "**Schema Validation** - Manifests are validated for schema correctness and checked for suspicious patterns. The validation includes: checking that all tools have valid schemas, verifying that tool names don't conflict with core safety tools, and detecting patterns that might indicate tool poisoning.",
        "**Capability Isolation** - Each server's capabilities are isolated from other servers' capabilities. A server cannot override or shadow another server's capabilities. This isolation prevents a malicious server from impersonating a trusted server's capabilities.",
        "**Audit Logging** - All discovery events are logged: connections, manifest exchanges, capability changes, and validation failures. These logs support security analysis and incident response.",
        "These security measures ensure that tool discovery is a trusted process that cannot be subverted by malicious actors. The defense-in-depth approach protects against both known and unknown attack vectors."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is tool discovery?",
      "answer": "Tool discovery is the process by which an MCP client learns what tools are available from a connected server. The server provides a manifest listing all capabilities with their schemas, and the client processes this manifest to determine which tools are usable."
    },
    {
      "question": "How are capability changes detected?",
      "answer": "Through manifest versioning. The server increments the version number when capabilities change, and the client performs capability diffing to identify additions, removals, and modifications. All changes are logged for audit purposes."
    },
    {
      "question": "Can servers join and leave dynamically?",
      "answer": "Yes. Servers can join the network at any time, exposing their capabilities. Servers can also leave, withdrawing their capabilities. The client handles both scenarios gracefully, updating its registry and notifying agents."
    },
    {
      "question": "Is discovery optimized for performance?",
      "answer": "Yes. The discovery process includes manifest caching, incremental updates, batch discovery, capability prediction, and selective discovery. These optimizations reduce latency and overhead while maintaining accuracy."
    },
    {
      "question": "How is discovery secured against malicious servers?",
      "answer": "Through server authentication, manifest integrity verification (cryptographic signatures), schema validation, capability isolation, and comprehensive audit logging. These measures prevent server impersonation, manifest tampering, and tool poisoning."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
