"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DrugsPageClient from "@/components/catalog-pages/drugs-page-client";
import { DrugToolsIndex } from "@/components/drug-tools-index";
import { RacikanForm } from "@/components/racikan-form";
import { PageHeader } from "@/components/shared";
import type { Drug } from "@/lib/types";

type DrugSummary = Pick<Drug, "slug" | "genericName" | "brandNames" | "drugClass" | "specialties" | "keywords" | "indications">;
type Choice = { name: string; slug: string };

const tabs = [["obat", "Daftar obat"], ["racikan", "Racikan"], ["tools", "Kalkulator"]] as const;

export function DrugsWorkspace({ drugs, choices }: { drugs: DrugSummary[]; choices: Choice[] }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "obat";
  return <div>
    <nav className="mb-5 inline-flex overflow-hidden rounded-lg border border-[var(--line)]" aria-label="Bagian dosis obat">
      {tabs.map(([value, label]) => <Link key={value} href={value === "obat" ? "/drugs" : `/drugs?tab=${value}`} aria-current={tab === value ? "page" : undefined} className={`min-h-10 border-l border-[var(--line)] px-4 py-2 text-sm font-bold first:border-l-0 ${tab === value ? "bg-accent-button text-accent-ink" : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}>{label}</Link>)}
    </nav>
    {tab === "racikan" ? <><PageHeader title="Racikan obat anak" /><RacikanForm choices={choices} /></> : tab === "tools" ? <><PageHeader title="Kalkulator Dosis dan Cairan" /><DrugToolsIndex /></> : <DrugsPageClient drugs={drugs} />}
  </div>;
}
