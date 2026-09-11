import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SCORES } from "@/lib/data/scores";
import { ScoreToolView } from "@/components/score-tool";
import { BackLink } from "@/components/shared";

export const dynamicParams = false;

export function generateStaticParams() {
  return SCORES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = SCORES.find((s) => s.slug === slug);
  if (!tool) return {};
  return {
    title: `${tool.title}${tool.abbreviation ? ` (${tool.abbreviation})` : ""}`,
    description: `${tool.description} Source: ${tool.source.org}, ${tool.source.year}.`,
    openGraph: { title: `${tool.title} — Screening & Scores`, description: tool.description, type: "article" },
  };
}

export default async function ScorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = SCORES.find((s) => s.slug === slug);
  if (!tool) notFound();
  return (
    <div>
      <BackLink href="/scores" label="All scores" />
      <ScoreToolView slug={slug} />
    </div>
  );
}