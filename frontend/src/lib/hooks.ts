import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { missionApi, workspaceApi } from './endpoints';
import { POLLING_INTERVALS } from './constants';
import type { MissionCreateInput, WorkspaceCreateInput } from '../types';

const queryKeys = {
  workspaces: ['workspaces'] as const,
  missions: (workspaceId: string) => ['missions', workspaceId] as const,
  mission: (workspaceId: string, missionId: string) =>
    ['mission', workspaceId, missionId] as const,
};

// -- Workspaces --
export const useWorkspaces = () =>
  useQuery({
    queryKey: queryKeys.workspaces,
    queryFn: workspaceApi.list,
    refetchInterval: POLLING_INTERVALS.workspaces,
    staleTime: 10000,
  });

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: WorkspaceCreateInput) => workspaceApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.workspaces }),
  });
};

// -- Missions --
export const useMissions = (workspaceId: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.missions(workspaceId),
    queryFn: () => missionApi.list(workspaceId),
    enabled: enabled && Boolean(workspaceId),
    refetchInterval: POLLING_INTERVALS.missions,
  });

export const useMission = (workspaceId: string, missionId: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.mission(workspaceId, missionId),
    queryFn: () => missionApi.get(workspaceId, missionId),
    enabled: enabled && Boolean(workspaceId && missionId),
    refetchInterval: POLLING_INTERVALS.missions,
  });

export const useCreateMission = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MissionCreateInput) =>
      missionApi.create(workspaceId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.missions(workspaceId) }),
  });
};

export const useRunMission = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (missionId: string) => missionApi.run(workspaceId, missionId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.missions(workspaceId) }),
  });
};

export { queryKeys };
