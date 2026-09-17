"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codingagentModelGovernance = void 0;
// Editorial converted from the reviewed pillar-database source. Claim-audited.
exports.codingagentModelGovernance = {
    "pillarId": "model-governance",
    "updated": "2026-09-24",
    "definition": "Vendor management, SLA tracking, failover orchestration, and license compliance audits for all models in the agent pool — ensuring the organization is never locked into a single AI vendor and can migrate seamlessly as frontier models evolve.",
    "sections": [
        {
            "heading": "Model Governance Fundamentals",
            "paragraphs": [
                "Model governance provides the organizational and technical framework for managing multiple AI model vendors, ensuring that the organization is never locked into a single AI provider and can migrate seamlessly as frontier models evolve. The framework covers: vendor management (tracking all model providers, their capabilities, pricing, and SLAs), SLA monitoring (continuous evaluation of model performance against Service Level Agreements), failover orchestration (automatic switching to alternative models when primary models degrade or become unavailable), and license compliance auditing (verifying that model usage complies with license terms and restrictions).",
                "The governance framework is essential for enterprises that rely on AI agents for critical workflows: vendor lock-in can be costly and limiting, model performance can degrade over time, and license non-compliance can result in legal and financial penalties. The model governance framework ensures that the organization maintains control over its AI infrastructure."
            ]
        },
        {
            "heading": "Vendor Management and Evaluation",
            "paragraphs": [
                "The vendor management system tracks all model providers in the organization's agent pool: provider name, model names and versions, capability matrix (what task types each model supports), pricing tier (per-token costs, subscription fees, enterprise discounts), SLA metrics (latency, availability, error rates), and license terms (usage restrictions, redistribution rights, expiration dates). The system provides: vendor comparison reports, capability gap analysis (which task types are not covered by any current vendor), and renewal tracking (alerts before license expiration).",
                "The evaluation process: regular benchmark evaluations (syntax accuracy, API correctness, task completion rates), performance monitoring (real-time latency and availability tracking), cost analysis (monthly spend per model, cost per task type), and compliance verification (license terms adherence). Evaluation results are recorded and used to inform vendor selection and migration decisions."
            ]
        },
        {
            "heading": "SLA Monitoring and Failover Orchestration",
            "paragraphs": [
                "The SLA monitoring system continuously evaluates model performance against the organization's Service Level Agreements: latency percentiles (p95, p99 latency targets), availability targets (uptime guarantees, e.g., 99.9%), error rate thresholds (maximum acceptable failure rate), and cost per token budgets (budget alerts when per-token costs exceed thresholds). The system provides real-time dashboards and alerting (via webhook, email, Slack/Teams) when SLA metrics approach or exceed thresholds.",
                "Failover orchestration automatically switches to alternative models when primary models degrade or become unavailable: health check probes (pre-dispatch verification that the model provider is operational), automatic model switching (seamless transition to an alternative model with compatible capabilities), and session state preservation (maintaining conversation context during failover). The failover logic is configurable: organizations can specify primary/backup model pairs, failure thresholds, and fallback strategies (best-cost, best-quality, round-robin).",
                "The failover orchestration ensures that agent missions are not interrupted by model provider outages, and that performance remains within the organization's acceptable bounds. All failover events are logged in the audit trail with the reason for failover, the models involved, and the duration of the switch."
            ]
        },
        {
            "heading": "License Compliance Auditing",
            "paragraphs": [
                "The license compliance auditing system verifies that model usage complies with the terms and restrictions of each model's license: usage limit monitoring (tracking tokens consumed against the license limit), redistribution rights verification (ensuring that generated code is not redistributed in violation of the license), geographic restrictions (ensuring that model usage complies with regional licensing terms), and audit report generation (periodic compliance reports for legal review). The system provides: real-time usage tracking (current token consumption against license limits), compliance violation alerts (when usage approaches or exceeds limits), and audit log integration (all compliance events recorded in the mission audit trail).",
                "The system supports: license expiration alerts (notifications before license expiration), multi-license management (tracking usage across multiple licenses from different vendors), and compliance report export (structured reports for legal and financial review). All compliance data is integrated with the organization's existing governance and financial systems."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is model governance?",
            "answer": "Vendor management, SLA tracking, failover orchestration, and license compliance audits for all models in the agent pool, ensuring the organization is never locked into a single AI vendor."
        },
        {
            "question": "How does failover orchestration work?",
            "answer": "Automatic switching to alternative models when primary models degrade or become unavailable, with health check probes, automatic model switching, and session state preservation. Configurable: primary/backup pairs, failure thresholds, and fallback strategies."
        },
        {
            "question": "What SLA metrics are monitored?",
            "answer": "Latency percentiles (p95, p99), availability targets (e.g., 99.9%), error rate thresholds, and cost per token budgets. Real-time dashboards and alerting via webhook, email, or Slack/Teams."
        },
        {
            "question": "How is license compliance ensured?",
            "answer": "Through real-time usage tracking against license limits, compliance violation alerts, audit report generation, and integration with the organization's governance and financial systems."
        },
        {
            "question": "Can I switch models without code changes?",
            "answer": "Yes. The model governance framework is designed for vendor neutrality: the same agent code can use any model in the pool, with configuration changes only (model name, API endpoint, authentication)."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
