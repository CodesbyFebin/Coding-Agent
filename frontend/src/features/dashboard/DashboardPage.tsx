import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useWorkspaces } from '../../lib/hooks';
import { useEventStream } from '../../realtime/useEventStream';
import {
  EmptyState,
  LoadingState,
  ErrorState,
} from '../../components/ui/States';
import type { RealtimeEvent, Workspace } from '../../types';

// Pull a human-readable message off an opaque realtime event payload.
const eventMessage = (payload: unknown): string | undefined =>
  payload && typeof payload === 'object' && 'message' in payload
    ? String((payload as { message: unknown }).message)
    : undefined;

export const DashboardPage = () => {
  const { data: workspaces, isLoading, isError, error } = useWorkspaces();
  const { events, connected } = useEventStream();

  return (
    <Box>
      <Heading size="lg" mb={2}>
        Dashboard
      </Heading>
      <Text color="gray.500" fontSize="sm" mb={6}>
        Mission control overview across all workspaces.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <StatCard label="Workspaces" value={workspaces?.length} />
        <StatCard
          label="SSE Connected"
          value={connected ? 1 : 0}
        />
        <StatCard label="Live Events" value={events.length} />
      </SimpleGrid>

      {isLoading ? (
        <LoadingState label="Loading workspaces..." />
      ) : isError ? (
        <ErrorState
          message={(error as Error)?.message ?? 'Failed to load workspaces'}
        />
      ) : !workspaces || workspaces.length === 0 ? (
        <EmptyState
          title="No workspaces yet"
          message="Create your first workspace to begin running missions."
        />
      ) : (
        <WorkspaceGrid workspaces={workspaces} />
      )}

      <LiveEventFeed events={events} />
    </Box>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | undefined;
}) => (
  <Box bg="white" p={5} rounded="md" shadow="sm" borderWidth="1px">
    <Stat>
      <StatLabel color="gray.500">{label}</StatLabel>
      <StatNumber fontSize="3xl">{value ?? '—'}</StatNumber>
    </Stat>
  </Box>
);

const WorkspaceGrid = ({ workspaces }: { workspaces: Workspace[] }) => (
  <Box>
    <Heading size="sm" mb={3}>
      Workspaces
    </Heading>
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {workspaces.map((w) => (
        <RouterLink key={w.id} to={`/workspaces/${w.id}`} style={{ textDecoration: 'none' }}>
          <Box
            bg="white"
            p={4}
            rounded="md"
            borderWidth="1px"
            _hover={{ borderColor: 'brand.500', shadow: 'md' }}
            cursor="pointer"
          >
            <Text fontWeight="semibold" color="gray.800">
              {w.name}
            </Text>
            <Text fontSize="sm" color="gray.500" noOfLines={2}>
              {w.description || 'No description'}
            </Text>
            <Flex justify="space-between" mt={3} fontSize="xs" color="gray.400">
              <span>{w.role}</span>
              <span>{w.status}</span>
            </Flex>
          </Box>
        </RouterLink>
      ))}
    </SimpleGrid>
  </Box>
);

const LiveEventFeed = ({ events }: { events: RealtimeEvent<unknown>[] }) => (
  <Box mt={8}>
    <Heading size="sm" mb={3}>
      Live Event Feed
    </Heading>
    {events.length === 0 ? (
      <Text fontSize="sm" color="gray.400">
        No events received. The SSE stream connects once the backend or mock
        service worker is live.
      </Text>
    ) : (
      <Box
        bg="white"
        p={4}
        rounded="md"
        borderWidth="1px"
        maxH="320px"
        overflowY="auto"
      >
        {events.slice(-20).reverse().map((e) => (
          <Box
            key={e.id}
            py={2}
            borderBottom="1px solid"
            borderColor="gray.100"
            _last={{ border: 'none' }}
          >
            <Flex align="center" gap={2} justify="space-between">
              <Text fontSize="xs" fontFamily="mono" color="gray.600">
                {e.type}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {new Date(e.timestamp).toLocaleTimeString()}
              </Text>
            </Flex>
            {eventMessage(e.payload) && (
              <Text fontSize="sm" color="gray.700" mt={1}>
                {eventMessage(e.payload)}
              </Text>
            )}
          </Box>
        ))}
      </Box>
    )}
  </Box>
);
