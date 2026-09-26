export const dynamic = "force-dynamic";

export async function GET() {
  const { enabledSocialProviders, emailVerificationEnabled } = await import("@/lib/auth");
  return Response.json(
    { socialProviders: enabledSocialProviders, emailVerificationEnabled },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
