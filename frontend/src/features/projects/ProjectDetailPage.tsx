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

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projects, isLoading: wsLoading } = useWorkspaces();
  const { data: missions, isLoading, isError, error } = useMissions(
    projectId ?? ''
  );

  const project = projects?.find((p) => p.id === projectId);

  if (wsLoading) {
    return <LoadingState label="Loading project..." />;
  }
  if (!project) {
    return <ErrorState message="Project not found." />;
  }

  return (
    <Box>
      <HStack mb={2}>
        <Button
          as={RouterLink}
          to="/projects"
          size="sm"
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
        >
          Projects
        </Button>
      </HStack>
      <Heading size="lg">{project.name}</Heading>
      <Text color="sovereign.muted" fontSize="sm" mb={1}>
        {project.description || 'No description'}
      </Text>
      <Code fontSize="xs" color="sovereign.muted" mb={6} display="inline-block">
        id: {project.id} · role: {project.role} · status: {project.status}
      </Code>

      <HStack justify="space-between" mb={4} align="center">
        <Heading size="sm">Missions</Heading>
        <Button
          as={RouterLink}
          to={`/projects/${projectId}/missions`}
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
            <MissionRow key={m.id} mission={m} projectId={projectId!} />
          ))}
          {missions.length > 5 && (
            <Text fontSize="sm" color="sovereign.muted" mt={3} textAlign="center">
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
  projectId,
}: {
  mission: Mission;
  projectId: string;
}) => (
  <RouterLink
    to={`/projects/${projectId}/missions/${mission.id}`}
    style={{ textDecoration: 'none' }}
  >
    <Box
      bg="sovereign.panel"
      p={3}
      rounded="md"
      borderWidth="1px"
      borderColor="sovereign.line"
      mb={2}
      _hover={{ borderColor: 'brand.500' }}
      cursor="pointer"
    >
      <HStack justify="space-between" align="start">
        <Box flex={1}>
          <Text fontSize="sm" color="sovereign.text" noOfLines={1}>
            {mission.goal}
          </Text>
          <Text fontSize="xs" color="sovereign.dim" fontFamily="mono" mt={1}>
            {mission.mode} · {new Date(mission.createdAt).toLocaleString()}
          </Text>
        </Box>
        <MissionStatusBadge status={mission.status} />
      </HStack>
    </Box>
  </RouterLink>
);