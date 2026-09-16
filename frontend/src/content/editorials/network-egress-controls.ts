import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const networkEgressControls: PillarEditorial = {
  "pillarId": "network-egress-controls",
  "updated": "2026-09-24",
  "definition": "Default-deny network firewall allowing agent tool requests only to approved, domain-allowlisted endpoints — stopping data exfiltration attacks where compromised code attempts to curl environment variables to remote adversary servers.",
  "sections": [
    {
      "heading": "Network Egress Fundamentals",
      "paragraphs": [
        "Network egress controls provide a default-deny firewall that restricts agent tool requests to only approved, domain-allowlisted endpoints. This is a critical security control for preventing data exfiltration attacks, where compromised code attempts to send sensitive information (API keys, database credentials, proprietary code) to remote adversary servers. By enforcing a default-deny posture, the system ensures that no network connection can occur unless explicitly authorized.",
        "The egress control system operates at the container/sandbox level, filtering all outbound network traffic from agent execution environments. Every DNS request, TCP connection, and UDP packet is evaluated against the allowlist before being permitted. This prevents the common failure mode where agents, granted network access for legitimate purposes, inadvertently or maliciously connect to unauthorized endpoints."
      ]
    },
    {
      "heading": "Allowlist Configuration and Management",
      "paragraphs": [
        "The allowlist is configured per mission, per repository, and per organization. A typical allowlist includes: essential service endpoints (model provider APIs, package repositories), internal microservices (database endpoints, authentication servers), and prohibited categories (social media, file sharing, unknown domains). The configuration is expressed as: permit requests to *.model-provider.com and internal-service.corp, deny all others.",
        "Allowlist management supports: dynamic updates (allowlists can be modified during mission operation with proper approval), per-repository configurations (different repositories have different allowlists based on their data sensitivity), and organization-wide policies (centralized allowlist management with per-repository overrides).",
        "The system also supports allowlist analytics: how many connection attempts were made, how many were permitted/denied, and patterns by destination. This data helps organizations tune their allowlists to balance security with developer productivity."
      ]
    },
    {
      "heading": "Data Exfiltration Prevention",
      "paragraphs": [
        "Data exfiltration prevention is the primary objective of network egress controls. The system prevents: DNS tunneling (encoding exfiltrated data in DNS queries), HTTP data exfiltration (POST requests to unauthorized endpoints), and out-of-band channels (using alternative protocols like ICMP or ICMPv6 for data exfiltration). Each connection attempt is logged, and anomalous patterns (large data transfers to unexpected destinations) trigger alerts for security review.",
        "The logging system records: the destination domain or IP, the connection type (DNS, HTTP, HTTPS), the volume of data transferred (if any), and the mission identifier responsible for the connection. All logs are written to the audit trail with cryptographic hashes for tamper-evidence.",
        "Alerts fire when: connection attempts exceed configured thresholds, data volume exceeds expected baselines, or the destination is not on the allowlist. Security teams can investigate these alerts and update the allowlist as needed."
      ]
    },
    {
      "heading": "Integration with Permission System",
      "paragraphs": [
        "Network egress controls integrate with the ALLOW/ASK/DENY permission system: a tool that makes network requests is classified as ASK (human approval required) by default, and the approval request includes the destination, purpose, and data being sent. The human reviewer can approve (adding the destination to the allowlist for the mission duration), reject (blocking the connection), or modify (specifying alternative endpoints).",
        "This integration ensures that network access is not granted by default but requires explicit authorization for each connection. It also provides accountability: every allowed connection is logged with the reviewer's identity and the decision rationale.",
        "The system supports time-bounded allowances: a destination can be allowed for a specific mission or time period, after which it automatically returns to DENY status. This prevents stale allowlist entries from persisting indefinitely."
      ]
    }
  ],
  "faq": [
    {
      "question": "What are network egress controls?",
      "answer": "Default-deny network firewall allowing agent tool requests only to approved, domain-allowlisted endpoints, stopping data exfiltration attacks where compromised code attempts to curl environment variables to remote adversary servers."
    },
    {
      "question": "How does the allowlist work?",
      "answer": "The allowlist is configured per mission/repository/organization, permitting requests to essential service endpoints and internal microservices while denying all others. It supports dynamic updates, per-repository configurations, and organization-wide policies."
    },
    {
      "question": "How are data exfiltration attacks prevented?",
      "answer": "The system prevents DNS tunneling, HTTP data exfiltration, and out-of-band channels. Each connection attempt is logged, and anomalous patterns trigger security alerts."
    },
    {
      "question": "How does integration with permissions work?",
      "answer": "Network requests are classified as ASK by default. Human reviewers can approve, reject, or modify the connection, which includes adding the destination to the allowlist for the mission duration. Allowances are time-bounded and automatically return to DENY."
    },
    {
      "question": "Can developers request new allowlist entries?",
      "answer": "Yes. Developers can submit allowlist requests through a configured process, which includes justifying the destination, purpose, and data volume. Requests are reviewed and either approved (adding to allowlist) or rejected (with explanation)."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};