import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pemberitahuan Privasi",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-strong dark:text-accent">RFSmed</p>
        <h1 className="display-type mt-2 text-3xl font-bold">Pemberitahuan Privasi</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Terakhir diperbarui 25 September 2026.</p>
      </div>

      <section className="workspace-panel space-y-3 p-5 text-sm leading-6 text-[var(--muted)]">
        <h2 className="text-lg font-bold text-[var(--ink)]">Data akun dan sesi</h2>
        <p>Untuk membuat dan menjaga akun, RFSmed memproses nama, alamat email, kata sandi dalam bentuk hash, status verifikasi email, dan data sesi login. Data akun dan sesi disimpan di Cloudflare D1; cookie sesi bersifat HttpOnly dan Secure saat situs berjalan di HTTPS.</p>
      </section>

      <section className="workspace-panel space-y-3 p-5 text-sm leading-6 text-[var(--muted)]">
        <h2 className="text-lg font-bold text-[var(--ink)]">Email verifikasi</h2>
        <p>Jika verifikasi email diaktifkan, alamat email dan tautan verifikasi akun dikirim melalui Resend hanya untuk pembuatan atau verifikasi akun. RFSmed tidak menggunakan email verifikasi untuk promosi.</p>
      </section>

      <section className="workspace-panel space-y-3 p-5 text-sm leading-6 text-[var(--muted)]">
        <h2 className="text-lg font-bold text-[var(--ink)]">Layanan dan keamanan</h2>
        <p>Cloudflare menyediakan hosting, basis data, dan perlindungan akses situs. RFSmed tidak meminta atau menyimpan informasi pembayaran pada tahap layanan gratis saat ini.</p>
        <p>Jangan masukkan identitas pasien atau informasi kesehatan yang dapat mengidentifikasi seseorang ke akun atau fitur RFSmed.</p>
      </section>
    </article>
  );
}
