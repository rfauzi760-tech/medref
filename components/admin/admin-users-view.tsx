"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import type { AdminUsersResult } from "@/lib/auth/admin-users";

export function AdminUsersView() {
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<AdminUsersResult | null>(null);
  const [loadedKey, setLoadedKey] = useState("");
  const [error, setError] = useState("");
  const requestKey = `${page}:${query}`;
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), q: query });
    fetch(`/api/admin/users?${params}`, { credentials: "same-origin", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 404 ? "Halaman ini hanya tersedia untuk admin." : "Daftar akun tidak dapat dimuat.");
        return response.json() as Promise<AdminUsersResult>;
      })
      .then((data) => { setResult(data); setError(""); setLoadedKey(requestKey); })
      .catch((cause: unknown) => { if (!controller.signal.aborted) { setError(cause instanceof Error ? cause.message : "Daftar akun tidak dapat dimuat."); setLoadedKey(requestKey); } });
    return () => controller.abort();
  }, [page, query, requestKey]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(input.trim().slice(0, 100));
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil((result?.total ?? 0) / (result?.pageSize ?? 50)));

  return <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-accent-strong dark:text-accent">RFSmed</p><h1 className="display-type mt-1 text-2xl font-bold text-[var(--ink)]">Admin · Pengguna</h1><p className="mt-2 text-sm text-[var(--muted)]">Daftar akun dan status verifikasi email.</p></div><Link href="/" className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--ink)]">Kembali ke RFSmed</Link></div>
    <section className="workspace-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] p-4 sm:px-5"><p className="text-sm font-semibold text-[var(--ink)]">{result?.total ?? ""} akun</p><form onSubmit={search} className="flex w-full gap-2 sm:w-auto"><label className="sr-only" htmlFor="admin-user-search">Cari nama atau email</label><input id="admin-user-search" type="search" maxLength={100} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Cari nama atau email" className="focus-ring min-h-10 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-3 text-sm text-[var(--ink)] sm:w-64" /><button className="focus-ring min-h-10 rounded-lg bg-accent px-4 text-sm font-bold text-slate-950">Cari</button></form></div>
      {error ? <p role="alert" className="p-6 text-sm text-red-700 dark:text-red-200">{error}</p> : loading ? <p role="status" className="p-6 text-sm text-[var(--muted)]">Memuat daftar akun…</p> : result?.users.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead className="bg-[var(--surface)] text-xs uppercase tracking-wide text-[var(--muted)]"><tr><th className="px-4 py-3 font-semibold sm:px-5">Nama</th><th className="px-4 py-3 font-semibold">Email</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Metode masuk</th><th className="px-4 py-3 font-semibold">Terdaftar</th></tr></thead><tbody>{result.users.map((user) => <tr key={user.email} className="border-t border-[var(--line)] text-[var(--ink)]"><td className="px-4 py-3 font-medium sm:px-5">{user.name}</td><td className="px-4 py-3">{user.email}</td><td className="px-4 py-3">{user.emailVerified ? "Terverifikasi" : "Belum diverifikasi"}</td><td className="px-4 py-3">{user.providers.map((provider) => provider === "credential" ? "Email" : provider === "google" ? "Google" : provider === "apple" ? "Apple" : provider).join(", ") || "Tidak tercatat"}</td><td className="px-4 py-3">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(user.createdAt))}</td></tr>)}</tbody></table></div> : <p className="p-6 text-sm text-[var(--muted)]">Tidak ada akun yang cocok.</p>}
      {result && <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] p-4 text-sm"><span className="text-[var(--muted)]">Halaman {result.page} dari {pageCount}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2 font-semibold text-[var(--ink)] disabled:opacity-50">Sebelumnya</button><button disabled={page >= pageCount || loading} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2 font-semibold text-[var(--ink)] disabled:opacity-50">Berikutnya</button></div></div>}
    </section>
  </main>;
}
