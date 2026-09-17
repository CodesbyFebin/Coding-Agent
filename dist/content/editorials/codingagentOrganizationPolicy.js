"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codingagentOrganizationPolicy = void 0;
// Editorial converted from the reviewed pillar-database source. Claim-audited.
exports.codingagentOrganizationPolicy = {
    "pillarId": "organization-policy",
    "updated": "2026-09-24",
    "definition": "Centrally managed, policy-as-code guardrails defining permitted models, external network boundaries, and required approval workflows — ensuring individual developer agents adhere strictly to corporate data governance and legal compliance mandates.",
    "sections": [
        {
            "heading": "Organization Policy Fundamentals",
            "paragraphs": [
                "Organization policy provides centrally managed, policy-as-code guardrails that define the boundaries within which individual developer agents must operate. The policy covers: permitted models (which AI model providers and specific models are allowed), external network boundaries (which endpoints agents can communicate with), and required approval workflows (which actions require human approval via the ALLOW/ASK/DENY tier system). The policy is expressed as code (typically Rego or YAML), enabling version control, review, and automated enforcement.",
                "The policy-as-code approach ensures that: policies go through the same code review process as any other code change, policies are consistently enforced across all agents and deployments, policies can be iteratively improved at the same pace as the codebase, and compliance auditors can verify that the active policy version was followed for each mission.",
                "The central management aspect means that the policy is defined at the organization level and propagated to all agent deployements: self-hosted agents, cloud SaaS instances, and air-gapped environments all enforce the same central policy, with optional per-repository or per-mission overrides that must still comply with the central guardrails."
            ]
        },
        {
            "heading": "Permitted Models",
            "paragraphs": [
                "The permitted models configuration defines which AI model providers and specific models are allowed for agent use. The configuration includes: allowed providers (OpenAI, Anthropic, Google, local/open-source models), allowed model names and versions, model categories (coding, reasoning, creative, embeddings), and model-specific restrictions (e.g., 'GPT-4 allowed for analysis tasks only, not code generation'). The policy can also include: deprecation dates (models that will be disallowed after a certain date), priority ordering (which model to use as primary, which as backup), and cost caps (maximum monthly spend per model or across all models).",
                "The policy enforcement: the agent's runtime reads the permitted models configuration at startup, and any model invocation that uses a non-permitted model is blocked and logged. The agent can request a policy exception, which must be approved by a policy administrator before the non-permitted model can be used. All policy violations are recorded in the audit trail with the mission identifier, the disallowed model, and the decision.",
                "This capability is essential for: organizations that want to maintain vendor neutrality, enterprises with compliance requirements that restrict certain model providers, and teams that want to control AI costs by limiting use of expensive models."
            ]
        },
        {
            "heading": "External Network Boundaries",
            "paragraphs": [
                "The external network boundaries configuration defines which endpoints agents can communicate with. The configuration includes: allowed endpoints (whitelisted domains and IP addresses for model APIs, tool servers, and integration services), prohibited endpoints (domains and IP addresses that are always blocked, such as social media, file sharing, and unknown categories), and category-based restrictions (entire categories of endpoints that are prohibited, such as gambling, gaming, or file sharing). The policy can also include: time-based restrictions (different boundaries during business hours vs. after hours), mission-type-specific boundaries (different boundaries for development vs. production missions), and escalation workflows (what happens when an agent attempts to access a prohibited endpoint).",
                "The policy enforcement: the agent's runtime reads the external network boundaries at startup, and any tool invocation that attempts to communicate with a non-permitted endpoint is blocked and logged. The agent can request a policy exception, which must be approved by a network security administrator before the prohibited endpoint can be accessed. All policy violations are recorded in the audit trail with the mission identifier, the prohibited endpoint, and the decision.",
                "This capability is essential for: organizations with strict data sovereignty requirements (preventing data exfiltration), enterprises with firewall compliance requirements, and air-gapped environments (where all network access must be explicitly authorized)."
            ]
        },
        {
            "heading": "Required Approval Workflows",
            "paragraphs": [
                "The required approval workflows configuration defines which actions require human approval via the ALLOW/ASK/DENY tier system. The configuration includes: ASK-tier actions (network requests to external services, git push operations, production deployments, database modifications, and any operation not explicitly covered by the mission's tool declarations), DENY-tier actions (arbitrary shell execution with unvalidated parameters, access to secret files without explicit authorization, and any operation that the permission system has not been configured to handle), and ALLOW-tier actions (routine operations within declared boundaries, such as read-only file access, simple syntax checks, and test execution within the project's existing test suite). The policy can also include: mission-specific overrides (different approval requirements for different mission types), time-based delegation (approvers can delegate their authority during vacation), and escalation paths (what happens if no decision is received within a configured timeout).",
                "The policy enforcement: the agent's runtime evaluates every tool invocation against the required approval workflows configuration. Invocations that require ASK or DENY approval are paused and an approval request is delivered to the configured reviewers (via web interface, IDE notification, mobile push, or integration with existing approval systems like Slack or Teams). All approval decisions are logged in the audit trail with the reviewer identity, the decision, the timestamp, and any comments. The timeout policy: if no decision is received within a configured time, the mission can be automatically paused, automatically rejected, or escalated to an alternative reviewer.",
                "This capability is essential for: organizations that require human oversight for consequential actions, enterprises with compliance requirements that mandate approval gates, and teams that want to balance automation with governance."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is organization policy?",
            "answer": "Centrally managed, policy-as-code guardrails defining permitted models, external network boundaries, and required approval workflows, ensuring agents adhere to corporate data governance and legal compliance mandates."
        },
        {
            "question": "How are permitted models configured?",
            "answer": "The configuration defines allowed providers, model names/versions, categories, deprecation dates, priority ordering, and cost caps. Non-permitted models are blocked at runtime, with policy exception requests requiring administrator approval."
        },
        {
            "question": "How are external network boundaries enforced?",
            "answer": "The configuration defines allowed/prohibited endpoints, category-based restrictions, and time-based/mission-specific boundaries. Non-permitted endpoints are blocked at runtime, with policy exception requests requiring administrator approval."
        },
        {
            "question": "How do approval workflows work?",
            "answer": "The configuration defines ASK-tier and DENY-tier actions. Invocations requiring approval are paused and delivered to reviewers via configured channels. Decisions are logged, and timeout policies auto-pause/reject/escalate if no decision is received."
        },
        {
            "question": "Can policies have per-repository overrides?",
            "answer": "Yes. The central policy can have optional per-repository or per-mission overrides that must still comply with the central guardrails."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
