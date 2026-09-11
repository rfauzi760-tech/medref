import DevelopmentPageClient from "@/components/catalog-pages/development-page-client";
import { milestoneAges } from "@/lib/data/milestones";

export default function DevelopmentPage() {
  return <DevelopmentPageClient milestoneAges={milestoneAges} />;
}
