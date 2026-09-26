"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function StaticSessionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending || session) return;
    const next = `${pathname}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [isPending, pathname, router, session]);

  if (isPending || !session) return <div role="status" aria-live="polite" className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-[var(--muted)]">Memeriksa sesi masuk…</div>;
  return children;
}
