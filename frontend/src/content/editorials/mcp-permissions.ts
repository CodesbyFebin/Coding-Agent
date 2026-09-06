import type { PillarEditorial } from '../types';

// Batch-converted editorial. Claim-audited; publish bar decides.
export const mcpPermissions: PillarEditorial = {
  "pillarId": "mcp-permissions",
  "updated": "2026-09-06",
  "definition": "Granular role-based and path-based permission policies applied to individual MCP tool invocations with support for ALLOW, ASK, and DENY postures per tool, per argument pattern, and per calling context.",
  "sections": [
    {
      "heading": "The Permission Model",
      "paragraphs": [
        "MCP permissions extend the CodingAgent permission model to cover tools accessed through the MCP protocol. Each tool invocation is evaluated against the permission policy: is this tool allowed for this agent, in this context, with these arguments? The permission system provides fine-grained control over what agents can do with MCP tools, ensuring that tool usage aligns with organizational policies and security requirements.",
        "The permission model is based on three core concepts: posture (ALLOW, ASK, or DENY), scope (what the permission applies to), and context (when the permission applies). These concepts combine to create a flexible, expressive permission system that can handle complex authorization requirements.",
        "**Posture** defines what happens when an agent attempts to invoke a tool:\n- **ALLOW**: The invocation proceeds automatically without human intervention\n- **ASK**: The invocation pauses and requires explicit human approval before proceeding\n- **DENY**: The invocation is rejected and cannot proceed regardless of context",
        "**Scope** defines what the permission applies to:\n- **Tool-level**: Permissions for specific tools (e.g., \"filesystem.read is ALLOW\")\n- **Argument-level**: Permissions for specific argument patterns (e.g., \"filesystem.read with path /src/* is ALLOW, but /secrets/* is DENY\")\n- **Context-level**: Permissions that vary based on context (e.g., \"network access is ALLOW during business hours but ASK after hours\")",
        "**Context** defines when the permission applies:\n- **Agent identity**: Different permissions for different agents or agent modes\n- **Mission type**: Different permissions for different types of missions\n- **Repository**: Different permissions for different repositories\n- **Time**: Different permissions based on time of day or day of week\n- **Environment**: Different permissions for development, staging, and production",
        "This multi-dimensional model enables organizations to express complex authorization requirements while maintaining clarity and auditability."
      ]
    },
    {
      "heading": "Permission Granularity and Expressiveness",
      "paragraphs": [
        "MCP permissions support multiple levels of granularity, enabling organizations to express permissions at the appropriate level of specificity for their needs.",
        "**Tool-level permissions** are the coarsest granularity: they allow or deny specific tools entirely. For example, an organization might ALLOW all read-only tools but DENY all write tools for a particular agent mode. Tool-level permissions are simple to understand and manage but may be too coarse for some use cases.",
        "**Argument-level permissions** provide finer granularity by considering the arguments passed to the tool. For example, a filesystem.read tool might be ALLOW for paths matching /src/* but DENY for paths matching /secrets/*. Argument-level permissions use pattern matching (glob patterns, regular expressions, or custom matchers) to express complex conditions.",
        "**Context-level permissions** provide the finest granularity by considering the context of the invocation. For example, a network access tool might be ALLOW for internal domains but ASK for external domains, with the decision depending on the agent's identity, the mission type, and the time of day. Context-level permissions can combine multiple dimensions to express very specific conditions.",
        "The permission system supports logical operators (AND, OR, NOT) to combine conditions, enabling complex expressions like: \"ALLOW filesystem.write if (path matches /src/*) AND (agent mode is Code) AND (time is business hours)\". This expressiveness enables organizations to encode their authorization policies precisely.",
        "Permissions are evaluated in order from most specific to most general. The first matching permission determines the posture. This ordering enables organizations to define general defaults and override them with specific exceptions. For example: \"DENY all tools by default, but ALLOW filesystem.read for /src/*, and ALLOW all tools for admin agents\"."
      ]
    },
    {
      "heading": "Permission Inheritance and Cascading",
      "paragraphs": [
        "MCP permissions support inheritance, enabling organizations to define permissions at multiple levels and have them cascade appropriately. This inheritance model reduces configuration burden while maintaining flexibility.",
        "**Organization-level permissions** provide defaults for the entire organization. These permissions apply to all agents, missions, and repositories unless overridden. Organization-level permissions encode the organization's baseline security posture and compliance requirements.",
        "**Team-level permissions** can tighten (but not loosen) organization-level permissions for specific teams. For example, the security team might have additional permissions for security scanning tools that other teams don't have. Team-level permissions enable teams to customize their agent experience while maintaining organizational standards.",
        "**Repository-level permissions** can tighten (but not loosen) team-level permissions for specific repositories. For example, a production repository might have stricter permissions than a development repository. Repository-level permissions enable fine-tuning for specific codebases.",
        "**Mission-level permissions** can tighten (but not loosen) repository-level permissions for specific missions. For example, a security audit mission might have expanded read permissions but restricted write permissions. Mission-level permissions enable customization for specific tasks.",
        "This cascading model ensures that organizational standards are maintained while allowing appropriate customization at each level. A permission change at the organization level automatically propagates to all teams, repositories, and missions unless explicitly overridden. This propagation reduces configuration drift and ensures consistency.",
        "The inheritance model also supports permission auditing: when evaluating a permission, the system can show which level defined the permission and why. This transparency enables organizations to understand and debug their permission configurations."
      ]
    },
    {
      "heading": "Permission Evaluation and Performance",
      "paragraphs": [
        "Permission evaluation must be fast and deterministic. Every tool invocation is evaluated against the permission policy before execution, and this evaluation cannot add significant latency to the invocation. The permission system is designed for high-performance evaluation while maintaining correctness and auditability.",
        "The evaluation process follows these steps:",
        "1. **Gather context**: Collect all relevant context for the invocation (agent identity, mission type, repository, tool name, arguments, time, environment)\n2. **Match permissions**: Evaluate permissions in order from most specific to most general, finding the first matching permission\n3. **Determine posture**: Return the posture (ALLOW, ASK, or DENY) from the matching permission\n4. **Log decision**: Log the evaluation with full context for audit purposes",
        "The permission system uses several optimizations to ensure fast evaluation:",
        "**Permission indexing**: Permissions are indexed by tool name and other key attributes, enabling fast lookup without scanning all permissions.",
        "**Caching**: Frequently-evaluated permissions are cached to avoid repeated evaluation. The cache is invalidated when permissions change.",
        "**Early termination**: Evaluation stops as soon as a matching permission is found, without evaluating remaining permissions.",
        "**Pre-computation**: For static permissions (permissions that don't depend on runtime context), the system pre-computes the evaluation result and caches it.",
        "These optimizations enable permission evaluation to complete in microseconds, adding negligible overhead to tool invocations. The system can evaluate thousands of permissions per second, supporting high-throughput agent operations.",
        "Permission evaluation is deterministic: the same inputs always produce the same output. This determinism is essential for debugging and auditing—if an invocation is allowed today, it should be allowed tomorrow (assuming permissions haven't changed)."
      ]
    },
    {
      "heading": "Permission Testing and Validation",
      "paragraphs": [
        "Permission policies must be tested and validated before deployment to ensure they behave as expected. Incorrect permissions can lead to security vulnerabilities (if too permissive) or operational failures (if too restrictive). The permission system provides comprehensive testing and validation capabilities.",
        "**Permission testing** enables organizations to test their permission policies against specific scenarios. Tests specify: the context (agent identity, mission type, repository, tool, arguments), the expected posture (ALLOW, ASK, or DENY), and the rationale. The system evaluates the permission and compares the result to the expected posture. Tests can be automated and run as part of the CI/CD pipeline, ensuring that permission changes don't introduce regressions.",
        "**Permission validation** checks the permission policy for common errors: conflicting permissions (two permissions that match the same context with different postures), unreachable permissions (permissions that can never match because a more general permission always matches first), and overly broad permissions (permissions that grant more access than necessary). Validation helps organizations catch configuration errors before they reach production.",
        "**Permission simulation** enables organizations to simulate the effect of permission changes before deploying them. The simulation evaluates the new permissions against historical invocation data and reports: which invocations would change posture, how many invocations would be affected, and what the impact would be. This simulation enables organizations to understand the impact of permission changes and avoid unintended consequences.",
        "**Permission auditing** provides ongoing monitoring of permission usage. The audit system tracks: which permissions are most frequently evaluated, which permissions result in ASK or DENY postures, and which permissions are never used. This auditing enables organizations to identify unused permissions (which can be removed to simplify the policy) and frequently-denied permissions (which may indicate misalignment between agent behavior and organizational policies).",
        "These testing and validation capabilities ensure that permission policies are correct, efficient, and aligned with organizational requirements."
      ]
    },
    {
      "heading": "Integration with External Authorization Systems",
      "paragraphs": [
        "MCP permissions can integrate with external authorization systems, enabling organizations to leverage existing identity and access management infrastructure. This integration ensures consistency between agent permissions and other system permissions, reducing administrative overhead and improving security.",
        "**LDAP/Active Directory integration** enables permissions to be based on directory groups. Agents can be assigned to directory groups, and permissions can reference these groups. This integration enables organizations to manage agent permissions using their existing directory infrastructure.",
        "**OAuth integration** enables permissions to be based on OAuth scopes. Agents can be issued OAuth tokens with specific scopes, and permissions can reference these scopes. This integration enables fine-grained, token-based authorization that aligns with modern identity standards.",
        "**RBAC integration** enables permissions to be based on roles. Agents can be assigned roles, and permissions can reference these roles. This integration enables organizations to define permissions in terms of business roles rather than technical details.",
        "**ABAC integration** enables permissions to be based on attributes (agent attributes, resource attributes, environmental attributes). This integration enables very fine-grained, context-aware authorization that can adapt to changing conditions.",
        "**Policy-as-code integration** enables permissions to be defined in code (using languages like Rego, Cedar, or custom DSLs) and managed through version control. This integration enables permissions to be tested, reviewed, and deployed using standard software engineering practices.",
        "These integrations enable organizations to implement MCP permissions in a way that aligns with their existing security infrastructure and practices. The integrations are designed to be flexible, supporting various authorization models and standards."
      ]
    }
  ],
  "faq": [
    {
      "question": "What are MCP permissions?",
      "answer": "MCP permissions are granular policies controlling which tools agents can invoke through the MCP protocol, with support for ALLOW, ASK, and DENY postures at multiple levels of granularity."
    },
    {
      "question": "How granular can permissions be?",
      "answer": "Very granular: permissions can be specified at the tool level, argument level (using pattern matching), and context level (based on agent identity, mission type, repository, time, environment). Permissions can combine multiple dimensions using logical operators."
    },
    {
      "question": "Do permissions support inheritance?",
      "answer": "Yes. Organization-level permissions provide defaults, with team-level, repository-level, and mission-level permissions that can tighten (but not loosen) the inherited permissions. This cascading model reduces configuration burden while maintaining flexibility."
    },
    {
      "question": "How fast is permission evaluation?",
      "answer": "Permission evaluation completes in microseconds using indexing, caching, early termination, and pre-computation optimizations. The system can evaluate thousands of permissions per second with negligible overhead."
    },
    {
      "question": "Can permissions integrate with existing authorization systems?",
      "answer": "Yes. MCP permissions integrate with LDAP/Active Directory, OAuth, RBAC, ABAC, and policy-as-code systems. This integration enables organizations to leverage existing identity and access management infrastructure."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
