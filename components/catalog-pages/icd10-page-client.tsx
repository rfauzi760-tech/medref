"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Icd10Entry } from "@/lib/types";
import { PageHeader, FilterInput, EmptyState } from "@/components/shared";

export default function Icd10PageClient({ items }: { items: Icd10Entry[] }) {
  const [q, setQ] = useState("");
  const [chapter, setChapter] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const chapters = useMemo(() => [...new Set(items.map((c) => c.chapter))].sort(), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((c) => {
      if (chapter && c.chapter !== chapter) return false;
      if (!query) return true;
      return (
        c.code.toLowerCase().includes(query) ||
        c.en.toLowerCase().includes(query) ||
        (c.id ?? "").toLowerCase().includes(query) ||
        (c.id ?? "").toLowerCase().includes(query.replace(/\s+/g, "")) // Indonesian terms may be written without spaces
      );
    });
  }, [q, chapter]);

  const copy = async (code: string, en: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div>
      <PageHeader
        title="Kamus ICD-10"
        description="Pencarian cepat kode ICD-10 dengan istilah Indonesia dan Inggris. Salin kode sekali klik - dirancang untuk pemakaian di titik pelayanan."
        count={items.length}
        countLabel="kode"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari kode atau diagnosis… mis. J18, pneumonia, diabetes" />
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setChapter("")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${!chapter ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
        >
          Semua bab
        </button>
        {chapters.map((c) => (
          <button
            key={c}
            onClick={() => setChapter(chapter === c ? "" : c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${chapter === c ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div ref={listRef} className="workspace-panel index-row overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState message={`Tidak ada kode ICD-10 yang cocok dengan “${q}”.`} />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-400 dark:border-zinc-800">
                <th className="px-4 py-2.5 font-semibold">Kode</th>
                <th className="px-4 py-2.5 font-semibold">Diagnosis (Inggris)</th>
                <th className="hidden px-4 py-2.5 font-semibold md:table-cell">Indonesia</th>
                <th className="hidden px-4 py-2.5 font-semibold lg:table-cell">Bab</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((c) => (
                <tr key={c.code} className="index-row hover:bg-black/[0.025] dark:hover:bg-white/[0.04]">
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs font-semibold text-accent-strong dark:text-accent">{c.code}</td>
                  <td className="px-4 py-2 text-zinc-700 dark:text-zinc-200">{c.en}</td>
                  <td className="hidden px-4 py-2 text-zinc-500 dark:text-zinc-400 md:table-cell">{c.id ?? " - "}</td>
                  <td className="hidden px-4 py-2 text-xs text-zinc-400 lg:table-cell">{c.chapter}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => copy(c.code, c.en)}
                      aria-label={`Salin ${c.code}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white"
                    >
                      {copied === c.code ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      {copied === c.code ? "Tersalin" : "Salin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
