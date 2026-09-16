import { ArrowDown, ArrowRight } from "lucide-react";
import { NEONATAL_FLOW, type NeonatalFlowNode } from "@/lib/neonatal-resuscitation";

const rows = [
  ["preparation"],
  ["birth"],
  ["first-check"],
  ["routine-care", "initial-steps"],
  ["breathing-check"],
  ["distress-check", "ventilation"],
  ["cpap", "heart-rate-after-ventilation"],
  ["correct-ventilation"],
  ["heart-rate-after-correction"],
  ["continue-ventilation", "compressions"],
  ["heart-rate-after-compressions"],
  ["epinephrine"],
  ["persistent-bradycardia"],
  ["reversible-causes", "post-care"],
] as const;

const headings = new Map<number, string>([
  [0, "1. Persiapan dan penilaian awal"],
  [4, "2. Napas dan ventilasi"],
  [7, "3. Koreksi ventilasi"],
  [9, "4. Resusitasi lanjut"],
]);

const branchLabels = new Map<number, readonly [string, string]>([
  [3, ["Ya", "Tidak"]],
  [5, ["Tidak", "Ya"]],
  [6, ["Napas berat / sianosis", "Setelah ventilasi"]],
  [9, ["60–99/menit", "<60/menit"]],
  [13, ["Masih <60/menit", "≥60/menit"]],
]);

const nodeMap = new Map(NEONATAL_FLOW.map((node) => [node.id, node]));

function FlowCard({ node }: { node: NeonatalFlowNode }) {
  const surface = node.kind === "decision"
    ? "border-amber-400/60 bg-amber-50/70 dark:border-amber-500/45 dark:bg-amber-950/15"
    : node.kind === "terminal"
      ? "border-emerald-500/45 bg-emerald-50/70 dark:border-emerald-500/35 dark:bg-emerald-950/15"
      : "border-[var(--line)] bg-[var(--surface-raised)]";
  const kindLabel = node.kind === "decision" ? "Titik keputusan" : node.kind === "terminal" ? "Perawatan" : node.kind === "start" ? "Persiapan" : "Tindakan";

  return (
    <article id={`neonatal-${node.id}`} data-flow-node={node.id} className={`scroll-mt-24 rounded-xl border p-4 sm:p-5 ${surface}`}>
      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{kindLabel}</p>
      <h4 className="display-type text-base font-bold leading-snug sm:text-lg">{node.title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--ink)]">
        {node.body.map((line) => <li key={line} className="border-l-2 border-[var(--line)] pl-3">{line}</li>)}
      </ul>
      {node.branches.length > 0 && (
        <div className="mt-4 flex flex-col gap-1.5 border-t border-[var(--line)] pt-3">
          {node.branches.map((branch) => (
            <a key={`${node.id}-${branch.to}-${branch.label}`} href={`#neonatal-${branch.to}`} className="focus-ring group flex items-start gap-2 rounded-md px-2 py-1.5 text-xs font-semibold text-accent-strong hover:bg-accent/10 dark:text-accent">
              <ArrowRight aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{branch.label}<span className="font-normal text-[var(--muted)]"> → {nodeMap.get(branch.to)?.title}</span></span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export function NeonatalFlowchart() {
  return (
    <section aria-labelledby="neonatal-flow-title" className="min-w-0">
      <h2 id="neonatal-flow-title" className="display-type mb-4 text-xl font-bold">Skema resusitasi saat lahir</h2>
      <div className="space-y-0">
        {rows.map((row, index) => (
          <div key={row.join("-")}>
            {headings.has(index) && (
              <h3 className="mb-3 mt-6 border-b border-[var(--line)] pb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)] first:mt-0">{headings.get(index)}</h3>
            )}
            {index > 0 && !headings.has(index) && (
              <div aria-hidden="true" className="flex h-8 flex-col items-center justify-center text-accent-strong dark:text-accent">
                <span className="h-3 w-px bg-accent/50" /><ArrowDown className="h-4 w-4" />
              </div>
            )}
            {branchLabels.has(index) && (
              <div className="mb-2 hidden gap-3 md:grid md:grid-cols-2">
                {branchLabels.get(index)?.map((label) => <span key={label} className="text-center font-mono text-[10px] font-semibold uppercase tracking-wide text-accent-strong dark:text-accent">{label}</span>)}
              </div>
            )}
            <div className={`grid gap-3 ${row.length > 1 ? "md:grid-cols-2" : ""}`}>
              {row.map((id) => {
                const node = nodeMap.get(id);
                return node ? <FlowCard key={id} node={node} /> : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
