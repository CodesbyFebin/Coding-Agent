/**
 * Approval Workflow - Risk-based approval gates
 */
const { v4: uuidv4 } = require('uuid');

const approvalRequests = {};

const createApprovalRequest = async (workspaceId, missionId, taskId, requestedBy, riskLevel, reason, requiredBy) => {
  const approvalId = uuidv4();
  
  const expiration = requiredBy 
    ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours default
    : null;
  
  const approvalRecord = {
    id: approvalId,
    workspace_id: workspaceId,
    mission_id: missionId,
    task_id: taskId || null,
    requested_by: requestedBy,
    risk_level: riskLevel,
    reason,
    status: 'pending',
    decided_by: null,
    decided_at: null,
    created_at: new Date(),
    expires_at: expiration,
  };
  
  // Store in memory
  if (!approvalRequests[workspaceId]) {
    approvalRequests[workspaceId] = [];
  }
  approvalRequests[workspaceId].push(approvalRecord);
  
  // Store in database
  await req.db('approval_requests').insert({
    id: approvalId,
    workspace_id: workspaceId,
    mission_id: missionId,
    task_id: taskId || null,
    requested_by: requestedBy,
    risk_level: riskLevel,
    reason,
    status: 'pending',
    decided_by: null,
    decided_at: null,
    created_at: new Date(),
    expires_at: expiration,
  });
  
  return approvalRecord;
};

const getApprovalsByMission = async (workspaceId, missionId) => {
  const approvals = await req.db('approval_requests')
    .where('workspace_id', workspaceId)
    .where('mission_id', missionId)
    .orderBy('created_at', 'desc');
  
  return approvals;
};

const getPendingApprovals = async (workspaceId) => {
  const approvals = await req.db('approval_requests')
    .where('workspace_id', workspaceId)
    .where('status', 'pending')
    .orderBy('created_at', 'desc');
  
  return approvals;
};

const decideApproval = async (approvalId, decision, decidedBy) => {
  const approval = await req.db('approval_requests')
    .where('id', approvalId)
    .first();
  
  if (!approval) return { success: false, error: 'Approval not found' };
  
  if (approval.status !== 'pending') {
    return { success: false, error: 'Approval already decided' };
  }
  
  if (approval.expires_at && new Date() > approval.expires_at) {
    return { success: false, error: 'Approval expired' };
  }
  
  // Update approval status
  await req.db('approval_requests')
    .where('id', approvalId)
    .update({
      status: decision,
      decided_by: decidedBy,
      decided_at: new Date(),
    });
  
  // If approved, update mission status
  if (decision === 'approve' && approval.mission_id) {
    await req.db('missions')
      .where('id', approval.mission_id)
      .update({ status: 'approved', updated_at: new Date() });
  }
  
  // Remove from memory
  if (approvalRequests[approval.workspace_id]) {
    const idx = approvalRequests[approval.workspace_id].findIndex(
      a => a.id === approvalId
    );
    if (idx >= 0) {
      approvalRequests[approval.workspace_id].splice(idx, 1);
    }
  }
  
  return { success: true, approval };
};

module.exports = {
  createApprovalRequest,
  getApprovalsByMission,
  getPendingApprovals,
  decideApproval,
};