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
import { secretsIsolation } from './editorials/secrets-isolation';
import { independentVerification } from './editorials/independent-verification';
import { dpdpCompliance } from './editorials/dpdp-compliance';
import { localLlmCoding } from './editorials/local-llm-coding';

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
  [secretsIsolation.pillarId]: secretsIsolation,
  [independentVerification.pillarId]: independentVerification,
  [dpdpCompliance.pillarId]: dpdpCompliance,
  [localLlmCoding.pillarId]: localLlmCoding,
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
