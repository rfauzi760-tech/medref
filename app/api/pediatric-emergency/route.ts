import { NextResponse } from "next/server";
import {
  airwayForAge,
  estimatePediatricWeight,
  HABITUS_LABELS,
  lowSystolicThreshold,
  PEDIATRIC_VITAL_RANGES,
  resuscitationForWeight,
} from "@/lib/calc/pediatric-emergency";

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Data pasien tidak valid." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const actualWeightKg = optionalNumber(input.weightKg);
  const lengthCm = optionalNumber(input.lengthCm);
  const macCm = optionalNumber(input.macCm);
  const rawAge = optionalNumber(input.age);
  const ageUnit = input.ageUnit === "months" ? "months" : input.ageUnit === "years" ? "years" : null;

  if (
    (actualWeightKg !== undefined && (actualWeightKg <= 0 || actualWeightKg > 300)) ||
    (lengthCm !== undefined && (lengthCm <= 0 || lengthCm > 250)) ||
    (macCm !== undefined && (macCm <= 0 || macCm > 100)) ||
    (rawAge !== undefined && (rawAge < 0 || rawAge > 216)) ||
    (rawAge !== undefined && !ageUnit)
  ) {
    return NextResponse.json({ error: "Nilai pasien berada di luar rentang yang diizinkan." }, { status: 400 });
  }

  const ageYears = rawAge === undefined ? undefined : ageUnit === "months" ? rawAge / 12 : rawAge;
  const estimate = estimatePediatricWeight({ actualWeightKg, lengthCm, macCm });
  const computedWeight = estimate.computeWeightKg;
  const vitalIndex = ageYears === undefined ? -1 : PEDIATRIC_VITAL_RANGES.findIndex((range) => ageYears < range.maxYears);

  return NextResponse.json(
    {
      estimate,
      habitusLabel: estimate.habitusScore ? HABITUS_LABELS[estimate.habitusScore] : null,
      airway: ageYears === undefined ? null : airwayForAge(ageYears),
      resuscitation: computedWeight ? resuscitationForWeight(computedWeight) : null,
      lowSystolicThreshold: ageYears === undefined ? null : lowSystolicThreshold(ageYears),
      lowSystolicFormula: ageYears !== undefined && ageYears >= 1 && ageYears <= 10,
      vitalIndex,
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
