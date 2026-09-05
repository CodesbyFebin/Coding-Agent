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
import { LogIn } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { userFacingMessage } from '../../lib/api';

export const LoginPage = () => {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/projects', { replace: true });
    } catch (err) {
      setFormError(userFacingMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const emailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordInvalid = password.length > 0 && password.length < 8;

  return (
    <Box
      minH="100vh"
      bg="sovereign.bg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      background="radial-gradient(circle at 60% -20%, rgba(255,90,31,0.08), transparent 36%), sovereign.bg"
    >
      <Box
        bg="sovereign.panel"
        rounded="lg"
        shadow="0 24px 70px rgba(0,0,0,.32)"
        w="full"
        maxW="400px"
        p={6}
        border="1px solid"
        borderColor="sovereign.line2"
      >
        <VStack spacing={5} align="stretch">
          <Box textAlign="center">
            <LogIn size={36} color="#ff5a1f" />
            <Text fontSize="2xl" fontWeight="bold" mt={2}>
              CodingAgent
            </Text>
            <Text fontSize="sm" color="sovereign.muted">
              Sign in to your Command Center
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
                <FormLabel htmlFor="login-email">Email</FormLabel>
                <Input
                  id="login-email"
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
                <FormLabel htmlFor="login-password">Password</FormLabel>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  isDisabled={submitting}
                  autoComplete="current-password"
                />
                {passwordInvalid && (
                  <FormErrorMessage>Min 8 characters.</FormErrorMessage>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                w="full"
                isLoading={submitting || loading}
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <HStack>
            <Divider />
            <Text fontSize="xs" color="sovereign.dim">
              or
            </Text>
            <Divider />
          </HStack>

          <Text fontSize="sm" color="sovereign.muted" textAlign="center">
            Don&#39;t have an account?{' '}
            <RouterLink to="/register" style={{ color: '#ff5a1f', fontWeight: 600 }}>
              Register
            </RouterLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};
