import { useEffect, useMemo } from 'react';
import { useEventStreamStore } from './eventStreamStore';
import type { MissionProgressPayload } from '../types';

// Subscribe to the app-wide realtime stream. The actual EventSource lives in
// eventStreamStore as a module singleton, so every subscriber shares one
// connection that persists across route changes — only the presentation
// filtering (by workspaceId) is per-component.
export function useEventStream(workspaceId?: string) {
  const events = useEventStreamStore((s) => s.events);
  const connected = useEventStreamStore((s) => s.connected);
  const start = useEventStreamStore((s) => s.start);
  const clear = useEventStreamStore((s) => s.clear);

  // Ensure the single shared connection is live while any subscriber is
  // mounted. Multiple subscribers calling start() is safe — start() is a
  // no-op when the source already exists. The connection is NOT torn down on
  // unmount so navigation between pages doesn't flap the indicator.
  useEffect(() => {
    start();
  }, [start]);

  // Filter to events for the active workspace when provided. This is purely a
  // view transformation; the shared buffer keeps every event regardless.
  const scoped = useMemo(() => {
    if (!workspaceId) {
      return events;
    }
    return events.filter(
      (e) =>
        (e.payload as MissionProgressPayload | null)?.missionId !== undefined
    );
  }, [events, workspaceId]);

  return { events: scoped, connected, clear };
}
