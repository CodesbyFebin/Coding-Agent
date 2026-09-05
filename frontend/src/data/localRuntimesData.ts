import { LocalRuntimeProfile, SurfacePlatform, FAQItem, TerminalMissionPreset } from '../types';

export const LOCAL_RUNTIMES: LocalRuntimeProfile[] = [
  {
    id: 'ollama',
    name: 'Ollama',
    badge: 'LOCAL',
    category: 'runtime',
    title: 'Developer-Local Inference',
    description: 'Instant local model serving with automatic GPU acceleration across Metal, CUDA, and ROCm. Perfect for single-developer workstations.',
    specSummary: 'Fast quantization (Q4/Q5), 32k context, automatic model pulling',
    recommendedHardware: '16GB-64GB unified memory or 12GB+ VRAM GPU',
    privacyPosture: '100% offline, zero network telemetry'
  },
  {
    id: 'vllm',
    name: 'vLLM',
    badge: 'LOCAL',
    category: 'runtime',
    title: 'High-Throughput Self-Hosted Serving',
    description: 'Continuous batching and PagedAttention for serving multiple concurrent agent subroutines across shared on-premise GPU clusters.',
    specSummary: 'PagedAttention v2, tensor parallelism, OpenAI API compatibility',
    recommendedHardware: 'NVIDIA A100 / H100 or multi-RTX 4090 cluster',
    privacyPosture: 'On-premise enterprise VPC isolation'
  },
  {
    id: 'llama-cpp',
    name: 'llama.cpp',
    badge: 'LOCAL',
    category: 'runtime',
    title: 'Portable GGUF Bare-Metal Runtime',
    description: 'Lightweight C/C++ engine executing quantized GGUF weights with zero dependencies and efficient CPU/RAM fallback.',
    specSummary: 'GGUF format, mmap zero-copy loading, CPU NEON/AVX2 acceleration',
    recommendedHardware: 'Runs on standard laptops, edge devices, and CI runners',
    privacyPosture: 'Air-gapped verified, zero external dependencies'
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    badge: 'LOCAL',
    category: 'runtime',
    title: 'Desktop Model Endpoint',
    description: 'Visual desktop application providing interactive model experimentation, hardware utilization monitoring, and local HTTP endpoint.',
    specSummary: 'GUI catalog, HuggingFace direct download, local port 1234 API',
    recommendedHardware: 'Apple Silicon Mac or Windows/Linux gaming PC',
    privacyPosture: 'Localhost loopback only'
  }
];

export const ROUTING_DIMENSIONS: LocalRuntimeProfile[] = [
  {
    id: 'dim-privacy',
    name: 'Privacy Tier',
    badge: 'POLICY',
    category: 'routing',
    title: 'Repository Data Classification',
    description: 'If code is labeled Confidential or Air-Gapped, routing locks strictly to local models; external cloud APIs are hard-disabled.',
    specSummary: 'Enforced via pre-invocation routing gate',
    recommendedHardware: 'Mandatory local GPU availability',
    privacyPosture: 'Non-negotiable sovereignty boundary'
  },
  {
    id: 'dim-vram',
    name: 'VRAM Fit',
    badge: 'RULE',
    category: 'routing',
    title: 'Hardware-Aware Workload Allocation',
    description: 'Inspects real-time GPU memory headroom: dispatches 7B-14B models for fast localized edits, reserving 32B+ for complex refactors.',
    specSummary: 'NVML and Metal API telemetry queries',
    recommendedHardware: 'Dynamic quantization selection (Q4 vs Q8)',
    privacyPosture: 'Hardware-bounded performance'
  },
  {
    id: 'dim-context',
    name: 'Context Size',
    badge: 'RULE',
    category: 'routing',
    title: 'Required Token Window Sizing',
    description: 'Evaluates required context length from AST search. Short fixes fit standard 8k windows; deep call graph migrations use 32k-128k.',
    specSummary: 'Sliding window + RoPE scaling factors',
    recommendedHardware: 'Proportional to memory allocation',
    privacyPosture: 'Guaranteed context retention'
  },
  {
    id: 'dim-quality',
    name: 'Quality & Task History',
    badge: 'RULE',
    category: 'routing',
    title: 'Empirical Task Evaluation History',
    description: 'Routes based on historical verification pass rates for specific languages (e.g. Qwen2.5-Coder for Python, DeepSeek-Coder for TypeScript).',
    specSummary: 'Pass@1 statistical telemetry per model',
    recommendedHardware: 'Language-specific model weights',
    privacyPosture: 'Evidence-led model selection'
  }
];

