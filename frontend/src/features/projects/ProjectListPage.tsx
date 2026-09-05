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
import type { Project } from '../../types';

export const ProjectListPage = () => {
  const { data: projects, isLoading, isError, error } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();
  const toast = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await createWorkspace.mutateAsync({ name: name.trim(), description });
      setName('');
      setDescription('');
      toast({ title: 'Project created', status: 'success', duration: 3000 });
    } catch (e) {
      toast({
        title: 'Failed to create project',
        description: (e as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={2}>
        Projects
      </Heading>
      <Text color="sovereign.muted" fontSize="sm" mb={6}>
        Manage isolated contexts for missions, agents, and evidence.
      </Text>

      <Box bg="sovereign.panel" p={5} rounded="md" borderWidth="1px" borderColor="sovereign.line" mb={8}>
        <Heading size="sm" mb={3}>
          New Project
        </Heading>
        <VStack spacing={3} align="stretch">
          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Project name"
            isDisabled={createWorkspace.isPending}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Project description"
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
              Create Project
            </Button>
          </HStack>
        </VStack>
      </Box>

      {isLoading ? (
        <LoadingState label="Loading projects..." />
      ) : isError ? (
        <ErrorState
          message={(error as Error)?.message ?? 'Failed to load projects'}
        />
      ) : !projects || projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          message="Use the form above to create your first project."
        />
      ) : (
        <ProjectCardGrid projects={projects} />
      )}
    </Box>
  );
};

const ProjectCardGrid = ({ projects }: { projects: Project[] }) => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
    {projects.map((p) => (
      <RouterLink key={p.id} to={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
        <Box
          bg="sovereign.panel"
          p={4}
          rounded="md"
          borderWidth="1px"
          borderColor="sovereign.line"
          _hover={{ borderColor: 'brand.500', shadow: 'md' }}
          cursor="pointer"
          h="full"
        >
          <Text fontWeight="semibold" color="sovereign.text">
            {p.name}
          </Text>
          <Text fontSize="sm" color="sovereign.muted" noOfLines={2} minH="40px" mt={1}>
            {p.description || 'No description'}
          </Text>
          <Flex justify="space-between" mt={3} fontSize="xs" color="sovereign.dim">
            <span>{p.role}</span>
            <span>{p.status}</span>
          </Flex>
        </Box>
      </RouterLink>
    ))}
  </SimpleGrid>
);