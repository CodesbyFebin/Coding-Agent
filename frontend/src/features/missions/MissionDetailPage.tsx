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
  const { projectId, missionId } = useParams<{
    projectId: string;
    missionId: string;
  }>();
  const { data: mission, isLoading, isError, error } = useMission(
    projectId ?? '',
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
          to={`/projects/${projectId}/missions`}
          size="sm"
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
        >
          Missions
        </Button>
      </HStack>

      <HStack spacing={3} mb={2} align="center">
        <MissionStatusBadge status={mission.status} />
        <Text fontSize="xs" fontFamily="mono" color="sovereign.muted">
          {mission.mode}
        </Text>
      </HStack>
      <Heading size="md" mb={2}>
        {mission.goal}
      </Heading>
      <Code fontSize="xs" color="sovereign.muted" display="inline-block" mb={4}>
        id: {mission.id}
      </Code>

      {mission.mode !== 'INSTANT' && (
        <Box bg="rgba(245,185,66,0.06)" p={3} rounded="md" mb={4} borderLeft="3px solid" borderColor="sovereign.warn">
          <Text fontSize="sm" color="sovereign.warn">
            Mode {mission.mode} is not implemented in the backend — running
            returns 501 without executing.
          </Text>
        </Box>
      )}

      {mission.status === 'FAILED' && (
        <Box bg="rgba(255,107,107,0.06)" p={3} rounded="md" mb={4} borderLeft="3px solid" borderColor="sovereign.bad">
          <Text fontSize="sm" color="sovereign.bad">
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
      <Text fontSize="sm" color="sovereign.dim">
        No evidence recorded for this mission.
      </Text>
    ) : (
      <VStack align="stretch" spacing={2}>
        {evidence.map((e) => (
          <Box
            key={e.id}
            bg="sovereign.panel"
            p={3}
            rounded="md"
            borderWidth="1px"
            borderColor="sovereign.line"
            fontSize="xs"
            fontFamily="mono"
            color="sovereign.muted"
          >
            <HStack justify="space-between" align="start" mb={1}>
              <VerificationStatusBadge status={e.verificationStatus} />
              <Text>{e.evidenceType}</Text>
            </HStack>
            <Text>source: {e.sourceType} ({e.sourceRef || '—'})</Text>
            <Text color="sovereign.dim" wordBreak="break-all" mt={1}>
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
      <Text fontSize="sm" color="sovereign.dim">
        No model invocations recorded for this mission.
      </Text>
    ) : (
      <VStack align="stretch" spacing={2}>
        {invocations.map((mi) => (
          <Box
            key={mi.id}
            bg="sovereign.panel"
            p={3}
            rounded="md"
            borderWidth="1px"
            borderColor="sovereign.line"
            fontSize="xs"
            fontFamily="mono"
            color="sovereign.muted"
          >
            <HStack justify="space-between" mb={1}>
              <Text color={mi.success ? 'sovereign.good' : 'sovereign.bad'}>
                {mi.success ? 'success' : 'failed'}
              </Text>
              <Text>latency: {mi.latencyMs ?? '—'}ms</Text>
            </HStack>
            <Text>
              tokens: {mi.promptTokens ?? '—'} / {mi.completionTokens ?? '—'}
            </Text>
            <Text color="sovereign.dim" mt={1}>correlation: {mi.correlationId}</Text>
            {mi.errorMessage && (
              <Text color="sovereign.bad" mt={1}>error: {mi.errorMessage}</Text>
            )}
          </Box>
        ))}
      </VStack>
    )}
  </Box>
);

