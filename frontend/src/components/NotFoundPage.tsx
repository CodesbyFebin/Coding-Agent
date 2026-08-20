import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

export const NotFoundPage = () => (
  <Box
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    p={6}
    bg="gray.50"
  >
    <Box textAlign="center">
      <Heading size="2xl" color="brand.500">
        404
      </Heading>
      <Text fontSize="lg" color="gray.700" mt={2} mb={6}>
        This page doesn&#39;t exist in the Command Center.
      </Text>
      <Button as={RouterLink} to="/" colorScheme="brand">
        Back to Dashboard
      </Button>
    </Box>
  </Box>
);
