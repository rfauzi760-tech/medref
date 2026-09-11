"use client";

import { useMemo, useState } from "react";
import type { CalculatorTool } from "@/lib/types";
import { CALCULATOR_CATEGORIES } from "@/lib/calc/calculators";
import { PageHeader, FilterInput, ToolCard, EmptyState } from "@/components/shared";

type CalculatorSummary = Pick<CalculatorTool, "slug" | "title" | "abbreviation" | "description" | "specialties" | "keywords" | "category">;

export default function CalculatorsPageClient({ calculators }: { calculators: CalculatorSummary[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return calculators.filter((c) => {
      if (cat && c.category !== cat) return false;
      if (!query) return true;
      return (
        c.title.toLowerCase().includes(query) ||
        (c.abbreviation ?? "").toLowerCase().includes(query) ||
        c.keywords.some((k) => k.includes(query)) ||
        c.description.toLowerCase().includes(query)
      );
    });
  }, [q, cat]);

  const grouped = useMemo(() => {
    const byCat = new Map<string, typeof calculators>();
    for (const c of filtered) {
      const arr = byCat.get(c.category) ?? [];
      arr.push(c);
      byCat.set(c.category, arr);
    }
    return CALCULATOR_CATEGORIES.filter(({ key }) => byCat.has(key)).map(({ key, label }) => [label, byCat.get(key)!] as const);
  }, [filtered]);

  return (
    <div>
      <PageHeader
        title="Kalkulator Klinis"
        description="Kalkulator tubuh, ginjal, cairan, elektrolit, kardiovaskular, dan dosis obat. Setiap rumus diuji unit terhadap nilai referensi terbitan."
        count={calculators.length}
        countLabel="kalkulator"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari kalkulator… mis. eGFR, anion gap, MAP" />
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCat("")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${!cat ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
        >
          Semua
        </button>
        {CALCULATOR_CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(cat === c.key ? "" : c.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${cat === c.key ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <EmptyState message={`Tidak ada kalkulator yang cocok dengan “${q}”.`} />
      ) : (
        <div className="space-y-8">
          {grouped.map(([label, tools]) => (
            <section key={label}>
              <h2 className="display-type mb-3 text-lg font-light">{label} · {tools.length}</h2>
              <div className="workspace-panel grid overflow-hidden sm:grid-cols-2 [&_.index-row]:border-[var(--line)] sm:[&_.index-row:nth-child(odd)]:border-r">
                {tools.map((c) => (
                  <ToolCard
                    key={c.slug}
                    tool={{
                      slug: c.slug,
                      title: c.title,
                      abbreviation: c.abbreviation,
                      description: c.description,
                      href: `/calculators/${c.slug}`,
                      specialties: c.specialties,
                      badge: c.abbreviation,
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
