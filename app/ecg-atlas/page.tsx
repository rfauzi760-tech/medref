import type { Metadata } from "next";
import ClinicalAtlasPageClient from "@/components/ecg-atlas-page-client";

export const metadata: Metadata = { title: "Atlas EKG | RFSmed", description: "Pengenalan cepat pola EKG untuk penggunaan klinis." };

export default function EcgAtlasPage() {
  return <ClinicalAtlasPageClient />;
}
