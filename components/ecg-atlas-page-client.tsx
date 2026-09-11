"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronDown, ScanSearch, Search, X } from "lucide-react";
import { BackLink, EmptyState, PageHeader } from "@/components/shared";

interface AtlasEntry {
  title: string;
  category: string;
  tag: string;
  detail: string;
  images: { src: string; caption: string }[];
}

const SECTION_TITLES = new Set(["KENALI CEPAT", "TEMUAN UTAMA", "PEARL IGD", "⚠ PITFALL"]);

function Detail({ text, images, title, onPreview }: { text: string; images: AtlasEntry["images"]; title: string; onPreview: (image: AtlasEntry["images"][number]) => void }) {
  const groups: { title: string; lines: string[] }[] = [];
  for (const line of text.split("\n").filter(Boolean)) {
    if (SECTION_TITLES.has(line)) groups.push({ title: line, lines: [] });
    else if (groups.length) groups.at(-1)?.lines.push(line);
  }

  return (
    <div className="border-t border-[var(--line)] px-4 py-4">
      <div className="grid gap-4 sm:grid-cols-2">{groups.map((group) => (
        <section key={group.title} className={group.title === "⚠ PITFALL" ? "rounded-lg bg-amber-50 p-3 dark:bg-amber-950/25" : ""}>
          <h4 className="text-xs font-bold tracking-wide text-[var(--foreground)]">{group.title}</h4>
          {group.lines.length === 1 ? (
            <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{group.lines[0]}</p>
          ) : (
            <ul className="mt-1.5 space-y-1.5 text-sm leading-6 text-[var(--muted)]">
              {group.lines.map((line) => <li key={line} className="pl-3 before:absolute before:-ml-3 before:content-['•']">{line}</li>)}
            </ul>
          )}
        </section>
      ))}</div>
      <section className="mt-5 border-t border-[var(--line)] pt-4">
        <h4 className="text-xs font-bold tracking-wide text-[var(--foreground)]">GAMBAR REFERENSI</h4>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <button key={`${image.src}-${index}`} type="button" onClick={() => onPreview(image)} className="focus-ring group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] text-left">
              <span className="block aspect-[4/3] overflow-hidden bg-black/5 dark:bg-white/5">
                <img src={image.src} alt={`${title}, gambar ${index + 1}`} loading="lazy" className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]" />
              </span>
              <span className="block min-h-9 px-2.5 py-2 text-xs font-semibold leading-4 text-[var(--muted)]">{image.caption || `Gambar ${index + 1}`}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ClinicalAtlasPageClient({ mode = "ecg" }: { mode?: "ecg" | "radiology" }) {
  const [items, setItems] = useState<AtlasEntry[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<AtlasEntry["images"][number] | null>(null);

  useEffect(() => {
    fetch(mode === "ecg" ? "/api/ecg-atlas" : "/api/radiology-atlas", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { items: AtlasEntry[] }) => setItems(data.items))
      .finally(() => setLoading(false));
  }, [mode]);

  const isEcg = mode === "ecg";

  const categories = useMemo(() => [...new Set(items.map((item) => item.category))], [items]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => (!category || item.category === category) && (!needle || `${item.title} ${item.category} ${item.tag} ${item.detail}`.toLowerCase().includes(needle)));
  }, [category, items, query]);

  return (
    <div>
      <BackLink href={isEcg ? "/" : "/"} label="Kembali ke beranda" />
      <PageHeader title={isEcg ? "Atlas EKG" : "Imaging"} description={isEcg ? "Pengenalan cepat pola ritme, iskemia, blok, dan perubahan metabolik untuk penggunaan klinis." : "Atlas radiologi untuk pengenalan cepat temuan X-ray, CT, MRI, dan USG."} count={items.length || (isEcg ? 43 : 159)} countLabel="pola" />
      <div className="relative mb-4 max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isEcg ? "Cari pola EKG, temuan, atau pitfall" : "Cari modalitas, diagnosis, temuan, atau pitfall"} className="focus-ring h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] pl-11 pr-4 text-sm outline-none" />
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {["", ...categories].map((value) => <button key={value || "all"} onClick={() => setCategory(value)} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${category === value ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-[var(--line)] text-[var(--muted)]"}`}>{value || "Semua"}</button>)}
      </div>
      {loading ? <p className="text-sm text-[var(--muted)]">Memuat atlas...</p> : filtered.length === 0 ? <EmptyState message="Pola tidak ditemukan." /> : (
        <div className="workspace-panel overflow-hidden">
          {filtered.map((item) => {
            const expanded = open === item.title;
            return <article key={item.title} className="border-b border-[var(--line)] last:border-b-0">
              <button onClick={() => setOpen(expanded ? null : item.title)} className="focus-ring flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-black/[0.025] dark:hover:bg-white/[0.025]">
                {isEcg ? <Activity className="h-4 w-4 shrink-0 text-accent-strong dark:text-accent" /> : <ScanSearch className="h-4 w-4 shrink-0 text-accent-strong dark:text-accent" />}
                <span className="min-w-0 flex-1"><strong className="display-type block text-sm font-bold">{item.title}</strong><span className="mt-1 block text-xs text-[var(--muted)]">{item.category}</span></span>
                <span className="hidden rounded bg-accent/10 px-2 py-1 text-[10px] font-bold text-accent-strong sm:block dark:text-accent">{item.tag}</span>
                <ChevronDown className={`h-4 w-4 text-[var(--muted)] transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              {expanded && <Detail text={item.detail} images={item.images} title={item.title} onPreview={setPreview} />}
            </article>;
          })}
        </div>
      )}
      {preview && (
        <div role="dialog" aria-modal="true" aria-label="Pratinjau gambar" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setPreview(null)}>
          <div className="relative max-h-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setPreview(null)} aria-label="Tutup pratinjau" className="focus-ring absolute right-2 top-2 z-10 rounded-full bg-black/70 p-2 text-white"><X className="h-5 w-5" /></button>
            <img src={preview.src} alt={preview.caption || "Gambar referensi klinis"} className="max-h-[85vh] max-w-full rounded-xl bg-black object-contain" />
            {preview.caption && <p className="mt-2 text-center text-sm font-semibold text-white">{preview.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
