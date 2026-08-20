import { Box, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

interface EmptyStateProps {
  title: string;
  message?: string;
}

export const EmptyState = ({ title, message }: EmptyStateProps) => (
  <Box p={8} textAlign="center" color="gray.500">
    <Text fontSize="lg" color="gray.700">
      {title}
    </Text>
    {message && (
      <Text fontSize="sm" mt={2}>
        {message}
      </Text>
    )}
  </Box>
);

interface LoadingStateProps {
  label?: string;
}

export const LoadingState = ({ label = 'Loading...' }: LoadingStateProps) => (
  <Box p={8} display="flex" alignItems="center" justifyContent="center" gap={3}>
    <Spinner size="md" />
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
  </Box>
);

interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => (
  <Alert status="error" variant="left-accent">
    <AlertIcon />
    {message}
  </Alert>
);
