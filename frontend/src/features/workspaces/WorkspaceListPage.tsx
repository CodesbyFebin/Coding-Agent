import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  HStack,
  VStack,
  SimpleGrid,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useWorkspaces, useCreateWorkspace } from '../../lib/hooks';
import {
  EmptyState,
  LoadingState,
  ErrorState,
} from '../../components/ui/States';
import type { Workspace } from '../../types';

export const WorkspaceListPage = () => {
  const { data: workspaces, isLoading, isError, error } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();
  const toast = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) {return;}
    try {
      await createWorkspace.mutateAsync({ name: name.trim(), description });
      setName('');
      setDescription('');
      toast({ title: 'Workspace created', status: 'success', duration: 3000 });
    } catch (e) {
      toast({
        title: 'Failed to create workspace',
        description: (e as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={2}>
        Workspaces
      </Heading>
      <Text color="gray.500" fontSize="sm" mb={6}>
        Manage isolated contexts for missions, agents, and evidence.
      </Text>

      <Box bg="white" p={5} rounded="md" borderWidth="1px" mb={8}>
        <Heading size="sm" mb={3}>
          New Workspace
        </Heading>
        <VStack spacing={3} align="stretch">
          <Input
            placeholder="Workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Workspace name"
            isDisabled={createWorkspace.isPending}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Workspace description"
            rows={2}
            resize="vertical"
            isDisabled={createWorkspace.isPending}
          />
          <HStack>
            <Button
              leftIcon={<Plus size={16} />}
              colorScheme="brand"
              onClick={handleCreate}
              isLoading={createWorkspace.isPending}
              isDisabled={!name.trim()}
            >
              Create Workspace
            </Button>
          </HStack>
        </VStack>
      </Box>

      {isLoading ? (
        <LoadingState label="Loading workspaces..." />
      ) : isError ? (
        <ErrorState
          message={(error as Error)?.message ?? 'Failed to load workspaces'}
        />
      ) : !workspaces || workspaces.length === 0 ? (
        <EmptyState
          title="No workspaces yet"
          message="Use the form above to create your first workspace."
        />
      ) : (
        <WorkspaceCardGrid workspaces={workspaces} />
      )}
    </Box>
  );
};

const WorkspaceCardGrid = ({ workspaces }: { workspaces: Workspace[] }) => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
    {workspaces.map((w) => (
      <RouterLink key={w.id} to={`/workspaces/${w.id}`} style={{ textDecoration: 'none' }}>
        <Box
          bg="white"
          p={4}
          rounded="md"
          borderWidth="1px"
          _hover={{ borderColor: 'brand.500', shadow: 'md' }}
          cursor="pointer"
          h="full"
        >
          <Text fontWeight="semibold" color="gray.800">
            {w.name}
          </Text>
          <Text fontSize="sm" color="gray.500" noOfLines={2} minH="40px" mt={1}>
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
);
