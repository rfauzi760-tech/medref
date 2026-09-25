"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function SessionControl() {
  const router = useRouter();
  const { data } = authClient.useSession();
  if (!data) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
      <span className="hidden max-w-48 truncate xl:inline">{data.user.email}</span>
      <button
        type="button"
        aria-label="Keluar dari akun"
        title="Keluar"
        className="focus-ring flex min-h-9 items-center gap-1.5 rounded-lg border border-[var(--line)] px-2.5 text-[var(--ink)] hover:bg-black/[0.035] dark:hover:bg-white/[0.05]"
        onClick={async () => {
          await authClient.signOut();
          router.replace("/");
          router.refresh();
        }}
      >
        <LogOut aria-hidden="true" className="h-4 w-4" />
        <span className="hidden sm:inline">Keluar</span>
      </button>
    </div>
  );
}
