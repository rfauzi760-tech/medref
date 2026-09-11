"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Siren } from "lucide-react";
import { guidelines } from "@/lib/data/guidelines";
import { PageHeader, FilterInput, EmptyState } from "@/components/shared";

export default function GuidelinesPage() {
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [emergency, setEmergency] = useState<"all" | "emergency" | "non-emergency">("all");

  const specialties = useMemo(() => [...new Set(guidelines.flatMap((g) => g.specialties))].sort(), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return guidelines.filter((g) => {
      if (specialty && !g.specialties.includes(specialty)) return false;
      if (emergency === "emergency" && !g.emergency) return false;
      if (emergency === "non-emergency" && g.emergency) return false;
      if (!query) return true;
      return g.title.toLowerCase().includes(query) || g.keywords.some((k) => k.includes(query));
    });
  }, [q, specialty, emergency]);

  return (
    <div>
      <PageHeader
        title="Panduan Klinis"
        description="Halaman referensi ringkas untuk dipakai di samping tempat tidur — diagnosis, klasifikasi, tatalaksana, kriteria rawat, tanda bahaya, dan referensi."
        count={guidelines.length}
        countLabel="panduan"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari panduan… mis. demam berdarah, sepsis, diabetes" />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-700">
          {(
            [
              ["all", "Semua"],
              ["emergency", "Emergensi"],
              ["non-emergency", "Non-emergensi"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setEmergency(key)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${emergency === key ? "bg-accent text-white" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-zinc-400"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="mx-1 hidden h-4 w-px bg-zinc-200 dark:bg-zinc-700 sm:block" />
        {specialties.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialty(specialty === s ? "" : s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${specialty === s ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={`Tidak ada panduan yang cocok dengan “${q}”.`} />
      ) : (
        <div className="workspace-panel grid overflow-hidden sm:grid-cols-2">
          {filtered.map((g) => (
            <Link
              key={g.slug}
              href={`/guidelines/${g.slug}`}
              className="index-row focus-ring group flex min-h-32 flex-col p-4 sm:odd:border-r"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent-strong dark:text-accent">
                  {g.emergency ? <Siren className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                </span>
                {g.emergency && (
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                    EMERGENSI
                  </span>
                )}
              </div>
              <h3 className="display-type mt-3 text-base font-medium group-hover:text-accent-strong dark:group-hover:text-accent">{g.title}</h3>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {g.ageGroup === "both" ? "Dewasa & anak" : g.ageGroup === "adult" ? "Dewasa" : g.ageGroup === "pediatric" ? "Anak" : g.ageGroup === "neonatal" ? "Neonatus" : g.ageGroup}
                </span>
                {g.pregnancyRelevant && <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] text-rose-600 dark:bg-rose-950 dark:text-rose-300">Terkait kehamilan</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
