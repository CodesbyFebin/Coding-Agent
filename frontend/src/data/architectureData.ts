import { ExecutionStage, SecurityPolicyRule } from '../types';

export const EXECUTION_STAGES: ExecutionStage[] = [
  {
    step: 1,
    name: 'Understand',
    headline: 'Read goal, repository context, and policy rules',
    description: 'The agent establishes an isolated context envelope: reading repository configurations, git status, active branch, and applicable security policy constraints before forming any intent.',
    governanceAction: 'Enforce read-only workspace bounds and scrub potential secret leaks from contextual prompts.',
    artifactsProduced: ['Task Context Snapshot', 'Active Policy Manifest', 'Symbol Dependency Map'],
    safetyCheck: 'Verify that target files are within permitted repository boundaries.'
  },
  {
    step: 2,
    name: 'Plan',
    headline: 'Produce a validated, non-cyclic task graph',
    description: 'The intent is systematically decomposed into discrete work units with explicit preconditions, file touched boundaries, and verifiable acceptance criteria.',
    governanceAction: 'Compile DAG into JSON Schema; detect and reject cyclic references or unverified assumptions.',
    artifactsProduced: ['Task Graph (DAG)', 'Acceptance Criteria Spec', 'Expected Diffs Budget'],
    safetyCheck: 'Ensure plan requires human operator approval for any consequential or external side effects.'
  },
  {
    step: 3,
    name: 'Route',
    headline: 'Select model by capability, privacy, and latency',
    description: 'The model fabric evaluates the task profile against hardware capability and privacy policy: private or air-gapped repositories route strictly to local models (Ollama, vLLM, GGUF).',
    governanceAction: 'Check repository classification against allowed model endpoint registries.',
    artifactsProduced: ['Model Routing Token', 'VRAM Allocation Certificate', 'Inference Config'],
    safetyCheck: 'Block dispatch if task privacy classification forbids external cloud egress.'
  },
  {
    step: 4,
    name: 'Execute',
    headline: 'Use tools inside scoped, sandboxed workspaces',
    description: 'The model invokes declared tools through the governed MCP or native layer. Each tool call is filtered through policy authorization before execution in an isolated sandbox.',
    governanceAction: 'Execute in lightweight sandbox (bubblewrap/container); monitor file write bounds.',
    artifactsProduced: ['Unified Diffs', 'Tool Execution Logs', 'Sandbox Traces'],
    safetyCheck: 'Taint tracking prevents untrusted tool outputs from escaping sandbox boundaries.'
  },
  {
    step: 5,
    name: 'Verify',
    headline: 'Run independent acceptance gates and compilers',
    description: 'Completion is determined exclusively by external non-LLM tools: compilers, type-checkers, unit test runners, and security linters. A model declaring "done" is disregarded without evidence.',
    governanceAction: 'Execute hermetic build command; capture compiler exit code and stdout/stderr evidence.',
    artifactsProduced: ['Build Attestation', 'Test Pass Evidence', 'Differential Coverage Report'],
    safetyCheck: 'Assert exit code == 0 and cryptographic artifact hash matches expected digest.'
  },
  {
    step: 6,
    name: 'Learn',
    headline: 'Promote reviewed knowledge and versioned skills',
    description: 'Successful, operator-approved missions can be distilled into versioned SKILL.md modules. Lessons learned, failure patterns, and architectural insights are preserved in durable memory.',
    governanceAction: 'Store sanitized mission telemetry and versioned skill manifests in the repository memory store.',
    artifactsProduced: ['Versioned Skill Manifest', 'Audit Provenance Log', 'Memory Store Delta'],
    safetyCheck: 'Scrub all temporary runtime credentials and personal data prior to knowledge promotion.'
  }
];

export const SECURITY_RULES: SecurityPolicyRule[] = [
  {
    capability: 'Repository read',
    example: 'filesystem.read',
    posture: 'ALLOW',
    why: 'Scoped read-only context required for reasoning and AST indexing within permitted repository paths.',
    riskClass: 'low',
    mitigation: 'Path normalization prevents traversal outside task workspace.'
  },
  {
    capability: 'Workspace write',
    example: 'filesystem.write',
    posture: 'ALLOW',
    why: 'Required for synthesizing code diffs inside isolated ephemeral workspace or git worktree.',
    riskClass: 'low',
    mitigation: 'Restricted strictly to active git worktree; cannot touch root dotfiles or .git/config.'
  },
  {
    capability: 'External network',
    example: 'http.request',
    posture: 'ASK',
    why: 'Potential data egress channel. Agents may need to pull documentation, but unauthorized outbound requests risk exfiltration.',
    riskClass: 'high',
    mitigation: 'Domain allowlisting + operator confirmation dialog specifying destination URL.'
  },
  {
    capability: 'Git commit & push',
    example: 'git.push',
    posture: 'ASK',
    why: 'Modifies upstream remote history and triggers external CI/CD pipelines and webhooks.',
    riskClass: 'medium',
    mitigation: 'Operator must visually review full unified diff and sign commit approval.'
  },
  {
    capability: 'Production deploy',
    example: 'deploy.production',
    posture: 'ASK',
    why: 'Direct operational impact on live customer infrastructure and production services.',
    riskClass: 'critical',
    mitigation: 'Multi-party approval gate + dry-run verification run required.'
  },
  {
    capability: 'Database schema alter',
    example: 'db.migrate / db.drop',
    posture: 'ASK',
    why: 'Risk of catastrophic data loss or table locks in shared databases.',
    riskClass: 'critical',
    mitigation: 'Disallowed on production databases; permitted on ephemeral test containers with confirmation.'
  },
  {
    capability: 'Shell arbitrary eval',
    example: 'shell.exec("rm -rf ...")',
    posture: 'DENY',
    why: 'Arbitrary shell execution with raw parameters bypasses structured tool boundary contracts.',
    riskClass: 'critical',
    mitigation: 'Deny-first posture. Only parameterized, audited commands (e.g. npm test, cargo build) permitted.'
  },
  {
    capability: 'Secrets exposure',
    example: 'env.dump / cat .env',
    posture: 'DENY',
    why: 'Direct compromise of infrastructure credentials, API keys, or private SSH keys.',
    riskClass: 'critical',
    mitigation: 'Secrets broker intercepts and masks keys before tokens enter LLM prompt context.'
  },
  {
    capability: 'Unknown destructive',
    example: '*',
    posture: 'DENY',
    why: 'Any undeclared, non-schema-validated tool invocation is inherently untrusted.',
    riskClass: 'critical',
    mitigation: 'Default-deny architecture: capabilities must be explicitly declared and granted.'
  }
];
