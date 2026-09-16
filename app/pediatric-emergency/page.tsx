import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
      <Link href="/neonatal-resuscitation" className="focus-ring mb-5 flex items-center justify-between gap-3 rounded-lg border border-accent/35 bg-accent/5 px-4 py-3 text-sm hover:border-accent">
        <span><strong className="font-bold">Resusitasi Neonatus</strong><span className="mt-0.5 block text-xs text-[var(--muted)]">Skema khusus bayi baru lahir saat persalinan.</span></span>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent-strong dark:text-accent" />
      </Link>
      <PediatricEmergencyCalculator vitalRanges={PEDIATRIC_VITAL_RANGES} />
    </div>
  );
}
