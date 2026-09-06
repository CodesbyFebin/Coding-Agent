import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const agentObservability: PillarEditorial = {
  "pillarId": "agent-observability",
  "updated": "2026-09-06",
  "definition": "Deep structured telemetry capturing tokens consumed, latency per phase, tool call payloads, file diffs, sandbox metrics, verifier exit codes, and approval gate interactions — providing complete visibility into agent behavior for debugging, optimization, and compliance.",
  "sections": [
    {
      "heading": "Why Observability Matters for Agents",
      "paragraphs": [
        "AI coding agents are complex systems that make thousands of decisions during a single mission: which context to read, which plan to generate, which tools to invoke, which verification gates to run. Without comprehensive observability, understanding why an agent made a particular decision — or why it failed — is nearly impossible.",
        "Observability is not optional for production agent systems. It is essential for: debugging agent failures (understanding what went wrong and why), optimizing agent performance (identifying bottlenecks and inefficiencies), ensuring compliance (proving that governance controls were followed), and building trust (showing stakeholders exactly what the agent did).",
        "CodingAgent's observability system captures structured telemetry at every point in the agent's lifecycle: planning decisions, tool invocations, verification results, approval gate interactions, and state transitions. This telemetry is stored in a queryable format that supports both real-time monitoring and historical analysis.",
        "The observability system is designed to be useful to multiple audiences: developers debugging agent behavior, operators monitoring agent health, compliance officers verifying governance, and managers tracking team-level agent usage patterns."
      ]
    },
    {
      "heading": "Telemetry Data Model",
      "paragraphs": [
        "The telemetry data model captures five categories of data: mission telemetry (mission start/end, total duration, total tokens, final status), phase telemetry (duration and token consumption per phase: planning, execution, verification), tool telemetry (each tool invocation with arguments, return values, duration, and permission decision), verification telemetry (each verification gate with result, duration, and evidence), and approval telemetry (each approval request with decision, reviewer, and duration).",
        "Each telemetry event includes: timestamp, mission ID, agent ID, event type, event payload (structured data specific to the event type), and context (repository, branch, user). Events are stored in a time-series database optimized for range queries and aggregation.",
        "The data model supports both detailed inspection (viewing every tool invocation for a specific mission) and high-level aggregation (viewing total token consumption across all missions for a team in a month). This dual capability serves both debugging and management use cases.",
        "Telemetry data is retained according to configurable policies: detailed data for 30 days for debugging, aggregated data for 1 year for trend analysis, and audit-critical data (approval decisions, verification results) indefinitely for compliance."
      ]
    },
    {
      "heading": "Real-Time Monitoring",
      "paragraphs": [
        "The observability system provides real-time monitoring dashboards that show: active missions and their current state, token consumption rates, tool invocation rates, verification pass/fail rates, and approval gate wait times. These dashboards update in real-time through server-sent events (SSE).",
        "Alerting rules can be configured for anomalous conditions: token consumption exceeding thresholds (potential runaway agent), verification failure rates above baseline (potential agent degradation), approval wait times exceeding SLAs (potential approval bottleneck), and error rates above acceptable levels.",
        "Real-time monitoring also supports live mission inspection: clicking on an active mission shows its current state, the work units completed and pending, the tools invoked so far, and the verification results so far. This live view allows operators to intervene if a mission is heading in the wrong direction.",
        "The monitoring system integrates with existing observability platforms (Datadog, Grafana, PagerDuty) through standard export formats, allowing teams to use their existing monitoring infrastructure rather than learning a new system."
      ]
    },
    {
      "heading": "Historical Analysis and Debugging",
      "paragraphs": [
        "Historical analysis allows teams to understand agent behavior over time: which mission types are most common, which verification gates fail most often, which tools consume the most tokens, and how agent performance changes over time. This analysis informs configuration tuning and process improvement.",
        "Debugging a specific mission is supported through mission replay: the complete sequence of events for a mission can be reconstructed from telemetry data, showing exactly what the agent did, in what order, with what results. This replay capability is essential for understanding complex failures.",
        "Trend analysis identifies patterns: if verification failure rates are increasing over time, it might indicate that the agent's model is degrading or that the codebase is becoming more complex. If token consumption is increasing, it might indicate that context management needs improvement.",
        "The analysis system supports export to standard formats (CSV, JSON) for integration with external analysis tools. It also supports custom queries through a query language that allows filtering, grouping, and aggregation of telemetry data."
      ]
    },
    {
      "heading": "Cost Attribution and Optimization",
      "paragraphs": [
        "Token consumption is the primary cost driver for agent systems. The observability system attributes token consumption to: missions (which missions consumed the most tokens), phases (which phases consumed the most tokens), tools (which tool invocations consumed the most tokens), and teams (which teams consumed the most tokens).",
        "This attribution enables cost optimization: if planning consumes 60% of tokens but produces plans that are always approved, the planning process can be optimized. If a particular tool invocation consistently consumes many tokens, alternative approaches can be explored.",
        "Budget alerts notify teams when token consumption approaches configured thresholds, preventing unexpected cost overruns. Budget policies can be set per team, per project, or per mission type, with automatic throttling when budgets are approached.",
        "Cost attribution data is presented through dashboards that show: daily/weekly/monthly token consumption, cost per mission type, cost per team, and cost trends over time. This data supports both operational management and strategic planning."
      ]
    },
    {
      "heading": "Compliance and Audit Reporting",
      "paragraphs": [
        "The observability system generates compliance reports that demonstrate: all agent actions were within configured permission boundaries, all required verification gates were executed, all approval gates were properly routed and decided, and all audit records are intact and untampered.",
        "Reports are generated in standard formats suitable for regulatory submission: SOC 2, ISO 27001, HIPAA, GDPR. The reports include cryptographic evidence of data integrity, chain-of-custody records for audit data, and attestation of governance control effectiveness.",
        "Automated compliance checking continuously verifies that agent operations comply with configured policies. Violations are flagged immediately and included in compliance reports. This continuous checking provides stronger assurance than periodic manual audits.",
        "The compliance reporting system supports multi-tenant deployments: each tenant's compliance data is isolated and can be reported independently. This isolation is essential for SaaS deployments where multiple organizations share the same infrastructure."
      ]
    }
  ],
  "faq": [
    {
      "question": "What does CodingAgent observability capture?",
      "answer": "Complete structured telemetry: tokens consumed, latency per phase, tool call payloads with arguments and return values, file diffs, sandbox metrics, verifier exit codes, approval gate interactions, and state transitions. All events are timestamped and queryable."
    },
    {
      "question": "How does real-time monitoring work?",
      "answer": "Dashboards update in real-time through server-sent events showing active missions, token rates, tool invocation rates, verification pass/fail rates, and approval wait times. Configurable alerts notify on anomalous conditions."
    },
    {
      "question": "Can I debug a specific mission?",
      "answer": "Yes. Mission replay reconstructs the complete sequence of events from telemetry data, showing exactly what the agent did, in what order, with what results. This is essential for understanding complex failures."
    },
    {
      "question": "How does cost attribution work?",
      "answer": "Token consumption is attributed to missions, phases, tools, and teams. Budget alerts prevent cost overruns. Dashboards show daily/weekly/monthly consumption and trends for operational and strategic management."
    },
    {
      "question": "Does observability support compliance reporting?",
      "answer": "Yes. Automated compliance reports demonstrate governance control effectiveness in standard formats (SOC 2, ISO 27001, HIPAA, GDPR). Continuous compliance checking flags violations immediately."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
