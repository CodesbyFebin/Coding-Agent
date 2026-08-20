import { Navigate } from 'react-router-dom';
import { Box, Text, Spinner } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

interface AuthWrapperProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

export const AuthWrapper = ({ 
  children, 
  redirectIfAuthenticated = false 
}: AuthWrapperProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        minH="100vh" 
        bg="gray.50" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Spinner size="lg" />
        <Text ml={2}>Loading...</Text>
      </Box>
    );
  }

  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to="/workspaces" replace />;
  }

  if (!isAuthenticated && !redirectIfAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
