export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const [{ auth }, { authEnvironment }, { isAuthorizedAdmin }, { listAdminUsers }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/auth/cloudflare-env"),
    import("@/lib/auth/admin-policy"),
    import("@/lib/auth/admin-users"),
  ]);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !isAuthorizedAdmin(session.user, authEnvironment.RFS_ADMIN_EMAIL)) {
    return Response.json({ error: "Tidak ditemukan." }, { status: 404 });
  }
  if (!authEnvironment.AUTH_DB) return Response.json({ error: "Layanan admin belum tersedia." }, { status: 503 });

  const url = new URL(request.url);
  const requestedPage = Number(url.searchParams.get("page"));
  const result = await listAdminUsers(authEnvironment.AUTH_DB, {
    query: url.searchParams.get("q") ?? "",
    page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    pageSize: 50,
  });
  return Response.json(result, { headers: { "Cache-Control": "private, no-store" } });
}
