import { useMemo } from 'react';
import { useBackendConfigStore } from './backendConfigStore';
import { useAuthStore } from './authStore';

// Computes the runtime-truth pill state from real backend-config + auth state,
// mirroring the prototype's renderTruth() rule set. Returns a kind + label
// plus the kv pairs shown on the Runtime inspector tab. No state is ever
// fabricated green: an unconfigured backend reads BLOCKED, a configured but
// unauthenticated backend reads CONFIGURED, and a runtime error reads ERROR.
export interface RuntimeTruth {
  kind: 'good' | 'warn' | 'bad' | 'unknown';
  label: string;
}

export const LABEL = {
  blocked: 'BACKEND BLOCKED',
  configured: 'BACKEND CONFIGURED',
  connected: 'BACKEND CONNECTED',
  error: 'BACKEND ERROR',
} as const;

export function computeRuntimeTruth(
  configured: boolean,
  isAuthenticated: boolean,
  lastError: string | null
): RuntimeTruth {
  if (lastError) {return { kind: 'bad', label: LABEL.error };}
  if (!configured) {return { kind: 'warn', label: LABEL.blocked };}
  if (isAuthenticated) {return { kind: 'good', label: LABEL.connected };}
  return { kind: 'unknown', label: LABEL.configured };
}

export const useRuntimeTruth = (): RuntimeTruth => {
  const configured = useBackendConfigStore((s) => s.configured);
  const lastError = useBackendConfigStore((s) => s.lastError);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useMemo(
    () => computeRuntimeTruth(configured, isAuthenticated, lastError),
    [configured, isAuthenticated, lastError]
  );
};
