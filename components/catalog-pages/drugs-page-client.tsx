"use client";

import { useMemo, useState } from "react";
import type { Drug } from "@/lib/types";
import { PageHeader, FilterInput, ToolCard, EmptyState } from "@/components/shared";

type DrugSummary = Pick<Drug, "slug" | "genericName" | "brandNames" | "drugClass" | "specialties" | "keywords" | "indications"> & {
  hasPediatricDose: boolean;
};

export default function DrugsPageClient({
  drugs,
  initialPediatricMode = false,
}: {
  drugs: DrugSummary[];
  initialPediatricMode?: boolean;
}) {
  const [q, setQ] = useState("");
  const [pediatricOnly, setPediatricOnly] = useState(initialPediatricMode);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return drugs.filter((d) => {
      if (pediatricOnly && !d.hasPediatricDose) return false;
      if (!query) return true;
      return (
        d.genericName.toLowerCase().includes(query) ||
        d.brandNames?.some((b) => b.toLowerCase().includes(query)) ||
        d.drugClass.toLowerCase().includes(query) ||
        d.keywords.some((k) => k.includes(query)) ||
        d.indications.some((i) => i.toLowerCase().includes(query))
      );
    });
  }, [q, pediatricOnly, drugs]);

  const pediatricCount = drugs.filter((drug) => drug.hasPediatricDose).length;

  return (
    <div>
      <PageHeader
        title={pediatricOnly ? "Dosis Obat Anak" : "Dosis Obat"}
        description={pediatricOnly
          ? "Cari regimen pediatrik, hitung dosis berbasis berat badan, dan konversikan ke sediaan yang tersedia."
          : "Referensi dosis dewasa dan anak dengan kalkulator dosis berbasis berat badan. Dosis disusun dari referensi terbitan standar."}
        count={pediatricOnly ? pediatricCount : drugs.length}
        countLabel="obat"
      />
      <div className="mb-4 inline-flex overflow-hidden rounded-lg border border-[var(--line)]" aria-label="Populasi obat">
        <button
          type="button"
          aria-pressed={!pediatricOnly}
          onClick={() => setPediatricOnly(false)}
          className={`min-h-10 px-4 text-sm font-bold ${!pediatricOnly ? "bg-accent text-white" : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}
        >
          Semua
        </button>
        <button
          type="button"
          aria-pressed={pediatricOnly}
          onClick={() => setPediatricOnly(true)}
          className={`min-h-10 border-l border-[var(--line)] px-4 text-sm font-bold ${pediatricOnly ? "bg-accent text-white" : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}
        >
          Anak
        </button>
      </div>
      <FilterInput value={q} onChange={setQ} placeholder="Cari nama generik, merek, kelas, atau indikasi" />

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
                href: `/drugs/${d.slug}${pediatricOnly ? "?mode=anak" : ""}`,
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
