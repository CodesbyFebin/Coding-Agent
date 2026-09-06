import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const taskGraphs: PillarEditorial = {
  "pillarId": "task-graphs",
  "updated": "2026-09-06",
  "definition": "CodingAgent Task Graphs are directed acyclic graphs (DAGs) that represent complex engineering goals decomposed into interdependent, atomically executable work units with explicit dependency relationships, acceptance criteria, and tool assignments.",
  "sections": [
    {
      "heading": "Understanding Task Graphs in Agent Engineering",
      "paragraphs": [
        "A task graph is the structural representation of how a complex engineering goal is decomposed into executable work. Unlike a simple to-do list, a task graph captures the dependency relationships between work units — which tasks must complete before others can begin, which tasks can execute in parallel, and which tasks are independent of each other.",
        "In CodingAgent, task graphs are directed acyclic graphs (DAGs). \"Directed\" means that dependencies have a specific direction: task A depends on task B means B must complete before A can begin. \"Acyclic\" means there are no circular dependencies: you cannot have A depending on B and B depending on A, which would make execution impossible.",
        "Each node in the task graph represents an atomic work unit: a single, well-defined piece of work that can be executed by a specific tool with specific inputs and produces specific outputs. Each edge represents a dependency: a constraint that one work unit must complete before another can begin.",
        "Task graphs are generated during the planning phase of the plan-execute-verify loop and validated before execution begins. Validation checks for cyclical dependencies, unreachable nodes, and schema compliance."
      ]
    },
    {
      "heading": "Task Graph Generation and Decomposition",
      "paragraphs": [
        "Task graph generation is the process of transforming a high-level engineering goal into a structured DAG of work units. This process uses the language model's reasoning capabilities combined with repository context analysis to produce a decomposition that is both complete (covers all necessary work) and minimal (does not include unnecessary work).",
        "The generation process begins with goal analysis: understanding what the goal requires in terms of code changes, which files and modules are affected, and what the acceptance criteria are. This analysis uses AST parsing, symbol indexing, and dependency graph construction to build a comprehensive understanding of the codebase.",
        "The model then generates work units, each with a clear scope (which files to modify), tool assignment (which tool to use), input specification (what context is needed), output specification (what artifacts are produced), and acceptance criteria (how to verify the work unit is complete).",
        "Dependencies between work units are inferred from data flow: if work unit A produces a file that work unit B reads, then B depends on A. If two work units modify the same file, they must be serialized. If they modify different files with no data flow between them, they can execute in parallel."
      ]
    },
    {
      "heading": "Dependency Analysis and Parallelization",
      "paragraphs": [
        "One of the key advantages of task graphs over simple task lists is the ability to identify parallelizable work. If two work units have no dependency relationship (neither directly nor transitively), they can execute simultaneously, potentially reducing total execution time significantly.",
        "Dependency analysis uses topological sorting to determine execution order and identify parallelization opportunities. The critical path — the longest chain of dependent work units — determines the minimum possible execution time. Work units not on the critical path can execute in parallel with critical-path work.",
        "Parallelization is governed by resource constraints: the number of available sandbox environments, the rate limits of external APIs, and the memory/CPU requirements of concurrent tool invocations. The execution engine schedules work units to maximize parallelism while respecting these constraints.",
        "For large codebases, parallelization can reduce execution time from hours to minutes. A refactoring task that touches 50 files might have a critical path of 10 sequential steps, with the remaining 40 steps parallelizable across available resources."
      ]
    },
    {
      "heading": "Task Graph Validation and Safety",
      "paragraphs": [
        "Before a task graph enters execution, it must pass validation checks that ensure it is safe and correct to execute. Validation includes: acyclicity checking (ensuring no circular dependencies), reachability checking (ensuring all nodes are reachable from the start node), schema validation (ensuring all required fields are present and correctly typed), and feasibility checking (ensuring all required tools are available and permitted).",
        "Safety validation also checks for potentially dangerous operations: work units that modify files outside the workspace, work units that require network access without explicit approval, and work units that perform destructive operations. These work units are flagged for human review before execution begins.",
        "The validation process produces a validation report that documents what was checked, what passed, and what requires attention. This report is part of the mission's audit trail and can be reviewed by operators before approving execution.",
        "If validation fails, the plan is returned to the planning phase for revision. The agent can attempt to fix the issues (removing cycles, adding missing fields, or restructuring the decomposition) or escalate to the operator for guidance."
      ]
    },
    {
      "heading": "Dynamic Task Graph Modification",
      "paragraphs": [
        "In practice, task graphs sometimes need to be modified during execution. A work unit might discover that its scope is larger than anticipated, requiring additional sub-tasks. A tool invocation might fail in a way that requires restructuring the remaining plan. New information might emerge that changes the decomposition.",
        "CodingAgent supports dynamic task graph modification within governed boundaries. New work units can be added (with validation), existing work units can be split or merged (with dependency recalculation), and work units can be marked as skipped (with documentation of why). All modifications are logged in the audit trail.",
        "However, certain modifications require human approval: adding work units that require new tool permissions, modifying work units that are already in progress, or removing work units that other work units depend on. These governance controls prevent the agent from silently expanding its scope during execution.",
        "The dynamic modification system balances flexibility (allowing the agent to adapt to unexpected situations) with governance (preventing uncontrolled scope expansion). This balance is essential for reliable agent operation in real-world engineering environments."
      ]
    },
    {
      "heading": "Task Graph Visualization and Debugging",
      "paragraphs": [
        "Task graphs are inherently visual structures, and CodingAgent provides visualization tools that allow operators to understand the structure of a plan at a glance. The visualization shows work units as nodes, dependencies as edges, execution status as colors, and the critical path as a highlighted chain.",
        "Visualization supports interactive exploration: clicking on a work unit shows its details (scope, tools, inputs, outputs, acceptance criteria), clicking on a dependency edge shows the data flow between units, and filtering by status shows which units are pending, in-progress, completed, or failed.",
        "Debugging tools allow operators to understand why a task graph has a particular structure: why two units are dependent, why a unit was decomposed in a particular way, or why the critical path runs through specific units. This transparency is essential for building trust in agent-generated plans.",
        "The visualization system also supports historical comparison: comparing the current task graph with previous versions shows how the plan evolved during execution, which modifications were made, and why. This historical view is invaluable for post-mortem analysis and continuous improvement."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is a task graph in CodingAgent?",
      "answer": "A task graph is a directed acyclic graph (DAG) that represents a complex engineering goal decomposed into interdependent work units. Each node is an atomic work unit with specific tools, inputs, and acceptance criteria. Each edge is a dependency relationship that determines execution order."
    },
    {
      "question": "How does CodingAgent generate task graphs?",
      "answer": "Task graphs are generated during the planning phase by analyzing the goal, reading repository context through AST parsing and dependency analysis, and using the language model to decompose the goal into work units with explicit dependencies based on data flow between units."
    },
    {
      "question": "Can task graph work units execute in parallel?",
      "answer": "Yes. Work units with no dependency relationship can execute simultaneously. The execution engine uses topological sorting to identify the critical path and parallelize non-critical work, potentially reducing execution time from hours to minutes for large tasks."
    },
    {
      "question": "What happens if a task graph has circular dependencies?",
      "answer": "Circular dependencies are detected during plan validation and prevent execution from beginning. The plan is returned to the planning phase for restructuring. This acyclicity check is a fundamental safety control."
    },
    {
      "question": "Can task graphs be modified during execution?",
      "answer": "Yes, within governed boundaries. New work units can be added with validation, existing units can be split or merged with dependency recalculation. Modifications that change tool permissions or affect in-progress work require human approval."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
