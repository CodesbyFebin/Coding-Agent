// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const agentMemoryArchitecture = {
    "pillarId": "agent-memory-architecture",
    "updated": "2026-09-24",
    "definition": "The agent memory architecture provides a hierarchical system for managing the vast amount of information that an autonomous agent encounters during a mission. Without structured memory, agents quickly hit context window limits, leading to truncated history, forgotten previous findings, and repeated debugging efforts. The hierarchical separation ensures that critical information is preserved at the appropriate level of granularity while non-essential details are compacted or discarded. This architecture is essential for enabling long-running autonomous coding sessions where the agent needs to maintain continuity across many turns and many hours of execution. The memory system directly correlates with agent reliability: well-structured memory reduces the cognitive load on the model and improves the quality of generated code. The architecture consists of three distinct layers — short-term scratchpad, working task memory, and long-term repository knowledge — each serving a specific purpose with different retention characteristics, storage mechanisms, and access patterns. The boundaries between layers are flexible and can be configured based on the deployment environment and the organization's requirements for knowledge persistence.",
    "sections": [
        {
            "heading": "Memory Architecture Fundamentals",
            "paragraphs": [
                "The agent memory architecture provides a hierarchical system for managing the vast amount of information that an autonomous agent encounters during a mission. Without structured memory, agents quickly hit context window limits, leading to truncated history, forgotten previous findings, and repeated debugging efforts. The hierarchical separation ensures that critical information is preserved at the appropriate level of granularity, while non-essential details are compacted or discarded. This architecture is essential for enabling long-running autonomous coding sessions where the agent needs to maintain continuity across many turns and many hours of execution. The memory system directly correlates with agent reliability: well-structured memory reduces the cognitive load on the model and improves the quality of generated code.",
                "The architecture consists of three distinct layers that work together to provide comprehensive coverage: short-term scratchpad (immediate context needed for the current task, typically the model's context window), working task memory (recent results, hypotheses tested, failed approaches, and TODOs for the active mission), and long-term repository knowledge (accumulated lessons, architectural patterns, verified solutions, and historical debug records that persist across missions). Each layer serves a specific purpose and has different retention characteristics, storage mechanisms, and access patterns. The boundaries between layers are flexible and can be configured based on the deployment environment and the organization's requirements for knowledge persistence."
            ]
        },
        {
            "heading": "Short-Term Scratchpad Management",
            "paragraphs": [
                "The scratchpad is the model's active context window, containing the conversation history, current task specification, and recently read code. The system manages scratchpad size through: AST-aware pruning (removing non-essential commentary while preserving symbol definitions), token-efficient caching (storing only the most relevant recent interactions), and automatic summarization (condensing old conversation history into a concise summary that preserves key decisions). These techniques are essential for extending effective mission length beyond the model's native context window limit.",
                "The scratchpad has a configurable size limit, and when approaching the limit, the system triggers context compaction: the oldest interactions are summarized and archived, freeing space for new information while preserving the essential context. The summarization is performed by a separate lightweight model that extracts key decisions, identified problems, and resolved outcomes, ensuring that the most critical information is preserved even when the context window is full. This ensures that the agent can maintain a long-running mission without hitting context window limits, and that knowledge is not permanently lost due to context truncation.",
                "Additionally, the scratchpad management system supports priority-based retention: certain types of information (e.g., recently failed approaches, critical code symbols, active TODO items) are retained with higher priority than others (e.g., verbose conversation filler, redundant code expositions). This priority system ensures that the most useful information is always available within the context window, improving the quality of the agent's decisions."
            ]
        },
        {
            "heading": "Working Task Memory",
            "paragraphs": [
                "Working task memory tracks the active mission's state: the current objectives, hypotheses tested and their outcomes, failed approaches and why they failed, remaining TODOs, and the decision log (why certain paths were chosen over others). This memory prevents the agent from repeating previously failed edits and maintains momentum across multi-turn interactions. Working task memory is stored separately from the model's context window, making it persistent across mission restarts and available for historical analysis.",
                "The system records: each hypothesis tested and its verification result (pass/fail with reasons), each attempted edit and its test result (compilation errors, test pass/fail, lint violations), and each decision point with the rationale for the decision (why this approach was chosen over alternatives). This information provides a complete audit trail of the agent's reasoning process, enabling operators to understand how the agent arrived at its current state and what the next best step might be.",
                "Working task memory also supports mission replay: the complete sequence of hypotheses and their results can be reconstructed, enabling operators to understand the agent's decision-making process, identify failure modes, and determine the optimal next step. Mission replay is invaluable for debugging complex issues, training new operators, and continuous improvement of agent configurations. The replay data includes timestamps, tool outputs, verification results, and the agent's internal state at each step, providing a comprehensive record of the mission's execution."
            ]
        },
        {
            "heading": "Long-Term Repository Knowledge",
            "paragraphs": [
                "Long-term repository knowledge accumulates across missions: architectural patterns discovered, verified solutions to recurring problems, anti-patterns to avoid, and context about the codebase's evolution (recent refactorings, deprecated APIs, performance optimizations). This knowledge is preserved in the audit ledger and is available for future missions on the same codebase, creating a cumulative intelligence layer that improves over time.",
                "The system supports knowledge retrieval: when a new mission begins, the agent can query the long-term knowledge base to surface relevant architectural lessons, previously successful solutions, and known pitfalls. This reduces redundancy, accelerates mission completion, and ensures that institutional knowledge is not lost when team members change or when agents are redeployed to different codebase. Knowledge retrieval uses vector similarity search to find the most relevant previously-solved problems, enabling the agent to build on past successes rather than starting from scratch.",
                "Knowledge retention policies determine how long accumulated knowledge is preserved: recent lessons (last 30 days) are kept in hot storage for easy access, typically indexed in a searchable database with quick retrieval times. Medium-term knowledge (30-90 days) is kept in warm storage, accessible but with slightly longer retrieval times. Long-term patterns (90+ days) are kept in cold storage with periodic export, potentially exported to external knowledge bases or documentation systems. This tiered approach balances the benefit of accumulated knowledge against storage costs, ensuring that the most relevant and recent knowledge is always available while older knowledge is preserved for compliance or audit purposes.",
                "The knowledge base also supports versioning: when the codebase undergoes significant refactoring or restructuring, knowledge entries are tagged with the codebase version to which they apply. This ensures that outdated knowledge is not incorrectly applied to new code structures, and that the agent can distinguish between knowledge that is still valid and knowledge that has been superseded by more recent developments."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is the agent memory architecture?",
            "answer": "Hierarchical memory system separating short-term scratchpad context, working task memory, and long-term repository knowledge, preventing context window overflow while preserving critical architectural lessons."
        },
        {
            "question": "How does scratchpad management work?",
            "answer": "The system manages scratchpad size through AST-aware pruning, token-efficient caching, and automatic summarization. When approaching limits, old interactions are summarized and archived, preserving key decisions."
        },
        {
            "question": "What is working task memory?",
            "answer": "Tracks the active mission's state: objectives, hypotheses tested with outcomes, failed approaches, remaining TODOs, and decision log. Prevents repeating failed edits and maintains momentum across turns."
        },
        {
            "question": "How is long-term knowledge preserved?",
            "answer": "Accumulated across missions in the audit ledger, including architectural patterns, verified solutions, and anti-patterns. Retention policies determine hot/warm/cold storage based on recency."
        },
        {
            "question": "Can the agent query past knowledge during a new mission?",
            "answer": "Yes. When a new mission begins, the agent can query the long-term knowledge base to surface relevant architectural lessons, previously successful solutions, and known pitfalls for the same codebase, reducing redundancy and accelerating mission completion."
        },
        {
            "question": "What retention policies are in place?",
            "answer": "Recent lessons (last 30 days) are kept in hot storage for easy access, medium-term knowledge (30-90 days) in warm storage, and long-term patterns (90+ days) in cold storage with periodic export. This tiered approach balances the benefit of accumulated knowledge against storage costs."
        }
    ],
};
