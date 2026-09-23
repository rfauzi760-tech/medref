import "server-only";
import content from "@/lib/generated/klinea-content.json";
import { parseWeightBasedDose } from "@/lib/calc/drugs";
import type {
  ClinicalContentItem,
  ClinicalSource,
  Drug,
  DrugInteraction,
  GuidelineEntry,
  GuidelineSectionKey,
  Icd10Entry,
  MilestoneAge,
  MilestoneDomain,
  ScoreRange,
  ScoreTool,
  ScoreVariable,
} from "@/lib/types";

type Dict = Record<string, unknown>;

const KLINEA_SOURCE: ClinicalSource = {
  org: "Klinea",
  title: "Basis data klinis Klinea",
  year: 2026,
  url: "https://www.klinea.id/app.html",
};

const REVIEWED = "2026-09-11";
const clean = (value: unknown) => String(value ?? "").replace(/\[\[|\]\]/g, "").trim();
const list = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(clean).filter(Boolean) : value ? [clean(value)] : [];
const words = (value: unknown): string[] => clean(value).toLowerCase().split(/\s+/).filter(Boolean);
const number = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const sourceFrom = (refs: unknown): ClinicalSource[] => {
  if (!Array.isArray(refs) || refs.length === 0) return [KLINEA_SOURCE];
  return refs.map((ref) => {
    const row = ref as Dict;
    return {
      org: clean(row.src) || "Klinea",
      title: clean(row.src) || "Referensi klinis",
      year: Number.parseInt(clean(row.year), 10) || 2026,
    };
  });
};

const flatten = (value: unknown): string[] => {
  if (!Array.isArray(value)) return list(value);
  return value.flatMap((item) => {
    if (typeof item === "string") return [clean(item)];
    if (!item || typeof item !== "object") return [];
    const row = item as Dict;
    const title = clean(row.t);
    const children = flatten(row.sub);
    return title ? [title, ...children.map((child) => `${title} ${child}`)] : children;
  }).filter(Boolean);
};

const structuredContent = (value: unknown): ClinicalContentItem[] => {
  if (typeof value === "string") {
    const text = clean(value);
    return text ? [text] : [];
  }
  if (Array.isArray(value)) return value.flatMap(structuredContent);
  if (!value || typeof value !== "object") return [];
  const row = value as Dict;
  const heading = clean(row.t).replace(/:\s*$/, "");
  const children = structuredContent(row.sub);
  if (heading) return [{ heading, children }];
  return children;
};

const groupDiareTreatmentPlans = (items: ClinicalContentItem[]): ClinicalContentItem[] => {
  const output: ClinicalContentItem[] = [];
  let current: { heading: string; children: ClinicalContentItem[] } | undefined;

  for (const item of items) {
    if (typeof item === "string" && /^Rencana Terapi [ABC]\b/.test(item)) {
      current = { heading: item.replace(/:\s*$/, ""), children: [] };
      output.push(current);
    } else if (current && !(typeof item === "string" && /^Antibiotik\b/.test(item))) {
      current.children.push(item);
    } else {
      current = undefined;
      output.push(item);
    }
  }

  return output;
};

type KlineaField = {
  id?: string;
  label?: string;
  type?: "check" | "radio" | "num";
  options?: { label?: string; points?: number }[];
};

type KlineaTool = {
  id: string;
  sp?: string;
  name?: string;
  blurb?: string;
  guideline?: string;
  showScore?: boolean;
  fields?: KlineaField[];
};

const scoreRange = (row: Dict): ScoreRange => {
  const score = clean(row.skor).toLowerCase();
  const normalizedScore = score.replace(/(\d)\s*[-–]\s*(\d)/g, "$1 sampai $2");
  const numericScore = /^(?:[<>≤≥]=?\s*)?-?\d/.test(normalizedScore);
  const values = numericScore ? normalizedScore.match(/-?\d+(?:[.,]\d+)?/g)?.map((item) => Number(item.replace(",", "."))) ?? [] : [];
  let min = values[0] ?? -9999;
  let max = values[1] ?? values[0] ?? 9999;
  if (/^(>|>=|≥)/.test(score) || /ke atas|atau lebih/.test(score)) max = 9999;
  if (/^(<|<=|≤)/.test(score) || /ke bawah|atau kurang/.test(score)) {
    min = -9999;
    max = values[0] ?? 9999;
  }
  const toneName = clean(row.tone);
  const tone: ScoreRange["tone"] = toneName === "danger" ? "danger" : toneName === "warn" ? "warning" : toneName === "ok" ? "success" : "info";
  const steps = flatten(row.langkah);
  return {
    min,
    max,
    category: clean(row.risiko) || "Interpretasi",
    label: clean(row.risiko) || `Skor ${clean(row.skor)}`,
    action: steps.join(" "),
    tone,
  };
};

