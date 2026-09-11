import { NextResponse } from "next/server";
import { DRUGS } from "@/lib/data/drugs";
import { INTERACTIONS } from "@/lib/data/interactions";

export const dynamic = "force-dynamic";

const slugPattern = /^[a-z0-9-]{1,80}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const rawSlugs = (body as { slugs?: unknown })?.slugs;
  if (!Array.isArray(rawSlugs) || rawSlugs.length < 2 || rawSlugs.length > 10) {
    return NextResponse.json({ error: "Pilih 2 sampai 10 obat." }, { status: 400 });
  }

  const slugs = [...new Set(rawSlugs)];
  if (slugs.some((slug) => typeof slug !== "string" || !slugPattern.test(slug))) {
    return NextResponse.json({ error: "Pilihan obat tidak valid." }, { status: 400 });
  }

  const selected = slugs
    .map((slug) => DRUGS.find((drug) => drug.slug === slug))
    .filter((drug): drug is (typeof DRUGS)[number] => Boolean(drug))
    .map(({ slug, genericName, brandNames, drugClass }) => ({ slug, genericName, brandNames, drugClass }));

  if (selected.length !== slugs.length) {
    return NextResponse.json({ error: "Obat tidak ditemukan." }, { status: 404 });
  }

  const pairs = [];
  for (let i = 0; i < selected.length; i += 1) {
    for (let j = i + 1; j < selected.length; j += 1) {
      const a = selected[i];
      const b = selected[j];
      const interaction = INTERACTIONS.find(
        (item) => (item.a === a.slug && item.b === b.slug) || (item.a === b.slug && item.b === a.slug),
      );
      pairs.push({ a, b, interaction });
    }
  }

  return NextResponse.json(
    { pairs },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
