/**
 * JWT auth middleware for the workspace/agent-runtime API.
 * Verifies `Authorization: Bearer <token>`, attaches req.userId, or
 * rejects with 401.
 */
'use strict';

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET is not set' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
