import { useEffect, useState } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authEnabled } from "@/lib/auth/client";
import { loadWorkspaceState, saveWorkspaceState } from "@/lib/workspace-state";
import { useWork } from "@/lib/store";
import { createInitialSession } from "@/lib/agent/seed";
import { Workbench } from "./workbench";

type Snapshot = { sessions: ReturnType<typeof useWork.getState>["sessions"]; currentId:string; cronJobs:ReturnType<typeof useWork.getState>["cronJobs"] };
function snapshot(): Snapshot {
  const s = useWork.getState();
  return { sessions:s.sessions, currentId:s.currentId, cronJobs:s.cronJobs };
}
export function PersistedWorkbench() {
  const { user, isPending } = useCurrentUserState();
  const [ready,setReady] = useState(!authEnabled);
  const [error,setError] = useState<string|null>(null);
  useEffect(() => {
    if (!authEnabled || !user?.id) return;
    let alive = true;
    let revision = 0;
    let timer: ReturnType<typeof setTimeout>|undefined;
    let pending = Promise.resolve();
    let unsubscribe: (()=>void)|undefined;
    setReady(false);
    setError(null);
    // Never hydrate another account's browser-persisted sessions into this user's workspace.
    const fresh = createInitialSession();
    useWork.setState({sessions:[fresh],currentId:fresh.id,cronJobs:[]});
    void loadWorkspaceState().then(result => {
      if (!alive) return;
      revision=Number(result.revision);
      if (result.snapshotJson) {
        const data = JSON.parse(result.snapshotJson) as Partial<Snapshot>;
        if (Array.isArray(data.sessions) && data.sessions.length && typeof data.currentId==="string" && Array.isArray(data.cronJobs)) {
          useWork.setState({sessions:data.sessions,currentId:data.currentId,cronJobs:data.cronJobs});
        }
      }
      setReady(true);
      unsubscribe = useWork.subscribe(() => {
        if (timer) clearTimeout(timer);
        timer=setTimeout(() => {
          const data=snapshot();
          pending=pending.then(async () => {
            const saved=await saveWorkspaceState({data:{snapshot:data,expectedRevision:revision}});
            if (!alive) return;
            if (!saved.ok) { setError("Workspace was changed in another session. Reload to reconcile changes."); unsubscribe?.(); return; }
            revision=saved.revision;
          }).catch(()=>{ if(alive) setError("Could not save workspace. Check connectivity before continuing."); });
        },800);
      });
    }).catch(()=>{ if(alive) setError("Could not load your persisted workspace."); });
    return () => { alive=false; if(timer) clearTimeout(timer); unsubscribe?.(); };
  },[user?.id]);
  if (authEnabled && (isPending || !user)) return <div role="status" className="p-8">Sign in to access your workspace.</div>;
  if (error) return <div role="alert" className="p-8 text-red-600">{error}</div>;
  if (!ready) return <div role="status" className="p-8">Loading your private workspace…</div>;
  return <Workbench />;
}
