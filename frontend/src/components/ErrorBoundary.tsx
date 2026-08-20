import React from 'react';
import { Box, Heading, Text, Code, Button } from '@chakra-ui/react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Catches render-time errors anywhere in the route tree so a single failing
// screen doesn't blank the whole SPA. Logs to console.error for visibility
// in deployed builds; never silently swallows errors.
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, message: '' });

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={6}
        >
          <Box maxW="xl" textAlign="center">
            <Heading size="md" mb={3}>
              Something went wrong
            </Heading>
            <Text color="gray.600" mb={4}>
              The Command Center hit an unexpected error while rendering this
              screen.
            </Text>
            <Code display="block" whiteSpace="pre-wrap" p={3} mb={4} fontSize="xs">
              {this.state.message}
            </Code>
            <Button colorScheme="brand" onClick={this.reset}>
              Try again
            </Button>
          </Box>
        </Box>
      );
    }
    return this.props.children;
  }
}
