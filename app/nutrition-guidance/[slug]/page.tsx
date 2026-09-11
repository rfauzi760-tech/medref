import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nutritionGuidance } from "@/lib/data/nutritionGuidance";
import { BackLink } from "@/components/shared";
import { SourceBlock } from "@/components/source-block";

export const dynamicParams = false;

export function generateStaticParams() {
  return nutritionGuidance.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = nutritionGuidance.find((x) => x.slug === slug);
  if (!n) return {};
  return { title: `${n.title} - Panduan Gizi`, description: n.summary };
}

function Block({ title, items, tone }: { title: string; items: string[]; tone?: "good" | "limit" }) {
  if (!items || items.length === 0) return null;
  const border = tone === "limit" ? "border-amber-200 dark:border-amber-900" : "border-emerald-200 dark:border-emerald-900";
  const dot = tone === "limit" ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div className={`workspace-panel overflow-hidden ${border}`}>
      <h2 className="section-band display-type text-base font-medium">{title}</h2>
      <ul className="clinical-list space-y-1.5 p-4">
        {items.map((i, idx) => (
          <li key={idx} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${dot}`} />
            <span>{i}</span>
          </li>
        ))}
      </ul>
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
        <h1 className="display-type text-3xl font-light tracking-tight sm:text-4xl">{n.title}</h1>
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
          <h2 className="section-band display-type text-base font-medium">Prinsip utama</h2>
          <ul className="clinical-list space-y-1.5 p-4">
            {n.principles.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <Block title="Makanan yang dianjurkan" items={n.foodsRecommended} tone="good" />
        <Block title="Batasi atau hindari" items={n.foodsLimited} tone="limit" />
        {n.sampleDay && (
          <div className="workspace-panel overflow-hidden md:col-span-2">
            <h2 className="section-band display-type text-base font-medium">Contoh hari makan (ilustratif)</h2>
            <ul className="clinical-list space-y-1.5 p-4 pb-2">
              {n.sampleDay.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p className="px-4 pb-4 text-xs text-zinc-400">Porsi bersifat ilustratif - sesuaikan energi dan protein dengan kebutuhan serta kondisi klinis pasien.</p>
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
