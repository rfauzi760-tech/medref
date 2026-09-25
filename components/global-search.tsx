"use client";

import { Search, X, CornerDownLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import type { SearchGroup, SearchHit } from "@/lib/search-types";

export function GlobalSearch({ autoFocus = false, onNavigate }: { autoFocus?: boolean; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [results, setResults] = useState<SearchGroup[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const flat = useMemo(() => results.flatMap((g) => g.hits), [results]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as { groups?: SearchGroup[] };
        setResults(data.groups ?? []);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setResults([]);
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const openPalette = useCallback(async () => {
    let activeSession = session;
    if (!activeSession && sessionPending) {
      try {
        activeSession = (await authClient.getSession()).data;
      } catch {
        activeSession = null;
      }
    }

    if (!activeSession) {
      router.push("/login?next=%2F");
      return;
    }

    setActive(0);
    setOpen(true);
  }, [router, session, sessionPending]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
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
        if (open) setOpen(false);
        else void openPalette();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openPalette]);

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
        onClick={() => void openPalette()}
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 p-3 pt-[8vh] backdrop-blur-[3px] sm:p-6 sm:pt-[12vh]" onClick={close}>
      <div
        data-search-palette
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian global"
      >
        <div className="m-2 flex h-13 items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15">
          <Search className="h-5 w-5 shrink-0 text-[var(--muted)]" aria-hidden="true" />
          <input
            role="combobox"
            aria-expanded="true"
            aria-controls="global-search-results"
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim().length < 2) setResults([]);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Cari: sepsis, amoksisilin, J18, CURB…"
            className="h-full min-w-0 flex-1 bg-transparent text-base text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
            autoFocus
          />
          <button type="button" onClick={close} aria-label="Tutup pencarian" className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-md text-[var(--muted)] transition-colors hover:bg-black/5 hover:text-[var(--ink)] dark:hover:bg-white/5">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div id="global-search-results" role="listbox" className="thin-scroll max-h-[min(60vh,32rem)] overflow-y-auto border-t border-[var(--line)] p-2">
          {query.trim().length < 2 ? (
            <div className="px-3 py-5 text-center">
              <p className="text-sm text-[var(--muted)]">Ketik minimal 2 karakter untuk mencari seluruh pustaka klinis.</p>
              <p className="mt-1 text-xs text-zinc-400">Coba “sepsis”, “DBD”, “J18”, atau nama obat.</p>
            </div>
          ) : flat.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">Tidak ada hasil untuk “{query}”.</p>
          ) : (
            results.map((group) => (
              <div key={group.key} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{group.label}</div>
                {group.hits.map((hit) => {
                  const idx = flat.indexOf(hit);
                  return <SearchRow key={hit.id + hit.href} hit={hit} active={idx === active} onSelect={() => openHref(hit.href)} onHover={() => setActive(idx)} />;
                })}
              </div>
            ))
          )}
        </div>

        {flat.length > 0 && (
          <div className="flex items-center gap-4 border-t border-[var(--line)] px-4 py-2 text-[10px] text-[var(--muted)]">
            <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> Buka</span>
            <span>↑↓ Pilih</span>
            <span className="ml-auto">Esc Tutup</span>
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
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={`focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${active ? "bg-accent/10 text-[var(--ink)]" : "text-[var(--ink)] hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"}`}
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
