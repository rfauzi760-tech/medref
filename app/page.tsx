"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Heart } from "lucide-react";
import { GlobalSearch } from "@/components/global-search";
import { useFavorites, useRecentTools } from "@/components/use-local-store";
import { appName, modules } from "@/lib/nav";
import { SPECIALTIES } from "@/lib/specialties";

const primaryModuleSlugs = [
  "igd-toolkit",
  "scores",
  "emergency",
  "timer",
  "pediatric-emergency",
  "neonatal-resuscitation",
  "emergency-dose",
  "bilirubin",
  "antidotes",
  "pregnancy-drugs",
  "electrolytes",
  "ddx",
] as const;
const primaryModules = new Set<string>(primaryModuleSlugs);

export default function Home() {
  const { recent } = useRecentTools();
  const { favorites } = useFavorites();
  const visibleModules = modules.filter((module) => module.showInNav !== false);
  const primary = primaryModuleSlugs
    .map((slug) => modules.find((module) => module.slug === slug))
    .filter((module) => module !== undefined);
  const secondary = visibleModules.filter((module) => !primaryModules.has(module.slug));

  return (
    <div className="space-y-12">
      <section className="grid gap-6 border-b border-[var(--line)] pb-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/35 bg-[#eefbf3] p-2.5 sm:h-20 sm:w-20">
            <Image src="/rfsmed-mark.png" alt="Logo RFSmed" width={80} height={80} priority />
          </span>
          <h1 className="display-type text-4xl font-bold tracking-[-0.04em] sm:text-6xl">{appName}</h1>
        </div>
        <div className="workspace-panel p-3">
          <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">Cari seluruh pustaka</p>
          <GlobalSearch />
        </div>
      </section>

      {(recent.length > 0 || favorites.length > 0) && (
        <section className="grid gap-4 md:grid-cols-2">
          {recent.length > 0 && <SavedTools title="Terakhir dibuka" icon={<Clock className="h-4 w-4" />} items={recent} />}
          {favorites.length > 0 && <SavedTools title="Favorit" icon={<Heart className="h-4 w-4" />} items={favorites} />}
        </section>
      )}

      <section aria-labelledby="modules-title">
        <div className="mb-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-accent-strong dark:text-accent">Ruang kerja</p>
          <h2 id="modules-title" className="display-type mt-1 text-2xl font-bold">Modul klinis utama</h2>
        </div>
        <div className="workspace-panel grid overflow-hidden md:grid-cols-2">
          {primary.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.slug} href={module.href} className="index-row focus-ring group flex min-h-36 gap-4 p-5 md:odd:border-r md:[&:nth-last-child(-n+2)]:border-b-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent-strong dark:text-accent"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-4">
                    <span className="display-type text-lg font-medium">{module.name}</span>
                    {module.count > 0 && <span className="font-mono text-[10px] text-[var(--muted)]">{module.count}</span>}
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-[var(--muted)]">{module.description}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h2 className="display-type mb-3 text-xl font-bold">Layanan klinis lainnya</h2>
          <div className="workspace-panel overflow-hidden">
            {secondary.map((module) => {
              const Icon = module.icon;
              return (
                <Link key={module.slug} href={module.href} className="index-row focus-ring group flex items-center gap-3 px-4 py-3">
                  <Icon className="h-4 w-4 text-accent-strong dark:text-accent" />
                  <span className="flex-1 text-sm font-medium">{module.name}</span>
                  {module.count > 0 && <span className="font-mono text-[10px] text-[var(--muted)]">{module.count}</span>}
                  <ArrowUpRight className="h-3.5 w-3.5 text-[var(--muted)]" />
                </Link>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="display-type mb-3 text-xl font-bold">Per spesialisasi</h2>
          <div className="workspace-panel flex flex-wrap gap-2 p-4">
            {SPECIALTIES.map((specialty) => (
              <Link key={specialty.slug} href={`/specialties/${specialty.slug}`} className="focus-ring rounded-md border border-[var(--line)] px-2.5 py-1.5 text-[11px] text-[var(--muted)] transition-colors hover:border-accent/50 hover:text-[var(--ink)]">
                {specialty.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SavedTools({ title, icon, items }: { title: string; icon: React.ReactNode; items: { href: string; title: string; group: string }[] }) {
  return (
    <div className="workspace-panel overflow-hidden">
      <div className="section-band">
        <span className="text-accent-strong dark:text-accent">{icon}</span>
        <h2 className="display-type text-base font-bold">{title}</h2>
      </div>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="index-row focus-ring flex items-center justify-between gap-3 px-4 py-3 text-sm">
          <span className="truncate">{item.title}</span>
          <span className="font-mono text-[9px] uppercase text-[var(--muted)]">{item.group}</span>
        </Link>
      ))}
    </div>
  );
}
