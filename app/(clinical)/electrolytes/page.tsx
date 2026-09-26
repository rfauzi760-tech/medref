import type { Metadata } from "next";
import ElectrolyteCalculator from "@/components/electrolyte-calculator";
export const metadata: Metadata = { title: "Koreksi Elektrolit | RFSmed" };
export default function Page() { return <ElectrolyteCalculator />; }
