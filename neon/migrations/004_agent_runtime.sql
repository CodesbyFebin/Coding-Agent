-- =============================================================================
-- Agent Runtime
-- =============================================================================
-- Renumbered from the source zip's 003_agent_runtime.sql to continue the
-- neon/migrations/ sequence after 003_workspace_core.sql, which this file
-- depends on for "Workspace" and "Mission". Part of the parallel
-- workspace/agent-runtime schema; see backend/README.md.

-- Agent runs table
CREATE TABLE "AgentRun" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES "Mission"(id) ON DELETE SET NULL,
    task_id UUID,
    model TEXT,
    input JSONB NOT NULL DEFAULT '{}',
    output JSONB,
    status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task nodes table (for task graph)
CREATE TABLE "TaskNode" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES "Mission"(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES "TaskNode"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'task',
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'blocked')),
    dependencies JSONB NOT NULL DEFAULT '[]',
    depends_on UUID[],
    input JSONB NOT NULL DEFAULT '{}',
    output JSONB,
    status_info JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Execution logs table
CREATE TABLE "ExecutionLog" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_run_id UUID NOT NULL REFERENCES "AgentRun"(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    task_id UUID,
    step INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'skipped')),
    output JSONB,
    error TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'
);

-- Tool execution requests table
CREATE TABLE "ToolExecutionRequest" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    agent_run_id UUID REFERENCES "AgentRun"(id) ON DELETE SET NULL,
    tool_name TEXT NOT NULL,
    tool_type TEXT NOT NULL CHECK (tool_type IN ('shell', 'filesystem', 'git', 'http', 'database', 'mcp')),
    input JSONB NOT NULL DEFAULT '{}',
    sandbox_id UUID,
    status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'executing', 'completed', 'failed')),
    output JSONB,
    evidence_hash TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Worker leasing table
CREATE TABLE "WorkerLease" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
    agent_run_id UUID REFERENCES "AgentRun"(id) ON DELETE SET NULL,
    worker_id TEXT NOT NULL,
    leased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    renew_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'revoked'))
);

-- Mission steps table (enhanced)
CREATE TABLE "MissionStep" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES "Mission"(id) ON DELETE CASCADE,
    step_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'plan', 'in_progress', 'completed', 'failed', 'cancelled')),
    task_node_id UUID REFERENCES "TaskNode"(id) ON DELETE SET NULL,
    assigned_agent_id UUID REFERENCES "AgentRun"(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    evidence_hash TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agentrun_workspace ON "AgentRun"(workspace_id);
CREATE INDEX agentrun_mission_idx ON "AgentRun"(mission_id);
CREATE INDEX idx_tasknode_workspace ON "TaskNode"(workspace_id);
CREATE INDEX idx_tasknode_mission ON "TaskNode"(mission_id);
CREATE INDEX idx_tasknode_parent ON "TaskNode"(parent_id);
CREATE INDEX idx_tasknode_status ON "TaskNode"(status);
CREATE INDEX idx_executionlog_run ON "ExecutionLog"(agent_run_id);
CREATE INDEX idx_executionlog_workspace ON "ExecutionLog"(workspace_id);
CREATE INDEX idx_toolexec_workspace ON "ToolExecutionRequest"(workspace_id);
CREATE INDEX idx_toolexec_status ON "ToolExecutionRequest"(status);
CREATE INDEX idx_toolexec_agent ON "ToolExecutionRequest"(agent_run_id);
CREATE INDEX idx_workerlease_workspace ON "WorkerLease"(workspace_id);
CREATE INDEX idx_workerlease_expires ON "WorkerLease"(expires_at);
CREATE INDEX idx_missionstep_mission ON "MissionStep"(mission_id);
CREATE INDEX idx_missionstep_task ON "MissionStep"(task_node_id);