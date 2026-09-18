import { NextResponse, type NextRequest } from "next/server";
import { calculateRacikan, getRacikanOptions, type RacikanInput } from "@/lib/calc/racikan";
import { DRUGS_BY_SLUG } from "@/lib/data/drugs";
import { JAGAMATE_DRUG_CHOICES } from "@/lib/data/jagamate-choices";

const allowedSlugs = new Set<string>(JAGAMATE_DRUG_CHOICES.map((item) => item.slug));
const headers = { "Cache-Control": "private, no-store" };

export function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const ageParam = request.nextUrl.searchParams.get("age");
  const ageYears = Number(ageParam);
  if (!allowedSlugs.has(slug) || ageParam === null || !Number.isFinite(ageYears) || ageYears < 0 || ageYears >= 18) {
    return NextResponse.json({ error: "Pilih obat dan usia anak yang valid." }, { status: 400, headers });
  }
  const drug = DRUGS_BY_SLUG[slug];
  return NextResponse.json({ name: drug.genericName, options: getRacikanOptions(drug, ageYears) }, { headers });
}

export async function POST(request: NextRequest) {
  const text = await request.text();
  if (text.length > 10_000) return NextResponse.json({ error: "Permintaan terlalu besar." }, { status: 413, headers });
  let input: RacikanInput;
  try { input = JSON.parse(text) as RacikanInput; }
  catch { return NextResponse.json({ error: "Data tidak valid." }, { status: 400, headers }); }
  if (!input || !Array.isArray(input.ingredients) || input.ingredients.some((item) =>
    !item || typeof item.slug !== "string" || !allowedSlugs.has(item.slug) ||
    !Number.isInteger(item.doseIndex) || typeof item.preparationId !== "string" || item.preparationId.length > 100)) {
    return NextResponse.json({ error: "Pilihan bahan tidak valid." }, { status: 400, headers });
  }
  return NextResponse.json(calculateRacikan(DRUGS_BY_SLUG, input), { headers });
}
