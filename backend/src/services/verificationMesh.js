/**
 * Verification Mesh - Independent verification runs
 */
'use strict';

const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const verificationRuns = {};

const startVerification = async (workspaceId, missionId, agentRunId, criteria = {}) => {
  const verificationId = uuidv4();

  const verificationRecord = {
    id: verificationId,
    workspace_id: workspaceId,
    mission_id: missionId,
    agent_run_id: agentRunId,
    criteria,
    status: 'PENDING',
    verified: false,
    detail: {},
    verifier: null,
    created_at: new Date(),
    started_at: new Date(),
  };

  // Store in memory
  if (!verificationRuns[workspaceId]) {
    verificationRuns[workspaceId] = [];
  }
  verificationRuns[workspaceId].push(verificationRecord);

  // Store in database
  await db('VerificationRun').insert({
    id: verificationId,
    workspace_id: workspaceId,
    mission_id: missionId,
    agent_run_id: agentRunId,
    status: 'PENDING',
    verified: false,
    detail: JSON.stringify(criteria),
    verifier: null,
    created_at: new Date(),
    started_at: new Date(),
  });

  return verificationRecord;
};

const completeVerification = async (verificationId, verifierId, result) => {
  const verification = await db('VerificationRun')
    .where('id', verificationId)
    .first();

  if (!verification) return { success: false, error: 'Verification not found' };

  const verified = result.verified === true;

  // Update verification record
  await db('VerificationRun')
    .where('id', verificationId)
    .update({
      status: verified ? 'COMPLETED' : 'FAILED',
      verified: verified,
      verifier: verifierId,
      verified_at: new Date(),
      detail: JSON.stringify(result.detail || {}),
    });

  // Update in memory
  if (verificationRuns[verification.workspace_id]) {
    const idx = verificationRuns[verification.workspace_id].findIndex(
      (v) => v.id === verificationId
    );
    if (idx >= 0) {
      verificationRuns[verification.workspace_id][idx].status = verified ? 'COMPLETED' : 'FAILED';
      verificationRuns[verification.workspace_id][idx].verified = verified;
      verificationRuns[verification.workspace_id][idx].verifier = verifierId;
      verificationRuns[verification.workspace_id][idx].verified_at = new Date();
      verificationRuns[verification.workspace_id][idx].detail = result.detail || {};
    }
  }

  // If mission verification, update mission status
  if (verification.mission_id && verified) {
    await db('Mission')
      .where('id', verification.mission_id)
      .update({ status: 'complete', completed_at: new Date() });
  }

  return { success: true, verified, verification };
};

const getVerificationByMission = async (workspaceId, missionId) => {
  const verifications = await db('VerificationRun')
    .where('mission_id', missionId)
    .where('workspace_id', workspaceId)
    .orderBy('created_at', 'desc');

  return verifications;
};

const checkMissionVerification = async (workspaceId, missionId) => {
  // Get all evidence for the mission
  const evidence = await db('Evidence')
    .where('mission_id', missionId)
    .where('workspace_id', workspaceId);

  // Get all verifications
  const verifications = await db('VerificationRun')
    .where('mission_id', missionId)
    .where('workspace_id', workspaceId);

  // Mission is verified if all evidence has a valid hash and at least one
  // verification confirms it.
  const allHasHash = evidence.every((e) => e.evidence_hash);
  const hasCompletedVerification = verifications.some((v) => v.verified && v.status === 'COMPLETED');

  return {
    missionVerified: allHasHash && hasCompletedVerification,
    evidenceCount: evidence.length,
    verifiedCount: verifications.filter((v) => v.verified).length,
    verificationStatus: allHasHash && hasCompletedVerification ? 'VERIFIED' : 'PENDING',
  };
};

module.exports = {
  startVerification,
  completeVerification,
  getVerificationByMission,
  checkMissionVerification,
};
