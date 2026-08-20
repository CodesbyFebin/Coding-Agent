import { Box, Spinner, Text } from '@chakra-ui/react';

interface LoadingScreenProps {
  label?: string;
}

export const LoadingScreen = ({ label = 'Loading...' }: LoadingScreenProps) => (
  <Box
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    gap={3}
    role="status"
    aria-live="polite"
  >
    <Spinner size="xl" color="brand.500" thickness="3px" />
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
  </Box>
);
