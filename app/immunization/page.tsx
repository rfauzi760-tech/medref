import ImmunizationPageClient from "@/components/catalog-pages/immunization-page-client";
import { immunizationSchedule } from "@/lib/data/immunization";

export default function ImmunizationPage() {
  return <ImmunizationPageClient schedule={immunizationSchedule} />;
}
