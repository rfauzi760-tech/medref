import type { Metadata } from "next";
import ClinicalReferencePageClient from "@/components/clinical-reference-page-client";
export const metadata: Metadata = { title: "Toksikologi & Antidot | RFSmed" };
export default function Page(){ return <ClinicalReferencePageClient mode="antidotes"/>; }
