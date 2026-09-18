import type { DosePreparation, Drug, DrugDose } from "@/lib/types";

export interface DrugEnrichment {
  slug: string;
  doses?: DrugDose[];
  preparations?: string[];
  dosePreparations?: DosePreparation[];
  curatedPreparationsOnly?: boolean;
  keywords?: string[];
}

const doseKey = (dose: DrugDose) =>
  [dose.population, dose.route, dose.indication ?? "", dose.text].join("|");

export function mergeDrugEnrichments(base: Drug[], patches: DrugEnrichment[], newDrugs: Drug[]): Drug[] {
  const output = base.map((drug) => ({ ...drug, doses: [...drug.doses] }));
  const indexes = new Map(output.map((drug, index) => [drug.slug, index]));
  const patchSlugs = new Set<string>();

  for (const patch of patches) {
    if (patchSlugs.has(patch.slug)) throw new Error(`Patch ganda: ${patch.slug}`);
    patchSlugs.add(patch.slug);
    const index = indexes.get(patch.slug);
    if (index === undefined) throw new Error(`Obat tidak ditemukan: ${patch.slug}`);
    const old = output[index];
    const keys = new Set(old.doses.map(doseKey));
    const doses = [...old.doses];
    for (const dose of patch.doses ?? []) {
      if (!dose.source?.url) throw new Error(`Sumber dosis tidak lengkap: ${patch.slug}`);
      if (!keys.has(doseKey(dose))) doses.push(dose);
      keys.add(doseKey(dose));
    }
    output[index] = {
      ...old,
      doses,
      preparations: [...new Set([...(old.preparations ?? []), ...(patch.preparations ?? [])])],
      dosePreparations: [...new Map(
        [...(old.dosePreparations ?? []), ...(patch.dosePreparations ?? [])].map((item) => [item.id, item]),
      ).values()],
      curatedPreparationsOnly: patch.curatedPreparationsOnly ?? old.curatedPreparationsOnly,
      keywords: [...new Set([...old.keywords, ...(patch.keywords ?? [])])],
    };
  }

  for (const drug of newDrugs) {
    if (indexes.has(drug.slug)) throw new Error(`Obat ganda: ${drug.slug}`);
    if (!drug.source.url || drug.doses.some((dose) => !dose.source?.url)) {
      throw new Error(`Sumber obat tidak lengkap: ${drug.slug}`);
    }
    indexes.set(drug.slug, output.length);
    output.push(drug);
  }
  return output;
}