const ALVARADO_WARNINGS = [
  "Pada perempuan usia subur, skor ini tidak membedakan apendisitis dari penyebab ginekologis. Pertimbangkan kehamilan ektopik, torsi adneksa, dan radang panggul; lakukan tes kehamilan bila pasien mungkin hamil.",
  "Pada anak prasekolah, gejala dapat tidak khas dan skor saja tidak cukup untuk menyingkirkan apendisitis. Pada lansia, skor juga kurang andal untuk membedakan apendisitis sederhana dan berkomplikasi.",
  "Jangan gunakan skor sebagai satu-satunya dasar untuk operasi atau untuk menunda pemeriksaan. Bila kondisi memburuk, nyeri menetap, atau ada kecurigaan komplikasi, lanjutkan evaluasi meski skornya rendah.",
  "Dalam meta-analisis, RIPASA memiliki sensitivitas lebih tinggi tetapi spesifisitas lebih rendah daripada Alvarado. Hasil ini tidak berarti RIPASA selalu lebih baik; pertimbangkan validasi setempat dan temuan klinis.",
];

const ALVARADO_SOURCE: ClinicalSource = {
  org: "World Society of Emergency Surgery",
  title: "Diagnosis and Treatment of Acute Appendicitis: 2025 Edition of the WSES Jerusalem Guidelines",
  year: 2026,
  url: "https://doi.org/10.1001/jamasurg.2025.6218",
};

function toolVariables(tool: KlineaTool, legacy?: ScoreTool): ScoreVariable[] {
  if (legacy) {
    const translate = (value: string) => value
      .replace(/Respiratory rate/gi, "Frekuensi napas")
      .replace(/Systolic blood pressure/gi, "Tekanan darah sistolik")
      .replace(/Blood pressure/gi, "Tekanan darah")
      .replace(/Mental status/gi, "Status mental")
      .replace(/Heart rate/gi, "Frekuensi nadi")
      .replace(/Age/gi, "Usia")
      .replace(/History/gi, "Anamnesis")
      .replace(/Risk factors/gi, "Faktor risiko")
      .replace(/Present/gi, "Ada")
      .replace(/Absent/gi, "Tidak ada")
      .replace(/Yes/gi, "Ya")
      .replace(/No /gi, "Tanpa ")
      .replace(/^No$/i, "Tidak")
      .replace(/Normal/gi, "Normal");
    return legacy.variables.map((variable) => ({
      ...variable,
      label: translate(variable.label),
      shortLabel: variable.shortLabel ? translate(variable.shortLabel) : undefined,
      help: variable.help ? translate(variable.help) : undefined,
      options: variable.options?.map((option) => ({ ...option, label: translate(option.label) })),
    }));
  }
  const fields = (tool.fields ?? []).filter((field) => field.id);
  return fields.map((field) => {
    if (field.type === "num") {
      return {
        id: field.id!,
        label: clean(field.label),
        type: "number",
        required: true,
        min: 0,
        max: 100,
        step: 1,
      };
    }
    const options = field.type === "radio"
      ? (field.options ?? []).map((option) => ({ label: clean(option.label), value: Number(option.points ?? 0) }))
      : [{ label: "Tidak", value: 0 }, { label: "Ya", value: 1 }];
    return {
      id: field.id!,
      label: clean(field.label),
      type: "select",
      required: true,
      options,
    };
  });
}

