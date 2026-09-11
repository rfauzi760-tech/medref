"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

/**
 * Interactive checklist over a procedure's existing preparation steps.
 * It renders only content already present on the procedure record; nothing
 * new is authored and the ticks are not persisted or transmitted.
 */
export default function ProcedureChecklist({ title, steps }: { title: string; steps: string[] }) {
  const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));
  const completed = done.filter(Boolean).length;
  const percent = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;

  const toggle = (index: number) =>
    setDone((current) => current.map((value, i) => (i === index ? !value : value)));

  const reset = () => setDone(steps.map(() => false));

  if (steps.length === 0) return null;

  return (
    <section className="workspace-panel overflow-hidden">
      <div className="section-band justify-between">
        <span className="display-type text-base font-bold">{title}</span>
        <button
          type="button"
          onClick={reset}
          className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] px-2 py-1 text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)]"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <div className="border-b border-[var(--line)] px-4 py-3">
        <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-[var(--muted)]">
          <span>{completed} dari {steps.length} langkah</span>
          <span className="tabular-nums">{percent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Kemajuan checklist">
          <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ul className="divide-y divide-[var(--line)]">
        {steps.map((step, index) => (
          <li key={`${step}-${index}`}>
            <label className="focus-ring flex cursor-pointer items-start gap-3 px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={done[index]}
                onChange={() => toggle(index)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span className={`min-w-0 leading-6 ${done[index] ? "text-[var(--muted)] line-through" : "text-[var(--ink)]"}`}>
                {step}
              </span>
              {done[index] && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
