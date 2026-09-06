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
    }
  ],
  "faq": [
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
