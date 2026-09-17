"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreAgents = void 0;
// Editorial converted from the reviewed pillar-database source. Claim-audited.
exports.coreAgents = {
    "pillarId": "core-agents",
    "updated": "2026-09-24",
    "definition": "The core agents framework that forms the foundation of CodingAgent's architecture, combining generative model reasoning with deterministic execution, repository-scale context awareness, and explicit tool governance to enable autonomous software engineering within defined boundaries.",
    "sections": [
        {
            "heading": "Architectural Foundations of Core Agents",
            "paragraphs": [
                "Core agents represent the foundational layer of CodingAgent's agentic architecture, providing the essential capabilities that enable software engineering tasks to be performed autonomously. Unlike general-purpose AI assistants, core agents are engineered specifically for development workflows where correctness, auditability, and safety are paramount. The architecture separates concerns into distinct phases: understanding the task context, planning the execution path, routing to appropriate tools, executing modifications, verifying results through independent gates, and learning from outcomes. This phased approach ensures that agent behavior is predictable and traceable at every step.",
                "The core agents framework addresses the fundamental tension between AI model creativity and engineering rigor. While language models excel at generating plausible code, they can produce syntactically correct but functionally incorrect output. Core agents mitigate this by embedding the execution within a controlled runtime that provides sandboxed tool access, verification gates that run compilers and test suites, and explicit permission boundaries that limit what the agent can do without human authorization."
            ]
        },
        {
            "heading": "Execution Control Loop",
            "paragraphs": [
                "Every mission through a core agent follows a deterministic control loop that prevents the unpredictable behavior commonly associated with AI-assisted coding. The loop begins with context analysis, where the agent reads the repository structure, identifies relevant files, and understands the task scope. This is followed by planning, where the agent generates a structured plan with explicit acceptance criteria. Execution then proceeds under strict sandbox supervision, with each tool invocation subject to permission checks. After each execution step, verification gates compile code, run tests, and validate that the changes meet the acceptance criteria before proceeding to the next step. If verification fails, the agent either rolls back or adjusts its approach within the plan.",
                "This loop is what distinguishes core agents from simple code generation tools. Simple tools might generate a function and claim completion, but core agents require independent verification before any mission is considered complete. The verification step runs the full test suite, type checks the code, and produces a cryptographic hash of all artifacts as evidence. Only when all verification gates pass is the mission marked complete."
            ]
        },
        {
            "heading": "Tool Governance and Permissions",
            "paragraphs": [
                "Core agents operate under explicit tool governance that defines what tools are available, under what conditions they can be invoked, and what permissions they have. Tool declarations are registered before mission startup, and the runtime ensures that no tool can be called outside its declared scope. Permissions are organized into three tiers: ALLOW (automatic within boundaries), ASK (requires human approval), and DENY (absolute prohibition). This governance extends to network access, file system operations, shell execution, and any external API calls.",
                "The permission system is configurable per mission and per repository, allowing teams to tailor agent behavior to their risk tolerance. A team working on greenfield development might grant broader permissions, while a team maintaining production critical infrastructure might enforce strict approval gates for any file modification. The system remembers these configurations and applies them consistently across all missions in the given context."
            ]
        },
        {
            "heading": "Context Management and Token Efficiency",
            "paragraphs": [
                "Effective context management is critical for core agent performance. The agent's context window includes repository structure, recently modified files, relevant code symbols, and the current task specification. However, context windows are finite, and inefficient use leads to decreased model performance and increased token costs. Core agents employ several strategies to maximize token efficiency: AST-aware pruning that removes non-essential commentary while preserving symbol definitions, diff summarization that captures the intent of changes without including every line, and prompt caching for recurring patterns like import statements or configuration templates.",
                "The system also supports context compaction, where older conversation history is summarized and archived while preserving essential information. This allows missions to span many turns without hitting context window limits. Token efficiency directly translates to cost savings, making core agents viable for large-scale enterprise deployments where thousands of missions run daily."
            ]
        },
        {
            "heading": "Verification and Acceptance Criteria",
            "paragraphs": [
                "Verification is the cornerstone of core agent reliability. Every mission must produce verifiable evidence of completion, and that evidence is evaluated against explicit acceptance criteria defined during planning. Verification includes: type checking (running tsc, mypy, or equivalent), unit test execution (running pytest, go test, or equivalent), linting (running eslint, prettier, or equivalent), and custom verification scripts defined by the mission. All verification results are recorded in the audit ledger with timestamps, tool outputs, and pass/fail status.",
                "Acceptance criteria are defined as part of the mission plan and must be objective and measurable. Subjective assessments like \"the code looks right\" are not acceptable. Instead, criteria must be expressible as: type errors: none, test pass rate: 100%, lint violations: 0, performance benchmark: within X% of baseline. This rigor ensures that core agents can be deployed with confidence in production environments."
            ]
        },
        {
            "heading": "Error Recovery and Rollback",
            "paragraphs": [
                "Despite rigorous verification, errors can occur. Core agents include robust error recovery mechanisms that preserve system integrity. When verification fails, the agent can: automatically rollback changes using git, pause the mission for human review, adjust the plan and retry, or escalate to a senior reviewer. Each recovery option is logged with the reason for choosing that path and the outcome.",
                "Rollback is performed using git worktree operations that restore the repository to its state before the mission began. This ensures that failed missions leave no residual changes. For missions that modify multiple files, the system generates a comprehensive rollback plan that restores all changed files to their original state. The rollback process itself is verified to ensure that the repository returns to a clean, consistent state."
            ]
        },
        {
            "heading": "Monitoring and Observability",
            "paragraphs": [
                "Core agents produce comprehensive telemetry that provides visibility into every aspect of mission execution. Telemetry includes: token consumption per phase, tool invocation counts and durations, verification gate results and durations, approval gate interactions, and mission completion status. This telemetry is emitted as OpenTelemetry-compatible spans and can be routed to monitoring platforms like Datadog, Grafana, or PagerDuty.",
                "Real-time monitoring dashboards show active missions, their current state, and key metrics like token burn rate and verification pass rates. Alerts can be configured for anomalous conditions such as unexpectedly high token consumption, repeated verification failures, or approval bottlenecks. This observability enables operators to detect and resolve issues before they impact productivity. Additionally, log aggregation systems collect agent execution logs, enabling historical analysis of agent behavior patterns, failure modes, and performance trends over time. This historical data supports capacity planning and continuous improvement of agent configurations.",
                "Integration with distributed tracing systems allows operators to follow a single mission's execution across multiple services and tool invocations. Each tool call, verification gate, and approval interaction is assigned a unique trace ID, providing end-to-return visibility into the agent's decision-making process. This traceability is essential for debugging complex issues and understanding agent behavior in production environments."
            ]
        },
        {
            "heading": "Enterprise Deployment Considerations",
            "paragraphs": [
                "Core agents are designed for enterprise deployment with features like multi-tenant isolation, role-based access controls, and audit-ready logging. Each tenant's agent configuration is isolated, ensuring that one team's agent settings do not affect another's. Role-based access controls determine which agents can run in which repositories and with what permissions. Audit logs provide tamper-evident records of all agent actions, supporting compliance with SOC 2, ISO 27001, and other regulatory frameworks.",
                "Deployment options include self-hosted on developer workstations, private cloud environments, and air-gapped environments with no external network access. The agent runtime adapts to the deployment environment, using available hardware resources while maintaining consistent governance controls across all environments. Enterprise deployments often integrate with identity providers like OAuth 2.0 or SAML for authentication, and support secret management solutions for storing API keys and credentials securely.",
                "Scaling core agents for organization-wide adoption requires careful consideration of resource allocation, queue management, and mission prioritization. Organizations typically implement a mission broker that distributes incoming coding tasks across available agent instances, ensuring fair resource utilization and preventing bottlenecks. The broker also handles mission retry logic, timeout management, and escalation policies for missions that exceed configured time limits."
            ]
        },
        {
            "heading": "Best Practices and Recommendations",
            "paragraphs": [
                "When working with core agents, following established best practices ensures reliable operation and maintainable agent behavior. Key recommendations include: starting with narrow permission scopes and gradually expanding as trust is established, implementing comprehensive test suites that cover edge cases and integration points, and designing missions with clear acceptance criteria that can be objectively verified.",
                "Organizations should implement a phased rollout approach, beginning with low-risk tasks like documentation generation or code refactoring before progressing to critical code modification missions. Each phase should include thorough monitoring and validation before expanding the agent's scope. Regular review of audit logs helps identify patterns of failure or success, informing continuous improvement of agent configurations and permission models.",
                "Prompt engineering for core agents differs from general-purpose AI assistance. Effective prompts for core agents are structured, explicit about acceptance criteria, and avoid ambiguous language. Including examples of successful and failed mission outcomes in the prompt context helps the agent learn preferred patterns and avoid common pitfalls. Additionally, version-controlling prompt configurations alongside code ensures reproducibility and enables rollback of prompt changes if unintended consequences arise."
            ]
        }
    ],
    "faq": [
        {
            "question": "What makes core agents different from regular AI coding tools?",
            "answer": "Core agents combine generative model reasoning with deterministic execution, independent verification, and explicit permission boundaries. While regular AI tools generate code and claim completion, core agents require verification through compilers and test suites before any mission is considered complete."
        },
        {
            "question": "How are permissions managed for core agents?",
            "answer": "Permissions are organized into three tiers: ALLOW (proceed automatically within defined boundaries), ASK (pause for human approval), and DENY (absolute prohibition). This system is configurable per mission and per repository, allowing teams to tailor agent behavior to their risk tolerance. The permission system enforces least privilege by default, granting only the minimum access necessary for the agent's task."
        },
        {
            "question": "What verification do core agents require?",
            "answer": "Core agents require independent verification including type checking, unit test execution, linting, and any custom verification scripts defined for the mission. All verification results are recorded in the audit ledger with timestamps and pass/fail status."
        },
        {
            "question": "Can core agents work in production environments?",
            "answer": "Yes. Core agents are designed for enterprise deployment with multi-tenant isolation, role-based access controls, and audit-ready logging. They can be deployed in self-hosted, private cloud, or air-gapped environments, with governance controls consistent across all deployment models."
        },
        {
            "question": "What are the key best practices for core agent deployment?",
            "answer": "Key best practices include starting with narrow permission scopes and gradually expanding as trust is implemented, implementing comprehensive test suites covering edge cases, designing missions with objectively verifiable acceptance criteria, and implementing a phased rollout beginning with low-risk tasks. Regular audit log review supports continuous improvement of agent configurations."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
