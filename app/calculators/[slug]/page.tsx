import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CALCULATORS } from "@/lib/data/calculators";
import { CalculatorToolView } from "@/components/calculator-tool";
import { BackLink } from "@/components/shared";

export const dynamicParams = false;

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = CALCULATORS.find((c) => c.slug === slug);
  if (!tool) return {};
  return {
    title: `${tool.title}${tool.abbreviation ? ` (${tool.abbreviation})` : ""}`,
    description: `${tool.description} ${tool.formulaText ?? ""} Source: ${tool.source.org}, ${tool.source.year}.`,
    openGraph: { title: `${tool.title} — Clinical Calculators`, description: tool.description, type: "article" },
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = CALCULATORS.find((c) => c.slug === slug);
  if (!tool) notFound();
  return (
    <div>
      <BackLink href="/calculators" label="All calculators" />
      <CalculatorToolView tool={tool} />
    </div>
  );
}