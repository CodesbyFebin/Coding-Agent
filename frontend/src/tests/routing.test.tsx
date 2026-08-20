import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../routes';
import { useAuthStore } from '../stores/authStore';

// Routing assertions are the highest-value frontend test: if the protected-
// route gate is broken, every authenticated flow is broken.
describe('App routing and route protection', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  it('redirects unauthenticated users from / to /login', () => {
    renderWithProviders(<AppRoutes />, { route: '/' });
    expect(screen.getByText(/sign in to your command center/i)).toBeInTheDocument();
  });

  it('shows the login page at /login for unauthenticated users', () => {
    renderWithProviders(<AppRoutes />, { route: '/login' });
    expect(screen.getByText(/CodingAgent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('renders the register page at /register', () => {
    renderWithProviders(<AppRoutes />, { route: '/register' });
    expect(
      screen.getByText(/create your command center account/i)
    ).toBeInTheDocument();
  });

  it('shows NotFound page on unknown routes', () => {
    renderWithProviders(<AppRoutes />, { route: '/does-not-exist' });
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /404/i })
    ).toBeInTheDocument();
  });

  it('renders the dashboard for authenticated users at /', async () => {
    useAuthStore.setState({
      user: { id: '1', email: 'authed@example.com', username: 'authed' },
      token: 'jwt',
      isAuthenticated: true,
      loading: false,
      error: null,
    });
    const user = userEvent.setup();
    void user;
    renderWithProviders(<AppRoutes />, { route: '/' });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });
  });
});
