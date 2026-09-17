/**
 * Frontend API Service - CodingAgent Command Center
 * Connects the React frontend to all /api/v1/backend endpoints
 */
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

/* --- Health --- */
export const healthCheck = async () => {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
};

/* --- Authentication --- */
export const auth = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },
  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, { credentials: 'include' });
    return handleResponse(res);
  },
  refreshToken: async (token) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return handleResponse(res);
  },
};

/* --- Workspaces --- */
export const workspaces = {
  getWorkspaces: async () => {
    const res = await fetch(`${API_BASE}/api/v1/workspaces`, { credentials: 'include' });
    return handleResponse(res);
  },
  createWorkspace: async (name, description) => {
    const res = await fetch(`${API_BASE}/api/v1/workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, description }),
    });
    return handleResponse(res);
  },
  getWorkspace: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/workspaces/${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  updateWorkspace: async (workspaceId, name, description) => {
    const res = await fetch(`${API_BASE}/api/v1/workspaces/${workspaceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, description }),
    });
    return handleResponse(res);
  },
  deleteWorkspace: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/workspaces/${workspaceId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(res);
  },
  getWorkspaceMembers: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/workspaces/${workspaceId}/members`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  addWorkspaceMember: async (workspaceId, userId, role) => {
    const res = await fetch(`${API_BASE}/api/v1/workspaces/${workspaceId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId, role }),
    });
    return handleResponse(res);
  },
  removeWorkspaceMember: async (workspaceId, memberId) => {
    const res = await fetch(`${API_BASE}/api/v1/workspaces/${workspaceId}/members/${memberId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(res);
  },
};

/* --- Users --- */
export const users = {
  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/api/v1/users/me`, { credentials: 'include' });
    return handleResponse(res);
  },
  updateProfile: async (username, avatar, bio) => {
    const res = await fetch(`${API_BASE}/api/v1/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, avatar, bio }),
    });
    return handleResponse(res);
  },
  changePassword: async (currentPassword, newPassword) => {
    const res = await fetch(`${API_BASE}/api/v1/users/me/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(res);
  },
};

/* --- Agents --- */
export const agents = {
  getAgents: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/agents?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  createAgent: async (workspaceId, name, description, modelProvider, modelName) => {
    const res = await fetch(`${API_BASE}/api/v1/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, name, description, modelProvider, modelName }),
    });
    return handleResponse(res);
  },
  getAgent: async (workspaceId, agentId) => {
    const res = await fetch(`${API_BASE}/api/v1/agents/${agentId}?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  updateAgent: async (workspaceId, agentId, name, description, status, modelProvider, modelName) => {
    const res = await fetch(`${API_BASE}/api/v1/agents/${agentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, name, description, status, modelProvider, modelName }),
    });
    return handleResponse(res);
  },
  deleteAgent: async (workspaceId, agentId) => {
    const res = await fetch(`${API_BASE}/api/v1/agents/${agentId}?workspaceId=${workspaceId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(res);
  },
  getAgentStatus: async (workspaceId, agentId) => {
    const res = await fetch(`${API_BASE}/api/v1/agents/${agentId}/status?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
};

/* --- Models --- */
export const models = {
  getModels: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/models?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  createModel: async (workspaceId, name, provider, modelName, apiKey, maxTokens, temperature) => {
    const res = await fetch(`${API_BASE}/api/v1/models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, name, provider, modelName, apiKey, maxTokens, temperature }),
    });
    return handleResponse(res);
  },
  getModel: async (workspaceId, modelId) => {
    const res = await fetch(`${API_BASE}/api/v1/models/${modelId}?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  updateModel: async (workspaceId, modelId, name, provider, modelName, apiKey, maxTokens, temperature) => {
    const res = await fetch(`${API_BASE}/api/v1/models/${modelId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, name, provider, modelName, apiKey, maxTokens, temperature }),
    });
    return handleResponse(res);
  },
  deleteModel: async (workspaceId, modelId) => {
    const res = await fetch(`${API_BASE}/api/v1/models/${modelId}?workspaceId=${workspaceId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(res);
  },
  routeModelRequest: async (workspaceId, modelProvider, modelName, prompt, variables) => {
    const res = await fetch(`${API_BASE}/api/v1/models/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, modelProvider, modelName, prompt, variables }),
    });
    return handleResponse(res);
  },
};

