import type { PillarEditorial } from '../types';

// Editorial converted from the reviewed pillar-database source. Claim-audited.
export const artifactHashing: PillarEditorial = {
  "pillarId": "artifact-hashing",
  "updated": "2026-09-24",
  "definition": "Cryptographic SHA-256 fingerprinting of all inputs, intermediate diffs, tool outputs, and produced binary artifacts — enabling deterministic caching, instant replay of identical tasks, and verification of supply chain integrity.",
  "sections": [
    {
      "heading": "Artifact Hashing Fundamentals",
      "paragraphs": [
        "Artifact hashing provides cryptographic integrity verification for all inputs, outputs, and intermediate states in the agentic workflow. Each artifact (model prompt, tool invocation argument, file diff, compiled binary, generated test suite) is assigned a SHA-256 hash that serves as a unique fingerprint. This fingerprint enables deterministic caching (same inputs always produce same outputs, allowing result reuse), instant replay (reconstructing a previous mission's state from its hash), and supply-chain integrity (verifying that artifacts have not been tampered with during transit or storage). The use of SHA-256 ensures collision resistance and widespread compatibility with existing cryptographic verification tools and frameworks.",
        "The hashing system is essential for production deployments where multiple agents may operate on the same codebase concurrently, and where the correctness and origin of generated artifacts must be verifiable. In enterprise environments with dozens or hundreds of concurrent agent missions, hash-based tracking provides the visibility needed to audit agent behavior, troubleshoot issues, and ensure that generated code meets quality and security standards. Without hashing, there is no reliable way to determine if two missions produced identical results, or if an artifact has been modified by an intermediate process or malicious actor."
      ]
    },
    {
      "heading": "Hashing Scope and Coverage",
      "paragraphs": [
        "The hashing system covers the full lifecycle of an agent mission: input hashing (SHA-256 of the mission specification, initial context, model configuration, and any user-provided prompts), intermediate diff hashing (SHA-256 of each file diff produced during execution, capturing the exact changes made to each file), tool output hashing (SHA-256 of each tool's return value, including generated code, test results, and report files), and binary artifact hashing (SHA-256 of compiled binaries, generated test suites, Docker images, documentation outputs, and other output files). Each level of the mission produces a cryptographic record that can be independently verified, creating a complete audit trail from the initial prompt to the final output.",
        "The system also supports end-to-end mission hashing: a single SHA-256 hash of the complete mission state (from start to finish) that captures all inputs, outputs, verification results, state transitions, and approval interactions. This end-to-end hash enables instant replay of the entire mission, not just individual artifacts. The end-to-end hash is computed by concatenating all intermediate hashes in execution order, ensuring that the sequence of operations is preserved and can be verified as a complete unit."
      ]
    },
    {
      "heading": "Deterministic Caching and Replay",
      "paragraphs": [
        "Deterministic caching uses artifact hashes to cache results: if a mission with the same inputs (same hash) is submitted again, the system returns the previously cached results without re-execution. This can provide significant cost and time savings for repetitive tasks like recurring refactorings (e.g., 'extract interface from service class'), periodic security scans (e.g., 'scan for secrets in all Python files'), and daily build verifications (e.g., 'run type checker and test suite'). The cache is keyed by the mission hash, and the cached result includes all outputs, verification results, state changes, and approval decisions. Cache performance metrics (hit rate, miss rate, latency improvement) are displayed on the observability dashboard, enabling teams to quantify the benefit of caching for their specific workload.",
        "Instant replay uses the end-to-end mission hash to reconstruct a previous mission's exact state: the agent's context at each point (scratchpad, working task memory, long-term knowledge), the tool invocations and their results (including error messages, output files, API responses), the verification outcomes (type check pass/fail, unit test results, lint violations), and the final file state (which files were modified, what changes were made). This is invaluable for debugging: operators can replay a failed mission to understand what went wrong, without re-executing the entire mission and incurring the associated cost and time. The replayed mission can be stepped through interactively, with each tool invocation and verification result displayed for analysis.",
        "The caching and replay system supports: cache expiration (stale entries are automatically invalidated after a configurable TTL, typically 24 hours for development workloads and 7 days for production workloads), cache size management (LRU eviction when the cache reaches its configured size limit, with priority-based eviction that preserves high-frequency mission caches), and cache integrity verification (re-hashing cached results on retrieval to ensure they match the stored hash, with automatic invalidation if tampering is detected). The system also supports manual cache invalidation: operators can invalidate specific cache entries when the underlying mission logic changes, ensuring that updated workflows are always re-executed."
      ]
    },
    {
      "heading": "Supply Chain Integrity and Verification",
      "paragraphs": [
        "Artifact hashing provides supply-chain integrity verification: each artifact's hash can be compared against an expected hash to detect tampering or corruption. This is essential for regulated industries (financial services, healthcare, government) where the origin and integrity of generated code must be provable for compliance with standards such as SOX, HIPAA, and GDPR. The system supports: hash comparison (compute the SHA-256 hash of an artifact and compare it against an expected hash, reporting match/mismatch), hash provenance (track which mission produced each artifact, including mission ID, operator, timestamp, and rationale), and signed attestations (Merkle root hashes of the mission hash chain signed by the organization's key for external verification and third-party audits).",
        "The system also integrates with SLSA (Supply-chain Levels for Software Artifacts) provenance: the mission's hash chain is included in SLSA attestations, providing cryptographic proof that the artifact was generated by a verified pipeline and has not been modified since generation. SLSA levels (1-3) describe increasing degrees of supply chain integrity, from basic build provenance to fully verified build and test pipelines. This enables compliance with standards requiring end-to-end supply chain integrity, and provides a clear upgrade path from minimal to comprehensive supply chain guarantees.",
        "Organizations can publish signed attestations as part of their CI/CD pipeline, providing customers and regulators with cryptographic assurance that the artifacts they receive (compiled binaries, generated test suites, Docker images) were produced by a verified pipeline. The attestations include: the SLSA level achieved, the mission hash chain, the pipeline configuration (build steps, test commands, verification gates), and the organization's signature. These attestations can be verified by any party with the organization's public key, enabling third-party assurance without requiring trust in the organization's word alone."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is artifact hashing?",
      "answer": "Cryptographic SHA-256 fingerprinting of all inputs, intermediate diffs, tool outputs, and produced binary artifacts, enabling deterministic caching, instant replay, and supply chain integrity verification. Each artifact (model prompt, tool invocation argument, file diff, compiled binary, generated test suite) is assigned a SHA-256 hash that serves as a unique fingerprint."
    },
    {
      "question": "How does deterministic caching work?",
      "answer": "Uses artifact hashes to cache results: same inputs (same hash) return cached results without re-execution, providing cost and time savings for repetitive tasks like recurring refactorings, periodic security scans, and daily build verifications. Cache performance metrics (hit rate, miss rate, latency improvement) are displayed on the observability dashboard."
    },
    {
      "question": "How does instant replay work?",
      "answer": "Uses the end-to-end mission hash to reconstruct a previous mission's exact state: agent context at each point, tool invocations and their results (including error messages and API responses), verification outcomes (type check pass/fail, unit test results, lint violations), and the final file state (which files were modified and what changes were made). Operators can step through the replayed mission interactively for analysis."
    },
    {
      "question": "What supply chain integrity measures exist?",
      "answer": "Hash comparison against expected values, hash provenance tracking (which mission produced each artifact including mission ID, operator, timestamp, and rationale), and signed attestations (Merkle root hashes of the mission hash chain signed by the organization's key for external verification and third-party audits)."
    },
    {
      "question": "Can caching cause stale results?",
      "answer": "Yes. The system supports cache expiration (stale entries are automatically invalidated after a configurable TTL, typically 24 hours for development workloads and 7 days for production), LRU eviction when the cache reaches its configured size limit with priority-based eviction that preserves high-frequency mission caches, and re-hashing on retrieval to ensure cached results match stored hashes with automatic invalidation if tampering is detected."
    },
    {
      "question": "What SLSA levels does the system support?",
      "answer": "The system supports SLSA levels 1-3, from basic build provenance to fully verified build and test pipelines with signed attestations. Higher levels provide stronger supply chain integrity guarantees, and the system provides a clear upgrade path from minimal to comprehensive supply chain guarantees."
    },
    {
      "question": "How are signed attestations verified?",
      "answer": "Signed attestations include the SLSA level achieved, the mission hash chain, the pipeline configuration (build steps, test commands, verification gates), and the organization's signature. They can be verified by any party with the organization's public key, enabling third-party assurance without trusting the organization's word alone."
    },
    {
      "question": "How does end-to-end mission hashing differ from artifact-level hashing?",
      "answer": "End-to-end mission hashing produces a single SHA-256 hash of the complete mission state (from start to finish), capturing all inputs, outputs, verification results, state transitions, and approval interactions. This differs from artifact-level hashing, which produces individual hashes for each artifact (inputs, diffs, tool outputs, binaries). End-to-end hashing enables instant replay of the entire mission, while artifact-level hashing enables deterministic caching and per-artifact integrity verification."
    },
    {
      "question": "What are the cache expiration and size management policies?",
      "answer": "Cache expiration uses TTL (typically 24 hours for development, 7 days for production). LRU eviction is used when the cache reaches its configured size limit, with priority-based eviction that preserves high-frequency mission caches. Manual cache invalidation is also supported when the underlying mission logic changes, ensuring updated workflows are always re-executed. The system also supports cache warm-start: on restart, frequently-accessed caches are pre-loaded to minimize miss rates."
    },
    {
      "question": "Can artifact hashing be used for compliance with regulatory standards?",
      "answer": "Yes. Artifact hashing provides supply-chain integrity verification essential for regulated industries (financial services, healthcare, government) where the origin and integrity of generated code must be provable for compliance with standards such as SOX, HIPAA, and GDPR. The system supports SLSA (Supply-chain Levels for Software Artifacts) provenance, where the mission's hash chain is included in SLSA attestations providing cryptographic proof that the artifact was generated by a verified pipeline and has not been modified since generation. Organizations can publish signed attestations as part of their CI/CD pipeline, providing customers and regulators with cryptographic assurance that the artifacts they receive (compiled binaries, generated test suites, Docker images) were produced by a verified pipeline."
    },
    {
      "question": "How does the system integrate with SLSA provenance?",
      "answer": "The mission's hash chain is included in SLSA attestations, providing cryptographic proof that the artifact was generated by a verified pipeline and has not been modified since generation. SLSA levels 1-3 describe increasing degrees of supply chain integrity, from basic build provenance to fully verified build and test pipelines. Organizations can publish signed attestations as part of their CI/CD pipeline, providing customers and regulators with cryptographic assurance that artifacts were produced by a verified pipeline. The attestations include: the SLSA level achieved, the mission hash chain, the pipeline configuration (build steps, test commands, verification gates), and the organization's signature. These attestations can be verified by any party with the organization's public key, enabling third-party assurance without requiring trust in the organization's word alone."
    }

  ]
};
