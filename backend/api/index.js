/**
 * Vercel serverless entrypoint — deploys the entire Express app
 * (src/server.js) as a single catch-all Vercel Function.
 *
 * This is Vercel's own documented pattern for deploying an Express app
 * (https://vercel.com/docs/frameworks/backend/express: "Exporting Express
 * App with Default Export" — `module.exports = app`). Vercel's Node.js
 * runtime detects the exported Express app (a `(req, res) => ...`-shaped
 * handler) and calls it directly per request; no `(req, res) => app(req, res)`
 * wrapper or extra `@vercel/node` builder config is needed.
 *
 * src/server.js only calls `app.listen()` when run directly
 * (`require.main === module`), so requiring it here has no side effects —
 * no port is bound and no timers are started.
 *
 * Every route under `backend/vercel.json`'s catch-all rewrite
 * (`/api/(.*)`  ->  `/api/index`) is served by this one function, matching
 * how the Express app already mounts its routers at `/api/v1` and `/api`.
 */
'use strict';

const app = require('../src/server.js');

module.exports = app;
