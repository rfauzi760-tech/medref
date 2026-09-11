import type { Metadata } from "next";
import PediatricEmergencyCalculator from "@/components/pediatric-emergency-calculator";
import { BackLink, PageHeader } from "@/components/shared";
import { PEDIATRIC_VITAL_RANGES } from "@/lib/calc/pediatric-emergency";

export const metadata: Metadata = {
  title: "Gawat Darurat Anak | RFSmed",
  description: "Kalkulator ukuran jalan napas, dosis resusitasi, dan tanda vital pediatri.",
};

export default function PediatricEmergencyPage() {
  return (
    <div>
      <BackLink href="/igd-toolkit" label="Kembali ke Toolkit IGD" />
      <PageHeader
        title="Gawat Darurat Anak"
        description="Satu masukan untuk estimasi berat badan, ukuran jalan napas, dosis resusitasi, energi listrik, dan ambang tanda vital anak."
      />
      <PediatricEmergencyCalculator vitalRanges={PEDIATRIC_VITAL_RANGES} />
    </div>
  );
}
