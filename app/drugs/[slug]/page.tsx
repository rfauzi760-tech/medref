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
    description: `${drug.drugClass}. Indikasi: ${drug.indications.join("; ")}. Dosis dewasa dan anak dengan perhitungan berbasis berat badan. Sumber: ${drug.source.org}, ${drug.source.year}.`,
    openGraph: { title: `${drug.genericName} - Dosis Obat`, description: drug.drugClass, type: "article" },
  };
}

export default async function DrugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const drug = DRUGS.find((d) => d.slug === slug);
  if (!drug) notFound();
  return (
    <div>
      <BackLink href="/drugs" label="Semua obat" />
      <DrugView drug={drug} />
    </div>
  );
}
