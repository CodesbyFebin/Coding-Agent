import type { PillarEditorial } from '../types';

// Batch-converted editorial. Claim-audited; publish bar decides.
export const mcpServerArchitecture: PillarEditorial = {
  "pillarId": "mcp-server-architecture",
  "updated": "2026-09-06",
  "definition": "The server-side implementation enabling CodingAgent to export reviewed internal capabilities, compilers, and analyzers to other agents through strictly typed JSON-RPC schemas with rate limits, authentication, and audit provenance.",
  "sections": [
    {
      "heading": "Understanding the MCP Server Role",
      "paragraphs": [
        "The MCP server is the component that exposes CodingAgent's internal capabilities as tools that other agents can invoke. It packages verified analyzers, linters, compilers, and custom tools behind a standardized interface with strict schema declarations. The server enables CodingAgent to participate in collaborative agent networks where capabilities flow between agents through governed, authenticated channels.",
        "The server architecture is designed around three core principles: explicit declaration (all capabilities are declared with complete schemas), governed access (all invocations are authenticated and authorized), and comprehensive auditing (all invocations are logged with full provenance). These principles ensure that exported capabilities can be used safely by other agents without compromising security or correctness.",
        "The server supports two modes of operation: standalone mode (running as an independent service that other agents connect to) and embedded mode (running within a CodingAgent instance and exposing that instance's capabilities). Both modes use the same protocol and governance mechanisms, ensuring consistency regardless of deployment topology.",
        "The server implements the MCP protocol specification, supporting all required features: tool invocation, resource access, prompt templates, and capability negotiation. It also implements optional features for enhanced functionality: streaming responses, progress reporting, and cancellation support. The server can be extended with custom capabilities through the plugin system, enabling organizations to expose their own tools and services."
      ]
    },
    {
      "heading": "Capability Declaration and Schema Validation",
      "paragraphs": [
        "Every capability exported by the server must be explicitly declared with a complete schema. This declaration includes: the tool name, description, input schema (JSON Schema), output schema, rate limits, authentication requirements, and metadata. The declaration is validated by the server framework to ensure it is well-formed and complete before the capability becomes available.",
        "The input schema uses JSON Schema to precisely specify what inputs the tool accepts. This includes: required vs. optional parameters, parameter types (string, number, boolean, object, array), value constraints (minimum, maximum, pattern, enum), and nested object structures. The schema is used for both validation (ensuring invocations match the schema) and documentation (generating human-readable descriptions of the tool's interface).",
        "The output schema specifies what the tool returns. This enables clients to validate responses and handle errors consistently. The schema includes: success response structure, error response structure, and any metadata that should be returned with the response (like execution time or resource usage).",
        "Rate limits are declared per tool to prevent abuse and ensure fair resource allocation. Limits can be specified as: requests per second, requests per minute, or concurrent invocations. When a rate limit is exceeded, the server returns a structured error indicating when the client can retry. Rate limits are enforced at the server level, preventing any single client from monopolizing server resources.",
        "Authentication requirements specify how clients must authenticate before invoking the tool. Supported methods include: API keys (simple string tokens), OAuth tokens (user-delegated access), mutual TLS (certificate-based authentication), and capability-bound tokens (tokens that restrict what operations the holder can perform). The server validates authentication before processing any invocation.",
        "All declarations are versioned, allowing clients to detect when capabilities change and re-evaluate their usage. Version changes trigger notifications to connected clients, enabling them to adapt to schema changes or deprecations."
      ]
    },
    {
      "heading": "Request Processing and Validation",
      "paragraphs": [
        "When the server receives a tool invocation request, it processes it through a multi-stage pipeline that ensures security, correctness, and auditability. This pipeline cannot be bypassed, ensuring that all invocations are governed consistently.",
        "**Stage 1: Authentication** - The server validates the client's authentication credentials. For API keys, it checks the key against the authorized keys list. For OAuth tokens, it validates the token with the identity provider. For mutual TLS, it verifies the client certificate. Authentication failures are logged as security events and the request is rejected.",
        "**Stage 2: Authorization** - The server checks whether the authenticated client is authorized to invoke the requested tool. Authorization is based on: the client's identity, the tool's access control list, and any contextual constraints (like time of day or source IP). Authorization failures are logged and the request is rejected.",
        "**Stage 3: Rate Limiting** - The server checks whether the invocation would exceed the tool's rate limits. If the limit is exceeded, the server returns a structured error with retry-after information. Rate limiting is applied per client to ensure fair usage across all clients.",
        "**Stage 4: Input Validation** - The server validates the invocation arguments against the tool's input schema. Validation includes: type checking, constraint validation (min/max, pattern, enum), and structural validation (required fields, nested objects). Validation failures return detailed error messages indicating what went wrong.",
        "**Stage 5: Execution** - The validated invocation is dispatched to the tool implementation. The execution happens within a sandboxed environment with resource limits (CPU, memory, time) to prevent runaway executions. The implementation returns a result or an error.",
        "**Stage 6: Output Validation** - The server validates the tool's output against the declared output schema. This ensures that the tool returns data in the expected format. Output validation failures are logged as tool implementation errors.",
        "**Stage 7: Audit Logging** - The complete invocation (authentication, authorization, inputs, outputs, timing) is logged to the audit trail. The log entry includes cryptographic hashes for tamper evidence.",
        "This pipeline ensures that every invocation is secure, valid, and auditable, regardless of which client made the request or which tool was invoked."
      ]
    },
    {
      "heading": "Resource Management and Isolation",
      "paragraphs": [
        "The server must manage resources carefully to ensure that one tool invocation cannot affect others or exhaust server resources. Resource management includes: CPU time limits, memory limits, execution time limits, and concurrent invocation limits.",
        "Each tool invocation runs in an isolated execution environment. For tools implemented in the same process as the server, isolation is achieved through sandboxing mechanisms (seccomp, namespaces, or cgroups on Linux; similar mechanisms on other platforms). For tools implemented as separate processes, isolation is achieved through process boundaries.",
        "CPU time limits prevent any single invocation from consuming excessive CPU. The server tracks CPU time per invocation and terminates invocations that exceed their limits. Memory limits prevent memory exhaustion. The server monitors memory usage per invocation and terminates invocations that exceed their limits. Execution time limits prevent invocations from running indefinitely. The server enforces timeouts and cancels invocations that exceed their limits.",
        "Concurrent invocation limits prevent a single tool from being overwhelmed by too many simultaneous requests. When the limit is reached, additional requests are queued or rejected based on the tool's configuration. This protects tools that have limited concurrency (like database connections or external API calls).",
        "Resource usage is tracked per client, enabling the server to identify clients that are consuming disproportionate resources. This tracking supports fair usage policies and enables the server to throttle or block clients that are abusing resources.",
        "The isolation model extends to error handling: if a tool invocation fails or crashes, it doesn't affect other invocations or the server itself. The failure is contained within the invocation's sandbox, and the server can continue processing other invocations. This isolation is essential for server reliability and ensures that one faulty invocation cannot bring down the entire server."
      ]
    },
    {
      "heading": "Audit Provenance and Compliance",
      "paragraphs": [
        "Every tool invocation is logged with complete provenance, creating an immutable audit trail that supports compliance reporting, security analysis, and debugging. The audit trail is a critical component of the server architecture, providing accountability for all capability usage.",
        "Each audit log entry includes: timestamp, client identity, tool name, invocation arguments (with sensitive data redacted), execution result, execution time, resource usage, and any errors. The log entry is cryptographically hashed and chained to previous entries, creating a tamper-evident audit trail.",
        "The audit system supports multiple output formats: structured JSON for machine processing, human-readable reports for compliance audits, and aggregated statistics for trend analysis. The system can export logs to external systems (SIEM, log aggregators) for centralized analysis and long-term storage.",
        "Audit data retention is configurable based on compliance requirements. Some organizations require logs to be retained for years, while others have shorter retention periods. The system supports automatic archival and deletion based on retention policies.",
        "The audit trail enables several important use cases:",
        "**Compliance Reporting** - Generate reports demonstrating that all tool invocations were properly authenticated, authorized, and logged. These reports support regulatory compliance (SOC 2, ISO 27001, HIPAA) and internal audit requirements.",
        "**Security Analysis** - Investigate security incidents by tracing tool invocations across time. The audit trail shows who invoked what, when, with what arguments, and what results were produced. This enables forensic analysis of security incidents.",
        "**Performance Analysis** - Identify performance bottlenecks by analyzing execution times and resource usage across invocations. This analysis enables optimization of tool implementations and server configuration.",
        "**Usage Analytics** - Understand how capabilities are being used by different clients. This analytics enables capacity planning, feature prioritization, and identification of underutilized capabilities.",
        "The audit system is designed to have minimal impact on invocation performance. Logging is asynchronous and batched to reduce overhead. Sensitive data is redacted before logging to prevent accidental exposure. The system is optimized for high-throughput logging without sacrificing completeness or accuracy."
      ]
    },
    {
      "heading": "Extensibility and Plugin System",
      "paragraphs": [
        "The server architecture is designed to be extensible through a plugin system that enables organizations to expose their own tools and services as MCP capabilities. The plugin system provides a framework for implementing, registering, and managing custom tools while maintaining the governance and security guarantees of the core server.",
        "Plugins can be implemented in multiple languages (JavaScript/TypeScript, Python, Go, Rust) and can be loaded dynamically without server restart. The plugin framework provides: lifecycle management (initialization, startup, shutdown), configuration management (plugin-specific configuration), and dependency injection (access to server services like logging, authentication, and audit).",
        "Each plugin declares its capabilities through the same schema mechanism as built-in tools. This ensures that custom tools are governed by the same validation, authorization, and auditing as built-in tools. Plugins can also declare dependencies on other plugins, enabling composition of complex capabilities from simpler building blocks.",
        "The plugin system supports several extension points:",
        "**Tool Plugins** - Expose new tools that can be invoked by clients. Tool plugins implement the tool interface and are registered with the server. The server handles all governance (authentication, authorization, rate limiting, auditing) while the plugin focuses on the tool's specific logic.",
        "**Resource Plugins** - Expose resources (data, files, configurations) that clients can access. Resource plugins implement the resource interface and are registered with the server. The server handles access control and auditing while the plugin provides the resource data.",
        "**Prompt Plugins** - Expose prompt templates that clients can use. Prompt plugins implement the prompt interface and are registered with the server. The server handles validation and auditing while the plugin provides the prompt logic.",
        "**Middleware Plugins** - Intercept and modify invocations before they reach tool implementations. Middleware plugins can implement cross-cutting concerns like caching, logging, or transformation. Middleware is applied in a defined order, enabling composition of multiple middleware layers.",
        "The plugin system enables organizations to extend CodingAgent's capabilities without modifying the core server. This enables customization for specific use cases, integration with internal systems, and experimentation with new capabilities. The plugin ecosystem can be shared across organizations, enabling a marketplace of reusable capabilities."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is the MCP server?",
      "answer": "The MCP server exposes CodingAgent's internal capabilities (analyzers, compilers, linters, custom tools) as tools that other agents can invoke through the MCP protocol. It provides governed, authenticated, and audited access to these capabilities."
    },
    {
      "question": "How are capabilities declared?",
      "answer": "Every capability is declared with a complete schema: tool name, description, input schema (JSON Schema), output schema, rate limits, and authentication requirements. Declarations are validated and versioned to ensure correctness and enable change detection."
    },
    {
      "question": "How does the server ensure security?",
      "answer": "The server implements a multi-stage processing pipeline: authentication, authorization, rate limiting, input validation, execution, output validation, and audit logging. Each stage is enforced consistently for all invocations."
    },
    {
      "question": "Can I extend the server with custom tools?",
      "answer": "Yes. The plugin system enables organizations to expose their own tools and services as MCP capabilities. Plugins can be implemented in multiple languages and are governed by the same security and audit mechanisms as built-in tools."
    },
    {
      "question": "How does auditing work?",
      "answer": "Every invocation is logged with complete provenance: timestamp, client identity, tool name, arguments (redacted), results, timing, and resource usage. Logs are cryptographically hashed for tamper evidence and can be exported to external systems for compliance and analysis."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
