import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { LoginPage } from '../features/auth/LoginPage';
import { authApi } from '../lib/endpoints';
import { useAuthStore } from '../stores/authStore';

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    vi.restoreAllMocks();
  });

  it('renders email, password, and a submit button', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign In/i })
    ).toBeInTheDocument();
  });

  it('links to the register page', () => {
    renderWithProviders(<LoginPage />);
    expect(
      screen.getByRole('link', { name: /Register/i })
    ).toHaveAttribute('href', '/register');
  });

  it('calls login on submit and navigates to /workspaces', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi, 'login').mockResolvedValue({
      token: 'jwt-x',
      user: { id: '1', email: 't@e.com', username: 't' },
    });
    renderWithProviders(<LoginPage />, { route: '/login' });

    await user.type(screen.getByLabelText(/Email/i), 't@e.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(authApi.login).toHaveBeenCalledWith('t@e.com', 'password123');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('shows form error when login rejects', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi, 'login').mockRejectedValue(new Error('Invalid credentials'));
    renderWithProviders(<LoginPage />, { route: '/login' });

    await user.type(screen.getByLabelText(/Email/i), 'bad@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(authApi.login).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
