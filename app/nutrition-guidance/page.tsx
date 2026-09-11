"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nutritionGuidance } from "@/lib/data/nutritionGuidance";
import { PageHeader, FilterInput, EmptyState } from "@/components/shared";

export default function NutritionGuidancePage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return nutritionGuidance;
    return nutritionGuidance.filter(
      (n) => n.title.toLowerCase().includes(query) || n.keywords.some((k) => k.includes(query)) || n.summary.toLowerCase().includes(query),
    );
  }, [q]);

  return (
    <div>
      <PageHeader
        title="Panduan Gizi Klinis"
        description="Prinsip gizi spesifik per kondisi, makanan yang dianjurkan dan dibatasi, serta contoh hari makan — berdasarkan panduan otoritatif (ADA, KDIGO/KDOQI, ACC/AHA, WHO)."
        count={nutritionGuidance.length}
        countLabel="kondisi"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari kondisi… mis. diabetes, CKD, hipertensi" />
      {filtered.length === 0 ? (
        <EmptyState message={`No nutrition guidance matches “${q}”.`} />
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
