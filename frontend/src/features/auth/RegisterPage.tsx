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
import { UserPlus } from 'lucide-react';

export const RegisterPage = () => {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      await register(email, password);
      // Redirect to workspaces after successful registration
      navigate('/workspaces', { replace: true });
    } catch (error: any) {
      setFormError(error.message || 'Registration failed');
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
            <UserPlus size={48} color="brand.500" />
            <Text fontSize="2xl" fontWeight="bold">
              CodingAgent
            </Text>
            <Text colorScheme="mb" fontSize="sm">
              Create your Command Center account
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
                  minLength={8}
                  disabled={isLoading}
                  aria-label="Password"
                />
                {formError && (
                  <HelperText>{formError}</HelperText>
                )}
              </FormControl>
              
              {/* Confirm Password Field */}
              <FormControl isInvalid={!!formError}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isRequired
                  minLength={8}
                  disabled={isLoading}
                  aria-label="Confirm password"
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
                Create Account
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
          
          {/* Login Link */}
          <Button 
            variant="link" 
            colorScheme="mb" 
            onClick={() => navigate('/login', { replace: true })}
            size="sm"
          >
            Already have an account? Sign In
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

// Import Divider
import { Divider } from '@chakra-ui/react';
