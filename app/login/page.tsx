import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { emailVerificationEnabled, enabledSocialProviders } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk" };

// Provider availability comes from Worker runtime secrets, so this page cannot be prerendered.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <LoginForm
      googleEnabled={enabledSocialProviders.google}
      appleEnabled={enabledSocialProviders.apple}
      emailVerificationEnabled={emailVerificationEnabled}
    />
  );
}
