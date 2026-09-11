import NutritionGuidancePageClient from "@/components/catalog-pages/nutrition-guidance-page-client";
import { nutritionGuidance } from "@/lib/data/nutritionGuidance";

export default function NutritionGuidancePage() {
  const items = nutritionGuidance.map(({ slug, title, summary, keywords, specialties }) => ({
    slug, title, summary, keywords, specialties,
  }));
  return <NutritionGuidancePageClient items={items} />;
}
