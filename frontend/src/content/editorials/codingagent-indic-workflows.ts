import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const codingagentIndicWorkflows: PillarEditorial = {
  "pillarId": "codingagent-indic-workflows",
  "updated": "2026-09-24",
  "definition": "Multi-lingual natural language support for Hindi, Hinglish, and regional developer communication across Indian tech hubs — allowing engineers to prompt, describe architecture, and review PRs using natural mixed-language technical idioms.",
  "sections": [
    {
      "heading": "Indic Developer Workflows Fundamentals",
      "paragraphs": [
        "Indic developer workflows provide multi-lingual natural language support for developers across Indian tech hubs, enabling them to prompt, describe architecture, and review PRs using natural mixed-language technical idioms including Hindi, Hinglish (Hindi written in Latin script), and regional languages like Bengali, Telugu, Tamil, and Malayalam. This support is essential for India-first sovereign AI initiatives, where developers should be able to work in their preferred language without requiring English proficiency.",
        "The workflow support includes: multilingual prompt understanding (the agent can interpret developer prompts in Hindi, Hinglish, and regional languages), code review in mixed languages (the agent can understand PR comments and feedback that mix English with Indian languages), architecture description (the agent can understand architecture descriptions expressed in mixed languages), and PR summary generation (the agent can generate summaries of PR changes in the developer's preferred language).",
        "The multi-lingual capability is built on: language-adapted model fine-tuning (models trained on code and technical documentation in Indian languages), transliteration support (seamlessly switching between Devanagari, Bengali script, Tamil script, and Latin script), and technical vocabulary mapping (mapping technical terms across languages ensuring consistent meaning)."
      ]
    },
    {
      "heading": "Multilingual Prompt Understanding",
      "paragraphs": [
        "The agent can understand developer prompts expressed in Hindi, Hinglish, and regional languages. The prompt understanding system uses: language detection (automatically detecting the language(s) in the prompt), multilingual embeddings (projecting words from different languages into a shared vector space), and technical vocabulary recognition (identifying code-related terms across languages). The system can handle code-switched prompts (mixing English with Indian languages within a single prompt) and still produce correct code.",
        "The prompt understanding system is trained on: code documentation in Indian languages, technical articles written in Hindi and other Indian languages, PR comments and feedback from Indian developer communities, and code examples with comments in Indian languages. The training data ensures that the agent can understand domain-specific technical terms across languages.",
        "The system supports: real-time language switching (seamlessly handling prompts that switch between languages), dialect awareness (recognizing regional variations within Hindi, Bengali, Tamil, etc.), and code-mixing awareness (understanding that technical terms often remain in English even within Indian language prompts)."
      ]
    },
    {
      "heading": "Code Review in Mixed Languages",
      "paragraphs": [
        "The agent can review PR comments and feedback that mix English with Indian languages. The code review system understands: the technical intent of the comment (bug report, suggestion, question, praise), the language(s) used (detected and parsed separately), and the specific code references (file paths, function names, line numbers) regardless of language. The system can generate response suggestions in the same mixed-language format, maintaining the conversation's linguistic continuity.",
        "The code review workflow: the agent reads the PR comment, detects the language(s), extracts the technical feedback (what needs to change, why, and any concerns), and generates a response in the commenter's preferred language format. The response includes: acknowledgement of the feedback, the agent's understanding of the issue, the proposed fix, and any questions for clarification. All of this is done in the mixed-language format used by the commenter.",
        "This capability is essential for: open source projects with diverse contributor bases, internal teams with multilingual developers, and community-driven development where contributors may prefer communicating in their native language."
      ]
    },
    {
      "heading": "Architecture Description in Mixed Languages",
      "paragraphs": [
        "The agent can understand architecture descriptions expressed in mixed languages. This includes: system design prompts (describing system components, data flows, and interactions in mixed languages), technology selection (discussing which programming language, framework, or database to use, with explanations in the developer's preferred language), and API design (describing endpoints, request/response formats, and authentication mechanisms in mixed languages). The agent can translate these descriptions into technical implementation plans, including the appropriate code changes and configurations.",
        "The architecture description understanding uses: domain-specific language models (fine-tuned on architecture descriptions in Indian languages), component and technology mapping (mapping described components and technologies to actual code and configuration), and cross-lingual intent recognition (understanding the desired outcome regardless of the language used). The system can produce: implementation plans in English (for repository consistency), comments in the original mixed language (for developer readability), and PR summaries in the mixed language (for audience awareness)."
      ]
    },
    {
      "heading": "PR Summary Generation",
      "paragraphs": [
        "The agent can generate PR summaries in the developer's preferred language, including Hindi, Hinglish, and regional languages. The summary includes: a high-level description of the changes (what was modified, why), the key differences introduced (new functions, API changes, configuration updates), the verification results (which tests passed, which verification gates passed), and any open questions or follow-up actions. The summary is generated in the same mixed-language format as the PR comments, maintaining linguistic continuity throughout the discussion.",
        "The PR summary generation uses: the diff analysis (what code was added, modified, or removed), the verification results (test pass/fail status, verification gate outcomes), the comment analysis (developer feedback in mixed languages), and the language preference (detected from the PR commenter's history or explicitly specified). The summary is structured as: overview, key changes, verification status, and follow-up actions — each section generated in the appropriate language."
      ]
    }
  ],
  "faq": [
    {
      "question": "What are Indic developer workflows?",
      "answer": "Multi-lingual natural language support for Hindi, Hinglish, and regional developer communication across Indian tech hubs, allowing engineers to prompt, describe architecture, and review PRs using natural mixed-language technical idioms."
    },
    {
      "question": "Can the agent understand Hinglish prompts?",
      "answer": "Yes. The agent can understand Hinglish (Hindi written in Latin script) and code-switched prompts that mix English with Indian languages."
    },
    {
      "question": "How does code review in mixed languages work?",
      "answer": "The agent reads PR comments, detects the language(s), extracts the technical feedback, and generates responses in the same mixed-language format, maintaining linguistic continuity throughout the discussion."
    },
    {
      "question": "Can the agent generate PR summaries in Indian languages?",
      "answer": "Yes. The agent can generate PR summaries in Hindi, Hinglish, and regional languages, including overview, key changes, verification status, and follow-up actions."
    },
    {
      "question": "What languages are supported?",
      "answer": "Hindi, Hinglish, Bengali, Telugu, Tamil, Malayalam, and other regional Indian languages. The system also supports code-switched prompts that mix English with Indian languages."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};