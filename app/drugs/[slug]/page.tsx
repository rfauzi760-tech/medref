import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DRUGS } from "@/lib/data/drugs";
import { DrugView } from "@/components/drug-view";
import { BackLink } from "@/components/shared";

export const dynamicParams = false;

export function generateStaticParams() {
  return DRUGS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const drug = DRUGS.find((d) => d.slug === slug);
  if (!drug) return {};
  return {
    title: `${drug.genericName} — Dosing`,
    description: `${drug.drugClass}. Indications: ${drug.indications.join("; ")}. Adult and pediatric dosing with weight-based calculation. Source: ${drug.source.org}, ${drug.source.year}.`,
    openGraph: { title: `${drug.genericName} — Drug Dosing`, description: drug.drugClass, type: "article" },
  };
}

export default async function DrugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const drug = DRUGS.find((d) => d.slug === slug);
  if (!drug) notFound();
  return (
    <div>
      <BackLink href="/drugs" label="All drugs" />
      <DrugView drug={drug} />
    </div>
  );
}