/**
 * Tool Gateway - ALLOW/ASK/DENY policy governance
 *
 * Risk decision pipeline:
 *  1. setToolPolicy() records a workspace+tool policy (risk level + whether
 *     approval is required) in memory and in the "ToolPolicy" table.
 *  2. evaluatePolicy() looks up that policy and turns its risk level into an
 *     ALLOW/ASK/DENY decision.
 *  3. canExecuteTool() applies that decision on its own (no membership
 *     check) -- used when the caller has already been authorized elsewhere.
 *  4. checkToolAccess() is the full gate: workspace membership + role
 *     permissions + the policy decision from evaluatePolicy().
 */
'use strict';

const db = require('../config/db');

const policyHierarchy = { LOW: 1, MEDIUM: 2, HIGH: 3 };
const toolPolicies = {};

const setToolPolicy = async (workspaceId, toolName, policy, riskLevel, requiredApproval) => {
  if (!toolPolicies[workspaceId]) toolPolicies[workspaceId] = {};
  toolPolicies[workspaceId][toolName] = { policy, riskLevel, requiredApproval, updatedAt: new Date() };

  await db('ToolPolicy')
    .insert({
      workspace_id: workspaceId,
      tool_name: toolName,
      policy,
      risk_level: riskLevel,
      requires_approval: requiredApproval,
      updated_at: new Date(),
    })
    .onConflict(['workspace_id', 'tool_name'])
    .merge({
      policy,
      risk_level: riskLevel,
      requires_approval: requiredApproval,
      updated_at: new Date(),
    });
};

/**
 * Turn a workspace's stored risk level for a tool into an ALLOW/ASK/DENY
 * decision. Unknown tools (no policy on record) default to DENY at HIGH
 * risk -- fail closed.
 */
const evaluatePolicy = async (workspaceId, toolName, toolType, context = {}) => {
  const policy = toolPolicies[workspaceId]?.[toolName];
  if (!policy) return { decision: 'DENY', riskLevel: 'HIGH', requiresApproval: false, riskScore: 3 };

  const riskScore = policyHierarchy[policy.riskLevel] || 0;
  const requiresApproval = policy.requiredApproval;
  const riskLevel = policy.riskLevel;

  let decision;
  if (riskScore >= policyHierarchy.HIGH) decision = 'DENY';
  else if (riskScore >= policyHierarchy.MEDIUM) decision = 'ASK';
  else decision = 'ALLOW';

  return { decision, riskLevel, requiresApproval, riskScore };
};

/**
 * Apply an evaluatePolicy() decision directly, without a membership/role
 * check. DENY always blocks; ASK blocks unless the policy does not require
 * an explicit approval step; ALLOW passes.
 */
const canExecuteTool = async (workspaceId, toolName, toolType, context = {}) => {
  const { decision, requiresApproval, riskLevel } = await evaluatePolicy(workspaceId, toolName, toolType, context);

  if (decision === 'DENY') return { canExecute: false, decision, riskLevel, reason: `Tool ${toolName} denied by policy` };
  if (decision === 'ASK' && requiresApproval) {
    return { canExecute: false, decision, riskLevel, reason: `Tool ${toolName} requires approval (risk: ${riskLevel})` };
  }

  return { canExecute: true, decision: decision === 'ASK' ? 'ALLOW' : decision, riskLevel };
};

/**
 * Full gate: workspace membership, role permissions, and the tool's policy
 * decision. This is the function route/controller code should call before
 * letting a workspace member invoke a tool.
 */
const checkToolAccess = async (workspaceId, userId, toolName, toolType, context = {}) => {
  const membership = await db('WorkspaceMember').where('workspace_id', workspaceId).where('user_id', userId).first();
  if (!membership) return { canExecute: false, reason: 'Not a member of this workspace' };

  const policyResult = await evaluatePolicy(workspaceId, toolName, toolType, context);
  const role = membership.role || 'viewer';
  const rolePermissions = getRolePermissions(role);

  if (!rolePermissions.includes('*') && !rolePermissions.includes(toolName)) {
    return { canExecute: false, reason: `Role ${role} does not have permission for ${toolName}` };
  }

  if (policyResult.decision === 'DENY') {
    return { canExecute: false, decision: policyResult.decision, riskLevel: policyResult.riskLevel, reason: `Tool ${toolName} denied by policy` };
  }
  if (policyResult.decision === 'ASK' && policyResult.requiresApproval) {
    return { canExecute: false, decision: policyResult.decision, riskLevel: policyResult.riskLevel, reason: `Tool ${toolName} requires approval (risk: ${policyResult.riskLevel})` };
  }

  return { canExecute: true, decision: policyResult.decision === 'ASK' ? 'ALLOW' : policyResult.decision, riskLevel: policyResult.riskLevel };
};

const getRolePermissions = (role) => ({ owner: ['*'], admin: ['*'], developer: ['shell', 'http', 'filesystem', 'git'], auditor: ['http', 'read-only'], viewer: [] }[role] || []);

module.exports = { setToolPolicy, evaluatePolicy, canExecuteTool, checkToolAccess, getRolePermissions };
