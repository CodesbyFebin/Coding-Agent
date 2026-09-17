# backend — workspace-based agent-runtime subsystem

A new, standalone Node/Express backend: JWT auth, workspace/mission-control
loop, task-graph execution, tool governance (ALLOW/ASK/DENY), MCP
(Model Context Protocol) integration, a durable cron scheduler, an
independent verification mesh, and a SHA-256 evidence ledger.

## Relationship to `neon/`

`neon/migrations/001_codingagent_app.sql` and `002_codingagent_extended.sql`
define the repo's existing, already-shipping schema: lowercase snake_case
tables (`projects`, `project_members`, `missions`, ...) keyed by
`project_id`, with Postgres RLS driven by `current_setting('app.user_id')`.

This subsystem introduces a **second, parallel schema** with its own
vocabulary — `Workspace` / `WorkspaceMember` / `Mission` instead of
`projects` / `project_members` / `missions`, keyed by `workspace_id` — and
its own naming convention: PascalCase, double-quoted table identifiers
(`"Workspace"`, `"Mission"`, `"AgentRun"`, ...). It is deliberately **not**
merged into or unified with the existing project-based schema; the two
coexist:

- `neon/migrations/003_workspace_core.sql` — foundation: `"User"`,
  `"Workspace"`, `"WorkspaceMember"`, `"Mission"`.
- `neon/migrations/004_agent_runtime.sql` — task graph & execution:
  `"AgentRun"`, `"TaskNode"`, `"ExecutionLog"`, `"ToolExecutionRequest"`,
  `"WorkerLease"`, `"MissionStep"`.
