import DevelopmentPageClient from "@/components/catalog-pages/development-page-client";
import {
  developmentRedFlags,
  developmentSources,
  kpspScheduleMonths,
  milestoneAges,
  milestoneDomains,
} from "@/lib/data/milestones";

export default function DevelopmentPage() {
  return (
    <DevelopmentPageClient
      milestoneAges={milestoneAges}
      milestoneDomains={milestoneDomains}
      developmentRedFlags={developmentRedFlags}
      developmentSources={developmentSources}
      kpspScheduleMonths={kpspScheduleMonths}
    />
  );
}
