import GuidelinesPageClient from "@/components/catalog-pages/guidelines-page-client";
import { guidelines } from "@/lib/data/guidelines";

export default function GuidelinesPage() {
  const items = guidelines.map(({ slug, title, specialties, keywords, emergency, ageGroup, pregnancyRelevant }) => ({
    slug,
    title,
    specialties,
    keywords,
    emergency,
    ageGroup,
    pregnancyRelevant,
  }));
  return <GuidelinesPageClient items={items} />;
}
