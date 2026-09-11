import type { Metadata } from "next";
import DdxPageClient from "@/components/ddx-page-client";
export const metadata: Metadata = { title: "Mesin Diagnosis Banding | RFSmed" };
export default function Page(){ return <DdxPageClient/>; }
