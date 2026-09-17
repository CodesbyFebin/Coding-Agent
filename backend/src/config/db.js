/**
 * Shared Knex/Postgres connection for the agent-runtime backend.
 *
 * Every service and controller in this subsystem imports this single `db`
 * instance rather than creating its own pool. Table names passed to `db(...)`
 * should be the PascalCase names as they appear (quoted) in
 * neon/migrations/003_workspace_core.sql onward, e.g. db('Workspace') --
 * knex's Postgres client always double-quotes identifiers, so the case is
 * preserved and matches the quoted table names in the migrations.
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
  pool: { min: 0, max: 10 },
});

module.exports = db;
