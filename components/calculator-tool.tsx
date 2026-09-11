"use client";

import { useMemo, useState } from "react";
import type { CalculatorTool } from "@/lib/types";
import { runCalculator } from "@/lib/calc/calculators";
import { CopyButton, ResetButton, PrintButton, SpecialtyTags } from "@/components/action-buttons";
import { SourceBlock } from "@/components/source-block";
import { useRecordVisit } from "@/components/use-local-store";
import { translateCalculatorText } from "@/lib/data/calculators";

const toneClasses: Record<string, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  info: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200",
  warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  danger: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

function toResultText(tool: CalculatorTool, result: ReturnType<typeof runCalculator>): string {
  const lines = [`${tool.title}${tool.abbreviation ? ` (${tool.abbreviation})` : ""}`];
  for (const l of result.lines) lines.push(`• ${translateCalculatorText(l.label)}: ${translateCalculatorText(l.value)}${l.unit ? " " + l.unit : ""}${l.detail ? ` - ${translateCalculatorText(l.detail)}` : ""}`);
  for (const w of result.warnings ?? []) lines.push(`⚠ ${translateCalculatorText(w)}`);
  if (result.note) lines.push(translateCalculatorText(result.note));
  lines.push(`Sumber: ${tool.source.org}, ${tool.source.title} (${tool.source.year})`);
  lines.push("Hanya alat bantu keputusan klinis. Tidak menggantikan penilaian klinis.");
  return lines.join("\n");
}

export function CalculatorToolView({ tool }: { tool: CalculatorTool }) {
  useRecordVisit({ href: `/calculators/${tool.slug}`, title: tool.title, group: "calculators" });
  const [values, setValues] = useState<Record<string, number | string | undefined>>({});
  const [touched, setTouched] = useState(false);

  const result = useMemo(() => runCalculator(tool, values), [tool, values]);
  const allRequiredAnswered = tool.inputs.filter((i) => i.required && !(i.hideWhen && i.hideWhen(values))).every((i) => {
    const v = values[i.id];
    return v !== undefined && v !== "";
  });
  const canShow = touched && allRequiredAnswered;
  const visibleInputs = tool.inputs.filter((i) => !(i.hideWhen && i.hideWhen(values)));

  const set = (id: string, v: string | number | undefined) => {
    setValues((prev) => ({ ...prev, [id]: v }));
    setTouched(true);
  };
  const reset = () => {
    setValues({});
    setTouched(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="display-type text-3xl font-light tracking-tight sm:text-4xl">
            {tool.title}
            {tool.abbreviation && <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 font-mono text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{tool.abbreviation}</span>}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-500 dark:text-zinc-400">{tool.description}</p>
        </div>
        <SpecialtyTags specialties={tool.specialties} />
        {tool.formulaText && (
          <div className="inline-block rounded-lg bg-zinc-100 px-3 py-1.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {tool.formulaText}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="workspace-panel overflow-hidden pb-4">
          <div className="section-band justify-between">
            <h2 className="display-type text-base font-medium">Input klinis</h2>
            <ResetButton onReset={reset} />
          </div>

          {visibleInputs.map((i) => (
            <div key={i.id} className="space-y-1.5 px-4 pt-4">
              <label htmlFor={`${tool.slug}-${i.id}`} className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {i.label}
                {i.required && <span className="ml-0.5 text-red-500">*</span>}
              </label>
              {i.help && <p className="text-xs text-zinc-400">{i.help}</p>}
              {i.type === "number" && (
                <div className="relative">
                  <input
                    id={`${tool.slug}-${i.id}`}
                    type="number"
                    min={i.min}
                    max={i.max}
                    step={i.step ?? 1}
                    value={values[i.id] ?? ""}
                    onChange={(e) => set(i.id, e.target.value)}
                    className="focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 pr-16 text-sm outline-none"
                  />
                  {i.unit && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-zinc-400">{i.unit}</span>}
                </div>
              )}
              {i.type === "date" && (
                <input
                  id={`${tool.slug}-${i.id}`}
                  type="date"
                  value={(values[i.id] as string) ?? ""}
                  onChange={(e) => set(i.id, e.target.value)}
                  className="focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none"
                />
              )}
              {i.type === "select" && (
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {i.options?.map((o) => {
                    const selected = String(values[i.id]) === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => set(i.id, o.value)}
                        className={`focus-ring min-h-11 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          selected ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {i.type === "bool" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => set(i.id, "yes")}
                    className={`focus-ring min-h-11 flex-1 rounded-lg border px-3 py-2 text-sm ${String(values[i.id]) === "yes" ? "border-accent bg-accent/10" : "border-[var(--line)]"}`}
                  >
                    Ya
                  </button>
                  <button
                    type="button"
                    onClick={() => set(i.id, "no")}
                    className={`focus-ring min-h-11 flex-1 rounded-lg border px-3 py-2 text-sm ${String(values[i.id]) === "no" ? "border-accent bg-accent/10" : "border-[var(--line)]"}`}
                  >
                    Tidak
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <div className="workspace-panel overflow-hidden">
            <div className="section-band justify-between">
              <h2 className="display-type text-base font-medium">Hasil</h2>
              {canShow && <CopyButton text={toResultText(tool, result)} />}
            </div>

            {!canShow ? (
              <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">Lengkapi input untuk melihat hasil.</p>
            ) : (
              <div className="space-y-2 p-4">
                {result.warnings?.map((w) => (
                  <div key={w} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    ⚠ {translateCalculatorText(w)}
                  </div>
                ))}
                {result.lines.map((l, i) => (
                  <div
                    key={i}
                    className={`flex items-baseline justify-between gap-2 rounded-lg border px-3 py-2 ${
                      l.tone ? toneClasses[l.tone] : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/60"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium opacity-80">{translateCalculatorText(l.label)}</div>
                      {l.detail && <div className="text-[11px] opacity-70">{translateCalculatorText(l.detail)}</div>}
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-base font-bold">{translateCalculatorText(l.value)}</span>
                      {l.unit && <span className="ml-1 text-xs opacity-70">{l.unit}</span>}
                    </div>
                  </div>
                ))}
                {result.note && <p className="pt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{translateCalculatorText(result.note)}</p>}
              </div>
            )}
          </div>

          {tool.interpretation && (
            <div className="workspace-panel p-4 text-xs leading-relaxed text-[var(--muted)]">
              <span className="font-semibold text-zinc-600 dark:text-zinc-300">Interpretasi. </span>
              {tool.interpretation}
            </div>
          )}

          <div className="flex gap-2">
            <PrintButton />
          </div>
        </div>
      </div>

      <SourceBlock source={tool.source} lastReviewed={tool.lastReviewed} />
    </div>
  );
}
