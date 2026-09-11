"use client";

import { useEffect, useState } from "react";
import type { ScoreEvaluation, ScoreValues } from "@/lib/types";
import type { PublicScoreTool } from "@/lib/score-public";
import { CopyButton, ResetButton, PrintButton, SpecialtyTags } from "@/components/action-buttons";
import { SourceBlock } from "@/components/source-block";
import { useRecordVisit } from "@/components/use-local-store";

const toneClasses: Record<string, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  info: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200",
  warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  danger: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

export function ScoreToolView({ tool }: { tool: PublicScoreTool }) {
  useRecordVisit({ href: `/scores/${tool.slug}`, title: tool.title, group: "scores" });
  const [values, setValues] = useState<ScoreValues>({});
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState<{
    evaluation: ScoreEvaluation;
    complete: boolean;
    visibleVariableIds: string[];
    resultText: string;
  } | null>(null);
  const [requestFailed, setRequestFailed] = useState(false);

  useEffect(() => {
    if (Object.keys(values).length === 0) {
      return;
    }
    const controller = new AbortController();
    fetch(`/api/scores/${tool.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Penghitungan skor gagal");
        return response.json() as Promise<NonNullable<typeof result>>;
      })
      .then((payload) => {
        setResult(payload);
        setRequestFailed(false);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setResult(null);
          setRequestFailed(true);
        }
      });
    return () => controller.abort();
  }, [tool.slug, values]);

  const ev = result?.evaluation;
  const complete = result?.complete ?? false;
  const canShow = touched && Object.keys(values).length > 0;
  const loading = canShow && !result && !requestFailed;
  const visibleIds = result?.visibleVariableIds;
  const visibleVars = visibleIds ? tool.variables.filter((variable) => visibleIds.includes(variable.id)) : tool.variables;

  const set = (id: string, v: string | number | undefined) => {
    setResult(null);
    setRequestFailed(false);
    setValues((prev) => ({ ...prev, [id]: v }));
    setTouched(true);
  };

  const reset = () => {
    setValues({});
    setTouched(false);
    setResult(null);
    setRequestFailed(false);
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
      </div>

      {tool.warnings?.map((w) => (
        <div key={w} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          ⚠ {w}
        </div>
      ))}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Inputs */}
        <div className="workspace-panel overflow-hidden pb-4">
          <div className="section-band justify-between">
            <h2 className="display-type text-base font-medium">Penilaian</h2>
            <ResetButton onReset={reset} />
          </div>

          {visibleVars.map((v) => (
            <div key={v.id} className="space-y-1.5 px-4 pt-4">
              <label htmlFor={`${tool.slug}-${v.id}`} className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {v.label}
                {v.required && <span className="ml-0.5 text-red-500">*</span>}
              </label>
              {v.help && <p className="text-xs text-zinc-400">{v.help}</p>}
              {v.type === "select" && (
                <div className="space-y-1.5">
                  {v.options?.map((o) => {
                    const selected = String(values[v.id]) === String(o.value);
                    return (
                      <label
                        key={String(o.value)}
                        className={`focus-ring flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          selected
                            ? "border-accent bg-accent/5 ring-1 ring-accent"
                            : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${tool.slug}-${v.id}`}
                          className="sr-only"
                          checked={selected}
                          onChange={() => set(v.id, o.value)}
                        />
                        <span className="text-zinc-700 dark:text-zinc-200">{o.label}</span>
                        {o.value !== 0 && <span className="shrink-0 font-mono text-xs text-zinc-400">{o.value > 0 ? "+" : ""}{o.value} poin</span>}
                      </label>
                    );
                  })}
                </div>
              )}
              {v.type === "bool" && (
                <div className="flex gap-2">
                  {                  [
                    { label: "Ya", value: 1 },
                    { label: "Tidak", value: 0 },
                  ].map((o) => {
                    const selected = String(values[v.id]) === String(o.value);
                    return (
                      <button
                        key={o.label}
                        type="button"
                        onClick={() => set(v.id, o.value)}
                        className={`focus-ring min-h-11 flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          selected ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {v.type === "number" && (
                <input
                  id={`${tool.slug}-${v.id}`}
                  type="number"
                  min={v.min}
                  max={v.max}
                  step={v.step ?? 1}
                  value={values[v.id] ?? ""}
                  onChange={(e) => set(v.id, e.target.value)}
                  className="focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none"
                />
              )}
            </div>
          ))}

          {visibleVars.length === 0 && <p className="text-sm text-zinc-400">Tidak ada input yang tersedia.</p>}
        </div>

        {/* Result */}
        <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <div className="workspace-panel overflow-hidden">
            <div className="section-band justify-between">
              <h2 className="display-type text-base font-medium">Hasil</h2>
              {canShow && complete && result && <CopyButton text={result.resultText} />}
            </div>

            {!canShow ? (
              <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">Isi kolom penilaian untuk menghitung skor.</p>
            ) : requestFailed ? (
              <p className="px-4 py-10 text-center text-sm text-red-600 dark:text-red-400">Penghitungan gagal. Coba ubah jawaban atau muat ulang halaman.</p>
            ) : loading || !ev ? (
              <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">Menghitung…</p>
            ) : !complete ? (
              <p className="px-4 py-10 text-center text-sm text-amber-600 dark:text-amber-400">
                Input wajib belum diisi: {ev.missing.join(", ")}
              </p>
            ) : (
              <div className="space-y-4 p-4">
                <div className={`rounded-lg border px-4 py-3 ${toneClasses[ev.range?.tone ?? "info"]}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{ev.total}</span>
                    <span className="text-sm font-medium">{ev.range?.category}</span>
                  </div>
                  <p className="mt-1 text-sm">{ev.range?.label}</p>
                  {ev.range?.action && (
                    <p className="mt-2 rounded bg-black/5 px-2 py-1.5 text-xs dark:bg-white/10">→ {ev.range.action}</p>
                  )}
                </div>

                {ev.computeDetail && <p className="text-xs text-zinc-500 dark:text-zinc-400">{ev.computeDetail}</p>}

                <div className="space-y-1 text-sm">
                  {ev.perVariable
                    .filter((p) => p.selected)
                    .map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1 dark:bg-zinc-800/60">
                        <span className="text-zinc-600 dark:text-zinc-300">{p.label}</span>
                        <span className="font-mono text-xs text-zinc-400">
                          {p.selected}
                          {p.points !== 0 && <span className="ml-1.5 font-medium text-zinc-500 dark:text-zinc-300">{p.points > 0 ? "+" : ""}{p.points}</span>}
                        </span>
                      </div>
                    ))}
                  {ev.appliedModifiers.map((m, i) => (
                    <div key={i} className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1 text-xs dark:bg-zinc-800/60">
                      <span className="text-zinc-500 dark:text-zinc-400">{m.note}</span>
                      <span className="font-mono">{m.delta > 0 ? "+" : ""}{m.delta}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {tool.limitations && (
            <div className="workspace-panel p-4 text-xs leading-relaxed text-[var(--muted)]">
              <span className="font-semibold text-zinc-600 dark:text-zinc-300">Keterbatasan. </span>
              {tool.limitations}
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
