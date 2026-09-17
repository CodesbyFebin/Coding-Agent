/**
 * Missions Controller - Mission Control API surface: create, list, get one
 * (with task graph / evidence / execution-log events joined in), cancel.
 * All routes are mounted under /api/v1/workspaces/:workspaceId/missions and
 * are membership-checked against "WorkspaceMember".
 */
'use strict';

const { z } = require('zod');
const db = require('../config/db');

const createSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(5000).optional(),
  steps: z.array(z.any()).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
});

async function getMembership(workspaceId, userId) {
  return db('WorkspaceMember').where('workspace_id', workspaceId).where('user_id', userId).first();
}

const createMission = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const membership = await getMembership(workspaceId, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { title, description, steps, priority } = parsed.data;

    const [mission] = await db('Mission')
      .insert({
        workspace_id: workspaceId,
        created_by: req.userId,
        title,
        description: description || null,
        steps: JSON.stringify(steps || []),
        priority: priority || 'normal',
        status: 'planned',
      })
      .returning('*');

    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create mission' });
  }
};

const listMissions = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const membership = await getMembership(workspaceId, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const missions = await db('Mission')
      .where('workspace_id', workspaceId)
      .orderBy('created_at', 'desc');

    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list missions' });
  }
};

const getMission = async (req, res) => {
  try {
    const { workspaceId, missionId } = req.params;
    const membership = await getMembership(workspaceId, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const mission = await db('Mission')
      .where('workspace_id', workspaceId)
      .where('id', missionId)
      .first();

    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    const [taskNodes, missionSteps, evidenceRows, agentRuns, verifications] = await Promise.all([
      db('TaskNode').where('mission_id', missionId).where('workspace_id', workspaceId).orderBy('created_at', 'asc'),
      db('MissionStep').where('mission_id', missionId).orderBy('step_index', 'asc'),
      db('Evidence').where('mission_id', missionId).where('workspace_id', workspaceId).orderBy('created_at', 'desc'),
      db('AgentRun').where('mission_id', missionId).where('workspace_id', workspaceId).orderBy('created_at', 'desc'),
      db('VerificationRun').where('mission_id', missionId).where('workspace_id', workspaceId).orderBy('created_at', 'desc'),
    ]);

    // Execution-log "events" for the mission's agent runs, most recent first.
    const agentRunIds = agentRuns.map((r) => r.id);
    const events = agentRunIds.length
      ? await db('ExecutionLog').whereIn('agent_run_id', agentRunIds).orderBy('started_at', 'desc')
      : [];

    res.json({
      ...mission,
      taskGraph: { nodes: taskNodes },
      steps: missionSteps,
      evidence: evidenceRows,
      agentRuns,
      verifications,
      events,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mission' });
  }
};

const cancelMission = async (req, res) => {
  try {
    const { workspaceId, missionId } = req.params;
    const membership = await getMembership(workspaceId, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const [mission] = await db('Mission')
      .where('workspace_id', workspaceId)
      .where('id', missionId)
      .update({ status: 'cancelled', updated_at: new Date() })
      .returning('*');

    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel mission' });
  }
};

module.exports = {
  createMission,
  listMissions,
  getMission,
  cancelMission,
};
