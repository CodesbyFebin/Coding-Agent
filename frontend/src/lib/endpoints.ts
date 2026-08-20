import { apiClient } from './api';
import type {
  AuthResponse,
  Mission,
  MissionCreateInput,
  MissionDetail,
  Workspace,
  WorkspaceCreateInput,
} from '../types';

// -- Auth --
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  },
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
    });
    return data;
  },
};

// -- Workspaces --
export const workspaceApi = {
  list: async (): Promise<Workspace[]> => {
    const { data } = await apiClient.get<{ workspaces: Workspace[] }>(
      '/workspaces'
    );
    return data.workspaces;
  },
  create: async (input: WorkspaceCreateInput): Promise<Workspace> => {
    const { data } = await apiClient.post<{ workspace: Workspace }>(
      '/workspaces',
      input
    );
    return data.workspace;
  },
};

// -- Missions --
export const missionApi = {
  list: async (workspaceId: string): Promise<Mission[]> => {
    const { data } = await apiClient.get<{ missions: Mission[] }>(
      `/workspaces/${workspaceId}/missions`
    );
    return data.missions;
  },
  get: async (
    workspaceId: string,
    missionId: string
  ): Promise<MissionDetail> => {
    const { data } = await apiClient.get<MissionDetail>(
      `/workspaces/${workspaceId}/missions/${missionId}`
    );
    return data;
  },
  create: async (
    workspaceId: string,
    input: MissionCreateInput
  ): Promise<Mission> => {
    const { data } = await apiClient.post<{ mission: Mission }>(
      `/workspaces/${workspaceId}/missions`,
      input
    );
    return data.mission;
  },
  run: async (
    workspaceId: string,
    missionId: string
  ): Promise<{ mission: Mission }> => {
    const { data } = await apiClient.post(
      `/workspaces/${workspaceId}/missions/${missionId}/run`
    );
    return data;
  },
};
