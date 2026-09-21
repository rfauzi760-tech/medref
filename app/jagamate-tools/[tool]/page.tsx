import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink, PageHeader } from "@/components/shared";
import { JagamateToolsForm } from "@/components/jagamate-tools-form";
import { JAGAMATE_TOOL_SOURCES } from "@/lib/calc/jagamate-tools";

const tools = {
  diare: { title: "Rencana terapi diare", description: "Oralit dan cairan berdasarkan klasifikasi dehidrasi.", source: JAGAMATE_TOOL_SOURCES.diarrhea },
  syok: { title: "Bolus cairan pada syok anak", description: "Kisaran bolus awal dengan pengecualian klinis penting.", source: JAGAMATE_TOOL_SOURCES.shock },
  kehamilan: { title: "Usia kehamilan dan HPL", description: "Perkiraan dari hari pertama haid terakhir.", source: JAGAMATE_TOOL_SOURCES.dating },
  "taksiran-janin": { title: "Taksiran berat janin", description: "Rumus Johnson-Toshach pada kehamilan aterm.", source: JAGAMATE_TOOL_SOURCES.fetalWeight },
  "luka-bakar": { title: "Resusitasi luka bakar", description: "Perkiraan cairan awal berdasarkan luas dan kedalaman luka bakar.", source: JAGAMATE_TOOL_SOURCES.burn },
} as const;

type ToolSlug = keyof typeof tools;

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  return { title: `${tools[tool as ToolSlug]?.title ?? "Kalkulator"} | RFSmed` };
}

export default async function JagamateToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  if (!(tool in tools)) notFound();
  const item = tools[tool as ToolSlug];
  return <div>
    <BackLink href="/drugs?tab=tools" label="Dosis Obat" />
    <PageHeader title={item.title} description={item.description} />
    <JagamateToolsForm tool={tool as ToolSlug} />
    <p className="mt-4 text-xs text-[var(--muted)]">Sumber: <a href={item.source} target="_blank" rel="noreferrer" className="underline underline-offset-2">baca panduan atau studi asli</a>. Hasil adalah alat bantu, bukan pengganti penilaian klinis.</p>
  </div>;
}
