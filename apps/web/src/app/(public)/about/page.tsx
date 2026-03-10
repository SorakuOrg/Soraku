import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { DiscordIcon } from "@/components/icons/custom-icons";

export const metadata: Metadata = {
  title: "Tentang Kami — Soraku Community",
  description:
    "空 (Sora) berarti langit — simbol kebebasan tanpa batas. Kenali visi, pilar, dan tim di balik komunitas Soraku.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: "🌸",
    title: "Inklusif",
    desc: "Terbuka untuk semua kalangan, tanpa judgment. Semua usia, semua latar belakang — langit ini milik semua.",
    gradient: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20",
    glow: "shadow-pink-500/10",
  },
  {
    icon: "🎌",
    title: "Pasionat",
    desc: "Dibangun oleh pecinta budaya Jepang, untuk pecinta budaya Jepang. Passion adalah fondasi kami.",
    gradient: "from-primary/20 to-blue-500/10",
    border: "border-primary/20",
    glow: "shadow-primary/10",
  },
  {
    icon: "💙",
    title: "Non-profit",
    desc: "Tidak mencari keuntungan. Setiap donasi kembali ke komunitas untuk acara & pengembangan platform.",
    gradient: "from-indigo-500/20 to-violet-500/10",
    border: "border-indigo-500/20",
    glow: "shadow-indigo-500/10",
  },
  {
    icon: "✨",
    title: "Kreatif",
    desc: "Mendorong ekspresi — fanart, cosplay, tulisan, musik. Setiap kreasi adalah kontribusi nyata.",
    gradient: "from-accent/20 to-yellow-500/10",
    border: "border-accent/20",
    glow: "shadow-accent/10",
  },
];

const TEAM = [
  {
    name: "Riu",
    role: "Owner & Koordinator",
    desc: "Pemimpin komunitas & pemegang visi Soraku",
    emoji: "👑",
    color: "from-yellow-400/20 to-amber-500/10",
    badge: "OWNER",
    badgeColor: "bg-yellow-400/15 text-yellow-300 border-yellow-400/20",
  },
  {
    name: "Sora",
    role: "Core / Full Stack Lead",
    desc: "Arsitektur platform, backend & infrastruktur",
    emoji: "⚙️",
    color: "from-primary/20 to-blue-500/10",
    badge: "FULL STACK",
    badgeColor: "bg-primary/15 text-primary border-primary/20",
  },
  {
    name: "Bubu",
    role: "Front-end Developer",
    desc: "UI/UX, design system & komponen visual",
    emoji: "🎨",
    color: "from-pink-500/20 to-rose-500/10",
    badge: "FRONT-END",
    badgeColor: "bg-pink-500/15 text-pink-300 border-pink-500/20",
  },
  {
    name: "Kaizo",
    role: "Back-end Developer",
    desc: "API, database, auth & integrasi layanan",
    emoji: "🔧",
    color: "from-violet-500/20 to-purple-500/10",
    badge: "BACK-END",
    badgeColor: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  },
];

const HIERARCHY = [
  { role: "OWNER",   desc: "Akses penuh — semua fitur & keputusan",   color: "text-yellow-300",  bg: "bg-yellow-400/10 border-yellow-400/20" },
  { role: "MANAGER", desc: "Moderasi konten, event & blog",            color: "text-orange-300",  bg: "bg-orange-400/10 border-orange-400/20" },
  { role: "ADMIN",   desc: "Moderasi member, galeri & agensi",         color: "text-primary",     bg: "bg-primary/10 border-primary/20" },
  { role: "AGENSI",  desc: "Kelola profil talent & VTuber",            color: "text-green-300",   bg: "bg-green-500/10 border-green-500/20" },
  { role: "KREATOR", desc: "Upload konten, blog & galeri",             color: "text-accent",      bg: "bg-accent/10 border-accent/20" },
  { role: "USER",    desc: "Browse, komentar & ikut event",            color: "text-muted-foreground", bg: "bg-muted/20 border-border/40" },
];

