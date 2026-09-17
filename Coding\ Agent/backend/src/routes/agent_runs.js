/**
 * Agent Runtime Routes
 */
const express = require('express');
const router = express.Router();
const agentRunController = require('../controllers/agent_runs');

router.get('/', agentRunController.getAgentRuns);
router.post('/', agentRunController.createAgentRun);
router.get('/:runId', agentRunController.getAgentRun);
router.post('/:runId', agentRunController.updateAgentRun);

module.exports = router;