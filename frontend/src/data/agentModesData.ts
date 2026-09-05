import { AgentModeProfile } from '../types';

export const AGENT_MODES: AgentModeProfile[] = [
  {
    id: 'plan',
    code: 'P',
    label: 'Plan Mode',
    badgeClass: 'plan',
    accentColor: '#00d4ff',
    glowColor: 'rgba(0, 212, 255, 0.4)',
    summary: 'Decompose complex goals, map dependencies, surface uncertainty and define acceptance criteria before code changes begin.',
    primaryMission: 'Construct a validated, topologically sorted task DAG with explicit input/output boundaries and acceptance verification criteria.',
    allowedTools: ['filesystem.read', 'ast.symbol_search', 'repo.dependency_tree', 'policy.read'],
    restrictedTools: ['filesystem.write (BLOCKED)', 'shell.execute (BLOCKED)', 'git.commit (BLOCKED)'],
    verificationRequirement: 'Plan DAG must satisfy schema validation, contain no circular dependencies, and define unit tests for every executable task unit.',
    sampleWorkflow: 'Repo Audit → Map Impact Radius → Generate Work Units → Define Test Gates → Await Operator Approval'
  },
  {
    id: 'code',
    code: 'C',
    label: 'Code Mode',
    badgeClass: 'code',
    accentColor: '#39ff14',
    glowColor: 'rgba(57, 255, 20, 0.4)',
    summary: 'Implement scoped changes across files while preserving repository conventions and explicit tool boundaries.',
    primaryMission: 'Synthesize minimal, idiomatic, and defensively structured code edits targeted strictly at the active task unit.',
    allowedTools: ['filesystem.read', 'filesystem.write', 'lsp.diagnostics', 'git.diff'],
    restrictedTools: ['network.http (ASK)', 'git.push (BLOCKED)', 'secrets.view (BLOCKED)'],
    verificationRequirement: 'Every modified file must compile cleanly, pass syntax linter checks, and preserve code style guidelines.',
    sampleWorkflow: 'Inspect Context → Propose Surgical Diffs → Apply Incremental Edits → Check Compiler Diagnostics → Stage Diffs'
  },
  {
    id: 'debug',
    code: 'D',
    label: 'Debug Mode',
    badgeClass: 'debug',
    accentColor: '#ff9500',
    glowColor: 'rgba(255, 149, 0, 0.4)',
    summary: 'Trace failures through logs, tests and code paths, then produce evidence-backed hypotheses and fixes.',
    primaryMission: 'Formulate falsifiable hypotheses for runtime exceptions, isolated test failures, or performance regressions and verify resolutions.',
    allowedTools: ['filesystem.read', 'filesystem.write', 'shell.run_test', 'log.analyze', 'debugger.trace'],
    restrictedTools: ['deploy.production (BLOCKED)', 'db.drop (BLOCKED)', 'git.force_push (BLOCKED)'],
    verificationRequirement: 'A reproducing unit test must fail before the fix and pass unconditionally after applying the patch.',
    sampleWorkflow: 'Reproduce Failure → Isolate Stacktrace → Formulate Hypothesis → Test Minimal Fix → Confirm No Regressions'
  },
  {
    id: 'review',
    code: 'R',
    label: 'Review Mode',
    badgeClass: 'review',
    accentColor: '#ff0080',
    glowColor: 'rgba(255, 0, 128, 0.4)',
    summary: 'Evaluate diffs for correctness, maintainability, regressions and missing tests without self-certifying the authoring agent.',
    primaryMission: 'Provide an adversarial, independent assessment of code quality, performance anti-patterns, boundary errors, and test coverage.',
    allowedTools: ['git.diff', 'filesystem.read', 'coverage.report', 'ast.complexity_metrics'],
    restrictedTools: ['filesystem.write (BLOCKED)', 'shell.execute (BLOCKED)', 'git.merge (BLOCKED)'],
    verificationRequirement: 'Zero unaddressed critical severity flags and confirmed test coverage over newly added code branches.',
    sampleWorkflow: 'Fetch Staged Diff → Inspect Edge Cases → Evaluate Complexity → Review Error Handling → Issue Structured Verdict'
  },
  {
    id: 'security',
    code: 'S',
    label: 'Security Mode',
    badgeClass: 'security',
    accentColor: '#ff3860',
    glowColor: 'rgba(255, 56, 96, 0.4)',
    summary: 'Inspect trust boundaries, unsafe tool use, injection paths, secrets exposure and dependency risk.',
    primaryMission: 'Hunt for OWASP Top 10 vulnerabilities, unauthorized egress points, tainted data flows, hardcoded secrets, and supply chain CVEs.',
    allowedTools: ['secret.scan', 'sast.semgrep', 'deps.audit', 'taint.trace', 'filesystem.read'],
    restrictedTools: ['network.egress (BLOCKED)', 'filesystem.write (READ-ONLY)', 'shell.raw_eval (BLOCKED)'],
    verificationRequirement: 'Cryptographic attestation certifying zero critical CVEs and zero high-entropy secret leaks in staged artifacts.',
    sampleWorkflow: 'Scan Hardcoded Secrets → Trace Untrusted Inputs → Check Dependency CVEs → Audit Egress Endpoints → Sign Security Seal'
  },
  {
    id: 'ask',
    code: 'A',
    label: 'Ask Mode',
    badgeClass: 'ask',
    accentColor: '#d4af37',
    glowColor: 'rgba(212, 175, 55, 0.4)',
    summary: 'Explore a codebase or architecture without changing it—useful for onboarding, design review and repository understanding.',
    primaryMission: 'Answer architectural inquiries, trace data lifecycles, and explain subsystem interactions with accurate line references.',
    allowedTools: ['filesystem.read', 'symbol.find_references', 'git.blame', 'diagram.export'],
    restrictedTools: ['filesystem.write (BLOCKED)', 'shell.execute (BLOCKED)', 'git.write (BLOCKED)'],
    verificationRequirement: 'Every generated explanation must reference verified, existing repository file paths and symbol names.',
    sampleWorkflow: 'Parse Query → Search Symbol Index → Trace Control Flow → Synthesize Architecture Summary → Cite Verified Files'
  }
];
