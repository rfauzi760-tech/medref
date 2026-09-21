import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const groups = [
  { title: "Cairan dan diare", links: [
    ["Rencana terapi diare A, B, C", "/jagamate-tools/diare"],
    ["Rumatan cairan Holliday-Segar", "/calculators/holliday-segar"],
    ["Defisit cairan", "/calculators/fluid-deficit"],
    ["Resusitasi syok", "/jagamate-tools/syok"],
  ] },
  { title: "Obstetri", links: [
    ["Usia kehamilan dan HPL", "/jagamate-tools/kehamilan"],
    ["Taksiran berat janin dari TFU", "/jagamate-tools/taksiran-janin"],
  ] },
  { title: "Emergensi", links: [
    ["Glasgow Coma Scale", "/scores/gcs"],
    ["Resusitasi luka bakar", "/jagamate-tools/luka-bakar"],
  ] },
  { title: "Status gizi", links: [
    ["Antropometri anak", "/anthropometry"],
    ["Indeks massa tubuh", "/calculators/bmi"],
  ] },
] as const;

export function DrugToolsIndex() {
  return <div className="grid gap-4 lg:grid-cols-2">
    {groups.map((group) => <section key={group.title} className="workspace-panel p-5">
      <h2 className="display-type text-lg font-bold">{group.title}</h2>
      <div className="mt-3 grid gap-2">
        {group.links.map(([label, href]) => <Link key={href} href={href} className="focus-ring flex items-center justify-between rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:text-accent-strong dark:hover:text-accent"><span>{label}</span><ArrowUpRight className="h-4 w-4" /></Link>)}
      </div>
    </section>)}
  </div>;
}
