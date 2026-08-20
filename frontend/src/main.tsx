import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import App from './App';
import { useAuthStore } from './stores/authStore';

const theme = extendTheme({
  config: { initialColorMode: 'light', useSystemColorMode: false },
  colors: {
    // Accent palette shared with legacy console and authority site.
    brand: {
      50: '#fff5ed',
      100: '#ffe8d4',
      200: '#ffceaa',
      300: '#ffb080',
      400: '#ff8b57',
      500: '#ff5a1f',
      600: '#f0430e',
      700: '#c7330b',
      800: '#9e2a10',
      900: '#7f2811',
    },
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    mono: `'SF Mono', 'JetBrains Mono', monospace`,
  },
  styles: {
    global: {
      'html, body': { bg: 'gray.50', color: 'gray.900' },
    },
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

// MSW only starts in development and only when mocks are not explicitly
// disabled. Production builds tree-shake this branch away.
async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS !== 'false') {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    });
  }
}

// Restore persisted auth session before any route renders.
useAuthStore.getState().initialize();

enableMocking().finally(() => {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element #root not found in index.html');
  }
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode="light" />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ChakraProvider>
    </React.StrictMode>
  );
});
