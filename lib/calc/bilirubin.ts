export interface BilirubinInput {
  gestationalAgeWeeks: number;
  ageHours: number;
  hasAdditionalRisk: boolean;
  tsb?: number;
}

export interface BilirubinResult {
  phototherapy: number;
  escalation: number;
  exchange: number;
  differenceFromPhototherapy?: number;
  action: "di bawah ambang" | "pantau" | "fototerapi" | "eskalasi" | "transfusi tukar";
}

const ages = [1, 24, 48, 72, 96, 168, 336];
const noRiskPhoto: Record<number, number[]> = {
  35: [6.4, 10.6, 14.2, 16.8, 18.6, 18.9, 19.6],
  36: [6.9, 11.2, 14.8, 17.5, 19.3, 19.6, 20.4],
  37: [7.4, 11.7, 15.4, 18.1, 20.0, 20.4, 21.1],
  38: [7.9, 12.3, 16.0, 18.8, 20.7, 21.1, 21.8],
  39: [8.4, 12.8, 16.6, 19.5, 21.5, 21.8, 21.8],
  40: [8.9, 13.3, 17.0, 19.8, 21.8, 21.8, 21.8],
};
const riskPhoto: Record<number, number[]> = {
  35: [4.9, 8.9, 12.2, 14.8, 16.1, 16.8, 17.5],
  36: [5.4, 9.4, 12.8, 15.4, 17.0, 17.4, 18.2],
  37: [5.9, 10.0, 13.5, 16.1, 17.9, 18.2, 18.2],
  38: [6.4, 10.5, 14.0, 16.6, 18.2, 18.2, 18.2],
  39: [6.4, 10.5, 14.0, 16.6, 18.2, 18.2, 18.2],
  40: [6.4, 10.5, 14.0, 16.6, 18.2, 18.2, 18.2],
};
const noRiskExchange: Record<number, number[]> = {
  35: [15.0, 18.6, 21.1, 22.9, 24.0, 24.5, 25.0],
  36: [16.0, 19.1, 21.7, 23.5, 24.6, 25.1, 25.6],
  37: [17.0, 20.3, 22.7, 24.5, 25.7, 26.0, 26.3],
  38: [18.0, 21.4, 24.0, 25.9, 27.0, 27.0, 27.0],
  39: [18.0, 21.4, 24.0, 25.9, 27.0, 27.0, 27.0],
  40: [18.0, 21.4, 24.0, 25.9, 27.0, 27.0, 27.0],
};
const riskExchange: Record<number, number[]> = {
  35: [12.5, 16.0, 18.5, 20.3, 21.5, 22.0, 22.5],
  36: [13.5, 17.0, 19.4, 21.2, 22.3, 22.8, 23.3],
  37: [14.5, 17.9, 20.4, 22.2, 23.3, 23.8, 24.3],
  38: [15.2, 18.2, 20.1, 22.0, 23.5, 24.0, 24.5],
  39: [15.2, 18.2, 20.1, 22.0, 23.5, 24.0, 24.5],
  40: [15.2, 18.2, 20.1, 22.0, 23.5, 24.0, 24.5],
};

function interpolate(values: number[], hour: number) {
  const upper = ages.findIndex((age) => age >= hour);
  if (upper <= 0) return values[0];
  const lower = upper - 1;
  const ratio = (hour - ages[lower]) / (ages[upper] - ages[lower]);
  return Math.round((values[lower] + ratio * (values[upper] - values[lower])) * 10) / 10;
}

export function calculateBilirubinThreshold(input: BilirubinInput): BilirubinResult {
  const ga = Math.min(40, Math.trunc(input.gestationalAgeWeeks));
  if (ga < 35 || input.ageHours < 1 || input.ageHours > 336) throw new RangeError("Input di luar cakupan AAP 2022");
  const photo = interpolate((input.hasAdditionalRisk ? riskPhoto : noRiskPhoto)[ga], input.ageHours);
  const exchange = interpolate((input.hasAdditionalRisk ? riskExchange : noRiskExchange)[ga], input.ageHours);
  const escalation = Math.round((exchange - 2) * 10) / 10;
  const tsb = input.tsb;
  const difference = tsb === undefined ? undefined : Math.round((photo - tsb) * 10) / 10;
  const action = tsb === undefined ? "di bawah ambang" : tsb >= exchange ? "transfusi tukar" : tsb >= escalation ? "eskalasi" : tsb >= photo ? "fototerapi" : photo - tsb <= 3.4 ? "pantau" : "di bawah ambang";
  return { phototherapy: photo, escalation, exchange, differenceFromPhototherapy: difference, action };
}
