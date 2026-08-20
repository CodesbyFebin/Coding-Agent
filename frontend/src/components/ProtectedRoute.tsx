import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LoadingScreen } from './LoadingScreen';

// Wraps a set of nested <Route> elements that require authentication.
// Renders <Outlet /> when authenticated, otherwise redirects to /login
// preserving the intended destination.
export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const location = useLocation();

  if (loading) {
    return <LoadingScreen label="Checking session..." />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

// For public-only routes (login/register): bounce authenticated users away.
export const PublicOnlyRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return <LoadingScreen label="Checking session..." />;
  }
  if (isAuthenticated) {
    return <Navigate to="/workspaces" replace />;
  }
  return <Outlet />;
};
