/**
 * Schedules Controller - thin Express (req, res) adapters around
 * services/scheduler.js, plus a workspace-membership check.
 */
'use strict';

const { z } = require('zod');
const db = require('../config/db');
const scheduler = require('../services/scheduler');

const createScheduleSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1).max(200),
  missionId: z.string().uuid().nullable().optional(),
  cronExpression: z.string().min(1).optional(),
  enabled: z.boolean().optional(),
});

async function requireMembership(workspaceId, userId) {
  return db('WorkspaceMember').where('workspace_id', workspaceId).where('user_id', userId).first();
}

const getSchedules = async (req, res) => {
  try {
    const workspaceId = req.query.workspaceId;
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId is required' });

    const membership = await requireMembership(workspaceId, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const schedules = await scheduler.getSchedules(workspaceId);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

const createSchedule = async (req, res) => {
  try {
    const parsed = createScheduleSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { workspaceId, name, missionId, cronExpression, enabled } = parsed.data;

    const membership = await requireMembership(workspaceId, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const schedule = await scheduler.createSchedule(workspaceId, name, missionId, cronExpression, enabled);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

const toggleSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const row = await db('Schedule').where('id', scheduleId).first();
    if (!row) return res.status(404).json({ error: 'Schedule not found' });

    const membership = await requireMembership(row.workspace_id, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const updated = await scheduler.toggleSchedule(scheduleId);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle schedule' });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const row = await db('Schedule').where('id', scheduleId).first();
    if (!row) return res.status(404).json({ error: 'Schedule not found' });

    const membership = await requireMembership(row.workspace_id, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    await scheduler.deleteSchedule(scheduleId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  toggleSchedule,
  deleteSchedule,
};
