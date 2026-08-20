import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../stores/authStore';
import { STORAGE_KEYS } from '../lib/constants';
import { authApi } from '../lib/endpoints';

// Auth store is the security gate for every protected route. These tests
// assert the state machine transitions that matter: initialize, login,
// register, logout, error propagation. Network is mocked at the authApi
// boundary so tests stay deterministic and offline.
describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,
      error: null,
    });
    vi.restoreAllMocks();
  });

  it('initializes unauthenticated with loading=false when no token present', () => {
    useAuthStore.getState().initialize();
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(false);
    expect(s.loading).toBe(false);
    expect(s.user).toBeNull();
    expect(s.token).toBeNull();
  });

  it('initializes authenticated when a persisted token/user exists', () => {
    const user = { id: '1', email: 'tester@example.com', username: 'tester' };
    localStorage.setItem(STORAGE_KEYS.token, 'persisted-jwt');
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    useAuthStore.getState().initialize();
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(true);
    expect(s.loading).toBe(false);
    expect(s.user?.email).toBe('tester@example.com');
    expect(s.token).toBe('persisted-jwt');
  });

  it('login stores token + user and sets authenticated', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue({
      token: 'jwt-from-store',
      user: { id: '1', email: 'tester@example.com', username: 'tester' },
    });
    await useAuthStore.getState().login('tester@example.com', 'password123');
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(true);
    expect(s.user?.email).toBe('tester@example.com');
    expect(s.token).toBe('jwt-from-store');
    expect(localStorage.getItem(STORAGE_KEYS.token)).toBe('jwt-from-store');
    expect(localStorage.getItem(STORAGE_KEYS.user)).toBeTruthy();
  });

  it('register stores token + user and sets authenticated', async () => {
    vi.spyOn(authApi, 'register').mockResolvedValue({
      token: 'jwt-from-register',
      user: { id: '2', email: 'new@example.com', username: 'new' },
    });
    await useAuthStore.getState().register('new@example.com', 'password123');
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(true);
    expect(s.user?.email).toBe('new@example.com');
    expect(s.token).toBe('jwt-from-register');
  });

  it('logout clears persisted session and resets state', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue({
      token: 'jwt-x',
      user: { id: '1', email: 't@e.com', username: 't' },
    });
    await useAuthStore.getState().login('t@e.com', 'password123');
    expect(localStorage.getItem(STORAGE_KEYS.token)).toBe('jwt-x');
    useAuthStore.getState().logout();
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(false);
    expect(s.user).toBeNull();
    expect(s.token).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.token)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.user)).toBeNull();
  });

  it('login failure propagates error and does not authenticate', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValue(new Error('Invalid credentials'));
    await expect(
      useAuthStore.getState().login('bad@example.com', 'wrong')
    ).rejects.toThrow('Invalid credentials');
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(false);
    expect(s.user).toBeNull();
    expect(s.error).toBe('Invalid credentials');
  });

  it('clearError resets the error field', () => {
    useAuthStore.setState({ error: 'boom' });
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
