import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nutritionGuidance } from "@/lib/data/nutritionGuidance";
import { BackLink } from "@/components/shared";
import { SourceBlock } from "@/components/source-block";
import { ClinicalContent } from "@/components/clinical-content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = nutritionGuidance.find((x) => x.slug === slug);
  if (!n) return {};
  return { title: `${n.title} - Panduan Gizi`, description: n.summary };
}

function Block({ title, items, tone }: { title: string; items: string[]; tone?: "good" | "limit" }) {
  if (!items || items.length === 0) return null;
  const border = tone === "limit" ? "border-amber-200 dark:border-amber-900" : "border-emerald-200 dark:border-emerald-900";
  return (
    <div className={`workspace-panel overflow-hidden ${border}`}>
      <h2 className="section-band display-type text-base font-bold">{title}</h2>
      <ClinicalContent items={items} tone={tone === "limit" ? "warning" : "success"} className="p-4" />
    </div>
  );
}

export default async function NutritionGuidancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = nutritionGuidance.find((x) => x.slug === slug);
  if (!n) notFound();

  return (
    <div>
      <BackLink href="/nutrition-guidance" label="Semua panduan gizi" />
      <div className="mb-6">
        <h1 className="display-type text-3xl font-bold tracking-tight sm:text-4xl">{n.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{n.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {n.specialties.map((s) => (
            <span key={s} className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent-strong dark:text-accent">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="workspace-panel overflow-hidden md:col-span-2">
          <h2 className="section-band display-type text-base font-bold">Prinsip utama</h2>
          <ClinicalContent items={n.principles} tone="accent" className="p-4" />
        </div>
        <Block title="Makanan yang dianjurkan" items={n.foodsRecommended} tone="good" />
        <Block title="Batasi atau hindari" items={n.foodsLimited} tone="limit" />
        {n.sampleDay && (
          <div className="workspace-panel overflow-hidden md:col-span-2">
            <h2 className="section-band display-type text-base font-bold">Contoh hari makan (ilustratif)</h2>
            <ClinicalContent items={n.sampleDay} className="p-4 pb-2" />
            <p className="px-4 pb-4 text-xs text-zinc-400">Porsi bersifat ilustratif. Sesuaikan energi dan protein dengan kebutuhan serta kondisi klinis pasien.</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-2">
        {n.references.map((r, i) => (
          <SourceBlock key={i} source={r} lastReviewed={n.lastReviewed} />
        ))}
      </div>
    </div>
  );
}
