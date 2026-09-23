import type { ClinicalSource } from "@/lib/types";

export function SourceBlock({ source, lastReviewed, compact = false }: { source?: ClinicalSource; lastReviewed?: string; compact?: boolean }) {
  if (!source || /klinea|gawatcepat\.forum/i.test(`${source.org} ${source.title} ${source.url ?? ""}`)) return null;

  const inner = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span className="font-semibold text-[var(--ink)]">{source.org}</span>
      <span className="text-zinc-400">·</span>
      <span className="text-[var(--muted)]">{source.title}</span>
      <span className="text-zinc-400">·</span>
      <span className="font-medium text-[var(--muted)]">{source.year}</span>
      {source.version && <span className="rounded bg-[var(--surface)] px-1 py-0.5 font-mono text-[10px] text-[var(--muted)]">v{source.version}</span>}
      {lastReviewed && (
        <>
          <span className="text-zinc-400">·</span>
          <span className="text-[var(--muted)]">Ditelaah {lastReviewed}</span>
        </>
      )}
      {source.url && (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-strong underline-offset-2 hover:underline dark:text-accent">
          Sumber ↗
        </a>
      )}
    </div>
  );
  if (compact) return inner;
  return <div className="workspace-panel px-3 py-2.5">{inner}</div>;
}
