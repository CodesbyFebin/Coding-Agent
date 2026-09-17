// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const codingagentDpdpCompliance = {
    "pillarId": "codingagent-dpdp-compliance",
    "updated": "2026-09-24",
    "definition": "Digital Personal Data Protection (DPDP)-oriented control framework designed around zero-cross-border-telemetry goals, data principal rights, and audit trails — ensuring enterprise codebases and developer data strictly adhere to Indian data protection legislation.",
    "sections": [
        {
            "heading": "DPDP Compliance Fundamentals",
            "paragraphs": [
                "The Digital Personal Data Protection (DPDP) Act represents India's comprehensive data protection legislation, establishing data principal rights and cross-border telemetry restrictions. For enterprises using AI coding agents, DPDP compliance means ensuring that no developer code, prompts, or telemetry data crosses Indian borders without explicit authorization, and that all audit trails are maintained for compliance verification. The DPDP-oriented control framework provides the architectural mechanisms to achieve this compliance.",
                "Key DPDP principles include: data minimization (only collect and process data that is strictly necessary), purpose limitation (data can only be used for the specified purpose), cross-border restriction (personal data cannot be transferred outside India without adequate safeguards), and audit accountability (every data access and processing event must be logged and auditable). The framework ensures that CodingAgent's operation respects these principles by default."
            ]
        },
        {
            "heading": "Zero-Cross-Border Telemetry",
            "paragraphs": [
                "Zero-cross-border-telemetry is a core design goal: agent telemetry, model prompts, and code analysis results must remain within Indian infrastructure boundaries. The architecture enforces this through: regional model deployment (models hosted on Indian cloud regions), data egress controls (firewall rules preventing outbound data transmission to non-Indian endpoints), and telemetry scrubbing (automatically removing or masking personal identifiers from telemetry data before any potential external transmission).",
                "The system provides: geographical routing of model requests (ensuring model API calls route through Indian infrastructure), data residency enforcement (audit logs and mission state stored only on Indian storage), and compliance reporting (pre-generated reports demonstrating DPDP adherence for audit purposes). This is essential for government departments and regulated enterprises that cannot have any data leave Indian jurisdiction."
            ]
        },
        {
            "heading": "Data Principal Rights Management",
            "paragraphs": [
                "The DPDP Act establishes rights for data principals (the individuals whose data is collected): right to access (request a copy of their data), right to correction (request corrections to inaccurate data), right to erasure (request data deletion), and right to grievance (file complaints about data processing). The CodingAgent framework supports these rights through: user-profile-linked telemetry (all telemetry is linked to a verified user identity), data access logging (every access event is logged with the user's identity and purpose), data deletion workflows (secure erasure of user data upon request), and grievance tracking (structured process for handling data-related complaints).",
                "The framework ensures that agents respect these rights by: not storing personally identifiable information (PII) in model prompts, automatically redacting PII from telemetry, and providing export/deletion tools that integrate with the organization's identity management system (SSO, SAML, LDAP)."
            ]
        },
        {
            "heading": "Compliance Reporting and Audit",
            "paragraphs": [
                "The DPDP compliance reporting system provides pre-generated reports demonstrating adherence to the act: data flow maps (visual diagram of where data flows within the organization and whether any cross-border transmission occurs), consent records (documentation of user consent for data processing), audit logs (comprehensive records of all data access and processing events), and breach assessment tools (automated assessment of whether a data incident constitutes a reportable breach under the DPDP Act). These reports can be generated on demand or scheduled periodically (daily, weekly, monthly) for compliance auditors.",
                "The reporting system supports: export in formats required by Indian regulators (structured JSON, CSV for government portals), integration with compliance management platforms (ServiceNow, Archer, custom enterprise systems), and automated alerting when data processing deviates from the permitted scope (e.g., unexpected cross-border transmission, unauthorized access to sensitive data categories). All reports are cryptographically signed for integrity verification."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is DPDP compliance?",
            "answer": "Digital Personal Data Protection (DPDP)-oriented control framework designed around zero-cross-border-telemetry goals, data principal rights, and audit trails, ensuring enterprise codebases and developer data strictly adhere to Indian data protection legislation."
        },
        {
            "question": "How is cross-border telemetry prevented?",
            "answer": "Through regional model deployment (Indian cloud regions), data egress controls (firewall rules), and telemetry scrubbing (automatically removing personal identifiers from data before external transmission)."
        },
        {
            "question": "What data principal rights are supported?",
            "answer": "Right to access, right to correction, right to erasure, and right to grievance. The framework provides user-profile-linked telemetry, data access logging, deletion workflows, and grievance tracking."
        },
        {
            "question": "Can this support government compliance?",
            "answer": "Yes. The framework supports government departments and regulated enterprises with air-gapped deployment, audit-ready logging, and compliance reporting in formats required by Indian regulators."
        },
        {
            "question": "How are compliance reports generated?",
            "answer": "Pre-generated reports including data flow maps, consent records, audit logs, and breach assessment tools. Can be generated on demand or scheduled periodically. All reports are cryptographically signed for integrity."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
