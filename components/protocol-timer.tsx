"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { EmergencyProtocol } from "@/lib/data/protocols";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function ProtocolTimer({ protocols }: { protocols: EmergencyProtocol[] }) {
  const [activeId, setActiveId] = useState(protocols[0]?.id ?? "");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const accumulated = useRef(0);

  const active = protocols.find((protocol) => protocol.id === activeId) ?? protocols[0];

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const base = accumulated.current;
      const since = startedAt.current ? Date.now() - startedAt.current : 0;
      setElapsed(base + since);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const start = () => {
    startedAt.current = Date.now();
    setRunning(true);
  };

  const pause = () => {
    if (startedAt.current) accumulated.current += Date.now() - startedAt.current;
    startedAt.current = null;
    setRunning(false);
  };

  const reset = () => {
    startedAt.current = null;
    accumulated.current = 0;
    setRunning(false);
    setElapsed(0);
  };

  const select = (id: string) => {
    setActiveId(id);
    reset();
  };

  const elapsedMinutes = elapsed / 60000;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {protocols.map((protocol) => (
          <button
            key={protocol.id}
            onClick={() => select(protocol.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              protocol.id === activeId
                ? "border-accent bg-accent/10 text-accent-strong dark:text-accent"
                : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {protocol.name}
          </button>
        ))}
      </div>

      {active && (
        <>
          <section className="workspace-panel overflow-hidden">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">{active.name}</p>
                <p className="display-type mt-1 text-5xl font-bold tabular-nums tracking-tight">{formatElapsed(elapsed)}</p>
                <p className="mt-2 max-w-xl text-xs leading-relaxed text-[var(--muted)]">{active.description}</p>
              </div>
              <div className="flex gap-2">
                {running ? (
                  <button onClick={pause} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-2 text-sm font-medium hover:border-accent/50">
                    <Pause className="h-4 w-4" /> Jeda
                  </button>
                ) : (
                  <button onClick={start} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent-button px-4 py-2 text-sm font-semibold hover:opacity-90">
                    <Play className="h-4 w-4" /> Mulai
                  </button>
                )}
                <button onClick={reset} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-2 text-sm font-medium hover:border-accent/50">
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>
            </div>
          </section>

          <section className="workspace-panel overflow-hidden">
            <h2 className="section-band display-type text-base font-bold">Target Waktu</h2>
            <ul className="divide-y divide-[var(--line)]">
              {active.milestones.map((milestone) => {
                const reached = elapsedMinutes >= milestone.targetMinutes;
                const overdue = reached && elapsedMinutes > milestone.targetMinutes + 5;
                return (
                  <li key={milestone.label} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="flex items-center gap-3 text-sm">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 shrink-0 rounded-full ${overdue ? "bg-red-500" : reached ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
                      />
                      <span className="text-[var(--ink)]">{milestone.label}</span>
                    </span>
                    <span className={`shrink-0 font-mono text-xs tabular-nums ${overdue ? "text-red-600 dark:text-red-400" : reached ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--muted)]"}`}>
                      {reached ? "tercapai" : `≤ ${milestone.targetMinutes} mnt`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <p className="text-[11px] leading-relaxed text-[var(--muted)]">
            Target mengacu pada {active.source.org} ({active.source.year}): {active.source.title}. Timer hanya alat bantu penghitung waktu dan tidak menggantikan protokol institusi setempat.
          </p>
        </>
      )}
    </div>
  );
}
