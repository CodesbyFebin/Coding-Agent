import type { EditorialSection, PillarEditorial } from './types';

const FINAL_SECTIONS: Record<string, EditorialSection[]> = {
  'parallel-subagents': [
    {
      heading: 'Cost-aware concurrency and deterministic scheduling',
      paragraphs: [
        'Parallelism should be budgeted as carefully as it is scheduled. A parent mission can assign each work unit limits for wall-clock time, model tokens or local compute, tool calls, retry attempts, and expensive verifier runs. The scheduler then makes a deliberate trade-off between latency and resource consumption instead of spawning every eligible unit immediately. This matters for both cloud and sovereign local deployments: provider quotas can throttle a burst of agents, while a local GPU can lose throughput when too many workers contend for memory. Budget exhaustion should produce a visible task state and evidence record, not a silent downgrade to weaker verification.',
        'Deterministic scheduling does not require workers to finish in a fixed order, but it does require deterministic rules for what may start and what may be merged. The task graph can derive a ready set from completed predecessors, then apply stable priorities such as critical-path position, risk, resource fit, or user priority. If several workers are equally eligible, the scheduler can record the selected ordering and reason. This makes a production incident reproducible enough to answer why one unit ran before another even when the underlying execution remained concurrent.',
        'Speculative parallelism deserves a stricter rule. Running two alternative implementations of the same unit can be useful when the choice is genuinely uncertain, but both candidates must operate in isolated workspaces and the arbiter must evaluate them against the same predeclared acceptance criteria. The losing candidate is discarded without leaking its side effects into the integrated branch. Speculation should be opt-in because it deliberately multiplies compute and can make provenance confusing if candidate identities are not preserved.',
        'A concurrency review should therefore inspect more than maximum worker count. It should verify dependency declarations, resource classes, per-unit budgets, workspace isolation, lease semantics, merge ordering, cancellation propagation, and post-merge verification. Those properties determine whether a swarm behaves like a controlled build system or like several assistants editing the same repository at once. The goal is not the highest possible parallelism; it is the highest parallelism that keeps completion evidence understandable and reproducible.'
      ]
    }
  ],
  'human-approval-gates': [
    {
      heading: 'Approval evidence, delegation, and emergency controls',
      paragraphs: [
        'An approval record should be durable evidence rather than a transient UI event. Store the request identifier, mission and attempt, normalized action fingerprint, target resource, policy version, requester, reviewer, decision, timestamp, expiration, and any narrowed scope or conditions. If the proposed command or diff changes after approval, its fingerprint changes and the old decision no longer authorizes the new action. This prevents an agent from obtaining approval for a harmless preview and reusing it after materially modifying the operation.',
        'Delegation needs the same least-privilege treatment as tool access. A reviewer may be authorized to approve staging deployments but not production, or dependency updates but not credential rotation. Group membership alone should not imply universal approval authority. The approval service can evaluate reviewer role, organization, environment, action class, and separation-of-duties rules before accepting a decision. Where a workflow requires two independent reviewers, the runtime should enforce two distinct authenticated decisions rather than trusting a checkbox in the user interface.',
        'Emergency procedures should be explicit and rare. A break-glass path may be appropriate for time-critical recovery, but it should require strong authentication, a constrained scope, short expiry, a reason, enhanced logging, and mandatory follow-up review. Break-glass must not become a convenient bypass when the normal approval queue is slow. If the platform cannot establish who invoked the emergency control and exactly what authority it granted, the control is too broad for production use.',
        'Finally, approval evidence should be visible in the mission completion report. A reviewer inspecting a production change should be able to see which actions were automatically allowed, which were denied, which required human authorization, whether any approval was modified or expired, and whether a break-glass path was used. This connects human judgment to the same provenance chain as code diffs and verifier results instead of leaving governance history in a separate ticketing system.'
      ]
    }
  ],
  'mcp-client-architecture': [
    {
      heading: 'Compatibility, contract tests, and safe client upgrades',
      paragraphs: [
        'An MCP client should treat protocol compatibility as a tested contract rather than an assumption tied to a library version. Maintain fixture servers that exercise initialization, capability discovery, normal requests, malformed responses, cancellation, timeouts, reconnects, and optional features the product supports. When the protocol implementation or transport library changes, run the same suite before release. This catches regressions at the boundary where an otherwise valid internal refactor can change request ordering, error handling, or capability negotiation.',
        'Server diversity also matters. A robust client should be tested against more than one happy-path implementation because real servers differ in latency, catalog size, schema complexity, failure behavior, and optional capability support. Interoperability evidence can record the server version and scenarios exercised without claiming universal compatibility. If a server exposes behavior outside the supported contract, the client should surface an explicit degraded or unsupported state rather than coercing the response and hoping the model can compensate.',
        'Client upgrades need rollback semantics. Persist enough connection and capability metadata to diagnose a failure after deployment, but do not make cached discovery data authoritative across incompatible client versions. A release can canary the new client on a subset of missions, compare connection success, invocation failure, latency, and policy outcomes, then expand when the evidence is acceptable. If regressions appear, roll back the client while preserving mission records created by the newer version.',
        'This contract-testing layer complements permission and verification controls. Protocol conformance proves that messages are exchanged as expected; local policy decides whether an operation is allowed; mission verification decides whether the resulting engineering work is correct. Keeping those responsibilities separate prevents a successful MCP round trip from being mistaken for authorization or task completion.'
      ]
    }
  ]
};

export function finalPublishTopup(editorial: PillarEditorial): PillarEditorial {
  const sections = FINAL_SECTIONS[editorial.pillarId];
  if (!sections) return editorial;

  return {
    ...editorial,
    sections: [...editorial.sections, ...sections],
  };
}
