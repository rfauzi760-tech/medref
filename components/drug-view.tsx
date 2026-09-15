"use client";

import type { Drug } from "@/lib/types";
import { SpecialtyTags } from "@/components/action-buttons";
import { SourceBlock } from "@/components/source-block";
import { useRecordVisit } from "@/components/use-local-store";
import { ClinicalContent } from "@/components/clinical-content";
import { PediatricDoseForm } from "@/components/pediatric-dose-form";

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="workspace-panel overflow-hidden">
      <h2 className="section-band display-type text-base font-bold">{title}</h2>
      <ClinicalContent items={items} className="p-4" />
    </div>
  );
}

export function DrugView({ drug, initialPediatricMode = false }: { drug: Drug; initialPediatricMode?: boolean }) {
  useRecordVisit({ href: `/drugs/${drug.slug}`, title: drug.genericName, group: "drugs" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-type text-3xl font-bold tracking-tight sm:text-4xl">{drug.genericName}</h1>
        {drug.brandNames && drug.brandNames.length > 0 && (
          <p className="mt-1 text-sm text-zinc-400">Merek: {drug.brandNames.join(", ")}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{drug.drugClass}</span>
        </div>
        <div className="mt-3">
          <SpecialtyTags specialties={drug.specialties} />
        </div>
      </div>

      {drug.majorWarnings && (
        <div className="space-y-2">
          {drug.majorWarnings.map((w) => (
            <div key={w} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
              ⚠ {w}
            </div>
          ))}
        </div>
      )}

      <Section title="Indikasi" items={drug.indications} />

      <PediatricDoseForm drug={drug} initialPediatricMode={initialPediatricMode} />

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Kontraindikasi" items={drug.contraindications ?? []} />
        <Section title="Pertimbangan ginjal" items={drug.renalConsideration ? [drug.renalConsideration] : []} />
        <Section title="Pertimbangan hati" items={drug.hepaticConsideration ? [drug.hepaticConsideration] : []} />
        <Section title="Sediaan" items={drug.preparations ?? []} />
        {drug.pregnancy && <Section title="Kehamilan" items={[drug.pregnancy]} />}
        {drug.lactation && <Section title="Menyusui" items={[drug.lactation]} />}
        <Section title="Catatan klinis" items={drug.notes ?? []} />
      </div>

      <SourceBlock source={drug.source} lastReviewed={drug.lastReviewed} />
    </div>
  );
}
