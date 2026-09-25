"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Apple, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { normalizeReturnTo } from "@/lib/auth/access-policy";

export function LoginForm({ googleEnabled, appleEnabled }: { googleEnabled: boolean; appleEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = normalizeReturnTo(searchParams.get("next"));
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const completeLogin = () => {
    router.replace(destination);
    router.refresh();
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result = mode === "signup"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password, callbackURL: destination })
        : await authClient.signIn.email({ email: email.trim(), password, callbackURL: destination });

      if (result.error) {
        setError(mode === "signin"
          ? "Tidak dapat masuk. Periksa email dan kata sandi, lalu coba kembali."
          : "Akun belum dapat dibuat. Periksa kembali data yang dimasukkan.");
        return;
      }
      completeLogin();
    } catch {
      setError("Layanan login sedang tidak tersedia. Coba lagi sebentar.");
    } finally {
      setPending(false);
    }
  }

  async function signInSocial(provider: "google" | "apple") {
    setError("");
    setPending(true);
    try {
      const result = await authClient.signIn.social({ provider, callbackURL: destination });
      if (result.error) setError("Login dengan penyedia tersebut belum berhasil. Coba lagi.");
    } catch {
      setError("Login dengan penyedia tersebut belum berhasil. Coba lagi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="workspace-panel mx-auto w-full max-w-md space-y-6 p-6 sm:p-8">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong dark:text-accent">RFSmed</p>
        <h1 className="display-type text-2xl font-bold text-[var(--ink)]">
          {mode === "signin" ? "Masuk ke akun" : "Buat akun"}
        </h1>
        <p className="text-sm leading-6 text-[var(--muted)]">
          {mode === "signin" ? "Masuk untuk membuka referensi dan alat klinis." : "Buat akun gratis untuk menggunakan RFSmed."}
        </p>
      </div>

      {(googleEnabled || appleEnabled) && (
        <div className="space-y-2">
          {googleEnabled && (
            <button type="button" disabled={pending} onClick={() => void signInSocial("google")} className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-sm font-semibold text-[var(--ink)] hover:bg-black/[0.035] disabled:opacity-60 dark:hover:bg-white/[0.05]">
              <span aria-hidden="true" className="font-bold text-base">G</span> Lanjutkan dengan Google
            </button>
          )}
          {appleEnabled && (
            <button type="button" disabled={pending} onClick={() => void signInSocial("apple")} className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-sm font-semibold text-[var(--ink)] hover:bg-black/[0.035] disabled:opacity-60 dark:hover:bg-white/[0.05]">
              <Apple aria-hidden="true" className="h-4 w-4" /> Lanjutkan dengan Apple
            </button>
          )}
          <div className="flex items-center gap-3 py-1 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--line)]" />atau dengan email<span className="h-px flex-1 bg-[var(--line)]" /></div>
        </div>
      )}

      <form className="space-y-4" onSubmit={(event) => void submit(event)}>
        {mode === "signup" && (
          <label className="block space-y-1.5 text-sm font-medium text-[var(--ink)]">
            Nama
            <input required autoComplete="name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className="focus-ring min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-3 text-sm" />
          </label>
        )}
        <label className="block space-y-1.5 text-sm font-medium text-[var(--ink)]">
          Email
          <input required type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="focus-ring min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-3 text-sm" />
        </label>
        <label className="block space-y-1.5 text-sm font-medium text-[var(--ink)]">
          Kata sandi
          <input required type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={12} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="focus-ring min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-3 text-sm" />
          {mode === "signup" && <span className="block text-xs font-normal text-[var(--muted)]">Minimal 12 karakter.</span>}
        </label>
        {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">{error}</p>}
        <button type="submit" disabled={pending} className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-bold text-slate-950 transition-opacity hover:opacity-90 disabled:opacity-60">
          {pending && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Masuk" : "Buat akun"}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--muted)]">
        {mode === "signin" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <button type="button" className="font-semibold text-accent-strong underline underline-offset-2 dark:text-accent" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}>
          {mode === "signin" ? "Daftar" : "Masuk"}
        </button>
      </p>
    </section>
  );
}
