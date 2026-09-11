"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X, AlertTriangle, ShieldAlert, Info, Minus } from "lucide-react";
import type { DrugInteraction, InteractionSeverity } from "@/lib/types";
import { PageHeader } from "@/components/shared";
import { SourceBlock } from "@/components/source-block";

const SEVERITY_STYLE: Record<InteractionSeverity, { label: string; cls: string }> = {
  contraindicated: { label: "Kontraindikasi", cls: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-red-300 dark:border-red-800" },
  major: { label: "Mayor", cls: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200 border-orange-300 dark:border-orange-800" },
  moderate: { label: "Moderat", cls: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800" },
  minor: { label: "Minor", cls: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-800" },
  unknown: { label: "Tidak diketahui / data tidak cukup", cls: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700" },
};

type DrugSummary = {
  slug: string;
  genericName: string;
  brandNames?: string[];
  drugClass: string;
};

type InteractionPair = {
  a: DrugSummary;
  b: DrugSummary;
  interaction?: DrugInteraction;
};

export default function InteractionsPageClient({ drugs }: { drugs: DrugSummary[] }) {
  const [added, setAdded] = useState<DrugSummary[]>([]);
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(false);
  const [pairs, setPairs] = useState<InteractionPair[]>([]);
  const [requestFailed, setRequestFailed] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return drugs.filter(
      (d) =>
        !added.some((a) => a.slug === d.slug) &&
        (d.genericName.toLowerCase().includes(q) || d.brandNames?.some((b) => b.toLowerCase().includes(q))),
    ).slice(0, 8);
  }, [query, added]);

  useEffect(() => {
    if (added.length < 2) {
      return;
    }
    const controller = new AbortController();
    fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs: added.map((drug) => drug.slug) }),
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Pemeriksaan interaksi gagal");
        return response.json() as Promise<{ pairs: InteractionPair[] }>;
      })
      .then((payload) => {
        setPairs(payload.pairs);
        setRequestFailed(false);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setPairs([]);
          setRequestFailed(true);
        }
      });
    return () => controller.abort();
  }, [added]);

  const severityCount = (sev: InteractionSeverity) => pairs.filter((p) => p.interaction?.severity === sev).length;
  const totalInteractions = pairs.filter((p) => p.interaction).length;
  const loading = added.length >= 2 && pairs.length === 0 && !requestFailed;

  const add = (d: DrugSummary) => {
    setPairs([]);
    setRequestFailed(false);
    setAdded((prev) => [...prev, d]);
    setQuery("");
    setChecked(true);
  };
  const remove = (slug: string) => {
    setPairs([]);
    setRequestFailed(false);
    setAdded((prev) => prev.filter((d) => d.slug !== slug));
  };

  return (
    <div>
      <PageHeader
        title="Cek Interaksi Obat"
        description="Tambahkan beberapa obat untuk memeriksa interaksi berpasangan. Hasil berbasis kumpulan interaksi mapan yang dikurasi - tanpa data karangan."
      />

      {/* Selection panel */}
      <div className="workspace-panel p-5">
        <div className="flex flex-wrap items-center gap-2">
          {added.length === 0 && <p className="text-sm text-zinc-400">Belum ada obat. Cari dan tambahkan minimal dua obat.</p>}
          {added.map((d) => (
            <span key={d.slug} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 py-1 pl-3 pr-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
              {d.genericName}
              <button type="button" onClick={() => remove(d.slug)} aria-label={`Hapus ${d.genericName}`} className="rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="relative mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari obat untuk ditambahkan… mis. warfarin, klaritromisin"
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
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">Hasil</span>
            {requestFailed ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">Pemeriksaan gagal. Coba lagi.</span>
            ) : loading ? (
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">Memeriksa…</span>
            ) : totalInteractions === 0 ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                Tidak ditemukan interaksi dalam basis data untuk pasangan ini
              </span>
            ) : (
              <>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-950 dark:text-orange-200">{severityCount("contraindicated")} kontraindikasi</span>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-950 dark:text-orange-200">{severityCount("major")} mayor</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">{severityCount("moderate")} moderat</span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200">{severityCount("minor")} minor</span>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{severityCount("unknown")} tidak diketahui</span>
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
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">Mekanisme: </span>
                      {interaction.mechanism}
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200">
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">Efek: </span>
                      {interaction.effect}
                    </p>
                    <div className="rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/60">
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">Penanganan: </span>
                      {interaction.management}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <Info className="h-4 w-4 shrink-0" />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">{a.genericName}</span>
                    <Minus className="h-3.5 w-3.5" />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">{b.genericName}</span>
                    <span className="ml-auto text-xs">Tidak ada interaksi yang tercatat. Ketiadaan data tidak membuktikan keamanan.</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Pemeriksa ini mencakup interaksi yang terdokumentasi dalam basis data. Hasil negatif tidak berarti kombinasi pasti aman.
              Selalu periksa referensi terbaru dan konsultasikan regimen kompleks dengan apoteker klinis.
            </span>
          </div>

          <div className="mt-4">
            <SourceBlock source={{ org: "Klinea", title: "Basis data interaksi obat", year: 2026, url: "https://www.klinea.id/app.html" }} />
          </div>
        </div>
      )}

      {added.length < 2 && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-sm text-zinc-400 dark:border-zinc-700">
          <ShieldAlert className="h-4 w-4" />
          Tambahkan minimal dua obat untuk menjalankan pemeriksaan interaksi.
        </div>
      )}
    </div>
  );
}
