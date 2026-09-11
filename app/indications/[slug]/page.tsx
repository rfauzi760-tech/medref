import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { procedureEntries } from "@/lib/data/indications";
import { BackLink, PageHeader } from "@/components/shared";
import { SpecialtyTags } from "@/components/action-buttons";
import { SourceBlock } from "@/components/source-block";

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
  const bullet = tone === "danger" ? "bg-red-400" : tone === "warning" ? "bg-amber-400" : "bg-zinc-300 dark:bg-zinc-600";
  return (
    <div className={`workspace-panel overflow-hidden ${border}`}>
      <h2 className="section-band display-type text-base font-medium">{title}</h2>
      <ul className="clinical-list space-y-1.5 p-4">
        {items.map((i, idx) => (
          <li key={idx} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${bullet}`} />
            <span>{i}</span>
          </li>
        ))}
      </ul>
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
        <h1 className="display-type text-3xl font-light tracking-tight sm:text-4xl">{p.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{p.definition}</p>
        <div className="mt-3">
          <SpecialtyTags specialties={p.specialties} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Block title="Indikasi" items={p.indications} />
        <Block title="Absolute contraindications" items={p.absoluteContraindications} tone="danger" />
        <Block title="Relative contraindications" items={p.relativeContraindications} tone="warning" />
        <Block title="Precautions" items={p.precautions} tone="warning" />
        <Block title="Preparation" items={p.preparation} />
        <Block title="Complications" items={p.complications} />
      </div>

      <div className="mt-6 space-y-2">
        {p.references.map((r, i) => (
          <SourceBlock key={i} source={r} lastReviewed={p.lastReviewed} />
        ))}
      </div>
    </div>
  );
}
