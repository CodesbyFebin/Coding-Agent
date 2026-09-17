"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureToolCalling = void 0;
// Editorial converted from the reviewed pillar-database source. Claim-audited.
exports.secureToolCalling = {
    "pillarId": "secure-tool-calling",
    "updated": "2026-09-24",
    "definition": "Strict schema enforcement, argument validation, and parameter sanitization applied prior to executing any tool call — preventing shell injection and path traversal vulnerabilities from being triggered by generative model outputs.",
    "sections": [
        {
            "heading": "Secure Tool Calling Fundamentals",
            "paragraphs": [
                "Secure tool calling is the practice of applying strict validation and sanitization to all tool invocations before they are executed by the agent. The generative model's output is often treated as trusted input, but models can produce syntactically valid but semantically dangerous arguments — such as shell commands with injection characters, path traversal sequences, or arguments that exceed authorized boundaries. Secure tool calling treats all model outputs as untrusted and applies validation before execution.",
                "The core components of secure tool calling are: JSON Schema validation ( verifying that tool arguments conform to the declared schema before execution), parameter sanitization ( sanitizing arguments to remove injection characters, path traversal sequences, and other dangerous patterns), and authority bounds checking ( verifying that the requested operation stays within the agent's permitted scope and path restrictions).",
                "Each of these components operates on the model's output before the tool is invoked, ensuring that even if the model generates a seemingly valid tool call with malicious arguments, the invocation is blocked or sanitized before execution."
            ]
        },
        {
            "heading": "JSON Schema Enforcement",
            "paragraphs": [
                "Every tool declaration includes a JSON Schema that defines: the expected argument types (string, number, boolean, array, object), required versus optional arguments, valid value ranges and enums, and format constraints (e.g., email paths, URL formats, port numbers). Before any tool invocation, the agent's runtime validates the arguments against this schema. If the validation fails, the invocation is blocked and an error is returned to the agent, with details about which schema constraint was violated.",
                "Schema enforcement prevents several classes of attacks: shell injection (arguments containing |, &, ;, $(), backticks), path traversal (arguments with .. / or absolute paths outside the authorized directory), command injection (arguments containing shell metacharacters), and format violations (arguments that don't match the expected type or format).",
                "The schema system is extensible: organizations can define custom format validations for their domain (e.g., valid repository paths, acceptable branch names, authorized API endpoints). Custom validations are evaluated alongside the built-in schema constraints, and any failure blocks the invocation."
            ]
        },
        {
            "heading": "Parameter Sanitization and Path Validation",
            "paragraphs": [
                "Parameter sanitization goes beyond schema validation by actively removing or encoding dangerous patterns from the model's output. This includes: encoding shell metacharacters (converting | to its escaped form), normalizing paths (resolving .. / sequences to prevent traversal), and restricting path arguments to within the authorized workspace directory.",
                "Path validation ensures that: all file paths are resolved relative to the agent's working directory, no path resolves outside the designated task workspace, and write operations are restricted to declared writable paths. The system uses canonical path resolution (os.path.realpath on Unix, Path.GetFullPath on Windows) to detect hidden traversal attempts.",
                "For shell arguments, the system: escapes all metacharacters, rejects arguments with shell metacharacters when ALLOW is not explicitly declared, and provides a safe alternative representation (e.g., listing directory contents instead of cat-ing a potentially malicious file).",
                "These sanitization techniques are particularly important for tools that accept file paths, shell commands, or network endpoints as arguments, as these are the most common vectors for injection attacks."
            ]
        },
        {
            "heading": "Authority Bounds and Permission Integration",
            "paragraphs": [
                "Secure tool calling integrates with the permission system (ALLOW/ASK/DENY) to ensure that the requested operation is within the agent's authorized scope. Even if arguments pass schema validation and sanitization, the invocation is blocked if it violates the agent's permission posture: a read-only tool cannot be used for writing, a workspace-scoped tool cannot access paths outside the workspace, and a DENY-tier tool is always blocked regardless of argument validity.",
                "The permission check evaluates: the tool's declared permission tier, the argument values against path and scope restrictions, the agent's current role and configured permissions, and any mission-specific permission overrides. All permission checks are logged in the audit trail with the evaluation result and the matching policy rule.",
                "This integration ensures that secure tool calling works within the organization's overall governance framework: the model might generate a valid tool call, but the permission system ensures it only executes when the operator has authorized it."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is secure tool calling?",
            "answer": "Strict schema enforcement, argument validation, and parameter sanitization applied prior to executing any tool call, preventing shell injection and path traversal vulnerabilities from being triggered by generative model outputs."
        },
        {
            "question": "How does JSON Schema enforcement work?",
            "answer": "Every tool declaration includes a JSON Schema defining expected argument types, required/optional arguments, valid values, and format constraints. Arguments are validated against the schema before execution; failures block the invocation and return details about the violated constraint."
        },
        {
            "question": "What does parameter sanitization do?",
            "answer": "Parameter sanitization removes or encodes dangerous patterns from model output, including shell metacharacters, path traversal sequences, and format violations. It normalizes paths and restricts arguments to within the authorized workspace."
        },
        {
            "question": "How does authority bounds checking work?",
            "answer": "The system verifies that the requested operation stays within the agent's permitted scope: read-only tools cannot write, workspace-scoped tools cannot access outside the workspace, and DENY-tier tools are always blocked. All checks are logged in the audit trail."
        },
        {
            "question": "Can organizations define custom validations?",
            "answer": "Yes. Organizations can define custom format validations for their domain (valid repository paths, acceptable branch names, authorized API endpoints) that are evaluated alongside built-in schema constraints."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
