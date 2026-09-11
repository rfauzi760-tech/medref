"use client";

import { useMemo, useState } from "react";
import { procedureEntries } from "@/lib/data/indications";
import { PageHeader, FilterInput, ToolCard, EmptyState } from "@/components/shared";

export default function IndicationsPage() {
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("");

  const specialties = useMemo(() => [...new Set(procedureEntries.flatMap((p) => p.specialties))].sort(), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return procedureEntries.filter((p) => {
      if (specialty && !p.specialties.includes(specialty)) return false;
      if (!query) return true;
      return p.title.toLowerCase().includes(query) || p.keywords.some((k) => k.includes(query)) || p.definition.toLowerCase().includes(query);
    });
  }, [q, specialty]);

  return (
    <div>
      <PageHeader
        title="Indikasi & Kontraindikasi"
        description="Referensi terstruktur prosedur klinis umum - indikasi, kontraindikasi absolut dan relatif, tindakan pencegahan, persiapan, dan komplikasi."
        count={procedureEntries.length}
        countLabel="prosedur"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari prosedur… mis. kateter, intubasi, pungsi lumbal" />
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setSpecialty("")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${!specialty ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
        >
          All
        </button>
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
        <EmptyState message={`Tidak ada prosedur yang cocok dengan “${q}”.`} />
      ) : (
        <div className="workspace-panel grid overflow-hidden sm:grid-cols-2 [&_.index-row]:border-[var(--line)] sm:[&_.index-row:nth-child(odd)]:border-r">
          {filtered.map((p) => (
            <ToolCard
              key={p.slug}
              tool={{
                slug: p.slug,
                title: p.title,
                description: p.definition,
                href: `/indications/${p.slug}`,
                specialties: p.specialties,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
