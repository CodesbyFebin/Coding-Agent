-- CodingAgent.in extended application schema v2
-- Adds missing entities from production specification
-- PostgreSQL/Neon authority; frontend is only a projection.

-- Model provider configuration
create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  provider text not null check (provider in ('OPENAI','QWEN','KIMI','MINIMAX','LOCAL','CUSTOM')),
  capabilities jsonb not null default '{}'::jsonb,
  parameters jsonb not null default '{}'::jsonb,
  routing_policy text not null default 'AUTO' check (routing_policy in ('AUTO','QUALITY','SPEED','COST','PRIVACY','LOCAL','BALANCED')),
  priority integer not null default 0,
  fallback_model_id uuid references public.models(id),
  health_status text not null default 'UNKNOWN' check (health_status in ('UNKNOWN','DEGRADED','HEALTHY')),
  last_health_check timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists models_project_idx on public.models(project_id);

-- Autonomous agent execution unit
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  model_id uuid not null references public.models(id),
  context jsonb not null default '{}'::jsonb,
  workspace_id text not null,
  permissions jsonb not null default '{}'::jsonb,
  budget jsonb not null default '{}'::jsonb,
  parent_agent_id uuid references public.agents(id),
  status text not null default 'SPAWNED' check (status in ('SPAWNED','READY','RUNNING','WAITING_TOOL','WAITING_APPROVAL','COMPLETED','FAILED','RETRYING')),
  tool_ids uuid[] not null default '{}',
  retry_policy jsonb not null default '{}'::jsonb,
  timeout integer not null default 300,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists agents_project_idx on public.agents(project_id);
create index if not exists agents_model_idx on public.agents(model_id);

-- Historical model invocation tracking
create table if not exists public.model_invocations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  mission_id uuid references public.missions(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  model_id uuid not null references public.models(id),
  provider text not null,
  model_name text not null,
  capability_decision text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  latency_ms integer not null default 0,
  cost numeric(10,6) not null default 0,
  fallback_used boolean not null default false,
  truth_state jsonb not null default '{}'::jsonb,
  correlation_id text,
  created_at timestamptz not null default now()
);

create index if not exists model_invocations_project_idx on public.model_invocations(project_id);
create index if not exists model_invocations_agent_idx on public.model_invocations(agent_id);
create index if not exists model_invocations_mission_idx on public.model_invocations(mission_id);

