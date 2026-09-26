import IndicationsPageClient from "@/components/catalog-pages/indications-page-client";
import { procedureEntries } from "@/lib/data/indications";

export default function IndicationsPage() {
  const items = procedureEntries.map(({ slug, title, definition, specialties, keywords }) => ({
    slug, title, definition, specialties, keywords,
  }));
  return <IndicationsPageClient items={items} />;
}
