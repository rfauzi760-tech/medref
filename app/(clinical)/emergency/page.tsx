import EmergencyPageClient, { type EmergencyPathwaySummary } from "@/components/catalog-pages/emergency-page-client";
import { resolveAllPathways } from "@/lib/emergency";

export default function EmergencyPage() {
  const items: EmergencyPathwaySummary[] = resolveAllPathways().map(({ pathway, steps, redFlags }) => ({
    slug: pathway.slug,
    title: pathway.title,
    description: pathway.description,
    category: pathway.category,
    specialties: pathway.specialties,
    stepCount: steps.length,
    redFlagCount: redFlags.length,
  }));
  items.push({
    slug: "resusitasi-neonatus",
    title: "Resusitasi Neonatus",
    description: "Skema bercabang bayi baru lahir saat persalinan, dari persiapan hingga perawatan pascaresusitasi.",
    category: "Neonatologi",
    specialties: ["Neonatologi", "Pediatri"],
    stepCount: 0,
    redFlagCount: 0,
    href: "/neonatal-resuscitation",
  });
  return <EmergencyPageClient items={items} />;
}
