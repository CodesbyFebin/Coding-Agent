import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const durableRuntimes: PillarEditorial = {
  "pillarId": "durable-runtimes",
  "updated": "2026-09-06",
  "definition": "Resilient execution runtimes capable of pausing, serializing, persisting to disk, and resuming missions across process restarts, network failures, and hardware crashes — ensuring that long-running agent missions survive infrastructure failures without losing progress.",
  "sections": [
    {
      "heading": "The Problem of Agent Durability",
      "paragraphs": [
        "Agent missions can run for minutes, hours, or even days for large-scale tasks like monorepo migrations or comprehensive security audits. During this time, infrastructure failures can occur: process crashes, network interruptions, hardware failures, power outages, or scheduled maintenance.",
        "Without durability, a failure during a long-running mission means starting over from the beginning — wasting all the tokens consumed, all the time elapsed, and all the intermediate results produced. For expensive missions, this waste is unacceptable.",
        "Durable runtimes solve this problem by periodically checkpointing the mission state: the current work unit, the completed work units, the accumulated evidence, the verification results so far, and the remaining plan. If the process crashes, it can be resumed from the last checkpoint rather than from the beginning.",
        "Checkpoint frequency balances durability against overhead: more frequent checkpoints mean less wasted work on failure but more overhead during normal execution. CodingAgent uses adaptive checkpointing that increases frequency during expensive operations and decreases frequency during cheap operations."
      ]
    },
    {
      "heading": "Checkpoint and Restore Architecture",
      "paragraphs": [
        "The checkpoint system captures the complete mission state at a point in time: the task graph with completion status for each work unit, the current agent state (from the state machine), the accumulated evidence (tool invocations, diffs, verification results), the context state (what has been read and cached), and the configuration state (permissions, policies, model selection).",
        "Checkpoints are serialized to durable storage (disk, database, or object storage) with cryptographic integrity verification. Each checkpoint includes a hash of its contents, and the restore process verifies the hash before loading. This prevents corruption from causing silent data loss.",
        "The restore process reconstructs the mission from the checkpoint: it re-establishes the sandbox environment, reloads the context, re-initializes the state machine, and resumes execution from the work unit that was in progress. Work units that were already completed are not re-executed.",
        "Restore can happen on the same machine (after a process crash) or on a different machine (after a hardware failure). This machine-independent restore is essential for cloud deployments where machines are ephemeral."
      ]
    },
    {
      "heading": "Handling Network Failures",
      "paragraphs": [
        "Network failures are the most common infrastructure issue for agent systems. An agent might lose connectivity to its model provider, its tool servers, or its storage backend. The durable runtime handles these failures through retry, failover, and graceful degradation.",
        "For transient network failures (timeouts, connection resets), the runtime retries with exponential backoff. For persistent failures (DNS resolution failure, TLS certificate errors), the runtime fails over to alternative endpoints if configured. For complete network loss, the runtime checkpoints and pauses, resuming when connectivity is restored.",
        "Model provider failures are handled specially: if the primary model provider is unavailable, the runtime can fail over to a configured alternative provider (potentially a local model). This failover is transparent to the mission — the agent continues executing with the alternative model, potentially with different performance characteristics but the same governance controls.",
        "Network failure handling is configurable per mission: some missions require specific model capabilities and cannot fail over, while others can accept any model that meets minimum capability requirements."
      ]
    },
    {
      "heading": "Coordinating with Parallel Subagents",
      "paragraphs": [
        "Durable runtimes must coordinate with parallel subagents: if the parent process crashes, all subagents must be checkpointed or terminated, and on restore, the subagent state must be reconstructed. This coordination is handled by the orchestrator, which maintains a registry of active subagents and their checkpoint state.",
        "On restore, the orchestrator checks each subagent's last checkpoint: if the subagent completed a work unit since the last parent checkpoint, that result is recovered. If the subagent was in progress, it is restarted from its last checkpoint. If the subagent's sandbox was destroyed, the work unit is re-executed.",
        "This coordination ensures that parallel execution does not lose work on failure: the system recovers as much progress as possible from both the parent and its subagents, minimizing the amount of re-execution required.",
        "The coordination protocol uses distributed consensus for critical state transitions (work unit completion, verification results) to prevent lost updates in the event of simultaneous failures."
      ]
    },
    {
      "heading": "Durability for Long-Running Missions",
      "paragraphs": [
        "Some missions run for days: comprehensive codebase audits, large-scale refactoring across hundreds of files, or migration projects that touch every module. For these missions, durability is not just about crash recovery — it is about supporting planned interruptions.",
        "The durable runtime supports planned pauses: the operator can pause a mission (for maintenance, for review, or simply because it is end of day), and the mission state is checkpointed to persistent storage. The mission can be resumed hours or days later from exactly where it left off.",
        "Planned pauses also support human-in-the-loop workflows: the agent works autonomously during the day, pauses when it needs human input, the human provides input the next morning, and the agent resumes. This pattern makes long-running missions compatible with human work schedules.",
        "Mission state persistence also supports migration between environments: a mission started on a developer's laptop can be continued on a cloud server, or vice versa. This flexibility is essential for teams that work across multiple environments."
      ]
    },
    {
      "heading": "Testing Durability Guarantees",
      "paragraphs": [
        "Durability guarantees must be tested, not just assumed. CodingAgent tests its durable runtime through chaos engineering: randomly killing processes during missions, simulating network failures, corrupting checkpoint files, and exhausting disk space. Each test verifies that the system either recovers correctly or fails safely.",
        "Recovery tests verify that missions resume correctly after various failure modes: process crash, network failure, disk full, checkpoint corruption. Each test measures the amount of work lost and verifies that it is within acceptable bounds.",
        "Safety tests verify that the system fails safely when recovery is not possible: if checkpoint data is irrecoverably corrupted, the mission fails with a clear error message rather than resuming with incorrect state. Safety is prioritized over availability.",
        "Durability tests run continuously in the CI/CD pipeline, ensuring that changes to the runtime do not regress durability guarantees. Each release is verified against the full durability test suite before deployment."
      ]
    }
  ],
  "faq": [
    {
      "question": "What are durable runtimes?",
      "answer": "Durable runtimes are execution environments that can pause, serialize, persist to disk, and resume agent missions across process restarts, network failures, and hardware crashes without losing progress."
    },
    {
      "question": "How does checkpoint and restore work?",
      "answer": "The system periodically captures complete mission state (task graph, agent state, evidence, context, configuration) to durable storage with cryptographic integrity verification. On failure, the mission resumes from the last checkpoint, not from the beginning."
    },
    {
      "question": "What happens during network failures?",
      "answer": "Transient failures trigger retry with exponential backoff. Persistent failures trigger failover to alternative endpoints. Complete network loss triggers checkpoint and pause, with resume when connectivity is restored."
    },
    {
      "question": "Can missions be paused and resumed days later?",
      "answer": "Yes. The durable runtime supports planned pauses with persistent checkpointing. Missions can be resumed hours or days later from exactly where they left off, supporting human work schedules and maintenance windows."
    },
    {
      "question": "How are durability guarantees tested?",
      "answer": "Through chaos engineering: randomly killing processes, simulating network failures, corrupting checkpoints, and exhausting disk space. Tests verify correct recovery or safe failure, and run continuously in CI/CD to prevent regression."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
