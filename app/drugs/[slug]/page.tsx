import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DRUGS } from "@/lib/data/drugs";
import { DrugView } from "@/components/drug-view";
import { BackLink } from "@/components/shared";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const drug = DRUGS.find((d) => d.slug === slug);
  if (!drug) return {};
  return {
    title: `${drug.genericName} - Dosis`,
    description: `${drug.drugClass}. Indikasi: ${drug.indications.join("; ")}. Dosis dewasa dan anak dengan perhitungan berbasis berat badan.${drug.source ? ` Sumber: ${drug.source.org}, ${drug.source.year}.` : ""}`,
    openGraph: { title: `${drug.genericName} - Dosis Obat`, description: drug.drugClass, type: "article" },
  };
}

export default async function DrugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { slug } = await params;
  const { mode } = await searchParams;
  const drug = DRUGS.find((d) => d.slug === slug);
  if (!drug) notFound();
  return (
    <div>
      <BackLink href={mode === "anak" ? "/drugs?mode=anak" : "/drugs"} label={mode === "anak" ? "Dosis obat anak" : "Semua obat"} />
      <DrugView drug={drug} initialPediatricMode={mode === "anak"} />
    </div>
  );
}
