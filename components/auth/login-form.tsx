"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Apple, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { normalizeReturnTo } from "@/lib/auth/access-policy";

const TURNSTILE_SITE_KEY = "0x4AAAAAAFEDFHmxH6ScuRd6";

type TurnstileRenderOptions = {
  sitekey: string;
  action: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function LoginForm({
  googleEnabled,
  appleEnabled,
  emailVerificationEnabled,
}: {
  googleEnabled: boolean;
  appleEnabled: boolean;
  emailVerificationEnabled: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = normalizeReturnTo(searchParams.get("next"));
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState("");
  const [resending, setResending] = useState(false);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const [providers, setProviders] = useState({ google: googleEnabled, apple: appleEnabled });
  const [verificationEnabled, setVerificationEnabled] = useState(emailVerificationEnabled);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/providers", { credentials: "same-origin", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Provider status unavailable");
        return response.json() as Promise<{ socialProviders?: { google?: boolean; apple?: boolean }; emailVerificationEnabled?: boolean }>;
      })
      .then((settings) => {
        setProviders({ google: settings.socialProviders?.google === true, apple: settings.socialProviders?.apple === true });
        setVerificationEnabled(settings.emailVerificationEnabled === true);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const container = turnstileContainerRef.current;
    const turnstile = window.turnstile;
    if (!turnstileReady || verificationPending || !container || !turnstile) return;

    turnstileWidgetIdRef.current = turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      action: "auth",
      callback: (token) => {
        setCaptchaToken(token);
        setError("");
      },
      "expired-callback": () => setCaptchaToken(""),
      "error-callback": () => {
        setCaptchaToken("");
        setError("Verifikasi Cloudflare gagal dimuat. Periksa koneksi lalu coba lagi.");
      },
    });

    return () => {
      const widgetId = turnstileWidgetIdRef.current;
      if (widgetId) {
        turnstile.remove(widgetId);
        turnstileWidgetIdRef.current = null;
      }
      setCaptchaToken("");
    };
  }, [turnstileReady, verificationPending]);

  const completeLogin = () => {
    router.replace(destination);
    router.refresh();
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captchaToken) {
      setError("Selesaikan verifikasi Cloudflare terlebih dahulu.");
      return;
    }
    setError("");
    setPending(true);
    try {
      const result = mode === "signup"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password, callbackURL: destination, fetchOptions: { headers: { "x-captcha-response": captchaToken } } })
        : await authClient.signIn.email({ email: email.trim(), password, callbackURL: destination, fetchOptions: { headers: { "x-captcha-response": captchaToken } } });

      if (result.error) {
        if (mode === "signin" && verificationEnabled && result.error.status === 403) {
          setVerificationNotice("Email ini belum diverifikasi. Minta tautan baru melalui tombol di bawah.");
          setVerificationPending(true);
          return;
        }
        setError(mode === "signin"
          ? "Tidak dapat masuk. Periksa email dan kata sandi, lalu coba kembali."
          : "Akun belum dapat dibuat. Periksa kembali data yang dimasukkan.");
        return;
      }
      if (mode === "signup" && verificationEnabled) {
        setVerificationNotice(`Jika akun berhasil dibuat, tautan verifikasi akan dikirim ke ${email.trim()}. Periksa juga folder spam.`);
        setVerificationPending(true);
        return;
      }
      completeLogin();
    } catch {
      setError("Layanan login sedang tidak tersedia. Coba lagi sebentar.");
    } finally {
      setPending(false);
      resetCaptcha();
    }
  }

  function resetCaptcha() {
    setCaptchaToken("");
    const widgetId = turnstileWidgetIdRef.current;
    if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
  }

  async function resendVerificationEmail() {
    setError("");
    setResending(true);
    try {
      const result = await authClient.sendVerificationEmail({ email: email.trim(), callbackURL: destination });
      if (result.error) {
        setError("Tautan belum dapat dikirim. Coba lagi sebentar.");
        return;
      }
      setVerificationNotice(`Tautan verifikasi baru dikirim ke ${email.trim()}.`);
    } catch {
      setError("Tautan belum dapat dikirim. Coba lagi sebentar.");
    } finally {
      setResending(false);
    }
  }

  async function signInSocial(provider: "google" | "apple") {
    if (!captchaToken) {
      setError("Selesaikan verifikasi Cloudflare terlebih dahulu.");
      return;
    }
    setError("");
    setPending(true);
    try {
      const result = await authClient.signIn.social({ provider, callbackURL: destination, fetchOptions: { headers: { "x-captcha-response": captchaToken } } });
      if (result.error) setError("Login dengan penyedia tersebut belum berhasil. Coba lagi.");
    } catch {
      setError("Login dengan penyedia tersebut belum berhasil. Coba lagi.");
    } finally {
      setPending(false);
      resetCaptcha();
    }
  }

  return (
    <>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
      onReady={() => setTurnstileReady(true)}
      onError={() => setError("Verifikasi Cloudflare gagal dimuat. Periksa koneksi lalu coba lagi.")}
    />
    <section className="workspace-panel mx-auto w-full max-w-md space-y-6 p-6 sm:p-8">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Image src="/rfsmed-symbol.svg" alt="RFSmed" width={36} height={36} priority className="h-9 w-9" />
          <span className="text-sm font-bold text-[var(--ink)]">RFSmed</span>
        </div>
        <h1 className="display-type text-2xl font-bold text-[var(--ink)]">
          {verificationPending ? "Verifikasi email" : mode === "signin" ? "Masuk ke akun" : "Buat akun"}
        </h1>
        <p className="text-sm leading-6 text-[var(--muted)]">
          {verificationPending
            ? "Satu langkah lagi untuk membuka RFSmed."
            : mode === "signin" ? "Masuk untuk membuka referensi dan alat klinis." : "Buat akun gratis untuk menggunakan RFSmed."}
        </p>
      </div>

      {verificationPending ? (
        <div className="space-y-4 text-center">
          <p role="status" className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-4 py-3 text-sm leading-6 text-[var(--ink)]">
            {verificationNotice || `Kami mengirim tautan verifikasi ke ${email.trim()}. Periksa juga folder spam.`}
          </p>
          <p className="text-sm leading-6 text-[var(--muted)]">Klik tautan dalam email untuk mengaktifkan akun. Tautan berlaku 24 jam.</p>
          {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">{error}</p>}
          <button type="button" disabled={resending} onClick={() => void resendVerificationEmail()} className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-4 text-sm font-semibold text-[var(--ink)] disabled:opacity-60">
            {resending && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
            Kirim ulang tautan
          </button>
          <button type="button" className="text-sm font-semibold text-accent-strong underline underline-offset-2 dark:text-accent" onClick={() => { setVerificationPending(false); setVerificationNotice(""); setMode("signin"); setError(""); }}>
            Kembali ke masuk
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <div ref={turnstileContainerRef} className="flex min-h-[65px] justify-center" />
            {!captchaToken && <p role="status" className="text-center text-xs text-[var(--muted)]">Selesaikan verifikasi keamanan untuk melanjutkan.</p>}
          </div>
          {(providers.google || providers.apple) && (
            <div className="space-y-2">
              {providers.google && (
                <button type="button" disabled={pending || !captchaToken} onClick={() => void signInSocial("google")} className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-sm font-semibold text-[var(--ink)] hover:bg-black/[0.035] disabled:opacity-60 dark:hover:bg-white/[0.05]">
                  <span aria-hidden="true" className="font-bold text-base">G</span> Lanjutkan dengan Google
                </button>
              )}
              {providers.apple && (
                <button type="button" disabled={pending || !captchaToken} onClick={() => void signInSocial("apple")} className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-sm font-semibold text-[var(--ink)] hover:bg-black/[0.035] disabled:opacity-60 dark:hover:bg-white/[0.05]">
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
            {mode === "signup" && verificationEnabled && <span className="block text-xs font-normal text-[var(--muted)]">Tautan verifikasi akan dikirim ke email Anda.</span>}
          </label>
            {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">{error}</p>}
            <button type="submit" disabled={pending || !captchaToken} className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-bold text-slate-950 transition-opacity hover:opacity-90 disabled:opacity-60">
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
          <p className="text-center text-xs text-[var(--muted)]">Dengan mendaftar, Anda menyetujui <Link href="/terms" className="underline underline-offset-2">ketentuan</Link> dan <Link href="/privacy" className="underline underline-offset-2">pemberitahuan privasi</Link>.</p>
        </>
      )}
    </section>
    </>
  );
}
