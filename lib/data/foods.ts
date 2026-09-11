import type { FoodItem } from "@/lib/types";
import { canonicalFoods } from "./klinea-canonical";

/**
 * Indonesian food database.
 * Values are per 100 g edible portion, based on public food-composition
 * tables (Indonesian TKPI / USDA SR public-domain equivalents), rounded to
 * practical precision. Sodium/potassium in mg; omitted when not reliably
 * reported. Used by the meal planner - never invented by an LLM.
 */

const RFS_FOODS: FoodItem[] = [
  // ---- Rice & staples ----
  { id: "white-rice", name: "White rice (cooked)", nameId: "Nasi putih", category: "Rice & staples", kcal: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, sodium: 1, potassium: 35, servingG: 150 },
  { id: "brown-rice", name: "Brown rice (cooked)", nameId: "Nasi merah", category: "Rice & staples", kcal: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, sodium: 5, potassium: 43, servingG: 150 },
  { id: "rice-porridge", name: "Rice porridge / bubur", nameId: "Bubur nasi", category: "Rice & staples", kcal: 63, protein: 1.4, carbs: 13.5, fat: 0.3, fiber: 0.3, sodium: 4, potassium: 20, servingG: 250 },
  { id: "corn", name: "Sweet corn (cooked)", nameId: "Jagung manis", category: "Rice & staples", kcal: 96, protein: 3.4, carbs: 21, fat: 1.5, fiber: 2.4, sodium: 15, potassium: 270, servingG: 100 },
  { id: "potato", name: "Potato (boiled)", nameId: "Kentang rebus", category: "Rice & staples", kcal: 87, protein: 1.9, carbs: 20.1, fat: 0.1, fiber: 1.8, sodium: 5, potassium: 379, servingG: 150 },
  { id: "sweet-potato", name: "Sweet potato (steamed)", nameId: "Ubi jalar", category: "Rice & staples", kcal: 86, protein: 1.6, carbs: 20.1, fat: 0.1, fiber: 3, sodium: 55, potassium: 337, servingG: 150 },
  { id: "cassava", name: "Cassava (boiled)", nameId: "Singkong rebus", category: "Rice & staples", kcal: 112, protein: 1.2, carbs: 26.7, fat: 0.2, fiber: 1.8, sodium: 14, potassium: 271, servingG: 150 },
  { id: "noodles", name: "Noodles (cooked)", nameId: "Mie rebus", category: "Rice & staples", kcal: 138, protein: 4.5, carbs: 25.1, fat: 2.2, fiber: 1.4, sodium: 210, potassium: 30, servingG: 200 },
  { id: "bread", name: "White bread", nameId: "Roti tawar", category: "Rice & staples", kcal: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sodium: 490, potassium: 115, servingG: 50 },
  { id: "oats", name: "Oats (dry)", nameId: "Oatmeal", category: "Rice & staples", kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, sodium: 2, potassium: 429, servingG: 40 },

  // ---- Meat & poultry ----
  { id: "chicken-breast", name: "Chicken breast (skinless, cooked)", nameId: "Dada ayam", category: "Meat & poultry", kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, potassium: 256, servingG: 100 },
  { id: "chicken-thigh", name: "Chicken thigh (cooked)", nameId: "Paha ayam", category: "Meat & poultry", kcal: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0, sodium: 85, potassium: 240, servingG: 100 },
  { id: "beef-lean", name: "Beef (lean, cooked)", nameId: "Daging sapi", category: "Meat & poultry", kcal: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sodium: 72, potassium: 318, servingG: 100 },
  { id: "liver-chicken", name: "Chicken liver (cooked)", nameId: "Hati ayam", category: "Meat & poultry", kcal: 167, protein: 24.5, carbs: 0.9, fat: 6.5, fiber: 0, sodium: 80, potassium: 263, servingG: 80 },
  { id: "egg", name: "Chicken egg (whole, boiled)", nameId: "Telur ayam rebus", category: "Eggs", kcal: 155, protein: 12.6, carbs: 1.1, fat: 10.6, fiber: 0, sodium: 124, potassium: 126, servingG: 60 },
  { id: "egg-white", name: "Egg white (cooked)", nameId: "Putih telur", category: "Eggs", kcal: 52, protein: 10.9, carbs: 0.7, fat: 0.2, fiber: 0, sodium: 166, potassium: 163, servingG: 60 },
  { id: "egg-yolk", name: "Egg yolk (cooked)", nameId: "Kuning telur", category: "Eggs", kcal: 322, protein: 15.9, carbs: 3.6, fat: 26.5, fiber: 0, sodium: 48, potassium: 109, servingG: 20 },

  // ---- Fish & seafood ----
  { id: "mackerel", name: "Mackerel (cooked)", nameId: "Ikan kembung", category: "Fish & seafood", kcal: 205, protein: 24.2, carbs: 0, fat: 11.7, fiber: 0, sodium: 90, potassium: 401, servingG: 100 },
  { id: "milkfish", name: "Milkfish (cooked)", nameId: "Ikan bandeng", category: "Fish & seafood", kcal: 162, protein: 24, carbs: 0, fat: 6.7, fiber: 0, sodium: 90, potassium: 420, servingG: 100 },
  { id: "tuna", name: "Tuna (cooked)", nameId: "Ikan tuna", category: "Fish & seafood", kcal: 184, protein: 29.9, carbs: 0, fat: 6.3, fiber: 0, sodium: 50, potassium: 522, servingG: 100 },
  { id: "catfish", name: "Catfish (cooked)", nameId: "Ikan lele", category: "Fish & seafood", kcal: 195, protein: 23, carbs: 0, fat: 11.2, fiber: 0, sodium: 90, potassium: 320, servingG: 100 },
  { id: "tilapia", name: "Tilapia (cooked)", nameId: "Ikan nila", category: "Fish & seafood", kcal: 128, protein: 26.2, carbs: 0, fat: 2.7, fiber: 0, sodium: 56, potassium: 380, servingG: 100 },
  { id: "shrimp", name: "Shrimp (cooked)", nameId: "Udang", category: "Fish & seafood", kcal: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, sodium: 111, potassium: 259, servingG: 100 },
  { id: "anchovy", name: "Anchovy (dried)", nameId: "Ikan teri kering", category: "Fish & seafood", kcal: 170, protein: 35, carbs: 0, fat: 3, fiber: 0, sodium: 800, potassium: 100, servingG: 30 },

  // ---- Legumes & tofu ----
  { id: "tofu", name: "Tofu", nameId: "Tahu", category: "Legumes & tofu", kcal: 76, protein: 8.1, carbs: 1.9, fat: 4.8, fiber: 0.3, sodium: 7, potassium: 121, servingG: 100 },
  { id: "tempeh", name: "Tempeh", nameId: "Tempe", category: "Legumes & tofu", kcal: 193, protein: 20.3, carbs: 7.6, fat: 10.8, fiber: 1.4, sodium: 9, potassium: 412, servingG: 100 },
  { id: "green-beans", name: "Green beans (cooked)", nameId: "Kacang hijau", category: "Legumes & tofu", kcal: 105, protein: 7, carbs: 19.2, fat: 0.4, fiber: 7.6, sodium: 4, potassium: 325, servingG: 150 },
  { id: "red-beans", name: "Red beans (cooked)", nameId: "Kacang merah", category: "Legumes & tofu", kcal: 127, protein: 8.7, carbs: 22.8, fat: 0.5, fiber: 6.4, sodium: 2, potassium: 403, servingG: 150 },
  { id: "peanuts", name: "Peanuts (roasted)", nameId: "Kacang tanah", category: "Legumes & tofu", kcal: 587, protein: 24.4, carbs: 21.3, fat: 49.7, fiber: 8.4, sodium: 410, potassium: 634, servingG: 30 },
  { id: "soy-milk", name: "Soy milk", nameId: "Susu kedelai", category: "Legumes & tofu", kcal: 54, protein: 3.3, carbs: 6.3, fat: 2, fiber: 0.6, sodium: 51, potassium: 118, servingG: 250 },

  // ---- Vegetables ----
  { id: "kangkung", name: "Water spinach / kangkung (cooked)", nameId: "Kangkung", category: "Vegetables", kcal: 23, protein: 3.1, carbs: 3.1, fat: 0.3, fiber: 2.1, sodium: 113, potassium: 312, servingG: 100 },
  { id: "spinach", name: "Spinach (cooked)", nameId: "Bayam", category: "Vegetables", kcal: 23, protein: 3, carbs: 3.8, fat: 0.3, fiber: 2.4, sodium: 70, potassium: 466, servingG: 100 },
  { id: "cabbage", name: "Cabbage (cooked)", nameId: "Kubis", category: "Vegetables", kcal: 23, protein: 1.3, carbs: 5.5, fat: 0.1, fiber: 1.8, sodium: 8, potassium: 196, servingG: 100 },
  { id: "broccoli", name: "Broccoli (cooked)", nameId: "Brokoli", category: "Vegetables", kcal: 35, protein: 2.4, carbs: 7.2, fat: 0.4, fiber: 3.3, sodium: 41, potassium: 293, servingG: 100 },
  { id: "carrot", name: "Carrot (cooked)", nameId: "Wortel", category: "Vegetables", kcal: 35, protein: 0.8, carbs: 8.2, fat: 0.2, fiber: 3, sodium: 58, potassium: 235, servingG: 100 },
  { id: "tomato", name: "Tomato", nameId: "Tomat", category: "Vegetables", kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sodium: 5, potassium: 237, servingG: 100 },
  { id: "eggplant", name: "Eggplant (cooked)", nameId: "Terong", category: "Vegetables", kcal: 35, protein: 0.8, carbs: 8.6, fat: 0.2, fiber: 2.5, sodium: 1, potassium: 230, servingG: 100 },
  { id: "cucumber", name: "Cucumber", nameId: "Timun", category: "Vegetables", kcal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sodium: 2, potassium: 147, servingG: 100 },
  { id: "pumpkin", name: "Pumpkin (cooked)", nameId: "Labu kuning", category: "Vegetables", kcal: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 1.1, sodium: 1, potassium: 340, servingG: 150 },
  { id: "green-bean-veg", name: "Long beans (cooked)", nameId: "Kacang panjang", category: "Vegetables", kcal: 47, protein: 2.8, carbs: 8.4, fat: 0.4, fiber: 3.2, sodium: 18, potassium: 240, servingG: 100 },
  { id: "mushroom", name: "Mushrooms (cooked)", nameId: "Jamur", category: "Vegetables", kcal: 22, protein: 2.2, carbs: 4.4, fat: 0.3, fiber: 1.3, sodium: 3, potassium: 318, servingG: 100 },
  { id: "chayote", name: "Chayote (cooked)", nameId: "Labu siam", category: "Vegetables", kcal: 19, protein: 0.8, carbs: 4.5, fat: 0.1, fiber: 1.7, sodium: 2, potassium: 125, servingG: 100 },
  { id: "papaya-green", name: "Green papaya (cooked)", nameId: "Pepaya muda", category: "Vegetables", kcal: 32, protein: 1.3, carbs: 7.9, fat: 0.1, fiber: 1.8, sodium: 4, potassium: 222, servingG: 100 },

  // ---- Fruits ----
  { id: "banana", name: "Banana", nameId: "Pisang", category: "Fruits", kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, sodium: 1, potassium: 358, servingG: 120 },
  { id: "papaya", name: "Papaya", nameId: "Pepaya", category: "Fruits", kcal: 43, protein: 0.5, carbs: 10.8, fat: 0.3, fiber: 1.7, sodium: 8, potassium: 182, servingG: 150 },
  { id: "mango", name: "Mango", nameId: "Mangga", category: "Fruits", kcal: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sodium: 1, potassium: 168, servingG: 150 },
  { id: "orange", name: "Orange", nameId: "Jeruk", category: "Fruits", kcal: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, sodium: 0, potassium: 181, servingG: 150 },
  { id: "apple", name: "Apple", nameId: "Apel", category: "Fruits", kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sodium: 1, potassium: 107, servingG: 150 },
  { id: "watermelon", name: "Watermelon", nameId: "Semangka", category: "Fruits", kcal: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, sodium: 1, potassium: 112, servingG: 200 },
  { id: "pineapple", name: "Pineapple", nameId: "Nanas", category: "Fruits", kcal: 50, protein: 0.5, carbs: 13.1, fat: 0.1, fiber: 1.4, sodium: 1, potassium: 109, servingG: 150 },
  { id: "avocado", name: "Avocado", nameId: "Alpukat", category: "Fruits", kcal: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, sodium: 7, potassium: 485, servingG: 100 },
  { id: "rambutan", name: "Rambutan", nameId: "Rambutan", category: "Fruits", kcal: 82, protein: 0.7, carbs: 20.9, fat: 0.2, fiber: 2.8, sodium: 11, potassium: 42, servingG: 100 },
  { id: "guava", name: "Guava", nameId: "Jambu biji", category: "Fruits", kcal: 68, protein: 2.6, carbs: 14.3, fat: 1, fiber: 5.4, sodium: 2, potassium: 417, servingG: 150 },
  { id: "salak", name: "Salak / snake fruit", nameId: "Salak", category: "Fruits", kcal: 82, protein: 0.4, carbs: 20.9, fat: 0.4, fiber: 1.6, sodium: 0, potassium: 200, servingG: 100 },
  { id: "dragon-fruit", name: "Dragon fruit", nameId: "Buah naga", category: "Fruits", kcal: 60, protein: 1.2, carbs: 13, fat: 0.4, fiber: 3.1, sodium: 1, potassium: 180, servingG: 150 },

  // ---- Dairy ----
  { id: "milk-lowfat", name: "Milk (low-fat 1%)", nameId: "Susu rendah lemak", category: "Dairy", kcal: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sodium: 44, potassium: 150, servingG: 250 },
  { id: "milk-fullfat", name: "Milk (full cream)", nameId: "Susu full cream", category: "Dairy", kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sodium: 43, potassium: 132, servingG: 250 },
  { id: "yogurt", name: "Yogurt (plain)", nameId: "Yogurt", category: "Dairy", kcal: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, sodium: 46, potassium: 155, servingG: 150 },
  { id: "cheese", name: "Cheese (cheddar)", nameId: "Keju", category: "Dairy", kcal: 403, protein: 24.9, carbs: 1.3, fat: 33.1, fiber: 0, sodium: 621, potassium: 98, servingG: 30 },

  // ---- Fats & oils ----
  { id: "coconut-oil", name: "Coconut oil", nameId: "Minyak kelapa", category: "Fats & oils", kcal: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, potassium: 0, servingG: 10 },
  { id: "coconut-milk", name: "Coconut milk", nameId: "Santan", category: "Fats & oils", kcal: 230, protein: 2.3, carbs: 5.5, fat: 23.8, fiber: 0, sodium: 15, potassium: 263, servingG: 50 },
  { id: "peanut-butter", name: "Peanut butter", nameId: "Selai kacang", category: "Fats & oils", kcal: 588, protein: 25.1, carbs: 20, fat: 50, fiber: 6, sodium: 17, potassium: 558, servingG: 30 },
  { id: "margarine", name: "Margarine", nameId: "Margarin", category: "Fats & oils", kcal: 717, protein: 0.2, carbs: 0.7, fat: 81, fiber: 0, sodium: 800, potassium: 18, servingG: 10 },

  // ---- Snacks & sweets ----
  { id: "fried-banana", name: "Fried banana (pisang goreng)", nameId: "Pisang goreng", category: "Snacks & sweets", kcal: 230, protein: 2, carbs: 33, fat: 10, fiber: 2, sodium: 50, potassium: 280, servingG: 60 },
  { id: "crackers", name: "Crackers", nameId: "Kerupuk/biskuit", category: "Snacks & sweets", kcal: 450, protein: 7, carbs: 70, fat: 15, fiber: 2, sodium: 600, potassium: 150, servingG: 30 },
  { id: "sugar", name: "Sugar (granulated)", nameId: "Gula pasir", category: "Snacks & sweets", kcal: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sodium: 1, potassium: 2, servingG: 10 },
  { id: "honey", name: "Honey", nameId: "Madu", category: "Snacks & sweets", kcal: 304, protein: 0.3, carbs: 82.4, fat: 0, fiber: 0, sodium: 4, potassium: 52, servingG: 20 },
  { id: "chocolate", name: "Chocolate (dark 70%)", nameId: "Cokelat", category: "Snacks & sweets", kcal: 598, protein: 7.8, carbs: 45.9, fat: 42.6, fiber: 10.9, sodium: 20, potassium: 715, servingG: 30 },

  // ---- Beverages ----
  { id: "tea", name: "Tea (unsweetened)", nameId: "Teh tawar", category: "Beverages", kcal: 1, protein: 0, carbs: 0.3, fat: 0, fiber: 0, sodium: 1, potassium: 11, servingG: 250 },
  { id: "coffee", name: "Coffee (black)", nameId: "Kopi hitam", category: "Beverages", kcal: 2, protein: 0.1, carbs: 0.3, fat: 0, fiber: 0, sodium: 2, potassium: 49, servingG: 250 },
  { id: "sweetened-drink", name: "Sweetened drink (soda)", nameId: "Minuman manis", category: "Beverages", kcal: 42, protein: 0, carbs: 10.6, fat: 0, fiber: 0, sodium: 4, potassium: 2, servingG: 330 },
  { id: "coconut-water", name: "Coconut water", nameId: "Air kelapa", category: "Beverages", kcal: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1.1, sodium: 105, potassium: 250, servingG: 250 },

  // ---- Herbs, spices & condiments ----
  { id: "chili", name: "Chili pepper (raw)", nameId: "Cabai", category: "Herbs & spices", kcal: 40, protein: 1.9, carbs: 8.8, fat: 0.4, fiber: 1.5, sodium: 9, potassium: 322, servingG: 20 },
  { id: "shallot", name: "Shallot", nameId: "Bawang merah", category: "Herbs & spices", kcal: 72, protein: 2.5, carbs: 16.8, fat: 0.1, fiber: 3.2, sodium: 12, potassium: 334, servingG: 20 },
  { id: "garlic", name: "Garlic", nameId: "Bawang putih", category: "Herbs & spices", kcal: 149, protein: 6.4, carbs: 33.1, fat: 0.5, fiber: 2.1, sodium: 17, potassium: 401, servingG: 10 },
  { id: "soy-sauce", name: "Soy sauce", nameId: "Kecap", category: "Condiments", kcal: 53, protein: 8.1, carbs: 4.9, fat: 0.6, fiber: 0.8, sodium: 5493, potassium: 435, servingG: 15 },
  { id: "salt", name: "Salt", nameId: "Garam", category: "Condiments", kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 38758, potassium: 8, servingG: 5 },
];

void RFS_FOODS;
export const foods: FoodItem[] = canonicalFoods;

export const foodCategories = [...new Set(foods.map((f) => f.category))];
