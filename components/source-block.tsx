import type { ClinicalSource } from "@/lib/types";

export function SourceBlock({ source, lastReviewed, compact = false }: { source: ClinicalSource; lastReviewed?: string; compact?: boolean }) {
  const inner = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span className="font-semibold text-zinc-700 dark:text-zinc-200">{source.org}</span>
      <span className="text-zinc-400">·</span>
      <span className="text-zinc-500 dark:text-zinc-300">{source.title}</span>
      <span className="text-zinc-400">·</span>
      <span className="font-medium text-zinc-500 dark:text-zinc-300">{source.year}</span>
      {source.version && <span className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">v{source.version}</span>}
      {lastReviewed && (
        <>
          <span className="text-zinc-400">·</span>
          <span className="text-zinc-400">Ditelaah {lastReviewed}</span>
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
