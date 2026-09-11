import type { Metadata } from "next";
import ClinicalAtlasPageClient from "@/components/ecg-atlas-page-client";

export const metadata: Metadata = { title: "Imaging | RFSmed", description: "Atlas radiologi untuk pengenalan cepat temuan X-ray, CT, MRI, dan USG." };

export default function RadiologyAtlasPage() {
  return <ClinicalAtlasPageClient mode="radiology" />;
}
