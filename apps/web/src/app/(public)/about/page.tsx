
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, ExternalLink } from "lucide-react";
import { DiscordIcon } from "@/components/icons/custom-icons";

// Serializable social data (no React.FC inside) — safe to pass to Client Component
const SOCIAL_DATA = [
  { slug: "discord",   name: "Discord",   href: "https://discord.gg/qm3XJvRa6B" },
  { slug: "instagram", name: "Instagram", href: "https://www.instagram.com/soraku.moe" },
  { slug: "facebook",  name: "Facebook",  href: "https://www.facebook.com/share/1HQs9ZZeCw/" },
  { slug: "x",         name: "X / Twitter", href: "https://twitter.com/@AppSora" },
  { slug: "tiktok",    name: "TikTok",    href: "https://www.tiktok.com/@soraku.id" },
  { slug: "youtube",   name: "YouTube",   href: "https://youtube.com/@chsoraku" },
  { slug: "bluesky",   name: "Bluesky",   href: "https://bsky.app/profile/soraku.id" },
];
import { AboutStatsClient } from "./stats-client";
import { AboutScrollers, type SocialData } from "./scrollers-client";

export const metadata: Metadata = {
  title: "Tentang Kami — Soraku Community",
  description:
    "空 (Sora) = langit. Kenali visi, pilar, tim, dan perjalanan Soraku Community sejak 2023.",
};

// ─── Static data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  "🎌 Anime", "📚 Manga", "🎵 J-Music", "🎭 VTuber",
  "🎨 Fanart", "👘 Cosplay", "🎮 Gaming", "🍜 J-Food",
  "📖 Light Novel", "🌸 Budaya Jepang", "🎤 Cosplay Contest",
  "🏆 Turnamen", "📺 Nonton Bareng",
];

// 3 Pilar — Manager, Agensi, Admin
const PILLARS = [
  {
    role:    "MANAGER",
    icon:    "🛡️",
    title:   "Manager",
    desc:    "Tulang punggung operasional Soraku. Manager bertanggung jawab atas moderasi konten, pengelolaan event & blog, serta memastikan platform berjalan sesuai visi komunitas.",
    duties:  ["Moderasi konten & blog", "Kelola event & gathering", "Supervisi kreator"],
    gradient: "from-violet-500/15 to-purple-500/8",
    border:   "border-violet-500/20",
    accent:   "text-violet-300",
    bg:       "bg-violet-500/10",
  },
  {
    role:    "AGENSI",
    icon:    "🎭",
    title:   "Agensi",
    desc:    "Pilar kreativitas Soraku. Tim Agensi mengelola VTuber & talent lokal — dari manajemen profil, jadwal stream, kolaborasi, hingga pengembangan karier kreator Indonesia.",
    duties:  ["Kelola profil VTuber & talent", "Jadwal & kolaborasi stream", "Pengembangan kreator"],
    gradient: "from-primary/15 to-blue-500/8",
    border:   "border-primary/20",
    accent:   "text-primary",
    bg:       "bg-primary/10",
  },
  {
    role:    "ADMIN",
    icon:    "⚙️",
    title:   "Admin",
    desc:    "Penjaga ekosistem komunitas. Admin mengurus moderasi member, kuasi galeri karya, dan memastikan setiap kontribusi anggota mendapat tempat yang layak di Soraku.",
    duties:  ["Moderasi member & galeri", "Review & approve karya", "Kelola agensi & talent"],
    gradient: "from-accent/15 to-yellow-500/8",
    border:   "border-accent/20",
    accent:   "text-accent",
    bg:       "bg-accent/10",
  },
];

