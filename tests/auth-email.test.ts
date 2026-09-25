import { afterEach, describe, expect, it, vi } from "vitest";
import { createAuthOptions } from "@/lib/auth/options";
import { sendResendVerificationEmail } from "@/lib/auth/resend-email";

afterEach(() => vi.unstubAllGlobals());

describe("email verification setup", () => {
  it("does not require verification until a sender is configured", () => {
    const options = createAuthOptions({});

    expect(options.emailAndPassword.requireEmailVerification).toBe(false);
    expect(options.emailVerification).toBeUndefined();
  });

  it("keeps signup open if only the public sender address is configured", () => {
    const options = createAuthOptions({ RESEND_FROM_EMAIL: "RFSmed <noreply@rfsmed.web.id>" });

    expect(options.emailAndPassword.requireEmailVerification).toBe(false);
    expect(options.emailVerification).toBeUndefined();
  });

  it("requires verification and sends on signup when Resend is configured", async () => {
    const options = createAuthOptions({
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL: "RFSmed <noreply@rfsmed.web.id>",
    });

    expect(options.emailAndPassword.requireEmailVerification).toBe(true);
    expect(options.emailVerification?.sendOnSignUp).toBe(true);
    expect(options.emailVerification?.sendOnSignIn).toBe(false);

    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await options.emailVerification?.sendVerificationEmail(
      { user: { email: "clinician@example.com" }, url: "https://rfsmed.web.id/api/auth/verify-email?token=abc&callbackURL=%2Fdrugs" },
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer re_test_key");
    const body = JSON.parse(String(init.body)) as { from: string; to: string[]; text: string; html: string };
    expect(body.from).toBe("RFSmed <noreply@rfsmed.web.id>");
    expect(body.to).toEqual(["clinician@example.com"]);
    expect(body.text).toContain("https://rfsmed.web.id/api/auth/verify-email?token=abc&callbackURL=%2Fdrugs");
    expect(body.html).toContain("&amp;callbackURL=");
  });

  it("does not expose provider response details when delivery fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("private provider detail", { status: 403 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendResendVerificationEmail({
      apiKey: "re_test_key",
      from: "RFSmed <noreply@rfsmed.web.id>",
      to: "clinician@example.com",
      url: "https://rfsmed.web.id/verify",
    })).rejects.toThrow("Email delivery failed (403)");
  });
});
