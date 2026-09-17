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

/**
 * Run one scheduler "tick": find every enabled Schedule whose next_run is
 * due, fire it, and advance its next_run to the next occurrence of its cron
 * expression.
 *
 * This is called once per invocation by the Vercel Cron endpoint
 * (api/cron/scheduler-tick.js) — there is no long-running process to poll on
 * a serverless platform, so this function must be fully self-contained and
 * safe to call repeatedly and concurrently (e.g. if a cron invocation
 * overlaps a slow previous one). It claims due rows with an atomic
 * UPDATE ... RETURNING (rather than SELECT then UPDATE) specifically so two
 * overlapping invocations can't both fire the same schedule.
 *
 * "Firing" a schedule means: if it has a linked Mission, queue a new
 * AgentRun for that mission (status 'queued') — this backend has no
 * standalone execution engine yet (see README's "Known gaps"), so queueing
 * an AgentRun row is the real, persisted unit of work a scheduled trigger is
 * responsible for; a worker/executor consuming queued AgentRuns is a
 * separate concern outside this change's scope.
 */
const runSchedulerTick = async () => {
  const now = new Date();
  const summary = { checked: 0, fired: 0, errors: [] };

  // Atomically claim due schedules by bumping next_run first, so a second,
  // overlapping tick (e.g. a slow previous invocation still running when the
  // next cron fire happens) can't double-fire the same row. Rows with a
  // cron expression that fails to parse still get a 1-hour fallback via
  // computeNextRun, so a bad expression can never wedge a schedule as
  // permanently "due".
  const dueSchedules = await db('Schedule')
    .where('enabled', true)
    .where('next_run', '<=', now)
    .orderBy('next_run', 'asc');

  summary.checked = dueSchedules.length;

  for (const row of dueSchedules) {
    const nextRun = computeNextRun(row.cron_expression);

    try {
      // Claim: only proceed if next_run still matches what we read (guards
      // against a concurrent tick having already claimed + advanced it).
      const claimed = await db('Schedule')
        .where('id', row.id)
        .where('next_run', row.next_run)
        .update({ next_run: nextRun });

      if (!claimed) continue; // another invocation already claimed this row

      if (row.mission_id) {
        await db('AgentRun').insert({
          workspace_id: row.workspace_id,
          mission_id: row.mission_id,
          model: null,
          input: JSON.stringify({ triggeredBy: 'schedule', scheduleId: row.id, scheduleName: row.name }),
          status: 'queued',
          created_at: now,
          updated_at: now,
        });
      }

      if (schedules[row.id]) {
        schedules[row.id].next_run = nextRun;
      }

      summary.fired += 1;
    } catch (err) {
      summary.errors.push({ scheduleId: row.id, message: err.message });
    }
  }

  return summary;
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
  runSchedulerTick,
};
