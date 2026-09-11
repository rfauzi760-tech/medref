import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { modules } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Toolkit IGD | RFSmed",
  description: "Kalkulator dan referensi cepat untuk pelayanan gawat darurat.",
};

const toolSlugs = [
  "emergency-dose", "bilirubin", "antidotes", "pregnancy-drugs", "electrolytes",
  "ddx", "pediatric-emergency", "emergency", "timer", "calculators",
];

export default function IgdToolkitPage() {
  const tools = toolSlugs.flatMap((slug) => {
    const item = modules.find((module) => module.slug === slug);
    return item ? [slug === "calculators" ? { ...item, name: "Analisis Gas Darah", description: "Interpretasi gangguan asam basa, kompensasi, anion gap, dan delta ratio.", href: "/calculators/abg" } : item] : [];
  });

  return (
    <div>
      <PageHeader title="Toolkit IGD" description="Kalkulator dan referensi cepat untuk membantu penilaian serta tata laksana awal di IGD." count={tools.length} countLabel="alat" />
      <div className="workspace-panel grid overflow-hidden md:grid-cols-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.slug} href={tool.href} className="index-row focus-ring group flex min-h-32 gap-4 p-5 md:odd:border-r">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent-strong dark:text-accent"><Icon className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1">
                <strong className="display-type block text-base font-bold">{tool.name}</strong>
                <span className="mt-2 block text-xs leading-5 text-[var(--muted)]">{tool.description}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Gunakan penilaian klinis, protokol institusi, dan verifikasi dosis sebelum mengambil keputusan.</p>
    </div>
  );
}
