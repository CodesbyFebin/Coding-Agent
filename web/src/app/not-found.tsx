import Link from 'next/link';
import { Box, Heading, Text, Button, Container } from '@chakra-ui/react';

export default function NotFound() {
  return (
    <Container maxW="container.xl" py={20}>
      <Box textAlign="center">
        <Heading as="h1" size="2xl" color="sovereign.flame" fontFamily="heading">
          404
        </Heading>
        <Text fontSize="lg" color="sovereign.muted" mt={2} mb={6}>
          This page doesn&#39;t exist in the Command Center.
        </Text>
        <Button as={Link} href="/" colorScheme="brand">
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
