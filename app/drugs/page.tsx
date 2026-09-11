import DrugsPageClient from "@/components/catalog-pages/drugs-page-client";
import { DRUGS, DRUG_CLASSES } from "@/lib/data/drugs";

export default function DrugsPage() {
  const drugs = DRUGS.map(({ slug, genericName, brandNames, drugClass, specialties, keywords, indications }) => ({
    slug, genericName, brandNames, drugClass, specialties, keywords, indications,
  }));
  return <DrugsPageClient drugs={drugs} drugClasses={DRUG_CLASSES} />;
}
