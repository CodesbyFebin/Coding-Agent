import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const securitySovereignty: PillarEditorial = {
  "pillarId": "security-sovereignty",
  "updated": "2026-09-24",
  "definition": "Least-privilege isolation, prompt injection defenses, secret scoping, and cryptographically verified audit trails — providing the foundational security controls for sovereign AI agent deployments in regulated environments.",
  "sections": [
    {
      "heading": "Security Sovereignty Fundamentals",
      "paragraphs": [
        "Security sovereignty represents the comprehensive security controls required for deploying AI agents in regulated and high-security environments. The concept ensures that agent operations remain under organizational control, with data remaining within designated boundaries and all actions being auditable. This is essential for industries like finance, healthcare, government, and critical infrastructure where data sovereignty and regulatory compliance are non-negotiable.",
        "The security sovereignty framework addresses: least-privilege isolation (agents receive only the minimum permissions necessary), prompt injection defenses (multi-layer protection against manipulation of agent behavior), secret scoping (credentials and API keys are never exposed in model contexts), and cryptographically verified audit trails (tamper-evident logging of all agent actions). These controls work together to ensure that agent deployments meet the strictest security and compliance requirements."
      ]
    },
    {
      "heading": "Least-Privilege Isolation",
      "paragraphs": [
        "Least-privilege isolation is the principle that agents should receive only the minimum permissions necessary to complete their assigned tasks. This is enforced through: role-based access controls that map developer identity to permitted agent modes and tool privileges, path-based restrictions that limit file access to designated directories, and tiered permission systems (ALLOW, ASK, DENY) that govern what actions the agent can perform without human approval.",
        "The implementation of least privilege involves: defining the agent's scope of work before mission startup, configuring permission policies that restrict access to sensitive files and operations, and continuously monitoring agent activity to detect privilege escalation attempts. Any action outside the declared scope triggers an approval gate or is blocked entirely.",
        "Least-privilege isolation prevents the common failure mode where agents, granted broad access for convenience, inadvertently modify critical infrastructure files, exfiltrate sensitive data, or execute unauthorized commands. By constraining permissions from the outset, organizations reduce the attack surface and maintain better control over agent behavior."
      ]
    },
    {
      "heading": "Prompt Injection Defenses",
      "paragraphs": [
        "Prompt injection defenses provide multi-layer protection against attempts to manipulate agent behavior through externally injected content. The defense framework includes: separation of control and data planes (ensuring system instructions cannot be overridden by user content), input sanitization (regex-based and AST-based filtering of all external inputs), and envelope validation (structured envelopes that clearly delimit control versus data planes).",
        "These defenses are particularly important for indirect prompt injection, where malicious content is embedded in README files, GitHub issues, pull request comments, or third-party dependencies. The agent reads this content as part of its context, and injected prompt instructions can blend in with legitimate system instructions. The multi-layer defense ensures that untrusted content cannot influence agent authority or execute unauthorized actions.",
        "The defense-in-depth approach means that no single layer is relied upon exclusively. If one layer is bypassed, others continue to provide protection. This is essential for environments where prompt injection could lead to data exfiltration, unauthorized code generation, or compliance violations."
      ]
    },
    {
      "heading": "Secret Scoping and Management",
      "paragraphs": [
        "Secret scoping ensures that API tokens, private SSH keys, cloud credentials, and other secrets never enter the model prompt history or telemetry spans. The secret broker injects credentials only at the instant of authorized tool calls and immediately scrubs them from memory after use. This prevents: credentials being included in model outputs, secrets being logged in audit trails, and sensitive data being transmitted to external endpoints.",
        "The secret management system includes: fine-grained secret brokers that inject credentials only at the point of tool execution, automated entropy scans on prompt and context buffers to detect accidental secret exposure, and memory wiping procedures that clear secret references from agent state after each mission.",
        "Organizations in regulated industries particularly benefit from secret scoping, as it supports compliance with frameworks like SOX, HIPAA, and GDPR, which require strict control over where sensitive data can appear and how it is handled."
      ]
    },
    {
      "heading": "Cryptographically Verified Audit Trails",
      "paragraphs": [
        "All agent actions are recorded in immutable, tamper-evident audit logs with cryptographic hashing and signed SLSA provenance attestations. Each audit entry includes: the agent's identity, the action performed (tool invocation, file modification, network request), the arguments and outputs, the verification results (pass/fail status), and a cryptographic hash of the complete state at that point in the mission.",
        "The audit trail supports: compliance reporting for SOC 2, ISO 27001, HIPAA, and GDPR; forensic analysis of security incidents; and supply-chain integrity verification for generated artifacts. Merkle tree hashing ensures that even small modifications to audit records are detectable, and signed attestations provide cryptographic proof that the logs have not been tampered with.",
        "Organizations can export audit logs in standard formats (JSON, CSV) for integration with compliance systems, and the audit data supports querying by approver, action type, time range, and mission, enabling detailed compliance verification."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is security sovereignty?",
      "answer": "Least-privilege isolation, prompt injection defenses, secret scoping, and cryptographically verified audit trails providing foundational security controls for sovereign AI agent deployments in regulated environments."
    },
    {
      "question": "How does least-privilege isolation work?",
      "answer": "Agents receive only minimum necessary permissions through role-based access controls, path-based restrictions, and tiered permission systems (ALLOW/ASK/DENY). Actions outside declared scope trigger approval gates or are blocked."
    },
    {
      "question": "How are secrets managed?",
      "answer": "Secret broker injects credentials only at point of tool execution and immediately scrubs them. Automated entropy scans detect accidental exposure, and memory wiping clears secret references after each mission."
    },
    {
      "question": "What audit trail protections exist?",
      "answer": "Immutable logs with cryptographic hashing, Merkle tree integrity verification, signed SLSA provenance attestations, and export in standard formats (JSON, CSV) for compliance reporting."
    },
    {
      "question": "Can this support regulated industry compliance?",
      "answer": "Yes. Security sovereignty supports compliance with SOX, HIPAA, GDPR, and other frameworks through strict access controls, secret scoping, and verifiable audit trails."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};