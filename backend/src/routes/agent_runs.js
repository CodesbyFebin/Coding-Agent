/**
 * Agent Runtime Routes
 *
 * Mounted with mergeParams under /api/v1/workspaces/:workspaceId/agent_runs
 * (the controller reads req.params.workspaceId) -- the original zip mounted
 * this at a bare /agent_runs with no workspace segment, which could never
 * have worked against the controller's req.params.workspaceId. Fixed here.
 */
'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const agentRunController = require('../controllers/agent_runs');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', agentRunController.getAgentRuns);
router.post('/', agentRunController.createAgentRun);
router.get('/:runId', agentRunController.getAgentRun);
router.post('/:runId', agentRunController.updateAgentRun);

module.exports = router;
