import { waitUntil } from "cloudflare:workers";
import { sendResendVerificationEmail } from "./resend-email";

export interface AuthRuntimeEnvironment {
  AUTH_DB?: D1Database;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  APPLE_CLIENT_ID?: string;
  APPLE_CLIENT_SECRET?: string;
  NODE_ENV?: string;
}

export function createAuthOptions(runtime: AuthRuntimeEnvironment) {
  const production = runtime.NODE_ENV === "production";
  const emailVerificationEnabled = Boolean(runtime.RESEND_API_KEY && runtime.RESEND_FROM_EMAIL);
  const socialProviders = {
    ...(runtime.GOOGLE_CLIENT_ID && runtime.GOOGLE_CLIENT_SECRET
      ? { google: { clientId: runtime.GOOGLE_CLIENT_ID, clientSecret: runtime.GOOGLE_CLIENT_SECRET, requireEmailVerification: emailVerificationEnabled } }
      : {}),
    ...(runtime.APPLE_CLIENT_ID && runtime.APPLE_CLIENT_SECRET
      ? { apple: { clientId: runtime.APPLE_CLIENT_ID, clientSecret: runtime.APPLE_CLIENT_SECRET, requireEmailVerification: emailVerificationEnabled } }
      : {}),
  };

  return {
    appName: "RFSmed",
    baseURL: runtime.BETTER_AUTH_URL || "https://rfsmed.web.id",
    basePath: "/api/auth",
    secret: runtime.BETTER_AUTH_SECRET || "rfsmed-local-development-secret-only-not-for-production",
    trustedOrigins: [
      "https://rfsmed.web.id",
      "https://www.rfsmed.web.id",
      "https://appleid.apple.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    ...(runtime.AUTH_DB ? { database: runtime.AUTH_DB } : {}),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: emailVerificationEnabled,
      autoSignIn: !emailVerificationEnabled,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    ...(emailVerificationEnabled ? {
      emailVerification: {
        sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
          const delivery = sendResendVerificationEmail({
            apiKey: runtime.RESEND_API_KEY!,
            from: runtime.RESEND_FROM_EMAIL!,
            to: user.email,
            url,
          }).catch((error: unknown) => {
            const status = error instanceof Error ? error.message.match(/\((\d{3})\)$/)?.[1] : undefined;
            console.error(`RFSmed verification email delivery failed${status ? ` (${status})` : ""}.`);
          });
          waitUntil(delivery);
        },
        sendOnSignUp: true,
        sendOnSignIn: false,
        autoSignInAfterVerification: true,
        expiresIn: 60 * 60 * 24,
      },
    } : {}),
    socialProviders,
    session: {
      expiresIn: 60 * 60 * 24 * 14,
      updateAge: 60 * 60 * 24,
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
      storage: runtime.AUTH_DB ? "database" as const : "memory" as const,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60, max: 3 },
        "/send-verification-email": { window: 60, max: 3 },
        "/sign-in/social": { window: 60, max: 10 },
      },
    },
    advanced: {
      useSecureCookies: production,
      defaultCookieAttributes: {
        httpOnly: true,
        secure: production,
        sameSite: "lax" as const,
      },
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
    },
  };
}
