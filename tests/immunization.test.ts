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
    const hb0 = out.find((a) => a.vaccineId === "hb0")!;
    // birth dose window (0 months) has closed → overdue
    expect(hb0.doses[0].status.state).toBe("overdue");
    const bcg = out.find((a) => a.vaccineId === "bcg")!;
    expect(bcg.doses[0].status.state).toBe("due");
    const summary = immunizationSummary(out);
    expect(summary.due).toBeGreaterThanOrEqual(1);
    expect(summary.overdue).toBeGreaterThanOrEqual(2); // HB-0 + Polio 0
  });

  it("marks a 4-month-old with completed birth doses as due for 2-4mo vaccines", () => {
    const dob = atAgeMonths(4);
    const out = assessImmunization({
      schedule: immunizationSchedule,
      dob,
      today: new Date("2025-01-15"),
      received: [
        { vaccineId: "hb0", doseNumber: 1, date: "2024-09-15" },
        { vaccineId: "bcg", doseNumber: 1, date: "2024-09-20" },
        { vaccineId: "polio0", doseNumber: 1, date: "2024-09-15" },
        { vaccineId: "dpt", doseNumber: 1, date: "2024-11-15" },
        { vaccineId: "polio", doseNumber: 1, date: "2024-11-15" },
        { vaccineId: "hb", doseNumber: 2, date: "2024-11-15" },
      ],
    });
    const dpt = out.find((a) => a.vaccineId === "dpt")!;
    expect(dpt.doses[0].status.state).toBe("done");
    expect(dpt.doses[1].status.state).toBe("due");
  });

  it("marks a 2-year-old missing doses as overdue", () => {
    const dob = atAgeMonths(24);
    const out = assessImmunization({
      schedule: immunizationSchedule,
      dob,
      today: new Date("2025-01-15"),
      received: [{ vaccineId: "hb0", doseNumber: 1, date: "2023-01-15" }],
    });
    const mr = out.find((a) => a.vaccineId === "measles")!;
    expect(mr.doses[0].status.state).toBe("overdue");
  });

  it("marks far-future doses as upcoming", () => {
    const dob = atAgeMonths(0.5);
    const out = assessImmunization({ schedule: immunizationSchedule, dob, today: new Date("2025-01-15"), received: [] });
    const hpv = out.find((a) => a.vaccineId === "hpv")!;
    expect(hpv.doses[0].status.state).toBe("upcoming");
  });

  it("marks a 1-year-old as due for MR dose 1 at 9 months", () => {
    const dob = atAgeMonths(12);
    const out = assessImmunization({ schedule: immunizationSchedule, dob, today: new Date("2025-01-15"), received: [] });
    const mr = out.find((a) => a.vaccineId === "measles")!;
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