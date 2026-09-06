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
,
{
  heading: 'State Machine Composition Patterns',
  paragraphs: [
    'Complex agent behaviors are often composed from simpler state machines through well-defined composition patterns. These patterns enable reuse, modularity, and predictable behavior when combining multiple state machines into a larger system.',
    'Hierarchical composition is the most common pattern: a parent state machine contains child state machines, each responsible for a specific aspect of agent behavior. For example, a parent state machine might manage the overall mission lifecycle (IDLE, PLANNING, EXECUTING, VERIFYING, COMPLETED), while child state machines manage specific concerns like tool execution (TOOL_IDLE, TOOL_EXECUTING, TOOL_WAITING, TOOL_COMPLETED, TOOL_FAILED) or approval workflows (APPROVAL_PENDING, APPROVAL_GRANTED, APPROVAL_DENIED). The parent delegates to children based on the current state and transitions children based on their completion.',
    'Parallel composition is used when multiple state machines should execute concurrently: each state machine progresses independently, and the overall system state is the combination of all child states. This pattern is used for parallel subagents: each subagent has its own state machine, and the orchestrator tracks the state of all subagents. The orchestrator transitions to COMPLETED only when all subagents have reached their COMPLETED states.',
    'State machine inheritance enables specialization: a base state machine defines common states and transitions, and specialized state machines extend the base with additional states or modified transitions. For example, a base agent state machine might define the core lifecycle, while a security-focused agent state machine extends it with additional states for security scanning and vulnerability remediation. This pattern enables reuse while allowing specialization for specific agent modes or mission types.',
    'Composition patterns must preserve the formal properties of state machines: determinism (the same input always produces the same state transition), reachability (all states can be reached from the initial state), and termination (all execution paths eventually reach a terminal state). Violating these properties leads to unpredictable behavior: agents that get stuck in infinite loops, states that are never reached, or executions that never terminate. Formal verification of composed state machines ensures these properties are preserved.'
  ]
},
{
  heading: 'State Machine Testing Strategies',
  paragraphs: [
    'Testing state machines requires strategies that go beyond traditional unit testing. State machines have complex behavior that emerges from the interaction of states, transitions, and inputs. Testing must cover not just individual transitions but also sequences of transitions, edge cases, and error recovery paths.',
    'State coverage testing ensures that every state in the state machine is visited at least once during testing. This is the most basic form of testing and catches states that are unreachable due to configuration errors or logic bugs. State coverage is necessary but not sufficient: a state might be reachable but the transitions into and out of it might be incorrect.',
    'Transition coverage testing ensures that every transition in the state machine is executed at least once. This catches transitions that are never taken due to incorrect guard conditions or missing event handlers. Transition coverage is more thorough than state coverage but still does not catch all bugs: a transition might be executed but with incorrect inputs or in an incorrect context.',
    'Path coverage testing ensures that every possible path through the state machine is executed at least once. This is the most thorough form of testing but is often impractical for complex state machines due to the exponential number of paths. In practice, path coverage is approximated by testing representative paths that cover the most common and most critical scenarios.',
    'Error injection testing deliberately introduces errors to verify that the state machine handles them correctly. Errors include: invalid inputs (inputs that violate schema or guard conditions), missing events (expected events that do not occur), timeout events (events that do not occur within the expected time), and concurrent events (multiple events that occur simultaneously). Error injection testing verifies that the state machine transitions to appropriate error states, recovers correctly, and maintains formal properties even in the presence of errors.',
    'Property-based testing generates random inputs and sequences of events to explore the state space and verify that formal properties hold. This approach can uncover edge cases that are not apparent from manual test design. Property-based testing is particularly valuable for verifying properties like determinism (the same input sequence always produces the same state sequence) and safety (the state machine never enters an invalid state).'
  ]
}
  ],
  "faq": [
    {
      "question": "How does the agent decide dependencies between work units?",
      "answer": "From data flow and file ownership: a unit that produces an artifact another unit consumes creates a dependency; two units editing the same file are serialized; units touching disjoint files with no data flow are independent and parallelizable."
    },
    {
      "question": "What happens when a work unit fails mid-graph?",
      "answer": "The engine retries transient failures within budget, and permanent failures mark the node failed so downstream dependents are withheld while independent branches continue. A failed node can be re-planned and re-executed without discarding completed siblings."
    },
    {
      "question": "Can humans edit a task graph before execution?",
      "answer": "Yes, and plan review is the recommended default. Operators can remove, merge, or re-scope nodes and tighten acceptance criteria; the edited graph is re-validated for cycles and schema before any tool runs."
    },
    {
      "question": "How large can a task graph grow?",
      "answer": "Practically bounded by verification capacity and context discipline, not the data structure. Graphs of hundreds of units execute fine when each node stays atomic; graphs fail when nodes become vague, which schema validation and acceptance-criteria checks catch early."
    },
    {
      "question": "Do task graphs help with cost as well as speed?",
      "answer": "Yes. Parallelization shortens wall-clock time, while node-level scoping keeps each tool call small: the agent reads only what its node needs. Combined with context compaction, this is where most token savings come from."
    },
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
