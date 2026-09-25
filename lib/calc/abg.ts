import type { CalcResult, CalcResultLine } from "@/lib/types";
import { fmt, round } from "@/lib/calc/units";

/**
 * Arterial blood gas / acid-base interpretation.
 *
 * Deterministic interpretation of a blood gas using standard formulae:
 * - Primary disorder from pH, pCO2 and HCO3
 * - Expected compensation (Winter's formula, metabolic alkalosis rule,
 *   acute/chronic respiratory compensation rules)
 * - Anion gap, albumin-corrected anion gap and delta ratio
 *
 * Reference ranges: pH 7.35-7.45, pCO2 35-45 mmHg, HCO3 22-26 mmol/L,
 * anion gap 8-12 mmol/L (without potassium).
 */

export interface AbgInput {
  ph: number;
  pco2: number;
  hco3: number;
  na?: number;
  cl?: number;
  albumin?: number;
}

export interface AbgInterpretation {
  acidBaseStatus: "asidemia" | "alkalemia" | "normal";
  primary: string;
  compensation: string;
  compensationLabel?: string;
  compensationUnit?: string;
  compensationDetail?: string;
  anionGap?: number;
  correctedAnionGap?: number;
  deltaRatio?: number;
  deltaRatioLabel?: string;
  isMixed: boolean;
}

const NORMAL_PH_LOW = 7.35;
const NORMAL_PH_HIGH = 7.45;
const NORMAL_PCO2_LOW = 35;
const NORMAL_PCO2_HIGH = 45;
const NORMAL_HCO3_LOW = 22;
const NORMAL_HCO3_HIGH = 26;
const NORMAL_AG = 12;

export function interpretAbg(input: AbgInput): AbgInterpretation {
  const { ph, pco2, hco3 } = input;

  const acidBaseStatus: AbgInterpretation["acidBaseStatus"] =
    ph < NORMAL_PH_LOW ? "asidemia" : ph > NORMAL_PH_HIGH ? "alkalemia" : "normal";

  const lowCo2 = pco2 < NORMAL_PCO2_LOW;
  const highCo2 = pco2 > NORMAL_PCO2_HIGH;
  const lowHco3 = hco3 < NORMAL_HCO3_LOW;
  const highHco3 = hco3 > NORMAL_HCO3_HIGH;

  let primary = "Tidak ada gangguan asam-basa utama";
  let compensation = "Dalam batas normal.";
  let compensationLabel: string | undefined;
  let compensationUnit: string | undefined;
  let compensationDetail: string | undefined;
  let isMixed = false;

  if (acidBaseStatus === "asidemia") {
    if (highCo2 && lowHco3) {
      primary = "Asidosis campuran (respiratorik dan metabolik)";
      isMixed = true;
      compensation = "Kedua komponen menurunkan pH; koreksi keduanya.";
    } else if (highCo2) {
      primary = "Asidosis respiratorik";
      const acute = 24 + 0.1 * (pco2 - 40);
      const chronic = 24 + 0.35 * (pco2 - 40);
      const acuteGap = Math.abs(hco3 - acute);
      const chronicGap = Math.abs(hco3 - chronic);
      const pattern = acuteGap <= chronicGap ? "akut" : "kronik";
      const expected = pattern === "akut" ? acute : chronic;
      compensation = `Kompensasi metabolik ${pattern}: HCO3 diharapkan ${fmt(expected, 1)} mmol/L`;
      if (Math.abs(hco3 - expected) > 2) {
        compensation += " (di luar rentang, pikirkan gangguan tambahan)";
        isMixed = true;
      }
    } else if (lowHco3) {
      primary = "Asidosis metabolik";
      const expectedPco2 = 1.5 * hco3 + 8;
      const expectedLow = expectedPco2 - 2;
      const expectedHigh = expectedPco2 + 2;
      const expectedRange = `${fmt(expectedLow, 1)}–${fmt(expectedHigh, 1)} mmHg`;
      compensationLabel = "Kompensasi yang diharapkan";
      compensation = `${fmt(expectedPco2, 1)} ± 2`;
      compensationUnit = "mmHg";
      if (pco2 > expectedPco2 + 2) {
        compensationDetail = `Rumus Winter memperkirakan rentang pCO₂ ${expectedRange}. pCO₂ aktual ${fmt(pco2, 1)} mmHg berada di atas rentang; pertimbangkan asidosis respiratorik tambahan.`;
        isMixed = true;
      } else if (pco2 < expectedPco2 - 2) {
        compensationDetail = `Rumus Winter memperkirakan rentang pCO₂ ${expectedRange}. pCO₂ aktual ${fmt(pco2, 1)} mmHg berada di bawah rentang; pertimbangkan alkalosis respiratorik tambahan.`;
        isMixed = true;
      } else {
        compensationDetail = `Rumus Winter memperkirakan rentang pCO₂ ${expectedRange}. pCO₂ aktual ${fmt(pco2, 1)} mmHg masih sesuai dengan kompensasi.`;
      }
    } else {
      primary = "Asidemia dengan pCO2 dan HCO3 dalam batas normal";
      compensation = "Periksa ulang nilai; kemungkinan kesalahan pengukuran.";
    }
  } else if (acidBaseStatus === "alkalemia") {
    if (lowCo2 && highHco3) {
      primary = "Alkalosis campuran (respiratorik dan metabolik)";
      isMixed = true;
      compensation = "Kedua komponen menaikkan pH; koreksi keduanya.";
    } else if (lowCo2) {
      primary = "Alkalosis respiratorik";
      const acute = 24 - 0.2 * (40 - pco2);
      const chronic = 24 - 0.4 * (40 - pco2);
      const pattern = Math.abs(hco3 - acute) <= Math.abs(hco3 - chronic) ? "akut" : "kronik";
      const expected = pattern === "akut" ? acute : chronic;
      compensation = `Kompensasi metabolik ${pattern}: HCO3 diharapkan ${fmt(expected, 1)} mmol/L`;
      if (Math.abs(hco3 - expected) > 2) {
        compensation += " (di luar rentang, pikirkan gangguan tambahan)";
        isMixed = true;
      }
    } else if (highHco3) {
      primary = "Alkalosis metabolik";
      const expectedPco2 = 0.7 * (hco3 - 24) + 40;
      compensation = `pCO2 diharapkan ${fmt(expectedPco2, 1)} ± 2 mmHg`;
      if (Math.abs(pco2 - expectedPco2) > 2) {
        compensation += " (di luar rentang, pikirkan gangguan tambahan)";
        isMixed = true;
      }
    } else {
      primary = "Alkalemia dengan pCO2 dan HCO3 dalam batas normal";
      compensation = "Periksa ulang nilai; kemungkinan kesalahan pengukuran.";
    }
  } else if (highCo2 && highHco3) {
    primary = "Asidosis respiratorik kronik terkompensasi penuh";
    compensation = "pH normal dengan pCO2 tinggi dan HCO3 tinggi.";
  } else if (lowCo2 && lowHco3) {
    primary = "Asidosis metabolik kronik terkompensasi penuh atau alkalosis respiratorik kronik";
    compensation = "pH normal dengan pCO2 dan HCO3 rendah; korelasi klinis diperlukan.";
  }

  const result: AbgInterpretation = {
    acidBaseStatus,
    primary,
    compensation,
    compensationLabel,
    compensationUnit,
    compensationDetail,
    isMixed,
  };

  if (typeof input.na === "number" && typeof input.cl === "number") {
    const anionGap = input.na - input.cl - hco3;
    result.anionGap = round(anionGap, 1);
    if (typeof input.albumin === "number") {
      result.correctedAnionGap = round(anionGap + 2.5 * (4 - input.albumin), 1);
    }
    const effectiveAg = result.correctedAnionGap ?? result.anionGap;
    if (effectiveAg > NORMAL_AG && hco3 < 24) {
      const ratio = (effectiveAg - NORMAL_AG) / (24 - hco3);
      result.deltaRatio = round(ratio, 2);
      result.deltaRatioLabel =
        ratio < 0.4
          ? "Curiga asidosis metabolik non-anion-gap dominan (diare, RTA)"
          : ratio < 1
            ? "Campuran: asidosis metabolik AG tinggi + non-AG"
            : ratio <= 2
              ? "Asidosis metabolik AG tinggi saja"
              : "Curiga alkalosis metabolik tambahan atau asidosis respiratorik kronik";
    }
  }

  return result;
}

