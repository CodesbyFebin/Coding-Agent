import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

export const NotFoundPage = () => (
  <Box
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    p={6}
    bg="sovereign.bg"
    color="sovereign.text"
    background="radial-gradient(circle at 60% -20%, rgba(255,90,31,0.08), transparent 36%), sovereign.bg"
  >
    <Box textAlign="center">
      <Heading size="2xl" color="sovereign.flame" fontFamily="heading">
        404
      </Heading>
      <Text fontSize="lg" color="sovereign.muted" mt={2} mb={6}>
        This page doesn&#39;t exist in the Command Center.
      </Text>
      <Button as={RouterLink} to="/" colorScheme="brand">
        Back to Dashboard
      </Button>
    </Box>
  </Box>
);
