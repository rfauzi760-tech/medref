import { NextResponse } from "next/server";
import { ECG_ATLAS_ENTRIES } from "@/lib/data/ecg-atlas";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { items: ECG_ATLAS_ENTRIES },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
