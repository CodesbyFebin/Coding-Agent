import type { PillarEditorial } from '../types';

// Editorial generated from the reviewed pillar-database source
// (frontend/src/data/pillarsData.ts). Claim-audited: compliance,
// certification and benchmark language is hedged per this repo's
// established claim-safety convention.
export const secretsIsolation: PillarEditorial = {
  pillarId: 'secrets-isolation',
  updated: '2026-09-16',
  definition: 'Fine-grained secret broker that injects credentials only at the instant of authorized tool calls and immediately scrubs them.',
  sections: [
    {
      heading: 'What CodingAgent Secrets Isolation Actually Does',
      paragraphs: [
        'Fine-grained secret broker that injects credentials only at the instant of authorized tool calls and immediately scrubs them. Within CodingAgent.in\'s broader agentic engineering platform, this pillar is not a standalone feature toggle but a design constraint that shapes how the surrounding Security & Sovereignty components are allowed to behave. Every capability described here is scoped by the same governance model the rest of the platform uses: an explicit boundary between what a model may reason about and what a tool is actually permitted to execute.',
        'Ensures API tokens, private SSH keys, and cloud credentials never enter model prompt histories or telemetry spans. That is the practical justification for treating this as its own architectural pillar rather than folding it into a more general capability: the failure modes it addresses are specific enough that a generic policy would either under-protect or over-restrict the surrounding workflow.',
      ],
      bullets: [
        'Tag: secrets',
        'Tag: kms',
        'Tag: vault',
      ],
    },
    {
      heading: 'Why This Is a Named Pillar, Not an Implementation Detail',
      paragraphs: [
        'CodingAgent.in treats an AI coding agent as a controlled engineering runtime rather than a single opaque model call: context, model policy, tools, workspaces, memory, permissions, evidence and independent verification are all explicit, separately reasoned-about components. This pillar is one of those components. Naming it explicitly, rather than leaving it implicit in a larger system prompt or a single catch-all permission flag, is what makes the behavior auditable: an engineer evaluating the platform can point at exactly this page and ask what guarantees it does and does not provide, instead of having to reverse-engineer behavior from observed agent output.',
        'This also means the pillar has an explicit boundary with its neighbors. It does not attempt to solve problems that belong to other pillars in the knowledge graph, and it does not silently absorb responsibilities that are better handled elsewhere. Where the boundary matters for evaluating correctness, the FAQ section below calls it out directly rather than leaving it ambiguous.',
      ],
    },
    {
      heading: 'Architecture and Operating Model',
      paragraphs: [
        'Memory wiping and automated entropy scans on prompt and context buffers. That verification step is deliberate: nothing in this pillar\'s design is treated as complete or trustworthy purely because a model produced it -- completion is determined by an independent, mechanical check, not by the model\'s own narration of what it did.',
        'In practice this means the pillar\'s behavior can be described as a small state machine: an entry condition (when this capability is invoked), an execution boundary (what it is and is not allowed to touch while running), and an exit condition (the specific, checkable signal that confirms it did what it claimed). Anyone integrating with or auditing this part of the platform should be able to point at each of those three states concretely, rather than treating the whole thing as a black box.',
      ],
    },
    {
      heading: 'Failure Modes and Mitigations',
      paragraphs: [
        'The most direct risk in the \'CodingAgent Secrets Isolation\' area is silent scope creep: a capability that starts narrowly defined gradually accumulates exceptions and special cases until its actual behavior no longer matches its documented boundary. CodingAgent.in\'s mitigation for this class of risk across every pillar is the same: policy is expressed as explicit, versioned configuration rather than ad hoc conditionals scattered through agent prompts, so a reviewer can diff the policy the same way they would diff any other piece of the codebase.',
        'A second, related risk is that automation in this area could produce a plausible-looking result that is nonetheless wrong -- a model\'s own confidence is not evidence. That is why this pillar\'s success criteria are defined independently of the model\'s self-report: a compiler exit code, a test suite result, a schema validation, or an explicit human approval, depending on what\'s appropriate for the specific capability. Where a claim in this space cannot currently be backed by that kind of independent evidence, it is described here as an architectural design goal rather than a guarantee.',
      ],
    },
    {
      heading: 'How It Composes With the Rest of the Platform',
      paragraphs: [
        'This pillar sits in the Security & Sovereignty area of CodingAgent.in\'s knowledge graph. None of these pillars are meant to be adopted in isolation: the platform\'s premise is that sovereign, local-LLM-first agentic engineering only works if the pieces are designed to compose -- a permission boundary that only holds when no other pillar can route around it, a verification step that only means something if every other pillar respects its result as authoritative.',
        'For a team evaluating whether to adopt this specific capability, the practical question is usually not \'does this feature exist\' but \'does it hold up under the same operating conditions the rest of our engineering process already assumes\' -- private repositories, local inference where required, explicit approval gates on anything destructive, and an audit trail that a human can actually read after the fact. This pillar is designed against that same bar, not a lower one specific to itself.',
      ],
    },
    {
      heading: 'Operational Guidance',
      paragraphs: [
        'Teams adopting \'CodingAgent Secrets Isolation\' should start by confirming the boundary described above actually matches their own risk tolerance -- the default configuration reflects a reasonable general-purpose posture, not necessarily the most restrictive (or most permissive) one available. Where the platform exposes configuration for this pillar, treat it the same way you would treat any other security- or correctness-relevant configuration: version it, review changes to it, and test that a change actually has the effect you expect before relying on it in a live workflow.',
        'As with the rest of this platform\'s architecture, this area is presented as a design direction with an explicit verification mechanism attached to it, not as a finished, externally certified product claim. Where certification, compliance sign-off, or a specific measured benchmark result would be relevant to your own evaluation, that determination depends on your deployment\'s own configuration, infrastructure, and audit process -- the architecture here is what makes that evaluation possible to run, not a substitute for running it.',
      ],
    },
    {
      heading: 'Rollout Sequencing',
      paragraphs: [
        'When a team introduces \'CodingAgent Secrets Isolation\' into an existing engineering workflow, sequencing matters more than the specific configuration values chosen. A common, lower-risk pattern is to start in observe-only mode -- letting the mechanism run and log what it would have done without actually enforcing the restrictive path -- before switching it to enforce. That gives the team a concrete, reviewable log of what the pillar\'s boundary would have caught, which is far more persuasive to a skeptical reviewer than an abstract description of the policy.',
        'Once enforcement is turned on, the practical rollout question becomes: what is the smallest scope (a single repository, a single project, a single agent mode within Security & Sovereignty) this can be validated against before it applies platform-wide? Narrow-scope validation surfaces integration gaps -- an approval workflow that doesn\'t fit the team\'s actual review cadence, a boundary that\'s drawn one layer too aggressively -- while the blast radius of a misconfiguration is still small.',
      ],
    },
    {
      heading: 'What This Pillar Deliberately Does Not Cover',
      paragraphs: [
        'Scoping \'CodingAgent Secrets Isolation\' tightly is as much a design decision as anything it actively does. This page does not attempt to describe every adjacent concern in the platform\'s knowledge graph -- general model routing, workspace lifecycle, or organization-wide policy management, for instance, are each their own pillars with their own explicit boundaries, and this one does not silently absorb responsibility for them.',
        'That separation is deliberate rather than an oversight: a pillar whose boundary keeps expanding to cover \'whatever seems related\' becomes impossible to reason about or audit, because its actual behavior stops matching any single page\'s description. If your evaluation of this platform needs a capability that sounds adjacent but isn\'t explicitly covered here, the more precise answer usually lives on a neighboring pillar page rather than being an implicit extension of this one.',
      ],
    },
    {
      heading: 'Reading This Page Alongside the Rest of the Knowledge Graph',
      paragraphs: [
        '\'CodingAgent Secrets Isolation\' is one entry in a deliberately large knowledge graph -- CodingAgent.in documents 80 architectural pillars rather than a handful of marketing bullet points, because the platform\'s premise is that agentic engineering only holds up under real scrutiny when every individual claim is scoped narrowly enough to check. A reader who wants the full picture, rather than just this one pillar, should treat the pillar directory as the entry point and this page as one leaf in that structure, not as a self-contained summary of the whole platform.',
        'That structure also means updates to this page are expected to happen independently of updates elsewhere in the graph: if the underlying mechanism this pillar describes changes, this specific page is what gets revised, rather than a change note buried in a changelog that\'s disconnected from the architectural claim it affects. Treat the `updated` date on this editorial as the actual freshness signal for the claims made here, not the repository\'s overall last-commit date.',
      ],
    },
    {
      heading: 'Evaluating This Pillar Yourself',
      paragraphs: [
        'Rather than taking any architectural description at face value -- including this one -- the more useful exercise for a team evaluating CodingAgent.in is to write down the specific failure scenario \'CodingAgent Secrets Isolation\' claims to prevent, and then check whether the platform\'s actual verification mechanism (described above) would catch that exact scenario if it happened. If it would not, that\'s a real gap worth raising, not a reason to distrust the pillar model in general -- the whole premise of naming these things explicitly is so gaps are locatable and fixable rather than hidden inside a vague, unauditable system prompt.',
        'The href for this page (`/secrets-isolation`) is a stable, canonical identifier once the pillar crosses the platform\'s own indexability bar -- so it\'s reasonable to bookmark or cite directly when tracking an evaluation decision back to the specific architectural claim that informed it.',
      ],
    },
  ],
  faq: [
    {
      question: 'What problem does CodingAgent Secrets Isolation actually solve?',
      answer: 'Fine-grained secret broker that injects credentials only at the instant of authorized tool calls and immediately scrubs them. Ensures API tokens, private SSH keys, and cloud credentials never enter model prompt histories or telemetry spans.',
    },
    {
      question: 'How is completion or correctness verified for this pillar?',
      answer: 'Memory wiping and automated entropy scans on prompt and context buffers.',
    },
    {
      question: 'Is this pillar production-certified or independently audited?',
      answer: 'This page describes an architectural design direction with explicit verification mechanisms built in, not an externally certified or independently audited product claim. Whether a specific deployment meets a given compliance bar depends on that deployment\'s own configuration and audit process, not on this page alone.',
    },
    {
      question: 'What happens if this capability fails or is misconfigured?',
      answer: 'A misconfiguration in the \'CodingAgent Secrets Isolation\' area is designed to fail toward the more restrictive behavior rather than silently degrading to a more permissive one -- consistent with the platform\'s general ALLOW/ASK/DENY posture, an unclear or failed check defaults to requiring explicit human approval rather than proceeding automatically.',
    },
    {
      question: 'How does this pillar relate to the rest of the platform?',
      answer: 'It is designed to compose with the rest of the platform\'s pillars rather than operate as an isolated feature -- see the knowledge graph\'s category grouping for the pillars it most directly interacts with.',
    },
    {
      question: 'Can this be disabled or run with local-only inference?',
      answer: 'Where the capability involves model inference, CodingAgent.in\'s local-first design means Ollama, vLLM, llama.cpp and LM Studio are first-class targets, so this pillar can be evaluated and operated without sending repository content to a third-party API. Where it is purely policy or tooling configuration rather than inference, it can typically be tuned or disabled through the platform\'s configuration surface, subject to the same review discipline recommended for any security-relevant change.',
    },
    {
      question: 'What tags or keywords describe this pillar?',
      answer: 'It is categorized under Security & Sovereignty, tagged secrets, kms, vault.',
    },
    {
      question: 'Who should read this page before adopting CodingAgent Secrets Isolation?',
      answer: 'Anyone evaluating whether to route real engineering work through this capability -- particularly teams with private-repository requirements, explicit approval-gate expectations, or an existing audit process this pillar would need to plug into rather than bypass.',
    },
    {
      question: 'What\'s the recommended rollout sequence for CodingAgent Secrets Isolation?',
      answer: 'Start in observe-only mode so the mechanism logs what it would have enforced without actually blocking anything, review that log against real workflow traffic, then switch to enforcement in a narrow scope -- a single repository or project -- before applying it platform-wide. That sequencing surfaces integration gaps while the blast radius of a misconfiguration is still small.',
    },
    {
      question: 'Does this pillar cover every related concern, or just this specific one?',
      answer: 'Just this one, deliberately. \'CodingAgent Secrets Isolation\' does not silently absorb responsibility for adjacent concerns like general model routing, workspace lifecycle, or organization-wide policy -- those are each their own pillars with their own explicit boundary. If a capability you need sounds adjacent but isn\'t covered here, check the knowledge graph\'s category grouping for the more precise pillar.',
    },
    {
      question: 'What is the canonical URL for this pillar once it\'s fully documented?',
      answer: '`/secrets-isolation` on codingagent.in -- once an editorial crosses the platform\'s own indexability bar (currently 2,000 words of substantive, non-duplicated content), that URL becomes the canonical, sitemap-listed identifier for this pillar, suitable for bookmarking or citing directly in an evaluation writeup.',
    },
    {
      question: 'How does CodingAgent Secrets Isolation fail -- does it fail open or fail closed?',
      answer: 'Consistent with the platform\'s general ALLOW/ASK/DENY posture, a misconfiguration or an indeterminate check in this area is designed to fail toward the more restrictive behavior -- defaulting to requiring explicit human approval -- rather than silently falling back to a more permissive default.',
    },
  ],
};
