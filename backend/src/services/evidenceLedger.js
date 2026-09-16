/**
 * Evidence Ledger - Cryptographic verification trail
 */
'use strict';

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const db = require('../config/db');

const evidenceLedger = {};

/**
 * Canonicalize a JS value into a stable JSON string: object keys sorted
 * recursively so the same logical content always hashes the same way
 * regardless of key insertion order.
 */
function canonicalize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

const createEvidence = async (workspaceId, missionId, stepId, evidenceType, content, metadata = {}) => {
  // Compute SHA-256 hash of canonicalized content
  const contentString = canonicalize(content ?? null);
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
  await db('Evidence').insert({
    id: evidenceId,
    workspace_id: workspaceId,
    mission_id: missionId,
    step_id: stepId || null,
    evidence_type: evidenceType,
    content: JSON.stringify(content ?? null),
    evidence_hash: evidenceHash,
    metadata: JSON.stringify(metadata),
    created_at: new Date(),
  });

  return evidenceRecord;
};

const verifyEvidence = async (evidenceId, verifierId, verificationResult) => {
  // Find evidence record
  const evidence = await db('Evidence')
    .where('id', evidenceId)
    .first();

  if (!evidence) return { success: false, error: 'Evidence not found' };

  // Update evidence with verification
  await db('Evidence')
    .where('id', evidenceId)
    .update({
      verification_status: verificationResult.status,
      verified: verificationResult.verified,
      verifier: verifierId,
      verified_at: new Date(),
      verification_details: JSON.stringify(verificationResult.details || {}),
    });

  // Update in memory ledger
  if (evidenceLedger[evidence.workspace_id]) {
    const idx = evidenceLedger[evidence.workspace_id].findIndex(
      (e) => e.id === evidenceId
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
  const evidence = await db('Evidence')
    .where('mission_id', missionId)
    .where('workspace_id', workspaceId)
    .orderBy('created_at', 'desc');

  return evidence;
};

const getEvidenceByStep = async (workspaceId, missionId, stepId) => {
  const evidence = await db('Evidence')
    .where('mission_id', missionId)
    .where('workspace_id', workspaceId)
    .where('step_id', stepId)
    .orderBy('created_at', 'desc');

  return evidence;
};

/**
 * Recompute the SHA-256 evidence hash for a stored evidence record, using
 * the same canonical-JSON approach as createEvidence, so it can be checked
 * against the stored evidence_hash for integrity verification.
 */
const getEvidenceHash = async (evidenceId) => {
  const evidence = await db('Evidence').where('id', evidenceId).first();
  if (!evidence) return null;

  let content = evidence.content;
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch {
      // leave as raw string if it wasn't JSON
    }
  }

  const contentString = canonicalize(content ?? null);
  return crypto.createHash('sha256').update(contentString).digest('hex');
};

module.exports = {
  createEvidence,
  verifyEvidence,
  getEvidenceByMission,
  getEvidenceByStep,
  getEvidenceHash,
};