export function abgToCalcResult(input: AbgInput): CalcResult {
  const { ph, pco2, hco3 } = input;
  if (!(ph > 0) || !(pco2 > 0) || !(hco3 > 0)) {
    return { lines: [{ label: "Masukkan pH, pCO2, dan HCO3", value: "-" }], warnings: ["pH, pCO2, dan HCO3 wajib diisi."] };
  }
  if (ph < 6.5 || ph > 8 || pco2 < 5 || pco2 > 150 || hco3 < 1 || hco3 > 60) {
    return { lines: [], warnings: ["Nilai di luar rentang fisiologis yang wajar; periksa kembali data."] };
  }

  const interpretation = interpretAbg(input);
  const tone: CalcResultLine["tone"] =
    interpretation.acidBaseStatus === "normal" ? "success" : interpretation.isMixed ? "danger" : "warning";

  const lines: CalcResultLine[] = [
    { label: "Status asam-basa", value: interpretation.acidBaseStatus, tone },
    { label: "Gangguan utama", value: interpretation.primary, tone },
    {
      label: interpretation.compensationLabel ?? "Kompensasi",
      value: interpretation.compensation,
      unit: interpretation.compensationUnit,
      detail: interpretation.compensationDetail,
    },
  ];

  if (interpretation.anionGap !== undefined) {
    lines.push({
      label: "Anion gap",
      value: fmt(interpretation.anionGap, 1),
      unit: "mmol/L",
      tone: interpretation.anionGap > NORMAL_AG ? "warning" : "success",
      detail: "Normal 8-12 mmol/L",
    });
  }
  if (interpretation.correctedAnionGap !== undefined) {
    lines.push({ label: "Anion gap terkoreksi albumin", value: fmt(interpretation.correctedAnionGap, 1), unit: "mmol/L" });
  }
  if (interpretation.deltaRatio !== undefined) {
    lines.push({ label: "Delta ratio", value: String(interpretation.deltaRatio), detail: interpretation.deltaRatioLabel });
  }

  return {
    lines,
    note: "Cara baca: asidemia berarti pH berada di bawah 7,35. Gangguan utama menunjuk komponen primer, yaitu perubahan pCO₂ atau HCO₃⁻. Kompensasi adalah respons paru atau ginjal yang membantu mengimbangi perubahan pH. Nilai aktual di luar rentang perkiraan dapat menandakan gangguan tambahan. Cocokkan hasil dengan kondisi klinis.",
  };
}