export function canonicalScores(legacyScores: ScoreTool[]): ScoreTool[] {
  const byId = new Map(legacyScores.flatMap((score) => [[score.id, score], [score.slug, score]]));
  const scoreAliases: Record<string, string> = { aki: "kdigo-aki", ckd: "ckd-stage" };
  const extras = content.toolExtra as Record<string, Dict>;
  return (content.tools as KlineaTool[]).map((tool) => {
    const normalizedName = clean(tool.name).toLowerCase();
    const legacy = byId.get(tool.id) ?? byId.get(scoreAliases[tool.id]) ?? legacyScores.find((item) =>
      item.abbreviation?.toLowerCase() === normalizedName || item.title.toLowerCase() === normalizedName,
    );
    const extra = extras[tool.id] ?? {};
    const translateRange = (value: string) => value
      .replace(/Very low risk/gi, "Risiko sangat rendah")
      .replace(/Low risk/gi, "Risiko rendah")
      .replace(/Moderate risk/gi, "Risiko sedang")
      .replace(/High risk/gi, "Risiko tinggi")
      .replace(/Low probability/gi, "Probabilitas rendah")
      .replace(/Moderate probability/gi, "Probabilitas sedang")
      .replace(/High probability/gi, "Probabilitas tinggi")
      .replace(/PERC negative/gi, "PERC negatif")
      .replace(/PERC positive/gi, "PERC positif")
      .replace(/monitor and reassess/gi, "pantau dan nilai ulang")
      .replace(/further testing required/gi, "perlu pemeriksaan lanjutan");
    const ranges = legacy
      ? legacy.ranges.map((range) => ({ ...range, category: translateRange(range.category), label: translateRange(range.label), action: range.action ? translateRange(range.action) : undefined }))
      : Array.isArray(extra.pita) && extra.pita.length
        ? (extra.pita as Dict[]).map(scoreRange)
        : [{ min: -9999, max: 9999, category: "Interpretasi", label: clean(tool.guideline) || "Lihat panduan klinis", tone: "info" as const }];
    const references = sourceFrom(extra.refs);
    const isAlvarado = tool.id === "alvarado";
    return {
      ...legacy,
      id: tool.id,
      slug: legacy?.slug ?? tool.id,
      title: clean(tool.name) || tool.id,
      description: isAlvarado
        ? "Membantu memperkirakan kemungkinan apendisitis akut dari gejala, pemeriksaan, dan hasil darah."
        : clean(tool.blurb) || clean(extra.dasar) || "Alat bantu klinis.",
      specialties: list(tool.sp),
      keywords: [...words(tool.name), ...words(tool.blurb), tool.id],
      type: "score",
      category: tool.showScore === false ? "criteria" : "score",
      variables: toolVariables(tool, legacy),
      ranges,
      indication: isAlvarado
        ? "Alat bantu penilaian awal pada pasien yang diduga mengalami apendisitis. Skor membantu memilah pasien berisiko rendah dan menengah yang mungkin perlu observasi atau pemeriksaan lanjutan, tetapi tidak menetapkan diagnosis atau keputusan operasi sendirian."
        : flatten(extra.pakai).join(" ") || clean(tool.guideline),
      limitations: isAlvarado
        ? "Pada orang dewasa, skor Alvarado kurang spesifik untuk memastikan apendisitis. Hasilnya perlu dibaca bersama kondisi pasien, pemeriksaan fisik, dan pemeriksaan penunjang."
        : flatten(extra.jangan).join(" "),
      warnings: isAlvarado ? ALVARADO_WARNINGS : flatten(extra.jangan),
      lastReviewed: REVIEWED,
      source: isAlvarado ? ALVARADO_SOURCE : references[0],
    };
  });
}

type KlineaDrug = {
  id: string;
  nm?: string;
  kelas?: string;
  cat?: string;
  q?: string;
  kontra?: unknown;
  indikasi?: unknown;
  dewasa?: unknown;
  anak?: unknown;
  sediaan?: unknown;
  perhatian?: unknown;
  refs?: unknown;
};

const DRUG_SLUG_ALIASES: Record<string, string> = {
  parasetamol: "paracetamol",
  amoksisilin: "amoxicillin",
  azitromisin: "azithromycin",
};

