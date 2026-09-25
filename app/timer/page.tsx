import { BackLink, PageHeader } from "@/components/shared";
import ProtocolTimer from "@/components/protocol-timer";
import { EMERGENCY_PROTOCOLS } from "@/lib/data/protocols";

export const metadata = {
  title: "Timer Protokol",
  description: "Penghitung waktu untuk alur kegawatan waktu-kritis: code stroke, PCI, trombolisis, sepsis, dan trauma.",
};

export default function TimerPage() {
  return (
    <div>
      <BackLink href="/igd-toolkit" label="Kembali ke Toolkit IGD" />
      <PageHeader
        title="Timer Protokol"
      />
      <ProtocolTimer protocols={EMERGENCY_PROTOCOLS} />
    </div>
  );
}
