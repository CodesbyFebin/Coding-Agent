-- CodingAgent.in application schema v1
-- PostgreSQL/Supabase authority; frontend is only a projection.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'MEMBER' check (role in ('OWNER','ADMIN','APPROVER','DEVELOPER','VIEWER','MEMBER')),
  created_at timestamptz not null default now(),
  primary key(project_id,user_id)
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  goal text not null check (char_length(goal) between 1 and 12000),
  mode text not null default 'AUTO' check (mode in ('INSTANT','THINK','AGENT','SWARM','AUTO')),
  classification text not null default 'INTERNAL' check (classification in ('PUBLIC','INTERNAL','CONFIDENTIAL','RESTRICTED')),
  status text not null default 'QUEUED' check (status in ('DRAFT','QUEUED','PLANNING','RUNNING','WAITING_APPROVAL','PAUSED','VERIFYING','COMPLETED','FAILED','CANCELLED','BLOCKED_PROVIDER','BLOCKED_POLICY','BLOCKED_DEPENDENCY')),
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  title text not null,
  kind text not null default 'ANALYSIS',
  status text not null default 'PENDING' check (status in ('PENDING','BLOCKED','READY','LEASED','RUNNING','WAITING_APPROVAL','WAITING_TOOL','RETRY_WAIT','SUCCEEDED','FAILED','CANCELLED','DEAD_LETTER')),
  position integer not null default 0,
  dependencies uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mission_events (
  id bigint generated always as identity primary key,
  mission_id uuid not null references public.missions(id) on delete cascade,
  sequence bigint not null,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  actor_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(mission_id,sequence)
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  action text not null,
  reason text,
  risk text not null default 'MEDIUM' check (risk in ('LOW','MEDIUM','HIGH','CRITICAL')),
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED','EXPIRED')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id) on delete set null
);

