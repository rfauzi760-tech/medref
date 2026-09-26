import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createAuthOptions } from "@/lib/auth/options";

const root = process.cwd();

describe("perlindungan Turnstile pada autentikasi", () => {
  it("mewajibkan validasi Turnstile pada login, pendaftaran, dan login sosial", () => {
    const options = createAuthOptions({ TURNSTILE_SECRET: "worker-secret" });
    const captchaPlugin = options.plugins?.find((plugin) => plugin.id === "captcha");

    expect(captchaPlugin).toBeDefined();
    expect(captchaPlugin?.options).toMatchObject({
      provider: "cloudflare-turnstile",
      secretKey: "worker-secret",
      endpoints: ["/sign-in/email", "/sign-up/email", "/sign-in/social"],
      expectedAction: "auth",
      allowedHostnames: ["rfsmed.web.id", "localhost", "127.0.0.1"],
    });
  });

  it("tidak menerima token dari hostname lokal di produksi", () => {
    const options = createAuthOptions({ NODE_ENV: "production", TURNSTILE_SECRET: "worker-secret" });
    const captchaPlugin = options.plugins?.find((plugin) => plugin.id === "captcha");

    expect(captchaPlugin?.options).toMatchObject({
      allowedHostnames: ["rfsmed.web.id"],
    });
  });

  it("tetap mengaktifkan plugin agar autentikasi gagal tertutup saat secret tidak tersedia", () => {
    const options = createAuthOptions({});
    const captchaPlugin = options.plugins?.find((plugin) => plugin.id === "captcha");

    expect(captchaPlugin).toBeDefined();
    expect(captchaPlugin?.options).toMatchObject({
      provider: "cloudflare-turnstile",
      secretKey: "",
      expectedAction: "auth",
    });
  });

  it("menampilkan widget, mengirim token pada semua aksi autentikasi, dan memakai token baru untuk percobaan ulang", () => {
    const loginForm = readFileSync(join(root, "components/auth/login-form.tsx"), "utf8");

    expect(loginForm).toContain("challenges.cloudflare.com/turnstile/v0/api.js?render=explicit");
    expect(loginForm).toContain('"x-captcha-response"');
    expect(loginForm).toContain('action: "auth"');
    expect(loginForm).toContain("turnstile.reset(");
    expect(loginForm).toContain("authClient.signIn.email(");
    expect(loginForm).toContain("authClient.signUp.email(");
    expect(loginForm).toContain("authClient.signIn.social(");
  });
});
