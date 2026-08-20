import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  HStack,
  Code,
  VStack,
  Button,
} from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useMission } from '../../lib/hooks';
import { LoadingState, ErrorState } from '../../components/ui/States';
import {
  MissionStatusBadge,
  VerificationStatusBadge,
} from '../../components/ui/StatusBadge';
import type {
  MissionEvidence,
  ModelInvocation,
} from '../../types';

export const MissionDetailPage = () => {
  const { workspaceId, missionId } = useParams<{
    workspaceId: string;
    missionId: string;
  }>();
  const { data: mission, isLoading, isError, error } = useMission(
    workspaceId ?? '',
    missionId ?? ''
  );

  if (isLoading) {
    return <LoadingState label="Loading mission..." />;
  }
  if (isError || !mission) {
    return (
      <ErrorState
        message={(error as Error)?.message ?? 'Mission not found'}
      />
    );
  }

  return (
    <Box>
      <HStack mb={2}>
        <Button
          as={RouterLink}
          to={`/workspaces/${workspaceId}/missions`}
          size="sm"
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
        >
          Missions
        </Button>
      </HStack>

      <HStack spacing={3} mb={2} align="center">
        <MissionStatusBadge status={mission.status} />
        <Text fontSize="xs" fontFamily="mono" color="gray.500">
          {mission.mode}
        </Text>
      </HStack>
      <Heading size="md" mb={2}>
        {mission.goal}
      </Heading>
      <Code fontSize="xs" color="gray.500" display="inline-block" mb={4}>
        id: {mission.id}
      </Code>

      {mission.mode !== 'INSTANT' && (
        <Box bg="yellow.50" p={3} rounded="md" mb={4} borderLeft="3px solid" borderColor="yellow.400">
          <Text fontSize="sm" color="yellow.700">
            Mode {mission.mode} is not implemented in the backend — running
            returns 501 without executing.
          </Text>
        </Box>
      )}

      {mission.status === 'FAILED' && (
        <Box bg="red.50" p={3} rounded="md" mb={4} borderLeft="3px solid" borderColor="red.400">
          <Text fontSize="sm" color="red.700">
            {mission.errorMessage || 'Mission failed with an unknown error.'}
          </Text>
        </Box>
      )}

      {mission.resultText && (
        <Box mb={6}>
          <Heading size="sm" mb={2}>
            Result
          </Heading>
          <Box
            as="pre"
            bg="gray.900"
            color="gray.100"
            p={4}
            rounded="md"
            fontSize="sm"
            whiteSpace="pre-wrap"
            fontFamily="mono"
          >
            {mission.resultText}
          </Box>
        </Box>
      )}

      <EvidenceSection evidence={mission.evidence} />
      <ModelInvocationsSection invocations={mission.modelInvocations} />
    </Box>
  );
};

const EvidenceSection = ({ evidence }: { evidence: MissionEvidence[] }) => (
  <Box mb={6}>
    <Heading size="sm" mb={2}>
      Evidence ({evidence.length})
    </Heading>
    {evidence.length === 0 ? (
      <Text fontSize="sm" color="gray.400">
        No evidence recorded for this mission.
      </Text>
    ) : (
      <VStack align="stretch" spacing={2}>
        {evidence.map((e) => (
          <Box
            key={e.id}
            bg="white"
            p={3}
            rounded="md"
            borderWidth="1px"
            fontSize="xs"
            fontFamily="mono"
            color="gray.600"
          >
            <HStack justify="space-between" align="start" mb={1}>
              <VerificationStatusBadge status={e.verificationStatus} />
              <Text>{e.evidenceType}</Text>
            </HStack>
            <Text>source: {e.sourceType} ({e.sourceRef || '—'})</Text>
            <Text color="gray.500" wordBreak="break-all" mt={1}>
              sha256: {e.contentHash}
            </Text>
          </Box>
        ))}
      </VStack>
    )}
  </Box>
);

const ModelInvocationsSection = ({
  invocations,
}: {
  invocations: ModelInvocation[];
}) => (
  <Box mb={6}>
    <Heading size="sm" mb={2}>
      Model Invocations ({invocations.length})
    </Heading>
    {invocations.length === 0 ? (
      <Text fontSize="sm" color="gray.400">
        No model invocations recorded for this mission.
      </Text>
    ) : (
      <VStack align="stretch" spacing={2}>
        {invocations.map((mi) => (
          <Box
            key={mi.id}
            bg="white"
            p={3}
            rounded="md"
            borderWidth="1px"
            fontSize="xs"
            fontFamily="mono"
            color="gray.600"
          >
            <HStack justify="space-between" mb={1}>
              <Text color={mi.success ? 'green.600' : 'red.600'}>
                {mi.success ? 'success' : 'failed'}
              </Text>
              <Text>latency: {mi.latencyMs ?? '—'}ms</Text>
            </HStack>
            <Text>
              tokens: {mi.promptTokens ?? '—'} / {mi.completionTokens ?? '—'}
            </Text>
            <Text color="gray.500" mt={1}>correlation: {mi.correlationId}</Text>
            {mi.errorMessage && (
              <Text color="red.600" mt={1}>error: {mi.errorMessage}</Text>
            )}
          </Box>
        ))}
      </VStack>
    )}
  </Box>
);

