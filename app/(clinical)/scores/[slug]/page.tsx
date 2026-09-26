import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SCORES } from "@/lib/data/scores";
import { ScoreToolView } from "@/components/score-tool";
import { KpspForm } from "@/components/kpsp-form";
import { BackLink } from "@/components/shared";
import { requiresServerScoreCalculation, type PublicScoreTool } from "@/lib/score-public";

function publicScore(tool: (typeof SCORES)[number]): PublicScoreTool {
  const { compute: _compute, variables, ...rest } = tool;
  void _compute;
  return {
    ...rest,
    requiresServerCalculation: requiresServerScoreCalculation(tool),
    variables: variables.map(({ scale: _scale, hideWhen: _hideWhen, ...variable }) => {
      void _scale;
      void _hideWhen;
      return variable;
    }),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = SCORES.find((s) => s.slug === slug);
  if (!tool) return {};
  return {
    title: `${tool.title}${tool.abbreviation ? ` (${tool.abbreviation})` : ""}`,
    description: `${tool.description}${tool.source ? ` Sumber: ${tool.source.org}, ${tool.source.year}.` : ""}`,
    openGraph: { title: `${tool.title} - Skrining dan Skor`, description: tool.description, type: "article" },
  };
}

export default async function ScorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = SCORES.find((s) => s.slug === slug);
  if (!tool) notFound();
  return (
    <div>
      <BackLink href="/scores" label="Semua skor" />
      {tool.slug === "kpsp" ? (
        <KpspForm title={tool.title} abbreviation={tool.abbreviation} specialties={tool.specialties} />
      ) : (
        <ScoreToolView tool={publicScore(tool)} />
      )}
    </div>
  );
}
