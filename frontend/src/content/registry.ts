import type { PillarEditorial } from './types';
import { wordCount } from './types';
import { aiCodingAgents } from './editorials/ai-coding-agents';
import { agenticEngineering } from './editorials/agentic-engineering';
import { planExecuteVerify } from './editorials/plan-execute-verify';
import { taskGraphs } from './editorials/task-graphs';
import { agentStateMachines } from './editorials/agent-state-machines';
import { parallelSubagents } from './editorials/parallel-subagents';
import { humanApprovalGates } from './editorials/human-approval-gates';
import { agentObservability } from './editorials/agent-observability';
import { durableRuntimes } from './editorials/durable-runtimes';
import { productionOperations } from './editorials/production-operations';
import { modelContextProtocol } from './editorials/model-context-protocol';
import { ollamaIntegration } from './editorials/ollama-integration';
import { inrPricingBilling } from './editorials/inr-pricing-billing';
import { hallucinationDefense } from './editorials/hallucination-defense';
import { mcpClientArchitecture } from './editorials/mcp-client-architecture';
import { mcpServerArchitecture } from './editorials/mcp-server-architecture';
import { bidirectionalMcp } from './editorials/bidirectional-mcp';
import { mcpToolDiscovery } from './editorials/mcp-tool-discovery';
import { mcpPermissions } from './editorials/mcp-permissions';
import { mcpAuthentication } from './editorials/mcp-authentication';
import { mcpTransport } from './editorials/mcp-transport';
import { mcpSecurity } from './editorials/mcp-security';
import { buildingMcpIntegrations } from './editorials/building-mcp-integrations';
import { vllmServing } from './editorials/vllm-serving';
import { llamaCppRuntimes } from './editorials/llama-cpp-runtimes';
import { lmStudio } from './editorials/lm-studio';
import { ggufWorkflows } from './editorials/gguf-workflows';
import { quantizedModels } from './editorials/quantized-models';
import { vramAwareRouting } from './editorials/vram-aware-routing';
import { offlineEmbeddings } from './editorials/offline-embeddings';
import { airGappedAgents } from './editorials/air-gapped-agents';
import { coreAgents } from './editorials/core-agents';
import { approvalPolicyDesign } from './editorials/approval-policy-design';
import { artifactHashing } from './editorials/artifact-hashing';
import { auditLogsProvenance } from './editorials/audit-logs-provenance';
import { auditReadyEngineering } from './editorials/audit-ready-engineering';
import { agentMemoryArchitecture } from './editorials/agent-memory-architecture';
import { agentCostGovernance } from './editorials/agent-cost-governance';
import { agentSandboxing } from './editorials/agent-sandboxing';
import { aiAgentSecurity } from './editorials/ai-agent-security';
import { promptInjectionDefenses } from './editorials/prompt-injection-defenses';
import { secureToolCalling } from './editorials/secure-tool-calling';
import { networkEgressControls } from './editorials/network-egress-controls';
import { repositoryPermissions } from './editorials/repository-permissions';
import { verificationMemory } from './editorials/verification-memory';
import { buildVerification } from './editorials/build-verification';
import { typecheckVerification } from './editorials/typecheck-verification';
import { unitTestVerification } from './editorials/unit-test-verification';
import { browserVerification } from './editorials/browser-verification';
import { workingMissionMemory } from './editorials/working-mission-memory';
import { agentSkillsVersioning } from './editorials/agent-skills-versioning';
import { contextCompaction } from './editorials/context-compaction';
import { enterpriseTooling } from './editorials/enterprise-tooling';
import { enterpriseAgents } from './editorials/enterprise-agents';
import { organizationPolicy } from './editorials/organization-policy';
import { secureMcpServers } from './editorials/secure-mcp-servers';
import { codingagentDpdpCompliance } from './editorials/codingagentDpdpCompliance';
import { codingagentInrpricing as codingagentInrPricing } from './editorials/codingagentInrPricing';
import { codingagentIndicWorkflows } from './editorials/codingagent-indic-workflows';
import { codingagentHallucinationDefense } from './editorials/codingagent-hallucination-defense';
import { codingagentTokenOptimization } from './editorials/codingagentTokenOptimization';
import { codingagentPythonDataScience } from './editorials/codingagentPythonDataScience';
import { codingagentFullstackTypescript } from './editorials/codingagentFullstackTypescript';
import { codingagentDevopsPipelines } from './editorials/codingagent-devops-pipelines';
import { codingagentIndiaSovereign } from './editorials/codingagent-india-sovereign';
import { codingagentRoleBasedAccess as roleBasedAccess } from './editorials/codingagentRoleBasedAccess';
import { cicdPipelineAgents } from './editorials/cicd-pipeline-agents';
import { developerCli } from './editorials/developer-cli';
import { ideIntegrations } from './editorials/ide-integrations';
import { modelGovernance } from './editorials/model-governance';
import { privateDeployment } from './editorials/private-deployment';

