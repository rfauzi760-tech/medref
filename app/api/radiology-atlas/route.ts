import { NextResponse } from "next/server";
import { RADIOLOGY_ATLAS_ENTRIES } from "@/lib/data/radiology-atlas";
import { getAtlasImages } from "@/lib/data/atlas-images";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { items: RADIOLOGY_ATLAS_ENTRIES.map((item, index) => ({ ...item, images: getAtlasImages("radiology", index) })) },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
