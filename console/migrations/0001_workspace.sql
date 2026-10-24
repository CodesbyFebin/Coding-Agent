-- Per-user coding console state. The authenticated user ID is always derived
-- server-side from Better Auth, never accepted from the request body.
CREATE TABLE IF NOT EXISTS coding_workspace_state (
  user_id TEXT PRIMARY KEY,
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  revision BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
