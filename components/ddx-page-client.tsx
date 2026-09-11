"use client";

import { useEffect, useMemo, useState } from "react";
import { BackLink, EmptyState, PageHeader, SectionBand } from "@/components/shared";

interface Finding { id:string; label:string; group:string }
interface Result { id:string; diagnosis:string; specialty:string; cantMiss:boolean; score:number; matchedFindings:string[]; nextStep:string }

export default function DdxPageClient() {
  const [findings,setFindings]=useState<Finding[]>([]), [selected,setSelected]=useState<string[]>([]), [results,setResults]=useState<Result[]>([]), [loading,setLoading]=useState(false);
  useEffect(()=>{fetch('/api/ddx',{cache:'no-store'}).then(r=>r.json()).then((d:{findings:Finding[]})=>setFindings(d.findings));},[]);
  useEffect(()=>{if(!selected.length)return; const controller=new AbortController(); const timer=setTimeout(()=>fetch('/api/ddx',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({selected}),signal:controller.signal}).then(r=>r.json()).then((d:{items:Result[]})=>setResults(d.items)).then(()=>setLoading(false)).catch(()=>undefined),120); return()=>{clearTimeout(timer);controller.abort();};},[selected]);
  const groups=useMemo(()=>[...new Set(findings.map(x=>x.group))],[findings]);
  const toggle=(id:string)=>{const next=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id]; setSelected(next); if(!next.length)setResults([]); setLoading(next.length>0);};
  const labels=new Map(findings.map(x=>[x.id,x.label]));
  return <div><BackLink href="/igd-toolkit" label="Kembali ke Toolkit IGD"/><PageHeader title="Mesin Diagnosis Banding" description="Pilih temuan klinis untuk menyusun prioritas diagnosis banding dan kondisi yang tidak boleh terlewat."/>
    <div className="rounded-lg border border-amber-400/40 bg-amber-50 p-4 text-xs leading-5 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100"><strong className="block font-bold">Bukan alat diagnosis</strong>Hasil hanya pengingat terstruktur. Stabilkan ABC, tangani kondisi mengancam nyawa, dan gunakan anamnesis serta pemeriksaan lengkap.</div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"><section className="workspace-panel overflow-hidden"><SectionBand>Temuan klinis</SectionBand><div className="space-y-5 p-5">{groups.map(group=><fieldset key={group}><legend className="text-xs font-bold">{group}</legend><div className="mt-2 grid gap-2">{findings.filter(x=>x.group===group).map(item=><label key={item.id} data-active={selected.includes(item.id)} className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--line)] p-3 text-xs leading-5 data-[active=true]:border-accent data-[active=true]:bg-accent/10"><input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggle(item.id)} className="mt-0.5"/><span className="font-medium">{item.label}</span></label>)}</div></fieldset>)}</div></section>
      <section><h2 className="display-type mb-3 text-xl font-bold">Prioritas diagnosis banding</h2>{loading?<p className="text-sm text-[var(--muted)]">Menghitung...</p>:results.length===0?<EmptyState message="Pilih minimal satu temuan klinis."/>:<div className="workspace-panel overflow-hidden">{results.map((item,index)=><article key={item.id} className="index-row p-4"><div className="flex items-start gap-3"><span className="font-mono text-xs text-[var(--muted)]">{String(index+1).padStart(2,'0')}</span><div><div className="flex flex-wrap items-center gap-2"><h3 className="display-type text-sm font-bold">{item.diagnosis}</h3>{item.cantMiss&&<span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-300">Jangan terlewat</span>}</div><p className="mt-1 text-[10px] font-bold text-accent-strong dark:text-accent">{item.specialty}</p><p className="mt-3 text-xs leading-5 text-[var(--muted)]"><strong className="text-[var(--ink)]">Temuan cocok:</strong> {item.matchedFindings.map(id=>labels.get(id)).join(', ')}</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]"><strong className="text-[var(--ink)]">Langkah berikut:</strong> {item.nextStep}</p></div></div></article>)}</div>}</section>
    </div>
  </div>;
}
