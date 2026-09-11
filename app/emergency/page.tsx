import EmergencyPageClient from "@/components/catalog-pages/emergency-page-client";
import { resolveAllPathways } from "@/lib/emergency";

export default function EmergencyPage() {
  const items = resolveAllPathways().map(({ pathway, steps, redFlags }) => ({
    slug: pathway.slug,
    title: pathway.title,
    description: pathway.description,
    category: pathway.category,
    specialties: pathway.specialties,
    stepCount: steps.length,
    redFlagCount: redFlags.length,
  }));
  return <EmergencyPageClient items={items} />;
}
