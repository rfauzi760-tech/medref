import type { Metadata } from "next";
import { BackLink, PageHeader } from "@/components/shared";
import { ECG_MODULE_MEETINGS, type EcgModuleBlock } from "@/lib/data/ecg-module";
import illustrations from "@/lib/data/ecg-module-illustrations.json";

export const metadata: Metadata = {
  title: "Modul EKG | RFSmed",
  description: "Kurikulum EKG lima bab berbahasa Indonesia dengan rujukan guideline dan jurnal primer.",
};

function imagesForMeeting(number: number) {
  return illustrations.flatMap((image, index) => image.chapter === number ? [{
    src: `/api/ecg-module-image/${index}`,
    title: image.caption,
  }] : []);
}

function DetailBlocks({ blocks }: { blocks: EcgModuleBlock[] }) {
  return (
    <div className="mt-7 space-y-6 border-t border-[var(--line)] pt-6">
      <h2 className="text-base font-bold text-[var(--foreground)]">Materi lengkap</h2>
      {blocks.map((block, index) => {
        if (block.kind === "heading") return (
          <section key={`${block.kind}-${index}`}>
            <h3 className="text-sm font-bold text-[var(--foreground)]">{block.title}</h3>
            {block.text && <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{block.text}</p>}
          </section>
        );
        if (block.kind === "bullets") return (
          <section key={`${block.kind}-${index}`}>
            {block.title && <h3 className="text-sm font-bold text-[var(--foreground)]">{block.title}</h3>}
            <ul className={`${block.title ? "mt-2" : ""} space-y-2 text-sm leading-7 text-[var(--muted)]`}>
              {block.items.map((item) => <li key={item} className="pl-4 before:absolute before:-ml-4 before:content-['•']">{item}</li>)}
            </ul>
          </section>
        );
        if (block.kind === "table") return (
          <section key={`${block.kind}-${index}`} className="overflow-hidden rounded-xl border border-[var(--line)]">
            {block.title && <h3 className="border-b border-[var(--line)] bg-black/[0.025] px-4 py-3 text-sm font-bold text-[var(--foreground)] dark:bg-white/[0.025]">{block.title}</h3>}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm leading-6">
                <thead className="bg-black/[0.025] dark:bg-white/[0.025]"><tr>{block.headers.map((header) => <th key={header} className="px-4 py-3 font-bold text-[var(--foreground)]">{header}</th>)}</tr></thead>
                <tbody>{block.rows.map((row, rowIndex) => <tr key={`${index}-${rowIndex}`} className="border-t border-[var(--line)]">{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top text-[var(--muted)]">{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </section>
        );
        if (block.kind === "algorithm") return (
          <section key={`${block.kind}-${index}`}>
            <h3 className="text-sm font-bold text-[var(--foreground)]">{block.title}</h3>
            <ol className="mt-2 space-y-3">
              {block.steps.map((step, stepIndex) => <li key={step.label} className="flex gap-3 text-sm leading-7 text-[var(--muted)]"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent-strong dark:text-accent">{stepIndex + 1}</span><span><strong className="font-bold text-[var(--foreground)]">{step.label}.</strong> {step.text}</span></li>)}
            </ol>
          </section>
        );
        return (
          <section key={`${block.kind}-${index}`}>
            <h3 className="text-sm font-bold text-[var(--foreground)]">{block.title}</h3>
            <div className="mt-3 space-y-3">
              {block.cases.map((item) => <article key={item.title} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><h4 className="text-sm font-bold text-[var(--foreground)]">{item.title}</h4><p className="mt-1.5 text-sm leading-7 text-[var(--muted)]">{item.text}</p></article>)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function EcgModulePage() {
  return (
    <div>
      <BackLink href="/" label="Kembali ke beranda" />
      <PageHeader
        title="Modul EKG"
        description="Kurikulum orisinal lima bab untuk membaca EKG secara sistematis, mengenali kegawatan, dan mengomunikasikan hasil dengan jelas."
        count={ECG_MODULE_MEETINGS.length}
        countLabel="bab"
      />

      <section className="mb-5 rounded-xl border border-amber-300/50 bg-amber-50/60 p-4 text-sm leading-6 text-amber-950 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-100">
        <strong className="font-bold">Catatan penggunaan.</strong> Materi ini adalah ringkasan pendidikan orisinal, bukan salinan modul Auctus. Gunakan bersama penilaian klinis, guideline terbaru, dan protokol institusi.
      </section>

      <div className="space-y-3">
        {ECG_MODULE_MEETINGS.map((meeting, index) => (
          <details key={meeting.number} open={index === 0} className="workspace-panel overflow-hidden">
            <summary className="focus-ring cursor-pointer list-none px-4 py-4 hover:bg-black/[0.025] dark:hover:bg-white/[0.025]">
              <span className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent-strong dark:text-accent">{meeting.number}</span>
                <span className="min-w-0 flex-1">
                  <strong className="display-type block text-base font-bold">Bab {meeting.number}: {meeting.title}</strong>
                  <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{meeting.summary}</span>
                </span>
              </span>
            </summary>
            <div className="border-t border-[var(--line)] px-4 py-5 sm:px-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <section>
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Tujuan belajar</h2>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--muted)]">
                    {meeting.objectives.map((item) => <li key={item} className="pl-4 before:absolute before:-ml-4 before:content-['•']">{item}</li>)}
                  </ul>
                </section>
                <section>
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Latihan</h2>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--muted)]">
                    {meeting.practice.map((item) => <li key={item} className="pl-4 before:absolute before:-ml-4 before:content-['•']">{item}</li>)}
                  </ul>
                </section>
              </div>

              <div className="mt-6 space-y-4">
                {meeting.lessons.map((lesson) => (
                  <section key={lesson.title} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                    <h2 className="text-sm font-bold text-[var(--foreground)]">{lesson.title}</h2>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--muted)]">
                      {lesson.points.map((point) => <li key={point} className="pl-4 before:absolute before:-ml-4 before:content-['•']">{point}</li>)}
                    </ul>
                  </section>
                ))}
              </div>

              {imagesForMeeting(meeting.number).length > 0 && (
                <section className="mt-6 border-t border-[var(--line)] pt-4">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Gambar referensi</h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Contoh rekaman untuk latihan pada bab ini. Buka gambar untuk melihat lebih besar.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {imagesForMeeting(meeting.number).map((image) => (
                      <figure key={`${meeting.number}-${image.src}`} className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                        <a href={image.src} target="_blank" rel="noreferrer" className="block">
                          <img src={image.src} alt={image.title} loading="lazy" className="aspect-[4/3] w-full object-contain" />
                        </a>
                        <figcaption className="px-3 py-2 text-xs font-semibold leading-5 text-[var(--muted)]">{image.title}</figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {meeting.detailBlocks && <DetailBlocks blocks={meeting.detailBlocks} />}

              <section className="mt-6 border-t border-[var(--line)] pt-4">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Sumber rujukan</h2>
                <ol className="mt-2 space-y-2 text-sm leading-6 text-[var(--muted)]">
                  {meeting.sources.map((source) => (
                    <li key={source.url}>
                      <a className="underline decoration-accent/50 underline-offset-2 hover:text-accent-strong dark:hover:text-accent" href={source.url} target="_blank" rel="noreferrer">
                        {source.org}. {source.title} ({source.year})
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
