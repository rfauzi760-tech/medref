import type { ClinicalSource } from "@/lib/types";

/**
 * Time-critical emergency protocols with their published time targets.
 *
 * Targets are the widely cited international benchmarks for each pathway.
 * They are shown as countdown references only: the timer does not modify
 * clinical care and local protocol always takes precedence.
 */

export interface ProtocolMilestone {
  label: string;
  targetMinutes: number;
}

export interface EmergencyProtocol {
  id: string;
  name: string;
  description: string;
  milestones: ProtocolMilestone[];
  source: ClinicalSource;
}

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: "code-stroke",
    name: "Code Stroke",
    description: "Penargetan waktu dari kedatangan sampai pencitraan dan trombolisis pada stroke iskemik akut.",
    milestones: [
      { label: "Triase dan penilaian awal", targetMinutes: 10 },
      { label: "Non-contrast CT kepala selesai", targetMinutes: 25 },
      { label: "Keputusan trombolisis IV", targetMinutes: 45 },
      { label: "Trombolisis IV diberikan (door-to-needle)", targetMinutes: 60 },
      { label: "Puncture untuk trombektomi (door-to-groin)", targetMinutes: 90 },
    ],
    source: { org: "AHA/ASA", title: "Guidelines for the Early Management of Patients With Acute Ischemic Stroke", year: 2019 },
  },
  {
    id: "stemi-pci",
    name: "STEMI - Primary PCI",
    description: "Door-to-balloon untuk reperfusi mekanik pada STEMI.",
    milestones: [
      { label: "EKG 12 sadapan selesai", targetMinutes: 10 },
      { label: "Aktivasi cath lab", targetMinutes: 30 },
      { label: "Balon pertama (door-to-balloon)", targetMinutes: 90 },
      { label: "Door-to-balloon bila transfer antar fasilitas", targetMinutes: 120 },
    ],
    source: { org: "ACC/AHA", title: "STEMI management guidelines (reperfusion time targets)", year: 2013 },
  },
  {
    id: "stemi-fibrinolisis",
    name: "STEMI - Fibrinolisis",
    description: "Door-to-needle untuk reperfusi farmakologis bila PCI primer tidak tersedia tepat waktu.",
    milestones: [
      { label: "EKG 12 sadapan selesai", targetMinutes: 10 },
      { label: "Kriteria fibrinolisis dinilai", targetMinutes: 20 },
      { label: "Fibrinolitik diberikan (door-to-needle)", targetMinutes: 30 },
    ],
    source: { org: "ESC", title: "Acute myocardial infarction in patients presenting with ST-segment elevation", year: 2017 },
  },
  {
    id: "sepsis-bundle",
    name: "Sepsis - 1 Hour Bundle",
    description: "Bundel sepsis satu jam untuk pasien dengan sepsis atau syok septik.",
    milestones: [
      { label: "Ukur laktat", targetMinutes: 15 },
      { label: "Ambil kultur darah sebelum antibiotik", targetMinutes: 30 },
      { label: "Antibiotik spektrum luas diberikan", targetMinutes: 60 },
      { label: "Kristaloid 30 mL/kg dimulai (hipotensi atau laktat >= 4)", targetMinutes: 60 },
      { label: "Vasopresor untuk MAP >= 65 bila perlu", targetMinutes: 60 },
    ],
    source: { org: "Surviving Sepsis Campaign", title: "International Guidelines for Management of Sepsis and Septic Shock", year: 2021 },
  },
  {
    id: "trauma-primary",
    name: "Trauma - Primary Survey",
    description: "Sekuens penilaian primer ATLS dan resusitasi awal.",
    milestones: [
      { label: "Airway dan kontrol servikal", targetMinutes: 5 },
      { label: "Breathing dan ventilasi", targetMinutes: 10 },
      { label: "Circulation dan kontrol perdarahan", targetMinutes: 15 },
      { label: "Disability (GCS dan pupil)", targetMinutes: 20 },
      { label: "Exposure dan penanganan hipotermia", targetMinutes: 25 },
    ],
    source: { org: "American College of Surgeons", title: "Advanced Trauma Life Support (ATLS) student course manual", year: 2018 },
  },
];