/* --- Missions (Plan → Execute → Verify) --- */
export const missions = {
  getMissions: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/missions?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  createMission: async (workspaceId, title, description, steps, priority) => {
    const res = await fetch(`${API_BASE}/api/v1/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, title, description, steps, priority }),
    });
    return handleResponse(res);
  },
  getMission: async (workspaceId, missionId) => {
    const res = await fetch(`${API_BASE}/api/v1/missions/${missionId}?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  updateMissionStep: async (workspaceId, missionId, stepIndex, status, evidenceHash, evidenceData) => {
    const res = await fetch(`${API_BASE}/api/v1/missions/${missionId}/step`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, missionId, stepIndex, status, evidenceHash, evidenceData }),
    });
    return handleResponse(res);
  },
  verifyMission: async (workspaceId, missionId) => {
    const res = await fetch(`${API_BASE}/api/v1/missions/${missionId}/verify?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  getVerificationDetails: async (workspaceId, missionId) => {
    const res = await fetch(`${API_BASE}/api/v1/verifications/details?workspaceId=${workspaceId}&missionId=${missionId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  cancelMission: async (workspaceId, missionId) => {
    const res = await fetch(`${API_BASE}/api/v1/missions/${missionId}/cancel?workspaceId=${workspaceId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(res);
  },
};

/* --- Tasks --- */
export const tasks = {
  getTasks: async (workspaceId, missionId) => {
    const url = missionId
      ? `${API_BASE}/api/v1/tasks?workspaceId=${workspaceId}&missionId=${missionId}`
      : `${API_BASE}/api/v1/tasks?workspaceId=${workspaceId}`;
    const res = await fetch(url, { credentials: 'include' });
    return handleResponse(res);
  },
  createTask: async (workspaceId, title, description, missionId, stepIndex, assignedTo) => {
    const res = await fetch(`${API_BASE}/api/v1/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, title, description, missionId, stepIndex, assignedTo }),
    });
    return handleResponse(res);
  },
  getTask: async (workspaceId, taskId) => {
    const res = await fetch(`${API_BASE}/api/v1/tasks/${taskId}?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  updateTask: async (workspaceId, taskId, status, result, evidenceHash, evidenceData) => {
    const res = await fetch(`${API_BASE}/api/v1/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, taskId, status, result, evidenceHash, evidenceData }),
    });
    return handleResponse(res);
  },
  deleteTask: async (workspaceId, taskId) => {
    const res = await fetch(`${API_BASE}/api/v1/tasks/${taskId}?workspaceId=${workspaceId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(res);
  },
};

/* --- Skills --- */
export const skills = {
  getSkills: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/skills?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  createSkill: async (workspaceId, name, description, capabilities, complexity) => {
    const res = await fetch(`${API_BASE}/api/v1/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, name, description, capabilities, complexity }),
    });
    return handleResponse(res);
  },
  getSkill: async (workspaceId, skillId) => {
    const res = await fetch(`${API_BASE}/api/v1/skills/${skillId}?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  updateSkill: async (workspaceId, skillId, name, description, capabilities, complexity) => {
    const res = await fetch(`${API_BASE}/api/v1/skills/${skillId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, name, description, capabilities, complexity }),
    });
    return handleResponse(res);
  },
  deleteSkill: async (workspaceId, skillId) => {
    const res = await fetch(`${API_BASE}/api/v1/skills/${skillId}?workspaceId=${workspaceId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(res);
  },
  assignSkillToAgent: async (workspaceId, agentId, skillId) => {
    const res = await fetch(`${API_BASE}/api/v1/skills/assign?workspaceId=${workspaceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ agentId, skillId }),
    });
    return handleResponse(res);
  },
  removeSkillFromAgent: async (workspaceId, agentId, skillId) => {
    const res = await fetch(`${API_BASE}/api/v1/skills/remove?workspaceId=${workspaceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ agentId, skillId }),
    });
    return handleResponse(res);
  },
};

/* --- Evidence (cryptographic ledger) --- */
export const evidence = {
  createEvidence: async (workspaceId, missionId, stepIndex, evidenceType, content, metadata) => {
    const res = await fetch(`${API_BASE}/api/v1/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, missionId, stepIndex, evidenceType, content, metadata }),
    });
    return handleResponse(res);
  },
  getEvidenceByMission: async (workspaceId, missionId) => {
    const res = await fetch(`${API_BASE}/api/v1/evidence/${missionId}?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  getEvidenceByStep: async (workspaceId, missionId, stepIndex) => {
    const res = await fetch(`${API_BASE}/api/v1/evidence/${missionId}/${stepIndex}?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
};

/* --- Artifacts --- */
export const artifacts = {
  createArtifact: async (workspaceId, missionId, stepIndex, type, data, fileUrl) => {
    const res = await fetch(`${API_BASE}/api/v1/artifacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, missionId, stepIndex, type, data, fileUrl }),
    });
    return handleResponse(res);
  },
  getArtifactsByMission: async (workspaceId, missionId) => {
    const res = await fetch(`${API_BASE}/api/v1/artifacts?missionId=${missionId}&workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  getArtifactByStep: async (workspaceId, missionId, stepIndex) => {
    const res = await fetch(`${API_BASE}/api/v1/artifacts?missionId=${missionId}&stepIndex=${stepIndex}&workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
};

/* --- Approvals --- */
export const approvals = {
  createApproval: async (workspaceId, missionId, taskId, riskLevel, description, requiredBy) => {
    const res = await fetch(`${API_BASE}/api/v1/approvals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, missionId, taskId, riskLevel, description, requiredBy }),
    });
    return handleResponse(res);
  },
  getApprovalsByMission: async (workspaceId, missionId) => {
    const res = await fetch(`${API_BASE}/api/v1/approvals/${missionId}?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  decideApproval: async (approvalId, decision, decidedBy) => {
    const res = await fetch(`${API_BASE}/api/v1/approvals/${approvalId}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalId, decision, decidedBy }),
    });
    return handleResponse(res);
  },
};

