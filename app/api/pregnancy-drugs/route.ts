import { NextRequest, NextResponse } from "next/server";
import { searchPregnancyDrugs } from "@/lib/data/pregnancy-drugs";
export const dynamic = "force-dynamic";
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  return NextResponse.json({ items: searchPregnancyDrugs(q) }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
