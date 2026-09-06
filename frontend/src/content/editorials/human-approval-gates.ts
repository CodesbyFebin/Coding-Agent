import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const humanApprovalGates: PillarEditorial = {
  "pillarId": "human-approval-gates",
  "updated": "2026-09-06",
  "definition": "Explicit interactive checkpoints that interrupt autonomous agent execution when the agent touches sensitive resources — network access, production deployments, database modifications, or any operation classified as requiring human judgment before proceeding.",
  "sections": [
    {
      "heading": "The Role of Human Approval in Agent Systems",
      "paragraphs": [
        "Human approval gates are the mechanism by which CodingAgent preserves human authority over consequential agent actions. While agents can operate autonomously for routine tasks, certain actions require human judgment: deploying to production, accessing external networks, modifying shared databases, or any operation where the cost of an error exceeds the cost of a brief delay.",
        "Approval gates are not a sign that agents are untrustworthy — they are a recognition that some decisions require context that the agent does not have, judgment that the agent cannot exercise, or authority that the agent does not possess. The gate pauses execution, presents the relevant information to a human, and waits for a decision.",
        "The approval interface presents: what the agent wants to do, why it wants to do it, what the risks are, what the alternatives are, and what evidence supports the proposed action. This information allows the human to make an informed decision without needing to understand every detail of the agent's reasoning.",
        "Approval gates are configurable per mission, per repository, and per organization. Different environments have different approval requirements: a development environment might have minimal gates, while a production environment has gates for every consequential action."
      ]
    },
    {
      "heading": "Classification of Actions Requiring Approval",
      "paragraphs": [
        "CodingAgent classifies agent actions into three tiers: ALLOW (proceed automatically within defined boundaries), ASK (pause and request human approval), and DENY (absolutely prohibited). The classification is based on the potential impact of the action and the reversibility of its consequences.",
        "Actions classified as ASK include: network requests to external services (potential data egress), git push operations (modifying shared history), production deployments (impacting live users), database schema modifications (risk of data loss), and any operation not explicitly covered by the mission's tool declarations.",
        "The classification is configurable and can be tuned to the organization's risk tolerance. A startup might classify git push as ALLOW for development branches but ASK for main. An enterprise might classify all network access as ASK regardless of destination.",
        "Actions classified as DENY include: arbitrary shell execution with unvalidated parameters, access to secret files without explicit authorization, and any operation that the permission system has not been configured to handle. DENY is the default for unknown operations — the system is deny-first by design."
      ]
    },
    {
      "heading": "The Approval Workflow",
      "paragraphs": [
        "When an agent encounters an action classified as ASK, the execution engine pauses the mission and creates an approval request. The request contains: the mission identifier, the action description, the tool and arguments, the risk assessment, the evidence supporting the action, and the available decisions (approve, reject, modify, escalate).",
        "The approval request is delivered through configured channels: web interface, IDE notification, mobile push notification, or integration with existing approval systems (Slack, Teams, email). The human reviewer can approve (allowing execution to continue), reject (causing the agent to skip or abort), modify (changing the arguments before approval), or escalate (forwarding to a more senior reviewer).",
        "The approval workflow supports timeout policies: if no decision is received within a configured time, the mission can be automatically paused, automatically rejected, or escalated to an alternative reviewer. Timeout policies prevent missions from hanging indefinitely waiting for approval.",
        "All approval decisions are logged in the audit trail with the reviewer identity, the decision, the timestamp, and any comments. This log provides accountability for approval decisions and supports post-mortem analysis when things go wrong."
      ]
    },
    {
      "heading": "Approval Delegation and Policy",
      "paragraphs": [
        "Organizations can define approval delegation policies that determine who can approve what. A junior developer might be able to approve documentation changes but not production deployments. A team lead might be able to approve deployments to staging but not production. A security officer might be required to approve any changes to authentication code.",
        "Delegation policies are expressed as rules: \"if action is production deploy and environment is production, then approver must have role deployer and environment production.\" The approval system evaluates these rules when routing approval requests and only delivers requests to authorized approvers.",
        "Policies also support time-based delegation: an approver can delegate their authority to a colleague during vacation, with automatic reversion when they return. Delegation is logged and auditable, preventing unauthorized approval through delegation chains.",
        "The delegation system integrates with existing identity providers (SSO, SAML, LDAP) to use existing role definitions rather than requiring separate role management. This integration reduces administrative overhead and ensures consistency with existing access controls."
      ]
    },
    {
      "heading": "Reducing Approval Fatigue",
      "paragraphs": [
        "One risk of approval gates is approval fatigue: if humans are asked to approve too many actions, they begin approving without reviewing, defeating the purpose of the gate. CodingAgent addresses this through intelligent approval routing that minimizes unnecessary approvals.",
        "The system learns from approval patterns: if a particular type of action is always approved without modification, the system can suggest reclassifying it as ALLOW for that specific context. This suggestion requires human confirmation, preventing automatic erosion of governance controls.",
        "Batch approval is supported for repetitive actions: if an agent needs to make 20 similar network requests, a single approval can cover all of them if they share the same risk profile. This reduces approval overhead without reducing governance.",
        "Context-aware approval presents only the information relevant to the decision: for a network request, the destination URL and data being sent; for a deployment, the diff and the test results. Irrelevant information is hidden, allowing faster decisions."
      ]
    },
    {
      "heading": "Audit and Compliance",
      "paragraphs": [
        "Every approval gate interaction is recorded in the immutable audit log: who requested approval, who granted or denied it, when, what the decision was, and what happened as a result. This log satisfies compliance requirements for change management, access control, and operational accountability.",
        "The audit log supports export in standard formats (JSON, CSV) for integration with compliance systems. It supports querying by approver, by action type, by time range, and by mission, enabling compliance officers to verify that approval policies are being followed.",
        "Approval records include cryptographic hashes that prevent tampering: if someone attempts to modify an approval record after the fact, the hash mismatch is detected and flagged. This tamper-evidence is essential for regulatory compliance in industries like finance and healthcare.",
        "The audit system also supports approval analytics: how many approvals were requested, how many were granted, average response time, and approval patterns by reviewer. These analytics help organizations tune their approval policies to balance governance with developer productivity."
      ]
    }
  ],
  "faq": [
    {
      "question": "What are human approval gates?",
      "answer": "Human approval gates are explicit checkpoints that pause agent execution when the agent attempts a consequential action — deploying to production, accessing external networks, modifying databases — requiring human judgment before proceeding."
    },
    {
      "question": "What actions require human approval?",
      "answer": "Actions classified as ASK: network requests to external services, git push operations, production deployments, database modifications, and any operation not explicitly declared in the mission configuration. The classification is configurable per organization."
    },
    {
      "question": "How does the approval workflow work?",
      "answer": "The agent pauses, creates an approval request with full context (what, why, risks, evidence), delivers it through configured channels (web, IDE, mobile, Slack), and waits for a decision: approve, reject, modify, or escalate. All decisions are logged."
    },
    {
      "question": "Can approval requirements be customized?",
      "answer": "Yes. Approval policies are configurable per mission, per repository, and per organization. Delegation policies determine who can approve what based on roles, environments, and action types. Policies integrate with existing identity providers."
    },
    {
      "question": "How is approval fatigue prevented?",
      "answer": "Through intelligent routing that minimizes unnecessary approvals, batch approval for repetitive actions, context-aware presentation of only relevant information, and learning from approval patterns to suggest reclassification of routinely-approved actions."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
