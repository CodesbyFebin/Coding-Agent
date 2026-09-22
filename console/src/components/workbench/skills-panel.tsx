import { WORK_SKILLS } from "@/lib/agent/seed";
import { runTurn } from "@/lib/agent/run";

export function SkillsPanel() {
  return (
    <div className="code-scroll h-full overflow-auto p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl tracking-tight">Skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Type / in the composer, or run a skill from here.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {WORK_SKILLS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => void runTurn(s.prompt)}
              className="rounded-lg bg-card p-5 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-medium">{s.name}</h2>
                <span className="font-mono text-xs text-muted-foreground">{s.hint}</span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {s.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
