import axios, { type AxiosInstance } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from './constants';

// Plain axios instance. MSW's service worker intercepts these requests
// in development; in production they hit the configured backend.
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Inject bearer token on every request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
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

