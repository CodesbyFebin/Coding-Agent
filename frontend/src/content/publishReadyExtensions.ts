import type { EditorialFaq, EditorialSection, PillarEditorial } from './types';

/**
 * Depth extensions for the final set of reviewed editorials that remain below
 * the 2,000-word publish bar. These sections are deliberately topic-specific:
 * the publish gate must never be crossed with generic filler or repeated SEO
 * boilerplate. The registry applies them before wordCount/indexability checks.
 */
interface EditorialExtension {
  definition?: string;
  sections: EditorialSection[];
  faq?: EditorialFaq[];
}

const EXTENSIONS: Record<string, EditorialExtension> = {
  'parallel-subagents': {
    sections: [
      {
        heading: 'Designing work units for safe parallelism',
        paragraphs: [
          'Parallel execution starts with decomposition quality, not with a worker count. A work unit is a good candidate for concurrent execution when its inputs can be named before it starts, its write set can be bounded, and its completion can be checked independently. File ownership is the simplest boundary, but package ownership, service ownership, migration stage, or test shard can also work. The orchestrator should reject parallelization when two tasks depend on an unstated shared assumption, because those hidden dependencies turn apparent concurrency into nondeterministic integration failures.',
          'A useful planning record therefore includes the work-unit identifier, declared read set, declared write set, predecessor tasks, verifier commands, expected artifacts, timeout, retry policy, and merge policy. The write set is especially important. If two workers request overlapping write scopes, the scheduler can serialize them before execution rather than discovering the conflict after both have spent model tokens and compute. This makes concurrency a property of the plan that can be inspected and reviewed, not a runtime gamble.',
          'Subagents should receive the minimum context required for their unit. Copying the entire parent conversation into every worker increases cost, leaks irrelevant assumptions, and makes workers more likely to change files outside their scope. A better handoff contains the mission objective, the unit-specific acceptance criteria, the relevant repository excerpts, allowed tools, and immutable constraints. The parent retains the global plan and is responsible for reconciling cross-unit implications after workers return evidence.',
          'Concurrency limits should be resource-aware. Ten logically independent tasks are not necessarily ten simultaneously runnable tasks if they compete for one GPU, one integration-test database, one package-manager cache lock, or a rate-limited upstream API. The scheduler should distinguish logical dependencies from resource dependencies and should expose both in telemetry. A queue that is waiting for capacity is healthy; a queue that silently overcommits the host is not.'
        ]
      },
      {
        heading: 'Merge, verification, and failure containment',
        paragraphs: [
          'A subagent result is a proposal, not a completed mission. The parent should import each result through a deterministic merge stage that records the base revision, worker diff, merge outcome, and any conflict resolution. Textual non-overlap is not enough to prove semantic compatibility. Two workers can change different files while still disagreeing about an interface, configuration key, database shape, or protocol contract. The integrated workspace must therefore run verification again after all accepted changes are combined.',
          'Failure containment improves when workers have explicit leases. A lease gives a worker permission to act on one unit for a bounded time. If the worker crashes, loses connectivity, or exceeds its deadline, the lease expires and the orchestrator can retry without wondering whether two copies of the same unit are still mutating state. Idempotency keys are equally important for external actions: a retry must not create duplicate issues, duplicate deployments, or duplicate messages merely because the first response was lost.',
          'Partial success should be represented explicitly. If seven of ten workers pass and three fail, the mission record should preserve the seven successful evidence bundles while keeping the overall integration gate closed. Depending on the task, the orchestrator may retry only failed units, replan the affected dependency branch, or abandon all changes. What it must not do is silently label the mission successful because a majority of workers completed.',
          'The final evidence bundle should let a reviewer answer five questions quickly: which units ran, which model and tool policy each used, what each changed, what each verifier reported, and what happened when outputs were combined. That evidence is more valuable than a speedup number because it makes parallel execution debuggable and governable when the happy path fails.'
        ]
      }
    ],
    faq: [
      {
        question: 'How should CodingAgent decide whether a task is safe to parallelize?',
        answer: 'Use declared dependencies, bounded write sets, independent acceptance criteria, and resource requirements. If workers may mutate the same contract or rely on hidden shared state, serialize or restructure the work before spawning subagents.'
      },
      {
        question: 'Why rerun verification after every worker already passed its own checks?',
        answer: 'Worker-level checks prove each isolated change against its local assumptions. Only integrated verification can catch interface drift, merge interactions, shared configuration conflicts, and tests that fail when all accepted diffs exist together.'
      }
    ]
  },

  'inr-pricing-billing': {
    definition: 'INR pricing and billing is an India-focused product-design concern covering transparent rupee-denominated cost presentation, tax-aware invoicing workflows, supported domestic payment rails, usage attribution, and evidence required before any claim about live payment, GST, RBI, or PCI-DSS capabilities is published.',
    sections: [
      {
        heading: 'Separate published price facts from billing architecture',
        paragraphs: [
          'A pricing page is a factual interface. It should describe only plans, payment methods, taxes, discounts, and free allowances that are actually available in the deployed product. Architecture documents may discuss UPI, NetBanking, subscriptions, GST invoices, or enterprise cost centers as target capabilities, but those design choices must not be converted automatically into marketing claims. CodingAgent.in should source any public price from a versioned pricing configuration or billing backend so the website, checkout, invoice template, and sales material cannot drift independently.',
          'The price model should expose the unit behind every charge. For cloud inference that may be provider cost, tokens, requests, or a platform allowance; for self-hosted execution it may be infrastructure owned by the customer rather than a CodingAgent token fee. Mixing these cost classes creates misleading comparisons. A transparent estimator should show assumptions such as model, input volume, output volume, concurrency, storage, and any platform subscription separately, then label estimates as estimates rather than invoices.',
          'India-facing presentation benefits from INR as the primary display currency when INR billing is genuinely supported. Currency display alone does not prove domestic settlement, tax treatment, or the absence of processor fees. Those properties should be verified independently from the payment provider and contract. If a cloud model is billed upstream in another currency, the product should disclose how conversion is handled instead of promising a zero-markup outcome that cannot be guaranteed across providers and card issuers.',
          'A production release checklist should include a pricing owner, effective date, source-of-truth configuration, test checkout, refund path, invoice validation, tax review, and a rollback plan. Search content can then answer high-intent questions such as INR pricing transparency or enterprise AI coding costs without inventing plan names or amounts before the commercial system exists.'
        ]
      },
      {
        heading: 'Payment and GST integration as verifiable implementation work',
        paragraphs: [
          'UPI and NetBanking should be described as integration options until a specific payment service provider is configured and exercised in the production environment. The implementation needs more than a payment button: order creation, signed callback verification, replay protection, idempotent settlement handling, cancellation, refund reconciliation, failed-payment recovery, and ledger entries must agree. Subscription mandates introduce an additional lifecycle around consent, mandate status, retries, cancellation, and customer notification.',
          'GST-aware invoicing likewise requires a real tax model. The system needs the supplier registration details that actually apply, customer billing location, place-of-supply logic, tax rate configuration, invoice numbering, credit-note behavior, and record retention. Whether CGST and SGST or IGST applies is a tax determination, not a string chosen by a UI template. The software can automate a reviewed rule set, but the existence of automation should never be presented as legal or tax advice.',
          'Security claims deserve the same evidence discipline. PCI-DSS responsibilities depend on the payment architecture and provider scope. Using a compliant payment processor can reduce the application\'s card-data exposure, but it does not justify saying the entire CodingAgent platform is certified. The safer engineering goal is to avoid storing sensitive payment credentials, validate provider signatures, protect billing administration with least privilege, and retain the processor\'s applicable attestations where procurement or audit teams can review them.',
          'Before publishing statements about RBI requirements, data localization, recurring payment rules, or payment-provider certification, the release process should attach dated evidence from the chosen provider and an applicable legal or compliance review. That evidence-first workflow is consistent with the rest of CodingAgent.in: product claims should be generated from deployed facts, not from a roadmap paragraph.'
        ]
      },
      {
        heading: 'Enterprise cost governance without fictional plan promises',
        paragraphs: [
          'Enterprise buyers often need allocation more than another pricing tier. A useful billing ledger can tag usage by organization, project, team, model route, mission, and environment so finance teams can perform showback or chargeback. Budgets should be policy objects with a period, threshold, notification destination, and enforcement behavior. A warning at 80 percent and a hard stop at 100 percent are different controls and should be configured explicitly rather than hidden in application logic.',
          'For local-LLM deployments, cost governance should include hardware utilization and energy or hosting assumptions instead of pretending local inference is free. GPU purchase or rental, idle capacity, model loading time, storage, operator effort, and redundancy all contribute to total cost. The value of local execution may be privacy, latency, sovereignty, predictable capacity, or avoiding per-token provider charges; the right comparison depends on the workload and should be presented with visible assumptions.',
          'Invoices and usage exports should be reconcilable. A finance reviewer should be able to start with an invoice line, trace it to aggregated ledger entries, and then trace a sample entry to a mission or provider receipt without exposing source code or secrets unnecessarily. Stable identifiers and immutable billing events make disputes easier to investigate and reduce dependence on screenshots or manually edited spreadsheets.',
          'Until a commercial plan is launched, CodingAgent.in should prefer language such as planned billing architecture, pricing to be published, or contact for deployment scoping. That is less aggressive than fabricated pricing, but it is substantially stronger for trust and long-term search authority because users do not encounter contradictions between an indexed article and the actual checkout experience.'
        ]
      }
    ],
    faq: [
      {
        question: 'Does CodingAgent.in currently guarantee UPI, NetBanking, GST invoices, or a free tier?',
        answer: 'This editorial describes the target India-focused billing architecture. A payment method, invoice behavior, plan, or free allowance should be treated as available only when the live pricing or checkout surface and its supporting evidence say so.'
      },
      {
        question: 'What makes an INR pricing page trustworthy?',
        answer: 'A single source of truth for current prices, explicit charging units, dated effective terms, clear tax treatment, visible estimation assumptions, and reconciliation between checkout, invoice, and usage records. Unsupported zero-markup or certification claims should be avoided.'
      }
    ]
  },

  'agent-observability': {
    definition: 'Agent observability is the telemetry and evidence architecture required to explain model routing, tool calls, state transitions, verification results, approvals, latency, resource use, and failures without exposing secrets; this page describes the target instrumentation model and the evidence needed to verify a deployed implementation.',
    sections: [
      {
        heading: 'Design telemetry around questions operators actually ask',
        paragraphs: [
          'An observability schema should begin with incident questions rather than dashboards. Operators need to know which mission failed, what state it was in, which model route was selected, which tool was called, what permission decision preceded the call, which verifier failed, and whether a retry changed the result. If those joins require searching unrelated log streams by timestamp, the telemetry model is too weak. Mission ID, attempt ID, task ID, tool-call ID, and evidence ID should be stable correlation keys propagated through every component.',
          'Events should separate measurements from model-generated narrative. Token counts, exit codes, durations, HTTP status codes, hashes, resource limits, and policy decisions are measured facts. A model summary such as probable root cause is an interpretation and should be stored as such. Keeping those classes distinct lets a reviewer filter to deterministic evidence first, then use model analysis as a navigation aid rather than treating it as ground truth.',
          'High-cardinality payloads need deliberate boundaries. Full prompts, repository excerpts, shell output, and tool arguments can contain source code, personal data, API keys, or customer secrets. Production telemetry should default to structured metadata and references to access-controlled evidence objects. When full payload capture is enabled for debugging, retention, encryption, access policy, and redaction should be explicit and time-bounded.',
          'Sampling is also a governance choice. Performance traces may be sampled at scale, but approval decisions, denied tool calls, verification outcomes, and security-relevant state changes should not disappear because a generic tracing sampler decided they were uninteresting. The system should classify audit-critical events separately from diagnostic events so storage optimization cannot silently weaken the evidence chain.'
        ]
      },
      {
        heading: 'SLOs, alerts, and replayable evidence',
        paragraphs: [
          'Useful service-level indicators for an agent runtime include mission success rate by verified outcome, queue wait, planning latency, tool latency, verifier latency, retry rate, approval wait, token or compute consumption, sandbox startup time, and cancellation responsiveness. A single average hides failure modes, so distributions and percentiles matter. Metrics should also be segmented by model route and mission class because a slow repository migration and a quick documentation edit have different expected profiles.',
          'Alerts should correspond to actionable failure states. A rising retry rate may indicate an upstream model or tool problem; repeated permission denials may reveal a bad plan; verifier failures after a model rollout may identify quality regression; a growing approval queue may indicate a governance bottleneck rather than an agent fault. Alert definitions should include an owner, runbook, evaluation window, and suppression rule so the monitoring layer does not become another source of noise.',
          'Replay does not have to mean re-executing side effects. A safe replay view reconstructs the recorded state transitions, tool requests, decisions, diffs, and evidence in order, while clearly marking data that was redacted or is no longer retained. If the platform supports executable replay, external writes must be disabled or redirected to a sandbox by default. Otherwise an investigation could repeat a deployment, issue mutation, or destructive command.',
          'The observability contract should be testable. Integration tests can start a synthetic mission, force a known permission denial and verifier failure, then assert that the expected correlated events exist and that secret fixtures do not appear in exported telemetry. Those tests provide stronger evidence than a screenshot of a dashboard and can run continuously as the event schema evolves.'
        ]
      },
      {
        heading: 'Audit exports without unsupported compliance claims',
        paragraphs: [
          'Telemetry can support an audit, but a log format does not make a system compliant with SOC 2, ISO 27001, HIPAA, GDPR, DPDP, or another framework. The safer product boundary is to export evidence that a customer or auditor can map to their controls: who initiated a mission, what policy version applied, which approvals occurred, what code changed, what gates ran, and which artifact hashes identify the result.',
          'Retention should be policy-driven instead of hard-coded to arbitrary periods. Different organizations have different contractual, legal, security, and cost constraints. A retention policy can define classes such as security evidence, mission diagnostics, model payloads, billing events, and aggregated metrics, then assign storage locations, retention periods, legal holds, and deletion workflows independently.',
          'External integrations should be documented as adapters, not presumed capabilities. OpenTelemetry, metrics exporters, webhooks, or SIEM connectors can provide a standard boundary, while a specific Datadog, Grafana, or paging integration should be called available only when shipped and tested. This keeps the editorial useful even as the deployment topology changes.',
          'A mature observability page should publish what can be verified today: event schemas, example redacted records, retention configuration, exporter interfaces, and test evidence. That makes observability an engineering contract rather than a collection of attractive dashboards.'
        ]
      }
    ],
    faq: [
      {
        question: 'Should CodingAgent store full prompts and tool payloads in logs?',
        answer: 'Not by default. Full payloads can contain source code, secrets, or personal data. Prefer structured metadata and protected evidence references, with explicit redaction, access control, retention, and opt-in diagnostic capture when full payloads are genuinely required.'
      },
      {
        question: 'Does an audit export prove regulatory compliance?',
        answer: 'No. Telemetry can provide evidence for a control assessment, but compliance depends on the full organizational and technical context. CodingAgent.in should describe evidence capabilities and avoid claiming a certification or legal outcome unless independently established.'
      }
    ]
  },

  'human-approval-gates': {
    sections: [
      {
        heading: 'Design approvals around decision quality, not modal dialogs',
        paragraphs: [
          'An approval gate is useful only when the reviewer can make a better decision than the agent. The request should therefore carry the proposed action, affected resource, diff or command, reason, expected effect, risk classification, evidence already collected, and the consequence of denial. A button that says approve without this context creates ceremony rather than control. The reviewer should be able to modify scope, request more evidence, or deny with a machine-readable reason that feeds the replanning loop.',
          'Approval policies should distinguish reversible from irreversible actions and read access from writes. Reading a public documentation file may be allowed automatically, while changing production infrastructure, rotating credentials, publishing a package, or deleting data may require explicit approval or be denied entirely. The policy decision should be made before tool execution, recorded with the policy version, and enforced by the tool boundary rather than by an instruction that the model can ignore.',
          'Timeout behavior matters. An unanswered approval should not silently become approval. The safe default is to pause, expire, or cancel according to mission policy, then preserve the pending request and evidence. Escalation can route to another reviewer, but it should never broaden authority simply because the first reviewer was unavailable. This keeps human absence from becoming a privilege-escalation path.'
        ]
      },
      {
        heading: 'Measure approval friction and tune policy deliberately',
        paragraphs: [
          'Teams should measure approval volume, wait time, denial rate, modification rate, and the actions that repeatedly request the same decision. A request that is approved unchanged hundreds of times may be a candidate for a narrower automatic rule, while a request that is frequently denied may indicate poor agent planning or an overly broad tool interface. Policy changes should be reviewed like code, with a reason, owner, effective version, and rollback path.',
          'Approval analytics should not become employee scoring. The purpose is to improve system policy and throughput, not to rank individuals by how quickly they click. Reports should emphasize workflow bottlenecks, risk classes, and recurring request patterns, with access controls around reviewer identity where appropriate. This also reduces incentives for reviewers to approve quickly just to improve a metric.',
          'For external workflow systems, the integration contract needs signed or authenticated callbacks, idempotent decisions, expiration handling, and a mapping between external ticket identity and mission identity. The CodingAgent runtime remains responsible for enforcement: an external system can communicate a decision, but the tool gateway must verify that the decision is current, authentic, scoped to the requested action, and not already consumed.'
        ]
      }
    ],
    faq: [
      {
        question: 'What information should an approval request contain?',
        answer: 'At minimum: the exact proposed action, target resource, relevant diff or command, reason, risk class, evidence, requested scope, expiration, and what the runtime will do if the request is denied or times out.'
      }
    ]
  },

  'production-operations': {
    sections: [
      {
        heading: 'Operate agents as a service with explicit failure domains',
        paragraphs: [
          'Production operations begins by separating the control plane from execution. The control plane owns mission state, policy, scheduling, approvals, and evidence references; workers execute bounded attempts inside isolated environments. A worker crash should not erase mission state, and a control-plane restart should not leave a worker with unlimited authority. Durable leases, heartbeats, attempt identifiers, and idempotency keys let the system recover from partial failures without guessing what already happened.',
          'Capacity planning must account for more than model tokens. Sandboxes need CPU, memory, disk I/O, temporary storage, network capacity, and sometimes GPU memory. Verification can be more expensive than generation when builds or end-to-end tests are large. Queue metrics should therefore expose demand by workload class and bottleneck resource. Scaling ten more model workers does not help if every mission waits for the same integration-test environment.',
          'Deployments should be progressive. Runtime, policy, model-router, and tool-adapter changes can each alter agent behavior. Canary a small workload segment, compare verified success and failure modes, then expand. Rollback criteria should be defined before release and should include verifier regression, elevated denial or retry rates, evidence gaps, unexpected cost growth, and security signals—not merely HTTP health checks.',
          'Backups need restoration tests. Mission metadata without artifact evidence may be insufficient for an audit; artifact blobs without the database records that identify them may be useless. A recovery exercise should restore both metadata and evidence, verify hashes, re-establish access controls, and demonstrate that an operator can reconstruct a representative mission after the primary system is unavailable.'
        ]
      },
      {
        heading: 'Runbooks, incident response, and safe degradation',
        paragraphs: [
          'Every critical dependency needs a degradation policy. If a preferred model provider fails, the router may use a permitted fallback model, but only if capability and data-routing policy allow it. If the approval service is unavailable, high-risk actions should pause rather than auto-approve. If evidence storage is unavailable, a mission that requires durable evidence should not be marked complete. Availability targets must not erase governance guarantees.',
          'Runbooks should cover stuck leases, queue saturation, model-provider errors, sandbox exhaustion, failing verification infrastructure, corrupted evidence uploads, permission-service failures, and emergency cancellation. Each runbook should identify observable symptoms, diagnostic queries, safe actions, escalation conditions, and how to confirm recovery. A runbook that depends on undocumented tribal knowledge is not operational readiness.',
          'Incident timelines benefit from the same immutable identifiers used by the agent runtime. Operators should be able to connect a customer report to a mission, attempt, tool call, policy decision, deployment version, and artifact hash. Post-incident review can then distinguish model error, orchestration error, policy gap, tool failure, and verification weakness instead of treating every problem as generic AI unreliability.',
          'Operational readiness is demonstrated with exercises: kill a worker during a write, delay an approval callback, revoke a provider credential, exhaust a sandbox quota, fail an evidence upload, and verify that the system reaches the documented safe state. Chaos tests should be bounded and run in environments where side effects are controlled, but they reveal recovery defects that happy-path unit tests cannot.'
        ]
      },
      {
        heading: 'Production change management for models and tools',
        paragraphs: [
          'Models are production dependencies and should have release records just like libraries. Record model identifier, provider or local artifact hash, context limits, routing eligibility, tool-use capability, evaluation evidence, and the date it entered service. A silent provider-side alias change can alter behavior, so deployments that require reproducibility should prefer pinned model identifiers or locally hashed artifacts where available.',
          'Tool adapters deserve equal discipline because they convert model intent into external effects. Version schemas, validate arguments server-side, make permissions explicit, and test backward compatibility before rollout. When a tool adds a new optional parameter that expands scope, treat that as a security-relevant change even if the API remains syntactically compatible.',
          'The operational goal is not zero incidents; it is bounded incidents with fast, evidence-backed recovery. Durable state, explicit policy, reproducible releases, and independent verification make that goal achievable without pretending autonomous software can be risk free.'
        ]
      }
    ],
    faq: [
      {
        question: 'What should happen if a governance dependency is unavailable?',
        answer: 'Use a documented safe-degradation policy. High-risk actions should pause or fail closed when approval, permission, or required evidence services are unavailable; availability pressure should not silently weaken the mission contract.'
      }
    ]
  },

  'hallucination-defense': {
    sections: [
      {
        heading: 'Treat hallucination defense as layered error containment',
        paragraphs: [
          'No prompt removes hallucinations. A production coding system reduces their impact by constraining inputs, grounding claims in repository evidence, limiting tool authority, and requiring deterministic verification before completion. Each layer catches a different class of error. Retrieval can reduce invented APIs but can retrieve stale documentation; a type checker catches signature errors but not a wrong business rule; tests validate encoded expectations but cannot prove requirements were complete.',
          'The planner should attach provenance to important factual assumptions: file paths, symbols, dependency versions, API contracts, configuration keys, and migration state. When the agent cannot find evidence, uncertainty should remain visible rather than being converted into a confident guess. A missing symbol should trigger search or clarification; it should not be invented because a similarly named library usually contains one.',
          'Tool results are evidence but still require interpretation. A shell command can succeed while producing the wrong artifact, a test command can select zero tests, and a linter can pass while the build fails. Verification gates should check both exit status and expected evidence—for example test counts, artifact existence, typecheck scope, or hash output—so a superficially green command does not become false confidence.',
          'Repair loops need limits. If the same verification failure repeats, the system should detect the cycle, preserve the attempts, and replan or escalate instead of spending tokens indefinitely. Loop fingerprints can include failing gate, error signature, changed files, and attempted remedy. Repeating the same state with the same proposed fix is a strong signal to stop.'
        ]
      },
      {
        heading: 'Evaluate defenses with adversarial and regression cases',
        paragraphs: [
          'A hallucination-defense evaluation set should include missing APIs, outdated documentation, ambiguous symbol names, generated tests that assert the wrong behavior, dependency-version mismatches, misleading comments, prompt injection inside repository text, and tasks whose correct answer is to make no code change. The metric is not whether the model sounds cautious; it is whether the system avoids unsupported edits and produces the required evidence.',
          'Evaluation should preserve failures as regression fixtures. When a model invents a configuration option or edits the wrong package, capture the repository state, mission request, relevant evidence, and expected safe outcome. Run that fixture against future model and orchestration changes. This turns an anecdotal AI failure into a reproducible engineering test.',
          'Model disagreement can be useful but is not independent verification. A second model may catch a mistake, yet it can share training biases or accept the same false premise. Use model review as another probabilistic signal, then let compilers, tests, schemas, security scanners, and human product judgment decide the parts they can actually measure.',
          'The strongest defense is an honest completion vocabulary. Distinguish generated, executed, verified, approved, and deployed. An agent can say code was generated before tests run, verified only after gates pass, and deployed only after the deployment system confirms the target state. Precise status words prevent a conversational success claim from outrunning the evidence.'
        ]
      }
    ],
    faq: [
      {
        question: 'Can retrieval-augmented generation eliminate coding hallucinations?',
        answer: 'No. Retrieval can ground the model in repository or documentation evidence, but the retrieved material may be incomplete or stale. Use provenance plus deterministic verification and explicit uncertainty rather than treating retrieval as proof.'
      },
      {
        question: 'When should a repair loop stop?',
        answer: 'Stop or replan when attempts repeat the same failure state, the retry budget is exhausted, new evidence is not being produced, or the next action would require broader authority than the mission grants.'
      }
    ]
  },

  'mcp-client-architecture': {
    sections: [
      {
        heading: 'Build the client around protocol state, capability state, and policy state',
        paragraphs: [
          'An MCP client should keep three kinds of state separate. Protocol state covers connection lifecycle, negotiated protocol information, request identifiers, and cancellation. Capability state covers which tools, resources, prompts, or optional features a server currently exposes. Policy state covers what the CodingAgent runtime permits the model or user to invoke. Mixing these layers makes reconnects dangerous because a refreshed server capability list can accidentally be mistaken for permission.',
          'Discovery results should be treated as untrusted remote descriptions until validated. Tool names, schemas, descriptions, and resource metadata can influence model behavior, so the client needs schema limits, size limits, canonical identifiers, and a clear server identity. A tool appearing in discovery does not make it callable; the permission engine must evaluate the proposed invocation and can still allow, ask, or deny it.',
          'The connection manager should support bounded retries with jitter, explicit timeouts, cancellation, and health state. Reconnect must trigger capability reconciliation rather than assuming the new session is identical to the old one. If a tool disappears, changes schema, or moves from a trusted to an unknown server identity, in-flight plans that depend on it should be reconsidered instead of blindly replayed.',
          'Transport adapters should expose one internal request model to the rest of the agent runtime. Stdio and HTTP have different failure characteristics, but planning code should not implement two permission systems or two evidence formats. Normalize lifecycle events, request/response metadata, errors, and timing at the adapter boundary while retaining transport-specific diagnostic fields for debugging.'
        ]
      },
      {
        heading: 'Make tool invocation observable and revocable',
        paragraphs: [
          'Every invocation should carry mission, attempt, server, tool, schema version, permission decision, timeout, and correlation identifiers. Arguments should be validated against the discovered schema and against local policy constraints before bytes leave the process. Sensitive arguments should be redacted in ordinary telemetry while an access-controlled evidence object can preserve what an authorized incident investigation requires.',
          'Cancellation must propagate. When a mission is cancelled or an approval expires, the client should stop waiting, signal the transport where supported, and mark late responses as stale. A late successful response must not resurrect a cancelled mission or cause a second state transition. This is especially important when tools have external side effects and the network can outlive the UI session.',
          'The client should expose server health without inventing a green state. CONNECTED means a connection exists; CONFIGURED means configuration exists; DEGRADED means recent operations failed or capabilities are incomplete; UNKNOWN means the client lacks evidence. Keeping these truth states distinct matches the broader CodingAgent runtime philosophy and avoids dashboards that imply readiness merely because an endpoint string is configured.'
        ]
      }
    ],
    faq: [
      {
        question: 'Does discovering an MCP tool make it safe to call?',
        answer: 'No. Discovery describes server capability. CodingAgent policy still evaluates whether the current mission, user, server identity, arguments, and risk class permit the invocation.'
      }
    ]
  },

  'independent-verification': {
    sections: [
      {
        heading: 'Verification plans should be derived before execution',
        paragraphs: [
          'Independent verification is strongest when the acceptance plan is written before the agent edits code. The planner should translate the mission into observable claims: a package builds, a route returns the expected status, a migration preserves data, a type contract holds, a vulnerability is no longer reachable, or a browser flow completes. Each claim is then paired with an evaluator that does not depend on the model saying the claim is true. This prevents the common failure mode where the agent chooses an easy test after seeing its own implementation.',
          'Not every task has the same gate set. Documentation may need link and example validation; a TypeScript refactor may require typecheck, unit tests, and build; a database migration may require schema validation, rollback exercise, and representative data checks; a UI change may need browser assertions and accessibility scans. A mission template should declare required gates by risk and artifact type, while allowing repository-specific commands to be pinned explicitly.',
          'Predeclared verification also makes cost predictable. Expensive end-to-end suites can run after cheaper syntax and type gates, so obvious failures stop early. The ordering is an optimization, not a relaxation: all required gates still have to pass. The record should show which gates were skipped because an earlier mandatory gate failed and which were not applicable by policy.'
        ]
      },
      {
        heading: 'Evidence must identify exactly what was verified',
        paragraphs: [
          'A green exit code is meaningful only when tied to inputs. Store the repository revision or workspace hash, relevant dependency lockfiles, toolchain version, verifier command, environment identity, start and finish time, exit code, and artifact references. If the workspace changes after tests pass, the previous result should not automatically apply. The deployment candidate needs a hash or provenance link back to the verified workspace.',
          'Test output should be retained at an appropriate level of detail. A summary can show counts and duration, while full logs live in protected evidence storage with retention policy. For security scanners, capture rule-set or database version where possible because the same code may produce a different result after the vulnerability database changes. Reproducibility is not perfect in every ecosystem, but recording these inputs makes later interpretation substantially stronger.',
          'Generated tests require special care. They can improve coverage, but an agent can write a test that merely encodes its mistaken implementation. New tests should be reviewed against the requirement and, for high-risk changes, complemented by pre-existing tests, specification examples, differential checks, or independent review. Passing a test the same model just invented is evidence of consistency, not necessarily correctness.',
          'Evidence integrity can use content hashes and append-only event records so accidental mutation is detectable. Cryptographic hashing does not prove the verifier was trustworthy or the policy was correct; it proves that the referenced bytes are the same bytes later inspected. Keeping that boundary explicit avoids turning a useful integrity primitive into an exaggerated correctness claim.'
        ]
      },
      {
        heading: 'Negative verification and failure-path testing',
        paragraphs: [
          'Verification should test that forbidden behavior does not occur. A permission change can be checked by attempting a denied operation in a controlled fixture. A path traversal fix should include malicious paths, not only a normal request. A retry system should be tested with timeouts and duplicate callbacks. Negative cases are especially valuable for agent-generated changes because they force the acceptance suite to model boundaries, not merely the happy path the implementation was designed around.',
          'For security-sensitive work, scanners are only one layer. Static analysis, dependency scanning, secret detection, configuration checks, sandbox tests, and targeted adversarial cases each cover different failure modes. Findings should be triaged by evidence rather than automatically suppressed by the model. If the mission introduces an accepted risk, that decision should be a human-owned exception with scope and expiry, not an agent-authored waiver.',
          'Failure evidence is a first-class output. When a gate fails, record the failing command, deterministic error signature where possible, relevant log excerpt, and workspace identity. The repair loop receives that evidence but should not be able to rewrite the previous result. Subsequent attempts produce new evidence records, preserving the sequence of cause, repair, and re-verification.'
        ]
      },
      {
        heading: 'Verification for browser, API, data, and infrastructure work',
        paragraphs: [
          'Browser verification should assert user-visible state and important accessibility semantics rather than relying only on screenshots. Screenshots are useful evidence for visual review, but DOM assertions, network outcomes, focus behavior, form validation, and responsive breakpoints are more machine-checkable. When visual comparison matters, define a controlled viewport, fonts, test data, and acceptable diff threshold.',
          'API verification should cover contract shape, status codes, authorization boundaries, idempotency, error behavior, and compatibility where required. Contract tests are valuable because an agent can update a server implementation and forget a client or documentation consumer. Schema diffing before and after a mission can reveal unintended surface changes even when unit tests remain green.',
          'Data migrations should be tested on representative fixtures with counts, constraints, null behavior, uniqueness, and rollback or forward-recovery procedures. A migration that applies successfully can still corrupt semantics. Infrastructure changes similarly need plan review, policy checks, and post-apply observation of the intended resources. The verifier should measure the target system where possible, not infer success from generated configuration alone.'
        ]
      },
      {
        heading: 'Human judgment remains outside the deterministic gate boundary',
        paragraphs: [
          'Independent verification does not decide whether a feature is desirable, a user experience is good, a trade-off is acceptable, or a policy is ethically or commercially appropriate. Those are human decisions informed by evidence. The architecture is strongest when it refuses to blur this boundary: deterministic gates prove declared technical properties, model reviewers provide probabilistic critique, and accountable people own requirements and risk acceptance.',
          'A completion report should therefore distinguish verified facts from unresolved judgment calls. It can say build passed, 214 tests passed, browser flow completed, security scanner found zero findings at a named severity threshold, and two product questions remain for review. This vocabulary is more useful than a single confidence score because each stakeholder can see what is established and what still requires a decision.',
          'The practical objective is not to make an autonomous agent infallible. It is to make errors visible before they become unreviewed production changes, to preserve evidence when something fails, and to prevent the model from being the sole authority on whether its own work is complete.'
        ]
      }
    ],
    faq: [
      {
        question: 'Should verification commands be chosen before or after the agent edits code?',
        answer: 'Prefer declaring required gates and acceptance claims before execution. The agent may propose additional tests during repair, but it should not be able to weaken or replace the original completion criteria after seeing its own implementation.'
      },
      {
        question: 'What makes verification evidence reproducible?',
        answer: 'Tie results to workspace or artifact identity, toolchain versions, commands, environment, timestamps, exit codes, and retained logs. Reproducibility is strongest when the same inputs and pinned tools can be rerun in a clean environment.'
      },
      {
        question: 'Are model reviewers independent verification?',
        answer: 'They are useful probabilistic reviewers, but not independent deterministic proof. They can share model biases and accept the same false premise. Use them alongside compilers, tests, schemas, scanners, hashes, and human judgment.'
      }
    ]
  },

  'mcp-permissions': {
    sections: [
      {
        heading: 'Evaluate permission at invocation time with concrete arguments',
        paragraphs: [
          'A tool name alone is too coarse for authorization. The same filesystem tool can read a public README or a secret file; the same HTTP tool can query documentation or post data to an unknown endpoint. Permission evaluation should include server identity, tool identity, normalized arguments, mission scope, user or organization policy, workspace boundaries, and the current approval state. This lets policy allow a narrow action without granting the model a general-purpose capability.',
          'Policy should be deterministic and versioned. The decision engine returns ALLOW, ASK, or DENY plus a reason and policy version before execution. The tool gateway enforces that result; the model cannot reinterpret DENY as advice. When a policy changes during a long mission, the platform should define whether existing leases continue under the old version or new calls reevaluate under the new one, and record that choice for auditability.',
          'Path, command, and network constraints should be normalized before policy comparison. Relative paths, symlinks, shell expansion, redirects, encoded URLs, and nested command interpreters can bypass naïve string matching. A secure implementation resolves targets into canonical forms and prefers structured tool schemas over unrestricted shell text whenever possible.'
        ]
      },
      {
        heading: 'Test policy with adversarial fixtures',
        paragraphs: [
          'Permission tests should include expected allows and expected denies. For filesystem policy, try traversal and symlink cases; for network egress, test alternate schemes, redirects, IP literals, and DNS changes; for shell policy, test chaining and subshell syntax if a shell is exposed. The objective is to prove the enforcement boundary sees the effective operation, not merely the friendly representation the model supplied.',
          'Approval should grant the smallest useful scope. If a reviewer approves one deployment to staging, that decision should not become a reusable permission to deploy any branch to production. Approval records need action fingerprint, target, expiry, reviewer, and whether they are single-use. The gateway should reject replayed or scope-expanded approvals.',
          'Observability completes the permission model. Record the requested operation, normalized scope, decision, reason, approval reference if any, and execution outcome. Sensitive arguments can be redacted, but the evidence should still let a reviewer establish what policy path was taken. A denied action that is invisible in logs is a lost signal about agent planning and potential attack attempts.'
        ]
      }
    ],
    faq: [
      {
        question: 'Why is tool-level allowlisting not enough?',
        answer: 'Because risk depends on arguments and target. Authorization should evaluate the concrete operation—such as which file, command, host, repository, or deployment target—not just the generic tool name.'
      }
    ]
  },

  'durable-runtimes': {
    sections: [
      {
        heading: 'Durability requires explicit state transitions and ownership',
        paragraphs: [
          'A durable runtime assumes every process can fail between two lines of code. Mission state therefore lives outside the worker process and advances through explicit transitions with persisted identifiers. Typical records include mission, task run, attempt, lease, result, evidence, approval, and idempotency key. A worker receives a lease for an attempt; it does not own the mission forever. If the lease expires, the scheduler can recover the task without relying on the failed process to clean itself up.',
          'State transitions should be conditional. Completing an attempt should update only the attempt that still holds the valid lease and expected version. This prevents a slow worker from overwriting a newer retry after its lease has expired. Database transactions or compare-and-swap semantics are preferable to informal last-write-wins updates for mission-critical state.',
          'Heartbeats are evidence of liveness, not proof of progress. Track the last durable checkpoint separately from the last heartbeat so operators can distinguish a healthy long-running verifier from a worker that is alive but stuck. For steps that can checkpoint safely, persist progress at meaningful boundaries; for non-idempotent steps, define recovery around an external idempotency key or a reconciliation operation.',
          'The runtime should model cancellation as a state transition, not merely a UI flag. New work stops being leased, active workers receive cancellation, and late results are recorded without changing a cancelled mission back to success. If an external action cannot be cancelled, the reconciler should inspect its eventual outcome and attach evidence so a human can understand the final state.'
        ]
      },
      {
        heading: 'Retries, idempotency, and reconciliation',
        paragraphs: [
          'Retries should be classified by failure type. Network timeout, provider throttling, worker eviction, deterministic compilation error, permission denial, and failed test are not the same. Infrastructure failures may be retried with backoff; deterministic code failures should enter repair or replanning; denied actions require policy or human input. A blanket retry count wastes compute and can repeat harmful side effects.',
          'Idempotency keys belong at boundaries where repeated requests can create duplicate effects: mission creation, issue creation, deployment requests, billing operations, messages, and artifact publication. Store the key with the resulting external identity so a retry can return the prior result or reconcile it. Local database idempotency does not help if the external API already accepted the first request before the connection dropped.',
          'Reconciliation is the durable-runtime escape hatch for uncertainty. When a worker cannot know whether an external operation completed, a reconciler queries the authoritative system and records the observed state. This is safer than assuming failure and repeating the action. Reconciliation jobs should themselves be bounded, observable, and capable of escalating when the external system cannot provide a definitive answer.',
          'The retry history is part of the evidence chain. Preserve attempt number, failure category, error fingerprint, model route, tool calls, and the transition that scheduled the retry. This makes reliability problems measurable and helps distinguish flaky infrastructure from repeated agent reasoning failures.'
        ]
      },
      {
        heading: 'Operational tests for a durable agent runtime',
        paragraphs: [
          'Durability should be demonstrated with failure injection. Terminate a worker after it acquires a lease, during artifact upload, after an external request, and after verification but before completion is committed. Restart the scheduler with queued work. Delay heartbeats and approval callbacks. The expected result is not always automatic success; the important property is that the runtime reaches a documented state without duplicate effects or lost evidence.',
          'Database migrations for runtime state require special care because old workers may still be running while schema changes deploy. Prefer additive changes, explicit compatibility windows, and versioned event payloads. If a new worker writes an event an old reader cannot understand, rollout order matters. Durable orchestration is partly a distributed-systems problem, and schema evolution belongs in its threat model.',
          'A healthy runtime exposes queue depth, lease age, expired leases, attempts per task, reconciliation backlog, cancellation latency, and terminal-state counts. These metrics let operators see when durability mechanisms are being exercised unusually often and investigate before recovery traffic becomes the primary workload.'
        ]
      }
    ],
    faq: [
      {
        question: 'What is the difference between a retry and a repair?',
        answer: 'A retry repeats an operation because the failure is believed transient. A repair changes the proposed work in response to deterministic evidence such as a failed build or test. Mixing them can waste attempts and hide real defects.'
      },
      {
        question: 'Why are leases useful for agent workers?',
        answer: 'Leases make ownership time-bounded. If a worker disappears, the scheduler can safely recover work after expiry, while conditional updates prevent a stale worker from overwriting the result of a newer attempt.'
      }
    ]
  },

  'bidirectional-mcp': {
    sections: [
      {
        heading: 'Treat client and server roles as separate trust boundaries',
        paragraphs: [
          'A platform that can consume MCP servers and expose its own capabilities through MCP has two independent attack surfaces. As a client, CodingAgent receives tool and resource descriptions from external servers and decides what may be invoked. As a server, it exposes a deliberately small capability surface to external clients and must authenticate, authorize, validate, rate-limit, and audit those calls. Sharing implementation code is reasonable; sharing trust assumptions is not.',
          'The outbound client side should bind discovered capabilities to server identity and local policy. The inbound server side should bind every request to an authenticated principal, organization, granted scopes, and server-side policy. An external client cannot inherit the internal agent\'s authority merely because both ultimately call the same repository or mission service.',
          'Capability translation should preserve provenance. If an inbound MCP call starts a mission that later invokes an outbound MCP tool, the evidence chain should identify both boundaries: who requested the mission, what inbound capability they used, which internal policy accepted it, which outbound server and tool were later selected, and what verification decided the result.'
        ]
      },
      {
        heading: 'Prevent confused-deputy and recursive-agent failures',
        paragraphs: [
          'Bidirectional systems can create confused-deputy problems when a low-privilege external caller convinces a more privileged internal agent to perform an action on its behalf. Authorization must therefore follow the originating principal and mission policy through the entire call graph. The internal agent should not substitute its own broad service credentials for authority the caller never had.',
          'Recursion is another unique risk. CodingAgent exposed as an MCP server may be called by another agent that in turn routes back to CodingAgent or to a server that calls CodingAgent again. Propagate trace and hop metadata, set maximum call depth, detect repeated capability chains, and enforce budgets. Without these controls, two otherwise valid agent systems can create an expensive or destructive loop.',
          'Data classification should influence both directions. Sensitive repository context received internally should not be returned through an inbound resource simply because a client can ask for it, and external resource content should not automatically become trusted instructions. Treat content and authority separately: data can inform reasoning without granting permission.',
          'A bidirectional conformance suite should test each role independently and then exercise end-to-end chains with cancellation, timeouts, schema changes, denied permissions, duplicate requests, and loop detection. This proves that protocol compatibility does not bypass the governance layer that gives the integration its security properties.'
        ]
      }
    ],
    faq: [
      {
        question: 'Does running an MCP server mean external clients get the same privileges as CodingAgent itself?',
        answer: 'No. Inbound capabilities need their own authentication, scopes, policy, argument validation, and audit trail. Internal service credentials must not become a privilege bridge for external callers.'
      }
    ]
  },

  'air-gapped-agents': {
    definition: 'Air-gapped agent engineering covers packaging, provenance, offline model and tool dependencies, controlled import and export, local identity, evidence retention, update ceremonies, and verification required to operate an AI coding workflow without direct internet connectivity; suitability for a regulated environment requires deployment-specific assessment rather than a blanket compliance claim.',
    sections: [
      {
        heading: 'Prove offline operation instead of assuming it',
        paragraphs: [
          'An air-gapped build should be tested on a network-denied environment from installation through a representative mission. Hidden dependencies often appear only then: package-manager lookups, model-license checks, telemetry endpoints, DNS resolution, documentation assets, container image pulls, certificate revocation checks, or extension marketplaces. The acceptance test should capture outbound connection attempts and fail if an unapproved dependency is required.',
          'A distribution manifest should enumerate application binaries, runtime dependencies, models, embedding models, container images, language toolchains, verification tools, documentation, licenses, configuration templates, and hashes. The exact contents depend on the supported mission set; publishing a fixed package-size claim without a real release artifact is not useful. A small Python-only bundle and a multi-language GPU bundle can differ dramatically.',
          'Import is a security boundary. Models, packages, vulnerability databases, rulesets, and updates originate outside the isolated environment and should pass malware scanning, signature or provenance checks, hash verification, license review, and an authorized transfer process. The receiving side should record what entered, from which approved source, under which manifest, and who authorized the import.',
          'Export is equally important. Diffs, reports, model outputs, logs, and evidence may contain sensitive source code or operational data. An air-gapped workflow needs a reviewed export policy, redaction where appropriate, malware and secret scanning, destination classification, and chain-of-custody records. Security is not achieved merely by making inbound internet unavailable.'
        ]
      },
      {
        heading: 'Offline identity, updates, and recovery',
        paragraphs: [
          'Identity should use mechanisms available inside the isolated boundary: local accounts, enterprise directory services reachable on the internal network, hardware-backed credentials, or another approved identity system. The architecture should not silently fall back to a cloud identity endpoint. Role mapping, approval routing, and audit identity need to keep working when no external service is reachable.',
          'Updates should be versioned release bundles, not ad-hoc copied files. A release record can include manifest hash, software versions, model hashes, migration steps, compatibility notes, verification results, and rollback instructions. The isolated environment verifies the bundle before installation and records the resulting deployment identity. Where organizational process requires dual control or formal media handling, that process is deployment-specific and should be documented locally.',
          'Vulnerability intelligence becomes stale in disconnected environments, so update cadence is a risk decision. Teams may import signed scanner databases or advisories on an approved schedule and record the database version used by each security verification. A clean scan against a six-month-old database means something different from a clean scan against a current one; evidence should preserve that context.',
          'Recovery must also be offline. Back up runtime state, policies, manifests, model configuration, and evidence to approved internal storage and test restoration without reaching public package repositories. A disaster-recovery exercise that succeeds only when the internet is temporarily enabled does not prove an air-gapped recovery path.'
        ]
      },
      {
        heading: 'Regulatory and certification claims remain environment-specific',
        paragraphs: [
          'Air-gapping can support security objectives in defense, finance, healthcare, public-sector, and critical-infrastructure environments, but network isolation by itself does not establish compliance with NIST, PCI DSS, HIPAA, ISO, sectoral rules, or an organization\'s accreditation process. Controls depend on people, physical security, identity, configuration, logging, incident response, data handling, and many other factors outside the agent package.',
          'CodingAgent.in should therefore provide a control-evidence matrix rather than promising certification. The matrix can point to configuration for network denial, local inference, approval policy, audit events, artifact hashes, update manifests, and access controls, then leave the customer or assessor to map those mechanisms to the applicable framework and deployment boundary.',
          'This evidence-first posture improves procurement discussions. Security teams can ask for concrete artifacts and tests instead of debating a broad compliant label, and product documentation remains accurate across organizations whose regulatory obligations differ.'
        ]
      }
    ],
    faq: [
      {
        question: 'Does an air-gapped CodingAgent deployment automatically satisfy a security framework?',
        answer: 'No. Air-gapping is one architectural control. Compliance or accreditation depends on the full deployment, operational process, people, data, and applicable framework. Use deployment-specific assessment and evidence rather than a blanket claim.'
      },
      {
        question: 'How should teams verify that the agent is truly offline-capable?',
        answer: 'Install and run representative missions in a network-denied test environment while monitoring attempted connections. Verify that models, packages, toolchains, documentation, identity, evidence storage, and recovery procedures all work without unapproved external dependencies.'
      }
    ]
  },

  'ollama-integration': {
    sections: [
      {
        heading: 'Treat Ollama as a local inference runtime, not a trust shortcut',
        paragraphs: [
          'Connecting to Ollama changes where inference runs, but it does not remove the need for model governance. The router should record the configured endpoint, selected model tag or digest where available, context assumptions, tool-use capability, and the policy that allowed local routing. A localhost URL is not proof that every dependency is offline, and a local model is not automatically safe for every repository or tool action.',
          'Model availability should be probed explicitly. CONFIGURED means the endpoint and desired model are configured; CONNECTED means the runtime responded; READY should mean the model required for the mission is present and passes a minimal capability check. Keeping these states separate avoids the common UI failure where a saved URL is displayed as a healthy local AI service.',
          'Requests need bounded timeouts and cancellation. Local inference can stall because a model is loading, memory is exhausted, the host is swapping, or another process owns the GPU. The agent runtime should report these conditions as infrastructure evidence and decide whether policy permits a fallback model. A fallback to cloud must never happen silently when the mission was marked local-only or contains restricted data.',
          'Context construction matters more on smaller local models. Repository retrieval, tool descriptions, policy instructions, and prior conversation can quickly consume the useful context budget. Measure prompt size, reserve output space, compact stale history, and retrieve only relevant code. A larger nominal context window does not remove latency and attention-quality trade-offs.'
        ]
      },
      {
        heading: 'Model lifecycle, hardware fit, and reproducibility',
        paragraphs: [
          'A local model route should be chosen against actual hardware. Record memory capacity, model size or quantization, expected context, concurrency, and whether the runtime can keep the model resident. When a model repeatedly evicts and reloads, theoretical privacy benefits remain but developer experience can become unusable. Routing policy should be allowed to choose a smaller capable model when that produces more predictable mission latency.',
          'Tags can move, so reproducible deployments should record enough identity to determine which artifact was used. Where the local runtime exposes a digest, preserve it in model inventory and mission telemetry. Model changes should pass the same representative coding evaluations used for cloud-provider changes: editing, tool calling where applicable, structured output, long-context behavior, and verifier success on known tasks.',
          'Operational security includes the local endpoint itself. Bind only to interfaces that need access, use host firewall rules, do not expose an unauthenticated inference service to untrusted networks, and separate user workstations from shared multi-tenant inference where the threat model requires it. If a remote Ollama host is used, the transport and access-control design need an explicit protective layer appropriate to the network.',
          'Local inference cost should be described honestly. There may be no per-token invoice from a model API, but hardware purchase or rental, electricity, capacity, maintenance, and operator time remain. Compare local and cloud routes on privacy, latency, throughput, reliability, and total cost for the actual workload instead of reducing the decision to token price alone.'
        ]
      },
      {
        heading: 'Verification stays independent of the local model',
        paragraphs: [
          'The most important integration rule is that moving generation local does not move the definition of done into the model. Builds, type checks, tests, security checks, policy decisions, and artifact hashes remain independent gates. This makes the same mission contract portable across Ollama, another local runtime, or a permitted cloud provider.',
          'If a smaller model needs more repair iterations, telemetry should make that visible through attempts, verifier failures, latency, and compute use. Teams can then choose models based on verified mission outcomes rather than chat impressions. A model that writes elegant explanations but repeatedly fails the repository gates is not the better coding route.',
          'A practical acceptance test for the adapter starts Ollama with a known model, checks model discovery, sends a bounded request, exercises cancellation, forces an unavailable-model error, verifies the no-silent-cloud-fallback rule, and completes one representative code mission through independent verification. That evidence is stronger than simply showing that a curl request returns text.'
        ]
      }
    ],
    faq: [
      {
        question: 'Does using Ollama guarantee that a CodingAgent mission never sends data to the cloud?',
        answer: 'No single runtime integration can guarantee the whole system topology. A local-only policy must also constrain model fallback, MCP tools, network-capable commands, telemetry exporters, and other integrations, then verify the resulting egress behavior.'
      },
      {
        question: 'How should CodingAgent choose among local Ollama models?',
        answer: 'Use capability requirements, verified task performance, available memory, context needs, latency, concurrency, and data policy. Prefer measured mission outcomes over model-size assumptions or leaderboard reputation alone.'
      }
    ]
  },

  'mcp-tool-discovery': {
    sections: [
      {
        heading: 'Discovery is an inventory operation, not an authorization decision',
        paragraphs: [
          'MCP discovery tells the client what a server says it can provide. The returned tool names, descriptions, and schemas are inputs to the agent, so they should be associated with a stable server identity and treated as untrusted metadata. A newly discovered tool should appear as available capability only after schema validation; it becomes callable only after local permission policy accepts the specific invocation.',
          'Cache discovery results with an expiry and a server/version fingerprint rather than refreshing on every model turn. When the server reconnects or its advertised capabilities change, compute a diff: tools added, removed, or schema-changed. Plans that depend on a removed or materially changed capability should be invalidated or replanned. This avoids executing a stale plan against a different tool contract.',
          'Large catalogs need selection. Dumping hundreds of tool descriptions into every prompt wastes context and can reduce model accuracy. Use category, server, mission policy, semantic retrieval, or explicit user selection to build a small candidate set, then provide the model only the schemas it may plausibly invoke. The complete catalog can remain in the client registry without occupying model context.',
          'Descriptions can contain prompt-injection-like instructions. The client should frame tool metadata as data, not higher-priority instructions, and should never let a server description redefine system policy. Server trust level and provenance can help ranking, but even a trusted server does not get authority to override local permission rules.'
        ]
      },
      {
        heading: 'Schema evolution and discoverability tests',
        paragraphs: [
          'Schema compatibility deserves explicit checks. Removing a required argument, changing an enum, widening a path field into arbitrary shell text, or changing a tool from read-only to mutating can affect both reliability and risk. Discovery reconciliation should surface these differences to the policy and planning layers rather than silently replacing the old schema in cache.',
          'Tool aliases and duplicate names across servers need canonical identity. A useful key includes server identity plus tool name, while the UI may show a friendly display label. The model should not be able to select an unintended server because two catalogs both advertise search or deploy. Policy should operate on canonical identity and can constrain particular servers, organizations, or trust classes.',
          'A discovery test suite can start a fixture server, advertise a known catalog, add and remove tools, introduce an invalid schema, change a mutating argument, disconnect, and reconnect with a new server identity. The client should produce predictable inventory state and never retain a callable stale tool. These tests make capability discovery a protocol contract instead of a best-effort convenience.',
          'Observability should record refresh time, server identity, capability count, schema validation errors, catalog changes, and the subset exposed to a mission. Avoid logging secrets that may appear in examples or descriptions. This evidence helps explain why a model could or could not see a tool at a specific point in a mission.'
        ]
      }
    ],
    faq: [
      {
        question: 'Should every discovered MCP tool be included in the model prompt?',
        answer: 'No. Keep a complete client-side inventory, then select a small policy-allowed candidate set relevant to the mission. This reduces context cost and lowers the chance of selecting an irrelevant or risky tool.'
      },
      {
        question: 'What should happen when an MCP tool schema changes?',
        answer: 'Diff the new schema against the cached capability, invalidate affected plans where necessary, re-evaluate permission implications, and expose the change in telemetry. Do not silently execute a stale plan against a changed contract.'
      }
    ]
  }
};

