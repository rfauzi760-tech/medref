"use client";

import { useMemo, useState } from "react";
import type { Drug } from "@/lib/types";
import { PageHeader, FilterInput, ToolCard, EmptyState } from "@/components/shared";

type DrugSummary = Pick<Drug, "slug" | "genericName" | "brandNames" | "drugClass" | "specialties" | "keywords" | "indications">;

export default function DrugsPageClient({ drugs }: { drugs: DrugSummary[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return drugs.filter((d) => {
      if (!query) return true;
      return (
        d.genericName.toLowerCase().includes(query) ||
        d.brandNames?.some((b) => b.toLowerCase().includes(query)) ||
        d.drugClass.toLowerCase().includes(query) ||
        d.keywords.some((k) => k.includes(query)) ||
        d.indications.some((i) => i.toLowerCase().includes(query))
      );
    });
  }, [q, drugs]);

  return (
    <div>
      <PageHeader
        title="Dosis Obat"
      />
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
