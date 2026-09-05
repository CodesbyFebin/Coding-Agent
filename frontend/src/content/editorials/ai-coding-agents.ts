import type { PillarEditorial } from '../types';

// Editorial: AI Coding Agents — the flagship pillar of codingagent.in.
export const aiCodingAgents: PillarEditorial = {
  pillarId: 'ai-coding-agents',
  updated: '2026-09-06',
  definition:
    'An AI coding agent is a software system that plans and executes engineering tasks using a language model together with repository context, tools, permissions, tests and controlled execution. Unlike autocomplete, which suggests the next few tokens, an agent works across multi-step tasks: it decomposes a goal into work units, edits files, runs builds and tests, and produces artifacts that an independent verifier can check. CodingAgent.in treats the agent as a governed engineering runtime rather than a chat window — the model proposes, tools act inside explicit boundaries, and completion is decided by evidence, not by the model\u2019s own confidence.',
  sections: [
    {
      heading: 'What separates an agent from autocomplete and chat',
      paragraphs: [
        'Autocomplete predicts the next tokens inside a single file while you type. Chat assistants answer questions or produce code blocks that you copy manually. Both leave the developer as the execution layer: someone has to move the code, run the tests, resolve the imports, and notice what broke. An agent closes that loop. It holds a goal, produces a plan, invokes tools that read and write real files, executes commands in a controlled environment, and iterates until an acceptance gate passes or a human decides otherwise.',
        'Three capabilities define the boundary. First, decomposition: the ability to break a goal such as "harden the API and verify the fix" into ordered work units with dependencies. Second, tool use: structured function calls against the filesystem, shell, git, browser or external services through a protocol such as MCP, each call subject to policy. Third, verification: the agent\u2019s own claim of success is worthless unless an independent process — a compiler, a test runner, a linter — confirms it. A system with the first two but not the third is a fast way to generate confident, broken code.',
        'This is why CodingAgent.in describes agents as engineering systems, not models. The model is one component among several. The other components — state machines, task graphs, permission layers, sandboxes, evidence stores, verification runners — are what make the output trustworthy enough to merge.',
      ],
    },
    {
      heading: 'How an agent executes a mission, step by step',
      paragraphs: [
        'CodingAgent\u2019s architecture separates a mission into six governed stages. Each stage has a purpose, produces explicit artifacts, and ends at a boundary where policy decides what happens next.',
      ],
      bullets: [
        'Understand — read the goal, repository state, active branch and applicable policy rules into an isolated context envelope. No intent is formed before the constraints are known.',
        'Plan — decompose intent into a task graph (DAG) of work units with preconditions, file boundaries and acceptance criteria. Cycles are rejected by schema validation.',
        'Route — choose the model for each work unit by capability, privacy classification, required context window and latency. Confidential repositories route to local runtimes; cloud models require policy permission.',
        'Execute — invoke tools inside sandboxed workspaces. Every tool call passes through permission checks; writes are confined to the declared task boundary.',
        'Verify — run the independent gates: builds, typecheckers, unit tests, security linters. The mission is complete only when exit codes and artifact hashes say so.',
        'Learn — promote reviewed outcomes into versioned skills and durable memory, with credentials and personal data scrubbed before anything is stored.',
      ],
    },
    {
      heading: 'Why the tri-phasic core matters',
      paragraphs: [
        'The plan-execute-verify core is deliberately tri-phasic: planning is isolated from execution so that a runaway loop cannot silently rewrite the plan, and execution is isolated from verification so the agent cannot grade its own homework. When a stage produces something consequential — a deploy, a migration, a push to a shared branch — the flow pauses at a human approval gate rather than proceeding on the model\u2019s judgment.',
      ],
    },
    {
      heading: 'Autonomy levels and human sovereignty',
      paragraphs: [
        'Not every mission needs the same autonomy. CodingAgent\u2019s modes map intent to permission scope: Plan mode may read and reason but cannot write; Code mode writes inside a bounded workspace but cannot push or touch secrets; Debug mode runs tests and reads logs; Review mode audits diffs independently and cannot modify what it reviews; Security mode hunts vulnerabilities with read-only access to sources; Ask mode explains the repository without changing it. Each mode declares its allowed and restricted tools, and the runtime enforces the declaration rather than trusting prompts.',
        'Human approval gates sit where consequences concentrate. Database alters, production deploys, force pushes and network egress are classified ASK or DENY by default policy. When a gate triggers, the operator sees the full diff and the destination, and their signed decision is recorded in the mission ledger. This is the sovereignty boundary: models propose changes, humans authorize external side effects.',
      ],
    },
    {
      heading: 'Implementation guidance for engineering teams',
      paragraphs: [
        'Teams adopting coding agents should treat the rollout as infrastructure engineering, not a plugin install. The following sequence reflects what the architecture is designed to support.',
      ],
      bullets: [
        'Start with read-only modes. Run Plan and Ask against real repositories for two weeks before granting write access; review the task graphs agents produce for a senior engineer\u2019s sanity.',
        'Confine writes to ephemeral worktrees. Agents should edit isolated git worktrees or containers, never a developer\u2019s working checkout, so every change arrives as a reviewable diff.',
        'Make verification hermetic. Pin the build and test commands the verifier runs; the agent must not choose its own acceptance criteria at runtime.',
        'Wire approvals to real identity. Approval gates should bind to SSO identities and record signatures, so "who authorized this deploy" always has an answer.',
        'Measure with evidence, not demos. Track verification pass rates, tokens per completed task, and rollback frequency. Publish the numbers internally; they are the only honest baseline for tooling decisions.',
        'Prefer local runtimes for private code. Ollama, vLLM and llama.cpp keep proprietary source on your hardware; route cloud models only for code classified as shareable.',
      ],
    },
    {
      heading: 'The adoption trap: trusting the demo',
      paragraphs: [
        'The most common failure mode in adoption is trusting the demo: a handful of curated successes, then production breakage when the agent meets an unfamiliar codebase. The architectural answer is the same at every scale — independent verification and bounded authority make agent errors boring, visible and cheap to revert.',
      ],
    },
    {
      heading: 'Security implications of agentic execution',
      paragraphs: [
        'An agent that can execute tools is an attack surface. Repository content is untrusted input: a malicious README, issue comment or dependency can carry indirect prompt injection that tries to hijack the agent\u2019s instructions. The defenses are structural, not prompt-based — control-plane and data-plane separation, sanitization of untrusted strings, and deny-by-default tool policies so that an injected instruction finds no tool waiting to execute it.',
        'Sandboxing bounds the blast radius of any successful confusion: filesystem writes confined to the task worktree, network egress filtered through allowlists, secrets injected only at the instant of use and scrubbed afterward, and resource limits that stop runaway loops. Audit logs with cryptographic provenance record every prompt, tool call and diff, which turns post-incident review from archaeology into query.',
      ],
    },
    {
      heading: 'Where CodingAgent.in sits in the landscape',
      paragraphs: [
        'The 2026 agent ecosystem spans IDE-embedded assistants, terminal-native agents, and autonomous frameworks. CodingAgent.in differentiates on governance rather than raw model access: the same core runtime serves IDE, CLI, desktop, web and CI surfaces; routing is model-vendor-neutral with local runtimes as first-class citizens; and the verification-first doctrine — a model saying "done" is never a verification result — applies to every surface equally. For teams in regulated environments, DPDP-oriented controls and air-gapped deployment are architectural goals rather than afterthoughts.',
        'Evaluate any agent — this one included — against four questions: What verifies completion? What bounds tool authority? What records provenance? What happens when it is wrong? If the answers live in architecture rather than marketing, the system is worth piloting.',
      ],
    },
    {
      heading: 'Task decomposition: why the plan is a graph, not a list',
      paragraphs: [
        'The quality of an agent\u2019s output is decided before the first tool call, in how the goal was decomposed. CodingAgent represents plans as directed acyclic graphs rather than ordered to-do lists because real engineering work has structure: a migration touches a schema, which several services depend on; a build fix unblocks tests that unblock documentation. A DAG captures those dependencies so that independent work units can execute in parallel while dependent units wait for their predecessors\u2019 verification to pass.',
        'Every node carries explicit acceptance criteria — the command that will be run and the exit condition that counts as success — plus the set of files it is allowed to touch. This turns the plan into a contract: an executor cannot wander outside its node\u2019s boundary, a failed node can be retried or rolled back without discarding the whole mission, and a reviewing human can approve the structure before any code is written. Cyclic or unbounded plans are rejected at schema validation, which is the earliest and cheapest place for an error to die.',
        'For large repositories, the decomposition stage also decides context strategy: which directories enter the context envelope, which symbols get resolved through the dependency tree, and what gets delegated to isolated subagents that work in parallel under the parent\u2019s supervision. Context discipline here is what keeps later stages affordable — token costs compound fastest when every step drags the entire repository along with it.',
      ],
    },
    {
      heading: 'Observability: an agent you cannot inspect is an agent you cannot trust',
      paragraphs: [
        'Agent runs produce a stream of decisions — which files were read, which tools were invoked with which arguments, what the model drafted, what the verifier reported. CodingAgent treats that stream as first-class telemetry: structured spans for every model invocation and tool dispatch, token and latency accounting per stage, and immutable audit records with cryptographic hashes over inputs, diffs and artifacts.',
        'This is not bureaucracy; it is what makes agents operable. When a mission fails, the evidence chain answers whether the plan was wrong, the tool call was wrong, or the verification was wrong. When costs spike, per-stage token attribution shows whether planning is ballooning or execution is looping. When an auditor asks how a change entered the codebase, the provenance chain answers with hashes rather than recollections.',
        'Teams should expect to operate agents the way they operate CI: dashboards for pass rates and duration, alerts on anomalous tool frequency or token burn, circuit breakers that pause missions that exceed budgets, and killswitches that are tested like any other emergency mechanism.',
      ],
    },
    {
      heading: 'The economics: tokens, local inference and cost governance',
      paragraphs: [
        'Agent economics are dominated by token consumption and model choice. A single multi-file refactor can consume more tokens than a week of chat usage, which is why cost governance belongs in the architecture: budget caps per developer and per repository, per-stage token attribution, automatic fallback to smaller or local models when budgets are exhausted, and prompt-caching plus context compaction to avoid re-paying for unchanged context on every step.',
        'Local runtimes change the economics materially. Routing low-risk, high-volume work — syntax fixes, mechanical refactors, test generation — to local 7B–32B models on existing hardware reduces marginal cost to electricity, keeps code on-premise, and removes rate-limit bottlenecks. Cloud frontier models are then reserved for the architectural reasoning that genuinely benefits from their capability, under policy rather than habit. The routing dimensions — privacy tier, VRAM fit, context size, and per-model verification history — are documented in the local runtimes pillar.',
      ],
    },
    {
      heading: 'Evaluating agents honestly: benchmarks, trials and evidence',
      paragraphs: [
        'Vendor benchmarks rarely match your repository. The evaluation that matters runs against your code: give the candidate agent a set of real, historically completed tasks; measure task completion under the same verification gates you would apply to a human; record tokens, wall-clock time, human interventions required, and any regressions that escaped the gates. Repeat on tasks the agent has never seen and cannot have memorized.',
        'CodingAgent.in publishes its own benchmark doctrine rather than leaderboard claims: reproducible terminal-based evaluation, evidence-backed pass rates, and source logs for every published number. Adopt the same posture internally — an agent program without a measurement harness is a marketing program. The practical baseline: verification pass rate above 90% on scoped tasks before write access expands beyond sandboxes, and a rollback path rehearsed often enough that agent mistakes are cheaper than reviewer fatigue.',
      ],
    },
    {
      heading: 'Limitations and honest boundaries',
      paragraphs: [
        'Agents are strong on bounded, verifiable work — migrations with clear before/after behavior, test backfill, mechanical refactors, dependency upgrades, security triage — and weak where success is subjective or the verification is vague: novel product architecture, UX judgment, ambiguous requirements. Planning that quality of judgment into the mission boundary (human gates, explicit acceptance criteria) is more effective than hoping the model improvises it.',
        'There is also an organizational limitation: agents amplify the engineering practices you already have. Strong test culture, small reviewable diffs and clear ownership boundaries make agent output excellent; weak practices get amplified at machine speed. That is not a defect of the tooling — it is the reason the discipline pillars (verification, security, memory) exist alongside the agent itself.',
      ],
    },
  ],
  faq: [
    {
      question: 'What is an AI coding agent in one sentence?',
      answer:
        'A software system that plans and executes engineering tasks using a language model, repository context, tools, permissions and tests, completing work only when independent verification confirms it.',
    },
    {
      question: 'How is an agent different from GitHub Copilot-style autocomplete?',
      answer:
        'Autocomplete suggests tokens inside the file you are editing and leaves execution to you. An agent decomposes multi-step goals, edits across files, runs tools, and verifies its own output with builds and tests before claiming completion.',
    },
    {
      question: 'Can an AI coding agent push directly to production?',
      answer:
        'Not in a governed architecture. Deployments are classified ASK or DENY in the default policy posture: the agent prepares the change, evidence is attached, and a human operator signs the approval that is recorded in the audit ledger.',
    },
    {
      question: 'Do coding agents need cloud models?',
      answer:
        'No. Local runtimes such as Ollama, vLLM and llama.cpp are first-class targets in CodingAgent\u2019s routing fabric, and confidential repositories are routed to local inference by policy so proprietary code never leaves your hardware.',
    },
    {
      question: 'How do you stop an agent from hallucinating APIs?',
      answer:
        'Hallucination defense is structural: AST validity checks, symbol resolution against real repository definitions, typecheck gates and test execution. A fabricated API fails compilation long before a human reviews it.',
    },
    {
      question: 'What is the fastest safe way to start?',
      answer:
        'Run Plan and Ask modes read-only for two weeks, review the task graphs, then enable writes into ephemeral worktrees with hermetic verification — keeping deploy, database and network capabilities behind approval gates.',
    },
  ],
  sources: [
    {
      label: 'CodingAgent source repository',
      href: 'https://github.com/CodesbyFebin/Coding-Agent',
    },
    { label: 'CodingAgent architecture pillar', href: '/architecture' },
    { label: 'Plan-Execute-Verify pillar', href: '/plan-execute-verify' },
  ],
};
