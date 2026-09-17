/**
 * Approval Routes
 */
const express = require('express');
const router = express.Router();
const approvalsController = require('../controllers/approvals');

router.post('/', approvalsController.createApprovalRequest);
router.get('/:workspaceId/mission/:missionId', approvalsController.getApprovalsByMission);
router.get('/:workspaceId/pending', approvalsController.getPendingApprovals);
router.post('/:approvalId/decide', approvalsController.decideApproval);

module.exports = router;