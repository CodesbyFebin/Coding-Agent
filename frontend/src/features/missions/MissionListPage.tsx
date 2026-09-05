import { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Textarea,
  Select,
  Button,
  HStack,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { Plus, ArrowLeft, Play } from 'lucide-react';
import { useMissions, useCreateMission, useRunMission } from '../../lib/hooks';
import {
  EmptyState,
  LoadingState,
  ErrorState,
} from '../../components/ui/States';
import { MissionStatusBadge } from '../../components/ui/StatusBadge';
import type { Mission, MissionMode } from '../../types';

const MODE_OPTIONS: { value: MissionMode; label: string }[] = [
  { value: 'INSTANT', label: 'INSTANT — single model call (implemented in backend)' },
  { value: 'THINK', label: 'THINK — planning + execution (backend 501)' },
  { value: 'AGENT', label: 'AGENT — task graph (backend 501)' },
];

export const MissionListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: missions, isLoading, isError, error } = useMissions(projectId ?? '');
  const createMission = useCreateMission(projectId ?? '');
  const runMission = useRunMission(projectId ?? '');
  const toast = useToast();

  const [goal, setGoal] = useState('');
  const [mode, setMode] = useState<MissionMode>('INSTANT');

  const handleCreate = async () => {
    if (!goal.trim() || !projectId) return;
    try {
      await createMission.mutateAsync({ goal: goal.trim(), mode });
      setGoal('');
      toast({ title: 'Mission created', status: 'success', duration: 3000 });
    } catch (e) {
      toast({
        title: 'Failed to create mission',
        description: (e as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleRun = async (missionId: string) => {
    try {
      await runMission.mutateAsync(missionId);
      toast({
        title: 'Mission run triggered',
        status: 'success',
        duration: 3000,
      });
    } catch (e) {
      toast({
        title: 'Mission run failed',
        description: (e as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box>
      <HStack mb={2}>
        <Button
          as={RouterLink}
          to={`/projects/${projectId}`}
          size="sm"
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
        >
          Project
        </Button>
      </HStack>
      <Heading size="lg" mb={2}>
        Missions
      </Heading>
      <Text color="sovereign.muted" fontSize="sm" mb={6}>
        Create and execute agentic missions in this project.
      </Text>

      <Box bg="sovereign.panel" p={5} rounded="md" borderWidth="1px" borderColor="sovereign.line" mb={8}>
        <Heading size="sm" mb={3}>
          New Mission
        </Heading>
        <VStack spacing={3} align="stretch">
          <Textarea
            placeholder="What should this mission accomplish?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            aria-label="Mission goal"
            rows={3}
            resize="vertical"
            isDisabled={createMission.isPending}
          />
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value as MissionMode)}
            aria-label="Mission mode"
            isDisabled={createMission.isPending}
          >
            {MODE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <Button
            leftIcon={<Plus size={16} />}
            colorScheme="brand"
            onClick={handleCreate}
            isLoading={createMission.isPending}
            isDisabled={!goal.trim() || !projectId}
          >
            Create Mission
          </Button>
        </VStack>
      </Box>

      {isLoading ? (
        <LoadingState label="Loading missions..." />
      ) : isError ? (
        <ErrorState message={(error as Error)?.message ?? 'Failed to load missions'} />
      ) : !missions || missions.length === 0 ? (
        <EmptyState
          title="No missions yet"
          message="Use the form above to create your first mission."
        />
      ) : (
        <VStack align="stretch" spacing={2}>
          {missions.map((m) => (
            <MissionRow
              key={m.id}
              mission={m}
              projectId={projectId!}
              onRun={handleRun}
              isRunning={runMission.isPending && runMission.variables === m.id}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};

interface MissionRowProps {
  mission: Mission;
  projectId: string;
  onRun: (missionId: string) => void;
  isRunning: boolean;
}

const MissionRow = ({ mission, projectId, onRun, isRunning }: MissionRowProps) => (
  <RouterLink
    to={`/projects/${projectId}/missions/${mission.id}`}
    style={{ textDecoration: 'none' }}
  >
    <Box
      bg="sovereign.panel"
      p={4}
      rounded="md"
      borderWidth="1px"
      borderColor="sovereign.line"
      _hover={{ borderColor: 'brand.500', shadow: 'sm' }}
      cursor="pointer"
    >
      <HStack justify="space-between" align="start" spacing={4}>
        <Box flex={1}>
          <Text fontSize="sm" color="sovereign.text" fontWeight="medium" noOfLines={2}>
            {mission.goal}
          </Text>
          <Text fontSize="xs" color="sovereign.dim" fontFamily="mono" mt={1}>
            {mission.mode} · {new Date(mission.createdAt).toLocaleString()}
          </Text>
        </Box>
        <HStack spacing={2}>
          <MissionStatusBadge status={mission.status} />
          <Button
            as="div"
            size="xs"
            variant="outline"
            colorScheme="brand"
            leftIcon={<Play size={12} />}
            isLoading={isRunning}
            onClick={(e) => {
              e.preventDefault();
              onRun(mission.id);
            }}
          >
            Run
          </Button>
        </HStack>
      </HStack>
    </Box>
  </RouterLink>
);