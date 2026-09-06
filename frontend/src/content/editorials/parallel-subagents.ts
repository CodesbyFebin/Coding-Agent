import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const parallelSubagents: PillarEditorial = {
  "pillarId": "parallel-subagents",
  "updated": "2026-09-06",
  "definition": "CodingAgent Parallel Subagents are isolated execution runtimes that tackle modular work units concurrently under strict parent orchestrator supervision, enabling significant performance improvements for tasks with parallelizable dependency structures while maintaining full governance and verification controls.",
  "sections": [
    {
      "heading": "The Case for Parallel Agent Execution",
      "paragraphs": [
        "Many engineering tasks contain work units that are independent of each other — they modify different files, have no data flow between them, and can execute simultaneously without conflict. Sequential execution of these independent units wastes time and resources.",
        "Parallel subagents address this by spawning isolated execution environments for independent work units, allowing them to proceed concurrently. A refactoring task touching 50 independent modules can execute 10 subagents simultaneously, reducing wall-clock time by up to 80%.",
        "Each subagent operates in its own sandboxed workspace with its own tool permissions, its own verification pipeline, and its own audit trail. The parent orchestrator coordinates the subagents, manages resource allocation, and aggregates results.",
        "Parallel execution is not simply \"running multiple agents at once.\" It requires careful coordination to prevent resource conflicts, ensure consistent verification, and maintain the governance controls that make single-agent execution trustworthy."
      ]
    },
    {
      "heading": "Orchestration and Coordination",
      "paragraphs": [
        "The parent orchestrator is responsible for: decomposing the task graph into parallelizable groups, allocating subagents to work units based on resource availability, monitoring subagent progress, handling subagent failures, and aggregating results into a unified verification report.",
        "Coordination follows the dependency structure of the task graph: subagents assigned to independent work units execute simultaneously, while subagents assigned to dependent work units wait for their dependencies to complete. The orchestrator uses topological scheduling to maximize parallelism while respecting dependencies.",
        "Resource allocation considers: available sandbox environments, memory and CPU requirements of each work unit, rate limits of external APIs, and the critical path of the task graph. The orchestrator prioritizes work units on the critical path to minimize total execution time.",
        "When a subagent fails, the orchestrator decides whether to retry (for transient failures), reassign (for resource conflicts), or escalate (for permanent failures). The decision is governed by the mission's error recovery policy."
      ]
    },
    {
      "heading": "Isolation and Sandbox Boundaries",
      "paragraphs": [
        "Each subagent operates in a fully isolated sandbox: its own filesystem workspace, its own process space, its own network namespace, and its own resource limits. This isolation prevents subagents from interfering with each other — one subagent's file modifications cannot affect another's, one subagent's memory leak cannot starve another, and one subagent's network activity cannot conflict with another's.",
        "Isolation is enforced at the operating system level using containerization (Docker, bubblewrap, or gVisor). Each sandbox has its own root filesystem derived from the repository snapshot at mission start, ensuring that all subagents work from a consistent baseline.",
        "Resource limits prevent any single subagent from consuming disproportionate resources: CPU quotas, memory limits, disk quotas, and network bandwidth caps are applied per sandbox. These limits are configurable per mission type.",
        "The isolation model means that subagent failures are contained: a subagent that crashes, hangs, or consumes excessive resources does not affect other subagents or the orchestrator. The orchestrator can simply replace the failed subagent with a new one."
      ]
    },
    {
      "heading": "Result Aggregation and Conflict Resolution",
      "paragraphs": [
        "When parallel subagents complete, their results must be aggregated into a unified output. This aggregation must handle: merging file modifications from multiple subagents (ensuring no conflicts), combining verification results (all subagents must pass their verification gates), and producing a unified audit trail (recording which subagent did what).",
        "Conflict resolution is needed when two subagents modify the same file. The orchestrator detects these conflicts during result aggregation and resolves them through: automatic merging (if the modifications are in different parts of the file), subagent re-execution (if the modifications overlap), or human review (if the conflict cannot be resolved automatically).",
        "The aggregation process produces a single, unified diff that represents the combined output of all subagents. This diff is verified as a whole: the build, typecheck, and test gates run against the merged result, not just against individual subagent outputs.",
        "This approach ensures that parallel execution does not introduce integration issues: the final result is verified as a coherent whole, not just as a collection of independently verified parts."
      ]
    },
    {
      "heading": "Performance Characteristics",
      "paragraphs": [
        "Parallel subagent execution provides significant performance improvements for tasks with parallelizable structure. The speedup depends on: the ratio of parallelizable to sequential work (Amdahl's law), the number of available sandbox environments, and the resource requirements of each work unit.",
        "For a task with 80% parallelizable work and 10 available subagents, the theoretical speedup is approximately 4.2x. In practice, speedups of 3-5x are common for large refactoring tasks, dependency updates, and multi-file migrations.",
        "The performance benefit must be weighed against the overhead of sandbox creation, result aggregation, and conflict resolution. For small tasks with few work units, the overhead may exceed the benefit. The orchestrator automatically determines whether parallel execution is beneficial based on the task graph structure.",
        "Performance metrics are collected for each mission: wall-clock time, CPU time, sandbox creation time, aggregation time, and speedup ratio. These metrics inform future scheduling decisions and help teams understand when parallel execution provides the most value."
      ]
    },
    {
      "heading": "Governance in Parallel Execution",
      "paragraphs": [
        "Parallel execution does not reduce governance — each subagent is subject to the same permission controls, verification requirements, and audit logging as a single agent. The orchestrator itself is governed: its scheduling decisions are logged, its conflict resolution is audited, and its resource allocation is tracked.",
        "Each subagent has its own permission profile derived from the mission configuration. A subagent assigned to modify documentation has write access to the docs/ directory but not to the src/ directory. A subagent assigned to run tests has shell access but not network access.",
        "Verification is applied at two levels: each subagent's output is verified independently, and the aggregated result is verified as a whole. This dual verification ensures that both individual work units and the integrated result meet quality standards.",
        "The governance model for parallel execution is one of CodingAgent's key differentiators: it enables the performance benefits of parallelism without sacrificing the safety and correctness guarantees that make agents trustworthy in production."
      ]
    }
  ],
  "faq": [
    {
      "question": "What are parallel subagents?",
      "answer": "Parallel subagents are isolated execution runtimes that tackle independent work units concurrently under orchestrator supervision. Each subagent operates in its own sandbox with its own permissions, verification pipeline, and audit trail."
    },
    {
      "question": "How much faster is parallel execution?",
      "answer": "Speedups of 3-5x are common for large tasks with parallelizable structure. The actual speedup depends on the ratio of parallelizable to sequential work (Amdahl's law), available sandbox environments, and work unit resource requirements."
    },
    {
      "question": "How are conflicts between subagents handled?",
      "answer": "The orchestrator detects conflicts during result aggregation when multiple subagents modify the same file. Conflicts are resolved through automatic merging, subagent re-execution, or human review depending on the nature of the overlap."
    },
    {
      "question": "Does parallel execution reduce governance?",
      "answer": "No. Each subagent is subject to the same permission controls, verification requirements, and audit logging as a single agent. Verification is applied at both the individual subagent level and the aggregated result level."
    },
    {
      "question": "When should I use parallel subagents?",
      "answer": "Parallel subagents are most beneficial for large tasks with many independent work units: refactoring across many files, dependency updates, multi-file migrations, and bulk documentation changes. The orchestrator automatically determines if parallelism is beneficial."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
