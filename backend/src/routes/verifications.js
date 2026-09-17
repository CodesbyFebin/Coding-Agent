/**
 * Verification Routes
 *
 * services/verificationMesh.js exports plain functions, not Express
 * (req, res) handlers, so this file wires thin adapters around them and
 * does the workspace-membership check itself.
 */
'use strict';

const express = require('express');
const router = express.Router();
const { z } = require('zod');
const db = require('../config/db');
const verificationMesh = require('../services/verificationMesh');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

async function requireMembership(workspaceId, userId) {
  return db('WorkspaceMember').where('workspace_id', workspaceId).where('user_id', userId).first();
}

const startSchema = z.object({
  workspaceId: z.string().uuid(),
  missionId: z.string().uuid().nullable().optional(),
  agentRunId: z.string().uuid().nullable().optional(),
  criteria: z.record(z.any()).optional(),
});

router.post('/', async (req, res) => {
  const parsed = startSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { workspaceId, missionId, agentRunId, criteria } = parsed.data;

  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const verification = await verificationMesh.startVerification(workspaceId, missionId || null, agentRunId || null, criteria || {});
  res.status(201).json(verification);
});

router.post('/:verificationId/complete', async (req, res) => {
  const { verificationId } = req.params;
  const result = await verificationMesh.completeVerification(verificationId, req.userId, req.body || {});
  if (!result.success) return res.status(404).json({ error: result.error });
  res.json(result);
});

router.get('/:workspaceId/mission/:missionId', async (req, res) => {
  const { workspaceId, missionId } = req.params;
  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const verifications = await verificationMesh.getVerificationByMission(workspaceId, missionId);
  res.json(verifications);
});

router.get('/:workspaceId/mission/:missionId/check', async (req, res) => {
  const { workspaceId, missionId } = req.params;
  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const result = await verificationMesh.checkMissionVerification(workspaceId, missionId);
  res.json(result);
});

module.exports = router;
