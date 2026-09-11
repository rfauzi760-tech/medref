import GuidelinesPageClient from "@/components/catalog-pages/guidelines-page-client";
import { guidelines } from "@/lib/data/guidelines";
import { guidelineSourceTier } from "@/lib/evidence";

export default function GuidelinesPage() {
  const items = guidelines.map(({ slug, title, specialties, keywords, emergency, ageGroup, pregnancyRelevant, references }) => ({
    slug,
    title,
    specialties,
    keywords,
    emergency,
    ageGroup,
    pregnancyRelevant,
    tier: guidelineSourceTier({ references }),
  }));
  return <GuidelinesPageClient items={items} />;
}
