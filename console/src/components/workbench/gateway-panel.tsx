import { ExternalLink } from "lucide-react";
import { PROVIDERS, availableRoutes } from "@/lib/agent/providers";
import type { RouteStrategy, WorkMode } from "@/lib/agent/types";
import { useWork } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STRATEGIES: { id: RouteStrategy; label: string; hint: string }[] = [
  { id: "auto", label: "Auto", hint: "Role-aware mix" },
  { id: "quality", label: "Quality", hint: "Best reasoning" },
  { id: "fast", label: "Fast", hint: "Lowest latency" },
  { id: "free", label: "Free", hint: "BYO free keys first" },
];

const MODES: { id: WorkMode; label: string }[] = [
  { id: "swarm", label: "Swarm" },
  { id: "plan", label: "Plan" },
  { id: "chat", label: "Chat" },
];

export function GatewayPanel() {
  const settings = useWork((s) => s.settings);
  const patch = useWork((s) => s.patchSettings);
  const setKey = useWork((s) => s.setKey);
  const xai = useWork((s) => s.xaiReady);
  const live = availableRoutes(settings);

  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-3">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          LLM gateway
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Built-in Grok plus free-tier OpenAI-compatible providers. Keys stay on
          this device and are sent only to the chosen host.
        </p>
      </div>
      <div className="code-scroll min-h-0 flex-1 space-y-5 overflow-auto px-3 pb-4">
        <section>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Mode</p>
          <div className="flex rounded-sm bg-secondary p-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => patch({ mode: m.id })}
                className={cn(
                  "h-8 flex-1 rounded-xs text-xs",
                  settings.mode === m.id ? "bg-card text-foreground" : "text-muted-foreground",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </section>
        <section>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Routing</p>
          <div className="grid grid-cols-2 gap-1.5">
            {STRATEGIES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => patch({ strategy: s.id })}
                className={cn(
                  "rounded-sm px-3 py-2 text-left",
                  settings.strategy === s.id ? "bg-secondary text-foreground" : "hover:bg-secondary/60",
                )}
              >
                <div className="text-sm">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.hint}</div>
              </button>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Providers · {live.length} live
          </p>
          {PROVIDERS.map((p) => {
            const connected = p.builtIn ? xai !== false : Boolean(settings.keys[p.id]?.trim());
            return (
              <article key={p.id} className="rounded-md bg-card p-3 shadow-[var(--shadow-border)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.models[0]?.label}
                      {p.models.length > 1 ? ` +${p.models.length - 1}` : ""}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs",
                      connected ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {p.builtIn ? (xai === false ? "offline" : "built-in") : connected ? "keyed" : "needs key"}
                  </span>
                </div>
                {!p.builtIn ? (
                  <Input
                    className="mt-2 h-9"
                    type="password"
                    autoComplete="off"
                    placeholder={p.keyHint}
                    value={settings.keys[p.id] ?? ""}
                    onChange={(e) => setKey(p.id, e.target.value)}
                  />
                ) : null}
                <a
                  href={p.docs}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                >
                  Get a free key <ExternalLink className="size-3" />
                </a>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
