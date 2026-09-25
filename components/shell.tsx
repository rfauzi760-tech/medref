"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { modules, appName } from "@/lib/nav";
import { GlobalSearch } from "@/components/global-search";
import { ThemeToggle } from "@/components/theme-toggle";

export function Shell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pediatricDrugMode = pathname.startsWith("/drugs") && searchParams.get("mode") === "anak";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/drugs?mode=anak") return pediatricDrugMode;
    if (href === "/drugs") return pathname.startsWith("/drugs") && !pediatricDrugMode;
    return pathname.startsWith(href.split("?")[0]);
  };

  const nav = (
    <nav aria-label="Navigasi klinis" className="flex flex-col gap-1 px-3 pb-4">
      {modules.filter((module) => module.showInNav !== false).map((m) => {
        const Icon = m.icon;
        const active = isActive(m.href);
        return (
          <Link
            key={m.slug}
            href={m.href}
            onClick={() => setMobileOpen(false)}
            data-active={active}
            className="focus-ring flex min-h-9 items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-[13px] text-[var(--muted)] transition-colors hover:bg-black/[0.035] hover:text-[var(--ink)] dark:hover:bg-white/[0.05]"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{m.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <Link href="/" onClick={() => setMobileOpen(false)} className="focus-ring flex items-center gap-2.5 rounded-lg px-4 py-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-white p-1">
        <Image src="/rfsmed-symbol.svg" alt="" width={24} height={24} priority />
      </span>
      <span className="display-type block text-[15px] font-bold leading-tight">{appName}</span>
    </Link>
  );

  return (
    <div data-workspace-shell className="min-h-screen bg-[var(--canvas)]">
      {/* Desktop sidebar */}
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-[var(--line)] bg-[var(--surface)] lg:flex">
        {brand}
        <div className="thin-scroll flex-1 overflow-y-auto">{nav}</div>
      </aside>

      {/* Mobile top bar */}
      <header className="no-print sticky top-0 z-30 flex items-center gap-2 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 py-2 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka navigasi"
          className="focus-ring rounded-lg p-2 text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent/40 bg-white p-1">
            <Image src="/rfsmed-symbol.svg" alt="" width={20} height={20} priority />
          </span>
          <span className="text-sm font-semibold">{appName}</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-[var(--line)] bg-[var(--surface)] shadow-xl">
            <div className="flex items-center justify-between pr-2">
              {brand}
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Tutup navigasi" className="rounded-lg p-2 text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="thin-scroll flex-1 overflow-y-auto">{nav}</div>
          </div>
        </div>
      )}

      <div className="lg:pl-[248px]">
        {/* Header search bar (desktop) */}
        <header className="no-print sticky top-0 z-20 hidden items-center gap-3 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-7 py-3 backdrop-blur lg:flex">
          <div className="w-full max-w-xl">
            <GlobalSearch />
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile search bar */}
        <div className="no-print px-3 pt-3 lg:hidden">
          <GlobalSearch />
        </div>

        <main className="mx-auto max-w-[1180px] px-4 py-7 lg:px-8 lg:py-10">{children}</main>

        <footer className="no-print mx-auto max-w-[1180px] px-4 pb-6 text-xs text-[var(--muted)] lg:px-8">
          <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--ink)]">Ketentuan Penggunaan</Link>
        </footer>

      </div>
    </div>
  );
}
