import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="workspace-panel mx-auto w-full max-w-md p-6 text-sm text-[var(--muted)]">Memuat halaman masuk…</div>}><LoginForm
      googleEnabled={false}
      appleEnabled={false}
      emailVerificationEnabled
    /></Suspense>
  );
}
