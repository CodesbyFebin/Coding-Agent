'use strict';

const express = require('express');
const authRoutes = require('./auth');
const workspaceRoutes = require('./workspaces');
const missionRoutes = require('./missions');
const agentRunRoutes = require('./agent_runs');
const scheduleRoutes = require('./schedules');
const approvalRoutes = require('./approvals');
const mcpRoutes = require('./mcp');
const verificationsRoutes = require('./verifications');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/workspaces/:workspaceId/missions', missionRoutes);
router.use('/agent_runs', agentRunRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/approvals', approvalRoutes);
router.use('/mcp', mcpRoutes);
router.use('/verifications', verificationsRoutes);

module.exports = router;