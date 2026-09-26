import { Suspense } from "react";
import { DrugsWorkspace } from "@/components/drugs-workspace";
import { DRUGS } from "@/lib/data/drugs";
import { JAGAMATE_DRUG_CHOICES } from "@/lib/data/jagamate-choices";

export default function DrugsPage() {
  const drugs = DRUGS.map(({ slug, genericName, brandNames, drugClass, specialties, keywords, indications }) => ({
    slug,
    genericName,
    brandNames,
    drugClass,
    specialties,
    keywords,
    indications,
  }));
  return <Suspense fallback={<div role="status" className="py-10 text-sm text-[var(--muted)]">Memuat dosis obat…</div>}><DrugsWorkspace drugs={drugs} choices={JAGAMATE_DRUG_CHOICES.map((item) => ({ name: item.sourceName, slug: item.slug }))} /></Suspense>;
}
