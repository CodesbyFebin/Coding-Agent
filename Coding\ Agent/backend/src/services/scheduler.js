/**
 * Scheduler - Durable mission scheduling
 */
const { v4: uuidv4 } = require('uuid');

const schedules = {};

const createSchedule = async (workspaceId, name, missionId, cronExpression, enabled = true) => {
  const scheduleId = uuidv4();
  const schedule = {
    id: scheduleId,
    workspace_id: workspaceId,
    name,
    mission_id: missionId,
    cron_expression: cronExpression || '0 * * * *',
    enabled,
    created_at: new Date(),
    next_run: computeNextRun(cronExpression),
  };
  
  schedules[scheduleId] = schedule;
  
  // Store in database
  await req.db('schedules').insert({
    id: scheduleId,
    workspace_id: workspaceId,
    name,
    mission_id: missionId,
    cron_expression: cronExpression || '0 * * * *',
    enabled,
    created_at: new Date(),
    next_run: computeNextRun(cronExpression),
  });
  
  return schedule;
};

const computeNextRun = (cronExpression) => {
  if (!cronExpression) return new Date(Date.now() + 3600000); // 1 hour default
  
  // Parse cron and compute next run time
  // Simplified: return current time + 1 hour for now
  return new Date(Date.now() + 3600000);
};

const getSchedules = async (workspaceId) => {
  const schedules = await req.db('schedules')
    .where('workspace_id', workspaceId)
    .orderBy('created_at', 'desc');
  
  return schedules;
};

const toggleSchedule = async (scheduleId) => {
  const schedule = schedules[scheduleId];
  if (!schedule) {
    // Fetch from database
    const scheduleFromDb = await req.db('schedules').where('id', scheduleId).first();
    if (!scheduleFromDb) return null;
    schedule.enabled = !scheduleFromDb.enabled;
    scheduleFromDb.enabled = !scheduleFromDb.enabled;
    await req.db('schedules').where('id', scheduleId).update({ enabled: scheduleFromDb.enabled });
    return scheduleFromDb;
  }
  
  schedule.enabled = !schedule.enabled;
  await req.db('schedules').where('id', scheduleId).update({ enabled: schedule.enabled });
  schedule.enabled = !schedule.enabled;
  
  return schedule;
};

const deleteSchedule = async (scheduleId) => {
  delete schedules[scheduleId];
  await req.db('schedules').where('id', scheduleId).del();
};

module.exports = {
  createSchedule,
  getSchedules,
  toggleSchedule,
  deleteSchedule,
};