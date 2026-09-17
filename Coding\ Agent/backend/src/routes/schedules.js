/**
 * Scheduler Routes
 */
const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/schedules');

router.get('/', schedulerController.getSchedules);
router.post('/', schedulerController.createSchedule);
router.post('/:scheduleId/toggle', schedulerController.toggleSchedule);
router.post('/:scheduleId', schedulerController.deleteSchedule);

module.exports = router;