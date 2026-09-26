import { StaticSessionGate } from "@/components/auth/static-session-gate";

export default function ClinicalLayout({ children }: { children: React.ReactNode }) {
  return <StaticSessionGate>{children}</StaticSessionGate>;
}