export const SURFACES: SurfacePlatform[] = [
  {
    id: 'vscode',
    type: 'IDE',
    name: 'VS Code',
    description: 'Repository-native agent workflows, diff gutter views, inline code proposals, interactive approval buttons, and verification gates.',
    capabilities: ['Inline Diff Reviews', 'Gutter Action Gates', 'Local Model Status Bar', 'Terminal Sync'],
    integrationMethod: 'VS Code Extension API + Language Server Protocol'
  },
  {
    id: 'jetbrains',
    type: 'IDE',
    name: 'JetBrains',
    description: 'Agentic engineering inside established JVM, Python, and polyglot workflows across IntelliJ, PyCharm, and WebStorm.',
    capabilities: ['Refactoring Inspections', 'Gradle/Maven Verification', 'Project Structure Graph'],
    integrationMethod: 'JetBrains Plugin SDK'
  },
  {
    id: 'cli',
    type: 'TERMINAL',
    name: 'Developer CLI',
    description: 'Scriptable autonomous missions, local model control, CI integration, UNIX piped diffs, and headlessly verifiable tasks.',
    capabilities: ['Headless Execution', 'Stdout Diff Streams', 'Cron Automation', 'GGUF Runner'],
    integrationMethod: 'Native binary via Rust/Node with zero dependencies'
  },
  {
    id: 'desktop',
    type: 'DESKTOP',
    name: 'Desktop App',
    description: 'Cross-project missions, visual local model manager, persistent workspace state, and hardware VRAM monitors.',
    capabilities: ['Multi-Project Cockpit', 'Local Model Downloader', 'Hardware Dashboard', 'Offline Mode'],
    integrationMethod: 'Tauri / Webview native shell'
  },
  {
    id: 'web',
    type: 'WEB',
    name: 'Web Cockpit',
    description: 'Remote mission control, project visibility, team audit logs, organization policy distribution, and shared memory.',
    capabilities: ['Team Collaboration', 'Organization Policy Manager', 'Audit Log Explorer', 'Shared Skills'],
    integrationMethod: 'Browser Single Page Application (app.codingagent.in)'
  },
  {
    id: 'mobile',
    type: 'MOBILE',
    name: 'Mobile Gateway',
    description: 'Monitor long-running missions, review staged diffs on the go, and approve consequential deployments with one tap.',
    capabilities: ['Push Notifications', 'One-Tap HITL Approvals', 'Mission Health Checks'],
    integrationMethod: 'PWA & Native Mobile Clients'
  },
  {
    id: 'ci',
    type: 'CI / CD',
    name: 'CI/CD Pipelines',
    description: 'Automated PR triage, security patch generation, typecheck verification, and test coverage gating in pull request workflows.',
    capabilities: ['GitHub Actions Runner', 'GitLab CI Integration', 'Automated PR Reviews', 'SLSA Attestations'],
    integrationMethod: 'Containerized Runner Action'
  },
  {
    id: 'mcp',
    type: 'PROTOCOL',
    name: 'MCP Fabric',
    description: 'Consume and expose governed tools, compiler analyzers, and external APIs through Model Context Protocol standard.',
    capabilities: ['Bidirectional Tool Discovery', 'Policy Interception', 'JSON-RPC Stdio/SSE', 'Taint Tracking'],
    integrationMethod: 'Anthropic Model Context Protocol Standard'
  }
];

