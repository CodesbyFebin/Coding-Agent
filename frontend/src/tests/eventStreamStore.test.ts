import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useEventStreamStore } from '../realtime/eventStreamStore';
import { STORAGE_KEYS } from '../lib/constants';

// The realtime store owns the app's single EventSource. These tests pin its
// shared-connection contract: it reacts to session state, silently degrades
// when EventSource is unavailable, and boundedly retries after an error. The
// network is a hand-rolled fake so tests stay deterministic and offline.
class FakeEventSource {
  static instances: FakeEventSource[] = [];
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(url: string) {
    this.url = url;
    FakeEventSource.instances.push(this);
  }
  close() {
    /* simulate closing; no real network */
  }
  fireOpen() {
    this.onopen?.();
  }
  fireError() {
    this.onerror?.();
  }
}

describe('useEventStreamStore (app-wide SSE singleton)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeEventSource.instances = [];
    localStorage.clear();
    (globalThis as unknown as { EventSource: unknown }).EventSource =
      FakeEventSource as unknown as typeof EventSource;
    useEventStreamStore.getState().stop();
    useEventStreamStore.setState({ events: [], connected: false });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stays offline when no auth token is present', () => {
    useEventStreamStore.getState().start();
    expect(useEventStreamStore.getState().connected).toBe(false);
    expect(FakeEventSource.instances).toHaveLength(0);
  });

  it('connects and surfaces connected=true when a token exists', () => {
    localStorage.setItem(STORAGE_KEYS.token, 'mock-jwt');
    useEventStreamStore.getState().start();
    expect(FakeEventSource.instances).toHaveLength(1);
    FakeEventSource.instances[0].fireOpen();
    expect(useEventStreamStore.getState().connected).toBe(true);
  });

  it('appends parsed events and caps the buffer at 100', () => {
    localStorage.setItem(STORAGE_KEYS.token, 'mock-jwt');
    useEventStreamStore.getState().start();
    const source = FakeEventSource.instances[0];
    for (let i = 0; i < 120; i += 1) {
      source.onmessage?.({
        data: JSON.stringify({
          id: `e${i}`,
          type: 'MISSION_PROGRESS',
          timestamp: 't',
          payload: {},
        }),
      });
    }
    // Cap applied: only the last 100 events are retained.
    expect(useEventStreamStore.getState().events).toHaveLength(100);
    expect(useEventStreamStore.getState().events[0]).toMatchObject({ id: 'e20' });
  });

  it('ignores malformed payloads without crashing', () => {
    localStorage.setItem(STORAGE_KEYS.token, 'mock-jwt');
    useEventStreamStore.getState().start();
    const source = FakeEventSource.instances[0];
    const before = useEventStreamStore.getState().events.length;
    source.onmessage?.({ data: 'not-json{' });
    expect(useEventStreamStore.getState().events.length).toBe(before);
  });

  it('schedules a bounded backoff retry after an error and reconnects', () => {
    localStorage.setItem(STORAGE_KEYS.token, 'mock-jwt');
    useEventStreamStore.getState().start();
    const first = FakeEventSource.instances[0];
    first.fireError();
    expect(useEventStreamStore.getState().connected).toBe(false);
    // First retry waits ~1s (2^0 * 1000).
    vi.advanceTimersByTime(1000);
    expect(FakeEventSource.instances).toHaveLength(2);
    FakeEventSource.instances[1].fireOpen();
    expect(useEventStreamStore.getState().connected).toBe(true);
  });

  it('stop() tears down the connection and clears state', () => {
    localStorage.setItem(STORAGE_KEYS.token, 'mock-jwt');
    useEventStreamStore.getState().start();
    FakeEventSource.instances[0].fireOpen();
    useEventStreamStore.getState().stop();
    expect(useEventStreamStore.getState().connected).toBe(false);
    expect(useEventStreamStore.getState().events).toHaveLength(0);
    expect(FakeEventSource.instances).toHaveLength(1);
  });
});
