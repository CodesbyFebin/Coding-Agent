"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTRY = void 0;
exports.getEditorial = getEditorial;
exports.isContentIndexable = isContentIndexable;
exports.completedEditorialCount = completedEditorialCount;
var types_1 = require("./types");
var agent_cost_governance_ts_1 = require("./editorials/agent-cost-governance.ts");
var agent_memory_architecture_ts_1 = require("./editorials/agent-memory-architecture.ts");
var agent_observability_ts_1 = require("./editorials/agent-observability.ts");
var agent_sandboxing_ts_1 = require("./editorials/agent-sandboxing.ts");
var agent_skills_versioning_ts_1 = require("./editorials/agent-skills-versioning.ts");
var agent_state_machines_ts_1 = require("./editorials/agent-state-machines.ts");
var agentic_engineering_ts_1 = require("./editorials/agentic-engineering.ts");
var ai_agent_security_ts_1 = require("./editorials/ai-agent-security.ts");
var ai_coding_agents_ts_1 = require("./editorials/ai-coding-agents.ts");
var air_gapped_agents_ts_1 = require("./editorials/air-gapped-agents.ts");
var approval_policy_design_ts_1 = require("./editorials/approval-policy-design.ts");
var artifact_hashing_ts_1 = require("./editorials/artifact-hashing.ts");
var audit_logs_provenance_ts_1 = require("./editorials/audit-logs-provenance.ts");
var audit_ready_engineering_ts_1 = require("./editorials/audit-ready-engineering.ts");
var bidirectional_mcp_ts_1 = require("./editorials/bidirectional-mcp.ts");
var browser_verification_ts_1 = require("./editorials/browser-verification.ts");
var build_verification_ts_1 = require("./editorials/build-verification.ts");
var building_mcp_integrations_ts_1 = require("./editorials/building-mcp-integrations.ts");
var cicd_pipeline_agents_ts_1 = require("./editorials/cicd-pipeline-agents.ts");
var codingagent_app_ts_1 = require("./editorials/codingagent-app.ts");
var codingagent_architecture_ts_1 = require("./editorials/codingagent-architecture.ts");
var codingagent_blog_ts_1 = require("./editorials/codingagent-blog.ts");
var codingagent_devops_pipelines_ts_1 = require("./editorials/codingagent-devops-pipelines.ts");
var codingagent_docs_ts_1 = require("./editorials/codingagent-docs.ts");
var codingagent_guides_ts_1 = require("./editorials/codingagent-guides.ts");
var codingagent_hallucination_defense_ts_1 = require("./editorials/codingagent-hallucination-defense.ts");
var codingagent_india_sovereign_ts_1 = require("./editorials/codingagent-india-sovereign.ts");
var codingagent_indic_workflows_ts_1 = require("./editorials/codingagent-indic-workflows.ts");
var codingagent_knowledge_graph_ts_1 = require("./editorials/codingagent-knowledge-graph.ts");
var codingagent_model_governance_ts_1 = require("./editorials/codingagent-model-governance.ts");
var codingagentDpdpCompliance_ts_1 = require("./editorials/codingagentDpdpCompliance.ts");
var codingagentFullstackTypescript_ts_1 = require("./editorials/codingagentFullstackTypescript.ts");
var codingagentInrPricing_ts_1 = require("./editorials/codingagentInrPricing.ts");
var codingagentOrganizationPolicy_ts_1 = require("./editorials/codingagentOrganizationPolicy.ts");
var codingagentPrivateDeployment_ts_1 = require("./editorials/codingagentPrivateDeployment.ts");
var codingagentPythonDataScience_ts_1 = require("./editorials/codingagentPythonDataScience.ts");
var codingagentRoleBasedAccess_ts_1 = require("./editorials/codingagentRoleBasedAccess.ts");
var codingagentTerminalBenchmarks_ts_1 = require("./editorials/codingagentTerminalBenchmarks.ts");
var codingagentTokenOptimization_ts_1 = require("./editorials/codingagentTokenOptimization.ts");
var codingagentUseCases_ts_1 = require("./editorials/codingagentUseCases.ts");
var context_compaction_ts_1 = require("./editorials/context-compaction.ts");
var core_agents_ts_1 = require("./editorials/core-agents.ts");
var developer_cli_ts_1 = require("./editorials/developer-cli.ts");
var dpdp_compliance_ts_1 = require("./editorials/dpdp-compliance.ts");
var durable_runtimes_ts_1 = require("./editorials/durable-runtimes.ts");
var enterprise_agents_ts_1 = require("./editorials/enterprise-agents.ts");
var enterprise_tooling_ts_1 = require("./editorials/enterprise-tooling.ts");
var gguf_workflows_ts_1 = require("./editorials/gguf-workflows.ts");
var hallucination_defense_ts_1 = require("./editorials/hallucination-defense.ts");
var human_approval_gates_ts_1 = require("./editorials/human-approval-gates.ts");
var ide_integrations_ts_1 = require("./editorials/ide-integrations.ts");
var independent_verification_ts_1 = require("./editorials/independent-verification.ts");
var inr_pricing_billing_ts_1 = require("./editorials/inr-pricing-billing.ts");
var llama_cpp_runtimes_ts_1 = require("./editorials/llama-cpp-runtimes.ts");
var lm_studio_ts_1 = require("./editorials/lm-studio.ts");
var local_llm_coding_ts_1 = require("./editorials/local-llm-coding.ts");
var mcp_authentication_ts_1 = require("./editorials/mcp-authentication.ts");
var mcp_client_architecture_ts_1 = require("./editorials/mcp-client-architecture.ts");
var mcp_integrations_ts_1 = require("./editorials/mcp-integrations.ts");
var mcp_permissions_ts_1 = require("./editorials/mcp-permissions.ts");
var mcp_security_ts_1 = require("./editorials/mcp-security.ts");
var mcp_server_architecture_ts_1 = require("./editorials/mcp-server-architecture.ts");
var mcp_tool_discovery_ts_1 = require("./editorials/mcp-tool-discovery.ts");
var mcp_transport_ts_1 = require("./editorials/mcp-transport.ts");
var model_context_protocol_ts_1 = require("./editorials/model-context-protocol.ts");
var network_egress_controls_ts_1 = require("./editorials/network-egress-controls.ts");
var offline_embeddings_ts_1 = require("./editorials/offline-embeddings.ts");
var ollama_integration_ts_1 = require("./editorials/ollama-integration.ts");
var parallel_subagents_ts_1 = require("./editorials/parallel-subagents.ts");
var plan_execute_verify_ts_1 = require("./editorials/plan-execute-verify.ts");
var production_operations_ts_1 = require("./editorials/production-operations.ts");
var prompt_injection_defenses_ts_1 = require("./editorials/prompt-injection-defenses.ts");
var quantized_models_ts_1 = require("./editorials/quantized-models.ts");
var repository_permissions_ts_1 = require("./editorials/repository-permissions.ts");
var secrets_isolation_ts_1 = require("./editorials/secrets-isolation.ts");
var secure_mcp_servers_ts_1 = require("./editorials/secure-mcp-servers.ts");
var secure_tool_calling_ts_1 = require("./editorials/secure-tool-calling.ts");
var security_sovereignty_ts_1 = require("./editorials/security-sovereignty.ts");
var task_graphs_ts_1 = require("./editorials/task-graphs.ts");
var typecheck_verification_ts_1 = require("./editorials/typecheck-verification.ts");
var unit_test_verification_ts_1 = require("./editorials/unit-test-verification.ts");
var verification_memory_ts_1 = require("./editorials/verification-memory.ts");
var vllm_serving_ts_1 = require("./editorials/vllm-serving.ts");
var vram_aware_routing_ts_1 = require("./editorials/vram-aware-routing.ts");
var working_mission_memory_ts_1 = require("./editorials/working-mission-memory.ts");
exports.REGISTRY = {
    'agent-cost-governance': agent_cost_governance_ts_1.agentCostGovernance,
    'agent-memory-architecture': agent_memory_architecture_ts_1.agentMemoryArchitecture,
    'agent-observability': agent_observability_ts_1.agentObservability,
    'agent-sandboxing': agent_sandboxing_ts_1.agentSandboxing,
    'agent-skills-versioning': agent_skills_versioning_ts_1.agentSkillsVersioning,
    'agent-state-machines': agent_state_machines_ts_1.agentStateMachines,
    'agentic-engineering': agentic_engineering_ts_1.agenticEngineering,
    'ai-agent-security': ai_agent_security_ts_1.aiAgentSecurity,
    'ai-coding-agents': ai_coding_agents_ts_1.aiCodingAgents,
    'air-gapped-agents': air_gapped_agents_ts_1.airGappedAgents,
    'approval-policy-design': approval_policy_design_ts_1.approvalPolicyDesign,
    'artifact-hashing': artifact_hashing_ts_1.artifactHashing,
    'audit-logs-provenance': audit_logs_provenance_ts_1.auditLogsProvenance,
    'audit-ready-engineering': audit_ready_engineering_ts_1.auditReadyEngineering,
    'bidirectional-mcp': bidirectional_mcp_ts_1.bidirectionalMcp,
    'browser-verification': browser_verification_ts_1.browserVerification,
    'build-verification': build_verification_ts_1.buildVerification,
    'building-mcp-integrations': building_mcp_integrations_ts_1.buildingMcpIntegrations,
    'cicd-pipeline-agents': cicd_pipeline_agents_ts_1.cicdPipelineAgents,
    'codingagent-app': codingagent_app_ts_1.codingagentApp,
    'codingagent-architecture': codingagent_architecture_ts_1.codingagentArchitecture,
    'codingagent-blog': codingagent_blog_ts_1.codingBlog,
    'codingagent-devops-pipelines': codingagent_devops_pipelines_ts_1.codingagentDevopsPipelines,
    'codingagent-docs': codingagent_docs_ts_1.codingagentDocs,
    'codingagent-guides': codingagent_guides_ts_1.codingagentGuides,
    'codingagent-hallucination-defense': codingagent_hallucination_defense_ts_1.codingagentHallucinationDefense,
    'codingagent-india-sovereign': codingagent_india_sovereign_ts_1.codingagentIndiaSovereign,
    'codingagent-indic-workflows': codingagent_indic_workflows_ts_1.codingagentIndicWorkflows,
    'codingagent-knowledge-graph': codingagent_knowledge_graph_ts_1.codingagentKnowledgeGraph,
    'model-governance': codingagent_model_governance_ts_1.codingagentModelGovernance,
    'codingagent-dpdp-compliance': codingagentDpdpCompliance_ts_1.codingagentDpdpCompliance,
    'codingagent-fullstack-typescript': codingagentFullstackTypescript_ts_1.codingagentFullstackTypescript,
    'codingagent-inr-pricing': codingagentInrPricing_ts_1.codingagentInrpricing,
    'organization-policy': codingagentOrganizationPolicy_ts_1.codingagentOrganizationPolicy,
    'private-deployment': codingagentPrivateDeployment_ts_1.codingagentPrivateDeployment,
    'codingagent-python-data-science': codingagentPythonDataScience_ts_1.codingagentPythonDataScience,
    'role-based-access': codingagentRoleBasedAccess_ts_1.codingagentRoleBasedAccess,
    'codingagent-terminal-benchmarks': codingagentTerminalBenchmarks_ts_1.codingagentTerminalBenchmarks,
    'codingagent-token-optimization': codingagentTokenOptimization_ts_1.codingagentTokenOptimization,
    'codingagent-use-cases': codingagentUseCases_ts_1.codingagentUseCases,
    'context-compaction': context_compaction_ts_1.contextCompaction,
    'core-agents': core_agents_ts_1.coreAgents,
    'developer-cli': developer_cli_ts_1.developerCli,
    'dpdp-compliance': dpdp_compliance_ts_1.dpdpCompliance,
    'durable-runtimes': durable_runtimes_ts_1.durableRuntimes,
    'enterprise-agents': enterprise_agents_ts_1.enterpriseAgents,
    'enterpriseTooling': enterprise_tooling_ts_1.enterpriseTooling,
    'gguf-workflows': gguf_workflows_ts_1.ggufWorkflows,
    'hallucination-defense': hallucination_defense_ts_1.hallucinationDefense,
    'human-approval-gates': human_approval_gates_ts_1.humanApprovalGates,
    'ide-integrations': ide_integrations_ts_1.ideIntegrations,
    'independent-verification': independent_verification_ts_1.independentVerification,
    'inr-pricing-billing': inr_pricing_billing_ts_1.inrPricingBilling,
    'llama-cpp-runtimes': llama_cpp_runtimes_ts_1.llamaCppRuntimes,
    'lm-studio': lm_studio_ts_1.lmStudio,
    'local-llm-coding': local_llm_coding_ts_1.localLlmCoding,
    'mcp-authentication': mcp_authentication_ts_1.mcpAuthentication,
    'mcp-client-architecture': mcp_client_architecture_ts_1.mcpClientArchitecture,
    'mcp-integrations': mcp_integrations_ts_1.mcpIntegrations,
    'mcp-permissions': mcp_permissions_ts_1.mcpPermissions,
    'mcp-security': mcp_security_ts_1.mcpSecurity,
    'mcp-server-architecture': mcp_server_architecture_ts_1.mcpServerArchitecture,
    'mcp-tool-discovery': mcp_tool_discovery_ts_1.mcpToolDiscovery,
    'mcp-transport': mcp_transport_ts_1.mcpTransport,
    'model-context-protocol': model_context_protocol_ts_1.modelContextProtocol,
    'network-egress-controls': network_egress_controls_ts_1.networkEgressControls,
    'offline-embeddings': offline_embeddings_ts_1.offlineEmbeddings,
    'ollama-integration': ollama_integration_ts_1.ollamaIntegration,
    'parallel-subagents': parallel_subagents_ts_1.parallelSubagents,
    'plan-execute-verify': plan_execute_verify_ts_1.planExecuteVerify,
    'production-operations': production_operations_ts_1.productionOperations,
    'prompt-injection-defenses': prompt_injection_defenses_ts_1.promptInjectionDefenses,
    'quantized-models': quantized_models_ts_1.quantizedModels,
    'repository-permissions': repository_permissions_ts_1.repositoryPermissions,
    'secrets-isolation': secrets_isolation_ts_1.secretsIsolation,
    'secure-mcp-servers': secure_mcp_servers_ts_1.secureMcpServers,
    'secure-tool-calling': secure_tool_calling_ts_1.secureToolCalling,
    'security-sovereignty': security_sovereignty_ts_1.securitySovereignty,
    'task-graphs': task_graphs_ts_1.taskGraphs,
    'typecheck-verification': typecheck_verification_ts_1.typecheckVerification,
    'unit-test-verification': unit_test_verification_ts_1.unitTestVerification,
    'verification-memory': verification_memory_ts_1.verificationMemory,
    'vllm-serving': vllm_serving_ts_1.vllmServing,
    'vram-aware-routing': vram_aware_routing_ts_1.vramAwareRouting,
    'working-mission-memory': working_mission_memory_ts_1.workingMissionMemory,
};
// Helper functions for accessing registry data
function getEditorial(pillarId) {
    return exports.REGISTRY[pillarId];
}
function isContentIndexable(pillarId) {
    var editorial = getEditorial(pillarId);
    return !!editorial && (0, types_1.wordCount)(editorial) >= 2000;
}
function completedEditorialCount() {
    return Object.values(exports.REGISTRY).filter(function (editorial) {
        return (0, types_1.wordCount)(editorial) >= 2000;
    }).length;
}
