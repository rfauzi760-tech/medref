import type { ImmunizationSchedule, VaccineDose, VaccineStatus } from "@/lib/types";

/**
 * Immunization status engine.
 * Given DOB + received doses, compute due / upcoming / overdue per vaccine.
 * Pure date logic over structured schedule data - unit-tested.
 */

export interface ReceivedDose {
  vaccineId: string;
  doseNumber: number;
  /** ISO date string */
  date?: string;
}

export interface ImmunizationInput {
  schedule: ImmunizationSchedule;
  dob: Date;
  today?: Date;
  received: ReceivedDose[];
}

export interface ImmunizationAssessment {
  vaccineId: string;
  vaccineName: string;
  shortName: string;
  doses: {
    doseNumber: number;
    dueAgeMonths: number;
    label: string;
    status: VaccineStatus;
    /** recommended (window) date range */
    dueStart?: string;
    dueEnd?: string;
    receivedDate?: string;
  }[];
}

const MONTH_MS = 30.4375 * 86400000;

function addMonths(d: Date, months: number): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + Math.round(months));
  return out;
}

export function assessImmunization(inp: ImmunizationInput): ImmunizationAssessment[] {
  const today = inp.today ?? new Date();
  const ageMonths = (today.getTime() - inp.dob.getTime()) / MONTH_MS;
  const received = inp.received;
  const out: ImmunizationAssessment[] = [];

  for (const vaccine of inp.schedule.vaccines) {
    const doseRows = vaccine.doses.map((d: VaccineDose) => {
      const got = received.find((r) => r.vaccineId === vaccine.id && r.doseNumber === d.doseNumber);
      const status: VaccineStatus = (() => {
        if (got?.date) return { state: "done" };
        if (got) return { state: "done" }; // marked received without date
        const dueDate = addMonths(inp.dob, d.dueAgeMonths);
        const windowStart = d.windowStart !== undefined ? addMonths(inp.dob, d.windowStart) : addMonths(inp.dob, Math.max(0, d.dueAgeMonths - 1));
        const windowEnd = d.windowEnd !== undefined ? addMonths(inp.dob, d.windowEnd) : addMonths(inp.dob, d.dueAgeMonths + 1);
        if (ageMonths < d.dueAgeMonths - 1) return { state: "upcoming", dueAgeMonths: d.dueAgeMonths };
        if (ageMonths >= d.dueAgeMonths && today > windowEnd) return { state: "overdue", dueAgeMonths: d.dueAgeMonths };
        if (ageMonths >= d.dueAgeMonths - 1) return { state: "due", dueAgeMonths: d.dueAgeMonths };
        return { state: "upcoming", dueAgeMonths: d.dueAgeMonths };
      })();
      return {
        doseNumber: d.doseNumber,
        dueAgeMonths: d.dueAgeMonths,
        label: d.label,
        status,
        dueStart: windowStartIso(inp.dob, d),
        dueEnd: windowEndIso(inp.dob, d),
        receivedDate: got?.date,
      };
    });
    out.push({
      vaccineId: vaccine.id,
      vaccineName: vaccine.name,
      shortName: vaccine.shortName,
      doses: doseRows,
    });
  }
  return out;
}

function windowStartIso(dob: Date, d: VaccineDose): string {
  return addMonths(dob, d.windowStart ?? Math.max(0, d.dueAgeMonths - 1)).toISOString().slice(0, 10);
}

function windowEndIso(dob: Date, d: VaccineDose): string {
  return addMonths(dob, d.windowEnd ?? d.dueAgeMonths + 1).toISOString().slice(0, 10);
}

export function immunizationSummary(assessments: ImmunizationAssessment[]): {
  done: number;
  due: number;
  upcoming: number;
  overdue: number;
} {
  const s = { done: 0, due: 0, upcoming: 0, overdue: 0 };
  for (const a of assessments) {
    for (const d of a.doses) {
      if (d.status.state === "done") s.done++;
      else if (d.status.state === "due") s.due++;
      else if (d.status.state === "upcoming") s.upcoming++;
      else if (d.status.state === "overdue") s.overdue++;
    }
  }
  return s;
}