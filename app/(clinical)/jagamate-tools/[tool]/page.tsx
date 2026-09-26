import { LegacyDoseRedirect } from "@/components/legacy-dose-redirect";

const legacyTools = ["diare", "syok", "kehamilan", "taksiran-janin", "luka-bakar"];

export function generateStaticParams() {
  return legacyTools.map((tool) => ({ tool }));
}

export const dynamicParams = false;

export default async function LegacyDoseToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  return <LegacyDoseRedirect tool={tool} />;
}
