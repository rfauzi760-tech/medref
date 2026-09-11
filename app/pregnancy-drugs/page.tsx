import type { Metadata } from "next";
import ClinicalReferencePageClient from "@/components/clinical-reference-page-client";
export const metadata: Metadata = { title: "Obat Kehamilan & Menyusui | RFSmed" };
export default function Page(){ return <ClinicalReferencePageClient mode="pregnancy"/>; }
