/**
 * Scheduler Routes - fixed to require the actual controller
 * (controllers/schedules.js) instead of the non-existent
 * ../controllers/schedules that the zip referenced before this change.
 */
'use strict';

const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/schedules');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', schedulerController.getSchedules);
router.post('/', schedulerController.createSchedule);
router.post('/:scheduleId/toggle', schedulerController.toggleSchedule);
router.delete('/:scheduleId', schedulerController.deleteSchedule);

module.exports = router;
