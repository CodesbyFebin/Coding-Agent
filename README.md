# CodingAgent.in — Sovereign Agentic Engineering Platform

**CodingAgent.in** is a sovereign, open-source, local-LLM-first agentic engineering platform for AI coding agents, MCP, controlled tool use, security, and verification.

## Architecture

The platform follows a strict production boundary: the browser is a projection only.

```
Browser → API → Domain → Database (Neon PostgreSQL) → Queue → Worker
→ Agent Runtime → Model Router → Tool Gateway → Evidence → Verification
```

## Backend Migration: Supabase → Neon

This repository has been migrated from Supabase to **Neon** PostgreSQL for:
- **Lower cost** — Neon's serverless model scales to zero
- **Better integration** — Works seamlessly with Vercel Deployments
- **Open standards** — Pure PostgreSQL without vendor-specific extensions

### Migration Files
- `neon/migrations/001_codingagent_app.sql` — Core schema (users, projects, missions, tasks)
- `neem/migrations/002_codingagent_extended.sql` — Extended schema (models, agents, tools, evidence)

### API Endpoint
- `neon/functions/mission-api/index.ts` — Serverless API deployed on Vercel

### Environment Variables
```bash
NEON_URL=postgresql://user:pass@ep-...neon.tech/dbname
APP_ORIGINS=https://app.codingagent.in
```

## Website
- `index.html` — Public homepage
- `app/index.html` — Command Center web application
- `sitemaps/` — SEO infrastructure (6 sitemap files)
- `site/` — Entity hub pages (11 pages)

## API Surface (/api/v1)
Resource groups: missions, tasks, agents, models, approvals, evidence, verifications, artifacts, memory, skills, mcp, tools, schedules, usage, events

## Mission Lifecycle
POST /missions, GET /missions, GET /missions/:id, PATCH /missions/:id,
POST /missions/:id/plan, POST /missions/:id/queue, POST /missions/:id/pause,
POST /missions/:id/resume, POST /missions/:id/cancel, POST /missions/:id/retry,
GET /missions/:id/events, GET /missions/:id/evidence, GET /missions/:id/artifacts

## Release Status
Classification: **BLOCKED**
- Infrastructure has not been independently verified
- Production evidence is unavailable
- See `release.json` for details

## License
Open source