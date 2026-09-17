/**
 * Attaches the shared Knex instance to req.db so Express-shaped handlers
 * (e.g. controllers/agent_runs.js) can call req.db(...) directly.
 */
'use strict';

const db = require('../config/db');

function attachDb(req, res, next) {
  req.db = db;
  next();
}

module.exports = attachDb;
