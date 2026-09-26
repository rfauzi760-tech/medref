import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SPECIALTIES } from "@/lib/specialties";
import { SCORES } from "@/lib/data/scores";
import { CALCULATORS } from "@/lib/data/calculators";
import { DRUGS } from "@/lib/data/drugs";
import { guidelines } from "@/lib/data/guidelines";
import { procedureEntries } from "@/lib/data/indications";
import { ToolCard, BackLink } from "@/components/shared";

export function generateStaticParams() {
  return SPECIALTIES.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SPECIALTIES.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: `${s.name} - Alat`, description: s.description };
}

export default async function SpecialtyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const spec = SPECIALTIES.find((x) => x.slug === slug);
  if (!spec) notFound();
  const name = spec.name;

  const scores = SCORES.filter((t) => t.specialties.includes(name));
  const calcs = CALCULATORS.filter((t) => t.specialties.includes(name));
  const drugs = DRUGS.filter((t) => t.specialties.includes(name));
  const guid = guidelines.filter((t) => t.specialties.includes(name));
  const proc = procedureEntries.filter((t) => t.specialties.includes(name));

  const sections: { label: string; cards: ReturnType<typeof ToolCard>[] }[] = [
    { label: "Skor dan kriteria", cards: scores.map((t) => <ToolCard key={t.slug} tool={{ slug: t.slug, title: t.title, abbreviation: t.abbreviation, description: t.description, href: `/scores/${t.slug}`, specialties: t.specialties, badge: t.abbreviation }} />) },
    { label: "Kalkulator", cards: calcs.map((t) => <ToolCard key={t.slug} tool={{ slug: t.slug, title: t.title, abbreviation: t.abbreviation, description: t.description, href: `/calculators/${t.slug}`, specialties: t.specialties, badge: t.abbreviation }} />) },
    { label: "Obat", cards: drugs.map((t) => <ToolCard key={t.slug} tool={{ slug: t.slug, title: t.genericName, description: t.drugClass, href: `/drugs/${t.slug}`, specialties: t.specialties, badge: t.drugClass }} />) },
    { label: "Panduan", cards: guid.map((t) => <ToolCard key={t.slug} tool={{ slug: t.slug, title: t.title, description: "Panduan klinis", href: `/guidelines/${t.slug}`, specialties: t.specialties }} />) },
    { label: "Prosedur", cards: proc.map((t) => <ToolCard key={t.slug} tool={{ slug: t.slug, title: t.title, description: t.definition, href: `/indications/${t.slug}`, specialties: t.specialties }} />) },
  ].filter((s) => s.cards.length > 0);

  return (
    <div>
      <BackLink href="/specialties" label="Semua spesialisasi" />
      <div className="mb-6">
        <h1 className="display-type text-3xl font-bold tracking-tight sm:text-4xl">{name}</h1>
      </div>
      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.label}>
            <h2 className="display-type mb-3 text-lg font-bold">{s.label}</h2>
            <div className="workspace-panel grid overflow-hidden sm:grid-cols-2 [&_.index-row]:border-[var(--line)] sm:[&_.index-row:nth-child(odd)]:border-r">{s.cards}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
