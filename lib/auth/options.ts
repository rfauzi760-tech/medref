export interface AuthRuntimeEnvironment {
  AUTH_DB?: D1Database;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  APPLE_CLIENT_ID?: string;
  APPLE_CLIENT_SECRET?: string;
  NODE_ENV?: string;
}

export function createAuthOptions(runtime: AuthRuntimeEnvironment) {
  const production = runtime.NODE_ENV === "production";
  const socialProviders = {
    ...(runtime.GOOGLE_CLIENT_ID && runtime.GOOGLE_CLIENT_SECRET
      ? { google: { clientId: runtime.GOOGLE_CLIENT_ID, clientSecret: runtime.GOOGLE_CLIENT_SECRET } }
      : {}),
    ...(runtime.APPLE_CLIENT_ID && runtime.APPLE_CLIENT_SECRET
      ? { apple: { clientId: runtime.APPLE_CLIENT_ID, clientSecret: runtime.APPLE_CLIENT_SECRET } }
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
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    ...(runtime.AUTH_DB ? { database: runtime.AUTH_DB } : {}),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
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
