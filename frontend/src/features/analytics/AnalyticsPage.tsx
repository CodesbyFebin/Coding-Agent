import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { useWorkspaces } from '../../lib/hooks';
import { LoadingState, ErrorState } from '../../components/ui/States';

export const AnalyticsPage = () => {
  const { data: workspaces, isLoading, isError, error } = useWorkspaces();

  const activeCount = workspaces?.filter((w) => w.status === 'active').length ?? 0;
  const archivedCount = workspaces?.filter((w) => w.status === 'archived').length ?? 0;
  const ownedCount = workspaces?.filter((w) => w.role === 'owner').length ?? 0;

  return (
    <Box>
      <Heading size="lg" mb={2}>
        Analytics
      </Heading>
      <Text color="gray.500" fontSize="sm" mb={6}>
        Aggregate metrics across workspaces.
      </Text>

      {isLoading ? (
        <LoadingState label="Loading metrics..." />
      ) : isError ? (
        <ErrorState message={(error as Error)?.message ?? 'Failed to load analytics'} />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <MetricCard label="Total Workspaces" value={workspaces?.length} />
          <MetricCard label="Active Workspaces" value={activeCount} />
          <MetricCard label="Archived" value={archivedCount} />
          <MetricCard label="Owned by You" value={ownedCount} />
        </SimpleGrid>
      )}

      <Box mt={8}>
        <Heading size="sm" mb={2}>
          Note
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Per-mission analytics (latency percentiles, token usage, success
          rates) will populate once the backend metrics endpoints are live.
          The backend currently reports metrics in audit logs but does not yet
          expose an aggregation API.
        </Text>
      </Box>
    </Box>
  );
};

const MetricCard = ({
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
