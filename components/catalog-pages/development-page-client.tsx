"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { MilestoneAge } from "@/lib/types";
import { PageHeader } from "@/components/shared";
import { PrintButton } from "@/components/action-buttons";

type DevelopmentPageProps = {
  milestoneAges: MilestoneAge[];
  milestoneDomains: { key: "gross" | "fine" | "language" | "social" | "cognitive"; label: string; icon: string }[];
  developmentRedFlags: string[];
  developmentSources: { org: string; title: string; url: string }[];
  kpspScheduleMonths: number[];
};

function monthsSince(dateValue: string): number {
  const birth = new Date(`${dateValue}T00:00:00`);
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

function milestoneForAge(items: MilestoneAge[], ageMonths: number): MilestoneAge | null {
  let best: MilestoneAge | null = null;
  for (const item of items) {
    if (ageMonths >= item.ageMonths) best = item;
  }
  return best;
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function GuideSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="workspace-panel group p-4 sm:p-5">
      <summary className="cursor-pointer list-none font-bold text-zinc-800 marker:hidden dark:text-zinc-100">
        <span className="mr-2 inline-block text-accent transition-transform group-open:rotate-90" aria-hidden="true">›</span>
        {title}
      </summary>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{children}</div>
    </details>
  );
}

export default function DevelopmentPageClient({
  milestoneAges,
  milestoneDomains,
  developmentRedFlags,
  developmentSources,
  kpspScheduleMonths,
}: DevelopmentPageProps) {
  const [dob, setDob] = useState("");
  const [ageMonths, setAgeMonths] = useState<number | "">("");
  const [gestationalWeeks, setGestationalWeeks] = useState<number | "">("");

  const chronologicalAge = dob
    ? monthsSince(dob)
    : typeof ageMonths === "number" && Number.isFinite(ageMonths) ? ageMonths : null;
  const isPreterm = typeof gestationalWeeks === "number" && gestationalWeeks >= 22 && gestationalWeeks < 37;
  const applyCorrection = isPreterm && chronologicalAge !== null && chronologicalAge < 24;
  const correctedAge = applyCorrection
    ? Math.max(0, chronologicalAge! - ((40 - Number(gestationalWeeks)) * 7) / 30.4375)
    : chronologicalAge;
  const effectiveAge = correctedAge === null ? null : Math.floor(correctedAge);
  const entry = useMemo(
    () => effectiveAge !== null && effectiveAge >= 0 && effectiveAge <= 72
      ? milestoneForAge(milestoneAges, effectiveAge)
      : null,
    [effectiveAge, milestoneAges],
  );
  const nextKpspAge = effectiveAge === null ? null : kpspScheduleMonths.find((month) => month >= effectiveAge) ?? null;

  const setMonthAge = (value: number) => {
    setDob("");
    setGestationalWeeks("");
    setAgeMonths(value);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perkembangan Anak"
      />

      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
        <strong className="font-bold">Gunakan sebagai panduan, bukan diagnosis.</strong> Contoh kemampuan di bawah membantu observasi, bukan daftar syarat yang harus dikuasai tepat pada bulan tertentu. Kekhawatiran orang tua, hilangnya kemampuan, atau hasil skrining tidak normal tetap perlu dinilai tenaga kesehatan.
      </div>

      <section className="workspace-panel space-y-4 p-5" aria-labelledby="age-check-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="age-check-title" className="text-lg font-bold">Lihat gambaran sesuai usia</h2>
          <PrintButton />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-semibold">
            Tanggal lahir
            <input
              type="date"
              value={dob}
              onChange={(event) => { setDob(event.target.value); setAgeMonths(""); }}
              className="focus-ring mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 font-normal"
            />
          </label>
          <label className="block text-sm font-semibold">
            Atau usia (bulan)
            <input
              type="number"
              min={0}
              max={72}
              step={1}
              value={ageMonths}
              onChange={(event) => { setAgeMonths(event.target.value === "" ? "" : Number(event.target.value)); setDob(""); }}
              placeholder="Contoh: 18"
              className="focus-ring mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 font-normal"
            />
          </label>
          <label className="block text-sm font-semibold">
            Usia gestasi saat lahir, bila prematur
            <input
              type="number"
              min={22}
              max={42}
              step={1}
              value={gestationalWeeks}
              onChange={(event) => setGestationalWeeks(event.target.value === "" ? "" : Number(event.target.value))}
              placeholder="Minggu, opsional"
              className="focus-ring mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 font-normal"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Pilih usia perkembangan">
          {milestoneAges.map((milestone) => (
            <button
              key={milestone.ageMonths}
              type="button"
              onClick={() => setMonthAge(milestone.ageMonths)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${effectiveAge === milestone.ageMonths ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-line bg-surface text-zinc-600 hover:border-accent/60 dark:text-zinc-300"}`}
            >
              {milestone.label}
            </button>
          ))}
        </div>

        {entry ? (
          <div className="space-y-4 border-t border-line pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-bold">
                Contoh kemampuan yang diamati: {entry.label}
                {effectiveAge !== entry.ageMonths && <span className="ml-1 text-sm font-normal text-zinc-500">(acuan usia terdekat sebelumnya)</span>}
              </h3>
              {nextKpspAge !== null && <span className="text-xs text-zinc-500">Jadwal KPSP terdekat: {nextKpspAge} bulan</span>}
            </div>
            {applyCorrection && chronologicalAge !== null && (
              <p className="rounded-lg bg-surface-muted p-3 text-sm">
                Usia kronologis {chronologicalAge} bulan. Perkiraan usia koreksi {correctedAge?.toFixed(1)} bulan, digunakan untuk pemantauan bayi prematur sampai usia kronologis 2 tahun sesuai Buku KIA khusus bayi kecil.
              </p>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {milestoneDomains.map((domain) => (
                <article key={domain.key} className="rounded-lg border border-line bg-surface p-4">
                  <h4 className="mb-2 font-bold">{domain.icon} {domain.label}</h4>
                  <List items={entry.milestones[domain.key] ?? []} />
                </article>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              Ini adalah ringkasan observasi, bukan butir resmi KPSP dan bukan patokan diagnosis. Gunakan formulir KPSP sesuai usia dan Buku KIA untuk pemeriksaan terstandar.
            </p>
          </div>
        ) : chronologicalAge !== null ? (
          <p className="border-t border-line pt-4 text-sm text-zinc-600 dark:text-zinc-300">
            Ringkasan milestone dan KPSP di halaman ini mencakup usia 0 sampai 72 bulan. Untuk usia sekolah dan remaja, lanjutkan pemantauan perkembangan, belajar, perilaku, emosi, dan fungsi sehari-hari pada kunjungan kesehatan anak.
          </p>
        ) : (
          <p className="text-sm text-zinc-500">Pilih usia atau tanggal lahir untuk melihat ringkasan perkembangan. Bagian panduan klinis di bawah tetap dapat dibaca tanpa mengisi usia.</p>
        )}
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        <GuideSection title="Alur pemantauan dan skrining perkembangan">
          <p><strong className="font-bold">Pemantauan berkelanjutan:</strong> tanyakan kekhawatiran pengasuh, riwayat kehamilan dan kelahiran, penyakit, kemajuan kemampuan, serta kemungkinan regresi. Amati permainan dan interaksi, nilai semua domain, pertimbangkan pendengaran dan penglihatan, lalu catat di Buku KIA.</p>
          <p><strong className="font-bold">Skrining standar:</strong> KPSP adalah skrining perkembangan, bukan diagnosis. Seri usia SDIDTK yang lazim digunakan ialah:</p>
          <div className="flex flex-wrap gap-1.5">{kpspScheduleMonths.map((month) => <span key={month} className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs">{month} bln</span>)}</div>
          <p>Pilih formulir sesuai usia menurut petunjuk Buku KIA/SDIDTK. Bila usia berada di antara kelompok skrining, gunakan kelompok usia yang lebih muda sesuai petunjuk instrumen. Jadwal pelayanan terbaru di Buku KIA dan protokol fasilitas tetap diutamakan.</p>
          <p>IDAI PRIMA juga menyusun kunjungan pemantauan dari minggu pertama, bulan 1, 2, 4, 6, 9, 12, 15, 18, lalu usia 2, 2,5, 3, 4, 5, 6 tahun hingga remaja. Jadwal kunjungan tidak berarti setiap kunjungan memakai KPSP.</p>
        </GuideSection>

        <GuideSection title="KPSP: interpretasi dan tindak lanjut">
          <p>KPSP berisi 9 atau 10 pertanyaan sesuai kelompok umur. Jawab setiap butir hanya <strong className="font-bold">YA</strong> atau <strong className="font-bold">TIDAK</strong> berdasarkan kemampuan yang benar-benar dapat dilakukan; ikuti cara pemeriksaan dan alat bantu pada formulir resmi.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="font-bold">9-10 jawaban YA, sesuai umur:</strong> puji pengasuh, lanjutkan stimulasi dan pemantauan rutin dengan Buku KIA serta KPSP sesuai jadwal.</li>
            <li><strong className="font-bold">7-8 jawaban YA, meragukan:</strong> nilai kesehatan anak bila diperlukan, tingkatkan stimulasi, dan ulangi KPSP 2 minggu kemudian. Jika hasil tetap meragukan atau mengarah ke penyimpangan, rujuk ke fasilitas pelayanan kesehatan tingkat lanjut.</li>
            <li><strong className="font-bold">6 atau kurang jawaban YA, kemungkinan penyimpangan:</strong> catat domain atau butir yang belum tercapai dan rujuk untuk evaluasi, jangan hanya menunggu skrining berikutnya.</li>
          </ul>
          <p>Hasil normal tidak menutup evaluasi bila keluarga atau klinisi masih khawatir. Bila ada kecurigaan gangguan bahasa, pendengaran, penglihatan, motorik, atau perkembangan sosial, pemeriksaan khusus dan intervensi dapat berjalan sambil evaluasi diagnostik.</p>
        </GuideSection>

        <GuideSection title="Tanda waspada dan kapan perlu evaluasi">
          <List items={developmentRedFlags} />
          <p>Rujuk untuk penilaian dokter anak atau layanan perkembangan bila ada kekhawatiran menetap, hasil KPSP meragukan berulang atau menyimpang, regresi, keterlambatan beberapa domain, gerak tidak simetris, atau kecurigaan gangguan dengar/lihat. Kejang baru, kelemahan mendadak, penurunan kesadaran, atau regresi akut memerlukan pertolongan segera.</p>
          <p>Untuk bahasa dan komunikasi, IDAI menyoroti tidak ada suara sampai 6 bulan, tidak mengoceh sampai 12 bulan, belum ada kata bermakna pada 16 bulan, tidak menunjuk untuk berbagi minat sekitar 20 bulan, belum ada frasa bermakna setelah 24 bulan, ucapan sulit dipahami orang tua setelah 30 bulan, respons bunyi tidak konsisten, serta hilangnya kemampuan bicara.</p>
        </GuideSection>

        <GuideSection title="Bayi prematur, risiko tinggi, dan skrining lain">
          <p>Pada bayi lahir kurang bulan, usia koreksi memperhitungkan selisih usia gestasi dari 40 minggu. Kementerian Kesehatan menganjurkan penggunaan Buku KIA khusus bayi kecil dan pemantauan dengan usia koreksi sampai usia kronologis 2 tahun. Hasil tetap perlu dibaca bersama riwayat neonatal, pemeriksaan, serta kurva pertumbuhan.</p>
          <p>Bayi dengan prematuritas atau komplikasi perinatal, gangguan neurologis/genetik, gangguan pendengaran/penglihatan, penyakit kronis, atau kekhawatiran keluarga memerlukan pemantauan lebih dekat dan ambang rujukan yang lebih rendah.</p>
          <p>KPSP tidak menggantikan skrining autisme, perilaku, emosi, pendengaran, maupun penglihatan. Kemenkes mencantumkan M-CHAT-R, KMPE, dan skrining GPPH sesuai risiko atau indikasi. Rekomendasi AAP menyebut skrining perkembangan umum pada 9, 18, dan 30 bulan serta skrining spesifik autisme pada 18 dan 24 bulan; ikuti kebijakan dan instrumen lokal yang berlaku.</p>
        </GuideSection>

        <GuideSection title="Stimulasi harian menurut domain">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><h4 className="mb-1 font-bold">Motorik kasar dan halus</h4><p>Sediakan permainan lantai yang aman, benda untuk diraih atau disusun, aktivitas luar ruang sesuai usia, dan kesempatan mencoba makan, menggambar, atau berpakaian sendiri dengan pengawasan.</p></div>
            <div><h4 className="mb-1 font-bold">Bahasa dan komunikasi</h4><p>Ajak bicara dua arah saat rutinitas, tunggu respons anak, sebut nama benda, bacakan buku, bernyanyi, dan kembangkan kata atau isyarat yang digunakan anak. Periksa pendengaran jika respons suara meragukan.</p></div>
            <div><h4 className="mb-1 font-bold">Sosial dan emosi</h4><p>Tanggapi isyarat anak dengan hangat, bermain bergiliran, lakukan permainan pura-pura, beri nama pada emosi, serta latih kemandirian tanpa hukuman atau paksaan.</p></div>
            <div><h4 className="mb-1 font-bold">Kognitif dan adaptif</h4><p>Biarkan anak mengeksplorasi dengan aman, bermain mencocokkan dan menyortir, menyelesaikan masalah sederhana, serta membantu tugas rumah yang sesuai usia.</p></div>
          </div>
          <p>Selaraskan kebutuhan dasar <strong className="font-bold">asuh</strong> (kesehatan dan pemenuhan kebutuhan fisik), <strong className="font-bold">asih</strong> (kasih sayang dan rasa aman), serta <strong className="font-bold">asah</strong> (stimulasi dan kesempatan belajar). Stimulasi terbaik berlangsung dalam hubungan yang responsif, konsisten, menyenangkan, dan sesuai minat serta kesiapan anak. Hindari membandingkan anak atau memaksa target akademik sebelum siap.</p>
        </GuideSection>

        <GuideSection title="Usia sekolah dan remaja">
          <p>KPSP digunakan untuk rentang usia dini sesuai instrumennya. Setelah usia prasekolah, pemantauan berlanjut pada kesiapan dan fungsi di rumah, sekolah, serta lingkungan sosial, bukan hanya kemampuan membaca atau berhitung.</p>
          <p>IDAI menekankan kesiapan sekolah melalui gabungan motorik kasar dan halus, bahasa reseptif dan ekspresif, kognitif, sosial-emosional, kemandirian, literasi awal, dan numerasi. Pada anak sekolah dan remaja, tanyakan juga fungsi belajar, hubungan sosial, perilaku, suasana hati, tidur, dan kemampuan melakukan aktivitas sehari-hari; lakukan evaluasi sesuai keluhan.</p>
        </GuideSection>
      </div>

      <section className="workspace-panel p-5" aria-labelledby="development-sources-title">
        <h2 id="development-sources-title" className="mb-3 text-base font-bold">Sumber utama</h2>
        <ul className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {developmentSources.map((source) => (
            <li key={source.url}>
              <a className="font-medium text-accent-strong underline decoration-accent/40 underline-offset-2 hover:decoration-accent dark:text-accent" href={source.url} target="_blank" rel="noreferrer">
                {source.org}: {source.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
