import { useNavigate } from 'react-router-dom';
import { Button, FormControl, Input, FormLabel, Text, Box, Alert, Spinner } from '@chakra-ui/react';
import { useBackendConfigStore } from '../../stores/backendConfigStore';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const store = useBackendConfigStore();
  const {
    baseUrl,
    apiKey,
    functionName,
    configured,
    lastError,
  } = store;

  // Config is already loaded from sessionStorage via the store's initial state.
  // No need to manually call load().

  // Save config when user types — update sessionStorage
  const onInputChange = (field: 'baseUrl' | 'apiKey' | 'functionName', value: string) => {
    const updates: { baseUrl?: string; apiKey?: string; functionName?: string } = {};
    if (field === 'baseUrl') updates.baseUrl = value;
    if (field === 'apiKey') updates.apiKey = value;
    if (field === 'functionName') updates.functionName = value;
    store.save(updates);
  };

  if (baseUrl === '' && apiKey === '' && functionName === undefined) {
    // No config yet — show empty state with instructions
    return (
      <Box p={12} textAlign="center" maxW="400px" mx="auto">
        <Spinner size="lg" mt={4} />
        <Text fontSize="lg" marginTop={4} color="sovereign.muted">
          No backend configuration
        </Text>
        <Text fontSize="sm" mt={2} color="sovereign.dim">
          Enter your base URL, API key, and function name to connect.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={12}>
      <FormControl isInvalid={!!lastError} mb={4}>
        <FormLabel>Base URL</FormLabel>
        <Input
          placeholder="https://app.codingagent.in/"
          value={baseUrl}
          onChange={(e) => onInputChange('baseUrl', e.target.value)}
        />
        {lastError && (
          <Alert status="error" mt={2}>
            {lastError}
          </Alert>
        )}
      </FormControl>

      <FormControl isInvalid={!!lastError} mb={6}>
        <FormLabel>API Key</FormLabel>
        <Input
          type="password"
          placeholder="sk-..."
          value={apiKey ?? ''}
          onChange={(e) => onInputChange('apiKey', e.target.value)}
        />
      </FormControl>

      <FormControl mb={6}>
        <FormLabel>Function Name</FormLabel>
        <Input
          placeholder="mission-api"
          value={functionName ?? ''}
          onChange={(e) => onInputChange('functionName', e.target.value)}
        />
      </FormControl>

      {configured ? (
        <Box>
          <Text fontSize="sm" color="sovereign.muted">
            Configuration active — baseUrl: {baseUrl}
          </Text>
          <Button
            onClick={() => store.clear()}
            colorScheme="red"
            mt={4}
            size="sm"
            disabled={!baseUrl}
          >
            Remove configuration
          </Button>
        </Box>
      ) : (
        <Spinner size="sm" mt={4} />
      )}

      <Button
        onClick={() => navigate('/')}
        mt={6}
        colorScheme="gray"
        size="sm"
        ml={2}
      >
        Cancel
      </Button>
    </Box>
  );
};