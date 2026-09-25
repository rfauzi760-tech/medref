import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { emailVerificationEnabled, enabledSocialProviders } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <LoginForm
      googleEnabled={enabledSocialProviders.google}
      appleEnabled={enabledSocialProviders.apple}
      emailVerificationEnabled={emailVerificationEnabled}
    />
  );
}
