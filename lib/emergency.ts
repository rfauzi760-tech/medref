import "server-only";
import { GUIDELINES } from "@/lib/data/guidelines";
import { SCORES } from "@/lib/data/scores";
import { CALCULATORS } from "@/lib/data/calculators";
import { EMERGENCY_PATHWAYS, type EmergencyPathway, type EmergencyRef, type EmergencyRefKind } from "@/lib/data/emergency";
import type { ClinicalContentItem } from "@/lib/types";

export interface ResolvedEmergencyRef {
  kind: EmergencyRefKind;
  slug: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export const EMERGENCY_KIND_LABEL: Record<EmergencyRefKind, string> = {
  guideline: "Panduan",
  score: "Skor",
  calculator: "Kalkulator",
};

export function flattenClinicalText(items: ClinicalContentItem[]): string[] {
  return items.flatMap((item) =>
    typeof item === "string" ? [item] : [item.heading, ...flattenClinicalText(item.children)],
  );
}

export function getEmergencyPathway(slug: string): EmergencyPathway | undefined {
  return EMERGENCY_PATHWAYS.find((pathway) => pathway.slug === slug);
}

export function resolveEmergencyRef(ref: EmergencyRef): ResolvedEmergencyRef | null {
  if (ref.kind === "guideline") {
    const guideline = GUIDELINES.find((item) => item.id === ref.ref || item.slug === ref.ref);
    if (!guideline) return null;
    const overview = guideline.sections.overview ? flattenClinicalText(guideline.sections.overview)[0] : undefined;
    return {
      kind: ref.kind,
      slug: guideline.slug,
      title: guideline.title,
      description: overview ?? "Panduan klinis terstruktur.",
      href: `/guidelines/${guideline.slug}`,
      badge: guideline.emergency ? "Gawat darurat" : EMERGENCY_KIND_LABEL.guideline,
    };
  }
  if (ref.kind === "score") {
    const score = SCORES.find((item) => item.id === ref.ref || item.slug === ref.ref);
    if (!score) return null;
    return {
      kind: ref.kind,
      slug: score.slug,
      title: score.title,
      description: score.description,
      href: `/scores/${score.slug}`,
      badge: score.abbreviation ?? EMERGENCY_KIND_LABEL.score,
    };
  }
  const calculator = CALCULATORS.find((item) => item.id === ref.ref || item.slug === ref.ref);
  if (!calculator) return null;
  return {
    kind: ref.kind,
    slug: calculator.slug,
    title: calculator.title,
    description: calculator.description,
    href: `/calculators/${calculator.slug}`,
    badge: calculator.abbreviation ?? EMERGENCY_KIND_LABEL.calculator,
  };
}

export interface ResolvedPathway {
  pathway: EmergencyPathway;
  steps: ResolvedEmergencyRef[];
  redFlags: string[];
  unresolved: string[];
}

export function resolvePathway(pathway: EmergencyPathway): ResolvedPathway {
  const resolved = pathway.steps.map((step) => ({ step, item: resolveEmergencyRef(step) }));
  const steps = resolved.flatMap((entry) => (entry.item ? [entry.item] : []));
  const unresolved = resolved.filter((entry) => !entry.item).map((entry) => `${entry.step.kind}:${entry.step.ref}`);
  const source = pathway.redFlagSource
    ? GUIDELINES.find((item) => item.id === pathway.redFlagSource || item.slug === pathway.redFlagSource)
    : undefined;
  const redFlags = source?.sections.redFlags ? flattenClinicalText(source.sections.redFlags) : [];
  return { pathway, steps, redFlags, unresolved };
}

export function resolveAllPathways(): ResolvedPathway[] {
  return EMERGENCY_PATHWAYS.map(resolvePathway);
}
