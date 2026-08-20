// Default to a same-origin /api/v1 proxy in dev (Vite proxy) and the
// configured backend base URL in production. MSW intercepts dev requests
// before they hit the network, so an unreachable backend is non-fatal.
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api/v1';

export const MSW_ENABLED =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) === undefined &&
  import.meta.env.VITE_USE_MOCKS !== 'false';

export const STORAGE_KEYS = {
  token: 'cgcc.token',
  user: 'cgcc.user',
} as const;

export const POLLING_INTERVALS = {
  missions: 5000,
  workspaces: 30000,
} as const;
