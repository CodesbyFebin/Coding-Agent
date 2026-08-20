import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Test theme mirrors production (light mode, brand accent) without leaking
// useSystemColorMode randomness into snapshot-style assertions.
const theme = extendTheme({ config: { initialColorMode: 'light' } });

// Custom render that wraps components in the same providers the real app
// expects (Chakra, TanStack Query, Router). Tests call renderWithProviders
// instead of @testing-library's plain render.
export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
    }),
  }: { route?: string; queryClient?: QueryClient } = {}
) {
  return render(
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
