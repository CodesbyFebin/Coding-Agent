// Shared API type contracts mirroring backend schemas.
// See backend/src/controllers/* and migrations for authoritative source.

export type ID = string;

export interface AuthUser {
  id: ID;
  email: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';
export type WorkspaceStatus = 'active' | 'archived';

export interface Workspace {
  id: ID;
  name: string;
  description?: string;
  role: WorkspaceRole;
  status: WorkspaceStatus;
  createdAt: string;
}

export interface WorkspaceCreateInput {
  name: string;
  description?: string;
}

export type MissionMode = 'INSTANT' | 'THINK' | 'AGENT' | 'SWARM' | 'AUTO';
export type MissionStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface Mission {
  id: ID;
  workspaceId: ID;
  goal: string;
  mode: MissionMode;
  status: MissionStatus;
  resultText?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MissionCreateInput {
  goal: string;
  mode: MissionMode;
}

export interface MissionDetail extends Mission {
  evidence: MissionEvidence[];
  modelInvocations: ModelInvocation[];
}

export type VerificationStatus =
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'FAILED'
  | 'PENDING';

export interface MissionEvidence {
  id: ID;
  missionId: ID;
  evidenceType: string;
  sourceType: string;
  sourceRef?: string | null;
  contentHash: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
}

export interface ModelInvocation {
  id: ID;
  missionId: ID;
  correlationId: string;
  success: boolean;
  latencyMs?: number | null;
  promptTokens?: number | null;
  completionTokens?: number | null;
  errorMessage?: string | null;
  createdAt: string;
}

export type RealtimeEventType =
  | 'MISSION_PROGRESS'
  | 'MISSION_COMPLETED'
  | 'MISSION_FAILED'
  | 'TASK_STARTED'
  | 'TASK_COMPLETED'
  | 'EVIDENCE_RECORDED'
  | 'APPROVAL_REQUIRED'
  | 'WORKER_STATUS';

export interface RealtimeEvent<T = unknown> {
  id: ID;
  type: RealtimeEventType;
  timestamp: string;
  payload: T;
}

export interface MissionProgressPayload {
  missionId: ID;
  progress: number;
  status: MissionStatus;
  message: string;
}
