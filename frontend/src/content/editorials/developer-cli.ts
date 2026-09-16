import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const developerCli: PillarEditorial = {
  "pillarId": "developer-cli",
  "updated": "2026-09-24",
  "definition": "Fast, scriptable terminal CLI for launching autonomous missions, piping diffs, inspecting memory, and managing local models — designed to fit naturally into developer terminal muscle memory and UNIX composability philosophies.",
  "sections": [
    {
      "heading": "CodingAgent Developer CLI: Terminal-First Agent Control",
      "paragraphs": [
        "The Developer CLI provides a fast, scriptable terminal interface for launching autonomous missions, piping diffs, inspecting memory, and managing local models. Rather than requiring developers to use a web interface or API calls, the CLI fits naturally into existing terminal muscle memory and UNIX pipelines. The CLI is designed for composability: agents can be chained together, diffs can be piped to other tools, and common operations can be aliased or scripted. The core principle is that the terminal remains the primary interface for developers who spend their working hours in the shell: the CLI eliminates the need to context-switch to a web UI for routine agent operations, and it enables scriptable automation for repetitive tasks such as batch repository refactoring or periodic security audits. By keeping the agent workflow in the terminal, developers can leverage their existing shell skills and integrate agent operations into their existing shell scripts and build systems, creating a seamless workflow that feels natural and efficient. This terminal-first approach is particularly valuable for developers who spend the majority of their working time in the shell and want to maintain their flow state without context-switching to a web interface.",
        "The verification aspect includes: exit code validation (the CLI returns non-zero exit codes when missions fail or encounter critical errors), output schema validation (JSON output conforms to a published schema), and scriptability tests (the CLI is tested across bash, zsh, and fish shells for consistent behavior). These verification points ensure that the CLI remains a reliable tool in the developer's toolkit and that scriptable integrations work as expected across different shell environments. The consistent behavior across shells is essential for organizations that standardize on specific shell environments, as inconsistent behavior would undermine confidence in the tool's output and lead to unreliable scripted integrations. The CLI also provides environment variable reference documentation detailing all supported environment variables and their expected values, default configuration specification describing the default behavior of each command, and troubleshooting guides for common issues encountered during agent operation. These additional verification points further ensure that the CLI remains a dependable tool in the developer's toolkit.",
        "A key distinction from graphical agent interfaces is that the CLI operates with minimal overhead and can be incorporated into existing shell pipelines and build systems. It does not require a web server, does not introduce a separate runtime dependency beyond the CodingAgent model runtime, and can be executed in any environment where the CodingAgent model is available, including air-gapped environments with no external network access. This makes the CLI particularly valuable for organizations with strict network security requirements or those operating in air-gapped environments, where web-based interfaces are not feasible."
      ]
    },
    {
      "heading": "CLI Commands and Operations",
      "paragraphs": [
        "The CLI supports a range of commands organized by function: mission launch commands start autonomous agent runs with specified models and tool configurations, diff inspection commands retrieve and format the agent's proposed code changes, memory inspection commands display the agent's working state, scratchpad, and long-term knowledge summary, and model management commands list, select, and switch between available local and cloud models. Additional commands include health checks, cost reporting, and configuration validation. Each command follows a consistent pattern: flags modify behavior, subcommands organize related operations, and output is designed for machine readability (JSON for programmatic consumption) or human readability (pretty-printed text for terminal display). The CLI also supports environment variable configuration for credentials, model endpoints, and default tool settings. This consistent command structure ensures that developers can predictably use the CLI without needing to consult documentation for every operation, reducing the cognitive overhead of adopting the tool. The consistent command structure also makes it easier to write scripts that interact with the CLI, as the developer can predict the behavior of each command.",
        "The verification aspect includes: exit code validation, output schema validation, and scriptability tests across multiple shells. These verification points ensure that the CLI remains a reliable tool in the developer's toolkit.",
        "The CLI also supports: custom verification script execution (the CLI can invoke user-defined verification scripts as part of the verification pipeline), verification result aggregation (the CLI consolidates verification results from multiple sources into a single report), and historical verification trend analysis (the CLI provides access to historical verification data for trend analysis and continuous improvement). These additional verification features provide a comprehensive verification framework that covers all aspects of the agent's operation, from individual mission execution to organization-wide trend analysis. The historical trend analysis enables organizations to identify patterns in agent performance over time, enabling data-driven decisions about agent configuration and deployment."
      ]
    },
    {
      "heading": "UNIX Composability and Piping",
      "paragraphs": [
        "A key design goal is UNIX composability: the CLI output can be piped to other tools such as `grep`, `jq`, and `xargs` for further processing. For example, `coding-agent mission list | jq '.[] | select(.status == \"completed\")'` filters completed missions, and `coding-agent diff retrieve | patch-apply` applies the agent's proposed changes. The CLI also supports `--stdout` and `--stderr` flags to direct output to appropriate streams, enabling integration with shell scripts and build systems. This composability extends to configuration: environment variables can override default settings without modifying configuration files, enabling different behaviors in development, CI, and production contexts. The UNIX philosophy-based design ensures that the CLI feels like a natural extension of the shell rather than a separate tool, and that developers can integrate the CLI into their existing shell pipelines without learning new syntax or conventions. The UNIX composability is a key differentiator between the CLI and graphical agent interfaces, which typically lock users into proprietary workflows.",
        "The verification aspect includes: exit code validation (the CLI returns non-zero exit codes when missions fail or encounter critical errors), output schema validation (JSON output conforms to a published schema), and scriptability tests (the CLI is tested across bash, zsh, and fish shells for consistent behavior). These verification points ensure that the CLI remains a reliable tool in the developer's toolkit.",
        "The CLI also supports: custom stream routing (the CLI can direct different types of output to different streams for complex pipeline integration), pipeline-aware configuration detection (the CLI can detect whether it is running in a CI/CD pipeline and adjust its behavior accordingly), and integration test suites (the CLI is tested against common pipeline configurations to ensure compatibility). These additional composability features make the CLI a versatile tool that can be integrated into a wide variety of workflows."
      ]
    },
    {
      "heading": "Cost Governance and Token Tracking",
      "paragraphs": [
        "The CLI provides real-time token cost attribution: the `mission status` command displays current token consumption, and the `cost report` command generates a breakdown by model, task, and time period. Budget thresholds can be set via environment variables, and the CLI will warn or exit when limits are approached. This enables developers to monitor and control LLM costs directly from the terminal, without needing to navigate a web dashboard. The CLI also supports historical cost tracking stored in the audit ledger for trend analysis and budget planning. By bringing cost visibility into the terminal, developers can make informed decisions about agent usage without leaving their workflow. The cost attribution feature provides visibility into which models, tasks, and time periods are consuming the most tokens, enabling data-driven decisions about agent usage. This is particularly important for organizations that need to track and justify LLM spending to finance teams, as the CLI provides the detailed cost data needed for budgeting and planning.",
        "The verification aspect includes: cost model accuracy (comparing predicted vs. actual token consumption), budget threshold effectiveness (ensuring caps are enforced without blocking legitimate work), and historical cost tracking stored in the audit ledger for trend analysis. These features enable finance teams to plan and budget for agentic CI/CD operations with the same predictability as traditional software development operations.",
        "The CLI also supports: per-mission budget caps that terminate the mission when exceeded, cost attribution linking token consumption to specific repositories or teams, and integration with organizational cost management platforms via webhook notifications. These additional cost governance features provide a comprehensive framework for managing LLM costs at scale, ensuring that organizations can adopt agentic CI/CD at scale without encountering budget overruns that would undermine the business case for automation. The webhook notifications enable organizations to integrate LLM cost data with their existing financial management systems, providing a seamless flow of cost information from the CLI to the organization's financial platforms."
      ]
    },
    {
      "heading": "Integration with Agent Memory and Verification",
      "paragraphs": [
        "The CLI integrates with the agent's memory architecture: the `memory inspect` command displays the agent's working state, scratchpad, and long-term knowledge summary, enabling developers to understand the agent's current context and decision history. The memory inspection command shows the agent's current context, which is essential for understanding why the agent made certain decisions and for debugging issues. The CLI also integrates with verification gates: the `verify run` command executes the agent's proposed changes through the type checker, unit test suite, and linter, reporting pass/fail status. This integration ensures that the CLI is not just a launching tool but an active participant in the agent's verification pipeline. The complete integration closes the loop between agent execution and code quality assurance, providing a comprehensive verification pipeline that spans from agent execution to code quality assurance. This complete pipeline ensures that no mission output is merged or deployed without passing all verification gates.",
        "The verification aspect includes: type check integration (the CLI invokes tsc or equivalent and reports results), unit test execution (the CLI runs pytest, go test, or equivalent test suites), and linting integration (the CLI runs eslint or equivalent and reports violations). These verification points close the loop between agent execution and code quality assurance.",
        "The CLI also supports: custom verification script execution (the CLI can invoke user-defined verification scripts as part of the verification pipeline), verification result aggregation (the CLI consolidates verification results from multiple sources into a single report), and historical verification trend analysis (the CLI provides access to historical verification data for trend analysis and continuous improvement). These additional verification features provide a comprehensive verification framework that covers all aspects of the agent's operation, from individual mission execution to organization-wide trend analysis. The historical trend analysis enables organizations to identify patterns in agent performance over time, enabling data-driven decisions about agent configuration and deployment. The complete verification pipeline provides end-to-end confidence that the organization's quality standards are consistently enforced, from agent execution through to deployment."
      ]
    }
  ],
  "faq": [
    {
      "question": "What does the Developer CLI do?",
      "answer": "Fast, scriptable terminal CLI for launching autonomous missions, piping diffs, inspecting memory, and managing local models."
    },
    {
      "question": "Can the CLI output be piped to other tools?",
      "answer": "Yes. The CLI is designed for UNIX composability with JSON output and stream-friendly format."
    },
    {
      "question": "How are token costs tracked?",
      "answer": "Through real-time token cost attribution, budget thresholds, and cost report commands that break down consumption by model, task, and time period."
    },
    {
      "question": "Can the CLI terminate missions when budget limits are exceeded?",
      "answer": "Yes. Per-mission budget caps can be set that terminate the mission when the token limit is approached."
    },
    {
      "question": "Which shells does the CLI support?",
      "answer": "The CLI is tested and consistent across bash, zsh, and fish shells."
    },
    {
      "question": "How does the CLI handle authentication?",
      "answer": "Authentication is handled through environment variables for model API keys and credentials, never through interactive prompts in non-terminal contexts."
    },
    {
      "question": "Can the CLI integrate with verification pipelines?",
      "answer": "Yes. The CLI can invoke type checkers, test suites, and linters as part of the agent's verification pipeline."
    },
    {
      "question": "What output formats does the CLI support?",
      "answer": "The CLI supports JSON output for programmatic consumption and pretty-printed text for terminal display, with --stdout and --stderr flags for stream integration."
    },
    {
      "question": "How does the CLI integrate with agent memory?",
      "answer": "The CLI provides commands to inspect the agent's working state, scratchpad, and long-term knowledge summary, enabling developers to understand the agent's current context and decision history."
    },
    {
      "question": "Can the CLI be used in CI/CD pipelines?",
      "answer": "Yes. The CLI is designed for scriptable integration into CI/CD pipelines, enabling automated agent operations as part of the delivery pipeline."
    },
    {
      "question": "How does the CLI handle different shell environments?",
      "answer": "The CLI is tested and consistent across bash, zsh, and fish shells, with consistent behavior across all supported environments. The consistent behavior ensures that scripts written for one shell environment will work correctly in another, reducing the burden of maintaining shell-agnostic scripts."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};