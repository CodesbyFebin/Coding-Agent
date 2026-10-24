# Evidence directory — deployment and qualification

This feature adds a database-backed public agent directory at `/agents`, using the existing React frontend and Express backend. It does **not** copy numerical claims from the standalone HTML prototype.

## Required deployment order

1. Back up the target Neon PostgreSQL database; apply `neon/migrations/001_*.sql` through `006_directory.sql` in order to a disposable staging database first. The directory migration has no sample records.
2. Deploy `backend/` as an independent Vercel project. Configure `DATABASE_URL` (pooled TLS connection), `JWT_SECRET` (strong random secret), `CORS_ORIGINS` (exact approved origins), and `DIRECTORY_ADMIN_USER_IDS` (comma-separated, intentionally privileged User UUIDs).
3. Deploy `frontend/` as a separate Vercel project, with `VITE_API_BASE_URL=https://<backend-host>/api/v1` built in. Confirm `GET /api/v1/directory/agents` returns `{"agents":[],"total":0}` before publication.
4. Use the existing backend signup/login endpoint to obtain a Bearer token for a deliberately designated directory administrator. Register profiles through `POST /api/v1/directory/agents`. Add source-linked claims through `POST /api/v1/directory/agents/:slug/evidence`.
5. Publish a profile only after examining its sources. The admin create API defaults `published` to false; publishing currently requires an administrator-controlled SQL update: `UPDATE directory_agents SET published = TRUE WHERE slug = ...`. This explicit staging gate is intentional.
6. For a static GitHub Pages deployment, build the public frontend with an absolute `VITE_API_BASE_URL`. GitHub Pages cannot host the Express/PostgreSQL backend. If served below a repository subpath, configure the Vite base path/router accordingly. Prefer a custom-domain root deployment for canonical URLs.

## API contract

- `GET /api/v1/directory/agents` — public published profiles and their source-linked evidence.
- `GET /api/v1/directory/agents/:slug` — one published profile.
- `POST /api/v1/directory/agents` — authorized administrator only.
- `POST /api/v1/directory/agents/:slug/evidence` — authorized administrator only.

Evidence states: `unreviewed`, `supported`, `contradicted`. Coverage is the percentage of six governance dimensions with a supported/contradicted assessment; it is not a security grade. Conflicting evidence is shown as contradicted. Empty databases display zero profiles instead of fabricated data.

## Outstanding release gates

- Verify all schema migrations on disposable PostgreSQL and then staging, including rollback/restore.
- Confirm real login, token expiry, administrator rejection, and two-tenant isolation in live tests.
- Perform browser E2E against deployed backend and seeded *documented* profiles.
- Test MCP actual execution, workers, isolated code execution and crash recovery; existing backend lacks a real MCP transport and worker engine.
- Independently assess evidence provenance and verify that completion cannot be self-attested.
- Test rate limits, TLS, CORS, alerting, monitoring, secrets, and rollback on the deployed infrastructure.
- Preserve blocked/qualification status until these gates execute successfully.

Do not treat successful build or synthetic unit tests as independent production verification.
