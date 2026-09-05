import axios, { type AxiosInstance } from 'axios';
import { STORAGE_KEYS } from '../lib/constants';

// Resolve base URL: config store value > VITE_API_BASE_URL env > /api/v1 fallback.
// At module level we can only use the env/env fallback since the store isn't hydrated yet.
// The interceptor below reads sessionStorage directly for the actual config.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Plain axios instance. MSW's service worker intercepts these requests
// in development; in production they hit the configured backend.
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Inject apikey or bearer token on every request.
// The interceptor reads from sessionStorage (backend config) and localStorage (auth)
// so it never needs a React hook. This mirrors the prototype's authHeaders()
// while staying generic (no Supabase-specific paths).
apiClient.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};

  // Read API key from sessionStorage (backend config store persistence keys)
  const storedApiKey = typeof window !== 'undefined'
    ? sessionStorage.getItem('cgcc.backend.key')
    : null;

  if (storedApiKey) {
    config.headers['apikey'] = storedApiKey;
  } else {
    // Fall back to bearer token from auth store
    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Normalize axios errors so callers get a predictable shape.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = new Error(
      error?.response?.data?.message ?? error?.message ?? 'Request failed'
    );
    (normalized as Error & { status?: number }).status =
      error?.response?.status;
    (normalized as Error & { body?: unknown }).body = error?.response?.data;
    return Promise.reject(normalized);
  }
);

// Map an interceptor-normalized error to a user-facing message. Auth
// credential errors (401/403) surface the server's own wording; a missing
// or unreachable backend (404/405/5xx/network) gets an honest, non-jargon
// line instead of "Request failed with status code 405".
export function userFacingMessage(err: unknown, fallback: string): string {
  const e = err as Error & { status?: number; body?: unknown };
  const status = e?.status;

  if (status === 401 || status === 403) {
    const bodyMsg = (e.body as { message?: unknown } | undefined)?.message;
    return typeof bodyMsg === 'string'
      ? bodyMsg
      : e?.message || 'Invalid email or password.';
  }

  const unreachable =
    status === 0 ||
    status === 404 ||
    status === 405 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    /\b(network|failed to fetch|request failed)\b/i.test(e?.message || '');

  if (unreachable) {
    return 'Unable to reach the server. Please try again later.';
  }

  return e?.message || fallback;
}