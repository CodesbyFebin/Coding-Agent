import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppRoutes } from './routes';

export default function App() {
  const loading = useAuthStore((s) => s.loading);
  const initialize = useAuthStore((s) => s.initialize);

  // Re-hydrate auth on mount in case main.tsx's eager init was skipped.
  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return <LoadingScreen label="Loading CodingAgent Command Center..." />;
  }

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}
