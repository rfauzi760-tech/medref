import type { Metadata } from "next";
import EmergencyDoseCalculator from "@/components/emergency-dose-calculator";
export const metadata: Metadata = { title: "Kalkulator Dosis IGD | RFSmed" };
export default function Page() { return <EmergencyDoseCalculator />; }
