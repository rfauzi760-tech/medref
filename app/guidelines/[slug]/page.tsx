import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guidelines } from "@/lib/data/guidelines";
import { GUIDELINE_SECTIONS } from "@/lib/types";
import { BackLink } from "@/components/shared";
import { SourceBlock } from "@/components/source-block";
import { ClinicalContent } from "@/components/clinical-content";
import { guidelineSourceTier, SOURCE_TIER_LABEL } from "@/lib/evidence";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guidelines.find((x) => x.slug === slug);
  if (!g) return {};
  return {
    title: `${g.title} - Panduan`,
    description: `Referensi klinis ${g.title}: kriteria diagnosis, klasifikasi, pemeriksaan, tata laksana, kriteria rawat, dan tanda bahaya.`,
    openGraph: { title: `${g.title} - Panduan Klinis`, type: "article" },
  };
}

export default async function GuidelinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guidelines.find((x) => x.slug === slug);
  if (!g) notFound();
  const tier = guidelineSourceTier(g);

  return (
    <div>
      <BackLink href="/guidelines" label="Semua panduan" />
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="display-type text-3xl font-bold tracking-tight sm:text-4xl">{g.title}</h1>
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
          <span title={SOURCE_TIER_LABEL[tier]} className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[11px] font-medium text-accent-strong dark:text-accent">
            {SOURCE_TIER_LABEL[tier]}
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
              <h2 className={`section-band display-type text-base font-bold ${danger ? "text-red-700 dark:text-red-300" : ""}`}>{label}</h2>
              <ClinicalContent
                items={items}
                tone={danger ? "danger" : "neutral"}
                variant={key === "overview" ? "prose" : "list"}
                className="p-4 sm:p-5"
              />
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
