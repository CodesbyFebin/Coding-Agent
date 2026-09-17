/**
 * Scheduler - Durable mission scheduling
 */
'use strict';

const { v4: uuidv4 } = require('uuid');
const cronParser = require('cron-parser');
const db = require('../config/db');

const schedules = {};

const createSchedule = async (workspaceId, name, missionId, cronExpression, enabled = true) => {
  const scheduleId = uuidv4();
  const cron = cronExpression || '0 * * * *';
  const nextRun = computeNextRun(cron);

  const schedule = {
    id: scheduleId,
    workspace_id: workspaceId,
    name,
    mission_id: missionId,
    cron_expression: cron,
    enabled,
    created_at: new Date(),
    next_run: nextRun,
  };

  schedules[scheduleId] = schedule;

  // Store in database
  await db('Schedule').insert({
    id: scheduleId,
    workspace_id: workspaceId,
    name,
    mission_id: missionId,
    cron_expression: cron,
    enabled,
    created_at: new Date(),
    next_run: nextRun,
  });

  return schedule;
};

/**
 * Compute the next run time for a cron expression using cron-parser.
 * Falls back to now + 1 hour only if the expression is missing or fails to
 * parse (e.g. malformed input), so a bad cron string never throws.
 */
const computeNextRun = (cronExpression) => {
  if (!cronExpression) return new Date(Date.now() + 3600000); // 1 hour default

  try {
    const interval = cronParser.parseExpression(cronExpression, { currentDate: new Date() });
    return interval.next().toDate();
  } catch (err) {
    return new Date(Date.now() + 3600000);
  }
};

const getSchedules = async (workspaceId) => {
  const rows = await db('Schedule')
    .where('workspace_id', workspaceId)
    .orderBy('created_at', 'desc');

  return rows;
};

const toggleSchedule = async (scheduleId) => {
  const cached = schedules[scheduleId];
  if (!cached) {
    // Fetch from database
    const scheduleFromDb = await db('Schedule').where('id', scheduleId).first();
    if (!scheduleFromDb) return null;

    const newEnabled = !scheduleFromDb.enabled;
    await db('Schedule').where('id', scheduleId).update({ enabled: newEnabled });
    scheduleFromDb.enabled = newEnabled;
    return scheduleFromDb;
  }

  const newEnabled = !cached.enabled;
  await db('Schedule').where('id', scheduleId).update({ enabled: newEnabled });
  cached.enabled = newEnabled;

  return cached;
};

const deleteSchedule = async (scheduleId) => {
  delete schedules[scheduleId];
  await db('Schedule').where('id', scheduleId).del();
};

module.exports = {
  createSchedule,
  getSchedules,
  toggleSchedule,
  deleteSchedule,
  computeNextRun,
};
