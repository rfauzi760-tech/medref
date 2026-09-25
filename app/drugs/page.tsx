import Link from "next/link";
import DrugsPageClient from "@/components/catalog-pages/drugs-page-client";
import { DrugToolsIndex } from "@/components/drug-tools-index";
import { RacikanForm } from "@/components/racikan-form";
import { PageHeader } from "@/components/shared";
import { DRUGS } from "@/lib/data/drugs";
import { JAGAMATE_DRUG_CHOICES } from "@/lib/data/jagamate-choices";

export default async function DrugsPage({ searchParams }: { searchParams: Promise<{ mode?: string; tab?: string }> }) {
  const { mode, tab = "obat" } = await searchParams;
  const drugs = DRUGS.map(({ slug, genericName, brandNames, drugClass, specialties, keywords, indications, doses }) => ({
    slug,
    genericName,
    brandNames,
    drugClass,
    specialties,
    keywords,
    indications,
    hasPediatricDose: doses.some((dose) => dose.population === "pediatric" || dose.population === "all"),
  }));
  const tabs = [["obat", "Daftar obat"], ["racikan", "Racikan"], ["tools", "Kalkulator"]] as const;
  return <div>
    <nav className="mb-5 inline-flex overflow-hidden rounded-lg border border-[var(--line)]" aria-label="Bagian dosis obat">
      {tabs.map(([value, label]) => <Link key={value} href={value === "obat" ? "/drugs" : `/drugs?tab=${value}`} aria-current={tab === value ? "page" : undefined} className={`min-h-10 border-l border-[var(--line)] px-4 py-2 text-sm font-bold first:border-l-0 ${tab === value ? "bg-accent-button text-accent-ink" : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}>{label}</Link>)}
    </nav>
    {tab === "racikan" ? <>
      <PageHeader title="Racikan obat anak" />
      <RacikanForm choices={JAGAMATE_DRUG_CHOICES.map((item) => ({ name: item.sourceName, slug: item.slug }))} />
    </> : tab === "tools" ? <>
      <PageHeader title="Kalkulator Dosis dan Cairan" />
      <DrugToolsIndex />
    </> : <DrugsPageClient drugs={drugs} initialPediatricMode={mode === "anak"} />}
  </div>;
}
