"use client";

import { useMemo, useState } from "react";
import type { Drug, DosePopulation } from "@/lib/types";
import { calculateDose, doseToText, pickDoseEntry, estimateAgeYearsFromWeight } from "@/lib/calc/drugs";
import { CopyButton, PrintButton, SpecialtyTags } from "@/components/action-buttons";
import { SourceBlock } from "@/components/source-block";
import { useRecordVisit } from "@/components/use-local-store";

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="workspace-panel overflow-hidden">
      <h3 className="section-band display-type text-base font-medium">{title}</h3>
      <ul className="clinical-list space-y-1 p-4 text-sm text-zinc-700 dark:text-zinc-200">
        {items.map((i, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DrugView({ drug }: { drug: Drug }) {
  useRecordVisit({ href: `/drugs/${drug.slug}`, title: drug.genericName, group: "drugs" });

  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [population, setPopulation] = useState<"" | "adult" | "pediatric" | "neonatal">("");

  const ageYears = age ? Number(age) : weight ? estimateAgeYearsFromWeight(Number(weight)) : undefined;
  const result = useMemo(
    () =>
      calculateDose(drug, {
        weightKg: weight ? Number(weight) : undefined,
        ageYears,
        population: population || undefined,
      }),
    [drug, weight, ageYears, population],
  );

  const populations = [...new Set(drug.doses.map((d) => d.population))];
  const availableRoutes = [...new Set(drug.doses.map((d) => d.route))].join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-type text-3xl font-light tracking-tight sm:text-4xl">{drug.genericName}</h1>
        {drug.brandNames && drug.brandNames.length > 0 && (
          <p className="mt-1 text-sm text-zinc-400">Brands: {drug.brandNames.join(", ")}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{drug.drugClass}</span>
        </div>
        <div className="mt-3">
          <SpecialtyTags specialties={drug.specialties} />
        </div>
      </div>

      {drug.majorWarnings && (
        <div className="space-y-2">
          {drug.majorWarnings.map((w) => (
            <div key={w} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
              ⚠ {w}
            </div>
          ))}
        </div>
      )}

      <Section title="Indications" items={drug.indications} />

      {/* Dose calculator */}
      <div className="workspace-panel overflow-hidden pb-4">
        <div className="section-band justify-between">
          <h2 className="display-type text-base font-medium">Kalkulator dosis berbasis berat badan</h2>
          <div className="flex gap-2">
            <CopyButton text={result ? doseToText(drug, result) : ""} label="Copy dose" />
            <PrintButton />
          </div>
        </div>
        <p className="px-4 pt-4 text-xs text-[var(--muted)]">Masukkan berat badan untuk menghitung dosis dari skema {drug.genericName}.</p>

        <div className="mt-3 grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Weight (kg)</label>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 18"
              className="focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Age (years) {!age && ageYears && <span className="text-zinc-400">· est. {ageYears.toFixed(1)} y from weight</span>}
            </label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 5 (optional)"
              className="focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none"
            />
          </div>
          {populations.length > 1 && (
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Population</label>                <select
                value={population}
                onChange={(e) => setPopulation(e.target.value as "" | "adult" | "pediatric" | "neonatal")}
                className="focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none"
              >
                <option value="">Auto (by age)</option>
                {populations.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {result && (
          <div className="mt-4 space-y-2 px-4">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                {result.entry.route} · {result.entry.indication ?? drug.indications[0]}
              </p>
              {result.textOnly ? (
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{result.entry.text}</p>
              ) : (
                <div className="mt-2 space-y-1.5 text-sm">
                  {result.perDoseText && (
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-zinc-500 dark:text-zinc-400">Per administration</span>
                      <span className="font-semibold">{result.perDoseText}</span>
                    </div>
                  )}
                  {result.totalDailyText && (
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-zinc-500 dark:text-zinc-400">Total daily</span>
                      <span className="font-semibold">{result.totalDailyText}</span>
                    </div>
                  )}
                </div>
              )}
              {result.maxWarnings.map((w) => (
                <p key={w} className="mt-2 rounded bg-amber-100 px-2 py-1 text-xs text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                  ⚠ {w}
                </p>
              ))}
              <div className="mt-2 space-y-0.5">
                {result.notes.map((n, i) => (
                  <p key={i} className="text-xs text-zinc-500 dark:text-zinc-400">{n}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 px-4 text-xs text-zinc-400">
          Routes available: {availableRoutes}. Verify against your local formulary before prescribing.
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Contraindications" items={drug.contraindications ?? []} />
        <Section title="Renal considerations" items={drug.renalConsideration ? [drug.renalConsideration] : []} />
        <Section title="Hepatic considerations" items={drug.hepaticConsideration ? [drug.hepaticConsideration] : []} />
        <Section title="Preparations" items={drug.preparations ?? []} />
        {drug.pregnancy && <Section title="Pregnancy" items={[drug.pregnancy]} />}
        {drug.lactation && <Section title="Lactation" items={[drug.lactation]} />}
        <Section title="Clinical notes" items={drug.notes ?? []} />
      </div>

      <SourceBlock source={drug.source} lastReviewed={drug.lastReviewed} />
    </div>
  );
}
