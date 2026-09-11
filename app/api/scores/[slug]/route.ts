import { NextResponse } from "next/server";
import { evaluateScore, isComplete, scoreToText, visibleScoreVariableIds } from "@/lib/calc/scores";
import { SCORES } from "@/lib/data/scores";
import type { ScoreValues } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = SCORES.find((score) => score.slug === slug);
  if (!tool) return NextResponse.json({ error: "Alat tidak ditemukan." }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const rawValues = (body as { values?: unknown })?.values;
  if (!rawValues || typeof rawValues !== "object" || Array.isArray(rawValues) || Object.keys(rawValues).length > 100) {
    return NextResponse.json({ error: "Nilai tidak valid." }, { status: 400 });
  }

  const values: ScoreValues = {};
  for (const [key, value] of Object.entries(rawValues)) {
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(key) || !["string", "number", "undefined"].includes(typeof value)) {
      return NextResponse.json({ error: "Nilai tidak valid." }, { status: 400 });
    }
    if (typeof value === "string" && value.length > 100) {
      return NextResponse.json({ error: "Nilai terlalu panjang." }, { status: 400 });
    }
    values[key] = value as string | number | undefined;
  }

  const evaluation = evaluateScore(tool, values);
  return NextResponse.json(
    {
      evaluation,
      complete: isComplete(tool, values),
      visibleVariableIds: visibleScoreVariableIds(tool, values),
      resultText: scoreToText(tool, evaluation),
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
