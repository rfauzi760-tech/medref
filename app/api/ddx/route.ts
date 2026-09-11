import { NextRequest, NextResponse } from "next/server";
import { DDX_FINDINGS, rankDifferentials } from "@/lib/calc/ddx";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store, max-age=0" };
export function GET() { return NextResponse.json({ findings: DDX_FINDINGS }, { headers }); }
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { selected?: unknown } | null;
  if (!body || !Array.isArray(body.selected) || body.selected.length > DDX_FINDINGS.length || !body.selected.every((id) => typeof id === "string")) return NextResponse.json({ error: "Input tidak valid" }, { status: 400, headers });
  const allowed = new Set(DDX_FINDINGS.map((item) => item.id));
  const selected = [...new Set(body.selected)].filter((id) => allowed.has(id));
  return NextResponse.json({ items: rankDifferentials(selected).slice(0, 10) }, { headers });
}
