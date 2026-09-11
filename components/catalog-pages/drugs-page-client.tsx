"use client";

import { useMemo, useState } from "react";
import type { Drug } from "@/lib/types";
import { PageHeader, FilterInput, ToolCard, EmptyState } from "@/components/shared";

type DrugSummary = Pick<Drug, "slug" | "genericName" | "brandNames" | "drugClass" | "specialties" | "keywords" | "indications">;

export default function DrugsPageClient({ drugs, drugClasses }: { drugs: DrugSummary[]; drugClasses: string[] }) {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return drugs.filter((d) => {
      if (cls && d.drugClass !== cls) return false;
      if (!query) return true;
      return (
        d.genericName.toLowerCase().includes(query) ||
        d.brandNames?.some((b) => b.toLowerCase().includes(query)) ||
        d.drugClass.toLowerCase().includes(query) ||
        d.keywords.some((k) => k.includes(query)) ||
        d.indications.some((i) => i.toLowerCase().includes(query))
      );
    });
  }, [q, cls]);

  return (
    <div>
      <PageHeader
        title="Dosis Obat"
        description="Referensi dosis dewasa dan anak dengan kalkulator dosis berbasis berat badan. Dosis disusun dari referensi terbitan standar; tidak pernah dikarang tanpa dasar."
        count={drugs.length}
        countLabel="obat"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari obat… mis. amoksisilin, parasetamol, heparin" />
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCls("")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${!cls ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
        >
          Semua kelas
        </button>
        {drugClasses.map((c) => (
          <button
            key={c}
            onClick={() => setCls(cls === c ? "" : c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${cls === c ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={`Tidak ada obat yang cocok dengan “${q}”.`} />
      ) : (
        <div className="workspace-panel grid overflow-hidden sm:grid-cols-2 [&_.index-row]:border-[var(--line)] sm:[&_.index-row:nth-child(odd)]:border-r">
          {filtered.map((d) => (
            <ToolCard
              key={d.slug}
              tool={{
                slug: d.slug,
                title: d.genericName,
                description: `${d.drugClass} - ${d.indications.slice(0, 2).join("; ")}`,
                href: `/drugs/${d.slug}`,
                specialties: d.specialties,
                badge: d.drugClass,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
