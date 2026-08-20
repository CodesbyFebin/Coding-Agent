import { create } from 'zustand';
import type { AuthUser } from '../types';
import { STORAGE_KEYS } from '../lib/constants';
import { authApi } from '../lib/endpoints';
import { useEventStreamStore } from '../realtime/eventStreamStore';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialize: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  initialize: () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.token);
      const userJson = localStorage.getItem(STORAGE_KEYS.user);
      if (token && userJson) {
        const user = JSON.parse(userJson) as AuthUser;
        set({ user, token, isAuthenticated: true, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    // NOTE: do not flip the global `loading` flag here. App.tsx gates the
    // entire router on `authStore.loading`; setting it true mid-action would
    // unmount LoginPage mid-submit, flash the bootstrap LoadingScreen, and
    // discard the in-flight formError so the user never sees auth failures.
    // The submit spinner is driven by each page's local `submitting` state.
    set({ error: null });
    try {
      const { token, user } = await authApi.login(email, password);
      localStorage.setItem(STORAGE_KEYS.token, token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  register: async (email, password) => {
    set({ error: null });
    try {
      const { token, user } = await authApi.register(email, password);
      localStorage.setItem(STORAGE_KEYS.token, token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    // Tear down the shared realtime stream so a logged-out user (or the next
    // login) doesn't keep a stale authenticated SSE connection open.
    useEventStreamStore.getState().stop();
    set({ user: null, token: null, isAuthenticated: false, loading: false });
  },

  clearError: () => set({ error: null }),
}));
