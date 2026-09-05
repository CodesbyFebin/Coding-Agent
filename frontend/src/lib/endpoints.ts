import { apiClient } from './api';
import type {
  AuthResponse,
  Mission,
  MissionCreateInput,
  MissionDetail,
  Project,
  ProjectCreateInput,
} from '../types';

// All data endpoints address projects (renamed from workspaces to align with
// the backend's DB tables and the MSW handlers).
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

// -- Projects --
export const projectApi = {
  list: async (): Promise<Project[]> => {
    const { data } = await apiClient.get<{ projects: Project[] }>('/projects');
    return data.projects;
  },
  create: async (input: ProjectCreateInput): Promise<Project> => {
    const { data } = await apiClient.post<{ project: Project }>('/projects', input);
    return data.project;
  },
};

// -- Missions --
export const missionApi = {
  list: async (projectId: string): Promise<Mission[]> => {
    const { data } = await apiClient.get<{ missions: Mission[] }>(
      `/projects/${projectId}/missions`
    );
    return data.missions;
  },
  get: async (projectId: string, missionId: string): Promise<MissionDetail> => {
    const { data } = await apiClient.get<MissionDetail>(
      `/projects/${projectId}/missions/${missionId}`
    );
    return data;
  },
  create: async (projectId: string, input: MissionCreateInput): Promise<Mission> => {
    const { data } = await apiClient.post<{ mission: Mission }>(
      `/projects/${projectId}/missions`,
      input
    );
    return data.mission;
  },
  run: async (projectId: string, missionId: string): Promise<{ mission: Mission }> => {
    const { data } = await apiClient.post(
      `/projects/${projectId}/missions/${missionId}/run`
    );
    return data;
  },
};
