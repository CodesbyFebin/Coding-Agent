"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workingMissionMemory = void 0;
// Editorial converted from the reviewed pillar-database source. Claim-audited.
exports.workingMissionMemory = {
    "pillarId": "working-mission-memory",
    "updated": "2026-09-24",
    "definition": 'Structured state stores tracking active task objectives, hypotheses tested, failed approaches, and remaining TODOs — preventing the agent from repeating previously failed edits and maintaining momentum across multi-turn interactions.',
    "sections": [
        {
            "heading": "Working & Mission Memory: Structured State Management",
            "paragraphs": [
                "Working and mission memory provides structured state stores that track active task objectives, hypotheses tested, failed approaches, and remaining TODOs. The core principle is that agents should not repeat previously failed edits, and should maintain momentum across multi-turn interactions. By explicitly tracking the task state, the agent can build on prior work rather than starting from scratch each time.",
                "The memory system operates in three interconnected layers: active task objectives (the current mission's goals and acceptance criteria), hypotheses tested and failed (a record of approaches that were tried and did not work, along with the reasons for failure), and remaining TODOs (specific actions that still need to be taken to complete the mission). Each layer provides a different perspective on the task state, and together they enable efficient, continuous progress.",
                "The verification aspect includes: hypothesis tracking accuracy (percentage of hypotheses correctly tracked and evaluated), TODO completion rate (percentage of TODOs completed within the mission), and mission continuation success rate (ability to resume a paused mission without repeating failed edits). The system reports: hypothesis tracking accuracy, TODO completion rate, and mission continuation success rate."
            ]
        },
        {
            "heading": "Memory Layer Details",
            "paragraphs": [
                "Active task objectives: This layer tracks the current mission's goals, acceptance criteria, and success metrics. It provides a clear, structured view of what the agent is trying to achieve, ensuring that all subsequent actions are aligned with the mission's objectives. The system reports: objective clarity score (how well-defined and measurable the objectives are), criterion compliance rate (percentage of actions that contribute to meeting the acceptance criteria), and goal drift detection (identification when the agent's focus shifts away from the original objectives).",
                "Hypotheses tested and failed: This layer records the approaches the agent has tried that did not succeed, along with the specific reasons for failure. This prevents the agent from repeatedly trying the same failed approach and enables it to learn from past mistakes. The system reports: hypothesis documentation completeness (percentage of failed attempts that are documented), hypothesis reuse rate (percentage of missions that reference prior failed hypotheses), and false hypothesis positive rate (incorrectly recording a successful approach as failed).",
                "Remaining TODOs: This layer specifies the concrete actions that still need to be taken to complete the mission, broken down into granular tasks with clear acceptance criteria. Each TODO is tagged with its priority level, estimated effort, and dependency on other TODOs. The system reports: TODO completion rate, priority-based progress (percentage of high-priority TODOs completed), and TODO dependency graph (visualization of how TODOs relate to each other)."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is working and mission memory?",
            "answer": "Structured state stores tracking active task objectives, hypotheses tested, failed approaches, and remaining TODOs."
        },
        {
            "question": "How does memory prevent repeated failures?",
            "answer": "By recording hypotheses tested and failed, and TODOs remaining, the agent can avoid trying the same failed approaches and maintain momentum across interactions."
        },
        {
            "question": "What are active task objectives?",
            "answer": "The current mission's goals, acceptance criteria, and success metrics, providing a structured view of what the agent is trying to achieve."
        },
        {
            "question": "How are TODOs managed?",
            "answer": "TODOs are broken into granular tasks with clear acceptance criteria, tagged with priority and estimated effort, and tracked through a dependency graph."
        },
        {
            "question": "Can a paused mission be resumed?",
            "answer": "Yes. The memory system tracks all necessary state, enabling the agent to resume a paused mission without repeating failed edits."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
