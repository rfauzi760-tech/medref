"use client";

import { useMemo, useRef, useState } from "react";
import type { ScoreEvaluation, ScoreValues } from "@/lib/types";
import type { PublicScoreTool } from "@/lib/score-public";
import { evaluateScore, scoreSelectionKey, scoreToText, visibleScoreVariableIds } from "@/lib/calc/scores";
import { CopyButton, ResetButton, PrintButton, SpecialtyTags } from "@/components/action-buttons";
import { SourceBlock } from "@/components/source-block";
import { useRecordVisit } from "@/components/use-local-store";

const toneClasses: Record<string, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  info: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200",
  warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  danger: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

type ScoreResult = {
  evaluation: ScoreEvaluation;
  complete: boolean;
  visibleVariableIds: string[];
  resultText: string;
};

function evaluateLocalScore(tool: PublicScoreTool, values: ScoreValues): ScoreResult {
  const evaluation = evaluateScore(tool, values);
  return {
    evaluation,
    complete: evaluation.missing.length === 0,
    visibleVariableIds: visibleScoreVariableIds(tool, values),
    resultText: scoreToText(tool, evaluation),
  };
}

export function ScoreToolView({ tool }: { tool: PublicScoreTool }) {
  useRecordVisit({ href: `/scores/${tool.slug}`, title: tool.title, group: "scores" });
  const [values, setValues] = useState<ScoreValues>({});
  const [touched, setTouched] = useState(false);
  const [serverResult, setServerResult] = useState<ScoreResult | null>(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const localResult = useMemo(() => {
    if (tool.requiresServerCalculation || Object.keys(values).length === 0) return null;
    return evaluateLocalScore(tool, values);
  }, [tool, values]);
  const result = tool.requiresServerCalculation ? serverResult : localResult;

  const ev = result?.evaluation;
  const complete = result?.complete ?? false;
  const canShow = touched && Object.keys(values).length > 0;
  const visibleIds = result?.visibleVariableIds;
  const visibleVars = visibleIds ? tool.variables.filter((variable) => visibleIds.includes(variable.id)) : tool.variables;

  const cancelServerCalculation = () => {
    if (!controllerRef.current) return;
    requestIdRef.current += 1;
    controllerRef.current.abort();
    controllerRef.current = null;
    setIsCalculating(false);
  };

  const calculateSpecialScore = async () => {
    if (!tool.requiresServerCalculation || Object.keys(values).length === 0) return;
    cancelServerCalculation();
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsCalculating(true);
    setRequestFailed(false);

    try {
      const response = await fetch(`/api/scores/${tool.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Penghitungan skor gagal");
      const payload = await response.json() as ScoreResult;
      if (requestId === requestIdRef.current) {
        setServerResult(payload);
        setRequestFailed(false);
      }
    } catch (error: unknown) {
      if (requestId === requestIdRef.current && !(error instanceof DOMException && error.name === "AbortError")) {
        setServerResult(null);
        setRequestFailed(true);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        controllerRef.current = null;
        setIsCalculating(false);
      }
    }
  };

  const set = (id: string, v: string | number | undefined) => {
    cancelServerCalculation();
    setServerResult(null);
    setRequestFailed(false);
    setValues((prev) => ({ ...prev, [id]: v }));
    setTouched(true);
  };

  const reset = () => {
    cancelServerCalculation();
    setValues({});
    setTouched(false);
    setServerResult(null);
    setRequestFailed(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="display-type text-3xl font-bold tracking-tight sm:text-4xl">
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
            <h2 className="display-type text-base font-bold">Penilaian</h2>
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
                  {v.options?.map((o, optionIndex) => {
                    const selectionKey = scoreSelectionKey(v.id, optionIndex);
                    const selected = String(values[v.id]) === selectionKey;
                    return (
                      <label
                        key={selectionKey}
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
                          onChange={() => set(v.id, selectionKey)}
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

          {tool.requiresServerCalculation && (
            <div className="space-y-2 px-4 pt-4">
              <p className="text-xs leading-relaxed text-[var(--muted)]">
                Aturan skor ini memerlukan evaluasi khusus. Jawaban dikirim satu kali saat Anda menekan tombol, bukan setiap kali diubah.
              </p>
              <button
                type="button"
                onClick={() => void calculateSpecialScore()}
                disabled={!canShow || isCalculating}
                className="focus-ring min-h-11 w-full rounded-lg bg-accent-button px-3 py-2 text-sm font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCalculating ? "Menghitung…" : "Hitung skor"}
              </button>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <div className="workspace-panel overflow-hidden">
            <div className="section-band justify-between">
              <h2 className="display-type text-base font-bold">Hasil</h2>
              {canShow && complete && result && <CopyButton text={result.resultText} />}
            </div>

            {!canShow ? (
              <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">Isi kolom penilaian untuk menghitung skor.</p>
            ) : requestFailed ? (
              <p className="px-4 py-10 text-center text-sm text-red-600 dark:text-red-400">Penghitungan gagal. Coba ubah jawaban atau muat ulang halaman.</p>
            ) : isCalculating ? (
              <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">Menghitung…</p>
            ) : !result || !ev ? (
              <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                {tool.requiresServerCalculation ? "Tekan “Hitung skor” untuk menjalankan evaluasi khusus." : "Lengkapi input untuk melihat hasil."}
              </p>
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
