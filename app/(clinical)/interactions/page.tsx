import InteractionsPageClient from "@/components/catalog-pages/interactions-page-client";
import { DRUGS } from "@/lib/data/drugs";

export default function InteractionsPage() {
  const drugs = DRUGS.map(({ slug, genericName, brandNames, drugClass }) => ({
    slug,
    genericName,
    brandNames,
    drugClass,
  }));
  return <InteractionsPageClient drugs={drugs} />;
}
