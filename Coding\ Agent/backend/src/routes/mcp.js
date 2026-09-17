/**
 * MCP Routes
 */
const express = require('express');
const router = express.Router();
const mcpController = require('../services/mcpService');

router.post('/register', mcpController.registerMCPServer);
router.post('/:serverId/unregister', mcpController.unregisterMCPServer);
router.get('/:workspaceId/servers', mcpController.listMCPServers);
router.get('/:workspaceId/tools', mcpController.discoverTools);
router.post('/:workspaceId/tools/invoke', mcpController.invokeMCPTool);
router.get('/:serverId/heartbeat', mcpController.updateMCPServerHeartbeat);

module.exports = router;