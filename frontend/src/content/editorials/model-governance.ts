import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const modelGovernance: PillarEditorial = {
  "pillarId": "model-governance",
  "updated": "2026-09-24",
  "definition": "Vendor management, SLA tracking, failover orchestration, and license compliance audits for all models in the agent pool — ensuring the organization is never locked into a single AI vendor and can migrate seamlessly as frontier models evolve.",
  "sections": [
    {
      "heading": "Model Governance Fundamentals",
      "paragraphs": [
        "Model governance provides the framework for managing AI models throughout their lifecycle, from evaluation and selection to retirement and replacement. In enterprise deployments where multiple AI models serve different agent capabilities, it is essential to have systematic control over model vendors, service-level agreements, failover mechanisms, and license compliance. Without model governance, organizations risk vendor lock-in, unexpected cost escalations, regulatory non-compliance, and operational failures when models become unavailable or degraded. Model governance ensures that the organization maintains sovereignty over its AI infrastructure, with clear policies and automated controls for model selection, monitoring, and migration.",
        "The need for model governance arises from the limitations of ad-hoc model management: inconsistent vendor evaluation criteria, no centralized SLA tracking, manual failover procedures, and no visibility into license usage. Model governance replaces these patterns with a first-class system that is built into the agent runtime, ensuring that model management is not an afterthought but a built-in capability. The framework is designed to be model-agnostic and can be integrated with any model provider, runtime, or orchestration platform.",
        "Key principles: vendor diversification (no single point of failure), SLA monitoring (automated tracking of uptime, latency, and cost), failover orchestration (automatic switching to backup models), license compliance (automated audit of model usage against license terms), and model catalog (centralized registry of all available models with their capabilities and constraints)."
      ]
    },
    {
      "heading": "Vendor Management and Model Catalog",
      "paragraphs": [
        "The model catalog provides a centralized registry of all available models in the agent pool, including their capabilities (code generation, chat, analysis, etc.), performance characteristics (latency, throughput, quality metrics), cost structure (per-token pricing, subscription fees), and constraints (context window size, modality support). Each model entry includes: model identifier (unique name or provider identifier), version (model version string), capabilities (structured list of supported tasks), performance metrics (benchmarks on relevant evaluation datasets), pricing (per-token cost, subscription fees, minimum commitments), constraints (context window, output length, modalities), and provider information (company, contact, support level). The model catalog is continuously updated from provider APIs and manual reviews, and is searchable by capability and cost, enabling agents to select the optimal model for each task.",
        "Vendor management extends the model catalog with policies and procedures for evaluating, selecting, and retiring vendors. The vendor evaluation process includes: capability assessment (does the model support the required tasks?), performance validation (benchmarks against organizational standards), cost analysis (total cost of ownership including compute, licensing, and operational overhead), risk assessment (security, privacy, and regulatory risks), and due diligence (vendor reputation, SLA track record, compliance certifications). Vendor contracts are tracked with start date, end date, renewal terms, and termination conditions. The system supports vendor rating and review, enabling teams to provide feedback on model performance and reliability, which feeds into future selection decisions.",
        "Model retirement procedures ensure that deprecated models are systematically removed from the agent pool: deprecation announcements (provider notification with end-of-life date), migration planning (transition to replacement models), capability fallback (temporary fallback to alternative models during migration), and compliance verification (ensuring no active missions depend on the retiring model). Retired models remain available for audit and historical reference but are excluded from new mission model selection."
      ]
    },
    {
      "heading": "SLA Tracking and Failover Orchestration",
      "paragraphs": [
        "SLA (Service Level Agreement) tracking provides automated monitoring of model uptime, latency, and cost. The SLA monitor collects metrics from model providers in real-time: availability percentage (uptime), average latency (request-response time), error rates (failed requests, timeouts), throughput (tokens per second), and cost per token (actual spending vs. budgeted). SLA alerts are triggered when metrics exceed configurable thresholds: availability below 99.9%, latency above 2 seconds, error rate above 1%, cost overruns exceeding budget by 20%. Failover orchestration automatically switches to backup models when SLA thresholds are breached: the agent runtime queries the model catalog for eligible backup models, evaluates their capabilities and constraints, and transitions the mission to the backup model with minimal disruption. The failover process includes state preservation (saving current mission state), model transition (switching inference to the backup model), and verification (running a quick validation to ensure the backup model produces consistent results). Failover logs are recorded in the audit ledger, providing a complete record of SLA breaches and failover events.",
        "The failover orchestration system supports configurable failover policies: immediate failover (switch to backup model instantly on SLA breach), graceful degradation (continue with current model at reduced capability), and hybrid approach (combine current and backup models for parallel processing). Failover policies can be specified per mission, per agent type, or globally for the organization. The system also supports manual failover override: operators can manually trigger failover or override automatic failover decisions from the observability dashboard.",
        "Multi-model routing enables intelligent model selection based on task requirements, cost, and SLA: the routing engine evaluates the task specification (required capabilities, quality level, cost constraint), consults the model catalog and SLA tracker, and selects the optimal model. The routing engine considers: capability match (does the model support the required tasks?), cost efficiency (what is the cost per task at different quality levels?), SLA compliance (will the model meet the required latency and availability?), and load balancing (what is the current load on each model). The routing engine can also perform A/B testing to compare model performance on active missions, providing data-driven insights for model selection optimization."
      ]
    },
    {
      "heading": "License Compliance and Audit Reports",
      "paragraphs": [
        "License compliance ensures that model usage conforms to the terms of the model provider's license agreement. The license compliance system tracks: model usage per mission (token count, duration, frequency), license terms (per-token limits, subscription limits, geographical restrictions), compliance status (compliant, warning, violation), and violation details (which missions exceeded limits, by how much, and when). Automated compliance checks run on every mission completion: the system computes the total tokens used by each model, compares against the license terms, and reports any violations. License compliance reports are generated on-demand or scheduled (daily, weekly, monthly), and include: model usage summary (total tokens per model, per mission), license terms (per-token limits, subscription limits), compliance status for each model, violation details with remediation recommendations, and executive summary (high-level compliance status with key metrics and findings). Reports are available in PDF, JSON, and platform-specific formats, and are accessible through the observability dashboard or API.",
        "The system also supports bring-your-own-model (BYOM) scenarios: organizations can register their own self-hosted models in the model catalog, with license terms specified internally. BYOM models are treated the same as provider models for SLA tracking and failover, but license compliance is self-reported based on organizational audit. The system provides BYOM license templates and compliance checklists to guide internal audit processes.",
        "Audit reports provide comprehensive visibility into model governance compliance: SOC 2 Type II evidence (control effectiveness for model management), ISO 27001 evidence (information security management for AI assets), and custom compliance frameworks (organization-specific requirements). Audit reports include: model inventory (all models in the pool with their vendors and licenses), SLA compliance summary (breaches, failovers, resolution times), license compliance status (compliant/warning/violation counts), failover event log (complete record of all failover events with causes and resolutions), and cost analysis (model spending by vendor, per mission, and trends). Audit reports are essential for regulated industries (financial services, healthcare, government) and provide third-party assurance to customers, regulators, and stakeholders."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is model governance?",
      "answer": "Vendor management, SLA tracking, failover orchestration, and license compliance audits for all models in the agent pool, ensuring the organization is never locked into a single AI vendor and can migrate seamlessly as frontier models evolve."
    },
    {
      "question": "How does the model catalog work?",
      "answer": "The model catalog provides a centralized registry of all available models, including capabilities, performance characteristics, cost structure, and constraints. Each model entry includes model identifier, version, capabilities, performance metrics, pricing, constraints, and provider information. The catalog is searchable by capability and cost, enabling agents to select the optimal model for each task."
    },
    {
      "question": "How does SLA tracking work?",
      "answer": "SLA tracking provides automated monitoring of model uptime, latency, and cost. The SLA monitor collects metrics from model providers in real-time and triggers alerts when metrics exceed configurable thresholds. Failover orchestration automatically switches to backup models when SLA thresholds are breached."
    },
    {
      "question": "What failover policies are available?",
      "answer": "The system supports immediate failover (switch instantly on SLA breach), graceful degradation (continue with current model at reduced capability), and hybrid approach (combine current and backup models for parallel processing). Policies can be specified per mission, per agent type, or globally."
    },
    {
      "question": "How is license compliance monitored?",
import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const modelGovernance: PillarEditorial = {
  "pillarId": "model-governance",
  "updated": "2026-09-24",
  "definition": "Comprehensive governance framework for AI models covering monitoring, compliance, and cost controls — enabling audit-ready oversight of model deployments and usage patterns across the organization.",
  "sections": [
    {
      "heading": "Model Governance Fundamentals",
      "paragraphs": [
        "Model governance provides the framework for monitoring, compliance, and cost controls for AI model deployments across an organization. Without structured governance, model usage can become opaque, making it difficult to track performance, ensure compliance, or manage costs effectively. The governance framework ensures that: model behavior is monitored and logged, compliance requirements (SOC 2, ISO 27001, HIPAA, GDPR) are met, and spending is tracked and controllable. This framework is essential for any organization running multiple AI models in production, where oversight must scale across teams, projects, and missions.",
        "The need for model governance arises from the limitations of informal model management: no centralized tracking of model usage, no visibility into compliance gaps, and no systematic approach to cost containment. Model governance replaces these patterns with a first-class system that provides comprehensive oversight of the entire model lifecycle, from deployment through retirement. The framework is designed to be framework-agnostic and can be integrated with any model serving infrastructure, observability platform, or financial system.",
        "Key principles: centralized visibility (single pane of glass for all model monitoring), compliance tracking (automated checks against regulatory frameworks), cost transparency (granular breakdown of model spending), and audit readiness (structured data enabling compliance reports)."
      ]
    },
    {
      "heading": "Model Monitoring and SLA Tracking",
      "paragraphs": [
        "The model monitoring subsystem tracks operational metrics for every deployed model: uptime and availability (percentage of time the model is responsive), latency percentiles (p50, p95, p99 response times), error rates (per-model and per-endpoint failures), and throughput (requests per second). SLA tracking compares actual performance against agreed-upon service level agreements, triggering alerts when thresholds are breached. The monitoring system stores historical data enabling trend analysis and capacity planning. Operators can query the observability dashboard to see real-time status and historical trends for any model in the catalog.",
        "Alerting is configured per SLA dimension: latency breaches trigger warnings when p99 exceeds the threshold, error rate breaches trigger critical alerts, and uptime violations trigger system-level notifications. All alerts include the affected model, the metric that breached, the current value, and the SLA target. Alert history is maintained for trend analysis and continuous improvement of SLA targets."
      ]
    },
    {
      "heading": "License Compliance and License Tracking",
      "paragraphs": [
        "Model governance extends to license compliance, ensuring that all model usage respects the terms of the underlying model licenses. The license tracker maintains: per-model license identifiers (the exact license under which each model is distributed), usage metrics (token consumption per model per time period), compliance status (COMPLIANT, WARNING, VIOLATION), and violation details (which license terms are being breached). The system compares actual usage against license terms (e.g., per-token limits, subscription minima, redistribution restrictions) and flags potential violations before they become legal risks. License compliance reports can be generated on-demand or scheduled, providing evidence of compliance for auditors and regulators.",
        "The system also supports license versioning: when a model is updated to a new version, the license terms may change. The tracker identifies version migrations and ensures that the new version's license terms are understood and accepted before the model is deployed. This prevents accidental migration to a license that doesn't match the organization's usage patterns."
      ]
    }
  ],
  "faq": [
    {
      "question": "How are audit reports generated for compliance frameworks?",
      "answer": "Audit reports synthesize data from the model catalog, SLA tracker, and license compliance system into framework-specific formats (SOC 2, ISO 27001, custom). Reports include model inventory, SLA compliance summary, license compliance status, failover event log, and cost analysis, accessible through the observability dashboard or API."
    },
    {
      "question": "Does model governance include cost governance and budget tracking?",
      "answer": "Yes. Model governance extends to cost governance, providing automated tracking and budget controls for AI model spending. The cost governance system tracks: per-model token consumption (daily, weekly, monthly totals), cost per model (including per-token pricing, subscription fees, and minimum commitments), budget thresholds (per-team, per-project, or organizational budget caps), spending alerts (notifications when thresholds are exceeded), and cost forecasts (predicted spending based on current usage trends). Budget thresholds can be configured as hard caps (automatic model switching when exceeded) or soft caps (alerts only, with continued operation). Cost forecasts use current usage patterns to predict monthly spending, enabling proactive budget planning and resource allocation. The system also supports cost allocation by project, team, or mission, providing granular visibility into which missions and teams are driving AI costs. Cost reports are generated on-demand or scheduled (daily, weekly, monthly), and include: cost breakdown by model, cost trends over time, budget vs. actual comparison, and optimization recommendations (e.g., switching to lower-cost models for suitable tasks, adjusting usage patterns to stay within budget). Cost governance integrates with financial systems for chargeback to project budgets and organizational cost centers, enabling transparent AI cost allocation across the organization."
    },
    {
      "question": "How does the anomaly detection system work in cost governance?",
      "answer": "The cost governance system also supports anomaly detection: machine learning models identify unusual spending patterns (e.g., sudden spike in token consumption, unexpected model version usage, cost outliers compared to historical trends). Anomaly alerts are triggered when spending deviates from the expected range by more than a configurable threshold (e.g., 20% above the rolling 7-day average). Anomaly details include: the affected model, the time period, the deviation magnitude, and suggested investigation steps. Anomaly history is maintained for trend analysis and continuous improvement of the cost governance model."
    }
  ]
};
