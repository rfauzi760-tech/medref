"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { NutritionGuidance } from "@/lib/types";
import { PageHeader, FilterInput, EmptyState } from "@/components/shared";

type NutritionSummary = Pick<NutritionGuidance, "slug" | "title" | "summary" | "keywords" | "specialties">;

export default function NutritionGuidancePageClient({ items }: { items: NutritionSummary[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (n) => n.title.toLowerCase().includes(query) || n.keywords.some((k) => k.includes(query)) || n.summary.toLowerCase().includes(query),
    );
  }, [q]);

  return (
    <div>
      <PageHeader
        title="Panduan Gizi Klinis"
        description="Prinsip gizi spesifik per kondisi, makanan yang dianjurkan dan dibatasi, serta contoh hari makan - berdasarkan panduan otoritatif (ADA, KDIGO/KDOQI, ACC/AHA, WHO)."
        count={items.length}
        countLabel="kondisi"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari kondisi… mis. diabetes, CKD, hipertensi" />
      {filtered.length === 0 ? (
        <EmptyState message={`Tidak ada panduan gizi yang cocok dengan “${q}”.`} />
      ) : (
        <div className="workspace-panel grid overflow-hidden sm:grid-cols-2">
          {filtered.map((n) => (
            <Link
              key={n.slug}
              href={`/nutrition-guidance/${n.slug}`}
              className="index-row focus-ring group flex min-h-32 flex-col p-4 sm:odd:border-r"
            >
              <h3 className="display-type text-base font-medium group-hover:text-accent-strong dark:group-hover:text-accent">{n.title}</h3>
              <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{n.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {n.specialties.slice(0, 3).map((s) => (
                  <span key={s} className="rounded bg-accent/8 px-1.5 py-0.5 text-[10px] font-medium text-accent-strong/80 dark:text-accent/80">
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