export function canonicalDrugs(legacyDrugs: Drug[]): Drug[] {
  const legacyById = new Map(legacyDrugs.flatMap((drug) => [[drug.id, drug], [drug.slug, drug]]));
  return (content.drugs as KlineaDrug[]).map((drug) => {
    const legacy = legacyById.get(drug.id) ?? legacyById.get(DRUG_SLUG_ALIASES[drug.id]);
    const childWeight = legacy?.doses.find((dose) => dose.population === "pediatric" || dose.population === "all")?.weightBased;
    const adult = list(drug.dewasa).map((text) => ({
      population: "adult" as const,
      route: text.split(":")[0] || "Sesuai panduan",
      text: drug.id === "fenitoin" ? "Dosis muat fenitoin IV dewasa memerlukan regimen tersendiri, laju infus, dan pemantauan kardiopulmoner; pilih regimen terverifikasi di bawah." :
        drug.id === "nac" && text.startsWith("Parasetamol") ? "Keracunan parasetamol: asetilsistein IV diberikan dalam tiga fase berturut-turut (150, 50, lalu 100 mg/kg); pilih protokol antidot lengkap dan volume pengenceran sesuai berat badan." : text,
      weightBased: drug.id === "fenitoin" || (drug.id === "nac" && text.startsWith("Parasetamol"))
        ? undefined : parseWeightBasedDose(text),
    }));
    const child = list(drug.anak).map((text, index) => {
      const unverifiedPromethazine = drug.id === "difenhidramin-syr";
      const outdatedEpinephrine = drug.id === "epinefrin" && index === 0;
      const unverifiedChlorpheniramine = drug.id === "klorfeniramin";
      const unsafeLegacyCalculation = ["fenitoin", "domperidon", "ondansetron-anak"].includes(drug.id);
      const unverifiedLegacyCalculation = ["diazepam", "gentamisin", "metamizol", "diklofenak", "asam-valproat"].includes(drug.id);
      const saferInstruction = drug.id === "diazepam"
        ? index === 0
          ? "Kejang akut IV: dosis pertama dan kedua memiliki batas berbeda. Pilih regimen IV terverifikasi; jangan gunakan angka rektal untuk IV."
          : "Diazepam rektal untuk klaster kejang memakai pita usia dan pembulatan sediaan dosis tunggal; dosis tidak boleh disamakan dengan IV."
        : drug.id === "gentamisin"
          ? "Dosis gentamisin anak harus mengikuti jadwal produk, usia, fungsi ginjal, dan kadar obat. Jangan gunakan angka sekali sehari ini tanpa protokol dan pemantauan."
          : drug.id === "metamizol"
            ? "Dosis metamizol anak bergantung rute dan produk serta memerlukan penilaian risiko agranulositosis. Angka lama tidak dihitung otomatis."
            : drug.id === "diklofenak"
              ? "Dosis diklofenak anak harus dibedakan menurut garam, sediaan, usia, dan indikasi. Angka lama tidak dihitung otomatis."
              : drug.id === "asam-valproat"
                ? "Valproat untuk epilepsi anak memerlukan titrasi individual, pemeriksaan fungsi hati, dan penilaian kontraindikasi. Angka lama tidak dihitung otomatis."
                : undefined;
      const parsedWeight = parseWeightBasedDose(text);
      const fallbackWeight = index === 0 ? childWeight : undefined;
      const sameRegimen = parsedWeight && fallbackWeight &&
        parsedWeight.min === fallbackWeight.min &&
        parsedWeight.max === (fallbackWeight.max ?? fallbackWeight.min) &&
        parsedWeight.per === fallbackWeight.per &&
        (parsedWeight.doseUnit ?? "mg") === (fallbackWeight.doseUnit ?? "mg");
      return {
        population: "pediatric" as const,
        route: text.split(":")[0] || "Sesuai panduan",
        text: drug.id === "fenitoin" ? "Dosis muat fenitoin IV anak memerlukan laju infus dan pemantauan kardiopulmoner; pilih regimen terverifikasi di bawah." :
          drug.id === "domperidon" ? "Domperidon tidak lagi berizin untuk anak <12 tahun atau BB <35 kg menurut MHRA; pertimbangkan alternatif dan verifikasi aturan setempat." :
          unverifiedPromethazine ? text.replace(/hati-hati\s*<\s*2\s*th/i, "kontraindikasi <2 tahun") :
          outdatedEpinephrine ? text.replace(/maks\s*0,5\s*mg/i, "maks 0,3 mg pada anak") : saferInstruction ?? text,
        minAgeYears: unverifiedPromethazine ? 2 : undefined,
        weightBased: unverifiedPromethazine || outdatedEpinephrine || unverifiedChlorpheniramine || unsafeLegacyCalculation || unverifiedLegacyCalculation ? undefined :
          sameRegimen ? { ...fallbackWeight, ...parsedWeight } : parsedWeight,
      };
    });
    return {
      id: drug.id,
      slug: DRUG_SLUG_ALIASES[drug.id] ?? drug.id,
      genericName: clean(drug.nm) || drug.id,
      brandNames: legacy?.brandNames,
      drugClass: clean(drug.kelas) || clean(drug.cat) || "Obat",
      specialties: list(drug.cat),
      keywords: [...words(drug.q), ...words(drug.nm)],
      indications: list(drug.indikasi),
      doses: [...adult, ...child],
      contraindications: list(drug.kontra),
      majorWarnings: drug.id === "ondansetron-anak"
        ? [...list(drug.perhatian), "Ranitidin: hanya gunakan produk yang status izin edar dan cemaran NDMA-nya telah diverifikasi di BPOM."]
        : list(drug.perhatian),
      preparations: list(drug.sediaan),
      pregnancy: legacy?.pregnancy,
      lactation: legacy?.lactation,
      lastReviewed: REVIEWED,
      source: sourceFrom(drug.refs)[0],
    };
  });
}

