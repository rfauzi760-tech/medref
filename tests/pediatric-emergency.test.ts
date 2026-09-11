import { describe, expect, it } from "vitest";
import {
  airwayForAge,
  estimatePediatricWeight,
  lmaSizeForWeight,
  lowSystolicThreshold,
  resuscitationForWeight,
} from "@/lib/calc/pediatric-emergency";

describe("kalkulator resusitasi anak", () => {
  it("mengutamakan berat badan aktual", () => {
    const result = estimatePediatricWeight({ actualWeightKg: 10, lengthCm: 85, macCm: 14 });
    expect(result.computeWeightKg).toBe(10);
    expect(result.weightSource).toBe("actual");
    expect(result.habitusScore).toBe(2);
  });

  it("menghitung TBW dari panjang dan lingkar lengan", () => {
    const result = estimatePediatricWeight({ lengthCm: 85, macCm: 14 });
    expect(result.computeWeightKg).toBe(11);
    expect(result.ibwKg).toBe(12);
    expect(result.habitusScore).toBe(2);
  });

  it("menggunakan IBW jika lingkar lengan tidak tersedia", () => {
    const result = estimatePediatricWeight({ lengthCm: 85 });
    expect(result.computeWeightKg).toBe(12);
    expect(result.weightSource).toBe("IBW");
    expect(result.flags).toContain("NO_MAC_FELL_BACK_TO_IBW");
  });

  it("menghasilkan ukuran jalan napas untuk usia dua tahun", () => {
    const airway = airwayForAge(2);
    expect(airway.cuffed).toBe("4,0");
    expect(airway.uncuffed).toBe("4,5");
    expect(airway.depth).toBe("13,0");
    expect(airway.opa).toContain("Size 1");
  });

  it("menghasilkan dosis PALS untuk berat 10 kg", () => {
    expect(resuscitationForWeight(10)).toMatchObject({
      epinephrineMg: 0.1,
      epinephrineMl1To10000: 1,
      defibrillationFirstJ: 20,
      defibrillationSecondJ: 40,
      amiodaroneMg: 50,
      dextroseD10Ml: 50,
    });
  });

  it("menerapkan batas dosis dan ambang tekanan darah", () => {
    expect(resuscitationForWeight(80).epinephrineMg).toBe(0.8);
    expect(resuscitationForWeight(80).amiodaroneMg).toBe(300);
    expect(lmaSizeForWeight(10)).toBe("2");
    expect(lowSystolicThreshold(2)).toBe(74);
    expect(lowSystolicThreshold(12)).toBe(90);
  });
});