// Timeline Soraku dari 2023
const TIMELINE = [
  {
    year:  "2023",
    month: "Awal",
    title: "Lahirnya \"Sora\"",
    desc:  "Komunitas dimulai dengan nama sederhana: Sora — hanya server Discord kecil dengan beberapa orang yang sama-sama suka anime. Tidak ada website, tidak ada struktur. Hanya passion.",
    icon:  "🌱",
    highlight: true,
  },
  {
    year:  "2023",
    month: "Mid",
    title: "Berkembang jadi Soraku",
    desc:  "Seiring berkembangnya anggota, nama berubah menjadi Soraku — \"Langitku\". Ditambahkan sufiks -ku sebagai simbol bahwa langit ini milik semua anggotanya, bukan satu orang.",
    icon:  "✨",
    highlight: false,
  },
  {
    year:  "2023",
    month: "Akhir",
    title: "Event Pertama",
    desc:  "Event perdana Soraku digelar — nonton bareng online yang sederhana, tapi menjadi pondasi tradisi gathering rutin komunitas hingga sekarang.",
    icon:  "🎌",
    highlight: false,
  },
  {
    year:  "2024",
    month: "Q1",
    title: "Platform Web Lahir",
    desc:  "Tim inti terbentuk: Riu, Sora, Bubu, Kaizo. Platform web Soraku mulai dibangun dari nol — blog, galeri, event, dan sistem member pertama kali hadir.",
    icon:  "🚀",
    highlight: false,
  },
  {
    year:  "2024",
    month: "Q2",
    title: "Agensi Soraku Berdiri",
    desc:  "Soraku Agensi resmi terbentuk, membuka jalur bagi VTuber dan talent lokal Indonesia untuk berkembang di bawah naungan komunitas.",
    icon:  "🎭",
    highlight: false,
  },
  {
    year:  "2025",
    month: "Q1",
    title: "500+ Member Discord",
    desc:  "Milestone bersejarah — server Discord Soraku menembus 500 anggota aktif. Platform makin lengkap dengan sistem premium, donatur, dan bot Discord terintegrasi.",
    icon:  "🏆",
    highlight: false,
  },
  {
    year:  "2026",
    month: "Now",
    title: "v1.0 — Platform Penuh",
    desc:  "Soraku terus tumbuh. Platform dibangun ulang dari nol dengan stack modern — Next.js 16, Supabase, sistem notifikasi, dan banyak fitur baru untuk komunitas.",
    icon:  "🌸",
    highlight: true,
  },
];

