/**
 * Verification Routes
 */
const express = require('express');
const router = express.Router();
const verificationController = require('../services/verificationMesh');

router.post('/', verificationController.startVerification);
router.post('/:verificationId/complete', verificationController.completeVerification);
router.get('/:workspaceId/mission/:missionId', verificationController.getVerificationByMission);
router.get('/:workspaceId/mission/:missionId/check', verificationController.checkMissionVerification);

module.exports = router;