import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BackLink, PageHeader } from "@/components/shared";
import { NeonatalFlowchart } from "@/components/neonatal-flowchart";
import { NEONATAL_OXYGEN_TARGETS, NEONATAL_SOURCES } from "@/lib/neonatal-resuscitation";

export const metadata: Metadata = {
  title: "Resusitasi Neonatus",
  description: "Skema resusitasi bayi baru lahir saat persalinan berdasarkan pedoman AHA/AAP 2025.",
};

export default function NeonatalResuscitationPage() {
  return (
    <div>
      <BackLink href="/igd-toolkit" label="Kembali ke Toolkit IGD" />
      <PageHeader
        title="Resusitasi Neonatus"
        description="Alur bayi baru lahir saat persalinan. Berbeda dari resusitasi anak di luar masa transisi kelahiran."
      />

      <p className="mb-6 rounded-lg border border-amber-400/40 bg-amber-50/60 px-4 py-3 text-xs leading-relaxed text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">
        Untuk tenaga kesehatan terlatih. Gunakan bersama pelatihan resusitasi neonatus, protokol institusi, serta penilaian klinis langsung. Jangan menunda ventilasi untuk menghitung skor APGAR.
      </p>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <NeonatalFlowchart />

        <aside aria-label="Referensi cepat resusitasi neonatus" className="space-y-4 xl:sticky xl:top-6">
          <section className="workspace-panel overflow-hidden">
            <h2 className="section-band display-type text-base font-bold">Target SpO₂ preduktal</h2>
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-[var(--line)] text-xs text-[var(--muted)]"><th className="px-4 py-2 font-semibold">Menit kehidupan</th><th className="px-4 py-2 font-semibold">Target</th></tr></thead>
              <tbody>
                {NEONATAL_OXYGEN_TARGETS.map(({ minute, target }) => (
                  <tr key={minute} className="border-b border-[var(--line)] last:border-0"><th scope="row" className="px-4 py-2 font-semibold">{minute}</th><td className="px-4 py-2 font-mono">{target}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-[var(--line)] px-4 py-3 text-xs leading-relaxed text-[var(--muted)]">Pasang sensor di tangan atau pergelangan kanan. Titrasi oksigen sesuai target dan kondisi bayi.</p>
          </section>

          <section className="workspace-panel overflow-hidden">
            <h2 className="section-band display-type text-base font-bold">Catatan penting</h2>
            <div className="space-y-3 p-4 text-xs leading-relaxed">
              <p><strong className="font-bold">Suhu:</strong> pantau dan pertahankan 36,5–37,5 °C; cegah hipotermia dan hipertermia.</p>
              <p><strong className="font-bold">Oksigen awal:</strong> bayi cukup bulan dan prematur akhir dapat memulai ventilasi dengan udara ruangan. Pada prematur 32–35 minggu, 21–30% dapat digunakan; bayi &lt;32 minggu mungkin memerlukan kadar awal lebih tinggi yang dititrasi menurut SpO₂.</p>
              <p><strong className="font-bold">Mekonium:</strong> jangan lakukan pengisapan rutin, termasuk trakeal. Pertimbangkan pengisapan hanya bila ada sumbatan yang mengganggu ventilasi.</p>
              <p><strong className="font-bold">Setelah stabil:</strong> bayi yang memerlukan resusitasi lanjut perlu pemantauan dan penilaian HIE. Hipotermia terapeutik hanya pada bayi yang memenuhi kriteria dan di fasilitas dengan protokol khusus.</p>
            </div>
          </section>

          <section className="workspace-panel overflow-hidden">
            <h2 className="section-band display-type text-base font-bold">Sumber</h2>
            <ul className="divide-y divide-[var(--line)]">
              {NEONATAL_SOURCES.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer" className="focus-ring flex items-start gap-2 px-4 py-3 text-xs leading-relaxed text-accent-strong hover:bg-accent/5 dark:text-accent">
                    <span className="flex-1">{source.label} ({source.year})</span><ArrowUpRight aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="border-t border-[var(--line)] px-4 py-3 text-[11px] text-[var(--muted)]">Ditinjau 16 September 2026</p>
          </section>

          <Link href="/guidelines/asfiksia-neo" className="focus-ring flex items-center justify-between rounded-lg border border-[var(--line)] px-4 py-3 text-xs font-semibold hover:border-accent/50">
            Baca panduan Asfiksia Neonatorum <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
