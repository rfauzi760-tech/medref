import MealPlannerPageClient from "@/components/catalog-pages/meal-planner-page-client";
import { foods, foodCategories } from "@/lib/data/foods";

export default function MealPlannerPage() {
  return <MealPlannerPageClient items={foods} categories={foodCategories} />;
}
