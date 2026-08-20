# CodingAgent Frontend 10/10 Detailed Analysis

## Scope

This document records the detailed frontend modernization requirements for the CodingAgent Command Center. It describes the target implementation and the acceptance criteria required to call the frontend 10/10.

It does **not** assert that the React/TypeScript/Vite modernization source is already present remotely. Remote source truth must be verified independently.

## Current Remote Reality

At the time this analysis is committed, the authoritative remote application is still represented by standalone HTML/CSS/JavaScript surfaces (`index.html` and `app/index.html`) plus backend/SEO work under `neon/`, `site/`, `sitemaps/`, and related files.

## Component-by-Component Target

### 1. Application Shell

Required:
- responsive sidebar
- top command bar
- workspace switcher
- breadcrumbs
- global search
- command palette
- runtime health
- notifications
- account/profile controls
- mobile drawer navigation

### 2. Routing

Required bookmarkable routes include:

- `/login`
- `/register`
- `/workspaces`
- `/workspaces/:workspaceId/overview`
- `/workspaces/:workspaceId/missions`
- `/workspaces/:workspaceId/missions/new`
- `/workspaces/:workspaceId/missions/:missionId`
- `/workspaces/:workspaceId/runs/:runId`
- `/workspaces/:workspaceId/approvals`
- `/workspaces/:workspaceId/evidence`
- `/workspaces/:workspaceId/agents`
- `/workspaces/:workspaceId/models`
- `/workspaces/:workspaceId/mcp`
- `/workspaces/:workspaceId/automations`
- `/workspaces/:workspaceId/analytics`
- `/workspaces/:workspaceId/settings`

Refresh and deep-link navigation must work.

### 3. Authentication UX

Required states:
- loading
- authenticated
- unauthenticated
- expired
- forbidden
- offline/network unavailable

Protected content must not flash before authentication resolves.

### 4. Mission Management

Upgrade from basic mission forms to:
- proper create page/drawer
- title, goal, description, execution mode, priority, model policy, agent policy, repo, branch, budget, deadline, approval policy and tags where backend supports them
- filters, search, sorting and pagination
- templates for feature, bug fix, security review, research, deployment, refactor, documentation

### 5. Mission Command Page

Required tabs:
- Overview
- Graph
- Execution
- Evidence
- Approvals
- Artifacts
- Logs
- Activity

Actions must be state-aware and backend-backed.

### 6. Task Graph Editor

Use React Flow or equivalent only if compatible with the actual frontend architecture.

Required node types:
- Task
- Agent
- Approval
- Tool
- Condition
- Parallel Group
- Human Input
- Deployment

Required capabilities:
- drag
- connect
- zoom
- pan
- fit view
- minimap
- multi-select
- delete
- duplicate
- undo/redo
- keyboard support
- persisted backend state

### 7. Realtime Execution

Prefer SSE or WebSocket according to backend truth.

Events should support:
- mission lifecycle
- task lifecycle
- agent status
- tool invocation lifecycle
- approval lifecycle
- evidence/artifact creation
- model invocation
- pause/resume/cancel

UI must distinguish LIVE, RECONNECTING, STALE and OFFLINE.

### 8. Execution Debugger

Required:
- pause
- resume
- stop
- retry task
- inspect
- re-run where backend supports it

Inspector should expose:
- input/output
- agent
- model
- tools
- duration
- tokens/cost where verified
- logs
- errors
- retries
- evidence

### 9. Evidence / Artifact Center

Required preview support where appropriate:
- text
- Markdown
- JSON
- images
- code
- diffs
- logs
- PDF

Each evidence item must expose provenance and verification state.

### 10. Approval Center

Views:
- Pending
- Approved
- Rejected
- Expired
- All

High-risk approvals should expose the exact action and evidence before a decision.

### 11. Agent Studio

Required:
- list/detail/create/edit
- role
- system instruction reference
- allowed tools
- MCP servers
- model policy
- permission policy
- memory policy
- execution limits
- live status when backend supports it

### 12. Model Router Studio

Required:
- providers
- models
- routing policies
- routing decisions
- usage

No model capability, cost, free-tier, context-window, latency or health value may be fabricated.

### 13. MCP Integration Center

Views:
- Servers
- Tools
- Resources
- Prompts
- Activity

Server detail:
- connection
- transport
- authentication
- health
- latency
- tool/resource/prompt counts
- permissions
- logs

### 14. Scheduler / Automation Center

Required:
- Calendar
- List
- Templates
- natural-language schedule input
- visual schedule builder
- timezone
- model/agent policy
- notifications
- enabled state

Durable scheduler backend is a release prerequisite for live automation claims.

### 15. Analytics

Only telemetry-backed data may be shown.

Potential metrics:
- missions completed
- success rate
- duration
- task failures
- model usage
- tokens/cost
- tool invocations
- approvals
- agent utilization
- MCP failures

### 16. Design System

Define tokens for:
- background/surface/border/text
- primary/success/warning/danger/info
- typography
- spacing
- radius
- shadows
- motion

Core primitives should include buttons, inputs, selects, comboboxes, badges, cards, tabs, data tables, dialogs, drawers, toasts, banners, skeletons, empty/error states, timeline and command palette.

### 17. UX State Quality

Every async surface must have:
- loading
- empty
- error
- retry
- success/updated state where applicable

Avoid browser `alert()`, `prompt()` and `confirm()` for primary product interactions.

### 18. Error Resilience

Implement route/component error boundaries and categorize API errors such as 401, 403, 404, 409, 422, 429, 5xx and network failure.

Safe GET requests may use bounded retries. Destructive operations must not be blindly retried.

### 19. Accessibility

Target WCAG 2.2 AA.

Acceptance includes:
- complete keyboard navigation
- focus-visible
- logical tab order
- semantic landmarks
- screen-reader labels
- live regions for realtime changes where useful
- dialog focus trap/restoration
- 200% zoom
- reduced motion
- accessible graph fallback
- mobile touch targets

### 20. Performance

Target representative Lighthouse scores >=95 for Performance, Accessibility and Best Practices when feasible.

Use:
- route-level lazy loading
- virtualized long lists/logs
- lazy graph/chart/diff modules
- query caching
- render profiling

### 21. PWA / Offline

If implemented, offline behavior must be safe. Never silently queue destructive approvals, merges or deletes while offline.

### 22. Internationalization

Centralize user-facing strings and prepare the architecture for additional Indian languages without making i18n a blocker for core runtime functionality.

### 23. Testing

Required categories:
- unit
- component
- integration
- E2E

Critical business flows should receive deeper coverage than static presentational markup.

### 24. Security UX

Make boundaries visible:
- Local
- Cloud
- External
- Egress active
- Approval required
- Secret access
- MCP remote
- Production environment

Secrets/tokens must never be exposed in client rendering.

## Acceptance Standard

A 10/10 frontend is not defined by visual polish alone. It requires objective evidence that source, build, routing, realtime integration, mission control, graph, evidence, approvals, agents, models, MCP, scheduler, analytics, accessibility, performance, testing, error resilience, security UX and deployed runtime all pass.

If any critical subsystem is simulated, source-only, or not independently verified, release remains HOLD.
