import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Users, Star, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Kenali lebih dalam komunitas Soraku — siapa kami, visi kami, dan nilai-nilai yang kami pegang.",
};

const PILLARS = [
  {
    icon: "🌸",
    title: "Inklusif",
    desc: "Terbuka untuk semua kalangan, tanpa judgment. Semua orang berhak menjadi bagian dari Soraku.",
  },
  {
    icon: "🎌",
    title: "Pasionat",
    desc: "Dibangun oleh pecinta budaya Jepang, untuk pecinta budaya Jepang. Passion adalah fondasi kami.",
  },
  {
    icon: "💙",
    title: "Non-profit",
    desc: "Kami tidak mencari keuntungan. Setiap donasi kembali ke komunitas untuk acara & pengembangan platform.",
  },
  {
    icon: "✨",
    title: "Kreatif",
    desc: "Mendorong ekspresi kreatif — dari fanart, cosplay, tulisan, hingga musik.",
  },
];

const TEAM = [
  { name: "Riu",   role: "Owner & Koordinator",    emoji: "👑" },
  { name: "Sora",  role: "Core / Full Stack Lead",  emoji: "⚙️" },
  { name: "Bubu",  role: "Front-end Developer",     emoji: "🎨" },
  { name: "Kaizo", role: "Back-end Developer",      emoji: "🔧" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-blob bg-primary/6 absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full blur-[120px]" />
          <div className="animate-blob animation-delay-2000 absolute -bottom-20 -right-10 h-[360px] w-[360px] rounded-full bg-[#E8C2A8]/5 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <div className="border-primary/20 bg-primary/8 text-primary/80 mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase">
            <span className="bg-primary/70 h-1.5 w-1.5 animate-pulse rounded-full" />
            Tentang Soraku
          </div>
          <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-black leading-none tracking-tight">
            <span className="text-foreground/90">Komunitas </span>
            <span className="text-gradient">yang tumbuh</span>
            <span className="text-foreground/90"> bersama</span>
          </h1>
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed sm:text-base max-w-xl mx-auto">
            Soraku Community adalah platform komunitas non-profit berbasis Indonesia untuk penggemar anime, manga, J-Music, VTuber, cosplay, dan semua yang berhubungan dengan budaya Jepang.
          </p>
        </div>
      </section>

      {/* Origin story */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="glass-card p-8 sm:p-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-xl">空</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Asal Nama</p>
                <h2 className="font-bold text-foreground">Mengapa "Soraku"?</h2>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">空</strong> (Sora) dalam bahasa Jepang berarti "langit" — simbol kebebasan, keluasan, dan kemungkinan tanpa batas. Ditambah <strong className="text-foreground">-ku</strong> sebagai sufiks possesif, <strong className="text-foreground">Soraku</strong> berarti "langitku" — sebuah ruang yang dimiliki oleh setiap anggotanya.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Berdiri sejak 2023, Soraku hadir sebagai rumah bagi mereka yang ingin berbagi passion tentang budaya Jepang tanpa barrier — semua usia, semua latar belakang, dari seluruh penjuru Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary/60">Nilai Kami</p>
            <h2 className="text-2xl font-bold sm:text-3xl">Pilar Soraku Community</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon, title, desc }) => (
              <div key={title} className="glass-card p-6 text-center transition-all hover:-translate-y-1">
                <span className="mb-3 block text-3xl">{icon}</span>
                <h3 className="mb-2 font-bold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary/60">Tim</p>
            <h2 className="text-2xl font-bold sm:text-3xl">Di balik layar</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {TEAM.map(({ name, role, emoji }) => (
              <div key={name} className="glass-card flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                  {emoji}
                </div>
                <div>
                  <p className="font-bold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold">Siap bergabung?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Jadi bagian dari Soraku dan temukan komunitasmu.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
              Daftar Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/8 px-6 py-3 text-sm font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/15">
              Discord Server
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
