import CalculatorsPageClient from "@/components/catalog-pages/calculators-page-client";
import { CALCULATORS } from "@/lib/data/calculators";

export default function CalculatorsPage() {
  const calculators = CALCULATORS.map(({ slug, title, abbreviation, description, specialties, keywords, category }) => ({
    slug, title, abbreviation, description, specialties, keywords, category,
  }));
  return <CalculatorsPageClient calculators={calculators} />;
}
