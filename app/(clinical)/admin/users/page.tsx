import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { authEnvironment } from "@/lib/auth/cloudflare-env";
import { isAuthorizedAdmin } from "@/lib/auth/admin-policy";
import { listAdminUsers } from "@/lib/auth/admin-users";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function pageHref(page: number, query: string): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("page", String(page));
  return `/admin/users?${params.toString()}`;
}

function providerName(provider: string): string {
  if (provider === "credential") return "Email";
  if (provider === "google") return "Google";
  if (provider === "apple") return "Apple";
  return provider;
}

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const configuredAdminEmail = authEnvironment.RFS_ADMIN_EMAIL;
  if (!configuredAdminEmail?.trim() || !authEnvironment.AUTH_DB) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?next=%2Fadmin%2Fusers");
  if (!isAuthorizedAdmin(session.user, configuredAdminEmail)) notFound();

  const params = await searchParams;
  const pageNumber = Number(one(params.page));
  const result = await listAdminUsers(authEnvironment.AUTH_DB, {
    query: one(params.q),
    page: Number.isSafeInteger(pageNumber) ? pageNumber : 1,
    pageSize: 50,
  });
  const pageCount = Math.max(1, Math.ceil(result.total / result.pageSize));
  const dateFormat = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  });

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent-strong dark:text-accent">RFSmed</p>
          <h1 className="display-type mt-1 text-2xl font-bold text-[var(--ink)]">Admin · Pengguna</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Daftar akun terdaftar dan status verifikasi email.</p>
        </div>
        <Link href="/" className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--ink)]">Kembali ke RFSmed</Link>
      </div>

      <section className="workspace-panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] p-4 sm:px-5">
          <p className="text-sm font-semibold text-[var(--ink)]">{result.total} akun</p>
          <form method="get" className="flex w-full gap-2 sm:w-auto">
            <label className="sr-only" htmlFor="admin-user-search">Cari nama atau email</label>
            <input id="admin-user-search" name="q" type="search" maxLength={100} defaultValue={result.query} placeholder="Cari nama atau email" className="focus-ring min-h-10 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-3 text-sm text-[var(--ink)] sm:w-64" />
            <button className="focus-ring min-h-10 rounded-lg bg-accent px-4 text-sm font-bold text-slate-950">Cari</button>
          </form>
        </div>
        {result.users.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface)] text-xs uppercase tracking-wide text-[var(--muted)]">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-5">Nama</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Metode masuk</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Terdaftar</th>
                </tr>
              </thead>
              <tbody>
                {result.users.map((user) => (
                  <tr key={user.email} className="border-t border-[var(--line)] text-[var(--ink)]">
                    <td className="px-4 py-3 font-medium sm:px-5">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.emailVerified ? "Terverifikasi" : "Belum diverifikasi"}</td>
                    <td className="px-4 py-3">{user.providers.length ? user.providers.map(providerName).join(", ") : "Tidak tercatat"}</td>
                    <td className="px-4 py-3">{dateFormat.format(new Date(user.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-sm text-[var(--muted)]">Tidak ada akun yang cocok.</p>
        )}
        <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] p-4 text-sm">
          <span className="text-[var(--muted)]">Halaman {result.page} dari {pageCount}</span>
          <div className="flex gap-2">
            {result.page > 1 && <Link rel="prev" href={pageHref(result.page - 1, result.query)} className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2 font-semibold text-[var(--ink)]">Sebelumnya</Link>}
            {result.page < pageCount && <Link rel="next" href={pageHref(result.page + 1, result.query)} className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2 font-semibold text-[var(--ink)]">Berikutnya</Link>}
          </div>
        </div>
      </section>
    </main>
  );
}
