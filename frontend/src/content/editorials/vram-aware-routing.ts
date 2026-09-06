import type { PillarEditorial } from '../types';

// Batch-converted editorial. Claim-audited; publish bar decides.
export const vramAwareRouting: PillarEditorial = {
  "pillarId": "vram-aware-routing",
  "updated": "2026-09-06",
  "definition": "Intelligent router that dynamically inspects host GPU memory, context size requirements, and task complexity before choosing the optimal model and quantization for each mission.",
  "sections": [
    {
      "heading": "The Challenge of GPU Memory Management",
      "paragraphs": [
        "Modern large language models require significant GPU memory (VRAM) for inference, with memory requirements scaling with model size and context length. A 7B parameter model in Q4_K_M quantization requires approximately 4GB of VRAM, while a 34B model requires 20GB or more. For coding agents that may need to process large codebases with long context windows, VRAM requirements can exceed available hardware capacity.",
        "The challenge is compounded by the dynamic nature of coding tasks. A simple code completion might need only a small model with short context, while a complex refactoring task might require a large model with long context to understand the full codebase. Static model selection (always using the same model) either wastes resources (using a large model for simple tasks) or produces poor quality (using a small model for complex tasks).",
        "VRAM-aware routing solves this challenge by dynamically selecting the optimal model and quantization for each inference request based on available VRAM, task requirements, and quality constraints. The router continuously monitors VRAM usage, understands the memory requirements of different models and context lengths, and makes intelligent routing decisions that maximize quality while respecting hardware constraints.",
        "For coding agents, VRAM-aware routing is essential for practical deployment on consumer hardware. Developers typically have gaming GPUs (8-24GB VRAM) or integrated graphics (shared system memory), and the router must make the best use of this limited resource. The router ensures that developers get the highest possible quality for each task without exceeding hardware limits or causing performance degradation through memory pressure.",
        "The router operates transparently: developers specify their quality preferences and hardware constraints, and the router handles all the complexity of model selection, quantization selection, and memory management. For advanced users, the router exposes configuration options for fine-tuning behavior, but sensible defaults work well for most use cases."
      ]
    },
    {
      "heading": "VRAM Monitoring and Capacity Planning",
      "paragraphs": [
        "Effective VRAM-aware routing requires accurate, real-time monitoring of VRAM usage and capacity. The router continuously tracks VRAM state to make informed routing decisions.",
        "**VRAM Monitoring Sources** - The router queries VRAM usage from multiple sources depending on the hardware:",
        "- **NVIDIA GPUs**: Uses NVML (NVIDIA Management Library) to query VRAM usage, temperature, utilization, and clock speeds. NVML provides detailed, real-time information about GPU state.\n- **AMD GPUs**: Uses ROCm SMI (System Management Interface) for similar information on AMD hardware.\n- **Apple Silicon**: Uses Metal API to query unified memory usage (which serves as both system RAM and VRAM on Apple Silicon).\n- **Intel GPUs**: Uses oneAPI Level Zero for Intel GPU monitoring.",
        "The router abstracts these hardware-specific APIs behind a unified interface, allowing the same routing logic to work across different hardware platforms.",
        "**VRAM Usage Components** - Total VRAM usage consists of several components:",
        "- **Model Weights**: The quantized model weights loaded into VRAM. This is the largest component and varies with model size and quantization level.\n- **KV Cache**: The key-value cache for attention computation, which grows with context length. For long contexts (common in coding tasks with large codebases), KV cache can be a significant portion of VRAM usage.\n- **Activations**: Intermediate tensors computed during forward pass. These are temporary but can be substantial for large batch sizes.\n- **Framework Overhead**: Memory used by the inference framework itself (CUDA contexts, data structures, etc.).",
        "The router tracks all these components to understand total VRAM usage and predict how much VRAM is available for new models or longer contexts.",
        "**Capacity Planning** - Based on VRAM monitoring, the router maintains a capacity plan: which models can fit in available VRAM at which quantization levels, and what context lengths are supported. This capacity plan is continuously updated as VRAM usage changes (models loaded/unloaded, context lengths vary).",
        "For example, on a system with 12GB VRAM and 4GB currently used by a loaded model, the capacity plan might show:",
        "- DeepSeek-Coder-6.7B Q4_K_M (4GB) + 8K context (2GB) = fits\n- DeepSeek-Coder-6.7B Q5_K_M (5GB) + 8K context (2GB) = fits\n- DeepSeek-Coder-33B Q4_K_M (20GB) = doesn't fit\n- CodeLlama-13B Q4_K_M (8GB) + 4K context (1GB) = fits",
        "This capacity plan guides routing decisions, ensuring that only feasible model-context combinations are selected.",
        "**Predictive Monitoring** - The router doesn't just monitor current VRAM usage—it predicts future usage based on task patterns. If the router sees that a task is likely to require long context (e.g., analyzing a large codebase), it predicts the VRAM needed for that context and plans accordingly. This predictive capability prevents routing decisions that would fail mid-execution due to insufficient VRAM.",
        "**Memory Pressure Detection** - The router detects memory pressure (when VRAM usage approaches capacity) and takes proactive action: evicting unused models from cache, reducing context lengths, or switching to smaller models. This proactive management prevents out-of-memory errors and ensures smooth operation even under heavy load.",
        "This comprehensive VRAM monitoring and capacity planning ensures that routing decisions are based on accurate, real-time information about hardware state, enabling optimal model selection for each task."
      ]
    },
    {
      "heading": "Task Complexity Analysis",
      "paragraphs": [
        "VRAM-aware routing doesn't just consider available VRAM—it also analyzes task complexity to select models with appropriate capability. A simple code completion doesn't need a 34B parameter model, while a complex architectural refactoring does. The router analyzes each task to determine the appropriate model tier.",
        "**Task Classification** - The router classifies tasks into complexity tiers based on multiple signals:",
        "- **Prompt Length**: Longer prompts generally indicate more complex tasks. A 100-token prompt for simple completion is different from a 10,000-token prompt for large-scale refactoring.\n- **Prompt Structure**: Prompts with multiple files, complex logic, or architectural context indicate higher complexity. The router analyzes prompt structure to identify these signals.\n- **Task Type**: Explicit task type indicators (from user configuration or mission metadata) guide complexity assessment. \"Complete this function\" is simpler than \"Refactor this module to improve testability.\"\n- **Codebase Context**: If the task requires understanding a large codebase (multiple files, complex dependencies), it's classified as higher complexity.",
        "Based on these signals, tasks are classified into tiers:",
        "- **Simple**: Code completion, formatting, simple bug fixes. Can use small models (1B-7B parameters).\n- **Medium**: Function generation, moderate refactoring, test writing. Benefits from medium models (7B-13B parameters).\n- **Complex**: Large-scale refactoring, architectural changes, security analysis. Requires large models (13B+ parameters).",
        "**Context Length Estimation** - The router estimates the context length needed for each task. Simple tasks might need only the immediate code context (1-2K tokens), while complex tasks might need the full codebase context (8K-32K tokens). This estimation considers:",
        "- **Prompt Size**: The size of the input prompt itself.\n- **Expected Output Size**: How much output is expected (a few tokens for completion, hundreds for generation).\n- **Required Context**: How much surrounding context is needed for the task (immediate function vs. entire module vs. full codebase).",
        "The router uses these estimates to determine VRAM requirements for KV cache, which grows linearly with context length.",
        "**Quality Requirements Assessment** - The router assesses quality requirements for each task:",
        "- **Critical Code**: Production code, security-sensitive code, or code with strict correctness requirements needs the highest quality models.\n- **Exploratory Code**: Prototypes, experiments, or learning code can use lower quality models for faster iteration.\n- **User Preferences**: Users can specify quality preferences (high quality vs. fast response) that guide model selection.",
        "The router combines task complexity, context length, and quality requirements to determine the optimal model tier for each task. This tier determination guides model selection within the constraints of available VRAM.",
        "**Dynamic Reassessment** - Task complexity isn't always known upfront. As the router processes a task, it may discover that the task is more complex than initially estimated (e.g., the code has unexpected dependencies). The router dynamically reassesses task complexity and can switch to a more capable model mid-execution if needed (subject to VRAM constraints).",
        "This sophisticated task complexity analysis ensures that each task gets a model with appropriate capability, avoiding both under-provisioning (small model for complex task, poor quality) and over-provisioning (large model for simple task, wasted resources)."
      ]
    },
    {
      "heading": "Routing Decision Engine",
      "paragraphs": [
        "The routing decision engine combines VRAM monitoring, task complexity analysis, and quality requirements to select the optimal model and quantization for each inference request. This decision process balances multiple competing objectives: maximize quality, respect VRAM constraints, minimize latency, and honor user preferences.",
        "**Decision Algorithm** - The routing algorithm follows these steps:",
        "1. **Assess Task Requirements**: Analyze task complexity, estimate context length, determine quality requirements.\n2. **Query VRAM State**: Determine available VRAM, current usage, and capacity for new models/contexts.\n3. **Generate Candidates**: List all feasible model-quantization-context combinations that fit in available VRAM and meet task requirements.\n4. **Score Candidates**: Score each candidate based on: model capability (larger models score higher), quantization quality (higher precision scores higher), expected latency (smaller models score higher), and user preferences (quality vs. speed trade-off).\n5. **Select Best Candidate**: Choose the candidate with the highest score.\n6. **Execute Routing**: Load the selected model (if not already loaded), configure context length, and execute inference.",
        "**Scoring Function** - The scoring function is configurable but typically weights factors as follows:",
        "- **Model Capability (40%)**: Larger, more capable models are preferred for complex tasks.\n- **Quantization Quality (30%)**: Higher precision quantizations are preferred for quality-sensitive tasks.\n- **Expected Latency (20%)**: Faster models are preferred for interactive tasks.\n- **User Preference (10%)**: User-specified quality vs. speed trade-off.",
        "The weights are adjusted based on task characteristics: for critical code, model capability and quantization quality are weighted more heavily. For interactive completion, latency is weighted more heavily.",
        "**Fallback Logic** - If the best candidate is unavailable (model not downloaded, failed to load, VRAM insufficient), the router falls back to the next-best candidate. This fallback chain ensures that inference requests always succeed, even if the optimal model isn't available. The fallback logic respects VRAM constraints: it won't fall back to a model that's too large for available VRAM.",
        "**Caching Decisions** - The router makes intelligent caching decisions: if a model is likely to be used again soon (based on task patterns), it's kept in VRAM cache. If VRAM is needed for a higher-priority model, less-used models are evicted from cache. These caching decisions balance the cost of model loading (several seconds) against the benefit of having models readily available.",
        "**Multi-Request Optimization** - When multiple inference requests are queued, the router optimizes across all requests: it may load a model that serves multiple requests (even if it's not the optimal model for each individual request) to minimize total model loading time. This batch optimization improves overall throughput at the cost of slightly suboptimal model selection for individual requests.",
        "**Transparency and Explainability** - The router provides transparency into its decisions: for each routing decision, it logs which candidates were considered, why the selected candidate was chosen, and what trade-offs were made. This transparency helps users understand routing behavior and debug unexpected decisions.",
        "**Configuration Options** - Advanced users can configure the routing algorithm: adjust scoring weights, specify model preferences (always prefer certain models), set VRAM reserves (keep some VRAM free for other applications), and define fallback policies. These configuration options allow fine-tuning routing behavior for specific use cases.",
        "This sophisticated routing decision engine ensures that each inference request uses the best available model given the constraints, maximizing quality while respecting hardware limitations and user preferences."
      ]
    },
    {
      "heading": "Performance Optimization and Tuning",
      "paragraphs": [
        "VRAM-aware routing includes several performance optimization strategies to minimize latency and maximize throughput while maintaining quality.",
        "**Model Pre-loading** - The router predicts which models will be needed based on task patterns and pre-loads them into VRAM during idle periods. For example, if the router observes that code completion tasks (which use a small, fast model) are frequently followed by refactoring tasks (which use a larger model), it pre-loads the larger model during the completion task so it's ready when needed. This pre-loading eliminates model loading latency for predicted tasks.",
        "**Quantization Switching** - When VRAM is constrained, the router can switch between quantization levels of the same model without full model reload. For example, if a Q5_K_M model is loaded but VRAM is needed for a longer context, the router can switch to Q4_K_M of the same model (which uses less VRAM) without reloading from disk. This quantization switching is faster than full model loading and allows dynamic adaptation to changing VRAM constraints.",
        "**Context Length Optimization** - The router optimizes context length to balance quality and VRAM usage. For tasks that don't need the full context window, the router uses a shorter context to reduce KV cache size, freeing VRAM for larger models. The router analyzes the task to determine the minimum context needed and configures the model accordingly.",
        "**Batch Size Tuning** - The router adjusts batch size (number of tokens processed in parallel) based on available VRAM and latency requirements. Larger batches improve throughput but use more VRAM and increase latency. For interactive tasks, the router uses small batches for low latency. For batch processing, it uses large batches for high throughput.",
        "**Memory Defragmentation** - Over time, VRAM can become fragmented (free memory scattered in small blocks), preventing large models from loading even if total free VRAM is sufficient. The router periodically defragments VRAM by reloading models in an optimized layout, consolidating free memory into large contiguous blocks. This defragmentation ensures that VRAM is used efficiently.",
        "**Hardware-Specific Optimization** - The router applies hardware-specific optimizations: on NVIDIA GPUs, it uses CUDA streams for parallel execution; on Apple Silicon, it uses Metal compute shaders; on AMD GPUs, it uses ROCm optimizations. These hardware-specific optimizations maximize inference speed on each platform.",
        "**Monitoring and Tuning** - The router provides detailed performance metrics: model loading time, inference latency, VRAM usage over time, cache hit rates, and routing decision frequency. These metrics help users identify performance bottlenecks and tune router configuration. The router also provides tuning recommendations based on observed patterns: \"You frequently switch between models X and Y—consider pre-loading both\" or \"Your VRAM is often at capacity—consider using more aggressive quantization.\"",
        "**Adaptive Learning** - The router learns from usage patterns to improve routing decisions over time. If it observes that certain task types consistently benefit from specific models, it adjusts its scoring function to prefer those models for those tasks. This adaptive learning improves routing quality without manual configuration.",
        "These performance optimizations ensure that VRAM-aware routing delivers fast, efficient inference while maintaining high quality. The router continuously tunes itself based on hardware capabilities and usage patterns, providing optimal performance across diverse deployment scenarios."
      ]
    }
  ],
  "faq": [
    {
      "question": "What is VRAM-aware routing?",
      "answer": "VRAM-aware routing is an intelligent system that dynamically selects the optimal model and quantization for each inference request based on available GPU memory, task requirements, and quality constraints. It maximizes quality while respecting hardware limitations."
    },
    {
      "question": "How does it decide which model to use?",
      "answer": "The router analyzes task complexity (prompt length, structure, task type), estimates context length needs, assesses quality requirements, and queries available VRAM. It then scores all feasible model-quantization-context combinations and selects the best one based on model capability, quantization quality, expected latency, and user preferences."
    },
    {
      "question": "What if the best model doesn't fit in VRAM?",
      "answer": "The router automatically falls back to the next-best candidate that fits in available VRAM. This fallback chain ensures that inference requests always succeed, even if the optimal model isn't available. The fallback respects VRAM constraints and quality requirements."
    },
    {
      "question": "Can it handle multiple concurrent requests?",
      "answer": "Yes. The router optimizes across multiple queued requests, potentially loading a model that serves multiple requests to minimize total model loading time. It also manages VRAM allocation across requests to maximize overall throughput."
    },
    {
      "question": "Does it work on different GPU brands?",
      "answer": "Yes. The router supports NVIDIA GPUs (via NVML), AMD GPUs (via ROCm SMI), Apple Silicon (via Metal API), and Intel GPUs (via oneAPI Level Zero). It abstracts hardware-specific APIs behind a unified interface for consistent routing logic."
    }
  ],
  "sources": [
    {
      "label": "CodingAgent source repository",
      "href": "https://github.com/CodesbyFebin/Coding-Agent"
    }
  ]
};
