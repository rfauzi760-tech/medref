"use client";

import { Check, Copy, Printer, RotateCcw } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text, label = "Salin hasil" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-accent/50 hover:text-[var(--ink)] disabled:opacity-40"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Tersalin" : label}
    </button>
  );
}

export function ResetButton({ onReset, label = "Atur ulang" }: { onReset: () => void; label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onReset}
      className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-accent/50 hover:text-[var(--ink)]"
    >
      <RotateCcw className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

export function PrintButton() {
  return (
    <button
      type="button"
      aria-label="Cetak atau simpan PDF"
      onClick={() => window.print()}
      className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-accent/50 hover:text-[var(--ink)]"
    >
      <Printer className="h-3.5 w-3.5" />
      Cetak / PDF
    </button>
  );
}

export function SpecialtyTags({ specialties }: { specialties: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {specialties.map((s) => (
        <span key={s} className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent-strong dark:text-accent">
          {s}
        </span>
      ))}
    </div>
  );
}
