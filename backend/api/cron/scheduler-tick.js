/**
 * Vercel Cron entrypoint for the durable mission scheduler.
 *
 * There is no long-running process on Vercel to run a `setInterval`-style
 * polling loop (see src/services/scheduler.js's `runSchedulerTick` doc
 * comment), so instead a Vercel Cron job invokes this function on a fixed
 * schedule (see the "crons" entry in backend/vercel.json) and each
 * invocation runs exactly one tick: check for due Schedule rows, fire them,
 * advance next_run, and return.
 *
 * Auth: Vercel signs its own Cron requests with
 * `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is set as an
 * environment variable on the project (this is Vercel's own documented
 * pattern for securing Cron endpoints — see
 * https://vercel.com/docs/cron-jobs/manage-cron-jobs). We check that same
 * header here so the endpoint can't be fired by an arbitrary request; if
 * CRON_SECRET isn't configured, every request is rejected rather than
 * silently accepting unauthenticated calls.
 */
'use strict';

require('dotenv').config();

const { runSchedulerTick } = require('../../src/services/scheduler');

module.exports = async (req, res) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;
  const legacyHeader = req.headers['x-vercel-cron-secret'];

  const authorized =
    !!cronSecret &&
    (authHeader === `Bearer ${cronSecret}` || legacyHeader === cronSecret);

  if (!authorized) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const summary = await runSchedulerTick();
    res.status(200).json({ ok: true, ...summary, ranAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
