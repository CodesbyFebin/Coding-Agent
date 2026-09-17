/**
 * Entrypoint for the workspace-based agent-runtime backend.
 */
'use strict';

require('dotenv').config();

const express = require('express');
const applySecurity = require('./middleware/security');
const attachDb = require('./middleware/attachDb');
const errorHandler = require('./middleware/errorHandler');
const apiRouter = require('./routes/api');
const db = require('./config/db');

const app = express();

applySecurity(app);
app.use(express.json({ limit: '2mb' }));
app.use(attachDb);

app.get('/health', async (req, res) => {
  try {
    await db.raw('select 1');
    res.json({ status: 'healthy' });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

app.use('/api/v1', apiRouter);
// Also accept /api/... without a version segment, matching routes/api.js's
// own historical mount point.
app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`agent-runtime backend listening on port ${PORT}`);
  });
}

module.exports = app;
