import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const agentStateMachines: PillarEditorial = {
  "pillarId": "agent-state-machines",
  "updated": "2026-09-06",
  "definition": "CodingAgent Agent State Machines are deterministic finite state machines that govern agent lifecycle transitions, error recovery paths, and tool access authorizations, ensuring that agents operate within well-defined behavioral boundaries at every point during mission execution.",
  "sections": [
    {
      "heading": "Why State Machines Matter for Agent Governance",
      "paragraphs": [
        "AI coding agents are inherently stateful systems: they maintain context about the current mission, track which work units have been completed, remember tool invocation results, and accumulate evidence over time. Managing this state correctly is essential for reliable agent behavior.",
        "Without explicit state management, agents can enter inconsistent states: believing a work unit is complete when it actually failed, attempting to use a tool that is no longer available, or continuing execution after a critical verification failure. These inconsistencies lead to unreliable behavior that undermines trust.",
        "State machines provide a formal framework for managing agent state. By defining explicit states, valid transitions between states, and the conditions that trigger each transition, state machines ensure that agents can only be in well-defined states and can only transition through well-defined paths.",
        "This formal approach to state management is what makes CodingAgent agents predictable and debuggable. When an agent behaves unexpectedly, the state machine provides a clear record of what state the agent was in, what transition it attempted, and why that transition was or was not allowed."
      ]
    },
    {
      "heading": "The Core Agent State Machine",
      "paragraphs": [
        "The CodingAgent core state machine defines the following states: IDLE (agent is waiting for a mission), PLANNING (agent is decomposing the goal into a task graph), PLAN_REVIEW (plan is awaiting operator approval), EXECUTING (agent is working through the task graph), VERIFYING (agent is running acceptance checks), COMPLETED (mission finished successfully), FAILED (mission finished with failures), and PAUSED (agent is waiting for human input).",
        "Valid transitions include: IDLE → PLANNING (when a mission is assigned), PLANNING → PLAN_REVIEW (when the plan is generated), PLAN_REVIEW → EXECUTING (when the plan is approved), EXECUTING → VERIFYING (when all work units are complete), VERIFYING → COMPLETED (when all verification gates pass), VERIFYING → EXECUTING (when verification fails and the agent enters a repair cycle), and any state → PAUSED (when human input is required).",
        "Invalid transitions are rejected: the agent cannot transition from IDLE to EXECUTING without first going through PLANNING and PLAN_REVIEW. The agent cannot transition from COMPLETED back to EXECUTING. These constraints prevent the agent from entering inconsistent states.",
        "Each transition is logged with the triggering event, the source state, the target state, and the timestamp. This log provides a complete trace of the agent's lifecycle for debugging and audit purposes."
      ]
    },
    {
      "heading": "Error Recovery Through State Transitions",
      "paragraphs": [
        "One of the most valuable properties of state machines is their ability to define explicit error recovery paths. When something goes wrong during agent execution, the state machine determines what state the agent should transition to and what recovery actions are available.",
        "For example, if a tool invocation fails during the EXECUTING state, the state machine might transition to a TOOL_FAILURE sub-state. From there, the recovery path depends on the failure type: transient failures trigger a retry transition back to EXECUTING, permanent failures trigger a transition to FAILED, and ambiguous failures trigger a transition to PAUSED for human guidance.",
        "Error recovery paths are defined declaratively in the state machine configuration, making them explicit and auditable. Operators can review the recovery paths before deployment to ensure they match the organization's risk tolerance and operational requirements.",
        "The state machine also supports custom error states for organization-specific failure modes. For example, a financial services organization might define a COMPLIANCE_CHECK state that is entered whenever the agent modifies code in regulated areas, requiring additional verification before execution can continue."
      ]
    },
    {
      "heading": "Tool Access Authorization Through State",
      "paragraphs": [
        "The state machine also governs which tools the agent can access in each state. In the PLANNING state, the agent can only use read-only tools (filesystem.read, ast.parse, symbol.search). In the EXECUTING state, the agent can use the tools declared in the mission configuration. In the VERIFYING state, the agent can only use verification tools (compiler, test runner, security scanner).",
        "This state-dependent tool access prevents a class of errors where agents attempt to use tools that are not appropriate for their current phase. For example, an agent in the PLANNING state cannot accidentally write files, and an agent in the VERIFYING state cannot modify the code it is verifying.",
        "Tool access authorization is enforced at the state machine level, not at the tool level. This means that even if a tool is technically available, the agent cannot invoke it unless the state machine permits it in the current state. This layered approach to governance provides defense in depth.",
        "The tool access rules are configurable per mission type. A documentation mission might allow filesystem.write in the EXECUTING state but restrict it to the docs/ directory. A security audit mission might disallow all write operations in all states."
      ]
    },
    {
      "heading": "State Machine Verification and Testing",
      "paragraphs": [
        "State machines are formally verifiable: properties like \"the agent can never transition from COMPLETED to EXECUTING\" or \"the agent always passes through VERIFYING before reaching COMPLETED\" can be proven mathematically rather than merely tested empirically.",
        "CodingAgent uses formal verification to validate its state machine definitions before deployment. The verification checks that all states are reachable, that all transitions are well-defined, that there are no dead-end states (states with no outgoing transitions), and that safety properties hold across all possible execution paths.",
        "State machines are also tested through simulation: the agent's execution is simulated across thousands of scenarios (including error scenarios, timeout scenarios, and edge cases) to verify that the state machine behaves correctly in all situations.",
        "This verification and testing approach ensures that the state machine — the backbone of agent governance — is correct before any agent ever executes a real mission. It is the same approach used in safety-critical systems like aviation software and medical devices."
      ]
    },
    {
      "heading": "Extending the State Machine",
      "paragraphs": [
        "The CodingAgent state machine is designed to be extensible. Organizations can add custom states for their specific workflow requirements: a CODE_REVIEW state that enters when the agent produces a diff requiring human review, a DEPLOY_APPROVAL state that enters before production deployments, or a COMPLIANCE_AUDIT state that enters when the agent modifies regulated code.",
        "Custom states integrate with the existing transition system: they have defined entry conditions, exit conditions, and available tools. They participate in the audit trail like built-in states. They can be visualized in the state machine diagram alongside built-in states.",
        "Extension also works at the sub-state level: built-in states can be refined into sub-states that capture more detailed behavior. The EXECUTING state, for example, can be refined into EXECUTING_WORK_UNIT, WAITING_FOR_TOOL, PROCESSING_TOOL_RESULT, and HANDLING_TOOL_FAILURE sub-states.",
        "This extensibility ensures that the state machine can evolve with organizational needs while maintaining the formal guarantees that make it trustworthy."
      ]
    }
  ],
  "faq": [
    {
      "question": "Which states does a mission typically move through?",
      "answer": "A standard lifecycle covers planned, executing, verifying, waiting-approval, completed, failed, and cancelled. Transitions are explicit: an executing mission cannot skip to completed without verification evidence, and a waiting-approval mission resumes only after a recorded decision."
    },
    {
      "question": "How do state machines prevent runaway agent loops?",
      "answer": "Loops appear as repeated transitions between the same states with no progress, which transition counters monitor. Budgets and circuit breakers trip on anomalous frequency, pausing the mission for review instead of burning tokens indefinitely."
    },
    {
      "question": "Can a mission be paused and resumed?",
      "answer": "Yes. Durable runtimes serialize the full state machine with completed work units and evidence, so a pause, restart, or crash resumes from the first incomplete node with history intact."
    },
    {
      "question": "Who can force a state transition?",
      "answer": "Only declared operator actions through governed interfaces: approval decisions, cancellations, escalations. Every forced transition is recorded with identity and reason, keeping the mission history tamper-evident."
    },
    {
      "question": "What is an agent state machine?",
      "answer": "An agent state machine is a deterministic finite state machine that governs agent lifecycle transitions, defining what states an agent can be in (IDLE, PLANNING, EXECUTING, VERIFYING, COMPLETED, FAILED, PAUSED), what transitions between states are valid, and what tools are available in each state."
    },
    {
      "question": "Why use state machines for agent governance?",
      "answer": "State machines provide formal, verifiable guarantees about agent behavior. They prevent agents from entering inconsistent states, ensure that governance controls are applied at the right time, and provide a clear audit trail of agent lifecycle for debugging and compliance."
    },
    {
      "question": "Can organizations customize the state machine?",
      "answer": "Yes. Organizations can add custom states (CODE_REVIEW, DEPLOY_APPROVAL, COMPLIANCE_AUDIT) and custom transitions that integrate with the existing governance framework. Custom states participate in audit trails and visualization like built-in states."
    },
    {
      "question": "How do state machines handle errors?",
      "answer": "State machines define explicit error recovery paths. When a failure occurs, the agent transitions to an error state, and the recovery path depends on the failure type: retry for transient failures, escalation for ambiguous failures, and abort for critical failures."
    },
    {
      "question": "Are CodingAgent state machines formally verified?",
      "answer": "Yes. State machine definitions are formally verified before deployment to ensure all states are reachable, all transitions are well-defined, and safety properties hold across all possible execution paths. They are also tested through simulation across thousands of scenarios."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
