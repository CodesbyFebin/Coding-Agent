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

// Project types (alias for Workspace*, renamed to align with backend/DB)
export type ProjectRole = WorkspaceRole;
export type ProjectStatus = WorkspaceStatus;
export interface Project {
  id: ID;
  name: string;
  description?: string;
  role: ProjectRole;
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectCreateInput {
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

// ---- Marketing-site pillar architecture (merged from codingagent.in prod) ----

export type PostureType = 'ALLOW' | 'ASK' | 'DENY';

export interface Pillar {
  id: string;
  label: string;
  href: string;
  category: string;
  description: string;
  rationale?: string;
  verificationAspect?: string;
  external?: boolean;
  tags?: string[];
  relatedPillarIds?: string[];
  searchKeywords?: string[];
}

export interface PillarCategory {
  id: string;
  label: string;
  shortLabel?: string;
  description: string;
  items: Pillar[];
}

export interface AgentModeProfile {
  id: string;
  code: string;
  label: string;
  badgeClass: string;
  accentColor: string;
  glowColor: string;
  summary: string;
  primaryMission: string;
  allowedTools: string[];
  restrictedTools: string[];
  verificationRequirement: string;
  sampleWorkflow: string;
}

export interface ExecutionStage {
  step: number;
  name: string;
  headline: string;
  description: string;
  governanceAction: string;
  artifactsProduced: string[];
  safetyCheck: string;
}

export interface SecurityPolicyRule {
  capability: string;
  example: string;
  posture: PostureType;
  why: string;
  riskClass: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
}

export interface LocalRuntimeProfile {
  id: string;
  name: string;
  badge: 'LOCAL' | 'POLICY' | 'RULE';
  category: 'runtime' | 'routing';
  title: string;
  description: string;
  specSummary: string;
  recommendedHardware: string;
  privacyPosture: string;
}

export interface SurfacePlatform {
  id: string;
  type: string;
  name: string;
  description: string;
  capabilities: string[];
  integrationMethod: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'core' | 'mcp' | 'local' | 'security';
}

export interface TerminalLogEntry {
  type: 'prompt' | 'cmd' | 'step' | 'tool' | 'verify' | 'result' | 'comment';
  label?: string;
  text: string;
  status?: 'ALLOW' | 'ASK' | 'DENY';
}

export interface TerminalMissionPreset {
  id: string;
  name: string;
  command: string;
  description: string;
  logs: TerminalLogEntry[];
}
