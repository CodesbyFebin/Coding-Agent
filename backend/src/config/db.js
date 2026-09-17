/**
 * Shared Knex/Postgres connection for the agent-runtime backend.
 *
 * Every service and controller in this subsystem imports this single `db`
 * instance rather than creating its own pool. Table names passed to `db(...)`
 * should be the PascalCase names as they appear (quoted) in
 * neon/migrations/003_workspace_core.sql onward, e.g. db('Workspace') --
 * knex's Postgres client always double-quotes identifiers, so the case is
 * preserved and matches the quoted table names in the migrations.
 *
 * Pool sizing: this module is required both by the long-running dev server
 * (`node src/server.js`) and by every Vercel serverless invocation
 * (`api/index.js`, `api/cron/scheduler-tick.js`). A Vercel Node function
 * instance handles one request at a time, so a pool larger than a single
 * connection buys nothing there and only makes it easier to exhaust
 * Postgres's connection limit once several function instances are warm
 * concurrently (each with its own pool). `min: 0, max: 1` keeps that
 * footprint to at most one connection per warm instance either way.
 * Requiring this module again on a warm Vercel container re-uses this same
 * module-level `db`/pool instance rather than reconnecting — that reuse is
 * safe and is Vercel's own documented best practice for DB clients; nothing
 * here assumes warm reuse actually happens (a cold start just creates a
 * fresh pool, which is also correct).
 *
 * For production/serverless use, point DATABASE_URL at a pooled connection
 * string (e.g. Neon's `-pooler`-suffixed host, which fronts PgBouncer)
 * rather than a direct Postgres connection — see backend/README.md.
 */
'use strict';

const knex = require('knex');

if (!process.env.DATABASE_URL) {
  // Fail loudly at startup rather than silently connecting to nothing.
  // eslint-disable-next-line no-console
  console.warn('[db] DATABASE_URL is not set — database calls will fail.');
}

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 1 },
});

module.exports = db;
