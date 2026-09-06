import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const planExecuteVerify: PillarEditorial = {
  "pillarId": "plan-execute-verify",
  "updated": "2026-09-06",
  "definition": "CodingAgent Plan-Execute-Verify is the core tri-phasic execution loop that separates planning from execution and execution from verification, ensuring that every agent mission follows a structured path from goal decomposition through governed tool execution to independent acceptance testing.",
  "sections": [
    {
      "heading": "The Tri-Phasic Execution Model",
      "paragraphs": [
        "The plan-execute-verify loop is the foundational execution model of CodingAgent. It separates three fundamentally different activities — planning what to do, doing it, and checking that it was done correctly — into distinct phases with distinct governance controls. This separation is what makes agent behavior predictable, auditable, and trustworthy.",
        "In traditional software development, these three activities are often interleaved: a developer plans while coding, tests while coding, and fixes while testing. This interleaving works for human developers who can hold complex state in their heads, but it creates problems for AI agents that need explicit structure to operate reliably.",
        "The plan phase produces a validated task graph that defines what will be done, in what order, with what tools, and with what acceptance criteria. The execute phase works through the task graph, invoking governed tools within sandboxed workspaces. The verify phase runs independent acceptance checks that determine whether the execution produced correct results.",
        "This separation means that plans can be reviewed before execution begins, execution can be monitored as it proceeds, and verification can confirm correctness after execution completes. Each phase has its own governance controls, its own audit trail, and its own failure modes."
      ]
    },
    {
      "heading": "Planning: From Goal to Task Graph",
      "paragraphs": [
        "The planning phase transforms a high-level engineering goal into a structured, validated task graph. This is not a simple to-do list — it is a directed acyclic graph (DAG) that captures dependencies between work units, identifies parallelizable tasks, and defines acceptance criteria for each unit.",
        "The planning process begins with context acquisition: the agent reads the repository structure, understands the codebase architecture, identifies relevant files and modules, and reviews applicable policies. This context forms the basis for plan generation.",
        "Plan generation uses the language model's reasoning capabilities to decompose the goal into work units, identify dependencies between units, and assign tools and verification criteria to each unit. The plan is then validated: it is checked for cyclical dependencies (which would make execution impossible), for schema compliance (which ensures all required fields are present), and for feasibility (which checks that required tools are available and permitted).",
        "The validated plan is presented to the operator (or stored for automated execution) before any code changes are made. This \"plan review\" step is a critical governance control: it allows human engineers to verify that the agent's understanding of the task matches their own understanding before the agent begins making changes."
      ]
    },
    {
      "heading": "Execution: Governed Tool Invocation",
      "paragraphs": [
        "The execution phase works through the validated task graph, invoking tools in dependency order. Each tool invocation is governed by the permission system: the tool must be declared in the mission configuration, the arguments must satisfy the tool's schema, and the permission posture (ALLOW, ASK, or DENY) must permit the invocation.",
        "Execution happens within a sandboxed workspace that isolates the agent's changes from the main repository. File writes are restricted to this workspace, preventing accidental modification of files outside the task scope. Network access is controlled by the mission's network policy. Shell commands are restricted to an approved command list.",
        "Each tool invocation produces structured evidence: the tool name, the arguments, the return value, the permission decision, and the timestamp. This evidence is stored in the audit log and contributes to the mission's verification record.",
        "If a tool invocation fails (returns an error, times out, or produces unexpected output), the execution engine can respond in several ways: retry the invocation (for transient failures), skip the work unit and continue (if the unit is not critical), pause and request human guidance (for ambiguous failures), or abort the mission (for critical failures). The response strategy is configurable per mission."
      ]
    },
    {
      "heading": "Verification: Independent Acceptance Testing",
      "paragraphs": [
        "The verification phase runs independent acceptance checks that determine whether the execution produced correct results. \"Independent\" means that the verification is performed by systems separate from the agent that did the work — compilers, type checkers, test runners, and security scanners that have no connection to the language model that generated the code.",
        "Verification gates include: build verification (does the code compile without errors?), typecheck verification (do all types satisfy their declared contracts?), unit test verification (do all tests pass, including both existing tests and newly generated ones?), security verification (do security scanners find any new vulnerabilities?), and custom verification (do organization-specific checks pass?).",
        "Each gate produces a structured result: pass, fail, or skip (if the gate is not applicable to the current mission). The overall mission verification is the conjunction of all gate results: the mission passes only if all applicable gates pass.",
        "If verification fails, the agent can attempt to fix the issues (entering a new plan-execute-verify cycle), or it can report the failure to the operator with detailed evidence about what failed and why. The choice between self-repair and human escalation is configurable per mission."
      ]
    },
    {
      "heading": "Failure Modes and Recovery",
      "paragraphs": [
        "The plan-execute-verify loop handles several categories of failure, each with its own recovery strategy. Understanding these failure modes is essential for operating agents reliably in production.",
        "Planning failures occur when the agent cannot produce a valid task graph for the given goal. This might happen because the goal is ambiguous, the required context is not available, or the goal is outside the agent's capability scope. Recovery strategies include: requesting clarification from the operator, acquiring additional context, or escalating to a human engineer.",
        "Execution failures occur when a tool invocation fails during the execute phase. These might be transient (network timeout, resource exhaustion) or permanent (permission denied, invalid arguments). Recovery strategies include: retry with backoff, skip and continue, pause for human guidance, or abort.",
        "Verification failures occur when the verify phase detects problems with the agent's output. These might be compilation errors, test failures, or security violations. Recovery strategies include: self-repair (the agent attempts to fix the issues), human review (the operator reviews the failures and decides how to proceed), or abort (the mission is abandoned and the workspace is cleaned up).",
        "Each failure mode is logged with full context, enabling post-mortem analysis and continuous improvement of agent behavior."
      ]
    },
    {
      "heading": "Configuring the Execution Loop",
      "paragraphs": [
        "The plan-execute-verify loop is highly configurable through the mission configuration file. Operators can control: which models are used for planning versus execution, which tools are available and what their permission postures are, which verification gates are required, how failures are handled, and how much autonomy the agent has versus how much human oversight is required.",
        "A low-autonomy configuration might require human approval for every plan, every tool invocation, and every verification result. A high-autonomy configuration might allow the agent to proceed automatically through all three phases, only pausing for human review if verification fails.",
        "The configuration system supports mission templates that capture common configurations for common task types. A \"documentation update\" template might have low verification requirements and high autonomy, while a \"security patch\" template might have high verification requirements and low autonomy.",
        "This configurability allows teams to tune the agent's behavior to their specific needs, risk tolerance, and workflow requirements without modifying the underlying execution engine."
      ]
    },
    {
      "heading": "The economics of the loop: where tokens and time actually go",
      "paragraphs": [
        "Each phase has a distinct cost profile, and understanding it changes how teams configure missions. Planning is reasoning-heavy: reading repository context, generating the task graph, and validating it consumes a large share of total tokens relative to the work it authorizes. Execution is tool-heavy: most invocations are cheap, but each carries schema validation, permission evaluation, and audit logging. Verification is compute-heavy but token-light: compilers and test runners are deterministic processes that cost machine time, not model tokens, which is exactly why verification is the cheapest place to buy confidence.",
        "This profile argues for spending tokens where they compound. A thorough plan that survives review prevents three failed execution cycles; hermetic verification prevents one bad diff from reaching review at all. Teams that skip planning to save tokens pay for it in retries, and teams that weaken verification to move faster pay for it in rollbacks. The loop makes those trade-offs explicit rather than emergent.",
        "Wall-clock time follows the dependency structure of the task graph rather than its size. The critical path determines the floor; independent work units parallelize across sandboxes; and the verification phase parallelizes almost perfectly because gates are independent processes. In practice, a mission with a twenty-step critical path and forty parallelizable units completes in roughly the time of the critical path plus one verification sweep, not the sum of all steps."
      ]
    },
    {
      "heading": "Operating the loop in CI: headless missions and gates as policy",
      "paragraphs": [
        "The loop is not interactive-only. Headless missions run the identical three phases in CI: a failing pipeline triggers a debug mission, the plan is stored as an artifact, execution happens in ephemeral sandboxes, and verification gates are the same ones the pipeline itself runs. The output is not a merged change, it is a pull request with attached evidence: the plan, the diffs, and the verification report. Human review remains the merge authority.",
        "Treating gates as pipeline policy keeps the contract symmetric: whatever the CI requires of human contributors, the agent’s verification must meet or exceed before a pull request is even opened. This is why the loop integrates cleanly with GitHub Actions, GitLab CI, or Jenkins without special plumbing: it respects the existing authority structure and simply arrives at the review step with more evidence than a human-authored branch typically carries."
      ]
    }
  ],
  "faq": [
    {
      "question": "How long should a typical mission take end to end?",
      "answer": "It depends on the task graph\u2019s critical path, not its size. A focused bug fix commonly completes in minutes; a multi-module refactor scales with its longest dependency chain plus one verification sweep. The plan makes the critical path visible before execution, so duration surprises are rare."
    },
    {
      "question": "Who reviews the plan in practice?",
      "answer": "For low-risk missions, schema validation and policy checks review the plan automatically. For consequential work, the operator sees the full task graph, file boundaries, and acceptance criteria, and signs approval before any file is touched. The reviewer\u2019s decision is recorded in the mission ledger."
    },
    {
      "question": "Can the loop resume after an interruption?",
      "answer": "Yes. Completed work units and their verification evidence are persisted with the mission state, so a restart resumes from the first incomplete node rather than replaying finished work. This is what makes long migrations survivable across process restarts and network interruptions."
    },
    {
      "question": "What stops the loop from retrying forever?",
      "answer": "Retry budgets and failure classification. Transient failures retry with backoff up to a configured budget; permanent failures escalate instead of looping. Circuit breakers trip on anomalous invocation frequency, and every retry decision is written to the audit trail."
    },
    {
      "question": "Does verification guarantee the code is good?",
      "answer": "Verification guarantees the declared gates passed: compilation, types, tests, security checks. It cannot judge whether the feature is the right feature. That is why acceptance criteria are defined at planning time by humans, and why the loop ends at human review for anything consequential."
    },
    {
      "question": "What is the plan-execute-verify loop?",
      "answer": "The plan-execute-verify loop is CodingAgent's core execution model that separates planning (decomposing goals into task graphs), execution (invoking governed tools in sandboxed workspaces), and verification (running independent acceptance checks through compilers, tests, and security scanners)."
    },
    {
      "question": "Why separate planning from execution?",
      "answer": "Separating planning from execution allows plans to be reviewed before any code changes are made, preventing agents from making unwanted modifications. It also enables parallel execution of independent work units and provides a clear audit trail of what was planned versus what was actually done."
    },
    {
      "question": "What happens if verification fails?",
      "answer": "If verification fails, the agent can attempt self-repair (entering a new plan-execute-verify cycle to fix the issues), escalate to human review (presenting the failure evidence to the operator), or abort the mission. The response strategy is configurable per mission."
    },
    {
      "question": "Can I customize which verification gates are required?",
      "answer": "Yes. The mission configuration specifies which verification gates are required: build, typecheck, unit test, security, and custom organization-specific gates. Different mission types can require different verification levels."
    },
    {
      "question": "Does the plan-execute-verify loop work for all programming languages?",
      "answer": "Yes. The verification gates use your existing build toolchain, so any language with compilers, type checkers, and test runners can be verified. The loop is language-agnostic at the architecture level."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
