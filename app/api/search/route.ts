import { NextResponse } from "next/server";
import { globalSearch } from "@/lib/search";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 80) {
    return NextResponse.json({ groups: [] }, { headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json(
    { groups: globalSearch(query, 5) },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