type KlineaGuideline = Dict & { id: string; name?: string; cat?: string; q?: string; refs?: unknown };

const sectionMap: Partial<Record<string, GuidelineSectionKey>> = {
  diagnosis: "diagnosticCriteria",
  penunjang: "investigations",
  klasifikasi: "classification",
  tatalaksana: "initialManagement",
  monitoring: "followUp",
  admit: "admissionCriteria",
  rujuk: "icuCriteria",
  edukasi: "discharge",
  warning: "redFlags",
  severe: "redFlags",
};

// `warning` and `severe` describe warning signs inside a guideline. Their
// presence does not make the whole condition an emergency. Most Klinea
// guidelines map to the curated RFS classification; these IDs cover the few
// source records whose translated names or IDs do not match that catalog.
const klineaEmergencyGuidelineIds = new Set([
  "stemi",
  "acs-nste",
  "ghf",
  "af",
  "dvt",
  "pe",
  "dka2",
  "pankreatitis2",
  "ensefalopati-hepatik",
  "sbp",
  "sepsis2",
  "asma2",
  "ppok2",
  "cap2",
  "stroke2",
  "gbs",
  "myasthenia",
  "preeklampsia2",
  "diare-anak",
  "pneumonia-anak",
  "rds-neo",
]);

export function canonicalGuidelines(legacyGuidelines: GuidelineEntry[]): GuidelineEntry[] {
  const byId = new Map(legacyGuidelines.flatMap((item) => [[item.id, item], [item.slug, item]]));
  const extraById = content.guidelineExtra as Record<string, Dict>;
  return (content.guidelines as KlineaGuideline[]).map((guide) => {
    const normalizedName = clean(guide.name).toLowerCase();
    const legacy = byId.get(guide.id) ?? legacyGuidelines.find((item) => item.title.toLowerCase() === normalizedName);
    // Keep the reviewed neonatal pathway and its guide aligned under the canonical route.
    if (guide.id === "asfiksia-neo" && legacy?.slug === "asfiksia-neonatorum") {
      return { ...legacy, id: guide.id, slug: guide.id };
    }
    const merged: Dict = { ...guide, ...(extraById[guide.id] ?? {}) };
    const sections: GuidelineEntry["sections"] = {};
    for (const [sourceKey, targetKey] of Object.entries(sectionMap)) {
      if (!targetKey) continue;
      const rawValues = structuredContent(merged[sourceKey]);
      const values = guide.id === "diare-anak" && targetKey === "initialManagement"
        ? groupDiareTreatmentPlans(rawValues)
        : rawValues;
      if (values.length) sections[targetKey] = [...(sections[targetKey] ?? []), ...values];
    }
    const overview = structuredContent(merged.ringkas ?? merged.overview);
    if (overview.length) sections.overview = overview;
    return {
      id: guide.id,
      slug: guide.id,
      title: clean(guide.name) || guide.id,
      specialties: list(guide.cat),
      keywords: [...words(guide.q), ...words(guide.name)],
      emergency: legacy?.emergency ?? klineaEmergencyGuidelineIds.has(guide.id),
      ageGroup: legacy?.ageGroup ?? (/anak|pediatri/i.test(clean(guide.cat)) ? "pediatric" : "both"),
      pregnancyRelevant: legacy?.pregnancyRelevant,
      sections,
      references: sourceFrom(merged.refs),
      lastReviewed: REVIEWED,
    };
  });
}

