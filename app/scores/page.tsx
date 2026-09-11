"use client";

import { useMemo, useState } from "react";
import { SCORES } from "@/lib/data/scores";
import { PageHeader, FilterInput, ToolCard, EmptyState } from "@/components/shared";

const CATEGORY_LABELS: Record<string, string> = {
  score: "Skor",
  rule: "Aturan Klinis",
  criteria: "Kriteria Diagnosis",
};

export default function ScoresPage() {
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState<string>("");

  const specialties = useMemo(() => [...new Set(SCORES.flatMap((s) => s.specialties))].sort(), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return SCORES.filter((s) => {
      if (specialty && !s.specialties.includes(specialty)) return false;
      if (!query) return true;
      return (
        s.title.toLowerCase().includes(query) ||
        (s.abbreviation ?? "").toLowerCase().includes(query) ||
        s.keywords.some((k) => k.includes(query)) ||
        s.description.toLowerCase().includes(query)
      );
    });
  }, [q, specialty]);

  const grouped = useMemo(() => {
    const byCat = new Map<string, typeof SCORES>();
    for (const s of filtered) {
      const arr = byCat.get(s.category) ?? [];
      arr.push(s);
      byCat.set(s.category, arr);
    }
    return [...byCat.entries()];
  }, [filtered]);

  return (
    <div>
      <PageHeader
        title="Skrining & Skor"
        description="Skor klinis, aturan klinis, dan kriteria diagnosis yang tervalidasi. Setiap alat menghitung secara interaktif - pilih jawaban, baca interpretasi dan sumbernya."
        count={SCORES.length}
        countLabel="alat"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari skor… mis. qSOFA, Wells, CURB" />
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setSpecialty("")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${!specialty ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
        >
          Semua
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

      {grouped.length === 0 ? (
        <EmptyState message={`Tidak ada skor yang cocok dengan “${q}”.`} />
      ) : (
        <div className="space-y-8">
          {grouped.map(([cat, tools]) => (
            <section key={cat}>
              <h2 className="display-type mb-3 text-lg font-light">{CATEGORY_LABELS[cat] ?? cat} · {tools.length}</h2>
              <div className="workspace-panel grid overflow-hidden sm:grid-cols-2 [&_.index-row]:border-[var(--line)] sm:[&_.index-row:nth-child(odd)]:border-r">
                {tools.map((t) => (
                  <ToolCard
                    key={t.slug}
                    tool={{
                      slug: t.slug,
                      title: t.title,
                      abbreviation: t.abbreviation,
                      description: t.description,
                      href: `/scores/${t.slug}`,
                      specialties: t.specialties,
                      badge: t.abbreviation,
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
