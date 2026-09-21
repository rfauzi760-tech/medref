import ddinterData from "@/lib/generated/ddinter-interactions.json";
import type { ClinicalSource, DrugInteraction } from "@/lib/types";

type DdinterSeverity = "contraindicated" | "major" | "moderate" | "minor" | "unknown";
type DdinterGroup = { severity: string; categories: string[]; mechanism: string };
type DdinterDataset = {
  source: { org: string; title: string; year: number; url: string; license: string };
  groups: Record<string, DdinterGroup>;
  pairs: [string, string, string, string][];
};

const dataset = ddinterData as unknown as DdinterDataset;
const DDINTER_SOURCE: ClinicalSource = dataset.source;
const NO_MANAGEMENT = "DDInter tidak menyediakan rekomendasi manajemen spesifik. Verifikasi label resmi, kondisi pasien, dan konsultasikan farmasis klinis.";

function severity(value: string): DdinterSeverity {
  return value === "contraindicated" || value === "major" || value === "moderate" || value === "minor" ? value : "unknown";
}

export const INTERACTIONS: DrugInteraction[] = dataset.pairs.map(([a, b, level, groupId]) => {
  const group = dataset.groups[groupId];
  const description = group?.mechanism ?? "Deskripsi mekanisme tidak tersedia pada DDInter.";
  return {
    id: `ddinter-${a}-${b}`,
    a,
    b,
    severity: severity(level),
    mechanism: description,
    management: NO_MANAGEMENT,
    source: DDINTER_SOURCE,
  };
});

/** Map: drug slug → interactions involving it. */
export function interactionsFor(slug: string): DrugInteraction[] {
  return INTERACTIONS.filter((item) => item.a === slug || item.b === slug);
}

export const SEVERITY_ORDER: DrugInteraction["severity"][] = ["contraindicated", "major", "moderate", "minor", "unknown"];

export const SEVERITY_LABEL: Record<DrugInteraction["severity"], string> = {
  contraindicated: "Kontraindikasi",
  major: "Mayor",
  moderate: "Moderat",
  minor: "Minor",
  unknown: "Tidak diketahui / data tidak cukup",
};

export const drugInteractions = INTERACTIONS;
