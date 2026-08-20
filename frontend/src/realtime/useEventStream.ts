import { useEffect, useRef, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../lib/constants';
import type {
  MissionProgressPayload,
  RealtimeEvent,
} from '../types';

// Subscribe to the backend's Server-Sent Events stream for live mission
// updates. Falls back silently when the stream is unavailable (e.g. when
// running against MSW in development, which mocks the endpoint).
export function useEventStream(workspaceId?: string) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (sourceRef.current) {return;}

    // Progressive enhancement: environments without EventSource (older
    // browsers, some test runners) simply don't get a live feed. The rest
    // of the app still works; the sidebar shows SSE offline.
    if (typeof EventSource === 'undefined') {
      setConnected(false);
      return;
    }

    const token = localStorage.getItem(STORAGE_KEYS.token);
    // EventSource cannot set Authorization headers, so we fall back to a
    // query-string token when one is present; the backend validates it.
    const qs = token ? `?token=${encodeURIComponent(token)}` : '';
    const url = `/api/v1/events/stream${qs}`;
    const source = new EventSource(url);
    sourceRef.current = source;

    source.onopen = () => setConnected(true);
    source.onerror = () => {
      setConnected(false);
      source.close();
      sourceRef.current = null;
    };
    source.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data) as RealtimeEvent;
        setEvents((prev) => [...prev, parsed]);
      } catch {
        // ignore malformed payloads — never let a bad event crash the UI
      }
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      sourceRef.current?.close();
      sourceRef.current = null;
    };
  }, [connect]);

  // Filter to events for the active workspace when provided.
  const scoped = workspaceId
    ? events.filter(
        (e) =>
          (e.payload as MissionProgressPayload | null)?.missionId !== undefined
      )
    : events;

  const clear = useCallback(() => setEvents([]), []);

  return { events: scoped, connected, clear };
}
