import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guidelines } from "@/lib/data/guidelines";
import { GUIDELINE_SECTIONS } from "@/lib/types";
import { BackLink } from "@/components/shared";
import { SourceBlock } from "@/components/source-block";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guidelines.find((x) => x.slug === slug);
  if (!g) return {};
  return {
    title: `${g.title} - Panduan`,
    description: `Bedside reference for ${g.title}: diagnostic criteria, classification, investigations, management, admission criteria, red flags.`,
    openGraph: { title: `${g.title} - Panduan Klinis`, type: "article" },
  };
}

export default async function GuidelinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guidelines.find((x) => x.slug === slug);
  if (!g) notFound();

  return (
    <div>
      <BackLink href="/guidelines" label="Semua panduan" />
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="display-type text-3xl font-light tracking-tight sm:text-4xl">{g.title}</h1>
          {g.emergency && (
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">GAWAT DARURAT</span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {g.specialties.map((s) => (
            <span key={s} className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent-strong dark:text-accent">
              {s}
            </span>
          ))}
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {{ both: "Dewasa dan anak", adult: "Dewasa", pediatric: "Anak", neonatal: "Neonatus" }[g.ageGroup]}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {GUIDELINE_SECTIONS.map(({ key, label }) => {
          const items = g.sections[key];
          if (!items || items.length === 0) return null;
          const danger = key === "redFlags" || key === "icuCriteria";
          return (
            <section key={key} className={`workspace-panel overflow-hidden ${danger ? "border-red-200 dark:border-red-900" : ""}`}>
              <h2 className={`section-band display-type text-base font-medium ${danger ? "text-red-700 dark:text-red-300" : ""}`}>{label}</h2>
              <ul className="clinical-list space-y-1.5 p-4">
                {items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${danger ? "bg-red-400" : "bg-zinc-300 dark:bg-zinc-600"}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        {g.references.map((r, i) => (
          <SourceBlock key={i} source={r} lastReviewed={g.lastReviewed} />
        ))}
      </div>
    </div>
  );
}
