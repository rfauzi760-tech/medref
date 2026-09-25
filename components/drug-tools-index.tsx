import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DRUG_TOOL_GROUPS } from "@/lib/data/drug-tools";

export function DrugToolsIndex() {
  return <div className="grid gap-4 lg:grid-cols-2">
    {DRUG_TOOL_GROUPS.map((group) => <section key={group.title} className="workspace-panel p-5">
      <h2 className="display-type text-lg font-bold">{group.title}</h2>
      <div className="mt-3 grid gap-2">
        {group.links.map(([label, href]) => <Link key={href} href={href} className="focus-ring flex items-center justify-between rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:text-accent-strong dark:hover:text-accent"><span>{label}</span><ArrowUpRight className="h-4 w-4" /></Link>)}
      </div>
    </section>)}
  </div>;
}
