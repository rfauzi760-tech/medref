"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared";

type SpecialtySummary = {
  slug: string;
  name: string;
  description: string;
  count: number;
};

export default function SpecialtiesPageClient({ items }: { items: SpecialtySummary[] }) {
  return (
    <div>
      <PageHeader
        title="Spesialisasi"
        description="Setiap alat terhubung ke spesialisasi melalui metadata - halaman ini menggabungkannya secara otomatis, sehingga konten tidak pernah diduplikasi manual."
      />
      <div className="workspace-panel grid overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
            <Link
              key={s.slug}
              href={`/specialties/${s.slug}`}
              className="index-row focus-ring group flex min-h-28 flex-col p-4 sm:odd:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <div className="flex items-start justify-between">
                <h3 className="display-type text-base font-bold group-hover:text-accent-strong dark:group-hover:text-accent">{s.name}</h3>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {s.count} alat
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{s.description}</p>
            </Link>
        ))}
      </div>
    </div>
  );
}
