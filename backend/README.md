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
- **Not wired into CI or deploy.** This repo's `.github/workflows/ci.yml`
  only covers `frontend/`/`web/` today, and `vercel.json` only builds `web/`.
  This backend is new code that isn't deployed anywhere yet; wiring it into
  CI/CD is a separate, deliberate follow-up.
- **Never run against a live Postgres.** Every Knex query chain here is
  written to the Knex API and cross-checked against the migrations' column
  names, but none of it has executed against a real database. See the PR
  description for the specific things that could not be verified this way.
