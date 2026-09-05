import { Box, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

interface EmptyStateProps {
  title: string;
  message?: string;
}

export const EmptyState = ({ title, message }: EmptyStateProps) => (
  <Box
    p={8}
    textAlign="center"
    color="sovereign.dim"
    border="1px dashed"
    borderColor="sovereign.line2"
    rounded="12px"
    bg="sovereign.panel"
  >
    <Text fontSize="lg" color="sovereign.muted" fontFamily="heading" fontWeight={800}>
      {title}
    </Text>
    {message && (
      <Text fontSize="sm" mt={2} color="sovereign.dim">
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
    <Spinner size="md" color="sovereign.accent" thickness="3px" />
    <Text fontSize="sm" color="sovereign.muted">
      {label}
    </Text>
  </Box>
);

interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => (
  <Alert status="error" variant="left-accent" rounded="md">
    <AlertIcon />
    <Text fontSize="sm" color="sovereign.text">
      {message}
    </Text>
  </Alert>
);
