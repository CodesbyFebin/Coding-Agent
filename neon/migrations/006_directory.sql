-- Directory profiles and evidence-backed governance assessments.
-- No sample scores or unverifiable profiles are inserted by migration.
CREATE TABLE IF NOT EXISTS directory_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('agent','framework','enterprise')),
  website_url TEXT,
  repository_url TEXT,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS directory_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES directory_agents(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('sandbox','audit','approvals','secrets','identity','privacy')),
  claim TEXT NOT NULL,
  source_url TEXT NOT NULL CHECK (source_url ~ '^https://'),
  status TEXT NOT NULL DEFAULT 'unreviewed' CHECK (status IN ('unreviewed','supported','contradicted')),
  reviewed_by UUID REFERENCES "User"(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_id, dimension, source_url)
);
CREATE INDEX IF NOT EXISTS directory_evidence_agent_idx ON directory_evidence(agent_id);
CREATE INDEX IF NOT EXISTS directory_agents_published_idx ON directory_agents(published, name);
COMMENT ON TABLE directory_evidence IS 'Evidence statuses are editorial assessments, not independent security certification.';
