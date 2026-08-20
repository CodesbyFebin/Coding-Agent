import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Input, 
  Button, 
  FormControl, 
  FormLabel, 
  HelperText, 
  Alert, 
  AlertIcon,
  Spinner,
  useDisclosure
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Login } from 'lucide-react';

export const LoginPage = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Redirect to workspaces after successful login
      navigate('/workspaces', { replace: true });
    } catch (error: any) {
      setFormError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-redirect if already authenticated
  if (isAuthenticated) {
    navigate('/workspaces', { replace: true });
    return null;
  }

  return (
    <Box 
      minH="100vh" 
      bg="gray.50" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      p={4}
    >
      <Box 
        bg="white" 
        rounded="lg" 
        shadow="md" 
        w="full" 
        maxW="400px" 
        p={6}
      >
        <VStack spacing={6} align="center">
          <Box textAlign="center">
            <Login size={48} color="brand.500" />
            <Text fontSize="2xl" fontWeight="bold">
              CodingAgent
            </Text>
            <Text colorScheme="mb" fontSize="sm">
              Sign in to your Command Center
            </Text>
          </Box>
          
          {/* Error Alert */}
          {formError && (
            <Alert 
              status="error" 
              mb={4}
              variant="left-accent"
            >
              <AlertIcon />
              <Alert.Title>{formError}</Alert.Title>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch" w="full">
              
              {/* Email Field */}
              <FormControl isInvalid={!!formError}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                  disabled={isLoading}
                  aria-label="Email address"
                />
                {formError && (
                  <HelperText>{formError}</HelperText>
                )}
              </FormControl>
              
              {/* Password Field */}
              <FormControl isInvalid={!!formError}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  disabled={isLoading}
                  aria-label="Password"
                />
                {formError && (
                  <HelperText>{formError}</HelperText>
                )}
              </FormControl>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                colorScheme="brand" 
                w="full" 
                isLoading={isLoading || authLoading}
                _hover={{ bg: 'brand.600' }}
                _active={{ bg: 'brand.700' }}
              >
                Sign In
              </Button>
            </VStack>
          </form>
          
          {/* Divider */}
          <Box 
            display="flex" 
            alignItems="center" 
            w="full" 
            mt={6}
          >
            <Divider />
            <Text ml={2} mr={2} fontSize="xs" colorScheme="mb">
              or
            </Text>
            <Divider />
          </Box>
          
          {/* Register Link */}
          <Button 
            variant="link" 
            colorScheme="mb" 
            onClick={() => navigate('/register', { replace: true })}
            size="sm"
          >
            Don't have an account? Register
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

// Import Divider
import { Divider } from '@chakra-ui/react';
