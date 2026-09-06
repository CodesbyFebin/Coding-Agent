import type { PillarEditorial } from '../types';

export const localLlmCoding: PillarEditorial = {
  pillarId: 'local-llm-coding',
  updated: '2026-09-06',
  definition:
    'Local-LLM coding means running code-generation models on your own hardware — a workstation GPU, an on-premise cluster, or an air-gapped enclave — instead of sending repository content to a cloud API. CodingAgent.in treats local runtimes (Ollama, vLLM, llama.cpp, LM Studio) as first-class inference targets, not a fallback: the router sends confidential repositories to local models by policy, matches model size to available VRAM, and reserves cloud frontier models for work that policy permits and genuinely benefits from their capability.',
  sections: [
    {
      heading: 'Why local-first is an engineering decision, not an ideology',
      paragraphs: [
        'Three forces make local inference attractive for coding work. Privacy: proprietary source, credentials in configs, and customer data embedded in fixtures never leave your hardware, which collapses an entire class of vendor-review and compliance work. Economics: after hardware, marginal token cost approaches zero — agents burn tokens fast, and per-seat API bills that look small in a chat demo become material when an agent iterates all day. Availability: local endpoints have no rate limits, no regional outages, and no data-retention surprises; a developer on a plane has the same capability as one in the office.',
        'The honest counterweights: frontier cloud models still lead on the hardest architectural reasoning, long-context synthesis, and rare-language edge cases; local models demand VRAM and operational care. A governance-first router does not pretend otherwise — it classifies work by privacy tier, context requirement and task history, then dispatches accordingly. Local-first means local models get first claim on the work they can verify, not that cloud is banned.',
      ],
    },
    {
      heading: 'The runtime landscape and when each fits',
      paragraphs: [
        'Four runtimes cover nearly every local deployment shape, and CodingAgent speaks to all of them through the same interface.',
      ],
      bullets: [
        'Ollama — the developer-workstation default: one-line model pulls, automatic Metal/CUDA/ROCm acceleration, and a simple HTTP API. Right for individual developers and small teams; 16–64 GB of memory runs capable 7B–32B code models at Q4–Q8 quantization.',
        'vLLM — the team-cluster server: continuous batching and PagedAttention serve many concurrent agent sessions on shared GPUs with OpenAI-compatible APIs. Right for on-premise fleets serving tens to hundreds of engineers.',
        'llama.cpp — the portable engine: GGUF models on CPUs and modest laptops, CI runners, edge boxes. Right for lightweight agents, air-gap-friendly distributions, and environments without discrete GPUs.',
        'LM Studio — the desktop endpoint: a GUI for model discovery and hardware diagnostics exposing a local OpenAI-compatible API. Right for developers who want visual control over model experiments.',
      ],
    },
    {
      heading: 'Model choice and quantization',
      paragraphs: [
        'Model choice within a runtime follows the task profile. Current open code models in the 7B–14B class (for example the Qwen and DeepSeek coder families) handle syntax-level edits, test generation and mechanical refactors well; 32B-class models hold up for multi-file refactors and moderate architecture work. Quantization matters: Q4_K_M fits larger models into available VRAM at a small quality cost, while Q8_0 preserves fidelity for exacting refactors — the context-compaction and quantized-models pillars cover the trade-offs in depth.',
      ],
    },
    {
      heading: 'How VRAM- and privacy-aware routing decides',
      paragraphs: [
        'Routing is a policy evaluation, not a heuristic guess. Four dimensions are checked before any token is dispatched. Privacy tier first: a repository classified Confidential or Air-Gapped locks routing to local endpoints, and a cloud dispatch attempt fails closed with the reason recorded. VRAM fit second: the router queries real GPU memory (NVML on Linux, Metal APIs on macOS) and picks the largest model that fits with the required context window — fast 7B–14B edits versus 32B-class refactors. Context size third: symbol search and call-graph work declare their window needs up front, preventing mid-mission truncation. Task history fourth: per-model verification pass rates on your repository bias future routing toward the models that actually complete work on your codebase.',
      ],
    },
    {
      heading: 'Implementation guidance',
      paragraphs: [
        'A pragmatic rollout sequence: install Ollama on developer machines and run the agent\u2019s read-only modes against local models for a week; measure verification pass rates by task type. Add a vLLM server when local GPUs become the bottleneck — continuous batching turns one GPU into a team resource. Register every endpoint (local and cloud) with declared jurisdictions and capability tiers in the routing policy, and let the audit ledger show you which model actually completed which task. Keep cloud endpoints in the policy for the reasoning-heavy work that benefits, with budgets attached.',
        'Operationally, treat local inference like any production service: health probes that check VRAM headroom and context availability before mission dispatch, model-version pinning with staged upgrades, and evaluation of each new model version on your repository\u2019s benchmark set before promotion.',
      ],
    },
    {
      heading: 'Honest limitations',
      paragraphs: [
        'Local models lag frontier cloud models on the hardest tasks: very long cross-file reasoning, deeply unfamiliar frameworks, and niche languages. Hardware is a real constraint — capable agentic coding wants 24 GB+ VRAM for the larger model classes, and context windows at Q4 quantization trade memory for fidelity. Quantized models can degrade on subtle type-level reasoning; the verifier catches failures, but expect more retries on hard tasks. The architecture\u2019s answer is routing plus verification, not denial: use local for what verifies well, escalate deliberately, and let evidence — not vendor claims — draw the line.',
      ],
    },
    {
      heading: 'Context windows and memory on constrained hardware',
      paragraphs: [
        'The binding constraint in local inference is rarely compute; it is memory. A model\u2019s weights plus its key-value cache for the context window must fit in VRAM (or unified memory) together with the activation overhead of the runtime, and the cache grows with every token of repository context the agent carries. That is why context discipline is a local-first concern before it is a cost concern: AST-aware pruning, diff summarization and compaction decide whether a multi-file refactor fits a 32k window on a 24 GB card or thrashes into swapping that turns a two-minute task into a twenty-minute one.',
        'Practical sizing guidance: on a 16 GB machine, a Q4-quantized 7B–8B model with an 8k–16k window leaves headroom for the agent\u2019s tool traffic; 24–32 GB unlocks 14B–32B models with larger windows; 48 GB+ runs 32B-class models at Q8 with comfortable context. Teams on constrained hardware should also exploit tiering inside a single mission: route symbol search and file reading to small models, reserve the large model for the synthesis step, and let the verifier arbitrate quality. The failure mode to watch for is silent context truncation mid-mission, which the router prevents by declaring window requirements before dispatch rather than discovering them at generation time.',
      ],
    },
    {
      heading: 'Team topologies for local inference',
      paragraphs: [
        'Individual workstations are the entry point, but the durable pattern is a tiered fleet. Tier one is developer-local Ollama for interactive, low-latency work. Tier two is a shared vLLM cluster sized to the team\u2019s concurrent-mission profile, providing batching efficiency that a single workstation cannot. Tier three is the policy ring: endpoints registered with declared jurisdictions and capability classes, so missions route across tiers by privacy classification rather than by whoever configured the endpoint first.',
        'Operating the fleet well is ordinary platform engineering: capacity dashboards keyed to VRAM headroom and queue depth, model-version pinning with canary evaluation against your repository benchmark set, and budget guards that keep a single team\u2019s fan-out from starving another\u2019s. Because every routing decision is recorded with its policy reason, capacity planning gets real data — which tasks actually need the big tier — instead of anecdotes. Teams that start with one shared GPU and honest telemetry typically find they need less hardware than they feared, because verification-gated routing sends only the work that earns it.',
      ],
    },
    {
      heading: 'A practical adoption checklist for local-first agents',
      paragraphs: [
        'Local-first succeeds as an operating decision, not a manifesto. The checklist below sequences the rollout so each step produces evidence before the next grants more authority.',
      ],
      bullets: [
        'Baseline: run the agent in read-only modes (Plan, Ask) against a local model for two weeks; record task graphs produced and verification pass rates by task type.',
        'Classify and route: label repositories by privacy tier and confirm the router locks confidential work to local endpoints, with failed cloud dispatch attempts visible in the ledger.',
        'Size honestly: measure VRAM headroom and context fit per model on your real missions; document the model-to-task matrix rather than trusting vendor claims.',
        'Quantize with verification: evaluate Q4 versus Q8 on your benchmark set before standardizing; watch type-level reasoning tasks for retry-rate regressions.',
        'Add a shared tier: stand up vLLM when concurrency, not capability, becomes the bottleneck; register it with the same policy and jurisdiction declarations.',
        'Close the loop: feed per-model verification history back into routing so model promotion on your codebase is earned by evidence.',
      ],
    },
    {
      heading: 'The two failure patterns, and the fix',
      paragraphs: [
        'Two failure patterns account for most abandoned local-first programs. The first is capability mismatch: routing architecture-heavy reasoning to a model class that cannot verify it, then blaming local inference for the failures — the fix is the task matrix, not a bigger API bill. The second is operational neglect: unpinned model versions, no health probes, and silent context truncation that turns fast local models into a slow lottery. Both are solved by the same discipline that governs the rest of the platform — declare, verify, record — and teams that apply it find local inference becomes the boring, reliable majority of their agent compute, which is exactly the goal.',
      ],
    },
  ],
  faq: [
    {
      question: 'What hardware do I need for local-LLM coding?',
      answer:
        'A 16 GB-memory machine runs capable 7B–8B code models via Ollama or llama.cpp; 24–64 GB unlocks 32B-class models for heavier refactors. Team-serving deployments use vLLM on A100/H100 or multi-GPU workstations.'
    },
    {
      question: 'Which open models are best for coding today?',
      answer:
        'The current open code families in the 7B to 32B class are strong on bounded engineering work; the routing policy tracks per-model verification history on your repository, which matters more than any general leaderboard.'
    },
    {
      question: 'How do I keep context windows from truncating mid-mission?',
      answer:
        'Declare window requirements during routing, use AST-aware pruning and compaction, and let health probes confirm VRAM headroom before dispatch rather than discovering limits at generation time.'
    },
    {
      question: 'Can local models run in CI?',
      answer:
        'Yes. llama.cpp runs GGUF models on standard runners without GPUs, and a shared vLLM endpoint can serve CI workers the same governed models the fleet uses, with the same policy checks.'
    },
    {
      question: 'How often do local models need updating?',
      answer:
        'Pin versions, evaluate each new release against your benchmark set, and promote through the same verification gates as any dependency; the audit ledger makes each promotion reproducible.'
    },
    {
      question: 'What is the single biggest operational mistake to avoid?',
      answer:
        'Routing work to a model class that cannot verify it. The task matrix plus verification history exists to prevent that failure, and it is the difference between local-first that works and local-first that gets abandoned.'
    },
    {
      question: 'What hardware do I need for local-LLM coding?',
      answer:
        'A 16 GB-memory machine runs capable 7B–14B code models via Ollama or llama.cpp; 24–64 GB unlocks 32B-class models for heavier refactors. Team-serving deployments use vLLM on A100/H100 or multi-GPU workstations.',
    },
    {
      question: 'Are local models good enough for real refactoring?',
      answer:
        'For bounded, verifiable work — mechanical refactors, tests, migrations with clear acceptance criteria — current open code models verify well, and per-model pass-rate history in your routing policy shows it. The hardest architectural reasoning still justifies cloud frontier models under policy.',
    },
    {
      question: 'Does local inference mean no data ever leaves my machine?',
      answer:
        'When routing locks to local endpoints, inference happens on your hardware. Air-gapped mode additionally verifies zero external network egress at the sandbox level, which is the pattern for defense, banking and regulated environments.',
    },
    {
      question: 'Can I mix local and cloud models in one mission?',
      answer:
        'Yes — the router dispatches per work unit: local models for code touching confidential files, cloud models for shareable reasoning-heavy units, with every routing decision recorded in the audit ledger.',
    },
  ],
  sources: [
    { label: 'Ollama', href: 'https://ollama.com/' },
    { label: 'vLLM project', href: 'https://docs.vllm.ai/' },
    { label: 'llama.cpp', href: 'https://github.com/ggml-org/llama.cpp' },
    { label: 'CodingAgent source repository', href: 'https://github.com/CodesbyFebin/Coding-Agent' },
  ],
};