create table if not exists public.artifacts (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  name text not null,
  kind text not null default 'FILE',
  mime_type text,
  size_bytes bigint,
  sha256 text,
  storage_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.memory_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  scope text not null default 'PROJECT' check (scope in ('MISSION','PROJECT','USER','WORKSPACE','ORGANIZATION')),
  key text not null,
  value jsonb not null default '{}'::jsonb,
  review_status text not null default 'PENDING' check (review_status in ('PENDING','APPROVED','REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  version text not null default '0.1.0',
  status text not null default 'DRAFT' check (status in ('DRAFT','REVIEW','PUBLISHED','REJECTED','DEPRECATED')),
  instructions text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('ONCE','INTERVAL','CRON','WEBHOOK')),
  expression text,
  enabled boolean not null default false,
  mission_template jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists project_members_user_idx on public.project_members(user_id,project_id);
create index if not exists missions_project_status_idx on public.missions(project_id,status,created_at desc);
create index if not exists tasks_mission_status_idx on public.tasks(mission_id,status,position);
create index if not exists mission_events_mission_seq_idx on public.mission_events(mission_id,sequence desc);
create index if not exists approvals_mission_status_idx on public.approvals(mission_id,status,requested_at desc);
create index if not exists artifacts_mission_idx on public.artifacts(mission_id,created_at desc);
create index if not exists memory_project_idx on public.memory_entries(project_id,updated_at desc);
create index if not exists skills_project_idx on public.skills(project_id,updated_at desc);
create index if not exists schedules_project_idx on public.schedules(project_id,created_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(user_id,display_name) values(new.id,coalesce(new.raw_user_meta_data->>'name',split_part(new.email,'@',1))) on conflict do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.add_project_owner() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.project_members(project_id,user_id,role) values(new.id,new.owner_id,'OWNER') on conflict do nothing; return new; end $$;
drop trigger if exists project_owner_membership on public.projects;
create trigger project_owner_membership after insert on public.projects for each row execute function public.add_project_owner();

create or replace function public.is_project_member(p_project_id uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.project_members pm where pm.project_id=p_project_id and pm.user_id=auth.uid());
$$;

create or replace function public.append_mission_event(p_mission_id uuid,p_type text,p_payload jsonb default '{}'::jsonb) returns public.mission_events language plpgsql security invoker set search_path=public as $$
declare v_event public.mission_events; v_seq bigint;
begin
  if not exists(select 1 from public.missions m where m.id=p_mission_id and public.is_project_member(m.project_id)) then raise exception 'mission not found or access denied'; end if;
  perform 1 from public.missions where id=p_mission_id for update;
  select coalesce(max(sequence),0)+1 into v_seq from public.mission_events where mission_id=p_mission_id;
  insert into public.mission_events(mission_id,sequence,type,payload,actor_user_id) values(p_mission_id,v_seq,p_type,coalesce(p_payload,'{}'::jsonb),auth.uid()) returning * into v_event;
  return v_event;
end $$;

create or replace function public.create_mission_tx(p_project_id uuid,p_goal text,p_mode text default 'AUTO',p_classification text default 'INTERNAL') returns public.missions language plpgsql security invoker set search_path=public as $$
declare v_mission public.missions;
begin
  if not public.is_project_member(p_project_id) then raise exception 'project access denied'; end if;
  insert into public.missions(project_id,created_by,goal,mode,classification,status)
  values(p_project_id,auth.uid(),p_goal,p_mode,p_classification,'BLOCKED_PROVIDER') returning * into v_mission;
  perform public.append_mission_event(v_mission.id,'mission.created',jsonb_build_object('mode',p_mode,'classification',p_classification));
  perform public.append_mission_event(v_mission.id,'mission.blocked_provider',jsonb_build_object('reason','No model provider has been connected to this deployment.'));
  return v_mission;
end $$;

create or replace function public.decide_approval_tx(p_approval_id uuid,p_status text) returns public.approvals language plpgsql security invoker set search_path=public as $$
declare v public.approvals; v_project uuid;
begin
  if p_status not in ('APPROVED','REJECTED') then raise exception 'invalid approval decision'; end if;
  select m.project_id into v_project from public.approvals a join public.missions m on m.id=a.mission_id where a.id=p_approval_id;
  if v_project is null or not public.is_project_member(v_project) then raise exception 'approval access denied'; end if;
  update public.approvals set status=p_status,decided_at=now(),decided_by=auth.uid() where id=p_approval_id and status='PENDING' returning * into v;
  if v.id is null then raise exception 'approval is not pending'; end if;
  perform public.append_mission_event(v.mission_id,case when p_status='APPROVED' then 'approval.granted' else 'approval.rejected' end,jsonb_build_object('approvalId',v.id));
  return v;
end $$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.missions enable row level security;
alter table public.tasks enable row level security;
alter table public.mission_events enable row level security;
alter table public.approvals enable row level security;
alter table public.artifacts enable row level security;
alter table public.memory_entries enable row level security;
alter table public.skills enable row level security;
alter table public.schedules enable row level security;

revoke all on all tables in schema public from anon;
grant select,insert,update,delete on public.profiles,public.projects,public.project_members,public.missions,public.tasks,public.mission_events,public.approvals,public.artifacts,public.memory_entries,public.skills,public.schedules to authenticated;
grant usage,select on all sequences in schema public to authenticated;
grant execute on function public.is_project_member(uuid),public.append_mission_event(uuid,text,jsonb),public.create_mission_tx(uuid,text,text,text),public.decide_approval_tx(uuid,text) to authenticated;

create policy profiles_self on public.profiles for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy projects_members_read on public.projects for select to authenticated using(public.is_project_member(id));
create policy projects_owner_insert on public.projects for insert to authenticated with check(owner_id=auth.uid());
create policy projects_owner_update on public.projects for update to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());
create policy projects_owner_delete on public.projects for delete to authenticated using(owner_id=auth.uid());
create policy project_members_member_read on public.project_members for select to authenticated using(public.is_project_member(project_id));
create policy project_members_owner_write on public.project_members for all to authenticated using(exists(select 1 from public.projects p where p.id=project_id and p.owner_id=auth.uid())) with check(exists(select 1 from public.projects p where p.id=project_id and p.owner_id=auth.uid()));
create policy missions_member_all on public.missions for all to authenticated using(public.is_project_member(project_id)) with check(public.is_project_member(project_id) and created_by=auth.uid());
create policy tasks_member_all on public.tasks for all to authenticated using(exists(select 1 from public.missions m where m.id=mission_id and public.is_project_member(m.project_id))) with check(exists(select 1 from public.missions m where m.id=mission_id and public.is_project_member(m.project_id)));
create policy events_member_read on public.mission_events for select to authenticated using(exists(select 1 from public.missions m where m.id=mission_id and public.is_project_member(m.project_id)));
create policy events_member_insert on public.mission_events for insert to authenticated with check(exists(select 1 from public.missions m where m.id=mission_id and public.is_project_member(m.project_id)));
create policy approvals_member_all on public.approvals for all to authenticated using(exists(select 1 from public.missions m where m.id=mission_id and public.is_project_member(m.project_id))) with check(exists(select 1 from public.missions m where m.id=mission_id and public.is_project_member(m.project_id)));
create policy artifacts_member_all on public.artifacts for all to authenticated using(exists(select 1 from public.missions m where m.id=mission_id and public.is_project_member(m.project_id))) with check(exists(select 1 from public.missions m where m.id=mission_id and public.is_project_member(m.project_id)));
create policy memory_member_all on public.memory_entries for all to authenticated using(public.is_project_member(project_id)) with check(public.is_project_member(project_id) and created_by=auth.uid());
create policy skills_member_all on public.skills for all to authenticated using(public.is_project_member(project_id)) with check(public.is_project_member(project_id) and created_by=auth.uid());
create policy schedules_member_all on public.schedules for all to authenticated using(public.is_project_member(project_id)) with check(public.is_project_member(project_id) and created_by=auth.uid());

do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='mission_events') then
    alter publication supabase_realtime add table public.mission_events;
  end if;
end $$;
