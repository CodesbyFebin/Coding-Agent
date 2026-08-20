# CodingAgent Frontend UI/UX Analysis and 10/10 Upgrade Plan

## Executive Summary

The current remote `main` branch does **not** yet contain the React/TypeScript/Vite modernization source referenced in the local frontend audit. The authoritative remote frontend remains the standalone application under `app/index.html` plus the public `index.html` surface.

This document records the modernization target and release gates. It must not be interpreted as proof that the modernization code has already been merged.

## Current State

- Current remote frontend authority: standalone HTML/CSS/JavaScript implementation
- Public website: `index.html`
- App surface: `app/index.html`
- Backend direction: Neon PostgreSQL + serverless API source under `neon/`
- Release state: BLOCKED pending runtime/infrastructure evidence

### Current Rating

**4/10 — functional prototype / standalone Command Center, but not yet the final modern frontend architecture.**

## Critical Gaps Preventing 10/10

1. Task Graph Editor — no production visual mission decomposition/editor.
2. Real-time Execution Controls — no verified persisted realtime pause/resume/debug control plane.
3. Evidence / Artifact Management — no complete production file preview, version history, provenance, and organization workflow.
4. Approval Workflow UI — incomplete production approval-center flow tied to live backend decisions.
5. Agent / Model Management Studio — incomplete production configuration and health management.
6. MCP Integration Center — no fully deployed discovery, test, permission, health, and configuration center.
7. Scheduler / Automation Center — no verified durable scheduler and visual calendar/cron builder.
8. Analytics Dashboard — no production telemetry-backed optimization and trend dashboard.

## Target Frontend Architecture

Use the existing repository truth first. If the local modernization source is synced, prefer a typed component architecture such as:

- React + TypeScript
- Vite or the repository-approved build tool
- React Router for bookmarkable URLs
- TanStack Query for server state
- Zustand only for client/UI state
- Zod for validation
- React Flow or equivalent for task graphs
- Vitest + React Testing Library + Playwright
- axe-core for accessibility validation

Do not add dependencies solely for fashion; preserve working API contracts.

## Product Surfaces

Primary app navigation target:

- Overview
- Missions
- Runs
- Task Graph
- Approvals
- Evidence
- Agents
- Models
- MCP
- Automations
- Analytics
- Security
- Settings

## Required Production Features

### Mission Command Center

- Mission list, filters, search, pagination
- Structured mission creation
- Mission detail with status, mode, budget, runtime, current model, agents, elapsed time
- Start, pause, resume, cancel, retry, clone, archive when backend supports them

### Task Graph

- Visual DAG
- Drag/connect/zoom/pan
- Task, agent, approval, tool, condition, parallel-group and human-input nodes
- Dependency/conditional/parallel/blocking edges
- Inspector, retry policy, timeout, approval policy
- Persistence through backend APIs

### Realtime Execution

- SSE or WebSocket based on actual backend support
- Reconnect handling
- LIVE / RECONNECTING / STALE / OFFLINE states
- Event timeline for missions, tasks, tools, approvals, evidence and artifacts

### Evidence Center

- Text, JSON, image, diff, log, report, test, command, code, PDF where supported
- Preview/download/copy/filter/search/tag/group
- Provenance, task/run links, hash, source, verification status

### Approval Center

- Pending / Approved / Rejected / Expired
- Risk and evidence context
- Approve / Reject / Request Changes
- Confirmation for destructive operations
- Immutable audit history

### Agent Studio

- Agent list/detail/create/edit
- Role, allowed tools, MCP servers, model policy, permissions, memory policy, limits
- Live status and heartbeat where available

### Model Router Studio

- Providers, models, policies, routing decisions, usage
- AUTO / FREE FIRST / LOCAL ONLY / PRIVATE / PERFORMANCE policies
- No hard-coded capability or pricing claims

### MCP Center

- Servers, tools, resources, prompts, activity
- Connection, transport, auth, health, latency, capabilities
- Add/edit/connect/disconnect/test/refresh
- Safe test calls with approval policy

### Automation Center

- Calendar, list, templates
- Natural-language and visual schedule creation
- Timezone, policy, notifications, enabled/disabled
- Durable backend scheduler required before production PASS

### Analytics

- Missions completed
- Success rate
- Duration
- Failures
- Model usage
- Tokens / cost
- Tool invocations
- Approval frequency
- Agent utilization
- MCP failures

All metrics must be telemetry-backed; no synthetic production charts.

## Accessibility Target

Target **WCAG 2.2 AA**:

- full keyboard operation
- visible focus
- semantic landmarks
- screen-reader labels
- ARIA live regions for meaningful realtime updates
- focus trapping/restoration
- skip navigation
- contrast compliance
- 200% zoom
- reduced motion
- accessible graph alternative
- practical ~44px touch targets

## Performance Target

- Lighthouse Performance >= 95 where representative
- Accessibility >= 95
- Best Practices >= 95
- route-level lazy loading
- virtualized long lists/logs
- lazy-load graph, charts and diff viewer
- minimize unnecessary hydration and client bundle size

## Testing Target

- Unit
- Component
- Integration
- E2E

Critical flows:

1. Auth
2. Workspace switch
3. Mission creation
4. Task graph persistence
5. Start/pause/resume/cancel
6. Approval decision
7. Evidence preview
8. Agent/model configuration
9. MCP connect/test
10. Scheduler
11. Realtime reconnect
12. Error recovery

Coverage target: >=80% overall, >=90% for critical business logic where practical.

## No-Mock Production Policy

Production code must not present fixture state as live state. Audit for:

- `mock`
- `fake`
- `demo`
- `sample`
- `Math.random`

Fixtures are allowed only in tests, Storybook, explicit dev/demo modes, or quarantined fixtures.

## Release Gates

- G0 Source identity
- G1 Frontend architecture
- G2 Routing
- G3 Mission UX
- G4 Task graph
- G5 Realtime execution
- G6 Evidence
- G7 Approvals
- G8 Agent studio
- G9 Model router
- G10 MCP center
- G11 Scheduler
- G12 Analytics
- G13 Accessibility
- G14 Performance
- G15 Testing
- G16 Error resilience
- G17 Security UX
- G18 Live backend integration
- G19 Deployment acceptance

A critical gate below PASS means `RELEASE = HOLD`.

## Source-Truth Rule

This document is a modernization specification, not release evidence.

The modernization is only considered implemented when the actual frontend source is present in the remote repository, its exact commit SHA is known, CI/build gates pass, and the deployed runtime is proven to serve that SHA.
