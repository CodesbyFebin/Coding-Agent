/**
 * Security middleware: Helmet, CORS (whitelist from CORS_ORIGINS) and rate
 * limiting. Mounted once in src/server.js before any routes.
 */
'use strict';

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

function buildCorsOptions() {
  const raw = process.env.CORS_ORIGINS || '';
  const allowed = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    origin(origin, callback) {
      // Allow non-browser tools (no Origin header) and any explicitly
      // whitelisted origin.
      if (!origin || allowed.length === 0 || allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  };
}

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

function applySecurity(app) {
  app.use(helmet());
  app.use(cors(buildCorsOptions()));
  app.use('/api', apiRateLimiter);
}

module.exports = applySecurity;
