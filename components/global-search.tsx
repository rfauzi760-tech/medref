"use client";

import { Search, X, CornerDownLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { globalSearch, type SearchHit } from "@/lib/search";

export function GlobalSearch({ autoFocus = false, onNavigate }: { autoFocus?: boolean; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => globalSearch(query), [query]);
  const flat = useMemo(() => results.flatMap((g) => g.hits), [results]);

  const openPalette = useCallback(() => {
    setActive(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    onNavigate?.();
  }, [onNavigate]);

  const openHref = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) setActive(0);
          return !o;
        });
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open || autoFocus) inputRef.current?.focus();
  }, [open, autoFocus]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      openHref(flat[active].href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (!open && !autoFocus) {
    return (
      <button
        type="button"
        onClick={openPalette}
        aria-label="Buka pencarian global"
        className="focus-ring flex h-10 w-full items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-3 text-left text-sm text-[var(--muted)] transition-colors hover:border-accent/50"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">Cari diagnosis, skor, kalkulator…</span>
        <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 dark:border-zinc-600 dark:bg-zinc-700 sm:block">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[10vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="workspace-panel w-full max-w-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Pencarian global"
      >
        <div className="flex items-center gap-2 border-b border-zinc-100 px-4 dark:border-zinc-800">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            role="combobox"
            aria-expanded="true"
            aria-controls="global-search-results"
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Cari: sepsis, amoksisilin, J18, CURB…"
            className="focus-ring h-12 w-full rounded bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            autoFocus
          />
          <button type="button" onClick={() => setOpen(false)} aria-label="Tutup pencarian" className="rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div id="global-search-results" className="thin-scroll max-h-[55vh] overflow-y-auto p-2">
          {query.trim().length < 2 ? (
            <p className="px-3 py-6 text-center text-sm text-zinc-400">Ketik minimal 2 karakter — mis. “sepsis”, “DBD”, “J18”.</p>
          ) : flat.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-zinc-400">Tidak ada hasil untuk “{query}”.</p>
          ) : (
            results.map((group) => (
              <div key={group.key} className="mb-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{group.label}</div>
                {group.hits.map((hit) => {
                  const idx = flat.indexOf(hit);
                  return <SearchRow key={hit.id + hit.href} hit={hit} active={idx === active} onSelect={() => openHref(hit.href)} onHover={() => setActive(idx)} />;
                })}
              </div>
            ))
          )}
        </div>

        {flat.length > 0 && (
          <div className="flex items-center gap-3 border-t border-zinc-100 px-4 py-2 text-[11px] text-zinc-400 dark:border-zinc-800">
            <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> buka</span>
            <span>↑↓ pilih</span>
            <span>Esc tutup</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchRow({ hit, active, onSelect, onHover }: { hit: SearchHit; active: boolean; onSelect: () => void; onHover: () => void }) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onSelect}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left ${active ? "bg-accent/10 text-foreground" : "text-foreground"}`}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{hit.title}</div>
        {hit.subtitle && <div className="truncate text-xs text-zinc-400">{hit.subtitle}</div>}
      </div>
      {hit.badge && (
        <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {hit.badge}
        </span>
      )}
    </button>
  );
}
