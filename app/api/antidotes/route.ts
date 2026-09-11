import { NextRequest, NextResponse } from "next/server";
import { searchAntidotes } from "@/lib/data/antidotes";
export const dynamic = "force-dynamic";
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  return NextResponse.json({ items: searchAntidotes(q) }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
