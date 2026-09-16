/**
 * Workspace Routes - all behind auth middleware.
 */
'use strict';

const express = require('express');
const router = express.Router();
const workspacesController = require('../controllers/workspaces');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', workspacesController.listWorkspaces);
router.post('/', workspacesController.createWorkspace);
router.get('/:workspaceId', workspacesController.getWorkspace);
router.patch('/:workspaceId', workspacesController.updateWorkspace);
router.delete('/:workspaceId', workspacesController.deleteWorkspace);

module.exports = router;
