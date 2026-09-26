import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { procedureEntries } from "@/lib/data/indications";
import { BackLink } from "@/components/shared";
import { SpecialtyTags } from "@/components/action-buttons";
import { SourceBlock } from "@/components/source-block";
import { ClinicalContent } from "@/components/clinical-content";
import ProcedureChecklist from "@/components/procedure-checklist";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = procedureEntries.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.definition };
}

function Block({ title, items, tone }: { title: string; items: string[]; tone?: "danger" | "warning" | "info" }) {
  if (!items || items.length === 0) return null;
  const border =
    tone === "danger" ? "border-red-200 dark:border-red-900" : tone === "warning" ? "border-amber-200 dark:border-amber-900" : "border-zinc-200 dark:border-zinc-800";
  return (
    <div className={`workspace-panel overflow-hidden ${border}`}>
      <h2 className="section-band display-type text-base font-bold">{title}</h2>
      <ClinicalContent items={items} tone={tone === "danger" ? "danger" : tone === "warning" ? "warning" : "neutral"} className="p-4" />
    </div>
  );
}

export default async function ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = procedureEntries.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <div>
      <BackLink href="/indications" label="Semua prosedur" />
      <div className="mb-6">
        <h1 className="display-type text-3xl font-bold tracking-tight sm:text-4xl">{p.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{p.definition}</p>
        <div className="mt-3">
          <SpecialtyTags specialties={p.specialties} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Block title="Indikasi" items={p.indications} />
        <Block title="Kontraindikasi absolut" items={p.absoluteContraindications} tone="danger" />
        <Block title="Kontraindikasi relatif" items={p.relativeContraindications} tone="warning" />
        <Block title="Kewaspadaan" items={p.precautions} tone="warning" />
        <Block title="Persiapan" items={p.preparation} />
        <Block title="Komplikasi" items={p.complications} />
      </div>

      <div className="mt-4">
        <ProcedureChecklist title="Checklist Persiapan" steps={p.preparation} />
      </div>

      <div className="mt-6 space-y-2">
        {p.references.map((r, i) => (
          <SourceBlock key={i} source={r} lastReviewed={p.lastReviewed} />
        ))}
      </div>
    </div>
  );
}