const STATUS_SECTION: Record<string, EditorialSection> = {
  'inr-pricing-billing': {
    heading: 'Implementation status and claim boundary',
    paragraphs: [
      'This page is an architecture and product-design guide. Payment rails, commercial plans, tax behavior, certifications, and pricing are public product facts only when the deployed billing surface and supporting evidence confirm them. Design intent must not be promoted into a live-service claim.'
    ]
  },
  'agent-observability': {
    heading: 'Implementation status and evidence boundary',
    paragraphs: [
      'This page describes the observability contract CodingAgent should implement. Specific exporters, retention periods, dashboards, certifications, and regulatory mappings require deployed evidence before they are described as live capabilities.'
    ]
  },
  'air-gapped-agents': {
    heading: 'Deployment-specific assurance boundary',
    paragraphs: [
      'This page describes engineering controls for disconnected environments. It does not certify CodingAgent for a defense, banking, healthcare, public-sector, or critical-infrastructure framework; that conclusion requires assessment of the complete deployment and operating process.'
    ]
  }
};

function qualifyLegacyText(slug: string, text: string): string {
  if (slug === 'inr-pricing-billing') {
    return `Target-state design, not a statement of current commercial availability: ${text}`
      .replace('The system is PCI-DSS Level 1 certified, the highest level of payment security certification.', 'Any production payment design should minimize card-data scope and rely on independently verifiable provider attestations; no platform certification is asserted here.')
      .replace('Both payment methods are PCI-DSS compliant and follow RBI guidelines for payment processing.', 'Any production payment integration must be assessed against the payment provider\'s applicable PCI-DSS responsibilities and current RBI requirements before a compliance claim is made.')
      .replace('The system complies with RBI (Reserve Bank of India) guidelines for payment processing, including data localization requirements.', 'A production payment implementation must be reviewed against applicable RBI requirements, including any data-location obligations that apply to the selected providers and transaction flow.')
      .replace('Yes, CodingAgent offers a free tier with limited token usage per month.', 'A free tier should be described as available only if it is present on the current live pricing surface; this architecture document does not establish one.')
      .replace('Yes, all published prices are inclusive of GST.', 'Tax-inclusive or tax-exclusive presentation should be taken from the current live pricing and invoice configuration; this architecture document does not establish current pricing.');
  }
  if (slug === 'agent-observability') {
    return `Target observability architecture: ${text}`
      .replace('Reports are generated in standard formats suitable for regulatory submission: SOC 2, ISO 27001, HIPAA, GDPR.', 'Audit exports should provide structured evidence that an organization can map to applicable controls; an export format does not by itself establish SOC 2, ISO 27001, HIPAA, GDPR, or other compliance.')
      .replace('Yes. Automated compliance reports demonstrate governance control effectiveness in standard formats (SOC 2, ISO 27001, HIPAA, GDPR).', 'Telemetry can support control assessment with structured evidence, but it does not establish a certification or regulatory outcome by itself.');
  }
  if (slug === 'air-gapped-agents') {
    return `Deployment guidance rather than a certification claim: ${text}`
      .replace('The distribution is designed to meet these requirements through:', 'A deployment can be engineered to support relevant controls through:')
      .replace('Yes. The distribution is designed to meet defense (NIST 800-171), banking (PCI-DSS, SOX), healthcare (HIPAA), and critical infrastructure compliance requirements through comprehensive audit trails, access controls, and security controls.', 'No blanket compliance outcome is implied. Air-gapped controls, audit trails, access controls, and update procedures can provide evidence for a deployment-specific assessment against whichever framework actually applies.');
  }
  return text;
}

export function publishReadyEditorial(editorial: PillarEditorial): PillarEditorial {
  const extension = EXTENSIONS[editorial.pillarId];
  if (!extension) return editorial;

  const status = STATUS_SECTION[editorial.pillarId];
  const sections = editorial.sections.map((section) => ({
    ...section,
    paragraphs: section.paragraphs.map((paragraph) => qualifyLegacyText(editorial.pillarId, paragraph)),
    bullets: section.bullets?.map((bullet) => qualifyLegacyText(editorial.pillarId, bullet)),
  }));
  const faq = editorial.faq.map((item) => ({
    ...item,
    answer: qualifyLegacyText(editorial.pillarId, item.answer),
  }));

  return {
    ...editorial,
    updated: '2026-09-16',
    definition: extension.definition ?? editorial.definition,
    sections: [...(status ? [status] : []), ...sections, ...extension.sections],
    faq: [...faq, ...(extension.faq ?? [])],
  };
}
