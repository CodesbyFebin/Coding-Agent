// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const verificationMemory = {
    "pillarId": "verification-memory",
    "updated": "2026-09-24",
    "definition": "The hierarchical memory system separating short-term scratchpad context, working task memory, and long-term repository knowledge -- preventing context window overflow while preserving critical architectural lessons learned in prior debugging sessions.",
    "sections": [
        {
            "heading": "Verification Memory: Hierarchical Memory Architecture",
            "paragraphs": [
                "Verification memory provides a hierarchical memory system separating short-term scratchpad context, working task memory, and long-term repository knowledge. The core principle is that context window overflow can be prevented while preserving critical architectural lessons learned in prior debugging sessions. By organizing memory into distinct layers, the agent can efficiently manage its limited context without sacrificing important information.",
                "The three memory layers operate as: short-term scratchpad (temporary context for the current task, such as recent tool outputs and intermediate results), working task memory (the active task's objectives, hypotheses tested, and remaining TODOs), and long-term repository knowledge (architectural patterns, recurring solutions, and proven approaches accumulated across multiple missions). Each layer has a distinct role and capacity, ensuring that the most critical information is always available.",
                "The verification aspect includes: memory retrieval relevance evaluations (testing the agent's ability to retrieve information from each memory layer), garbage collection of stale ephemeral records (automatically identifying and evicting outdated information from the scratchpad), and cross-layer consistency checks (ensuring that information is consistent across all memory layers). The system reports: memory retrieval accuracy (percentage of queries where the correct information is found), scratchpad eviction rate (frequency of stale record removal), and long-term knowledge retention (ability to recall architectural patterns across missions)."
            ]
        },
        {
            "heading": "Memory Layer Details",
            "paragraphs": [
                "Short-term scratchpad: This layer holds the immediate conversation history and recent tool outputs. It has a finite capacity (typically a few thousand tokens) and is regularly garbage-collected to prevent context window overflow. The garbage collection algorithm prioritizes retaining information that is most relevant to the current task, based on recency and relevance scoring.",
                "Working task memory: This layer tracks the active task's objectives, hypotheses that have been tested and failed, remaining TODOs, and the current approach being taken. It provides a structured view of the task state that the agent can reference when planning next steps. The system reports: hypothesis tracking accuracy (percentage of hypotheses correctly tracked and evaluated), TODO completion rate (percentage of TODOs completed within the mission), and task state consistency (ensure the task state is coherent and up-to-date).",
                "Long-term repository knowledge: This layer accumulates architectural patterns, recurring solutions, and proven approaches across multiple missions. It is implemented as a persistent knowledge base that the agent can query when tackling similar tasks in the future. The knowledge base is organized by topic (e.g., 'error patterns', 'performance optimizations', 'deployment practices') and includes metadata about each entry (such as the mission it was learned in and the success rate). The system reports: knowledge retrieval relevance (percentage of queries where the retrieved knowledge is relevant), knowledge growth rate (new entries added per mission), and knowledge reuse rate (percentage of missions that reference prior knowledge)."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is verification memory?",
            "answer": "The hierarchical memory system separating short-term scratchpad context, working task memory, and long-term repository knowledge."
        },
        {
            "question": "How does the system prevent context window overflow?",
            "answer": "By organizing memory into distinct layers with finite capacities, and automatically garbage-collecting stale information from the scratchpad."
        },
        {
            "question": "What is tracked in working task memory?",
            "answer": "The active task's objectives, hypotheses tested and failed, remaining TODOs, and the current approach being taken."
        },
        {
            "question": "How is long-term knowledge accumulated?",
            "answer": "Architectural patterns, recurring solutions, and proven approaches are accumulated across multiple missions into a persistent knowledge base organized by topic."
        },
        {
            "question": "How does the system decide what to forget?",
            "answer": "The garbage collection algorithm prioritizes retaining information that is most relevant to the current task, based on recency and relevance scoring."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
