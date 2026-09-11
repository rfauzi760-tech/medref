import type { Metadata } from "next";
import BilirubinCalculator from "@/components/bilirubin-calculator";
export const metadata: Metadata = { title: "Kalkulator Bilirubin | RFSmed" };
export default function Page() { return <BilirubinCalculator />; }
