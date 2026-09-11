import SpecialtiesPageClient from "@/components/catalog-pages/specialties-page-client";
import { CALCULATORS } from "@/lib/data/calculators";
import { DRUGS } from "@/lib/data/drugs";
import { guidelines } from "@/lib/data/guidelines";
import { procedureEntries } from "@/lib/data/indications";
import { SCORES } from "@/lib/data/scores";
import { SPECIALTIES } from "@/lib/specialties";

export default function SpecialtiesPage() {
  const all = [...SCORES, ...CALCULATORS, ...DRUGS, ...guidelines, ...procedureEntries];
  const items = SPECIALTIES.map((specialty) => ({
    ...specialty,
    count: all.filter((entry) => entry.specialties.includes(specialty.name)).length,
  }));
  return <SpecialtiesPageClient items={items} />;
}
