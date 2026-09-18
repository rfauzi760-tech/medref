import { describe, expect, it } from "vitest";
import { calculateDose, getDoseOptions, parseDosePreparations, preparationMatchesRoute } from "@/lib/calc/drugs";
import { DRUGS } from "@/lib/data/drugs";

function find(slug: string) {
  const item = DRUGS.find((drug) => drug.slug === slug);
  if (!item) throw new Error(`Obat tidak ada: ${slug}`);
  return item;
}

describe("verified Jaga Mate enrichments", () => {
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
});
