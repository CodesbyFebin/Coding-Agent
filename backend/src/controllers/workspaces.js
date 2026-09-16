/**
 * Workspaces Controller - CRUD, all scoped to the requesting user's
 * WorkspaceMember rows. Every read/write does an explicit membership check
 * in the query itself (defense in depth -- see backend/README.md for why
 * this subsystem uses explicit checks instead of relying on RLS alone).
 */
'use strict';

const { z } = require('zod');
const db = require('../config/db');

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional(),
});

async function getMembership(workspaceId, userId) {
  return db('WorkspaceMember').where('workspace_id', workspaceId).where('user_id', userId).first();
}

const createWorkspace = async (req, res) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { name, description } = parsed.data;

    const [workspace] = await db('Workspace')
      .insert({ name, description: description || null, owner_id: req.userId })
      .returning('*');

    await db('WorkspaceMember').insert({
      workspace_id: workspace.id,
      user_id: req.userId,
      role: 'owner',
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workspace' });
  }
};

const listWorkspaces = async (req, res) => {
  try {
    const rows = await db('Workspace as w')
      .join('WorkspaceMember as wm', 'wm.workspace_id', 'w.id')
      .where('wm.user_id', req.userId)
      .select('w.*', 'wm.role as role')
      .orderBy('w.created_at', 'desc');

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list workspaces' });
  }
};

const getWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const membership = await getMembership(workspaceId, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const workspace = await db('Workspace').where('id', workspaceId).first();
    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

    res.json({ ...workspace, role: membership.role });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const membership = await getMembership(workspaceId, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });
    if (!['owner', 'admin'].includes(membership.role)) {
      return res.status(403).json({ error: 'Only an owner or admin can update this workspace' });
    }

    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const updates = { ...parsed.data, updated_at: new Date() };
    const [workspace] = await db('Workspace')
      .where('id', workspaceId)
      .update(updates)
      .returning('*');

    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workspace' });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const membership = await getMembership(workspaceId, req.userId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });
    if (membership.role !== 'owner') {
      return res.status(403).json({ error: 'Only the owner can delete this workspace' });
    }

    const deleted = await db('Workspace').where('id', workspaceId).del();
    if (!deleted) return res.status(404).json({ error: 'Workspace not found' });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workspace' });
  }
};

module.exports = {
  createWorkspace,
  listWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
