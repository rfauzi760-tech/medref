"use client";

import { useMemo, useState } from "react";
import { Plus, X, AlertTriangle, ShieldAlert, Info, Minus } from "lucide-react";
import { DRUGS } from "@/lib/data/drugs";
import { INTERACTIONS } from "@/lib/data/interactions";
import type { Drug, InteractionSeverity } from "@/lib/types";
import { PageHeader } from "@/components/shared";
import { SourceBlock } from "@/components/source-block";

const SEVERITY_STYLE: Record<InteractionSeverity, { label: string; cls: string }> = {
  contraindicated: { label: "Contraindicated", cls: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-red-300 dark:border-red-800" },
  major: { label: "Major", cls: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200 border-orange-300 dark:border-orange-800" },
  moderate: { label: "Moderate", cls: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800" },
  minor: { label: "Minor", cls: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-800" },
  unknown: { label: "Unknown / insufficient data", cls: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700" },
};

export default function InteractionsPage() {
  const [added, setAdded] = useState<Drug[]>([]);
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return DRUGS.filter(
      (d) =>
        !added.some((a) => a.slug === d.slug) &&
        (d.genericName.toLowerCase().includes(q) || d.brandNames?.some((b) => b.toLowerCase().includes(q))),
    ).slice(0, 8);
  }, [query, added]);

  const pairs = useMemo(() => {
    const out: { a: Drug; b: Drug; interaction?: (typeof INTERACTIONS)[number] }[] = [];
    for (let i = 0; i < added.length; i++) {
      for (let j = i + 1; j < added.length; j++) {
        const x = added[i];
        const y = added[j];
        const interaction = INTERACTIONS.find(
          (it) => (it.a === x.slug && it.b === y.slug) || (it.a === y.slug && it.b === x.slug),
        );
        out.push({ a: x, b: y, interaction });
      }
    }
    return out;
  }, [added]);

  const severityCount = (sev: InteractionSeverity) => pairs.filter((p) => p.interaction?.severity === sev).length;
  const totalInteractions = pairs.filter((p) => p.interaction).length;

  const add = (d: Drug) => {
    setAdded((prev) => [...prev, d]);
    setQuery("");
    setChecked(true);
  };
  const remove = (slug: string) => setAdded((prev) => prev.filter((d) => d.slug !== slug));

  return (
    <div>
      <PageHeader
        title="Cek Interaksi Obat"
        description="Tambahkan beberapa obat untuk memeriksa interaksi berpasangan. Hasil berbasis kumpulan interaksi mapan yang dikurasi — tanpa data karangan."
      />

      {/* Selection panel */}
      <div className="workspace-panel p-5">
        <div className="flex flex-wrap items-center gap-2">
          {added.length === 0 && <p className="text-sm text-zinc-400">No medications added yet. Search and add at least two drugs.</p>}
          {added.map((d) => (
            <span key={d.slug} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 py-1 pl-3 pr-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
              {d.genericName}
              <button type="button" onClick={() => remove(d.slug)} aria-label={`Remove ${d.genericName}`} className="rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="relative mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a drug to add… e.g. warfarin, clarithromycin"
            className="focus-ring w-full rounded-md border border-line bg-surface px-3 py-2 pr-10 text-sm"
          />
          <Plus className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          {suggestions.length > 0 && (
            <div className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              {suggestions.map((d) => (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => add(d)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-accent/5"
                >
                  <span className="truncate">{d.genericName}</span>
                  <span className="shrink-0 text-[10px] text-zinc-400">{d.drugClass}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {added.length >= 2 && checked && (
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">Results</span>
            {totalInteractions === 0 ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                No interactions found in the database for these pairs
              </span>
            ) : (
              <>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-950 dark:text-orange-200">{severityCount("contraindicated")} contraindicated</span>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-950 dark:text-orange-200">{severityCount("major")} major</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">{severityCount("moderate")} moderate</span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200">{severityCount("minor")} minor</span>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{severityCount("unknown")} unknown</span>
              </>
            )}
          </div>

          <div className="space-y-3">
            {pairs.map(({ a, b, interaction }, i) => (
              <div key={i} className="workspace-panel p-5">
                {interaction ? (
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{a.genericName}</span>
                      <Minus className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="text-sm font-semibold">{b.genericName}</span>
                      <span className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_STYLE[interaction.severity].cls}`}>
                        {SEVERITY_STYLE[interaction.severity].label}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200">
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">Mechanism: </span>
                      {interaction.mechanism}
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200">
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">Effect: </span>
                      {interaction.effect}
                    </p>
                    <div className="rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/60">
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">Management: </span>
                      {interaction.management}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <Info className="h-4 w-4 shrink-0" />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">{a.genericName}</span>
                    <Minus className="h-3.5 w-3.5" />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">{b.genericName}</span>
                    <span className="ml-auto text-xs">No interaction recorded in database — absence of data does not prove safety.</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              This checker covers a curated set of well-documented interactions. It is not exhaustive — a negative result does not
              mean a combination is safe. Always consult a current interaction compendium and clinical pharmacist for complex regimens.
            </span>
          </div>

          <div className="mt-4">
            <SourceBlock source={{ org: "Standard interaction reference", title: "Drug interactions (severity categories per established compendia)", year: 2024, url: "https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02" }} />
          </div>
        </div>
      )}

      {added.length < 2 && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-sm text-zinc-400 dark:border-zinc-700">
          <ShieldAlert className="h-4 w-4" />
          Add at least two medications to run an interaction check.
        </div>
      )}
    </div>
  );
}
