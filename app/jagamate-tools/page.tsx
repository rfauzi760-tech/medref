import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { JAGAMATE_DRUG_CHOICES } from "@/lib/data/jagamate-choices";

export const metadata: Metadata = { title: "Dosis Anak dan Kalkulator | RFSmed" };

const groups = [
  {
    title: "Cairan dan diare",
    links: [
      { label: "Rencana terapi diare A, B, C", href: "/jagamate-tools/diare" },
      { label: "Rumatan cairan Holliday-Segar", href: "/calculators/holliday-segar" },
      { label: "Defisit cairan", href: "/calculators/fluid-deficit" },
      { label: "Resusitasi syok", href: "/jagamate-tools/syok" },
    ],
  },
  {
    title: "Obstetri",
    links: [
      { label: "Usia kehamilan dan HPL", href: "/jagamate-tools/kehamilan" },
      { label: "Taksiran berat janin dari TFU", href: "/jagamate-tools/taksiran-janin" },
    ],
  },
  {
    title: "Emergensi",
    links: [
      { label: "Glasgow Coma Scale", href: "/scores/gcs" },
      { label: "Resusitasi luka bakar", href: "/jagamate-tools/luka-bakar" },
    ],
  },
  {
    title: "Status gizi",
    links: [
      { label: "Antropometri anak", href: "/anthropometry" },
      { label: "Indeks massa tubuh", href: "/calculators/bmi" },
    ],
  },
];

export default function JagamateToolsPage() {
  return (
    <div>
      <PageHeader title="Dosis anak dan kalkulator" description="Pilihan obat, racikan, serta kalkulator klinis dalam satu tempat." />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="workspace-panel p-5 lg:col-span-2">
          <h2 className="display-type text-lg font-bold">Racikan</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Lembar hitung tiap bahan dengan pilihan dosis dan sediaan yang jelas.</p>
          <Link href="/drugs/racikan" className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-accent/50 px-4 py-2 text-sm font-bold text-accent-strong dark:text-accent">Buka Racikan <ArrowUpRight className="h-4 w-4" /></Link>
        </section>
        {groups.map((group) => (
          <section key={group.title} className="workspace-panel p-5">
            <h2 className="display-type text-lg font-bold">{group.title}</h2>
            <div className="mt-3 grid gap-2">
              {group.links.map((link) => <Link key={link.href} href={link.href} className="focus-ring flex items-center justify-between rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:text-accent-strong dark:hover:text-accent"><span>{link.label}</span><ArrowUpRight className="h-4 w-4" /></Link>)}
            </div>
          </section>
        ))}
      </div>
      <section className="workspace-panel mt-4 p-5">
        <h2 className="display-type text-lg font-bold">Obat tunggal</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">45 pilihan obat tercakup. Regimen tanpa verifikasi yang cukup tetap ditampilkan sebagai referensi teks, tanpa hitungan otomatis.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {JAGAMATE_DRUG_CHOICES.map((choice) => <Link key={choice.sourceName} href={`/drugs/${choice.slug}?mode=anak`} className="focus-ring flex items-center justify-between rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:text-accent-strong dark:hover:text-accent"><span>{choice.sourceName}</span><ArrowUpRight className="h-4 w-4 shrink-0" /></Link>)}
        </div>
      </section>
    </div>
  );
}
