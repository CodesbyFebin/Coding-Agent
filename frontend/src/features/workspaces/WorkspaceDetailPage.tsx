import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Button, HStack, Code } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useWorkspaces } from '../../lib/hooks';
import { useMissions } from '../../lib/hooks';
import {
  EmptyState,
  LoadingState,
  ErrorState,
} from '../../components/ui/States';
import { MissionStatusBadge } from '../../components/ui/StatusBadge';
import type { Mission } from '../../types';

export const WorkspaceDetailPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: workspaces, isLoading: wsLoading } = useWorkspaces();
  const { data: missions, isLoading, isError, error } = useMissions(
    workspaceId ?? ''
  );

  const workspace = workspaces?.find((w) => w.id === workspaceId);

  if (wsLoading) {
    return <LoadingState label="Loading workspace..." />;
  }
  if (!workspace) {
    return <ErrorState message="Workspace not found." />;
  }

  return (
    <Box>
      <HStack mb={2}>
        <Button
          as={RouterLink}
          to="/workspaces"
          size="sm"
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
        >
          Workspaces
        </Button>
      </HStack>
      <Heading size="lg">{workspace.name}</Heading>
      <Text color="gray.500" fontSize="sm" mb={1}>
        {workspace.description || 'No description'}
      </Text>
      <Code fontSize="xs" color="gray.500" mb={6} display="inline-block">
        id: {workspace.id} · role: {workspace.role} · status: {workspace.status}
      </Code>

      <HStack justify="space-between" mb={4} align="center">
        <Heading size="sm">Missions</Heading>
        <Button
          as={RouterLink}
          to={`/workspaces/${workspaceId}/missions`}
          size="sm"
          colorScheme="brand"
        >
          View all / Create
        </Button>
      </HStack>

      {isLoading ? (
        <LoadingState label="Loading missions..." />
      ) : isError ? (
        <ErrorState
          message={(error as Error)?.message ?? 'Failed to load missions'}
        />
      ) : !missions || missions.length === 0 ? (
        <EmptyState
          title="No missions yet"
          message="Create a mission to begin executing agentic workflows."
        />
      ) : (
        <Box>
          {missions.slice(0, 5).map((m) => (
            <MissionRow key={m.id} mission={m} workspaceId={workspaceId!} />
          ))}
          {missions.length > 5 && (
            <Text fontSize="sm" color="gray.500" mt={3} textAlign="center">
              +{missions.length - 5} more — see all
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

const MissionRow = ({
  mission,
  workspaceId,
}: {
  mission: Mission;
  workspaceId: string;
}) => (
  <RouterLink
    to={`/workspaces/${workspaceId}/missions/${mission.id}`}
    style={{ textDecoration: 'none' }}
  >
    <Box
      bg="white"
      p={3}
      rounded="md"
      borderWidth="1px"
      mb={2}
      _hover={{ borderColor: 'brand.500' }}
      cursor="pointer"
    >
      <HStack justify="space-between" align="start">
        <Box flex={1}>
          <Text fontSize="sm" color="gray.800" noOfLines={1}>
            {mission.goal}
          </Text>
          <Text fontSize="xs" color="gray.400" fontFamily="mono" mt={1}>
            {mission.mode} · {new Date(mission.createdAt).toLocaleString()}
          </Text>
        </Box>
        <MissionStatusBadge status={mission.status} />
      </HStack>
    </Box>
  </RouterLink>
);