-- Historical tool invocation tracking
create table if not exists public.tool_invocations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  mission_id uuid references public.missions(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  tool_name text not null,
  tool_type text not null default 'SYSTEM',
  policy_rule_id uuid references public.policy_rules(id) on delete set null,
  approval_id uuid references public.approvals(id) on delete set null,
  execution_result jsonb,
  execution_error text,
  evidence_id uuid references public.evidence(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists tool_invocations_project_idx on public.tool_invocations(project_id);
create index if not exists tool_invocations_agent_idx on public.tool_invocations(agent_id);

-- MCP server configuration
create table if not exists public.mcp_servers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  description text,
  transport_type text not null default 'STDIO' check (transport_type in ('STDIO','HTTP','CUSTOM')),
  connection_config jsonb not null default '{}'::jsonb,
  health_status text not null default 'UNAVAILABLE' check (health_status in ('UNAVAILABLE','UNKNOWN','DEGRADED','HEALTHY')),
  tool_inventory jsonb not null default '[]'::jsonb,
  permission_mapping jsonb not null default '{}'::jsonb,
  last_used timestamptz,
  auth_config jsonb not null default '{}'::jsonb,
  audit_trail jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mcp_servers_project_idx on public.mcp_servers(project_id);

-- Security policy definitions
create table if not exists public.policy_rules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  description text,
  resource_type text not null check (resource_type in ('ANY','FILESYSTEM','GIT','NETWORK','DATABASE','EXTERNAL')),
  action text not null check (action in ('READ','WRITE','EXECUTE','DELETE','ADMIN')),
  effect text not null default 'ALLOW' check (effect in ('ALLOW','DENY')),
  conditions jsonb not null default '{}'::jsonb,
  priority integer not null default 0,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists policy_rules_project_idx on public.policy_rules(project_id);

-- Verification execution results
create table if not exists public.verification_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  mission_id uuid references public.missions(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  verifier_type text not null check (verifier_type in ('BUILD','TYPE','TEST','SECURITY','BROWSER','ACCESSIBILITY','PERFORMANCE','ACCEPTANCE')),
  status text not null default 'NOT_RUN' check (status in ('NOT_RUN','UNKNOWN','PASS','FAIL','BLOCKED','SKIPPED','BLOCKED')),
  evidence_ids uuid[] not null default '{}',
  result_details jsonb not null default '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists verification_runs_project_idx on public.verification_runs(project_id);
create index if not exists verification_runs_mission_idx on public.verification_runs(mission_id);

-- Evidence ledger for verifiable claims
create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  claim text not null,
  source_type text not null check (source_type in ('WEB','FILE','TOOL','MODEL','USER','SYSTEM')),
  source_ref text not null,
  collected_at timestamptz not null default now(),
  evidence_hash text,
  provenance jsonb not null default '[]'::jsonb,
  contradictions text[] not null default '{}',
  verification_run_id uuid references public.verification_runs(id) on delete set null
);

create index if not exists evidence_mission_idx on public.evidence(mission_id);
create index if not exists evidence_agent_idx on public.evidence(agent_id);

-- Artifact metadata
create table if not exists public.artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  creator uuid not null references public.agents(id) on delete set null,
  agent_id uuid not null references public.agents(id) on delete cascade,
  model_id uuid not null references public.models(id) on delete cascade,
  version text not null default '1.0.0',
  mime_type text not null,
  size_bytes bigint not null,
  sha256 text not null,
  storage_uri text not null,
  kind text not null default 'FILE' check (kind in ('FILE','ARTIFACT','SNAPSHOT')),
  created_at timestamptz not null default now()
);

create index if not exists artifacts_project_idx on public.artifacts(project_id);
create index if not exists artifacts_mission_idx on public.artifacts(mission_id);

-- Enhanced memory entries
create table if not exists public.memory_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references public.agents(id) on delete cascade,
  scope text not null default 'PROJECT' check (scope in ('MISSION','PROJECT','USER','WORKSPACE','ORGANIZATION','KNOWLEDGE')),
  key text not null,
  value jsonb not null default '{}'::jsonb,
  review_status text not null default 'PENDING' check (review_status in ('PENDING','APPROVED','REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memory_entries_project_idx on public.memory_entries(project_id);
create index if not exists memory_entries_scope_idx on public.memory_entries(scope);

-- Enhanced skills
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  version text not null default '0.1.0',
  status text not null default 'DRAFT' check (status in ('DRAFT','REVIEW','PUBLISHED','REJECTED','DEPRECATED')),
  instructions text,
  required_tools text[] not null default '{}',
  capabilities text[] not null default '{}',
  permissions text[] not null default '{}',
  examples jsonb not null default '[]'::jsonb,
  verification_criteria text[] not null default '{}',
  created_by uuid not null references public.agents(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skills_project_idx on public.skills(project_id);

-- Enhanced schedules
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references public.agents(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('ONCE','INTERVAL','CRON','WEBHOOK')),
  expression text,
  enabled boolean not null default false,
  mission_template jsonb not null default '{}'::jsonb,
  timezone text not null default 'UTC',
  misfire_behavior text not null default 'SKIP' check (misfire_behavior in ('SKIP','FIRE_ONCE','RESCHEDULE')),
  concurrency_limit integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists schedules_project_idx on public.schedules(project_id);

-- Usage tracking and cost management
create table if not exists public.usage_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  model_id uuid references public.models(id) on delete set null,
  operation_type text not null check (operation_type in ('MODEL_INVOCATION','TOOL_INVOCATION','MEMORY_ACCESS','VERIFICATION')),
  tokens_used integer not null default 0,
  cost numeric(10,6) not null default 0,
  timestamp timestamptz not null default now(),
  context jsonb not null default '{}'::jsonb
);

create index if not exists usage_records_project_idx on public.usage_records(project_id);
create index if not exists usage_records_date_idx on public.usage_records(timestamp);

-- Security audit logging
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null ,
  agent_id uuid references public.agents(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text not null,
  ip_address inet,
  user_agent text,
  request_data jsonb,
  response_data jsonb,
  success boolean not null default true,
  error_message text,
  timestamp timestamptz not null default now()
);

create index if not exists audit_logs_project_idx on public.audit_logs(project_id);
create index if not exists audit_logs_timestamp_idx on public.audit_logs(timestamp);

-- Webhook endpoints for external integrations
create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  url text not null,
  events text[] not null default '{}',
  secret text not null,
  active boolean not null default true,
  last_triggered timestamptz,
  retry_count integer not null default 0,
  max_retries integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists webhooks_project_idx on public.webhooks(project_id);

-- Triggers for updated_at timestamps
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

-- Apply triggers to tables with updated_at columns
create trigger touch_models_updated_at before update on public.models for each row execute function public.touch_updated_at();
create trigger touch_agents_updated_at before update on public.agents for each row execute function public.touch_updated_at();
create trigger touch_memory_entries_updated_at before update on public.memory_entries for each row execute function public.touch_updated_at();
create trigger touch_skills_updated_at before update on public.skills for each row execute function public.touch_updated_at();
create trigger touch_schedules_updated_at before update on public.schedules for each row execute function public.touch_updated_at();
create trigger touch_mcp_servers_updated_at before update on public.mcp_servers for each row execute function public.touch_updated_at();
create trigger touch_policy_rules_updated_at before update on public.policy_rules for each row execute function public.touch_updated_at();
create trigger touch_webhooks_updated_at before update on public.webhooks for each row execute function public.touch_updated_at();

-- RLS policies for new tables

-- Models: project members can access
create policy models_member_read on public.models for select to authenticated using(public.is_project_member(project_id));

-- Agents: project members with appropriate permissions
create policy agents_member_read on public.agents for select to authenticated using(public.is_project_member(project_id));
create policy agents_member_insert on public.agents for insert to authenticated using(public.is_project_member(project_id)) with check(created_by=current_setting('app.current_user_id')::uuid);

-- Model invocations: project members
create policy model_invocations_member_read on public.model_invocations for select to authenticated using(public.is_project_member(project_id));

-- Tool invocations: project members
create policy tool_invocations_member_read on public.tool_invocations for select to authenticated using(public.is_project_member(project_id));

-- MCP servers: project members
create policy mcp_servers_member_read on public.mcp_servers for select to authenticated using(public.is_project_member(project_id));

-- Policy rules: project members can manage
create policy policy_rules_member_all on public.policy_rules for all to authenticated using(public.is_project_member(project_id)) with check(public.is_project_member(project_id));

-- Verification runs: project members
create policy verification_runs_member_read on public.verification_runs for select to authenticated using(public.is_project_member(project_id));

-- Evidence: project members can read, only creators can insert
create policy evidence_member_read on public.evidence for select to authenticated using(exists(select 1 from public.missions m where m.id=mission_id and public.is_project_member(m.project_id)));
create policy evidence_member_insert on public.evidence for insert to authenticated with check(created_by=current_setting('app.current_user_id')::uuid);

-- Artifacts: project members
create policy artifacts_member_read on public.artifacts for select to authenticated using(public.is_project_member(project_id));

-- Usage records: project members
create policy usage_records_member_read on public.usage_records for select to authenticated using(public.is_project_member(project_id));

-- Audit logs: project members
create policy audit_logs_member_read on public.audit_logs for select to authenticated using(public.is_project_member(project_id));

-- Webhooks: project members
create policy webhooks_member_all on public.webhooks for all to authenticated using(public.is_project_member(project_id)) with check(public.is_project_member(project_id));

-- Event streaming handled via Neon WebSocket
create policy mission_events_realtime on public.mission_events for select to authenticated;