// Registry of completed long-form editorials. A pillar page is only
// considered publishable (indexable, in the sitemap, in llms surfaces) when
// a substantive editorial exists here — the single indexability policy that
// every public discovery surface shares.
export const REGISTRY: Record<string, PillarEditorial> = {
  [agenticEngineering.pillarId]: agenticEngineering,
  [planExecuteVerify.pillarId]: planExecuteVerify,
  [taskGraphs.pillarId]: taskGraphs,
  [agentStateMachines.pillarId]: agentStateMachines,
  [parallelSubagents.pillarId]: parallelSubagents,
  [humanApprovalGates.pillarId]: humanApprovalGates,
  [agentObservability.pillarId]: agentObservability,
  [durableRuntimes.pillarId]: durableRuntimes,
  [productionOperations.pillarId]: productionOperations,
  [aiCodingAgents.pillarId]: aiCodingAgents,
  [modelContextProtocol.pillarId]: modelContextProtocol,
  [ollamaIntegration.pillarId]: ollamaIntegration,
  [inrPricingBilling.pillarId]: inrPricingBilling,
  [hallucinationDefense.pillarId]: hallucinationDefense,
  [mcpClientArchitecture.pillarId]: mcpClientArchitecture,
  [mcpServerArchitecture.pillarId]: mcpServerArchitecture,
  [bidirectionalMcp.pillarId]: bidirectionalMcp,
  [mcpToolDiscovery.pillarId]: mcpToolDiscovery,
  [mcpPermissions.pillarId]: mcpPermissions,
  [mcpAuthentication.pillarId]: mcpAuthentication,
  [mcpTransport.pillarId]: mcpTransport,
  [mcpSecurity.pillarId]: mcpSecurity,
  [buildingMcpIntegrations.pillarId]: buildingMcpIntegrations,
  [vllmServing.pillarId]: vllmServing,
  [llamaCppRuntimes.pillarId]: llamaCppRuntimes,
  [lmStudio.pillarId]: lmStudio,
  [ggufWorkflows.pillarId]: ggufWorkflows,
  [quantizedModels.pillarId]: quantizedModels,
  [vramAwareRouting.pillarId]: vramAwareRouting,
  [offlineEmbeddings.pillarId]: offlineEmbeddings,
  [airGappedAgents.pillarId]: airGappedAgents,
  [coreAgents.pillarId]: coreAgents,
  [approvalPolicyDesign.pillarId]: approvalPolicyDesign,
  [artifactHashing.pillarId]: artifactHashing,
  [auditLogsProvenance.pillarId]: auditLogsProvenance,
  [auditReadyEngineering.pillarId]: auditReadyEngineering,
  [agentMemoryArchitecture.pillarId]: agentMemoryArchitecture,
  [agentCostGovernance.pillarId]: agentCostGovernance,
  [agentSandboxing.pillarId]: agentSandboxing,
  [aiAgentSecurity.pillarId]: aiAgentSecurity,
  [promptInjectionDefenses.pillarId]: promptInjectionDefenses,
  [secureToolCalling.pillarId]: secureToolCalling,
  [networkEgressControls.pillarId]: networkEgressControls,
  [repositoryPermissions.pillarId]: repositoryPermissions,
  [verificationMemory.pillarId]: verificationMemory,
  [buildVerification.pillarId]: buildVerification,
  [codingagentFullstackTypescript.pillarId]: codingagentFullstackTypescript,
  [codingagentDevopsPipelines.pillarId]: codingagentDevopsPipelines,
  [typecheckVerification.pillarId]: typecheckVerification,
  [unitTestVerification.pillarId]: unitTestVerification,
  [browserVerification.pillarId]: browserVerification,
  [workingMissionMemory.pillarId]: workingMissionMemory,
  [agentSkillsVersioning.pillarId]: agentSkillsVersioning,
  [contextCompaction.pillarId]: contextCompaction,
  [enterpriseTooling.pillarId]: enterpriseTooling,
  [enterpriseAgents.pillarId]: enterpriseAgents,
  [organizationPolicy.pillarId]: organizationPolicy,
  [roleBasedAccess.pillarId]: roleBasedAccess,
  [secureMcpServers.pillarId]: secureMcpServers,
  [codingagentIndiaSovereign.pillarId]: codingagentIndiaSovereign,
  [cicdPipelineAgents.pillarId]: cicdPipelineAgents,
  [developerCli.pillarId]: developerCli,
  [ideIntegrations.pillarId]: ideIntegrations,
  [modelGovernance.pillarId]: modelGovernance,
  [privateDeployment.pillarId]: privateDeployment,
[codingagentDpdpCompliance.pillarId]: codingagentDpdpCompliance,
[codingagentInrPricing.pillarId]: codingagentInrPricing,
[codingagentIndicWorkflows.pillarId]: codingagentIndicWorkflows,
[codingagentHallucinationDefense.pillarId]: codingagentHallucinationDefense,
[codingagentTokenOptimization.pillarId]: codingagentTokenOptimization,
[codingagentPythonDataScience.pillarId]: codingagentPythonDataScience,
};

export function getEditorial(pillarId: string): PillarEditorial | undefined {
  return REGISTRY[pillarId];
}

// Publish bar: a pillar editorial is indexable only at substantive depth
// (>= MIN_EDITORIAL_WORDS). Shorter entries remain drafts: rendered with
// noindex and excluded from the sitemap until extended.
export const MIN_EDITORIAL_WORDS = 2000;
export function isContentIndexable(pillarId: string): boolean {
  const e = REGISTRY[pillarId];
  return Boolean(e) && wordCount(e) >= MIN_EDITORIAL_WORDS;
}

export function completedEditorialCount(): number {
  return Object.keys(REGISTRY).length;
}