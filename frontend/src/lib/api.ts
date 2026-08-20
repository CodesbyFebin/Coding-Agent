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
