/**
 * Tool Gateway - ALLOW/ASK/DENY policy governance
 */
const { Pool } = require('pg');

const policyHierarchy = { LOW: 1, MEDIUM: 2, HIGH: 3 };
const toolPolicies = {};

const setToolPolicy = async (workspaceId, toolName, policy, riskLevel, requiredApproval) => {
  if (!toolPolicies[workspaceId]) toolPolicies[workspaceId] = {};
  toolPolicies[workspaceId][toolName] = { policy, riskLevel, requiredApproval, updatedAt: new Date() };
  await req.db('tool_permissions').upsert(
    { workspace_id: workspaceId, tool_name: toolName, policy, risk_level: riskLevel, requires_approval: requiredApproval, updated_at: new Date() },
    { onConflict: ['workspace_id', 'tool_name'] }
  );
};

const evaluatePolicy = async (workspaceId, toolName, toolType, context = {}) => {
  const policy = toolPolicies[workspaceId]?.[toolName];
  if (!policy) return { decision: 'DENY', riskLevel: 'HIGH', requiresApproval: false, riskScore: 3 };
  
  const risk = policyHierarchy[policy.riskLevel] || 0;
  const requiresApproval = policy.requiredApproval;
  
  let decision;
  if (risk >= policyHierarchy.HIGH) decision = 'DENY';
  else if (risk >= policyHierarchy.MEDIUM) decision = 'ASK';
  else decision = 'ALLOW';
  
  return { decision, riskLevel: policy.riskLevel, requiresApproval, riskScore: risk };
};

const canExecuteTool = async (workspaceId, toolName, toolType, context = {}) => {
  const { decision, requiresApproval, riskScore } = await evaluatePolicy(workspaceId, toolName, toolType, context);
  
  if (decision === 'DENY') return { canExecute: false, reason: `Tool ${toolName} denied by policy` };
  if (decision === 'ASK' && requiresApproval) return { canExecute: false, reason: `Tool ${toolName} requires approval (risk: ${riskLevel})` };
  if (decision === 'ASK' && !requiresApproval) return { canExecute: true, decision: 'ALLOW', riskLevel: policy.riskLevel };
  
  return { canExecute: true, decision: 'ALLOW', riskLevel: policy.riskLevel };
};

const checkToolAccess = async (workspaceId, userId, toolName, toolType, context = {}) => {
  const membership = await req.db('workspace_members').where('workspace_id', workspaceId).where('user_id', userId).first();
  if (!membership) return { canExecute: false, reason: 'Not a member of this workspace' };
  
  const policyResult = await evaluatePolicy(workspaceId, toolName, toolType, context);
  const userMembership = await req.db('workspace_members').where('workspace_id', workspaceId).where('user_id', userId).first();
  const role = userMembership?.role || 'viewer';
  const rolePermissions = getRolePermissions(role);
  
  if (!rolePermissions.includes(toolName) && role !== 'admin') {
    return { canExecute: false, reason: `Role ${role} does not have permission for ${toolName}` };
  }
  
  return { canExecute: policyResult.canExecute, decision: policyResult.decision, riskLevel: policyResult.riskLevel };
};

const getRolePermissions = (role) => ({ admin: ['*'], developer: ['shell', 'http', 'filesystem', 'git'], auditor: ['http', 'read-only'], viewer: [] }[role] || []);

module.exports = { setToolPolicy, evaluatePolicy, canExecuteTool, checkToolAccess, getRolePermissions };