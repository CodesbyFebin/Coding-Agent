// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const codingagentGuides = {
    "pillarId": "codingagent-guides",
    "updated": "2026-09-24",
    "definition": "Step-by-step tutorials for configuring local Ollama models, writing custom MCP tools, and setting up air-gapped runtimes — walking practitioners through end-to-end setups tailored to specific developer environments.",
    "sections": [
        {
            "heading": "CodingAgent Guides Fundamentals",
            "paragraphs": [
                "The CodingAgent Guides provide step-by-step tutorials for common setup and configuration tasks. The guides are designed to walk practitioners through end-to-end setups tailored to their specific developer environment, whether they are running models locally, integrating custom MCP tools, or deploying in air-gapped environments. Each tutorial includes prerequisites, step-by-step instructions, verification steps, and troubleshooting for common issues.",
                "The guides cover: local model setup with Ollama (installation, model selection, GPU acceleration), writing custom MCP tools (SDK template, JSON Schema definition, permission registration), air-gapped runtime deployment (offline model updates, air-gapped sandbox configuration, offline plugin management), and CI/CD pipeline integration (embedding agents in GitHub Actions, GitLab CI, Jenkins)."
            ]
        },
        {
            "heading": "Local Ollama Model Setup",
            "paragraphs": [
                "This tutorial walks through: installing Ollama on macOS, Linux, or Windows, pulling and selecting appropriate coding models (DeepSeek-Coder, Qwen-Coder, Llama-Code), configuring GPU acceleration (Metal on macOS, CUDA on Linux, ROCm on AMD), and verifying the model is operational through a test mission. The tutorial includes troubleshooting for common issues: insufficient VRAM, model pull failures, and GPU driver conflicts.",
                "The tutorial provides two setup options: minimal (7B parameter model for syntax fixes, runs on integrated graphics), and production (13B+ parameter model for refactorings, requires discrete GPU or Apple Silicon). Each option includes the required hardware specifications and estimated cost."
            ]
        },
        {
            "heading": "Writing Custom MCP Tools",
            "paragraphs": [
                "This tutorial walks through: creating an MCP server using the SDK template in the programming language of choice, defining the JSON Schema for the tool's inputs and outputs, registering the tool with appropriate permission declarations (ALLOW, ASK, DENY), and connecting the MCP server to CodingAgent (configuration in the agent's config file, authentication setup). The tutorial includes a complete, runnable example: a custom compiler wrapper that exposes compilation results as an MCP tool.",
                "The tutorial also covers: testing the MCP server (running the automated contract test suite), debugging common integration issues (authentication failures, schema validation errors, permission denied errors), and publishing the MCP server to the organization's internal registry. Each step includes troubleshooting for the most common issues."
            ]
        },
        {
            "heading": "Air-Gapped Runtime Deployment",
            "paragraphs": [
                "This tutorial walks through: deploying CodingAgent in an air-gapped environment (zero external network required), configuring offline model updates (downloading models and plugins on a connected machine, transferring via USB or internal network), setting up the air-gapped sandbox (Docker or bubblewrap configuration without network access), and verifying the deployment (running a test mission, checking audit log functionality). The tutorial includes troubleshooting for common air-gapped issues: model not found, plugin incompatibility, and sandbox startup failures.",
                "The tutorial provides two deployment modes: fully air-gapped (no network ever required, updates delivered offline) and hybrid (occasional network access for model updates, otherwise fully operational offline). Each mode includes the required configuration steps and security considerations."
            ]
        },
        {
            "heading": "CI/CD Pipeline Integration",
            "paragraphs": [
                "This tutorial walks through: embedding CodingAgent in GitHub Actions (workflow YAML, agent runner step, artifact passing), GitLab CI (job configuration, API integration, artifact passing), and Jenkins (build step configuration, agent runner, publisher plugin). The tutorial includes complete, runnable examples for each CI system: a GitHub Actions workflow that triggers the agent on pull request events, posts review comments, and runs verification gates; a GitLab CI job that performs the same functions; and a Jenkins pipeline configuration that integrates the agent runner.",
                "The tutorial also covers: secrets management in CI (storing API keys and model credentials securely), artifact passing between the CI run and the agent (mission state, verification results, audit logs), and rollback procedures (what happens if the agent mission fails during CI). Each example includes troubleshooting for common CI integration issues."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is the CodingAgent Guides collection?",
            "answer": "Step-by-step tutorials for configuring local Ollama models, writing custom MCP tools, and setting up air-gapped runtimes, walking practitioners through end-to-end setups tailored to specific developer environments."
        },
        {
            "question": "Can I set up Ollama on Windows?",
            "answer": "Yes. The tutorial covers Ollama installation on macOS, Linux, and Windows, with GPU acceleration support for each platform."
        },
        {
            "question": "Do I need a GPU for local models?",
            "answer": "No. The tutorial provides minimal setup (7B parameter model on integrated graphics) and production setup (13B+ parameter model requiring discrete GPU or Apple Silicon)."
        },
        {
            "question": "Can I write MCP tools in any programming language?",
            "answer": "The SDK templates are available for Python, TypeScript, and Go. The tutorial provides examples in all three languages."
        },
        {
            "question": "Is air-gapped deployment difficult?",
            "answer": "The tutorial provides step-by-step guidance for fully air-gapped or hybrid deployment. Fully air-gapped requires no network ever, while hybrid allows occasional network access for model updates."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
