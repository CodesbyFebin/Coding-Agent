import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useAuthStore } from '../../stores/authStore';
import { useEventStream } from '../../realtime/useEventStream';
import { useWorkspaces, useCreateMission } from '../../lib/hooks';
import type { MissionMode } from '../../types';

const QUICK_PROMPTS = [
  'Verify the React 18 build pipeline',
  'Execute live integration test',
  'Generate sitemap.xml',
  'Run security scan',
  'Deploy to production',
];

const MODE_OPTIONS: MissionMode[] = ['INSTANT', 'THINK', 'AGENT', 'SWARM', 'AUTO'];

export const DashboardPage = () => {
  const { user } = useAuthStore((s) => s);
  const { events } = useEventStream();
  const { data: projects } = useWorkspaces();
  const toast = useToast();

  const [mode, setMode] = useState<MissionMode>('INSTANT');
  const [goal, setGoal] = useState('');

  // Missions are always created inside a project. With no project selected in
  // the topbar yet, target the first project returned for the signed-in user;
  // without any, surface an honest message instead of a doomed request.
  const firstProjectId = projects?.[0]?.id;
  const createMission = useCreateMission(firstProjectId ?? '');

  const runMission = async () => {
    if (!goal.trim()) {return;}
    if (!firstProjectId) {
      toast({
        title: 'No project available',
        description: 'Create a project first — missions are persisted per project.',
        status: 'warning',
        duration: 5000,
      });
      return;
    }
    try {
      const mission = await createMission.mutateAsync({
        goal: goal.trim(),
        mode,
      });
      setGoal('');
      toast({
        title: 'Mission persisted',
        description: `Status: ${mission.status}`,
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to create mission',
        description: (err as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box p={12} sx={{ maxW: '960px', mx: 'auto' }}>
      <VStack spacing={4}>
        <VStack spacing={1}>
          <Heading size="2xl" fontWeight="bold">
            {user?.username ? `Hey, ${user.username}` : 'CodingAgent Command Center'}
          </Heading>
          <Text color="sovereign.muted" fontSize="sm">
            {events.length > 0 ? 'Live event stream active' : 'SSE disconnected'}
          </Text>
        </VStack>

        <Box
          bg="sovereign.panel2"
          border="1px solid"
          borderColor="sovereign.line"
          rounded="lg"
          p={4}
          mt={4}
          fontSize="sm"
          color="sovereign.muted"
          lineHeight="1.5"
        >
          RUNTIME TRUTH — persistent missions, approvals and events come from the
          configured backend only. Until a backend is configured, surfaces that
          depend on live data will show BLOCKED / CONFIGURED / ERROR states
          faithfully. No shell command, execution result, or MCP capability is
          fabricated in the browser.
        </Box>

        <FormControl isInvalid={!!goal && goal.trim().length === 0} mb={6}>
          <FormLabel>Run a mission</FormLabel>
          <VStack spacing={3} align="center">
            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value as MissionMode)}
              aria-label="Mission mode"
              width="200px"
            >
              {MODE_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Mission goal..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              width="300px"
            />
            <Button
              onClick={runMission}
              colorScheme="brand"
              size="sm"
              isLoading={createMission.isPending}
            >
              Run
            </Button>
          </VStack>
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
          {QUICK_PROMPTS.map((prompt) => (
            <Button
              key={prompt}
              variant="ghost"
              size="sm"
              width="100%"
              mt={2}
              onClick={() => setGoal(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </SimpleGrid>

        <Box mt={8}>
          <Heading size="sm" mb={3}>Live Event Feed</Heading>
          {events.length === 0 ? (
            <Text fontSize="sm" color="sovereign.muted">
              No events received. The SSE stream connects once the backend or
              mock service worker is live.
            </Text>
          ) : (
            <Box
              bg="sovereign.panel"
              p={4}
              rounded="md"
              borderWidth="1px"
              borderColor="sovereign.line"
              maxH="320px"
              overflowY="auto"
            >
              {events.slice(-20).reverse().map((e) => (
                <Box
                  key={e.id}
                  py={2}
                  borderBottom="1px solid"
                  borderColor="sovereign.line"
                  _last={{ border: 'none' }}
                >
                  <Text fontSize="xs" fontFamily="mono" color="sovereign.muted">
                    {e.type}
                  </Text>
                  <Text fontSize="xs" color="sovereign.dim">
                    {new Date(e.timestamp).toLocaleTimeString()}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};