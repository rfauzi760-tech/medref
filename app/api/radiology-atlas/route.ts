import { NextResponse } from "next/server";
import { RADIOLOGY_ATLAS_ENTRIES } from "@/lib/data/radiology-atlas";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { items: RADIOLOGY_ATLAS_ENTRIES },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
