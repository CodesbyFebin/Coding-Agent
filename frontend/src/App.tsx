import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import { Routes } from './routes';
import { useAuth } from './hooks/useAuth';

// Create query client
const queryClient = new QueryClient();

// Create theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#eff6ff',
      100: '#dbe4ff',
      200: '#b7c9ff',
      300: '#94a3ff',
      400: '#7d8cff',
      500: '#6675ff',
      600: '#4e5eff',
      700: '#3a47d6',
      800: '#2d37a6',
      900: '#1f2973',
    },
  },
});

function App() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ColorModeScript initialColorMode="system" />
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading CodingAgent Command Center...</p>
              </div>
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ColorModeScript initialColorMode="system" />
          <Routes />
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
