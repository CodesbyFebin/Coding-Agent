-- =============================================================================
-- Workspace-based agent-runtime schema (parallel system)
-- =============================================================================
-- This schema is intentionally SEPARATE from the project-based schema defined
-- in 001_codingagent_app.sql / 002_codingagent_extended.sql. It uses its own
-- vocabulary (Workspace/Mission/WorkspaceMember instead of
-- projects/project_members/missions) and its own naming convention
-- (PascalCase, double-quoted table identifiers, e.g. "Workspace") rather than
-- the lowercase snake_case convention used by the existing project schema.
--
-- The two schemas are not unified and do not reference each other. See
-- backend/README.md for the rationale.
--
-- Foundation tables: "User", "Workspace", "WorkspaceMember", "Mission".
-- Downstream agent-runtime tables (AgentRun, TaskNode, ...) are defined in
-- 004_agent_runtime.sql and reference these.
-- =============================================================================

create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- User: authentication identities for the workspace/agent-runtime subsystem.
-- Distinct from public.profiles (001), which is keyed off an external auth
-- provider's user_id. "User" owns its own credentials (bcrypt hash + JWT).
-- -----------------------------------------------------------------------------
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_email ON "User"(email);

-- -----------------------------------------------------------------------------
-- Workspace: top-level container, analogous in spirit to public.projects but
-- deliberately kept as a separate table/concept for this subsystem.
-- -----------------------------------------------------------------------------
CREATE TABLE "Workspace" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
    description TEXT,
    owner_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workspace_owner ON "Workspace"(owner_id);

-- -----------------------------------------------------------------------------
-- WorkspaceMember: membership + role, checked explicitly by every route
-- handler (see backend/README.md for why explicit checks were chosen over
-- Postgres RLS for this subsystem).
-- -----------------------------------------------------------------------------
CREATE TABLE "WorkspaceMember" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'developer' CHECK (role IN ('owner', 'admin', 'developer', 'auditor', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workspace_id, user_id)
);

CREATE INDEX idx_workspacemember_workspace ON "WorkspaceMember"(workspace_id);
CREATE INDEX idx_workspacemember_user ON "WorkspaceMember"(user_id);

-- -----------------------------------------------------------------------------
-- Mission: the workspace-scoped unit of work driven by the agent runtime
-- (task graph, evidence ledger, verification mesh) defined in later
-- migrations.
-- -----------------------------------------------------------------------------
CREATE TABLE "Mission" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES "User"(id),
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 300),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'complete', 'failed', 'verified', 'cancelled', 'approved')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    steps JSONB NOT NULL DEFAULT '[]',
    current_step INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_mission_workspace ON "Mission"(workspace_id);
CREATE INDEX idx_mission_status ON "Mission"(status);
CREATE INDEX idx_mission_created_by ON "Mission"(created_by);
