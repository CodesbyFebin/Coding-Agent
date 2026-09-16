import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const auditLogsProvenance: PillarEditorial = {
  "pillarId": "audit-logs-provenance",
  "updated": "2026-09-24",
  "definition": "Tamper-evident audit logging system recording every agent action, tool invocation, approval decision, and verification result — with cryptographic hash chaining for integrity, searchable indices for investigation, and export formats for compliance audits.",
  ,    {"heading": "Forensic Investigation and Incident Response Support", "paragraphs": ["Audit logs and provenance data provide critical support for forensic investigations when security incidents occur. The system enables rapid incident response through advanced query capabilities allowing security teams to reconstruct complete timelines of agent actions identify attack vectors and determine compromise scope. Forensic analysts can trace tool invocation chains from initial compromise through data exfiltration mapping the complete kill chain. The system supports automated threat hunting queries identifying anomalous patterns such as unusual tool combinations rapid permission escalations or attempts to access sensitive data repositories. All forensic investigations maintain chain of custody through cryptographically signed audit logs ensuring evidence admissibility in legal proceedings."],"bullets": ["Complete timeline reconstruction", "Kill chain mapping", "Automated threat hunting", "Anomalous pattern detection", "Chain of custody preservation"]}","faq": [
    {
      "question": "What is audit log provenance?",
      "answer": "Tamper-evident audit logging system recording every agent action, tool invocation, approval decision, and verification result, with cryptographic hash chaining for integrity, searchable indices for investigation, and export formats for compliance audits. The system ensures that no action goes unrecorded and that the full context of any mission is available for later analysis."
    },
    {
      "question": "How does cryptographic integrity work?",
      "answer": "Each audit log entry includes a SHA-256 hash of the previous entry's content concatenated with the current entry's content, forming a tamper-evident chain. Any modification to a past entry breaks the hash chain, as each subsequent entry's hash depends on the previous entry's hash. The system validates the hash chain on every new entry, and any inconsistency triggers an alert to the security team. The genesis hash is persisted in tamper-evident storage (e.g., write-once media, blockchain-anchored hash), ensuring continuous integrity even across mission boundaries."
    },
    {
      "question": "How can I investigate a specific mission?",
      "answer": "Use the observability dashboard's 'investigate mission' workflow, which shows all audit log entries for a specific mission ID in chronological order, with filtering by event type and content search. Pre-built workflows ('find approval anomalies', 'find policy violations') reduce investigation time from hours to minutes."
    },
    {
      "question": "What export formats are available?",
      "answer": "The system can export audit log entries in JSON (programmatic analysis), CSV (spreadsheet analysis), or PDF (compliance reports), with configurable date ranges and event type filters."
    },
    {
      "question": "What retention periods are supported?",
      "answer": "Operational logs: 90 days; Compliance archives: 1+ years; Eternal retention: available for critical missions with immutable storage. Retention policies are configurable per organization and auditable themselves."
    },
    {
      "question": "Can I search within audit log content?",
      "answer": "Yes. The system supports full-text search within event data, enabling queries like 'find all tool invocations that wrote to sensitive paths' or 'find all approval denials with rationale containing network'."
    },
    {
      "question": "Does the system support compliance frameworks?",
      "answer": "Yes. The system can be configured to meet SOX, HIPAA, GDPR, and other regulatory requirements, with appropriate retention periods, export formats, and integrity guarantees. It also supports data anonymization for privacy compliance, enabling GDPR's right to be forgotten."
    },
    {
      "question": "What real-time alerting capabilities exist?",
      "answer": "The system can notify operators when specific patterns are detected in the log stream, such as a sudden increase in DENY evaluations, repeated tool invocation failures, or approval gate timeouts exceeding the configured threshold. Alerts can be delivered via web dashboard, email, Slack/Teams, or PagerDuty."
    },
    {
      "question": "How does the system support data anonymization for GDPR compliance?",
      "answer": "Personal data can be redacted from log entries while preserving the structural integrity of the audit trail. The system maintains a record of what was redacted and supports the right to be forgotten by ensuring that redacted entries remain queryable (by non-personal criteria) while the personal content itself is removed. This enables GDPR compliance without losing the investigative value of the audit trail."
    },
    {
      "question": "Can retention policies be configured per event type?",
      "answer": "Yes. The system supports configurable retention per event type: operational logs (90 days), compliance archives (1+ years), and eternal retention for critical missions. The system automatically transitions entries from operational to compliance storage and maintains an auditable record of the retention policy evolution."
    },
    {
      "question": "What compliance reports are available?",
      "answer": "Compliance reports summarize log coverage, retention status, and any gaps or issues that need to be addressed. Reports can be generated for specific time ranges, event types, or regulatory frameworks (SOX, HIPAA, GDPR). Reports include: total entries by event type, retention status (operational/compliance/eternal), gaps in the hash chain, redaction summary, and export links for each category."
    }
  ],
};

