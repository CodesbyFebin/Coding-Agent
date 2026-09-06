import type { PillarEditorial } from '../types';

export const independentVerification: PillarEditorial = {
  pillarId: 'independent-verification',
  updated: '2026-09-06',
  definition:
    'Independent verification is the principle that agent self-assessment is never accepted as evidence of completion: builds, type checkers, test runners, security scanners, and artifact hashes — systems with no connection to the model that produced the code — decide whether work is done. A model saying "done" is not a verification result; exit code zero is.',
  sections: [
    {
      heading: 'Why self-assessment fails',
      paragraphs: [
        'Language models are probabilistic systems. When an agent claims it has completed a task, that claim is a statistical judgment, not a measured fact. Models hallucinate APIs, misread requirements, introduce subtle regressions while fixing visible ones, and — most dangerously — generate code that looks correct and reads correctly while failing on edge cases. None of these failure modes are visible in the model\u2019s own confidence.',
        'The failure is compounded by feedback loops: an agent asked "is it done?" will tend to say yes, because the conversation context biases toward agreement. Self-verification inside the same context window inherits the same bias. The only cure is an evaluator that shares no context, no vocabulary, and no incentive with the generator — a compiler does not know what the model intended, and that ignorance is precisely what makes its judgment trustworthy.',
      ],
    },
    {
      heading: 'The gate hierarchy',
      paragraphs: [
        'Verification is layered from cheapest to most expensive, and each layer answers a different question. The conjunction rule applies: a mission passes only when every applicable gate passes \u2014 no weighting lets a strong test result excuse a type failure. Gates run hermetically in clean environments on pinned toolchains, so results reflect the code, not the machine.',
      ],
      bullets: [
        'Build \u2014 does the code compile? Catches syntax errors, missing imports, broken references. The fastest gate; nothing else matters if this fails.',
        'Typecheck \u2014 do the types satisfy their contracts? Catches interface violations, null-safety errors, and signature drift across file boundaries.',
        'Unit tests \u2014 does behavior match expectations? Existing tests catch regressions; mission-generated tests must themselves pass review before counting.',
        'Security \u2014 any new vulnerabilities? Dependency CVEs, static analysis findings, secret leakage scans.',
        'Artifact hashes \u2014 are the inputs and outputs exactly what the record says they are? Cryptographic fingerprints make verification reproducible and tamper-evident.',
      ],
    },
    {
      heading: 'What independence means architecturally',
      paragraphs: [
        'Independence is a property of the system wiring, not a label. The verification runner shares no process, no context, and no configuration authority with the agent runtime: it receives the workspace, the declared gate commands, and nothing else. The agent cannot choose its own acceptance criteria at runtime — the mission configuration pins the commands before execution begins, and changing them requires a new mission.',
        'Evidence flows one way. The runner emits structured results (exit codes, output, coverage, hashes) into the mission ledger; the agent may read failures to attempt repairs, but it cannot write to the evidence stream. When a repair cycle runs, it re-enters the full loop — the new diff is verified from scratch, never grandfathered by the previous pass.',
      ],
    },
    {
      heading: 'Writing gates that catch real failures',
      paragraphs: [
        'Gate quality decides everything. A build gate against a stale lockfile, a test suite with flaky cases, a security scanner in permissive mode — each converts the verification system from an authority into a rubber stamp. Practical guidance: pin toolchain versions in the gate configuration; quarantine flaky tests rather than retrying them into green; run gates with the same flags CI uses; and require new code paths to carry tests before counting as covered. Custom gates (lint thresholds, coverage floors, performance budgets) belong in the same pipeline with the same exit-code semantics as the standard gates.',
      ],
    },
    {
      heading: 'Honest limits',
      paragraphs: [
        'Verification proves what the gates express and nothing more. A full green sweep does not mean the feature is the right feature, the requirements were correct, or the tests themselves were meaningful. Independent verification replaces the weakest link — the model\u2019s self-assessment — with strong evidence for declared criteria; the criteria themselves remain an engineering and product responsibility. That division is not a weakness of the architecture; it is the honest boundary between what machines can prove and what humans must decide.',
      ],
    },
  ],
  faq: [
    {
      question: 'Why can\u2019t the agent verify its own work?',
      answer:
        'Because the model is probabilistic and context-biased: it tends to agree with itself, misses its own edge cases, and cannot objectively measure correctness. Independent systems — compilers, type checkers, test runners — share none of those failure modes and produce deterministic pass/fail evidence.',
    },
    {
      question: 'Which gates run for every mission?',
      answer:
        'The mission configuration pins the gates before execution: typically build, typecheck, unit tests, and security scanning, plus any organization-specific custom gates. All applicable gates must pass; the conjunction is the completion criterion.',
    },
    {
      question: 'What happens when a gate fails?',
      answer:
        'The failure evidence flows to the agent, which may attempt a repair. Repairs re-enter the full loop — the new workspace state is re-verified from scratch. If retries are exhausted, the mission escalates to human review with the complete evidence chain attached.',
    },
    {
      question: 'Can the agent change its acceptance criteria mid-mission?',
      answer:
        'No. Gate commands are pinned in the mission configuration before execution. Changing criteria requires a new mission — otherwise the agent could weaken its own definition of done.',
    },
  ],
  sources: [
    { label: 'CodingAgent source repository', href: 'https://github.com/CodesbyFebin/Coding-Agent' },
    { label: 'Plan-Execute-Verify pillar', href: '/plan-execute-verify' },
  ],
};