export const TERMINAL_MISSIONS: TerminalMissionPreset[] = [
  {
    id: 'repair-auth-boundary',
    name: 'Harden API & Verify Fix',
    command: 'codingagent run "harden the API and verify the fix"',
    description: 'Audit an insecure token validation handler, patch SQL injection vulnerability, and run hermetic verification tests.',
    logs: [
      { type: 'prompt', label: '❯', text: 'codingagent run "harden the API and verify the fix"' },
      { type: 'step', label: 'plan', text: 'decompose repository task → 5 work units across src/auth & src/api' },
      { type: 'step', label: 'route', text: 'choose model by capability, privacy [Local Ollama Qwen2.5-Coder 32B]' },
      { type: 'tool', label: 'tool', text: 'filesystem.read(src/auth/jwt.ts) →', status: 'ALLOW' },
      { type: 'tool', label: 'tool', text: 'filesystem.write(src/auth/jwt.ts) → diff staged in sandbox workspace', status: 'ALLOW' },
      { type: 'step', label: 'policy', text: 'evaluate action: shell.run("npm test") → within isolated container', status: 'ALLOW' },
      { type: 'verify', label: 'verify', text: 'build / typecheck / unit tests (14 passed, 0 failed, 0 warnings)' },
      { type: 'result', label: 'result', text: 'completion accepted via test evidence: SHA-256 [e3b0c44298fc1c149...]' }
    ]
  },
  {
    id: 'mcp-tool-discovery',
    name: 'MCP Governed Discovery',
    command: 'codingagent mcp discover --server db-pg --scope staging',
    description: 'Connect to an external PostgreSQL MCP server, filter tools through organization policy, and authorize read-only schema queries.',
    logs: [
      { type: 'prompt', label: '❯', text: 'codingagent mcp discover --server db-pg --scope staging' },
      { type: 'step', label: 'mcp', text: 'negotiating JSON-RPC over stdio with mcp-server-postgres:1.4.0' },
      { type: 'step', label: 'schema', text: 'discovered 4 tools: [db.query, db.describe_tables, db.alter_table, db.drop_table]' },
      { type: 'tool', label: 'policy', text: 'filter tool "db.describe_tables" →', status: 'ALLOW' },
      { type: 'tool', label: 'policy', text: 'filter tool "db.query" [SELECT only] →', status: 'ALLOW' },
      { type: 'tool', label: 'policy', text: 'filter tool "db.drop_table" → destructive side effect', status: 'DENY' },
      { type: 'verify', label: 'verify', text: 'capability manifest registered with 2 approved tools, 2 blocked' },
      { type: 'result', label: 'result', text: 'MCP runtime ready with zero privilege escalation risk' }
    ]
  },
  {
    id: 'local-ollama-review',
    name: 'Air-Gapped Code Review',
    command: 'codingagent review --policy air-gapped --branch feature/billing',
    description: 'Inspect a sensitive billing pull request using a strictly local 100% offline model without network egress.',
    logs: [
      { type: 'prompt', label: '❯', text: 'codingagent review --policy air-gapped --branch feature/billing' },
      { type: 'step', label: 'enclave', text: 'network egress hard-locked: zero external packets permitted' },
      { type: 'step', label: 'route', text: 'local endpoint verified: Ollama (DeepSeek-Coder-V2-Lite 16GB VRAM)' },
      { type: 'tool', label: 'tool', text: 'git.diff(origin/main..feature/billing) → 184 lines added, 32 deleted' },
      { type: 'step', label: 'sast', text: 'scanning for floating-point currency arithmetic anti-patterns...' },
      { type: 'tool', label: 'audit', text: 'detected Number() used instead of Decimal on line 42', status: 'ASK' },
      { type: 'verify', label: 'verify', text: 'differential analysis complete: 1 critical finding, 2 suggestions' },
      { type: 'result', label: 'result', text: 'audit report written to .agent/audit/billing-pr-84.json' }
    ]
  },
  {
    id: 'typecheck-verification',
    name: 'Hermetic Typecheck & Refactor',
    command: 'codingagent refactor "migrate legacy callbacks to async/await in src/db"',
    description: 'Modernize database callbacks into Promise-based async functions and verify with TypeScript compiler.',
    logs: [
      { type: 'prompt', label: '❯', text: 'codingagent refactor "migrate legacy callbacks to async/await in src/db"' },
      { type: 'step', label: 'plan', text: 'identify 6 call sites in src/db/pool.ts and src/db/queries.ts' },
      { type: 'tool', label: 'tool', text: 'filesystem.write(src/db/pool.ts) → convert queryCallback() to async', status: 'ALLOW' },
      { type: 'tool', label: 'tool', text: 'filesystem.write(src/db/queries.ts) → replace then chains with await', status: 'ALLOW' },
      { type: 'step', label: 'compiler', text: 'invoking tsc --noEmit --project tsconfig.json' },
      { type: 'verify', label: 'verify', text: 'typescript compilation: 0 errors, 0 warnings (1.24s)' },
      { type: 'verify', label: 'verify', text: 'vitest run src/db/*.test.ts: 18 passed in 890ms' },
      { type: 'result', label: 'result', text: 'task verified: model self-declaration superseded by compiler proof' }
    ]
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'core',
    question: 'What is CodingAgent.in?',
    answer: 'CodingAgent.in is a sovereign, open-source, local-LLM-first agentic engineering project focused on AI coding agents, controlled tool use, MCP integrations, verification and practical developer workflows.'
  },
  {
    id: 'faq-2',
    category: 'core',
    question: 'What is an AI coding agent?',
    answer: 'An AI coding agent is a software system that can plan and execute engineering tasks using a language model, repository context, tools, permissions, tests and controlled execution. Unlike autocomplete alone, an agent can work across multi-step tasks and produce artifacts for verification.'
  },
  {
    id: 'faq-3',
    category: 'local',
    question: 'Does CodingAgent.in focus on local LLMs?',
    answer: 'Yes. Local-LLM-first architecture is a core design direction. The routing model is intended to treat local runtimes as first-class targets for private repositories, offline work and hardware-aware inference.'
  },
  {
    id: 'faq-4',
    category: 'mcp',
    question: 'How does MCP fit into CodingAgent.in?',
    answer: 'Model Context Protocol is treated as a governed capability layer. Agents can discover tools, but effective access should be the intersection of available capabilities, agent scope, project policy and operator approval.'
  },
  {
    id: 'faq-5',
    category: 'security',
    question: 'How does CodingAgent.in approach agent security?',
    answer: 'The architecture emphasizes least privilege, isolated workspaces, secret scoping, network controls, approval gates, audit trails and independent verification rather than unrestricted autonomous tool use.'
  },
  {
    id: 'faq-6',
    category: 'core',
    question: 'Is every model or integration shown on this page live?',
    answer: 'No. This homepage describes the platform architecture and product direction. It intentionally avoids fabricated live-status claims, unsupported model counts, customer numbers, ratings or benchmark results.'
  },
  {
    id: 'faq-7',
    category: 'core',
    question: 'Where is the application?',
    answer: 'The application entry point is app.codingagent.in. This public homepage is the product, architecture and knowledge authority surface.'
  },
  {
    id: 'faq-8',
    category: 'security',
    question: 'What happens when an agent needs to execute an unknown or destructive command?',
    answer: 'CodingAgent operates under a strict deny-first posture. Any unrecognized or destructive action (like arbitrary shell evaluation or dropping tables) is blocked immediately. Only authorized actions with parameter validation can proceed.'
  }
];
