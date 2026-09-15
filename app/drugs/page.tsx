import DrugsPageClient from "@/components/catalog-pages/drugs-page-client";
import { DRUGS, DRUG_CLASSES } from "@/lib/data/drugs";

export default async function DrugsPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
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
  return <DrugsPageClient drugs={drugs} drugClasses={DRUG_CLASSES} initialPediatricMode={mode === "anak"} />;
}
