import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ketentuan Penggunaan",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-strong dark:text-accent">RFSmed</p>
        <h1 className="display-type mt-2 text-3xl font-bold">Ketentuan Penggunaan</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Terakhir diperbarui 11 September 2026.</p>
      </div>

      <section className="workspace-panel space-y-3 p-5 text-sm leading-6 text-[var(--muted)]">
        <h2 className="text-lg font-bold text-[var(--ink)]">Hak dan batas penggunaan</h2>
        <p>Konten RFSmed hanya boleh digunakan untuk referensi pribadi dan pelayanan klinis langsung oleh pengguna manusia.</p>
        <p>Dilarang menyalin, mengambil, mengunduh massal, menerbitkan ulang, menjual, melisensikan, atau mendistribusikan konten tanpa izin tertulis dari pemilik RFSmed.</p>
      </section>

      <section className="workspace-panel space-y-3 p-5 text-sm leading-6 text-[var(--muted)]">
        <h2 className="text-lg font-bold text-[var(--ink)]">Larangan otomatisasi dan AI</h2>
        <p>Dilarang melakukan scraping, crawling, ekstraksi dataset, pengindeksan, pengarsipan otomatis, atau menggunakan agen otomatis untuk mengakses konten.</p>
        <p>Konten tidak boleh digunakan untuk pelatihan model AI, retrieval augmented generation, pembuatan basis pengetahuan, evaluasi model, atau produk turunan tanpa izin tertulis.</p>
      </section>

      <section className="workspace-panel space-y-3 p-5 text-sm leading-6 text-[var(--muted)]">
        <h2 className="text-lg font-bold text-[var(--ink)]">Penegakan</h2>
        <p>RFSmed dapat membatasi atau memblokir akses, mencatat pola penyalahgunaan, dan mengambil tindakan terhadap penggunaan yang melanggar ketentuan ini.</p>
        <p>Akses ke situs berarti pengguna menyetujui ketentuan ini.</p>
      </section>
    </article>
  );
}
