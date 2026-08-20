import { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const RegisterPage = () => {
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await register(email, password);
      navigate('/workspaces', { replace: true });
    } catch (err) {
      setFormError((err as Error).message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const emailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordInvalid = password.length > 0 && password.length < 8;
  const confirmInvalid = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box bg="white" rounded="lg" shadow="md" w="full" maxW="400px" p={6}>
        <VStack spacing={5} align="stretch">
          <Box textAlign="center">
            <UserPlus size={36} color="#ff5a1f" />
            <Text fontSize="2xl" fontWeight="bold" mt={2}>
              CodingAgent
            </Text>
            <Text fontSize="sm" color="gray.500">
              Create your Command Center account
            </Text>
          </Box>

          {formError && (
            <Alert status="error" variant="left-accent">
              <AlertIcon />
              <Text fontSize="sm">{formError}</Text>
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <VStack spacing={4} align="stretch" w="full">
              <FormControl isInvalid={emailInvalid}>
                <FormLabel htmlFor="register-email">Email</FormLabel>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                  isDisabled={submitting}
                  autoComplete="email"
                />
                {emailInvalid && (
                  <FormErrorMessage>Enter a valid email address.</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={passwordInvalid}>
                <FormLabel htmlFor="register-password">Password</FormLabel>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  isDisabled={submitting}
                  autoComplete="new-password"
                />
                {passwordInvalid && (
                  <FormErrorMessage>Min 8 characters.</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={confirmInvalid}>
                <FormLabel htmlFor="register-confirm">Confirm Password</FormLabel>
                <Input
                  id="register-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isRequired
                  isDisabled={submitting}
                  autoComplete="new-password"
                />
                {confirmInvalid && (
                  <FormErrorMessage>Passwords do not match.</FormErrorMessage>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                w="full"
                isLoading={submitting || loading}
              >
                Create Account
              </Button>
            </VStack>
          </form>

          <HStack>
            <Divider />
            <Text fontSize="xs" color="gray.400">
              or
            </Text>
            <Divider />
          </HStack>

          <Text fontSize="sm" color="gray.600" textAlign="center">
            Already have an account?{' '}
            <RouterLink to="/login" style={{ color: '#ff5a1f', fontWeight: 600 }}>
              Sign In
            </RouterLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};
