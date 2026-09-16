import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const agentSandboxing: PillarEditorial = {
  "pillarId": "agent-sandboxing",
  "updated": "2026-09-24",
  "definition": "Runtime sandbox enforcement for agent tool execution, with configurable permission layers (ALLOW/ASK/DENY), cryptographic audit logging of all sandbox decisions, and automatic violation responses including mission pausing and operator notification.",
  "sections": [
    {
      "heading": "Sandbox Fundamentals",
      "paragraphs": [
        "Agent sandboxing provides the runtime enforcement mechanism that isolates agent tool execution from the host system. Every tool invocation (file read, shell command, network request, API call) passes through the sandbox layer, which evaluates the request against the agent's configured permission policy. The sandbox operates on the principle of least privilege: agents are granted only the minimum permissions necessary, and all other access is denied by default. This ensures that even if an agent's behavior becomes unpredictable or malicious, the damage is contained within the sandbox boundaries.",
        "The sandbox layer is composed of three interconnected subsystems: the permission evaluator (determines whether a requested tool invocation conforms to the agent's permission policy), the sandbox monitor (observes all tool executions and records outcomes in the audit ledger), and the violation response system (automatically pauses the mission, notifies the human operator, and logs the violation when a policy is breached). These subsystems work together to provide defense-in-depth while maintaining agent usability. The sandbox is not merely a container boundary; it is an active security policy enforcement point that intercepts, evaluates, and potentially redirects every agent action before it reaches the host system."
      ]
    },
    {
      "heading": "Permission Policy Tiers",
      "paragraphs": [
        "Permission policies are organized into three tiers that balance autonomous operation with human oversight: ALLOW (proceed automatically within defined boundaries, such as reading source files, running unit tests, or performing safe file modifications within designated paths), ASK (pause for human approval before proceeding, used for actions with potential side effects like file deletion, deployment to production, or network configuration changes), and DENY (absolute prohibition, such as accessing secrets, executing arbitrary shell commands with elevated privileges, making outbound network connections to unknown endpoints, or modifying system-critical files). Each tier can be further refined with path-based, command-based, or pattern-based restrictions, providing fine-grained control over agent behavior.",
        "The permission policy is defined as version-controlled configuration code, ensuring that changes are tracked, reviewable, and reversible. Policies can be specified per mission, per repository, or per organization, allowing teams to tailor agent behavior to their risk tolerance. A team working on greenfield development might grant broader ALLOW permissions, while a team maintaining production critical infrastructure might enforce strict ASK or DENY policies for any action beyond basic file reads. This configurability ensures that security controls adapt to the specific risk profile of each deployment context, rather than applying a one-size-fits-all approach.",
        "Path-based restrictions: policies can specify allowed or denied file paths using glob patterns, prefix matching, or exact path strings. For example, an ALLOW policy might permit reading files under /src/ but deny writing to /src/production/. Command-based restrictions: certain shell commands can be allowed, Asked, or denied based on the command name, arguments, or execution context. For instance, 'git status' might be on ALLOW, while 'git push' might require ASK. Pattern-based restrictions: regex patterns can be used to match file contents, network destinations, or API endpoints, providing flexible control over complex scenarios such as blocking outbound connections to unknown domains or preventing writes to paths matching /production/.*\.env.",
        "This tiered approach ensures that the most dangerous operations always require human oversight, while routine operations can proceed autonomously, maintaining both security and developer productivity."
      ]
    },
    {
      "heading": "Sandbox Monitoring and Audit Logging",
      "paragraphs": [
        "Every sandbox decision is logged in the comprehensive audit ledger, providing a complete record of all agent actions for forensic analysis, compliance auditing, and continuous improvement. The audit log includes: mission ID, timestamp, agent configuration, requested capability, policy evaluation result (ALLOW/ASK/DENY), operator decision (if ASK), violation details (if any), and cryptographic hash for tamper-evidence. This comprehensive logging ensures that no action goes unrecorded and that the full context of any mission is available for later analysis. The audit ledger is append-only, meaning entries can only be added, never modified or deleted, providing a reliable historical record.",
        "The monitoring system also provides real-time observability: dashboards display active missions, sandbox violation rates, approval gate bottlenecks, and agent health metrics. Alerts can be configured for anomalous conditions such as repeated policy violations, unexpected approval gate activity, or sudden changes in sandbox behavior. This observability enables operators to detect and resolve issues before they impact productivity or security. The monitoring system can also correlate sandbox events with other telemetry data (token consumption, tool invocation counts, verification gate results) to provide a holistic view of agent behavior and security posture.",
        "Cryptographic integrity: each audit log entry is cryptographically hashed and linked to the previous entry, forming a tamper-evident chain. Any attempt to modify a past log entry would break the hash chain, making it immediately detectable. This ensures that the audit log can be used as reliable evidence in compliance audits or incident investigations, meeting the requirements of frameworks such as SOC 2, ISO 27001, and GDPR. The hash chain is maintained across mission boundaries, ensuring continuous integrity even when missions start and stop."
      ]
    },
    {
      "heading": "Violation Response and Recovery",
      "paragraphs": [
        "When a sandbox policy is violated, the violation response system automatically: pauses the current mission (preserving the agent's state for later resumption), notifies the human operator via configured channels (web dashboard, email, Slack/Teams, or PagerDuty), logs the violation in the audit ledger with the mission ID, the policy that was breached, the operator's response, and the rationale (if provided), and generates a recovery plan that outlines the steps needed to resume the mission safely or terminate it if the violation indicates a fundamental security concern.",
        "The recovery plan includes: analysis of the violation to determine if it was a transient error, a policy misconfiguration, or a malicious action (the system classifies violations into categories: transient (e.g., race condition, temporary resource exhaustion), configuration (e.g., policy too restrictive or too permissive), and malicious (e.g., attempted sandbox escape, credential exfiltration attempt)); recommended corrective actions (adjusting the permission policy to address the gap, adding additional safeguards such as enhanced input validation, or terminating the mission if the violation indicates a fundamental security concern); and a validation step to ensure that the mission can resume without repeating the violation (the system verifies that the updated policy does not block the intended mission actions before resuming). If the violation is determined to be malicious or the policy misconfiguration is severe, the mission is terminated and the repository is restored to its state before the mission began using git operations, ensuring that no unauthorized changes persist.",
        "For organizations with compliance requirements, violation response procedures can be configured to include additional steps such as notifying the compliance team, preserving evidence for legal hold, and initiating a formal incident response process. All violation response actions are logged and auditable, ensuring that the organization can demonstrate due diligence in security governance. The system retains violation records for the organization's configured retention period (typically 90 days operational, 1+ years compliance), after which they are archived or purged according to policy."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is agent sandboxing?",
      "answer": "Runtime sandbox enforcement for agent tool execution with configurable permission layers (ALLOW/ASK/DENY), cryptographic audit logging, and automatic violation responses."
    },
    {
      "question": "How do permission tiers work?",
      "answer": "Permission policies are organized into three tiers: ALLOW (proceed automatically), ASK (pause for human approval), and DENY (absolute prohibition). Each tier can be refined with path-based, command-based, or pattern-based restrictions."
    },
    {
      "question": "What happens when a sandbox violation occurs?",
      "answer": "The violation response system pauses the mission, notifies the human operator, logs the violation, and generates a recovery plan. The mission can be resumed or terminated based on the analysis."
    },
    {
      "question": "Can permission policies be configured per repository?",
      "answer": "Yes. Permission policies can be specified per mission, per repository, or per organization, allowing teams to tailor agent behavior to their risk tolerance."
    },
    {
      "question": "How is audit logging integrity maintained?",
      "answer": "Each audit log entry is cryptographically hashed and linked to the previous entry, forming a tamper-evident chain. Any modification to past logs would break the hash chain, making it immediately detectable."
    },
    {
      "question": "Can violation response be customized per organization?",
      "answer": "Yes. Violation response procedures can be configured to include additional steps such as notifying the compliance team, preserving evidence for legal hold, and initiating a formal incident response process. All actions are logged and auditable."
    }
  ],
};