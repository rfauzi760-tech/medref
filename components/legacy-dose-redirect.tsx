"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LegacyDoseRedirect({ tool }: { tool: string }) {
  const router = useRouter();
  useEffect(() => router.replace(`/tools-dosis/${encodeURIComponent(tool)}`), [router, tool]);
  return <p role="status" className="py-8 text-sm text-[var(--muted)]">Membuka kalkulator dosis…</p>;
}
