import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const codingagentDocs: PillarEditorial = {
  "pillarId": "codingagent-docs",
  "updated": "2026-09-24",
  "definition": "Comprehensive guides for configuration, CLI arguments, MCP integration, and security policies — enabling rapid developer onboarding without guesswork or trial-and-error.",
  "sections": [
    {
      "heading": "CodingAgent Documentation Fundamentals",
      "paragraphs": [
        "The CodingAgent documentation provides comprehensive guides for developers to get started and effectively use the platform. The documentation is organized into: getting started guides (quickstart, installation, first mission), configuration reference (CLI arguments, environment variables, permission policies), MCP integration guides (wrapping custom tools, registering new MCP servers), and security policies (permission models, approval gates, audit logging). The documentation is designed for rapid developer onboarding: a new developer can go from zero to running their first agent mission in minutes, not hours.",
        "The documentation is maintained in markdown files in the repository's docs/ directory, and is published through the Vercel documentation platform. Each documentation topic includes: a clear description of the feature, configuration parameters with defaults and valid values, example configurations and CLI commands, and troubleshooting common issues. All configuration examples are validated against the platform's schema before publication."
      ]
    },
    {
      "heading": "Getting Started Guides",
      "paragraphs": [
        "The getting started guides walk new developers through: installing CodingAgent (via npm, pip, or pre-built binary), configuring their first agent mission (creating the agent configuration file, selecting a model, defining the task), running their first mission (using the CLI or IDE extension), and viewing the results (mission telemetry, verification results, audit log entry). The guides are designed to be completed in under 30 minutes, with step-by-step instructions and screenshots for the most common workflows.",
        "Each guide includes: prerequisite requirements (operating system, hardware, accounts), step-by-step instructions (numbered list with screenshots), verification steps (how to confirm the mission completed successfully), and common pitfalls (what can go wrong and how to fix it). The guides are reviewed regularly to ensure they reflect the latest platform version."
      ]
    },
    {
      "heading": "Configuration Reference",
      "paragraphs": [
        "The configuration reference provides comprehensive documentation of all configuration options: CLI arguments (all supported flags and their defaults), environment variables (CODINGAGENT_MODEL, CODINGAGENT_TOKEN, CODINGAGENT_LOG_LEVEL, etc.), permission policies (the YAML or Rego policy language for defining ALLOW/ASK/DENY tiers), and MCP server configuration (registration, authentication, and capability export). Each configuration option includes: a clear description, valid values and defaults, example configuration snippets, and relationships to other configuration options (dependencies, conflicts, defaults when unspecified).",
        "The configuration reference is essential for: customizing agent behavior for specific workflows, integrating CodingAgent into existing CI/CD pipelines, configuring permission policies for organizational governance, and troubleshooting configuration-related issues. The reference is available both as online documentation and as a downloadable JSON schema for tooling integration."
      ]
    },
    {
      "heading": "MCP Integration Guides",
      "paragraphs": [
        "The MCP integration guides walk developers through wrapping their own tools as MCP servers and registering them with CodingAgent. The guides cover: creating an MCP server (using the SDK template in the programming language of choice), registering the tool with the MCP registry (defining the JSON Schema, permission declarations, and capability metadata), testing the MCP server (running the automated contract test suite), and connecting CodingAgent to the MCP server (configuration in the agent's config file, authentication setup). Each guide includes complete, runnable examples and troubleshooting common integration issues.",
        "The MCP integration guides are essential for: organizations that want to expose internal tools (custom compilers, databases, ticketing systems) to AI agents, tool providers that want to make their products accessible to AI agents, and teams that want to standardize on the Model Context Protocol for tool integration. The guides are written for developers with intermediate experience with the chosen programming language."
      ]
    },
    {
      "heading": "Security Policies",
      "paragraphs": [
        "The security policies documentation provides comprehensive guidance for configuring CodingAgent's security features: approval policy design (defining ALLOW/ASK/DENY tiers as code), network egress controls (configuring the allowlist of permitted endpoints), secret scoping (managing where credentials are injected and scrubbed), and audit logging (configuring retention policies, export formats, and querying). Each policy section includes: the conceptual overview, the configuration format (YAML or Rego examples), step-by-step setup instructions, and security best practices recommendations.",
        "The security policies documentation is essential for: organizations in regulated industries (finance, healthcare, government) that must comply with strict data governance requirements, security teams that want to harden their agent deployments, and DevOps teams that want to integrate agent security into their existing governance tooling. All configuration examples are validated against the platform's schema and reviewed against common security pitfalls."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is the CodingAgent documentation?",
      "answer": "Comprehensive guides for configuration, CLI arguments, MCP integration, and security policies enabling rapid developer onboarding."
    },
    {
      "question": "How long does it take to get started?",
      "answer": "The getting started guides are designed to be completed in under 30 minutes, with step-by-step instructions and screenshots for the most common workflows."
    },
    {
      "question": "What configuration options are documented?",
      "answer": "All CLI arguments, environment variables, permission policies (YAML/ Rego), and MCP server configuration with JSON Schema, permission declarations, and capability metadata."
    },
    {
      "question": "Can I contribute to the documentation?",
      "answer": "The documentation is maintained in the repository and contributions follow the standard pull request process. All examples are validated against the platform's schema."
    },
    {
      "question": "Is the documentation available as a JSON schema?",
      "answer": "Yes. The configuration reference is available as a downloadable JSON schema for tooling integration."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};