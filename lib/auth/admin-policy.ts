export function isAuthorizedAdmin(
  user: { email: string; emailVerified: boolean } | null | undefined,
  configuredEmail: string | undefined,
): boolean {
  const allowedEmail = configuredEmail?.trim().toLowerCase();
  return Boolean(
    user?.emailVerified === true &&
    allowedEmail &&
    user.email.trim().toLowerCase() === allowedEmail,
  );
}