- `neon/migrations/005_evidence_verification_mcp.sql` — `"Evidence"`,
  `"VerificationRun"`, `"MCPServer"`, `"ToolPolicy"`, `"Schedule"`,
  `"ApprovalRequest"` (tables the backend's services need but that were
  missing from the source material's own migration file).

If/when the two schemas are ever unified, that's a separate, deliberate
migration — not something this change attempts.

## Authorization model: explicit checks, not RLS

The existing `001` schema uses Postgres RLS policies gated on
`current_setting('app.user_id')`, set per-request by the application. This
subsystem's new tables use **explicit workspace-membership checks in every
query** instead (`WHERE workspace_id = ? AND EXISTS (... WorkspaceMember ...)`
-equivalent logic in each controller), and no RLS policies were added for
them.

Why: this code could not be run against a live Postgres instance during
development, so RLS policies here would be unverified SQL layered on top of
unverified application code — two unproven defenses instead of one. Explicit
membership checks in plain JS/Knex are easier to read, easier to unit-test
later, and their correctness doesn't depend on a session variable being set
correctly on every connection. If this subsystem is unified with the RLS-based
`001` schema later, revisit this — mirroring the existing `current_setting`
pattern would then make more sense for consistency.

## Running migrations

Apply `neon/migrations/003_workspace_core.sql`,
`004_agent_runtime.sql`, and `005_evidence_verification_mcp.sql`, in that
order, after `001` and `002` (or independently — they don't reference any
`001`/`002` tables), against your Postgres/Neon database, e.g.:

```bash
psql "$DATABASE_URL" -f neon/migrations/003_workspace_core.sql
psql "$DATABASE_URL" -f neon/migrations/004_agent_runtime.sql
psql "$DATABASE_URL" -f neon/migrations/005_evidence_verification_mcp.sql
```

## Running the server locally

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, etc.
npm run dev
```

`GET /health` returns `{"status":"healthy"}` after a real `SELECT 1` against
the database. The API is mounted at both `/api/v1/...` and `/api/...`.

Auth: `POST /api/v1/auth/signup`, `POST /api/v1/auth/login` (returns a JWT),
`GET /api/v1/auth/me` (requires `Authorization: Bearer <token>`).

Workspaces: `GET|POST /api/v1/workspaces`,
`GET|PATCH|DELETE /api/v1/workspaces/:workspaceId`.

Missions: `GET|POST /api/v1/workspaces/:workspaceId/missions`,
`GET /api/v1/workspaces/:workspaceId/missions/:missionId` (returns the
mission with its task graph, mission steps, evidence, agent runs,
verifications, and execution-log events joined in),
`POST /api/v1/workspaces/:workspaceId/missions/:missionId/cancel`.

Agent runs, schedules, approvals, MCP, and verifications are mounted per
`src/routes/api.js`.

## Deploying to Vercel

This backend deploys as a set of Vercel serverless functions rather than a
long-running process. `backend/api/index.js` requires `src/server.js` (which
only calls `app.listen()` when run directly, so requiring it is
side-effect-free) and re-exports the Express `app`; Vercel's Node.js runtime
detects that exported app and calls it per request — this is Vercel's own
documented pattern for deploying Express
(https://vercel.com/docs/frameworks/backend/express). `backend/vercel.json`
rewrites `/health` and `/api/*` (except `/api/cron/*`) to that function, so
every existing route works unchanged.

The durable scheduler no longer polls in-process — see "Scheduler on
Vercel" below — instead a Vercel Cron job hits
`backend/api/cron/scheduler-tick.js` on a fixed interval.

Because this repo's root `vercel.json` already builds `web/` as its own
Vercel project, the backend deploys as a **second, separate Vercel
project** rooted at `backend/`. This one-time setup has to happen in the
Vercel dashboard — it isn't something a code change can do on its own:

1. In the Vercel dashboard, "Add New… → Project", import this same GitHub
   repository again.
2. Set that project's **Root Directory** to `backend`. Vercel will then
   pick up `backend/vercel.json` (its function config, rewrites, and cron)
   automatically — no build command is needed since there's no build step,
   just `npm install`.
3. In that project's **Settings → Environment Variables**, set:
   - `DATABASE_URL` — see "Database connections on Vercel" below for the
     pooled-connection recommendation.
   - `JWT_SECRET`
   - `CORS_ORIGINS`
   - `OLLAMA_BASE_URL` (see the Ollama limitation below)
   - `CRON_SECRET` — a long random value; also add it as the project's
     Cron protection secret if your Vercel plan surfaces one, or rely on
     this env var alone (`api/cron/scheduler-tick.js` checks it directly).
4. Deploy. `GET https://<backend-project>.vercel.app/health` should return
   `{"status":"healthy"}`.

### Scheduler on Vercel

`src/services/scheduler.js` exports `runSchedulerTick()`, a standalone
function that checks every enabled `"Schedule"` row whose `next_run` is due,
fires it (queues an `AgentRun` for its linked `Mission`), and advances
`next_run` — with no `setInterval`/timer wrapping it, since a timer started
inside a serverless invocation doesn't persist between invocations and would
just be a dangling handle within that one execution. `backend/vercel.json`
schedules `/api/cron/scheduler-tick` to run every 5 minutes
(`*/5 * * * *`). Adjust that interval to match your Vercel plan: **paid
(Pro/Enterprise) plans allow cron schedules as frequent as once a minute;
the Hobby plan limits cron jobs to once a day**, so on Hobby you'd want to
change this to e.g. `"0 * * * *"` (hourly, if allowed) or accept a daily
tick — check your plan's current limits in the Vercel dashboard, since these
have changed over time.

`src/server.js`'s own process only calls `app.listen()` under
`require.main === module` (i.e. only when run locally with `node
src/server.js` / `npm run dev`); nothing in the Vercel entrypoint
(`api/index.js`) triggers that path, so no stray timer or listener starts
inside a serverless invocation.

### Database connections on Vercel

`src/config/db.js`'s Knex pool is sized `{ min: 0, max: 1 }` — one
connection per warm function instance, appropriate for Vercel's
single-concurrency-per-instance model. Even so, **point `DATABASE_URL` at a
pooled/PgBouncer-style connection string, not a direct Postgres
connection**, in production: serverless workloads open far more distinct
connections over time (one pool per concurrently-warm instance, across
`api/index.js` and `api/cron/scheduler-tick.js`) than a normal
long-running server does, and unpooled Postgres commonly runs out of
connection slots under that pattern. Neon (this repo's target database)
provides a pooled connection string via a `-pooler`-suffixed host in its
dashboard — use that value for `DATABASE_URL` on the Vercel project rather
than the direct-connection string used for local development.

### Known limitation: Ollama-based models won't work from Vercel

`src/services/modelGateway.js`'s only working provider adapter talks to a
local Ollama server at `OLLAMA_BASE_URL` (default
`http://localhost:11434`). When this backend runs on Vercel's servers, it
cannot reach a `localhost` Ollama instance on your machine — there is no
network path from Vercel's infrastructure to your local machine. Model
routing through Ollama will fail on the Vercel deployment regardless of
`OLLAMA_BASE_URL`'s value unless you point it at an Ollama instance that is
itself reachable from the public internet (e.g. one you host and expose
yourself); this is a platform limitation of deploying a local-LLM-first
backend to a cloud host, not a bug in this change. The other provider
adapters in `modelGateway.js` remain unimplemented stubs regardless of
deployment target (see "Known gaps / stubs" below).

## Known gaps / stubs

- **LLM providers**: `src/services/modelGateway.js` only has one concrete,
  working provider adapter — Ollama, against a local
  `http://localhost:11434` server's native `/api/generate` and `/api/tags`
  endpoints (configurable via `OLLAMA_BASE_URL`). Every other provider name
  falls back to an abstract adapter whose `invoke`/`getModels`/`getUsage`
  throw `'Not implemented'`. Wiring up additional hosted providers (OpenAI,
  Anthropic, etc.) is out of scope for this change; this project positions
  itself as local-LLM-first, so Ollama was the one adapter worth making real.
- **`modelProvider.js` was deleted.** It was a near-duplicate, dead subset of
  `modelGateway.js` (same `registerProvider`/`getProviderStatus` shape, no
  routing, no adapters, never imported anywhere) — `modelGateway.js` is the
  real one.
- **Not wired into CI.** This repo's `.github/workflows/ci.yml` only covers
  `frontend/`/`web/` today; wiring this backend into that CI workflow is a
  separate, deliberate follow-up. It **is** now wired into deploy — see
  "Deploying to Vercel" above — as its own Vercel project (the root
  `vercel.json` still only builds `web/`; the backend deploys via
  `backend/vercel.json` in a second, separately-created Vercel project).
- **No standalone execution engine.** Creating a Mission or firing a
  Schedule queues rows (`TaskNode`, `AgentRun`) but nothing in this repo yet
  consumes a queued `AgentRun` and actually executes it end-to-end
  (invoking `modelGateway`, `toolGateway`, `taskPlanner`, etc. in sequence).
  `runSchedulerTick()` (see "Scheduler on Vercel" above) only queues the
  `AgentRun`; building the worker that picks up and runs queued work is a
  separate, deliberate follow-up, unrelated to the serverless conversion
  itself.
- **Never run against a live Postgres.** Every Knex query chain here is
  written to the Knex API and cross-checked against the migrations' column
  names, but none of it has executed against a real database. See the PR
  description for the specific things that could not be verified this way.
