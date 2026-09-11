import NutritionPageClient from "@/components/catalog-pages/nutrition-page-client";
import { foods, foodCategories } from "@/lib/data/foods";

export default function NutritionPage() {
  return <NutritionPageClient items={foods} categories={foodCategories} />;
}
