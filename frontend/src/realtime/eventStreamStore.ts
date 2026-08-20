import { create } from 'zustand';
import { STORAGE_KEYS } from '../lib/constants';
import type { RealtimeEvent } from '../types';

// App-wide realtime connection. Exactly one EventSource is created for the
// whole process and shared by every useEventStream() subscriber — previously
// each consumer (Sidebar, Dashboard) opened its own connection that was torn
// down on every navigation, which made the sidebar's "SSE connected"
// indicator flap between pages and leaked connections. The singleton lives at
// module scope (not in React state), so it survives route changes; the Zustand
// store just surfaces its status and accumulated events to components.

const CAP = 100;
const MAX_ATTEMPTS = 5;

interface EventStreamState {
  events: RealtimeEvent[];
  connected: boolean;
  start: () => void;
  reconnect: () => void;
  clear: () => void;
  // Tear down the shared connection (used on logout and by tests). Unlike
  // start/reconnect, this also resets the backoff counter so a re-login
  // begins from a clean slate.
  stop: () => void;
}

let source: EventSource | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let attempts = 0;

const stopSource = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  source?.close();
  source = null;
};

const buildUrl = () => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  // EventSource cannot set Authorization headers, so a query-string token is
  // the only way to surface credentials for the SSE request; the backend
  // validates it server-side.
  const qs = token ? `?token=${encodeURIComponent(token)}` : '';
  return `/api/v1/events/stream${qs}`;
};

// Zustand's setter accepts either a partial object or a functional updater
// that receives the current state and returns a partial. Widen the param so
// the functional form used to append events type-checks.
type SetFn = (
  partial:
    | Partial<EventStreamState>
    | ((state: EventStreamState) => Partial<EventStreamState>)
) => void;

const attemptConnect = (set: SetFn) => {
  // Progressive enhancement: environments without EventSource (older
  // browsers, some test runners) simply get no live feed — the rest of the
  // app still works and the sidebar reads "SSE offline".
  if (typeof EventSource === 'undefined') {
    set({ connected: false });
    return;
  }
  // No session means there is nothing to authenticate the stream against.
  // Reconnect/refresh after login will call start() again with a token.
  if (!localStorage.getItem(STORAGE_KEYS.token)) {
    set({ connected: false });
    return;
  }
  if (source) {
    return;
  }

  const next = new EventSource(buildUrl());
  source = next;

  next.onopen = () => {
    attempts = 0;
    set({ connected: true });
  };

  next.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data) as RealtimeEvent;
      set((prev) => ({
        // Bound the buffer so a long-lived session can't leak memory.
        events: [...prev.events, parsed].slice(-CAP),
      }) as Partial<EventStreamState>);
    } catch {
      // ignore malformed payloads — never let a bad event crash the UI
    }
  };

  next.onerror = () => {
    source?.close();
    source = null;
    set({ connected: false });

    // Bounded backoff so a transient drop (or a self-closing dev mock) is
    // retried, but a permanently missing production endpoint isn't hammered
    // forever. Re-login or an explicit reconnect() resets the counter.
    attempts += 1;
    if (attempts > MAX_ATTEMPTS) {
      return;
    }
    const delay = Math.min(1000 * 2 ** (attempts - 1), 30000);
    reconnectTimer = setTimeout(() => attemptConnect(set), delay);
  };
};

export const useEventStreamStore = create<EventStreamState>((set) => ({
  events: [],
  connected: false,
  start: () => {
    attempts = 0;
    attemptConnect(set);
  },
  reconnect: () => {
    attempts = 0;
    stopSource();
    attemptConnect(set);
  },
  clear: () => set({ events: [] }),
  stop: () => {
    stopSource();
    attempts = 0;
    set({ events: [], connected: false });
  },
}));
