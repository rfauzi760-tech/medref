import { betterAuth } from "better-auth";
import { authEnvironment } from "./cloudflare-env";
import { createAuthOptions } from "./options";

export const auth = betterAuth(createAuthOptions(authEnvironment));
export const authRuntimeEnabled = Boolean(
  authEnvironment.AUTH_DB && (authEnvironment.BETTER_AUTH_SECRET || process.env.NODE_ENV !== "production"),
);
export const enabledSocialProviders = {
  google: Boolean(authEnvironment.GOOGLE_CLIENT_ID && authEnvironment.GOOGLE_CLIENT_SECRET),
  apple: Boolean(authEnvironment.APPLE_CLIENT_ID && authEnvironment.APPLE_CLIENT_SECRET),
};
export const emailVerificationEnabled = Boolean(authEnvironment.RESEND_API_KEY && authEnvironment.RESEND_FROM_EMAIL);
