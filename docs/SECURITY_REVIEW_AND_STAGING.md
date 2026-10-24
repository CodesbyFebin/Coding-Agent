# Coding-Agent staging qualification and independent security assessment

Status: **NOT COMPLETED**. This is a test plan and reviewer handoff, not a security approval.

## Staging prerequisites
- Disposable PostgreSQL instance, separate from production; a staging backup/restore target.
- An authenticated console deployment with `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` and `VITE_AUTH_ENABLED=true`.
- Separate Vercel backend and frontend deployments. Set exact CORS origins and strong JWT secret.
- Isolated Linux Docker worker host with pre-pulled `node:22-alpine` and `python:3.13-alpine`, non-root daemon access, and resource quotas.
- Explicit `MCP_ALLOWED_HOSTS` set to a controlled test MCP endpoint. No private/loopback network destinations.
- At least two separate test identities and one restricted workspace viewer.

## Gates and required evidence
1. **Migrations:** apply all six Neon migrations and both console migrations to clean staging, verify schema shape, repeat idempotently, and rehearse restore to a separately created database.
2. **Authentication:** browser sign-up/sign-in, logout, session expiration/revocation, CSRF denial, concurrent user sessions, and user A/B data separation.
3. **Authorization:** negative cross-tenant tests for missions, approvals, evidence, verification completion, MCP registry, directory administration and worker status transitions.
4. **Execution:** submit a read-only test job; observe `queued→running→completed` with real container logs and SHA-256 output; test timeouts, cancellation races, worker kill/restart, absence of network and root privileges.
5. **MCP:** controlled HTTPS Streamable HTTP server handshake, positive tool call, denied host, denied tool, malformed protocol, timeout, error response and server restart.
6. **Data durability:** persist/reload sessions across browser restarts and separate workers; verify revision conflict handling and memory-safe secret storage.
7. **Deployment:** test TLS, strict CORS, monitoring, rate limiting, rollback, backup verification and alerts. Record deployed commit SHAs and environment identifiers.
8. **Independent assessment:** qualified reviewer outside the implementation team performs design/threat-model review, source and dependency analysis, privilege and tenant isolation tests, SSRF/container-escape review, and supplies signed findings with severity and retest evidence.

## Known limitations
- Console and backend use distinct identity systems; no account federation between them is proven.
- Worker currently supports only bounded syntax-check tasks, not full repository engineering.
- MCP client implements a limited HTTPS Streamable HTTP path, not the full transport matrix.
- Backend verification completion still accepts supplied outcomes; stronger independent verification receipts remain necessary.
- External staging, physical Docker isolation, third-party provider and independent-assessor tests have not been executed.

## CI result classification
`PASS`: actual CI job completed successfully at the referenced commit.
`FAIL`: test returned nonzero and must be resolved.
`NOT_RUN`: no execution evidence.
`BLOCKED`: required host, secret or external reviewer not available.

Do not relabel `NOT_RUN` or `BLOCKED` as `PASS`.
