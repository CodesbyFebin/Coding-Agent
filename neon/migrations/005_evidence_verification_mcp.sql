-- =============================================================================
-- Evidence ledger, verification mesh, MCP registry, tool governance, scheduler
-- =============================================================================
-- These tables are referenced by backend/src/services/*.js (evidenceLedger,
-- verificationMesh, mcpService, toolGateway, scheduler, controllers/approvals)
-- but were missing from the source zip's own migration file. Added here,
-- following the same PascalCase-quoted convention as 003/004, to complete the
-- parallel workspace/agent-runtime schema.

-- -----------------------------------------------------------------------------
-- Evidence: cryptographic (SHA-256) evidence ledger entries for mission steps.
-- -----------------------------------------------------------------------------
CREATE TABLE "Evidence" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES "Mission"(id) ON DELETE CASCADE,
    step_id UUID,
    evidence_type TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    evidence_hash TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verification_details JSONB NOT NULL DEFAULT '{}',
    verifier UUID REFERENCES "User"(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidence_workspace ON "Evidence"(workspace_id);
CREATE INDEX idx_evidence_mission ON "Evidence"(mission_id);
CREATE INDEX idx_evidence_step ON "Evidence"(step_id);

-- -----------------------------------------------------------------------------
-- VerificationRun: independent verification mesh runs against a mission /
-- agent run.
-- -----------------------------------------------------------------------------
CREATE TABLE "VerificationRun" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES "Mission"(id) ON DELETE CASCADE,
    agent_run_id UUID REFERENCES "AgentRun"(id) ON DELETE SET NULL,
    criteria JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    detail JSONB NOT NULL DEFAULT '{}',
    verifier UUID REFERENCES "User"(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ
);

CREATE INDEX idx_verificationrun_workspace ON "VerificationRun"(workspace_id);
CREATE INDEX idx_verificationrun_mission ON "VerificationRun"(mission_id);

-- -----------------------------------------------------------------------------
-- MCPServer: registered Model Context Protocol servers per workspace.
-- -----------------------------------------------------------------------------
CREATE TABLE "MCPServer" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    provider TEXT,
    version TEXT,
    tools JSONB NOT NULL DEFAULT '[]',
    endpoint TEXT,
    auth_config JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mcpserver_workspace ON "MCPServer"(workspace_id);

-- -----------------------------------------------------------------------------
-- ToolPolicy: ALLOW/ASK/DENY risk policy per workspace + tool name.
-- -----------------------------------------------------------------------------
CREATE TABLE "ToolPolicy" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    tool_name TEXT NOT NULL,
    policy TEXT NOT NULL DEFAULT 'ASK' CHECK (policy IN ('ALLOW', 'ASK', 'DENY')),
    risk_level TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workspace_id, tool_name)
);

CREATE INDEX idx_toolpolicy_workspace ON "ToolPolicy"(workspace_id);

-- -----------------------------------------------------------------------------
-- Schedule: durable cron-based mission scheduling.
-- -----------------------------------------------------------------------------
CREATE TABLE "Schedule" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    mission_id UUID REFERENCES "Mission"(id) ON DELETE CASCADE,
    cron_expression TEXT NOT NULL DEFAULT '0 * * * *',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    next_run TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedule_workspace ON "Schedule"(workspace_id);
CREATE INDEX idx_schedule_next_run ON "Schedule"(next_run);

-- -----------------------------------------------------------------------------
-- ApprovalRequest: risk-based approval gates for missions/tasks.
-- -----------------------------------------------------------------------------
CREATE TABLE "ApprovalRequest" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES "Mission"(id) ON DELETE CASCADE,
    task_id UUID,
    requested_by UUID NOT NULL REFERENCES "User"(id),
    risk_level TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approve', 'reject')),
    decided_by UUID REFERENCES "User"(id),
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_approvalrequest_workspace ON "ApprovalRequest"(workspace_id);
CREATE INDEX idx_approvalrequest_mission ON "ApprovalRequest"(mission_id);
CREATE INDEX idx_approvalrequest_status ON "ApprovalRequest"(status);
