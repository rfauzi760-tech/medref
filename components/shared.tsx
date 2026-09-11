"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SectionBand({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="section-band justify-between">
      <div className="display-type text-base font-medium">{children}</div>
      {action}
    </div>
  );
}

export function PageHeader({ title, description, count, countLabel }: { title: string; description?: string; count?: number; countLabel?: string }) {
  return (
    <div className="mb-7 border-b border-[var(--line)] pb-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="display-type text-3xl font-light leading-tight tracking-tight sm:text-4xl">{title}</h1>
        {count !== undefined && (
          <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 font-mono text-[10px] font-medium text-accent-strong dark:text-accent">
            {count} {countLabel}
          </span>
        )}
      </div>
      {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{description}</p>}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="focus-ring no-print mb-5 inline-flex items-center gap-1 rounded text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)]">
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function FilterInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative mb-5 max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[var(--muted)]"
      />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="workspace-panel border-dashed py-12 text-center text-sm text-[var(--muted)]">{message}</div>;
}

export interface ToolCardData {
  slug: string;
  title: string;
  abbreviation?: string;
  description: string;
  href: string;
  specialties: string[];
  badge?: string;
}

export function ToolCard({ tool }: { tool: ToolCardData }) {
  return (
    <Link
      href={tool.href}
      className="index-row focus-ring group flex min-h-28 flex-col px-4 py-4 first:rounded-t-xl last:rounded-b-xl sm:px-5"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="display-type text-base font-medium leading-snug group-hover:text-accent-strong dark:group-hover:text-accent">{tool.title}</h3>
        {tool.badge && <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{tool.badge}</span>}
      </div>
      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--muted)]">{tool.description}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {tool.specialties.slice(0, 3).map((s) => (
          <span key={s} className="rounded bg-accent/8 px-1.5 py-0.5 text-[10px] font-medium text-accent-strong/80 dark:text-accent/80">
            {s}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function useFiltered<T extends { title: string }>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => i.title.toLowerCase().includes(q));
}

/** Scroll restoration helper - resets scroll on route change. */
export function useScrollReset() {
  const router = useRouter();
  useEffect(() => {
    const onPop = () => window.scrollTo(0, 0);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [router]);
}
