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
  it("maps all 45 single-drug choices to exactly one RFSmed entry", () => {
    const sourceChoices: Array<[string, string]> = [
      ["Asam Mefenamat", "asam-mefenamat"], ["Ibuprofen", "ibuprofen"],
      ["Kalium Diclofenac", "diklofenak"], ["Ketorolac", "ketorolak"],
      ["Metamizole Na", "metamizol"], ["Natrium Diclofenac", "diklofenak"],
      ["Paracetamol", "paracetamol"], ["Cetirizine", "setirizin"],
      ["Chlorpheniramine", "klorfeniramin"], ["Dimenhydrinate", "dimenhidrinat"],
      ["Diphenhydramine", "difenhidramin"], ["Promethazine", "difenhidramin-syr"],
      ["Amoxicillin", "amoxicillin"], ["Azithromycin", "azithromycin"],
      ["Cefadroxil", "sefadroksil"], ["Cefixime", "sefiksim"],
      ["Ceftriaxone", "seftriakson"], ["Ciprofloxacin", "siprofloksasin"],
      ["Cotrimoxazole", "kotrimoksazol"], ["Erytromicin", "eritromisin"],
      ["Gentamicin", "gentamisin"], ["Levofloxacin", "levofloksasin"],
      ["Metronidazole", "metronidazol"], ["Acyclovir", "asiklovir"],
      ["Adenosine", "adenosin"], ["Adrenaline", "epinefrin"],
      ["Diazepam (Kejang)", "diazepam"], ["Antasida Doen", "antasida"],
      ["Domperidone", "domperidon"], ["Omeprazole", "omeprazol"],
      ["Ondansetron", "ondansetron"], ["Ranitidine", "ondansetron-anak"],
      ["Sucralfate", "sukralfat"], ["Zinc (Diare)", "zinc-sulfat"],
      ["Dexamethasone", "deksametason"], ["Hydrocortisone", "hidrokortison"],
      ["Methylprednisolone", "metilprednisolon"], ["Prednisolone", "prednisolon-sistemik"],
      ["Diazepam (Oral)", "diazepam"], ["Phenytoin", "fenitoin"],
      ["Sodium Valproate", "asam-valproat"], ["Acetylcysteine", "nac"],
      ["Ambroxol", "ambroksol"], ["Guaifenesin", "guaifenesin"],
      ["Salbutamol", "salbutamol"],
    ];
    expect(sourceChoices).toHaveLength(45);
    for (const [sourceName, slug] of sourceChoices) {
      expect(DRUGS.filter((item) => item.slug === slug), sourceName).toHaveLength(1);
    }
  });
  it("keeps the visible drug count synchronized with the catalog", () => {
    expect(CATALOG_COUNTS.drugs).toBe(DRUGS.length);
  });
  it("converts age-banded cetirizine only within the verified age and indication", () => {
    const drug = find("setirizin");
    const syrup = drug.dosePreparations?.find((item) => item.drugAmount === 5 && item.carrierAmount === 5);
    expect(syrup).toBeDefined();
    const selected = getDoseOptions(drug, "pediatric", 4)[0];
    expect(selected.label).toContain("2–5 tahun");
    const result = calculateDose(drug, { ageYears: 4, doseIndex: selected.index, preparation: syrup });
    expect(result.perDoseMg).toBe(2.5);
    expect(result.preparationPerDoseMin).toBe(2.5);
    const tablet = parseDosePreparations(drug.preparations ?? []).find((item) => item.carrierUnit === "tablet")!;
    expect(calculateDose(drug, { ageYears: 4, doseIndex: selected.index, preparation: tablet }).preparationText).toBeUndefined();
    const chewable = drug.dosePreparations?.find((item) => item.id === "setirizin-kunyah-2.5mg");
    expect(calculateDose(drug, { ageYears: 4, doseIndex: selected.index, preparation: chewable }).preparationPerDoseMin).toBe(1);
    const olderChewable = drug.dosePreparations?.find((item) => item.id === "setirizin-kunyah-5mg");
    expect(calculateDose(drug, { ageYears: 4, doseIndex: selected.index, preparation: olderChewable }).preparationText).toBeUndefined();
    expect(calculateDose(drug, { ageYears: 7, doseIndex: selected.index }).textOnly).toBe(true);
  });

  it("converts verified chlorpheniramine only for ages 6–11 and leaves old mg/kg text uncalculated", () => {
    const drug = find("klorfeniramin");
    expect(drug.doses.find((dose) => dose.text.startsWith("0,35 mg/kg"))?.weightBased).toBeUndefined();
    const selected = getDoseOptions(drug, "pediatric", 8)[0];
    expect(selected.label).toContain("6–11 tahun");
    const syrup = parseDosePreparations(drug.preparations ?? []).find((item) => item.drugAmount === 2 && item.carrierAmount === 5)!;
    expect(calculateDose(drug, { ageYears: 8, doseIndex: selected.index, preparation: syrup }).preparationPerDoseMin).toBe(5);
    expect(getDoseOptions(drug, "pediatric", 4)[0].index).not.toBe(selected.index);
  });

  it("converts guaifenesin age-band ranges into syrup ranges", () => {
    const drug = find("guaifenesin");
    const syrup = parseDosePreparations(drug.preparations ?? []).find((item) => item.drugAmount === 100 && item.carrierAmount === 5)!;
    const younger = getDoseOptions(drug, "pediatric", 4)[0];
    const older = getDoseOptions(drug, "pediatric", 8)[0];
    const first = calculateDose(drug, { ageYears: 4, doseIndex: younger.index, preparation: syrup });
    const second = calculateDose(drug, { ageYears: 8, doseIndex: older.index, preparation: syrup });
    expect([first.preparationPerDoseMin, first.preparationPerDoseMax]).toEqual([2.5, 5]);
    expect([second.preparationPerDoseMin, second.preparationPerDoseMax]).toEqual([5, 10]);
    expect(calculateDose(drug, { ageYears: 1, doseIndex: younger.index }).textOnly).toBe(true);
  });

  it("separates elemental zinc doses before and after six months without guessing syrup strength", () => {
    const drug = find("zinc-sulfat");
    const infant = getDoseOptions(drug, "pediatric", 0.25)[0];
    const child = getDoseOptions(drug, "pediatric", 1)[0];
    expect(calculateDose(drug, { ageYears: 0.25, doseIndex: infant.index }).perDoseMg).toBe(10);
    expect(calculateDose(drug, { ageYears: 1, doseIndex: child.index }).perDoseMg).toBe(20);
    expect(calculateDose(drug, { ageYears: 0.25, doseIndex: child.index }).textOnly).toBe(true);
    expect(drug.doses[child.index].text).toContain("elemental");
  });
  it("checks both age and weight before giving an adolescent domperidone conversion", () => {
    const drug = find("domperidon");
    const index = drug.doses.findIndex((dose) => dose.indication === "Mual dan muntah, usia ≥12 tahun dan BB ≥35 kg");
    expect(index).toBeGreaterThanOrEqual(0);
    const tablet = parseDosePreparations(drug.preparations ?? []).find((item) => item.drugAmount === 10 && item.carrierUnit === "tablet");
    expect(calculateDose(drug, { ageYears: 14, weightKg: 40, doseIndex: index, preparation: tablet }).preparationPerDoseMin).toBe(1);
    expect(calculateDose(drug, { ageYears: 11, weightKg: 40, doseIndex: index }).textOnly).toBe(true);
    expect(calculateDose(drug, { ageYears: 14, weightKg: 30, doseIndex: index }).textOnly).toBe(true);
  });
  it("separates adult and child IV phenytoin loading without maintenance frequency", () => {
    const drug = find("fenitoin");
    const adultIndex = drug.doses.findIndex((dose) => dose.indication === "Status epileptikus, dosis muat IV dewasa");
    const childIndex = drug.doses.findIndex((dose) => dose.indication === "Status epileptikus, dosis muat IV anak");
    const ampoule = parseDosePreparations(drug.preparations ?? []).find((item) => item.drugAmount === 50 && item.carrierAmount === 1)!;
    expect(getDoseOptions(drug, "adult", 30)[0].index).toBe(adultIndex);
    expect(getDoseOptions(drug, "pediatric", 5)[0].index).toBe(childIndex);
    const adult = calculateDose(drug, { ageYears: 30, weightKg: 60, doseIndex: adultIndex, preparation: ampoule });
    const child = calculateDose(drug, { ageYears: 5, weightKg: 20, doseIndex: childIndex, preparation: ampoule });
    expect([adult.perDoseMin, adult.perDoseMax]).toEqual([600, 900]);
    expect([child.perDoseMin, child.perDoseMax]).toEqual([300, 400]);
    expect(child.preparationPerDoseMin).toBe(6);
    expect(child.totalDailyMg).toBeUndefined();
    expect(calculateDose(drug, { ageYears: 0.02, weightKg: 3, doseIndex: childIndex }).textOnly).toBe(true);
  });
  it("uses labeled pediatric IV diazepam first and second doses without rectal substitution", () => {
    const drug = find("diazepam");
    const firstIndex = drug.doses.findIndex((dose) => dose.indication === "Status epileptikus, dosis IV pertama");
    const secondIndex = drug.doses.findIndex((dose) => dose.indication === "Status epileptikus, dosis IV kedua bila perlu");
    expect(firstIndex).toBeGreaterThanOrEqual(0);
    expect(secondIndex).toBeGreaterThanOrEqual(0);
    const injection = drug.dosePreparations?.find((item) => item.id === "diazepam-iv-5mg-ml");
    expect(injection).toBeDefined();
    const first = calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: firstIndex, preparation: injection });
    const second = calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: secondIndex, preparation: injection });
    expect(first.perDoseMg).toBe(4);
    expect(second.perDoseMg).toBe(2);
    expect(first.preparationPerDoseMin).toBe(0.8);
    expect(first.totalDailyMg).toBeUndefined();
    expect(calculateDose(drug, { weightKg: 100, ageYears: 16, doseIndex: firstIndex }).perDoseMg).toBe(8);
    expect(calculateDose(drug, { weightKg: 100, ageYears: 16, doseIndex: secondIndex }).perDoseMg).toBe(4);
    expect(calculateDose(drug, { weightKg: 6, ageYears: 0.1, doseIndex: firstIndex }).textOnly).toBe(true);
    const rectalIndex = drug.doses.findIndex((dose) => dose.population === "pediatric" && dose.route === "Rektal");
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: rectalIndex }).textOnly).toBe(true);
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: firstIndex,
      preparation: { ...injection!, administration: "rectal" } }).preparationText).toBeUndefined();
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: firstIndex,
      preparation: { ...injection!, routes: ["IM"] } }).preparationText).toBeUndefined();
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: firstIndex,
      preparation: { ...injection!, routes: undefined } }).preparationText).toBeUndefined();
  });
  it("withholds unverified legacy calculations for route- or monitoring-sensitive drugs", () => {
    for (const slug of ["gentamisin", "metamizol", "diklofenak"]) {
      const drug = find(slug);
      for (const option of getDoseOptions(drug, "pediatric", 8)) {
        expect(calculateDose(drug, { weightKg: 25, ageYears: 8, doseIndex: option.index }).textOnly).toBe(true);
      }
    }
  });
  it("uses a labeled valproate starting dose only for absence epilepsy and an explicit oral solution", () => {
    const drug = find("asam-valproat");
    const verifiedIndex = drug.doses.findIndex((dose) => dose.indication === "Epilepsi absans, dosis awal oral");
    const legacyIndex = drug.doses.findIndex((dose) => dose.population === "pediatric" && dose.indication !== "Epilepsi absans, dosis awal oral");
    expect(verifiedIndex).toBeGreaterThanOrEqual(0);
    expect(calculateDose(drug, { ageYears: 5, weightKg: 20, doseIndex: legacyIndex }).textOnly).toBe(true);
    const solution = drug.dosePreparations?.find((item) => item.id === "valproat-oral-250mg-5ml");
    const result = calculateDose(drug, { ageYears: 5, weightKg: 20, doseIndex: verifiedIndex, preparation: solution });
    expect(result.totalDailyMg).toBe(300);
    expect(result.perDoseMg).toBeUndefined();
    expect(result.preparationText).toContain("6 mL per hari");
    expect(result.notes.join(" ")).toContain("dibagi");
    expect(calculateDose(drug, { ageYears: 1, weightKg: 10, doseIndex: verifiedIndex }).textOnly).toBe(true);
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
    const preparations = drug.dosePreparations ?? [];
    const standard = preparations.find((item) => item.drugAmount === 15 && item.carrierAmount === 5);
    const forte = preparations.find((item) => item.drugAmount === 30 && item.carrierAmount === 5);
    expect(standard).toBeDefined();
    expect(forte).toBeDefined();
    const result = calculateDose(drug, { ageYears: 5, doseIndex: index, preparation: standard });
    expect(result.textOnly).toBe(false);
    expect(result.perDoseMg).toBe(7.5);
    expect(result.preparationPerDoseMin).toBe(2.5);
    expect(calculateDose(drug, { ageYears: 5, doseIndex: index, preparation: forte }).preparationPerDoseMin).toBe(1.25);
    const tablet = parseDosePreparations(drug.preparations ?? []).find((item) => item.carrierUnit === "tablet")!;
    expect(calculateDose(drug, { ageYears: 5, doseIndex: index, preparation: tablet }).preparationText).toBeUndefined();
    expect(calculateDose(drug, { ageYears: 1, doseIndex: index, preparation: standard }).textOnly).toBe(true);
    const adultTablet = preparations.find((item) => item.carrierUnit === "tablet")!;
    const adultIndex = getDoseOptions(drug, "adult", 30)[0].index;
    const adolescentIndex = getDoseOptions(drug, "pediatric", 15)[0].index;
    expect(calculateDose(drug, { ageYears: 30, doseIndex: adultIndex, preparation: adultTablet }).preparationPerDoseMin).toBe(1);
    expect(calculateDose(drug, { ageYears: 15, doseIndex: adolescentIndex, preparation: adultTablet }).preparationText).toBeUndefined();
    expect(calculateDose(drug, { ageYears: 15, doseIndex: adolescentIndex, preparation: standard }).preparationPerDoseMin).toBe(10);
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
    expect(drug.curatedPreparationsOnly).toBe(true);
    const ambiguous = parseDosePreparations(drug.preparations ?? [])[0];
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: index, preparation: ambiguous }).preparationText).toBeUndefined();
    expect(calculateDose(drug, { weightKg: 20, ageYears: 5, doseIndex: index,
      preparation: { ...preparation!, drugAmount: 200 } }).preparationText).toBeUndefined();
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
    const oralSolution = drug.dosePreparations?.find((item) => item.drugAmount === 6.25 && item.carrierAmount === 5);
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
