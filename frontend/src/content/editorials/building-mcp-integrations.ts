import type { PillarEditorial } from '../types';

// Batch-converted editorial. Claim-audited; publish bar decides.
export const buildingMcpIntegrations: PillarEditorial = {
  "pillarId": "building-mcp-integrations",
  "updated": "2026-09-06",
  "definition": "Developer guide, SDKs, and templates for wrapping custom compilers, profilers, and enterprise ticketing systems into governed MCP tools with schema declarations, permission hooks, and audit integration.",
  "sections": [
    {
      "heading": "Overview of MCP Integration Development",
      "paragraphs": [
        "Building MCP integrations enables organizations to expose their custom tools, services, and capabilities through the MCP protocol, making them available to CodingAgent and other MCP-compatible agents. This guide covers the complete process of developing, testing, and deploying MCP integrations.",
        "An MCP integration consists of several components: a tool declaration (defining the tool's interface), an implementation (the code that performs the tool's function), permission hooks (code that evaluates whether specific invocations are allowed), and audit integration (code that logs invocations to the audit trail). The MCP SDK provides frameworks and utilities for building each of these components, reducing development effort and ensuring consistency.",
        "The integration development process follows these phases: requirements analysis (understanding what capabilities to expose and to whom), design (defining the tool interface, permission model, and audit requirements), implementation (writing the tool code using the SDK), testing (verifying correctness, security, and performance), and deployment (making the integration available to agents). Each phase has specific deliverables and quality gates that ensure the integration meets production standards.",
        "MCP integrations can be developed in multiple programming languages (TypeScript, Python, Go, Rust) and can be deployed in various environments (standalone services, embedded in existing applications, cloud functions). The SDK abstracts the deployment details, allowing developers to focus on the tool's specific logic rather than the mechanics of the MCP protocol.",
        "This guide assumes familiarity with the MCP protocol concepts (tools, resources, prompts, schemas) and basic software development skills. It provides step-by-step instructions for building a simple integration, then covers advanced topics like complex schemas, permission models, and performance optimization."
      ]
    },
    {
      "heading": "Tool Declaration and Schema Design",
      "paragraphs": [
        "The first step in building an MCP integration is declaring the tool's interface through a schema. The schema defines what inputs the tool accepts, what outputs it produces, and what constraints apply. Good schema design is critical for usability, security, and maintainability.",
        "**Input Schema Design** uses JSON Schema to specify the tool's inputs. The schema should be: complete (all required inputs are specified), precise (types and constraints are clearly defined), and user-friendly (field names and descriptions are clear). The schema includes: field names, field types (string, number, boolean, object, array), required vs. optional fields, value constraints (minimum, maximum, pattern, enum), and field descriptions.",
        "For example, a code formatting tool might have an input schema like:\n```json\n{\n  \"type\": \"object\",\n  \"properties\": {\n    \"code\": {\n      \"type\": \"string\",\n      \"description\": \"The code to format\"\n    },\n    \"language\": {\n      \"type\": \"string\",\n      \"enum\": [\"typescript\", \"python\", \"go\"],\n      \"description\": \"The programming language\"\n    },\n    \"options\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"indentSize\": { \"type\": \"number\", \"minimum\": 1, \"maximum\": 8 },\n        \"useTabs\": { \"type\": \"boolean\" }\n      }\n    }\n  },\n  \"required\": [\"code\", \"language\"]\n}\n```",
        "**Output Schema Design** specifies what the tool returns. The output schema should be: consistent (similar tools return similar structures), complete (all relevant information is included), and machine-readable (structured for easy processing). The output schema includes: success response structure, error response structure, and metadata (execution time, resource usage, warnings).",
        "**Schema Versioning** allows the tool's interface to evolve over time without breaking existing clients. Each schema version is numbered, and clients can specify which version they support. The server can support multiple versions simultaneously, translating between versions as needed. Schema versioning enables backward compatibility while allowing the tool to improve and add features.",
        "**Schema Validation** is performed automatically by the MCP framework. Incoming requests are validated against the input schema, and outgoing responses are validated against the output schema. Validation failures are returned as structured errors with clear messages indicating what went wrong. This automatic validation reduces the burden on tool implementations and ensures consistent error handling.",
        "**Schema Documentation** is generated automatically from the schema. The documentation includes: field descriptions, type information, constraint information, and examples. The documentation is available through the MCP discovery mechanism, allowing agents to understand the tool's interface without external documentation. Good schema design produces good documentation automatically."
      ]
    },
    {
      "heading": "Tool Implementation Patterns",
      "paragraphs": [
        "The tool implementation is the code that performs the tool's function. The MCP SDK provides frameworks for implementing tools in different languages and patterns. This section covers common implementation patterns and best practices.",
        "**Simple Request-Response Pattern** is the most common pattern: the tool receives a request, processes it, and returns a response. This pattern is suitable for tools that perform a single, well-defined operation. The implementation receives validated inputs, performs the operation, and returns structured outputs. Error handling returns structured error responses rather than throwing exceptions.",
        "**Streaming Pattern** is used for tools that produce output incrementally. The tool sends partial results as they become available, allowing the client to process results before the tool completes. This pattern is suitable for long-running operations, large data transfers, or interactive tools. The implementation sends progress updates and partial results through the streaming interface.",
        "**Batch Pattern** is used for tools that process multiple inputs in a single invocation. The tool receives an array of inputs, processes them (potentially in parallel), and returns an array of outputs. This pattern is suitable for operations that benefit from batching (reducing overhead, enabling parallelism). The implementation processes each input independently and aggregates the results.",
        "**Stateful Pattern** is used for tools that maintain state across invocations. The tool stores state between invocations and uses it to inform processing. This pattern is suitable for tools that need to track context, maintain caches, or coordinate across invocations. The implementation manages state carefully, ensuring thread safety and proper cleanup.",
        "**Asynchronous Pattern** is used for tools that perform long-running operations. The tool accepts a request, starts the operation asynchronously, and returns a job ID. The client can poll for the job status or receive notifications when the job completes. This pattern is suitable for operations that take minutes or hours to complete. The implementation manages job lifecycle, status tracking, and result storage.",
        "**Error Handling** is critical for robust tool implementations. Errors should be: specific (clearly indicating what went wrong), actionable (providing guidance on how to fix the issue), and structured (following a consistent error format). The MCP SDK provides error types for common error categories (validation errors, permission errors, resource errors, internal errors) and utilities for creating custom error types.",
        "**Performance Optimization** is important for tools that are invoked frequently or process large amounts of data. Optimization techniques include: caching (caching results of expensive operations), batching (processing multiple inputs together), parallelism (processing independent operations concurrently), and resource management (managing memory, connections, and other resources efficiently). The SDK provides utilities for implementing these optimizations.",
        "**Testing** is essential for ensuring tool correctness and reliability. Tests should cover: happy path (normal operation with valid inputs), error cases (invalid inputs, error conditions), edge cases (boundary conditions, unusual inputs), and performance (throughput, latency, resource usage). The SDK provides testing frameworks and utilities for writing comprehensive tests."
      ]
    },
    {
      "heading": "Permission Hooks and Authorization",
      "paragraphs": [
        "Permission hooks are code that evaluates whether a specific tool invocation is allowed. They integrate with the MCP permission system to enforce authorization policies. Permission hooks are essential for ensuring that tools are used appropriately and securely.",
        "**Permission Hook Structure** - A permission hook receives the invocation context (tool name, arguments, caller identity, mission context) and returns a decision (ALLOW, ASK, or DENY) with a rationale. The hook is called before the tool implementation is invoked, allowing it to prevent unauthorized invocations.",
        "**Simple Permission Hooks** check basic conditions: is the caller authorized to use this tool? Are the arguments within allowed ranges? Is the current context appropriate for this invocation? Simple hooks are suitable for tools with straightforward authorization requirements.",
        "**Complex Permission Hooks** implement sophisticated authorization logic: role-based access control (checking the caller's role and permissions), attribute-based access control (checking attributes of the caller, resource, and environment), context-aware authorization (considering time, location, and other contextual factors), and risk-based authorization (assessing the risk of the invocation and requiring additional approval for high-risk operations).",
        "**Permission Hook Integration** - Permission hooks are registered with the MCP framework and are called automatically for each invocation. The framework passes the invocation context to the hook and enforces the hook's decision. If the hook returns DENY, the invocation is rejected with a clear error message. If the hook returns ASK, the invocation is paused and an approval request is created. If the hook returns ALLOW, the invocation proceeds to the tool implementation.",
        "**Permission Hook Testing** - Permission hooks should be thoroughly tested to ensure they make correct decisions in all scenarios. Tests should cover: authorized invocations (should return ALLOW), unauthorized invocations (should return DENY), borderline cases (should return the correct decision), and error conditions (should fail safely, typically by returning DENY). The SDK provides testing utilities for permission hooks.",
        "**Permission Hook Performance** - Permission hooks are called for every invocation, so they must be fast. Hooks should avoid expensive operations (database queries, network calls) and use caching where appropriate. The SDK provides utilities for optimizing hook performance.",
        "**Permission Hook Auditing** - All permission hook decisions are logged with full context: the invocation details, the decision, the rationale, and the execution time. This audit trail supports compliance reporting and security analysis. The SDK provides utilities for integrating hooks with the audit system.",
        "**Common Permission Patterns** - The SDK provides pre-built permission hooks for common patterns: role-based access (checking caller roles), time-based access (checking time of day), rate limiting (limiting invocation frequency), and argument validation (checking argument values). These pre-built hooks can be used directly or customized for specific requirements.",
        "Permission hooks are a critical component of MCP security. They ensure that tools are used only in authorized ways, preventing misuse and enforcing organizational policies. Well-designed permission hooks provide fine-grained control while maintaining usability and performance."
      ]
    },
    {
      "heading": "Audit Integration and Compliance",
      "paragraphs": [
        "Audit integration ensures that all tool invocations are logged with complete provenance, supporting compliance reporting, security analysis, and debugging. The MCP SDK provides utilities for integrating tools with the audit system.",
        "**Audit Event Structure** - Each audit event includes: timestamp, tool name, caller identity, invocation arguments (with sensitive data redacted), execution result, execution time, resource usage, and any errors. The event is structured for easy parsing and analysis.",
        "**Automatic Audit Integration** - The MCP framework automatically logs basic audit events for all invocations: the invocation request, the permission decision, the execution result, and the completion. This automatic logging provides a baseline audit trail without requiring tool implementations to add audit code.",
        "**Custom Audit Events** - Tool implementations can add custom audit events for operations that require additional audit detail. For example, a tool that modifies external systems might log the specific changes made, or a tool that accesses sensitive data might log the data access with appropriate redaction. The SDK provides utilities for creating and logging custom audit events.",
        "**Sensitive Data Redaction** - Audit events must not include sensitive data (credentials, personal information, proprietary data). The SDK provides utilities for redacting sensitive data before logging. Redaction rules can be configured based on field names, patterns, or custom logic. Redacted data is replaced with placeholders that indicate redaction occurred without revealing the actual data.",
        "**Audit Event Storage** - Audit events are stored in the centralized audit system, which provides: tamper-evident storage (cryptographic chaining prevents modification), efficient querying (indexing and search capabilities), retention management (automatic archival and deletion based on policies), and export capabilities (export to external systems for analysis).",
        "**Compliance Reporting** - The audit system supports generating compliance reports for various standards: SOC 2 (security, availability, processing integrity, confidentiality, privacy), ISO 27001 (information security management), HIPAA (healthcare data protection), GDPR (personal data protection), and custom standards. Reports demonstrate that all invocations were properly authorized, logged, and audited.",
        "**Audit Analysis** - The audit system supports analysis of audit data for security monitoring, performance optimization, and usage analytics. Analysis capabilities include: trend analysis (identifying patterns over time), anomaly detection (identifying unusual patterns), correlation analysis (linking related events), and statistical analysis (computing metrics and distributions).",
        "**Audit Integration Testing** - Audit integration should be tested to ensure that all invocations are properly logged and that sensitive data is properly redacted. Tests should verify: complete logging (all invocations are logged), correct redaction (sensitive data is redacted), accurate timing (timestamps are correct), and proper structure (events have the correct format).",
        "Audit integration is essential for operating MCP tools in production environments. It provides the accountability, transparency, and compliance capabilities that organizations require. The SDK makes audit integration straightforward, allowing developers to focus on tool functionality while ensuring comprehensive audit coverage."
      ]
    },
    {
      "heading": "Testing and Deployment",
      "paragraphs": [
        "Testing and deployment are the final phases of MCP integration development. Thorough testing ensures the integration is correct, secure, and performant. Deployment makes the integration available to agents in production environments.",
        "**Unit Testing** tests individual components in isolation: tool implementation (correctness of the tool's logic), permission hooks (correctness of authorization decisions), and audit integration (correctness of audit logging). Unit tests are fast, focused, and run frequently during development.",
        "**Integration Testing** tests the interaction between components: tool implementation with permission hooks (ensuring hooks are called correctly), tool implementation with audit integration (ensuring events are logged correctly), and tool implementation with the MCP framework (ensuring the tool integrates correctly with the protocol). Integration tests verify that components work together correctly.",
        "**End-to-End Testing** tests complete invocation flows from request to response: client sends request, framework validates request, permission hook evaluates request, tool implementation processes request, framework validates response, audit event is logged, response is returned to client. End-to-end tests verify the complete flow works correctly.",
        "**Security Testing** tests security aspects of the integration: permission bypass attempts (ensuring hooks cannot be bypassed), injection attacks (ensuring inputs are properly validated and sanitized), data leakage (ensuring sensitive data is not exposed), and privilege escalation (ensuring the tool cannot gain unauthorized privileges). Security testing identifies and remediates security vulnerabilities before deployment.",
        "**Performance Testing** tests performance characteristics: throughput (invocations per second), latency (time per invocation), resource usage (CPU, memory, network), and scalability (performance under load). Performance testing identifies bottlenecks and ensures the integration meets performance requirements.",
        "**Deployment Options** - MCP integrations can be deployed in various environments: standalone services (running as independent processes), embedded services (running within existing applications), cloud functions (running as serverless functions), or containerized services (running in containers). The SDK supports all deployment options and provides utilities for each.",
        "**Deployment Process** - The deployment process includes: building the integration (compiling, packaging), configuring the deployment (setting environment variables, configuring connections), deploying to the environment (installing, starting), verifying the deployment (health checks, smoke tests), and monitoring the deployment (metrics, logs, alerts). The SDK provides utilities for automating the deployment process.",
        "**Monitoring and Observability** - After deployment, the integration must be monitored for health, performance, and security. Monitoring includes: health checks (verifying the integration is running), performance metrics (tracking throughput, latency, resource usage), error tracking (detecting and diagnosing errors), and security monitoring (detecting suspicious activity). The SDK integrates with monitoring and observability systems to provide comprehensive visibility.",
        "**Maintenance and Updates** - After deployment, the integration requires ongoing maintenance: applying security patches, fixing bugs, adding features, and updating dependencies. The SDK supports versioning and backward compatibility, allowing updates to be deployed without breaking existing clients. Maintenance processes should include testing, staging deployment, and production deployment with rollback capabilities.",
        "Thorough testing and careful deployment ensure that MCP integrations are reliable, secure, and maintainable in production environments. The SDK provides comprehensive support for all phases of the development lifecycle, from initial development through ongoing maintenance."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is an MCP integration?",
      "answer": "An MCP integration exposes custom tools, services, or capabilities through the MCP protocol, making them available to CodingAgent and other MCP-compatible agents. It consists of a tool declaration, implementation, permission hooks, and audit integration."
    },
    {
      "question": "What languages are supported?",
      "answer": "MCP integrations can be developed in TypeScript, Python, Go, and Rust. The SDK provides frameworks and utilities for each language, abstracting the MCP protocol details and allowing developers to focus on tool logic."
    },
    {
      "question": "How are permissions enforced?",
      "answer": "Through permission hooks that evaluate each invocation against authorization policies. Hooks can implement simple checks (caller authorization) or complex logic (role-based, attribute-based, context-aware, risk-based authorization). All decisions are logged for audit."
    },
    {
      "question": "How is auditing handled?",
      "answer": "The MCP framework automatically logs basic audit events for all invocations. Tool implementations can add custom audit events for additional detail. Sensitive data is automatically redacted. Audit events support compliance reporting and security analysis."
    },
    {
      "question": "What deployment options are available?",
      "answer": "MCP integrations can be deployed as standalone services, embedded in existing applications, cloud functions, or containerized services. The SDK supports all deployment options and provides utilities for automated deployment, monitoring, and maintenance."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
