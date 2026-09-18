import { describe, expect, it } from "vitest";
import { calculateDose, getDoseOptions, parseDosePreparations, preparationMatchesRoute } from "@/lib/calc/drugs";
import { DRUGS } from "@/lib/data/drugs";
import { CATALOG_COUNTS } from "@/lib/catalog-counts";

function find(slug: string) {
  const item = DRUGS.find((drug) => drug.slug === slug);
  if (!item) throw new Error(`Obat tidak ada: ${slug}`);
  return item;
}

describe("verified Jaga Mate enrichments", () => {
  it("keeps the visible drug count synchronized with the catalog", () => {
    expect(CATALOG_COUNTS.drugs).toBe(DRUGS.length);
  });
  it("adds systemic prednisolone separately from ophthalmic prednisolone", () => {
    const drug = find("prednisolon-sistemik");
    expect(drug.genericName).toBe("Prednisolon oral");
    expect(drug.doses[0].source?.url).toContain("ginasthma.org");
    const index = getDoseOptions(drug, "pediatric", 5)[0]?.index;
    expect(getDoseOptions(drug, "pediatric", 5)).toHaveLength(1);
    const result = calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: index });
    expect(result.totalDailyMin).toBe(20);
    expect(result.totalDailyMax).toBe(30);
    const older = getDoseOptions(drug, "pediatric", 10)[0]?.index;
    expect(calculateDose(drug, { weightKg: 50, ageYears: 10, doseIndex: older }).totalDailyMax).toBe(40);
    const infant = getDoseOptions(drug, "pediatric", 1)[0]?.index;
    expect(calculateDose(drug, { weightKg: 15, ageYears: 1, doseIndex: infant }).totalDailyMax).toBe(20);
    expect(getDoseOptions(drug, "pediatric", 12)).toHaveLength(0);
    expect(calculateDose(drug, { weightKg: 20, doseIndex: index }).textOnly).toBe(true);
    expect(find("prednisolon-mata").genericName).toContain("Mata");
  });

  it("converts age-specific Ambroksol 7.5 mg to the selected syrup without patient weight", () => {
    const drug = find("ambroksol");
    expect(getDoseOptions(drug)[0].index).toBe(0);
    const index = drug.doses.findIndex((dose) => dose.indication === "Mukolitik, usia 2–5 tahun");
    expect(index).toBeGreaterThanOrEqual(0);
    expect(getDoseOptions(drug, "pediatric", 5)[0].index).toBe(index);
    expect(drug.doses[index].source?.url).toContain("cima.aemps.es");
    const preparations = parseDosePreparations(drug.preparations ?? []);
    const standard = preparations.find((item) => item.drugAmount === 15 && item.carrierAmount === 5);
    const forte = preparations.find((item) => item.drugAmount === 30 && item.carrierAmount === 5);
    expect(standard).toBeDefined();
    expect(forte).toBeDefined();
    const result = calculateDose(drug, { ageYears: 5, doseIndex: index, preparation: standard });
    expect(result.textOnly).toBe(false);
    expect(result.perDoseMg).toBe(7.5);
    expect(result.preparationPerDoseMin).toBe(2.5);
    expect(calculateDose(drug, { ageYears: 5, doseIndex: index, preparation: forte }).preparationPerDoseMin).toBe(1.25);
    expect(calculateDose(drug, { ageYears: 1, doseIndex: index, preparation: standard }).textOnly).toBe(true);
  });

  it("adds labeled 160 mg/5 mL oral paracetamol without losing old preparations", () => {
    const drug = find("paracetamol");
    const preparations = parseDosePreparations(drug.preparations ?? []);
    const syrup = preparations.find((item) => item.drugAmount === 160 && item.carrierAmount === 5);
    expect(syrup).toBeDefined();
    expect(preparationMatchesRoute(syrup!, "Oral/rektal")).toBe(true);
    expect(preparations.some((item) => item.drugAmount === 120 && item.carrierAmount === 5)).toBe(true);
  });

  it("separates pediatric ceftriaxone meningitis at 100 mg/kg/day capped at 4 g", () => {
    const drug = find("seftriakson");
    const index = drug.doses.findIndex((dose) => dose.indication === "Meningitis bakteri");
    expect(index).toBeGreaterThanOrEqual(0);
    expect(drug.doses[index].source?.url).toContain("dailymed.nlm.nih.gov");
    const result = calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: index });
    expect(result.totalDailyMg).toBe(2000);
    const capped = calculateDose(drug, { weightKg: 50, ageYears: 12, doseIndex: index });
    expect(capped.totalDailyMg).toBe(4000);
  });

  it("separates initial and repeat pediatric adenosine doses with distinct caps", () => {
    const drug = find("adenosin");
    const first = drug.doses.findIndex((dose) => dose.indication === "SVT, dosis awal");
    const second = drug.doses.findIndex((dose) => dose.indication === "SVT, dosis ulang");
    expect(first).toBeGreaterThanOrEqual(0);
    expect(second).toBeGreaterThanOrEqual(0);
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: first }).perDoseMg).toBe(2);
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: second }).perDoseMg).toBe(4);
    expect(calculateDose(drug, { weightKg: 100, ageYears: 10, doseIndex: first }).perDoseMg).toBe(6);
    expect(calculateDose(drug, { weightKg: 100, ageYears: 10, doseIndex: second }).perDoseMg).toBe(12);
  });

  it("converts cotrimoxazole using only the trimethoprim component for a verified indication", () => {
    const drug = find("kotrimoksazol");
    const index = drug.doses.findIndex((dose) => dose.indication === "ISK atau otitis media akut, usia ≥2 bulan");
    expect(index).toBeGreaterThanOrEqual(0);
    const preparation = drug.dosePreparations?.find((item) => item.id === "tmp-40mg-smx-200mg-per-5ml");
    expect(preparation).toBeDefined();
    const result = calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: index, preparation });
    expect(result.perDoseMg).toBe(80);
    expect(result.totalDailyMg).toBe(160);
    expect(result.preparationPerDoseMin).toBe(10);
    expect(result.preparationText).toContain("TMP");
    expect(calculateDose(drug, { weightKg: 5, ageYears: 1 / 12, doseIndex: index, preparation }).textOnly).toBe(true);
  });

  it("shows a four-dose erythromycin ethylsuccinate regimen and oral suspension conversion", () => {
    const drug = find("eritromisin");
    const index = drug.doses.findIndex((dose) => dose.indication === "Infeksi ringan sampai sedang, eritromisin etilsuksinat");
    expect(index).toBeGreaterThanOrEqual(0);
    const preparation = parseDosePreparations(drug.preparations ?? [])
      .find((item) => item.drugAmount === 200 && item.carrierAmount === 5 && item.administration === "oral");
    expect(preparation).toBeDefined();
    const result = calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: index, preparation });
    expect(result.perDoseMin).toBe(150);
    expect(result.perDoseMax).toBe(250);
    expect(result.preparationPerDoseMin).toBeCloseTo(3.75);
    expect(result.preparationPerDoseMax).toBeCloseTo(6.25);
    expect(drug.doses[index].source?.url).toContain("dailymed.nlm.nih.gov");
  });

  it("calculates labeled pediatric salbutamol nebulization only with an inhaled concentration", () => {
    const drug = find("salbutamol");
    const index = drug.doses.findIndex((dose) => dose.indication === "Bronkospasme, nebulisasi usia 2–12 tahun");
    expect(index).toBeGreaterThanOrEqual(0);
    const concentrate = drug.dosePreparations?.find((item) => item.id === "salbutamol-neb-2.5mg-0.5ml");
    expect(concentrate?.administration).toBe("inhalation");
    const result = calculateDose(drug, { weightKg: 10, ageYears: 5, doseIndex: index, preparation: concentrate });
    expect(result.perDoseMin).toBe(1);
    expect(result.perDoseMax).toBeCloseTo(1.5);
    expect(result.preparationPerDoseMin).toBeCloseTo(0.2);
    expect(result.preparationPerDoseMax).toBeCloseTo(0.3);
    expect(drug.doses[index].text).toContain("encerkan");
    expect(calculateDose(drug, { weightKg: 10, ageYears: 1, doseIndex: index }).textOnly).toBe(true);
  });

  it("never calculates legacy promethazine dosing below age two", () => {
    const drug = find("difenhidramin-syr");
    expect(drug.genericName).toBe("Prometazin");
    expect(getDoseOptions(drug, "pediatric", 1)).toHaveLength(0);
    const legacyIndex = drug.doses.findIndex((dose) => dose.text.includes("0,25-0,5 mg/kg"));
    expect(legacyIndex).toBeGreaterThanOrEqual(0);
    expect(calculateDose(drug, { weightKg: 10, ageYears: 1, doseIndex: legacyIndex }).textOnly).toBe(true);
    const verifiedIndex = drug.doses.findIndex((dose) => dose.indication === "Alergi, dosis awal usia ≥2 tahun");
    expect(verifiedIndex).toBeGreaterThanOrEqual(0);
    const oralSolution = parseDosePreparations(drug.preparations ?? [])
      .find((item) => item.drugAmount === 6.25 && item.carrierAmount === 5);
    expect(oralSolution).toBeDefined();
    const result = calculateDose(drug, { ageYears: 5, doseIndex: verifiedIndex, preparation: oralSolution });
    expect(result.perDoseMg).toBe(6.25);
    expect(result.preparationPerDoseMin).toBe(5);
  });

  it("separates pediatric IM anaphylaxis epinephrine from cardiac-arrest IV dosing", () => {
    const drug = find("epinefrin");
    const index = drug.doses.findIndex((dose) => dose.indication === "Anafilaksis anak, IM 1 mg/mL");
    expect(index).toBeGreaterThanOrEqual(0);
    const preparation = drug.dosePreparations?.find((item) => item.id === "epinefrin-im-1mg-1ml");
    expect(preparation?.administration).toBe("parenteral");
    const result = calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: index, preparation });
    expect(result.perDoseMg).toBeCloseTo(0.2);
    expect(result.preparationPerDoseMin).toBeCloseTo(0.2);
    const capped = calculateDose(drug, { weightKg: 40, ageYears: 10, doseIndex: index, preparation });
    expect(capped.perDoseMg).toBeCloseTo(0.3);
    expect(capped.maxWarnings.length).toBeGreaterThan(0);
    expect(drug.doses[index].source?.url).toContain("pom.go.id");
    const unsafeManual = { ...preparation!, id: "manual", label: "Konsentrasi manual 1 mg/mL" };
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: index, preparation: unsafeManual }).preparationText).toBeUndefined();
  });

  it("keeps pediatric ciprofloxacin oral and IV cUTI regimens and concentrations separate", () => {
    const drug = find("siprofloksasin");
    const oral = drug.doses.findIndex((dose) => dose.indication === "ISK komplikata / pielonefritis, oral");
    const iv = drug.doses.findIndex((dose) => dose.indication === "ISK komplikata / pielonefritis, IV");
    expect(oral).toBeGreaterThanOrEqual(0);
    expect(iv).toBeGreaterThanOrEqual(0);
    const syrup = parseDosePreparations(drug.preparations ?? []).find((item) => item.drugAmount === 250 && item.carrierAmount === 5);
    const infusion = parseDosePreparations(drug.preparations ?? []).find((item) => item.drugAmount === 200 && item.carrierAmount === 100);
    expect(syrup?.administration).toBe("oral");
    expect(infusion?.administration).toBe("parenteral");
    const oralResult = calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: oral, preparation: syrup });
    expect(oralResult.perDoseMin).toBe(200);
    expect(oralResult.perDoseMax).toBe(400);
    expect(oralResult.preparationPerDoseMin).toBe(4);
    expect(oralResult.preparationPerDoseMax).toBe(8);
    const ivResult = calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: iv, preparation: infusion });
    expect(ivResult.perDoseMin).toBe(120);
    expect(ivResult.perDoseMax).toBe(200);
    expect(ivResult.preparationPerDoseMin).toBe(60);
    expect(ivResult.preparationPerDoseMax).toBe(100);
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: iv, preparation: syrup }).preparationText).toBeUndefined();
    expect(calculateDose(drug, { weightKg: 10, ageYears: 0.5, doseIndex: oral }).textOnly).toBe(true);
  });
});
