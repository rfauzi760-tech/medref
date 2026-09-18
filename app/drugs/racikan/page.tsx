import type { Metadata } from "next";
import { BackLink, PageHeader } from "@/components/shared";
import { RacikanForm } from "@/components/racikan-form";
import { JAGAMATE_DRUG_CHOICES } from "@/lib/data/jagamate-choices";

export const metadata: Metadata = { title: "Racikan Obat Anak | RFSmed" };

export default function RacikanPage() {
  return <div>
    <BackLink href="/jagamate-tools" label="Dosis anak dan kalkulator" />
    <PageHeader title="Racikan obat anak" description="Hitung jumlah tiap bahan berdasarkan regimen dan sediaan yang dipilih." />
    <RacikanForm choices={JAGAMATE_DRUG_CHOICES.map((item) => ({ name: item.sourceName, slug: item.slug }))} />
  </div>;
}
