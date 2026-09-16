import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const agentCostGovernance: PillarEditorial = {
  "pillarId": "agent-cost-governance",
  "updated": "2026-09-24",
  "definition": "Real-time token cost attribution, budget thresholds, cost forecasting, and automated throttling for developer teams — preventing end-of-month cloud billing surprises by setting hard budget caps on per-developer or per-repository agent runs.",
  "sections": [
    {
      "heading": "Agent Cost Governance Fundamentals",
      "paragraphs": [
        "Agent cost governance provides the financial controls necessary to prevent end-of-month cloud billing surprises when running autonomous coding agents at scale. The system tracks token consumption in real-time, attributes costs to the appropriate budget level, and enforces hard budget caps that prevent any single user or team from consuming disproportionate resources. This is essential for enterprise deployments where thousands of agents run daily and uncontrolled token consumption can result in significant unexpected costs.",
        "The cost governance framework includes: real-time token consumption monitoring (tracked per mission, per team, per project), multi-level budget allocation (organization-wide budget, per-team budgets, per-project budgets, per-mission-type budgets), configurable alerting thresholds (notifications when budgets are approached or exceeded), and automatic enforcement (throttling or stopping missions when budgets are exhausted). Cost governance also includes detailed expense reporting that breaks down costs by model type, geographic region, and time period, enabling finance teams to understand the true cost of AI-enabled development. Metrics such as cost per token, cost per mission, and cost per developer team are tracked and displayed on the observability dashboard, providing granular visibility into spending patterns."
      ]
    },
    {
      "heading": "Budget Allocation and Attribution",
      "paragraphs": [
        "Budget allocation is configurable at multiple levels: organization-wide budget sets the absolute ceiling, per-team budgets divide the organization's allocation among development teams, per-project budgets assign portions to specific codebases or initiatives, and per-mission-type budgets assign costs to specific mission categories (refactoring, testing, documentation, etc.). This multi-level approach ensures that no single team or project can consume the entire organization's budget.",
        "Cost attribution tracks token consumption to the appropriate budget level: a mission run by a developer on a specific project consumes that project's budget. This attribution supports chargeback/showback models where teams are accountable for their agent costs, and it enables granular reporting on which mission types consume the most tokens. Advanced attribution can track costs down to the individual developer level, providing visibility into per-developer token consumption patterns and enabling personalized budgeting. Cost allocation policies can be configured per repository, per branch, or per environment (development, staging, production), providing fine-grained control over resource utilization."
      ]
    },
    {
      "heading": "Alerting and Enforcement",
      "paragraphs": [
        "The system provides configurable alerting thresholds: warning alerts (notify when budget is 80% consumed), critical alerts (notify when budget is 95% consumed), and enforcement alerts (automatically throttle or stop missions when budget is exhausted). Alerts are delivered through configured channels: web dashboard, email, Slack/Teams integration, or PagerDuty notifications.",
        "Enforcement actions include: mission throttling (reduce the rate of new mission submissions), mission pausing (pause all missions for a specific team or project), and mission stopping (terminate missions that exceed the budget). All enforcement actions are logged in the audit trail with the reason, the budget level at the time, and the operator identity (if applicable). The system also supports budget override: a senior administrator can temporarily increase or reset a budget cap with proper justification and approval. Overrides are logged and time-bounded, automatically reverting after a configured duration. For organizations with compliance requirements, enforcement actions can be configured to require dual approval, ensuring that no single individual can unilaterally override budget constraints."
      ]
    },
    {
      "heading": "Cost Forecasting and Optimization",
      "paragraphs": [
        "Cost forecasting uses historical consumption patterns to predict future token usage and associated costs. The system provides: daily/weekly/monthly consumption projections with confidence intervals, cost per mission type (refactoring, testing, documentation, etc.), and cost trends over time (increasing, decreasing, stable). This data supports both operational management (daily budget adjustments) and strategic planning (investment in hardware reserves or model governance). Forecasting models incorporate seasonality patterns, such as increased development activity during sprint planning periods, and can factor in planned feature work that is expected to increase or decrease agent usage. Advanced forecasting can integrate project timelines and release schedules to provide more accurate cost predictions aligned with business objectives.",
        "Cost optimization techniques include: model quantization (running quantized models to reduce token consumption per output token), prompt caching (reusing previous inference results for identical or similar prompts to avoid recomputation), context compaction (pruning non-essential context to reduce token count while preserving essential information), and mission batching (combining similar missions to reduce overhead and amortize fixed costs). The observability dashboard reports the effectiveness of optimization efforts over time, showing cost savings attributed to each technique and enabling data-driven decisions about which optimizations to prioritize. Organizations can also implement model routing strategies that select the most cost-effective model for each mission type based on quality requirements and budget constraints."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is agent cost governance?",
      "answer": "Real-time token cost attribution, budget thresholds, cost forecasting, and automated throttling for developer teams, preventing end-of-month cloud billing surprises by setting hard budget caps on per-developer or per-repository agent runs."
    },
    {
      "question": "How are budgets allocated?",
      "answer": "Multi-level: organization-wide, per-team, per-project, and per-mission-type budgets. Each level can have its own alerting thresholds and enforcement policies."
    },
    {
      "question": "How does cost attribution work?",
      "answer": "Token consumption is attributed to the appropriate budget level (organization, team, project, mission-type), supporting chargeback/showback models where teams are accountable for their agent costs."
    },
    {
      "question": "What alerting thresholds are available?",
      "answer": "Warning at 80% consumption, critical at 95%, and automatic enforcement (throttling/stopping) at exhaustion. Alerts delivered via dashboard, email, Slack/Teams, or PagerDuty."
    },
    {
      "question": "Can budgets be overridden?",
      "answer": "Yes. A senior administrator can temporarily increase or reset a budget cap with proper justification and approval. Overrides are logged and time-bounded, automatically reverting after a configured duration."
    },
    {
      "question": "How does cost forecasting work?",
      "answer": "Cost forecasting uses historical consumption patterns with confidence intervals to predict future token usage and associated costs. The system provides daily/weekly/monthly projections, cost per mission type, and cost trends over time, supporting both operational management and strategic planning."
    },
    {
      "question": "What optimization techniques are available?",
      "answer": "Available optimization techniques include model quantization, prompt caching, context compaction, and mission batching. The observability dashboard reports the effectiveness of each technique, enabling data-driven decisions about which optimizations to prioritize based on cost savings and quality impact."
    }
  ],
};