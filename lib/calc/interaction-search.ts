export interface InteractionDrugSummary {
  slug: string;
  genericName: string;
  brandNames?: string[];
  drugClass: string;
}

export function filterInteractionSuggestions<T extends InteractionDrugSummary>(
  drugs: T[],
  addedSlugs: string[],
  query: string,
  drugClass: string,
  limit = 8,
): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!drugClass && normalizedQuery.length < 2) return [];
  const added = new Set(addedSlugs);
  return drugs.filter((drug) =>
    !added.has(drug.slug) &&
    (!drugClass || drug.drugClass === drugClass) &&
    (!normalizedQuery || drug.genericName.toLowerCase().includes(normalizedQuery) ||
      drug.brandNames?.some((brand) => brand.toLowerCase().includes(normalizedQuery))),
  ).slice(0, limit);
}