const chapters: Record<string, string> = {
  A: "Penyakit infeksi dan parasit", B: "Penyakit infeksi dan parasit", C: "Neoplasma", D: "Darah dan sistem imun",
  E: "Endokrin, nutrisi, dan metabolik", F: "Gangguan mental dan perilaku", G: "Sistem saraf", H: "Mata dan telinga",
  I: "Sistem sirkulasi", J: "Sistem pernapasan", K: "Sistem pencernaan", L: "Kulit dan jaringan subkutan",
  M: "Muskuloskeletal", N: "Genitourinaria", O: "Kehamilan dan persalinan", P: "Perinatal", Q: "Kelainan kongenital",
  R: "Gejala dan temuan klinis", S: "Cedera dan keracunan", T: "Cedera dan keracunan", V: "Penyebab eksternal",
  W: "Penyebab eksternal", X: "Penyebab eksternal", Y: "Penyebab eksternal", Z: "Faktor yang memengaruhi status kesehatan",
};

export const canonicalIcd10: Icd10Entry[] = (content.icd10 as Dict[]).map((row) => ({
  code: clean(row.c),
  en: clean(row.en),
  id: clean(row.nm),
  chapter: chapters[clean(row.c)[0]] ?? "Lainnya",
}));

const domainMap: Record<string, MilestoneDomain> = {
  "motorik kasar": "gross",
  "motorik halus": "fine",
  bahasa: "language",
  sosial: "social",
  kognitif: "cognitive",
};

export const canonicalMilestones: MilestoneAge[] = Object.values(
  (content.milestones as Dict[]).reduce<Record<number, MilestoneAge>>((groups, row) => {
    const age = number(row.expectBy) ?? 0;
    const domain = domainMap[clean(row.domain).toLowerCase()] ?? "cognitive";
    groups[age] ??= {
      ageMonths: age,
      label: `${age} bulan`,
      milestones: {},
      redFlags: [],
      activities: [],
      source: KLINEA_SOURCE,
    };
    groups[age].milestones[domain] ??= [];
    groups[age].milestones[domain]!.push(clean(row.item));
    return groups;
  }, {}),
).sort((a, b) => a.ageMonths - b.ageMonths);

export const canonicalInteractions: DrugInteraction[] = (content.interactions as Dict[]).flatMap((rule, ruleIndex) => {
  const groups = content.drugGroups as Record<string, string[]>;
  const aValues = groups[clean(rule.a)] ?? [clean(rule.a)];
  const bValues = groups[clean(rule.b)] ?? [clean(rule.b)];
  const severityName = clean(rule.sev).toLowerCase();
  const severity: DrugInteraction["severity"] = severityName.includes("kontra") ? "contraindicated" : severityName.includes("mayor") ? "major" : severityName.includes("moderat") ? "moderate" : severityName.includes("minor") ? "minor" : "unknown";
  return aValues.flatMap((a) => bValues.filter((b) => a !== b).map((b) => ({
    id: `${ruleIndex}-${a}-${b}`,
    a: DRUG_SLUG_ALIASES[a] ?? a,
    b: DRUG_SLUG_ALIASES[b] ?? b,
    severity,
    mechanism: clean(rule.mech),
    effect: clean(rule.efek),
    management: clean(rule.advice),
    source: KLINEA_SOURCE,
  })));
});
