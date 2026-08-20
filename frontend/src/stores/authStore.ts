import { create } from 'zustand';
import type { AuthUser } from '../types';
import { STORAGE_KEYS } from '../lib/constants';
import { authApi } from '../lib/endpoints';

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
    set({ loading: true, error: null });
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
    set({ loading: true, error: null });
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
    set({ user: null, token: null, isAuthenticated: false, loading: false });
  },

  clearError: () => set({ error: null }),
}));
