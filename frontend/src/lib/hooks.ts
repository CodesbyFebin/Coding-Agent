import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { missionApi, projectApi } from './endpoints';
import { POLLING_INTERVALS } from './constants';
import type { MissionCreateInput, ProjectCreateInput } from '../types';

const queryKeys = {
  projects: ['projects'] as const,
  missions: (projectId: string) => ['missions', projectId] as const,
  mission: (projectId: string, missionId: string) =>
    ['mission', projectId, missionId] as const,
};

// -- Projects (legacy hook names kept for existing call sites) --
export const useWorkspaces = () =>
  useQuery({
    queryKey: queryKeys.projects,
    queryFn: projectApi.list,
    refetchInterval: POLLING_INTERVALS.workspaces,
    staleTime: 10000,
  });

export const useProjects = useWorkspaces;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectCreateInput) => projectApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects }),
  });
};

export const useCreateProject = useCreateWorkspace;

// -- Missions --
export const useMissions = (projectId: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.missions(projectId),
    queryFn: () => missionApi.list(projectId),
    enabled: enabled && Boolean(projectId),
    refetchInterval: POLLING_INTERVALS.missions,
  });

export const useMission = (projectId: string, missionId: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.mission(projectId, missionId),
    queryFn: () => missionApi.get(projectId, missionId),
    enabled: enabled && Boolean(projectId && missionId),
    refetchInterval: POLLING_INTERVALS.missions,
  });

export const useCreateMission = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MissionCreateInput) =>
      missionApi.create(projectId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.missions(projectId) }),
  });
};

export const useRunMission = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (missionId: string) => missionApi.run(projectId, missionId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.missions(projectId) }),
  });
};

export { queryKeys };
