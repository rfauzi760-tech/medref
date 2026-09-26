import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Calculator, ListChecks, Timer } from "lucide-react";
import { BackLink } from "@/components/shared";
import { ClinicalContent } from "@/components/clinical-content";
import { EMERGENCY_KIND_LABEL, getEmergencyPathway, resolveAllPathways, resolvePathway, type ResolvedEmergencyRef } from "@/lib/emergency";
import type { EmergencyRefKind } from "@/lib/data/emergency";

export function generateStaticParams() {
  return resolveAllPathways().map(({ pathway }) => ({ slug: pathway.slug }));
}

export const dynamicParams = false;

const KIND_ICON: Record<EmergencyRefKind, typeof BookOpen> = {
  guideline: BookOpen,
  score: ListChecks,
  calculator: Calculator,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pathway = getEmergencyPathway(slug);
  if (!pathway) return {};
  return {
    title: `${pathway.title} - Alur IGD`,
    description: pathway.description,
  };
}

function StepCard({ step }: { step: ResolvedEmergencyRef }) {
  const Icon = KIND_ICON[step.kind];
  return (
    <Link
      href={step.href}
      className="index-row focus-ring group flex items-start gap-3 px-4 py-3.5"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-strong dark:text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="display-type text-sm font-bold group-hover:text-accent-strong dark:group-hover:text-accent">{step.title}</span>
          {step.badge && (
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{step.badge}</span>
          )}
        </span>
        <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">{step.description}</span>
      </span>
    </Link>
  );
}

export default async function EmergencyPathwayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pathway = getEmergencyPathway(slug);
  if (!pathway) notFound();

  const { steps, redFlags } = resolvePathway(pathway);
  const grouped: EmergencyRefKind[] = ["guideline", "score", "calculator"];

  return (
    <div>
      <BackLink href="/emergency" label="Semua alur IGD" />
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="display-type text-3xl font-bold tracking-tight sm:text-4xl">{pathway.title}</h1>
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{pathway.category}</span>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">{pathway.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pathway.specialties.map((specialty) => (
            <span key={specialty} className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent-strong dark:text-accent">
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/timer"
          className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-2 text-xs font-medium hover:border-accent/50"
        >
          <Timer className="h-4 w-4" /> Buka Timer Protokol
        </Link>
      </div>

      {redFlags.length > 0 && (
        <section className="workspace-panel mb-4 overflow-hidden border-red-200 dark:border-red-900">
          <h2 className="section-band display-type text-base font-bold text-red-700 dark:text-red-300">Tanda Bahaya</h2>
          <ClinicalContent items={redFlags} tone="danger" className="p-4 sm:p-5" />
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {grouped.map((kind) => {
          const kindSteps = steps.filter((step) => step.kind === kind);
          if (kindSteps.length === 0) return null;
          return (
            <section key={kind} className="workspace-panel overflow-hidden">
              <h2 className="section-band display-type text-base font-bold">{EMERGENCY_KIND_LABEL[kind]}</h2>
              <div className="divide-y divide-[var(--line)]">
                {kindSteps.map((step) => (
                  <StepCard key={`${step.kind}-${step.slug}`} step={step} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
