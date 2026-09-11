import { NextResponse } from "next/server";
import { ECG_ATLAS_ENTRIES } from "@/lib/data/ecg-atlas";
import { getAtlasImages } from "@/lib/data/atlas-images";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { items: ECG_ATLAS_ENTRIES.map((item, index) => ({ ...item, images: getAtlasImages("ecg", index) })) },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
