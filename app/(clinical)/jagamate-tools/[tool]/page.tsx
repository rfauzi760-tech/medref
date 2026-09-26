import { redirect } from "next/navigation";

export default async function LegacyDoseToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  redirect(`/tools-dosis/${tool}`);
}
