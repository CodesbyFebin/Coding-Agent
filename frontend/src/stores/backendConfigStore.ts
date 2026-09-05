import { create } from 'zustand';

// Backend-agnostic connection configuration. The user provides a generic
// base URL + API key + edge/function name from the Settings view; nothing is
// hard-coded to any one provider. Until a backend is explicitly configured
// the app surfaces an honest "BACKEND BLOCKED" truth state and never fakes a
// live connection.
//
// In development MSW transparently intercepts requests regardless of config,
// so the mock layer works without configuration; that is a dev affordance and
// does not change what the truth pill reports to a real user.

const SS_KEY = {
  url: 'cgcc.backend.url',
  key: 'cgcc.backend.key',
  func: 'cgcc.backend.func',
} as const;

export interface BackendConfig {
  baseUrl: string;
  apiKey: string;
  functionName: string;
}

export interface BackendConfigState extends BackendConfig {
  configured: boolean;
  lastError: string | null;
  save: (input: Partial<BackendConfig>) => void;
  setError: (message: string | null) => void;
  clear: () => void;
}

const read = (k: string): string => {
  try {
    return sessionStorage.getItem(k) ?? '';
  } catch {
    return '';
  }
};

const write = (k: string, v: string): void => {
  try {
    sessionStorage.setItem(k, v);
  } catch {
    /* sessionStorage unavailable — keep config in-memory only */
  }
};

const loadPersisted = (): BackendConfig => ({
  baseUrl: read(SS_KEY.url),
  apiKey: read(SS_KEY.key),
  functionName: read(SS_KEY.func) || 'mission-api',
});

const isConfigured = (c: BackendConfig): boolean =>
  Boolean(c.baseUrl && c.apiKey);

const initial = loadPersisted();

export const useBackendConfigStore = create<BackendConfigState>((set) => ({
  ...initial,
  configured: isConfigured(initial),
  lastError: null,
  save: (input) => {
    const next: BackendConfig = {
      baseUrl: input.baseUrl ?? read(SS_KEY.url),
      apiKey: input.apiKey ?? read(SS_KEY.key),
      functionName: input.functionName ?? (read(SS_KEY.func) || 'mission-api'),
    };
    if (input.baseUrl !== undefined) {write(SS_KEY.url, input.baseUrl);}
    if (input.apiKey !== undefined) {write(SS_KEY.key, input.apiKey);}
    if (input.functionName !== undefined) {write(SS_KEY.func, input.functionName);}
    set({ ...next, configured: isConfigured(next), lastError: null });
  },
  setError: (message) => set({ lastError: message }),
  clear: () => {
    try {
      sessionStorage.removeItem(SS_KEY.url);
      sessionStorage.removeItem(SS_KEY.key);
      sessionStorage.removeItem(SS_KEY.func);
    } catch {
      /* ignore */
    }
    set({
      baseUrl: '',
      apiKey: '',
      functionName: 'mission-api',
      configured: false,
      lastError: null,
    });
  },
}));

// Convenience for non-React call sites (e.g. the axios request interceptor).
export const getBackendConfig = (): BackendConfig => {
  const s = useBackendConfigStore.getState();
  return { baseUrl: s.baseUrl, apiKey: s.apiKey, functionName: s.functionName };
};
