import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const codingagentArchitecture: PillarEditorial = {
  "pillarId": "codingagent-architecture",
  "updated": "2026-09-24",
  "definition": "In-depth documentation of the six-stage control loop: Understand, Plan, Route, Execute, Verify, and Learn — establishing clear mental models for how sovereign agents separate planning from execution and verification.",
  "sections": [
    {
      "heading": "Six-Stage Control Loop Fundamentals",
      "paragraphs": [
        "The six-stage control loop is the foundational architectural model that governs how CodingAgent sovereign agents operate. The six stages are: Understand (analyze the task context, read repository structure, identify relevant code and symbols), Plan (generate a structured execution plan with explicit acceptance criteria), Route (select the appropriate tools and models for the task, considering permissions and capabilities), Execute (perform the planned modifications within a sandboxed environment), Verify (run independent verification gates: type checking, test execution, lint checking), and Learn (record the mission's outcomes, update the long-term knowledge base, and capture lessons learned).",
        "The control loop is designed to be iterative: after the Learn stage, the mission returns to the Understand stage for the next iteration or a new mission. Each stage has explicit entry and exit criteria, ensuring that the agent does not proceed to the next stage until the current stage's objectives are met. This structured approach prevents the common failure mode where agents skip verification or proceed with incomplete plans.",
        "The six-stage model provides a clear mental model for developers and operators: what the agent is doing at each stage, what artifacts are produced, and what governance controls are in effect. This visibility is essential for compliance auditing, debugging, and training new team members."
      ]
    },
    {
      "heading": "Stage 1: Understand",
      "paragraphs": [
        "The Understand stage analyzes the task context: the mission specification, the repository structure, the relevant code symbols, and the current state of the codebase. The agent reads the task description, identifies the files that need to be modified, and understands the expected outcomes. The output of this stage is a task context summary that is passed to the Planning stage.",
        "The Understand stage also identifies potential risks and constraints: Are there sensitive files that require special permissions? Are there existing tests that must pass? Are there known anti-patterns or deprecated APIs that the agent should avoid? This risk assessment informs the Planning stage and helps the agent generate a plan that is realistic and safe."
      ]
    },
    {
      "heading": "Stage 2: Plan",
      "paragraphs": [
        "The Plan stage generates a structured execution plan with explicit acceptance criteria. The plan includes: which files will be modified, what changes will be made (described as diffs or edit operations), what tools will be used (and their declared permissions), and how success will be verified (the acceptance criteria that must pass for the mission to be considered complete). The plan is the primary artifact that governs the rest of the mission, and any changes to the plan during execution require a new planning cycle.",
        "The plan must include objective, measurable acceptance criteria: e.g., 'type check passes with zero errors', 'all unit tests pass', 'no new security warnings introduced'. Subjective criteria like 'the code looks good' are not acceptable. The plan also includes a rollback strategy: how to revert the changes if verification fails.",
        "Critically, the plan is generated before any execution begins. The agent cannot deviate from the plan without triggering a new planning cycle, ensuring that the mission stays focused on its original objective and that all actions are traceable to the original plan."
      ]
    },
    {
      "heading": "Stage 3: Route",
      "paragraphs": [
        "The Route stage selects the appropriate tools and models for the task. The agent considers: the task's complexity and required model size, the available tools and their permission declarations, the sandbox configuration (what the agent is allowed to do), and the current resource availability (VRAM, CPU, memory). The output of this stage is a tool configuration and model selection that is passed to the Execution stage.",
        "Routing decisions are governed by the VRAM-aware routing system and the permission system (ALLOW/ASK/DENY). The agent cannot select a tool that requires permissions it does not have, and it cannot select a model that exceeds the available hardware resources. If the desired tool or model is not available, the agent either requests permission expansion or modifies the plan to work with available resources."
      ]
    },
    {
      "heading": "Stage 4: Execute",
      "paragraphs": [
        "The Execute stage performs the planned modifications within a sandboxed environment. The agent reads the identified files, makes the planned changes, invokes the selected tools, and produces the described diffs. All operations are subject to the sandbox's isolation boundaries, the permission system's tier checks, and real-time monitoring that logs every operation with its inputs and outputs. The execution concludes with a snapshot of the file changes, which is passed to the Verification stage.",
        "The execution environment is ephemeral: each mission starts with a fresh sandbox, and when the mission completes (whether successfully or not), the sandbox is destroyed. This ensures that no state persists between missions, preventing accidental contamination or credential leakage."
      ]
    },
    {
      "heading": "Stage 5: Verify",
      "paragraphs": [
        "The Verify stage runs independent verification gates to confirm that the executed changes meet the acceptance criteria defined in the Plan stage. The verification gates include: type checking (running the language's type checker), unit test execution (running the project's test suite), lint checking (running the project's linter), and any custom verification scripts defined for the mission type. A mission is only marked complete when ALL verification gates pass. If any gate fails, the mission is not complete, and the agent must either rollback changes and retry or escalate to human review.",
        "The Verify stage is the cornerstone of the six-stage model's rigor. Independent verification means the agent's own assessment is not accepted — instead, independent systems (compilers, test suites, linters) evaluate the output. This prevents the common failure mode where models hallucinate that code builds without ever invoking the compiler."
      ]
    },
    {
      "heading": "Stage 6: Learn",
      "paragraphs": [
        "The Learn stage records the mission's outcomes for long-term knowledge accumulation. The system: archives the complete mission telemetry (tool invocations, verification results, approval gate decisions), updates the long-term repository knowledge base with any new architectural patterns or solutions discovered, and generates an ADR (Architectural Decision Record) if the mission made a consequential architectural change. The Learn stage ensures that the organization benefits from each mission, even if the mission did not fully succeed, because the failures and lessons learned are captured for future reference.",
        "The Learn stage also supports mission replay: the complete sequence of events can be reconstructed from the telemetry, enabling operators to understand what happened, why the mission succeeded or failed, and what the next best step might be for similar future missions."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is the six-stage control loop?",
      "answer": "The six-stage control loop (Understand, Plan, Route, Execute, Verify, Learn) is the foundational architectural model that governs how CodingAgent sovereign agents operate, with explicit entry and exit criteria at each stage."
    },
    {
      "question": "What happens in the Understand stage?",
      "answer": "The agent analyzes the task context: mission specification, repository structure, relevant code symbols, and current codebase state. It also identifies risks and constraints (sensitive files, existing tests, known anti-patterns)."
    },
    {
      "question": "What must the plan include?",
      "answer": "The plan must include: which files will be modified, what changes will be made, what tools will be used (with permissions), and how success will be verified (objective, measurable acceptance criteria). It must also include a rollback strategy."
    },
    {
      "question": "Why is verification 'independent'?",
      "answer": "Independent verification means the agent's own assessment is not accepted. Independent systems (compilers, test suites, linters) evaluate the output. This prevents models from hallucinating that code builds without ever invoking the compiler."
    },
    {
      "question": "What is captured in the Learn stage?",
      "answer": "The Learn stage archives complete mission telemetry, updates the long-term knowledge base with new patterns/solutions, and generates ADRs for consequential architectural changes. It also supports mission replay for debugging and training."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};