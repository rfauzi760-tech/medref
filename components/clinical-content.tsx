import type { ClinicalContentItem } from "@/lib/types";

type Tone = "neutral" | "accent" | "danger" | "warning" | "success";

const dotClasses: Record<Tone, string> = {
  neutral: "bg-zinc-400 dark:bg-zinc-500",
  accent: "bg-accent",
  danger: "bg-red-500",
  warning: "bg-amber-500",
  success: "bg-emerald-500",
};

function InlineText({ text }: { text: string }) {
  const separator = text.indexOf(":");
  const prefix = separator > 0 ? text.slice(0, separator).trim() : "";
  if (separator < 1 || prefix.length > 72 || /https?\/\//i.test(prefix)) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold text-[var(--ink)]">{prefix}:</strong>
      {text.slice(separator + 1)}
    </>
  );
}

function NestedList({ items, tone, depth = 0 }: { items: ClinicalContentItem[]; tone: Tone; depth?: number }) {
  return (
    <ul className={depth === 0 ? "space-y-3" : "mt-2 space-y-2 border-l border-[var(--line)] pl-4 sm:pl-5"}>
      {items.map((item, index) =>
        typeof item === "string" ? (
          <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            <span
              aria-hidden="true"
              className={`${dotClasses[tone]} mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full ${depth > 0 ? "opacity-70" : ""}`}
            />
            <span className="min-w-0"><InlineText text={item} /></span>
          </li>
        ) : (
          <li key={`${item.heading}-${index}`} className="pt-1 first:pt-0">
            <h3 className="text-sm font-bold leading-6 text-[var(--ink)]">{item.heading}</h3>
            {item.children.length > 0 && <NestedList items={item.children} tone={tone} depth={depth + 1} />}
          </li>
        ),
      )}
    </ul>
  );
}

export function ClinicalContent({
  items,
  tone = "neutral",
  variant = "list",
  className = "",
}: {
  items: ClinicalContentItem[];
  tone?: Tone;
  variant?: "list" | "prose";
  className?: string;
}) {
  if (variant === "list") return <div className={className}><NestedList items={items} tone={tone} /></div>;

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) =>
        typeof item === "string" ? (
          <p key={`${item}-${index}`} className="text-sm leading-6 text-zinc-600 dark:text-zinc-300"><InlineText text={item} /></p>
        ) : (
          <section key={`${item.heading}-${index}`} className="space-y-2">
            <h3 className="text-sm font-bold leading-6 text-[var(--ink)]">{item.heading}</h3>
            {item.children.length > 0 && <NestedList items={item.children} tone={tone} depth={1} />}
          </section>
        ),
      )}
    </div>
  );
}
