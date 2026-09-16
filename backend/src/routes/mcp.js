/**
 * MCP Routes
 *
 * services/mcpService.js exports plain functions, not Express (req, res)
 * handlers, so this file wires thin adapters around them and does the
 * workspace-membership check itself.
 */
'use strict';

const express = require('express');
const router = express.Router();
const { z } = require('zod');
const db = require('../config/db');
const mcpService = require('../services/mcpService');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

async function requireMembership(workspaceId, userId) {
  return db('WorkspaceMember').where('workspace_id', workspaceId).where('user_id', userId).first();
}

const registerSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1),
  provider: z.string().optional(),
  version: z.string().optional(),
  tools: z.array(z.any()).optional(),
  endpoint: z.string().optional(),
  authConfig: z.record(z.any()).optional(),
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { workspaceId, name, provider, version, tools, endpoint, authConfig } = parsed.data;

  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const server = await mcpService.registerMCPServer(workspaceId, name, provider, version, tools, endpoint, authConfig);
  res.status(201).json(server);
});

router.post('/:serverId/unregister', async (req, res) => {
  const { serverId } = req.params;
  const server = await mcpService.getMCPServer(serverId);
  if (!server) return res.status(404).json({ error: 'MCP server not found' });

  const membership = await requireMembership(server.workspace_id, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  await mcpService.unregisterMCPServer(serverId);
  res.status(204).send();
});

router.get('/:workspaceId/servers', async (req, res) => {
  const { workspaceId } = req.params;
  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const servers = await mcpService.listMCPServers(workspaceId);
  res.json(servers);
});

router.get('/:workspaceId/tools', async (req, res) => {
  const { workspaceId } = req.params;
  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const tools = await mcpService.discoverTools(workspaceId, req.query.pattern);
  res.json(tools);
});

router.post('/:workspaceId/tools/invoke', async (req, res) => {
  const { workspaceId } = req.params;
  const { serverId, toolName, input } = req.body;

  const membership = await requireMembership(workspaceId, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  try {
    const result = await mcpService.invokeMCPTool(workspaceId, req.userId, serverId, toolName, input);
    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.get('/:serverId/heartbeat', async (req, res) => {
  const { serverId } = req.params;
  const server = await mcpService.getMCPServer(serverId);
  if (!server) return res.status(404).json({ error: 'MCP server not found' });

  const membership = await requireMembership(server.workspace_id, req.userId);
  if (!membership) return res.status(403).json({ error: 'Access denied' });

  const updated = await mcpService.updateMCPServerHeartbeat(serverId);
  res.json(updated);
});

module.exports = router;
