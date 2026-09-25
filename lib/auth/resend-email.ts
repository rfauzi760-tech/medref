interface ResendVerificationEmailInput {
  apiKey: string;
  from: string;
  to: string;
  url: string;
}

function escapeHtmlAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export async function sendResendVerificationEmail({ apiKey, from, to, url }: ResendVerificationEmailInput): Promise<void> {
  const safeUrl = escapeHtmlAttribute(url);
  const text = [
    "Verifikasi alamat email Anda untuk mengaktifkan akun RFSmed.",
    "",
    url,
    "",
    "Tautan berlaku selama 24 jam. Jika Anda tidak membuat akun RFSmed, abaikan email ini.",
  ].join("\n");
  const html = [
    "<p>Verifikasi alamat email Anda untuk mengaktifkan akun RFSmed.</p>",
    `<p><a href="${safeUrl}">Verifikasi email</a></p>`,
    "<p>Tautan berlaku selama 24 jam. Jika Anda tidak membuat akun RFSmed, abaikan email ini.</p>",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Verifikasi email RFSmed",
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`Email delivery failed (${response.status})`);
}