/* --- MCP (Model Context Protocol) --- */
export const mcp = {
  registerProvider: async (name, provider, version, capabilities, endpoint) => {
    const res = await fetch(`${API_BASE}/api/v1/mcp/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, provider, version, capabilities, endpoint }),
    });
    return handleResponse(res);
  },
  listProviders: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/mcp/providers?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  executeTool: async (workspaceId, provider, tool, parameters) => {
    const res = await fetch(`${API_BASE}/api/v1/mcp/tools?workspaceId=${workspaceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, tool, parameters }),
    });
    return handleResponse(res);
  },
  getCapabilities: async (workspaceId, provider) => {
    const res = await fetch(`${API_BASE}/api/v1/mcp/capabilities?workspaceId=${workspaceId}&provider=${provider}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
};

/* --- Schedules --- */
export const schedules = {
  getSchedules: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/schedules?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  createSchedule: async (workspaceId, name, missionId, cronExpression, enabled) => {
    const res = await fetch(`${API_BASE}/api/v1/schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, name, missionId, cronExpression, enabled }),
    });
    return handleResponse(res);
  },
  triggerSchedule: async (workspaceId, scheduleId) => {
    const res = await fetch(`${API_BASE}/api/v1/schedules/${scheduleId}/trigger?workspaceId=${workspaceId}`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(res);
  },
};

/* --- Events (SSE/event store) --- */
export const events = {
  getEvents: async (workspaceId) => {
    const res = await fetch(`${API_BASE}/api/v1/events?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  publishEvent: async (workspaceId, type, missionId, data, source) => {
    const res = await fetch(`${API_BASE}/api/v1/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, type, missionId, data, source }),
    });
    return handleResponse(res);
  },
  subscribeEvents: async (workspaceId, missionId) => {
    const res = await fetch(`${API_BASE}/api/v1/events/stream?workspaceId=${workspaceId}&missionId=${missionId}`, {
      credentials: 'include',
      headers: { Accept: 'text/event-stream' },
    });
    return handleResponse(res);
  },
};

/* --- Memory (agent context) --- */
export const memory = {
  getAgentMemory: async (workspaceId, agentId) => {
    const res = await fetch(`${API_BASE}/api/v1/memory/${agentId}?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
  saveAgentMemory: async (workspaceId, agentId, key, value, context, expiresAt) => {
    const res = await fetch(`${API_BASE}/api/v1/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, agentId, key, value, context, expiresAt }),
    });
    return handleResponse(res);
  },
  updateAgentMemory: async (workspaceId, agentId, memoryId, key, value, context) => {
    const res = await fetch(`${API_BASE}/api/v1/memory/${memoryId}?workspaceId=${workspaceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ agentId, key, value, context }),
    });
    return handleResponse(res);
  },
};