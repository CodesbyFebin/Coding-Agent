/**
 * Mission Routes - mounted under /api/v1/workspaces/:workspaceId/missions,
 * behind auth middleware.
 */
'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const missionsController = require('../controllers/missions');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', missionsController.listMissions);
router.post('/', missionsController.createMission);
router.get('/:missionId', missionsController.getMission);
router.post('/:missionId/cancel', missionsController.cancelMission);

module.exports = router;
