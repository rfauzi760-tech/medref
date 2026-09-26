import { describe, expect, it } from "vitest";
import { assessImmunization, immunizationSummary } from "@/lib/calc/immunization";
import { immunizationSchedule } from "@/lib/data/immunization";

function atAgeMonths(months: number, today = new Date("2025-01-15")): Date {
  return new Date(today.getTime() - months * 30.4375 * 86400000);
}

describe("immunization status engine", () => {
  it("flags birth doses (window closed) as overdue and BCG as due at 2 weeks", () => {
    const dob = atAgeMonths(0.5); // 2 weeks old
    const out = assessImmunization({ schedule: immunizationSchedule, dob, today: new Date("2025-01-15"), received: [] });
    const hb = out.find((a) => a.vaccineId === "hb")!;
    // birth dose window (0 months) has closed → overdue
    expect(hb.doses[0].status.state).toBe("overdue");
    const polio = out.find((a) => a.vaccineId === "polio")!;
    expect(polio.doses[0].status.state).toBe("overdue");
    const bcg = out.find((a) => a.vaccineId === "bcg")!;
    expect(bcg.doses[0].status.state).toBe("due");
    const summary = immunizationSummary(out);
    expect(summary.due).toBeGreaterThanOrEqual(1);
    expect(summary.overdue).toBeGreaterThanOrEqual(2); // Hep B-0 + Polio-0
  });

  it("marks a 4-month-old with completed birth doses as due for the next DTP dose", () => {
    const dob = atAgeMonths(4);
    const out = assessImmunization({
      schedule: immunizationSchedule,
      dob,
      today: new Date("2025-01-15"),
      received: [
        { vaccineId: "hb", doseNumber: 0, date: "2024-09-15" },
        { vaccineId: "polio", doseNumber: 0, date: "2024-09-15" },
        { vaccineId: "bcg", doseNumber: 1, date: "2024-09-20" },
        { vaccineId: "dtp", doseNumber: 1, date: "2024-11-15" },
        { vaccineId: "polio", doseNumber: 1, date: "2024-11-15" },
        { vaccineId: "hb", doseNumber: 1, date: "2024-11-15" },
      ],
    });
    const dtp = out.find((a) => a.vaccineId === "dtp")!;
    expect(dtp.doses[0].status.state).toBe("done");
    expect(dtp.doses[1].status.state).toBe("due");
  });

  it("marks a 2-year-old missing doses as overdue", () => {
    const dob = atAgeMonths(24);
    const out = assessImmunization({
      schedule: immunizationSchedule,
      dob,
      today: new Date("2025-01-15"),
      received: [{ vaccineId: "hb", doseNumber: 0, date: "2023-01-15" }],
    });
    const mr = out.find((a) => a.vaccineId === "mr")!;
    expect(mr.doses[0].status.state).toBe("overdue");
  });

  it("marks far-future doses as upcoming", () => {
    const dob = atAgeMonths(0.5);
    const out = assessImmunization({ schedule: immunizationSchedule, dob, today: new Date("2025-01-15"), received: [] });
    const hpv = out.find((a) => a.vaccineId === "hpv")!;
    expect(hpv.doses[0].status.state).toBe("upcoming");
  });

  it("marks a 1-year-old as overdue for MR dose 1 at 9 months", () => {
    const dob = atAgeMonths(12);
    const out = assessImmunization({ schedule: immunizationSchedule, dob, today: new Date("2025-01-15"), received: [] });
    const mr = out.find((a) => a.vaccineId === "mr")!;
    expect(mr.doses[0].status.state).toBe("overdue"); // due at 9mo, now 12mo
  });

  it("counts summary correctly", () => {
    const dob = atAgeMonths(0.5);
    const out = assessImmunization({ schedule: immunizationSchedule, dob, today: new Date("2025-01-15"), received: [] });
    const s = immunizationSummary(out);
    expect(s.done + s.due + s.upcoming + s.overdue).toBe(
      immunizationSchedule.vaccines.reduce((n, v) => n + v.doses.length, 0),
    );
  });
});

describe("IDAI 2024 schedule data", () => {
  const byId = (id: string) => {
    const vaccine = immunizationSchedule.vaccines.find((v) => v.id === id);
    expect(vaccine, `vaccine ${id} missing`).toBeDefined();
    return vaccine!;
  };
  const ages = (id: string) => byId(id).doses.map((d) => d.dueAgeMonths);

  it("covers every vaccine row from the IDAI 2024 chart", () => {
    expect(immunizationSchedule.vaccines.map((v) => v.id)).toEqual([
      "hb",
      "polio",
      "bcg",
      "dtp",
      "hib",
      "pcv",
      "rota",
      "influenza",
      "mr",
      "je",
      "varicella",
      "hepa",
      "tifoid",
      "dengue",
      "hpv",
    ]);
  });

  it("follows the chart's dose ages for the core series", () => {
    expect(ages("hb")).toEqual([0, 1, 2, 3, 18]);
    expect(ages("polio")).toEqual([0, 1, 2, 3, 18]);
    expect(ages("bcg")).toEqual([0]);
    expect(ages("dtp")).toEqual([2, 3, 4, 18, 60, 72]);
    expect(ages("hib")).toEqual([2, 3, 4, 18]);
    expect(ages("pcv")).toEqual([2, 4, 6, 12]);
    expect(ages("rota")).toEqual([2, 4, 6]);
    expect(ages("mr")).toEqual([9, 18, 60]);
    expect(ages("je")).toEqual([9, 24]);
    expect(ages("hpv")).toEqual([132, 144]);
  });

  it("keeps every dose window ordered around its due age", () => {
    for (const vaccine of immunizationSchedule.vaccines) {
      for (const dose of vaccine.doses) {
        const start = dose.windowStart ?? dose.dueAgeMonths;
        const end = dose.windowEnd ?? dose.dueAgeMonths;
        expect(start, `${vaccine.id} dose ${dose.doseNumber}`).toBeLessThanOrEqual(end);
        expect(start, `${vaccine.id} dose ${dose.doseNumber}`).toBeLessThanOrEqual(dose.dueAgeMonths);
      }
    }
  });
});
