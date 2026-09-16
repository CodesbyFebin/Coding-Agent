/**
 * Approval Routes
 *
 * controllers/approvals.js exports plain (workspaceId, missionId, ...)
 * functions, not Express (req, res) handlers, so this file wires thin
 * adapters around them and does the workspace-membership check itself.
 */
'use strict';

const express = require('express');
const router = express.Router();
const { z } = require('zod');
const db = require('../config/db');
const approvalsService = require('../controllers/approvals');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

async function requireMembership(workspaceId, userId) {
  return db('WorkspaceMember').where('workspace_id', workspaceId).where('user_id', userId).first();
}

const createSchema = z.object({
  workspaceId: z.string().uuid(),
  missionId: z.string().uuid().nullable().optional(),
  taskId: z.string().uuid().nullable().optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  reason: z.string().max(2000).optional(),
  requiredBy: z.boolean().optional(),
});

router.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { workspaceId, missionId, taskId, riskLevel, reason, requiredBy } = parsed.data;

  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const approval = await approvalsService.createApprovalRequest(
    workspaceId, missionId || null, taskId || null, req.userId, riskLevel, reason || null, requiredBy
  );
  res.status(201).json(approval);
});

router.get('/:workspaceId/mission/:missionId', async (req, res) => {
  const { workspaceId, missionId } = req.params;
  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const approvals = await approvalsService.getApprovalsByMission(workspaceId, missionId);
  res.json(approvals);
});

router.get('/:workspaceId/pending', async (req, res) => {
  const { workspaceId } = req.params;
  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const approvals = await approvalsService.getPendingApprovals(workspaceId);
  res.json(approvals);
});

router.post('/:approvalId/decide', async (req, res) => {
  const { approvalId } = req.params;
  const decision = req.body.decision;
  if (!['approve', 'reject'].includes(decision)) {
    return res.status(400).json({ error: "decision must be 'approve' or 'reject'" });
  }

  const approvalRow = await db('ApprovalRequest').where('id', approvalId).first();
  if (!approvalRow) return res.status(404).json({ error: 'Approval not found' });

  const membership = await requireMembership(approvalRow.workspace_id, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const result = await approvalsService.decideApproval(approvalId, decision, req.userId);
  if (!result.success) return res.status(409).json({ error: result.error });
  res.json(result.approval);
});

module.exports = router;
