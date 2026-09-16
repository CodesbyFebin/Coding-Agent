import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const promptInjectionDefenses: PillarEditorial = {
  "pillarId": "prompt-injection-defenses",
  "updated": "2026-09-24",
  "definition": "Multi-layer defense isolating untrusted repository strings, issues, and PR comments from executive system instructions — preventing indirect prompt injections embedded in READMEs or dependencies from hijacking agent execution authority.",
  "sections": [
    {
      "heading": "Prompt Injection Threat Model",
      "paragraphs": [
        "Prompt injection is one of the most critical security threats for autonomous coding agents. An indirect prompt injection occurs when external content — such as a README file, a GitHub issue, a pull comment, or a dependency — contains carefully crafted text designed to manipulate the agent's behavior. Because models naturally attend to all text in their context window, such injected content can override the agent's system instructions, causing it to execute unintended actions, exfiltrate data, or generate malicious code.",
        "The threat is particularly insidious because the injected content appears legitimate: it might be a harmless-looking comment in a PR, a documentation section in a README, or a configuration file in a dependency. The agent reads this content as part of its context, and the injected prompt instructions blend in with the legitimate system instructions.",
        "CodingAgent's prompt injection defense framework addresses this through: separation of control and data planes, strict input sanitization, and layered defense that ensures untrusted content cannot influence agent authority."
      ]
    },
    {
      "heading": "Separation of Control and Data Planes",
      "paragraphs": [
        "The fundamental defense strategy is strict separation of the control plane (system instructions, permission declarations, governance rules) from the data plane (repository content, issue comments, PR descriptions, dependency files). The control plane is never influenced by data plane content: all external inputs are sanitized and validated before they are mixed with system instructions.",
        "The separation is enforced through: XML/JSON envelope formats that clearly delimit control versus data, AST-based parsing that identifies and isolates system instructions from user content, and runtime checks that validate that no data plane content has been injected into the control plane.",
        "This architecture ensures that even if an attacker successfully injects a prompt into a README or dependency, the agent's system instructions remain intact and the agent cannot be manipulated to execute unauthorized actions."
      ]
    },
    {
      "heading": "Multi-Layer Input Sanitization",
      "paragraphs": [
        "CodingAgent applies multiple sanitization layers to all external inputs before they enter the model context: regex-based pattern matching to detect common prompt injection markers (e.g., 'ignore previous instructions', 'you are now'), AST analysis to identify and remove structurally injected prompts, and semantic analysis to detect coercive language designed to override agent authority.",
        "The sanitization system is configurable: organizations can define custom regex patterns for their domain, adjust the strictness of AST-based filtering, and specify which sanitization layers are active for different input types (READMEs vs. issues vs. dependency outputs). All sanitization decisions are logged in the audit trail with the reason and the original content hash.",
        "Semantic analysis is particularly effective against sophisticated attacks: it detects coercive language patterns that attempt to manipulate the agent through authority framing, urgency creation, or social engineering. These patterns are updated regularly based on observed attack trends."
      ]
    },
    {
      "heading": "Envelope Format and Runtime Validation",
      "paragraphs": [
        "All external content is wrapped in a structured XML/JSON envelope before being included in the agent's context. The envelope clearly marks which portions are control instructions (system prompts, permission declarations) and which are data (repository content, issue comments). The runtime validates the envelope integrity before releasing any content to the model, and any deviation from the expected format triggers a verification gate failure.",
        "The envelope format includes: a header declaring the content type (control vs. data), a hash of the original content for integrity verification, and a sandbox marker indicating whether the content has been sanitized. The runtime checks the envelope before each mission startup and during mission execution if new external content is loaded.",
        "This envelope approach provides: clear separation of control and data, integrity verification (any modification to the original content is detected), and runtime enforcement (the model only receives content that passes the validation checks)."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is prompt injection in the context of coding agents?",
      "answer": "Indirect prompt injection occurs when external content (READMEs, issues, PR comments, dependencies) contains crafted text designed to manipulate the agent's behavior by overriding system instructions through the context window."
    },
    {
      "question": "How does the separation of control and data planes work?",
      "answer": "The control plane (system instructions, permission declarations) is strictly separated from the data plane (repository content, issue comments). All external inputs are sanitized and validated before mixing with system instructions, using XML/JSON envelope formats that clearly delimit control versus data."
    },
    {
      "question": "What sanitization layers are applied?",
      "answer": "Three layers: regex-based pattern matching for common injection markers, AST analysis to remove structurally injected prompts, and semantic analysis to detect coercive language patterns that attempt to override agent authority."
    },
    {
      "question": "What is the envelope format?",
      "answer": "External content is wrapped in structured XML/JSON envelopes that declare content type (control vs. data), include content hashes for integrity verification, and have sandbox markers indicating whether content has been sanitized. The runtime validates envelope integrity before releasing content to the model."
    },
    {
      "question": "Can sanitization prevent all prompt injections?",
      "answer": "No system can prevent 100% of prompt injections, but the multi-layer defense significantly reduces the risk. The combination of envelope separation, regex matching, AST analysis, and semantic analysis provides strong defense against both simple and sophisticated attacks."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};