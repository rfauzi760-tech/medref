"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, Siren } from "lucide-react";
import { BackLink, PageHeader, FilterInput, EmptyState } from "@/components/shared";

export interface EmergencyPathwaySummary {
  slug: string;
  title: string;
  description: string;
  category: string;
  specialties: string[];
  stepCount: number;
  redFlagCount: number;
  href?: string;
}

export default function EmergencyPageClient({ items }: { items: EmergencyPathwaySummary[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(() => [...new Set(items.map((item) => item.category))], [items]);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((item) => {
      if (category && item.category !== category) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.specialties.some((specialty) => specialty.toLowerCase().includes(query))
      );
    });
  }, [items, q, category]);

  return (
    <div>
      <BackLink href="/igd-toolkit" label="Kembali ke Toolkit IGD" />
      <PageHeader
        title="Algoritma IGD"
        description="Indeks alur kegawatan dari triase sampai disposisi, termasuk skema resusitasi neonatus."
        count={items.length}
        countLabel="alur"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari alur… mis. syok, nyeri dada, kejang" />

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${!category ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
        >
          Semua
        </button>
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(category === item ? "" : item)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${category === item ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={`Tidak ada alur yang cocok dengan “${q}”.`} />
      ) : (
        <div className="workspace-panel grid overflow-hidden sm:grid-cols-2">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={item.href ?? `/emergency/${item.slug}`}
              className="index-row focus-ring group flex min-h-32 flex-col p-4 sm:odd:border-r"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent-strong dark:text-accent">
                  {item.redFlagCount > 0 ? <Siren className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                </span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {item.category}
                </span>
              </div>
              <h3 className="display-type mt-3 text-base font-bold group-hover:text-accent-strong dark:group-hover:text-accent">{item.title}</h3>
              <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--muted)]">{item.description}</p>
              <div className="mt-3 flex flex-wrap gap-1 text-[10px] text-[var(--muted)]">
                <span className="rounded bg-accent/8 px-1.5 py-0.5 font-medium text-accent-strong/80 dark:text-accent/80">{item.href ? "Skema lengkap" : `${item.stepCount} langkah`}</span>
                {item.redFlagCount > 0 && (
                  <span className="rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-700 dark:bg-red-950 dark:text-red-300">{item.redFlagCount} tanda bahaya</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