const PRINCIPLES = [
  { num: "01", title: "Community-first",    desc: "Setiap fitur harus berguna untuk komunitas, bukan sekadar showcase teknologi." },
  { num: "02", title: "Simple & accessible", desc: "UI harus bisa dipakai siapa saja, termasuk yang tidak tech-savvy." },
  { num: "03", title: "Transparent",        desc: "Roadmap terbuka, changelog publik, tidak ada keputusan tersembunyi." },
  { num: "04", title: "Sustainable",        desc: "Non-profit bukan berarti asal-asalan — platform harus stabil & terpelihara." },
  { num: "05", title: "Respect creator",    desc: "Proteksi karya, moderasi konten, dan attribution yang proper." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ══════════════════════════════════════
          HERO — Mascot + Quote Dramatis
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Sky atmosphere */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-blob absolute -top-48 -left-24 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[160px]" />
          <div className="animate-blob animation-delay-2000 absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-accent/6 blur-[140px]" />
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/2 h-[400px] w-[400px] rounded-full bg-primary/6 blur-[130px]" />
          {/* subtle grid */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.016]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="abgrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4FA3D1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#abgrid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[1fr_380px] lg:items-center lg:gap-16">

            {/* ── Left copy ── */}
            <div>
              {/* Eyebrow */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/70" />
                Tentang Soraku
              </div>

              {/* Kanji hero */}
              <div className="mb-5 flex items-end gap-4">
                <span
                  className="font-black leading-none text-gradient select-none"
                  style={{ fontSize: "clamp(6rem, 18vw, 12rem)", lineHeight: 0.85 }}
                >
                  空
                </span>
                <div className="mb-2">
                  <p className="text-sm font-bold text-foreground/70">Sora</p>
                  <p className="text-xs text-muted-foreground/50">langit · sky</p>
                </div>
              </div>

              <h1 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black leading-tight tracking-tight text-foreground/90">
                Langitku milik <span className="text-gradient">semua orang</span>
              </h1>

              {/* Big quote */}
              <blockquote className="mt-6 border-l-2 border-primary/40 pl-5">
                <p className="text-base font-medium italic text-muted-foreground/80 sm:text-lg leading-relaxed">
                  "Langit tidak membatasi siapa yang boleh memandangnya."
                </p>
                <footer className="mt-2 text-xs text-muted-foreground/40 font-semibold tracking-wider uppercase">
                  — Filosofi Soraku Community
                </footer>
              </blockquote>

              <p className="mt-6 max-w-lg text-sm text-muted-foreground leading-relaxed sm:text-base">
                Platform komunitas non-profit Indonesia untuk penggemar anime, manga,
                J-Music, VTuber, cosplay, dan seluruh semesta budaya Jepang.
                Berdiri sejak 2023, gratis selamanya.
              </p>

              {/* Stats pills */}
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { v: "500+",  l: "Member Discord" },
                  { v: "20+",   l: "Event Digelar"   },
                  { v: "2023",  l: "Berdiri Sejak"   },
                  { v: "100%",  l: "Non-profit"      },
                ].map(({ v, l }) => (
                  <div key={l} className="rounded-2xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur-sm">
                    <p className="text-lg font-black leading-none text-foreground">{v}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/55">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Mascot card ── */}
            <div className="hidden lg:flex lg:justify-center">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 -m-8 rounded-3xl bg-primary/8 blur-3xl" />
                {/* Card */}
                <div className="glass-card relative h-[480px] w-[360px] overflow-hidden rounded-[2rem] p-0">
                  <Image
                    src="/logo-full.png"
                    alt="Soraku mascot — karakter dengan hoodie Soraku"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  {/* Top gradient */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/40 to-transparent" />
                  {/* Bottom overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent px-6 pb-6 pt-12">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-black leading-none">Soraku</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">Community · 空 · Est. 2023</p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 border border-primary/20">
                        <span className="text-sm font-black text-gradient">空</span>
                      </div>
                    </div>
                  </div>
                  {/* Live badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[10px] font-bold text-green-400 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                    Community Live
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MAKNA NAMA — Origin story
      ══════════════════════════════════════ */}
      <section className="px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card/60 to-card/40 p-8 backdrop-blur-sm sm:p-10 lg:p-12">
            {/* Decorative kanji watermark */}
            <div
              className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 font-black text-primary/4 select-none leading-none"
              style={{ fontSize: "14rem" }}
              aria-hidden="true"
            >
              空
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[1fr_1px_1fr]">
              {/* Soraku meaning */}
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/60">Asal Nama</p>
                <h2 className="text-2xl font-black tracking-tight mb-4">Mengapa "Soraku"?</h2>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <span className="font-bold text-foreground text-base">空</span>{" "}
                    <span className="text-primary/70 font-semibold">(Sora)</span> dalam bahasa Jepang berarti{" "}
                    <span className="font-bold text-foreground">"langit"</span> — simbol kebebasan,
                    keluasan, dan kemungkinan tanpa batas.
                  </p>
                  <p>
                    Ditambah sufiks{" "}
                    <span className="font-bold text-foreground">-ku</span>{" "}
                    (possesif Jepang), maka{" "}
                    <span className="font-bold text-foreground">Soraku = "Langitku"</span>{" "}
                    — sebuah ruang yang dimiliki oleh setiap anggotanya, bukan milik satu orang atau satu kelompok.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block bg-border/40" />

              {/* Visi Misi */}
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/60">Visi</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  Menjadi komunitas anime & budaya Jepang yang paling{" "}
                  <span className="font-bold text-foreground">inklusif, hangat, dan aktif</span>{" "}
                  di Indonesia — tempat di mana setiap orang menemukan "langitnya" sendiri.
                </p>

                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/60">Misi</p>
                <ul className="space-y-1.5">
                  {[
                    "Ruang aman berbagi passion budaya Jepang",
                    "Mendukung kreator lokal Indonesia",
                    "Menghubungkan penggemar se-Indonesia",
                    "Gratis & non-profit selamanya",
                  ].map((m) => (
                    <li key={m} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4 PILAR SORAKU
      ══════════════════════════════════════ */}
      <section className="px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Nilai Kami</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              4 Pilar <span className="text-gradient">Soraku</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Prinsip yang mendasari setiap keputusan dan langkah komunitas ini
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon, title, desc, gradient, border, glow }) => (
              <div
                key={title}
                className={`group relative overflow-hidden rounded-3xl border ${border} bg-gradient-to-br ${gradient} p-7 shadow-xl ${glow} backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl`}
              >
                {/* Background icon watermark */}
                <span
                  className="pointer-events-none absolute -right-3 -bottom-3 text-[5rem] opacity-[0.07] select-none leading-none"
                  aria-hidden="true"
                >
                  {icon}
                </span>

                <span className="mb-4 block text-4xl">{icon}</span>
                <h3 className="mb-2 text-lg font-black tracking-tight text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRINSIP PENGEMBANGAN
      ══════════════════════════════════════ */}
      <section className="px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Panduan</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Prinsip Pengembangan
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-7 top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />

            <div className="space-y-4">
              {PRINCIPLES.map(({ num, title, desc }) => (
                <div key={num} className="flex gap-5 sm:gap-6">
                  {/* Number circle */}
                  <div className="relative flex-shrink-0">
                    <div className="flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-sm font-black text-primary">
                      {num}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="glass-card flex-1 px-5 py-4">
                    <p className="font-bold text-foreground">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground/75 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TIM — Di balik layar
      ══════════════════════════════════════ */}
      <section className="px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Tim Inti</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Di balik layar
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              4 orang yang membangun Soraku dari nol untuk komunitas
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(({ name, role, desc, emoji, color, badge, badgeColor }) => (
              <div key={name}
                className={`group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br ${color} p-6 backdrop-blur-sm transition-all hover:-translate-y-1.5`}>
                {/* Watermark emoji */}
                <span
                  className="pointer-events-none absolute -right-2 -bottom-2 text-[5rem] opacity-[0.08] select-none leading-none"
                  aria-hidden="true"
                >
                  {emoji}
                </span>

                {/* Avatar */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-background/50 text-3xl backdrop-blur-sm">
                  {emoji}
                </div>

                {/* Badge */}
                <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase mb-3 ${badgeColor}`}>
                  {badge}
                </span>

                <p className="text-lg font-black leading-none">{name}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground/70">{role}</p>
                <p className="mt-2 text-xs text-muted-foreground/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HIERARCHY — Role sistem
      ══════════════════════════════════════ */}
      <section className="px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Struktur</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Hierarki Role
            </h2>
          </div>

          <div className="space-y-2">
            {HIERARCHY.map(({ role, desc, color, bg }, i) => (
              <div key={role}
                className={`flex items-center gap-4 rounded-2xl border ${bg} px-5 py-3.5 transition-all hover:-translate-x-1`}
                style={{ paddingLeft: `${1.25 + i * 0.5}rem` }}
              >
                {/* Connector line */}
                {i > 0 && (
                  <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground/30 font-mono">
                    {"└"}
                  </div>
                )}
                <span className={`min-w-[90px] text-xs font-black tracking-wider uppercase ${color}`}>
                  {role}
                </span>
                <span className="text-sm text-muted-foreground/65">{desc}</span>
              </div>
            ))}
          </div>

          {/* Supporter badges */}
          <div className="mt-6 rounded-2xl border border-border/40 bg-card/40 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
              Supporter (bisa dirangkap)
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { b: "💙 DONATUR", color: "bg-blue-500/10 border-blue-500/20 text-blue-300",   info: "Via Trakteer / Discord Boost" },
                { b: "💜 VIP",     color: "bg-violet-500/10 border-violet-500/20 text-violet-300", info: "Membership bulanan" },
                { b: "✨ VVIP",    color: "bg-accent/10 border-accent/20 text-accent/80",      info: "Membership premium" },
              ].map(({ b, color, info }) => (
                <div key={b} className={`rounded-2xl border px-4 py-2.5 ${color}`}>
                  <p className="text-xs font-black">{b}</p>
                  <p className="mt-0.5 text-[10px] opacity-60">{info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card/50 to-card/30 p-10 text-center backdrop-blur-sm sm:p-14">
            {/* Decorative */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-accent/8 blur-2xl" />

            {/* Mascot small */}
            <div className="relative mb-6 flex justify-center">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border/50 shadow-xl shadow-primary/10">
                <Image src="/logo.png" alt="Soraku mascot" width={80} height={80} className="h-full w-full object-cover object-top" />
              </div>
            </div>

            <h2 className="relative text-2xl font-black tracking-tight sm:text-3xl">
              Siap menemukan <span className="text-gradient">langitmu?</span>
            </h2>
            <p className="relative mt-3 text-sm text-muted-foreground leading-relaxed">
              Bergabunglah dengan ratusan member dan jadilah bagian dari komunitas
              anime & budaya Jepang Indonesia yang hangat & inklusif.
            </p>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register"
                className="group flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/35">
                Daftar Gratis
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/8 px-7 py-3.5 text-sm font-semibold text-indigo-300 transition-all hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-indigo-500/15">
                <DiscordIcon className="h-4 w-4" />
                Discord Server
              </a>
              <Link href="/social"
                className="flex items-center gap-2 rounded-2xl border border-border px-7 py-3.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground">
                Sosial Media
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