// Team
const TEAM = [
  {
    name:  "Riu",
    role:  "Owner & Koordinator",
    desc:  "Pemimpin komunitas & pemegang visi Soraku. Semua keputusan besar melewati Riu.",
    emoji: "👑",
    badge: "OWNER",
    color: "from-yellow-400/20 to-amber-500/8",
    bcolor: "bg-yellow-400/15 text-yellow-300 border-yellow-400/25",
  },
  {
    name:  "Sora",
    role:  "Core / Full Stack Lead",
    desc:  "Arsitek platform — backend, infrastruktur, dan semua yang ada di balik layar.",
    emoji: "⚙️",
    badge: "FULL STACK",
    color: "from-primary/20 to-blue-500/8",
    bcolor: "bg-primary/15 text-primary border-primary/20",
  },
  {
    name:  "Bubu",
    role:  "Front-end Developer",
    desc:  "Wajah visual Soraku — setiap animasi, spacing, dan komponen yang kamu lihat.",
    emoji: "🎨",
    badge: "FRONT-END",
    color: "from-pink-500/20 to-rose-500/8",
    bcolor: "bg-pink-500/15 text-pink-300 border-pink-500/20",
  },
  {
    name:  "Kaizo",
    role:  "Back-end Developer",
    desc:  "Fondasi data Soraku — API, database, auth, dan semua integrasi layanan.",
    emoji: "🔧",
    badge: "BACK-END",
    color: "from-violet-500/20 to-purple-500/8",
    bcolor: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-blob absolute -top-48 -left-24 h-[600px] w-[600px] rounded-full bg-primary/9 blur-[160px]" />
          <div className="animate-blob animation-delay-2000 absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-accent/6 blur-[140px]" />
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[130px]" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.016]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="abgrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4FA3D1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#abgrid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_400px] lg:items-center lg:gap-14">

            {/* ── Copy ── */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/70" />
                Tentang Soraku Community
              </div>

              {/* Giant kanji + wordmark */}
              <div className="flex items-end gap-5 mb-5">
                <span className="font-black leading-none text-gradient select-none"
                  style={{ fontSize: "clamp(5rem,15vw,10rem)", lineHeight: 0.85 }}>
                  空
                </span>
                <div className="pb-1">
                  <p className="text-2xl font-black tracking-tight text-foreground/90 leading-none">Soraku</p>
                  <p className="text-sm text-muted-foreground/50 mt-1">Community</p>
                </div>
              </div>

              <h1 className="text-[clamp(1.4rem,3.5vw,2.4rem)] font-black leading-tight tracking-tight text-foreground/90">
                Langit yang <span className="text-gradient">milik semua</span>
              </h1>

              <blockquote className="mt-5 border-l-2 border-primary/40 pl-5">
                <p className="text-sm font-medium italic text-muted-foreground/75 sm:text-base leading-relaxed">
                  "Langit tidak membatasi siapa yang boleh memandangnya."
                </p>
                <footer className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/35">
                  — Filosofi Soraku Community
                </footer>
              </blockquote>

              <p className="mt-5 max-w-lg text-sm text-muted-foreground leading-relaxed">
                Platform komunitas non-profit Indonesia untuk pecinta anime, manga, J-Music,
                VTuber, cosplay, dan semesta budaya Jepang. Berdiri sejak 2023, gratis selamanya.
              </p>
            </div>

            {/* ── Mascot ── */}
            <div className="hidden lg:flex lg:justify-center">
              <div className="relative">
                <div className="absolute inset-0 -m-8 rounded-3xl bg-primary/6 blur-3xl" />
                <div className="glass-card relative h-[460px] w-[350px] overflow-hidden rounded-[2rem] p-0">
                  <Image
                    src="/logo-full.png"
                    alt="Soraku mascot"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent px-5 pb-5 pt-12">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-base">Soraku Community</p>
                        <p className="text-xs text-muted-foreground/55 mt-0.5">空 · Indonesia · Est. 2023</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                        Live
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════ CATEGORY MARQUEE ══════════════ */}
      <section className="overflow-hidden border-y border-border/40 py-4 mt-8">
        <div className="marquee-track flex gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/35">
          {[...Array(4)].map((_, i) =>
            CATEGORIES.map((c) => <span key={`${i}-${c}`}>{c}</span>)
          )}
        </div>
      </section>

      {/* ══════════════ STATS REAL-TIME ══════════════ */}
      <AboutStatsClient />

      {/* ══════════════ KENAPA NAMA SORAKU ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card/60 to-card/40 p-8 backdrop-blur-sm sm:p-10 lg:p-12">
            {/* Watermark */}
            <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary/4 select-none leading-none"
              style={{ fontSize: "12rem" }} aria-hidden>空</div>

            <div className="relative">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/60">Asal Nama</p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl mb-6">
                Kenapa <span className="text-gradient">"Soraku"</span>?
              </h2>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* 空 */}
                <div className="rounded-2xl border border-primary/20 bg-primary/8 p-5">
                  <div className="text-5xl font-black text-gradient leading-none mb-3">空</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Kanji</p>
                  <p className="font-bold text-foreground">Sora = "Langit"</p>
                  <p className="mt-1.5 text-sm text-muted-foreground/70 leading-relaxed">
                    Simbol kebebasan, keluasan, dan kemungkinan tanpa batas. Langit tidak punya dinding.
                  </p>
                </div>
                {/* -ku */}
                <div className="rounded-2xl border border-accent/20 bg-accent/8 p-5">
                  <div className="text-5xl font-black text-accent/80 leading-none mb-3">-ku</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent/60 mb-2">Sufiks Jepang</p>
                  <p className="font-bold text-foreground">Possesif = "Milikku"</p>
                  <p className="mt-1.5 text-sm text-muted-foreground/70 leading-relaxed">
                    Sufiks possesif bahasa Jepang. Menegaskan kepemilikan bersama — ini langit kita semua.
                  </p>
                </div>
                {/* Soraku */}
                <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
                  <div className="text-4xl font-black text-foreground/90 leading-none mb-3">Soraku</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Nama Komunitas</p>
                  <p className="font-bold text-foreground">"Langitku"</p>
                  <p className="mt-1.5 text-sm text-muted-foreground/70 leading-relaxed">
                    Ruang yang dimiliki setiap anggota. Bukan milik satu orang — milik komunitas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 3 PILAR: MANAGER, AGENSI, ADMIN ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Struktur</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              3 Pilar <span className="text-gradient">Soraku</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Tiga peran kunci yang menjaga Soraku tetap berjalan dan berkembang
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {PILLARS.map(({ role, icon, title, desc, duties, gradient, border, accent, bg }) => (
              <div key={role}
                className={`group relative overflow-hidden rounded-3xl border ${border} bg-gradient-to-br ${gradient} p-7 backdrop-blur-sm transition-all hover:-translate-y-1.5`}>
                {/* Watermark */}
                <span className="pointer-events-none absolute -right-2 -bottom-3 text-[6rem] leading-none opacity-[0.06] select-none">
                  {icon}
                </span>

                {/* Badge */}
                <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase mb-4 ${bg} border ${border} ${accent}`}>
                  {role}
                </span>

                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-xl font-black tracking-tight mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground/75 leading-relaxed mb-5">{desc}</p>

                {/* Duties */}
                <ul className="space-y-1.5">
                  {duties.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground/65">
                      <span className={`h-1 w-1 rounded-full flex-shrink-0 ${bg.replace("bg-", "bg-")}`} style={{ backgroundColor: "currentColor" }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TIMELINE ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Perjalanan</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Timeline <span className="text-gradient">Soraku</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">Dari server kecil bernama Sora, menjadi komunitas yang terus tumbuh</p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent sm:left-[35px]" />

            <div className="space-y-6">
              {TIMELINE.map(({ year, month, title, desc, icon, highlight }) => (
                <div key={`${year}-${month}`} className="flex gap-5 sm:gap-6">
                  {/* Node */}
                  <div className="relative flex-shrink-0 flex flex-col items-center">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-xl z-10 ${
                      highlight
                        ? "border-primary/40 bg-primary/15 shadow-lg shadow-primary/15"
                        : "border-border/50 bg-card/60"
                    }`}>
                      {icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 rounded-2xl border px-5 py-4 mb-1 transition-all hover:-translate-x-0.5 ${
                    highlight
                      ? "border-primary/25 bg-primary/6 shadow-md shadow-primary/5"
                      : "border-border/40 bg-card/40"
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${highlight ? "text-primary" : "text-muted-foreground/50"}`}>
                        {year} · {month}
                      </span>
                      {highlight && (
                        <span className="rounded-full bg-primary/15 border border-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary">KEY</span>
                      )}
                    </div>
                    <p className="font-bold text-foreground text-sm leading-snug">{title}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground/65 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TEAM ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Tim Inti</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Di balik layar</h2>
            <p className="mt-3 text-sm text-muted-foreground">4 orang yang membangun Soraku dari nol</p>
            <span className="mt-2 inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
              Draft — Foto profil segera hadir
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(({ name, role, desc, emoji, badge, color, bcolor }) => (
              <div key={name}
                className={`group relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br ${color} p-6 transition-all hover:-translate-y-1.5`}>
                <span className="pointer-events-none absolute -right-1 -bottom-2 text-[5rem] leading-none opacity-[0.07] select-none">
                  {emoji}
                </span>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/40 bg-background/50 text-3xl">
                  {emoji}
                </div>
                <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase mb-3 ${bcolor}`}>
                  {badge}
                </span>
                <p className="text-lg font-black leading-none">{name}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground/65">{role}</p>
                <p className="mt-2 text-xs text-muted-foreground/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ DISCORD CTA ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-background/60 to-primary/8 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-primary/8 blur-2xl" />

            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl border border-indigo-500/30 bg-indigo-500/15">
                <DiscordIcon className="h-10 w-10 text-indigo-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Gabung server Discord kami
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  500+ member aktif, channel anime · manga · cosplay · game · VTuber,
                  event rutin, dan komunitas yang hangat untuk semua kalangan.
                </p>
              </div>
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2.5 rounded-2xl bg-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-400">
                <DiscordIcon className="h-4 w-4" />
                Gabung Sekarang
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SOSIAL MEDIA SCROLLING ══════════════ */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 mb-8">
          <div className="text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Temukan Kami</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Soraku di <span className="text-gradient">Sosial Media</span>
            </h2>
          </div>
        </div>
        {/* Client component: scrolling sosmed cards */}
        <AboutScrollers type="social" socials={SOCIAL_DATA} />
      </section>

      {/* ══════════════ PARTNERSHIP SCROLLING ══════════════ */}
      <section className="py-14 sm:py-16 border-t border-border/30">
        <div className="mx-auto max-w-6xl px-4 mb-8">
          <div className="text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Kolaborasi</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Partnership <span className="text-gradient">& Sponsor</span>
            </h2>
            <p className="mt-2 text-xs text-muted-foreground/40">Dikelola melalui Admin Panel</p>
          </div>
        </div>
        {/* Client component: scrolling partnership */}
        <AboutScrollers type="partner" />
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="px-4 py-16 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-card px-8 py-12 sm:px-12">
            <div className="mb-4 flex justify-center gap-2 text-3xl">🌸🎌✨</div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Siap menemukan <span className="text-gradient">langitmu?</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Gratis selamanya. Komunitas anime & budaya Jepang Indonesia yang hangat & inklusif.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register"
                className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                Daftar Gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-border px-7 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                <DiscordIcon className="h-4 w-4" />Discord <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
