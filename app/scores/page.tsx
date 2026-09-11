import ScoresPageClient from "@/components/catalog-pages/scores-page-client";
import { SCORES } from "@/lib/data/scores";

export default function ScoresPage() {
  const scores = SCORES.map(({ slug, title, abbreviation, description, specialties, keywords, category }) => ({
    slug, title, abbreviation, description, specialties, keywords, category,
  }));
  return <ScoresPageClient scores={scores} />;
}
