/**
 * Evidence Ledger - Cryptographic verification trail
 */
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const evidenceLedger = {};

const createEvidence = async (workspaceId, missionId, stepId, evidenceType, content, metadata = {}) => {
  // Compute SHA-256 hash of content
  const contentString = JSON.stringify(content) || '';
  const evidenceHash = crypto.createHash('sha256').update(contentString).digest('hex');
  
  const evidenceId = uuidv4();
  
  const evidenceRecord = {
    id: evidenceId,
    workspace_id: workspaceId,
    mission_id: missionId,
    step_id: stepId || null,
    evidence_type: evidenceType,
    content,
    evidence_hash: evidenceHash,
    metadata: { ...metadata, createdAt: new Date().toISOString() },
    created_at: new Date(),
    verified: false,
    verification_status: 'PENDING',
    verifier: null,
    verified_at: null,
  };
  
  // Store in ledger
  if (!evidenceLedger[workspaceId]) {
    evidenceLedger[workspaceId] = [];
  }
  evidenceLedger[workspaceId].push(evidenceRecord);
  
  // Store in database
  await req.db('evidence').insert({
    id: evidenceId,
    workspace_id: workspaceId,
    mission_id: missionId,
    step_id: stepId || null,
    evidence_type: evidenceType,
    content,
    evidence_hash: evidenceHash,
    metadata: JSON.stringify(metadata),
    created_at: new Date(),
  });
  
  return evidenceRecord;
};

const verifyEvidence = async (evidenceId, verifierId, verificationResult) => {
  // Find evidence record
  const evidence = await req.db('evidence')
    .where('id', evidenceId)
    .first();
  
  if (!evidence) return { success: false, error: 'Evidence not found' };
  
  // Update evidence with verification
  await req.db('evidence')
    .where('id', evidenceId)
    .update({
      verification_status: verificationResult.status,
      verified: verificationResult.verified,
      verifier: verifierId,
      verified_at: new Date(),
      verification_details: verificationResult.details || {},
    });
  
  // Update in memory ledger
  if (evidenceLedger[evidence.workspace_id]) {
    const idx = evidenceLedger[evidence.workspace_id].findIndex(
      e => e.id === evidenceId
    );
    if (idx >= 0) {
      evidenceLedger[evidence.workspace_id][idx].verified = verificationResult.verified;
      evidenceLedger[evidence.workspace_id][idx].verification_status = verificationResult.status;
      evidenceLedger[evidence.workspace_id][idx].verifier = verifierId;
      evidenceLedger[evidence.workspace_id][idx].verified_at = new Date();
    }
  }
  
  return { success: true, evidence };
};

const getEvidenceByMission = async (workspaceId, missionId) => {
  const evidence = await req.db('evidence')
    .where('mission_id', missionId)
    .where('workspace_id', workspaceId)
    .orderBy('created_at', 'desc');
  
  return evidence;
};

const getEvidenceByStep = async (workspaceId, missionId, stepId) => {
  const evidence = await req.db('evidence')
    .where('mission_id', missionId)
    .where('workspace_id', workspaceId)
    .where('step_id', stepId)
    .orderBy('created_at', 'desc');
  
  return evidence;
};

const getEvidenceHash = (evidenceId) => {
  // In production, retrieve from database
  // This is a helper for the verification mesh
  return null;
};

module.exports = {
  createEvidence,
  verifyEvidence,
  getEvidenceByMission,
  getEvidenceByStep,
};