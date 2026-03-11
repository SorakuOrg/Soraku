
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Calendar, BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { DiscordIcon } from "@/components/icons/custom-icons";

const HERO_CATEGORIES = [
  "🎌 Anime", "📚 Manga", "👘 Cosplay", "🎨 Fanart",
  "🎵 J-Music", "🎭 VTuber", "📖 Light Novel", "🎮 Gaming",
];

const FEATURES = [
  { emoji: "📝", title: "Blog",    desc: "Artikel & ulasan dari member",           href: "/blog",    color: "from-blue-500/15 to-primary/10"    },
  { emoji: "🗓️", title: "Event",   desc: "Nonton bareng, gathering & kontes",       href: "/events",  color: "from-violet-500/15 to-purple-500/10" },
  { emoji: "🖼️", title: "Galeri",  desc: "Fanart, cosplay & karya kreatif",         href: "/gallery", color: "from-pink-500/15 to-rose-500/10"    },
  { emoji: "🎭", title: "Agensi",  desc: "VTuber & talent management",              href: "/agensi",  color: "from-amber-500/15 to-yellow-500/10"  },
  { emoji: "⭐", title: "Premium", desc: "Badge eksklusif & akses spesial",         href: "/premium", color: "from-yellow-400/15 to-amber-500/10"  },
  { emoji: "💬", title: "Discord", desc: "Server aktif 24/7 ngobrol bareng",        href: "https://discord.gg/qm3XJvRa6B", color: "from-indigo-500/15 to-indigo-400/10" },
];

const STATS = [
  { value: "500+",  label: "Member Discord",    icon: "👥" },
  { value: "20+",   label: "Event Digelar",       icon: "🗓️" },
  { value: "100+",  label: "Konten Aktif",        icon: "📝" },
  { value: "2023",  label: "Berdiri Sejak",       icon: "🌸" },
];

const MARQUEE_ITEMS = [
  "🎌 Anime", "📚 Manga", "🎵 J-Music", "🎭 VTuber",
  "🎨 Fanart", "👘 Cosplay", "🎮 Gaming", "🍜 J-Food",
  "📖 Light Novel", "🌸 Budaya Jepang",
];

export default function HomePage() {
  return (
    <>
      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:pt-16 lg:min-h-[90vh] lg:pt-20 lg:pb-20">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-blob absolute -top-48 -left-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[160px]" />
          <div className="animate-blob animation-delay-2000 absolute -top-10 right-0 h-[500px] w-[500px] rounded-full bg-accent/6 blur-[140px]" />
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[130px]" />
          {/* Grid */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.018]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4FA3D1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[1fr_420px] lg:items-center lg:gap-16">

            {/* ── Copy ── */}
            <div>
              {/* Eyebrow */}
              <div className="border-primary/20 bg-primary/8 text-primary/80 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/70" />
                Komunitas Anime &amp; Budaya Jepang Indonesia
              </div>

              {/* Heading */}
              <h1 className="font-heading leading-none tracking-tight">
                <span className="block text-[clamp(4rem,12vw,8rem)] leading-[0.88] font-black text-foreground/95">
                  Soraku
                </span>
                <span className="mt-2 block text-[clamp(1.2rem,3vw,2rem)] leading-tight font-semibold text-muted-foreground/60">
                  Community
                </span>
                <span className="mt-3 block text-[10px] font-semibold tracking-[0.5em] text-primary/40 uppercase sm:text-[11px]">
                  空 · Indonesia · Est. 2023
                </span>
              </h1>

              {/* Tag pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {HERO_CATEGORIES.map((cat, i) => (
                  <span key={cat}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      i % 3 === 0 ? "border border-primary/25 bg-primary/10 text-primary/80"
                      : i % 3 === 1 ? "border border-accent/25 bg-accent/8 text-accent/75"
                      : "border border-border/60 text-muted-foreground/55"
                    }`}>
                    {cat}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                Komunitas non-profit yang menaungi pecinta budaya pop Jepang di Indonesia.
                Tempat berbagi, berkarya, dan bertumbuh bersama.
              </p>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/register"
                  className="group relative overflow-hidden rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40 hover:shadow-xl">
                  <span className="relative z-10 flex items-center gap-2">
                    Bergabung Gratis
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                </Link>
                <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/8 px-7 py-3.5 text-sm font-semibold text-indigo-300 transition-all hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-indigo-500/15">
                  <DiscordIcon className="h-4 w-4" />
                  Gabung Discord
                </a>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{s.icon}</span>
                      <span className="text-lg font-black text-foreground">{s.value}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Mascot Visual ── */}
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="relative">
                {/* Glow rings */}
                <div className="absolute inset-0 -m-8 rounded-full bg-primary/5 blur-2xl" />
                <div className="absolute inset-0 -m-4 rounded-full bg-primary/3 blur-xl" />

                {/* Mascot card */}
                <div className="glass-card relative h-[420px] w-[340px] overflow-hidden rounded-[2rem] p-0">
                  {/* Gradient top */}
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/15 to-transparent" />
                  {/* Logo full mascot */}
                  <Image
                    src="/logo-full.png"
                    alt="Soraku mascot"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  {/* Bottom overlay badge */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent p-5 pt-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-black text-foreground">Soraku</p>
                        <p className="text-xs text-muted-foreground/60">Community · 空</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[10px] font-bold text-green-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                        Live
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating pills */}
                <div className="absolute -right-12 top-16 float-badge glass-card rounded-full px-3 py-1.5 text-[11px] font-semibold">
                  🎭 VTuber
                </div>
                <div className="absolute -left-14 top-28 float-badge glass-card rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ animationDelay: "0.8s" }}>
                  🎨 Fanart
                </div>
                <div className="absolute -right-10 bottom-28 float-badge glass-card rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ animationDelay: "1.6s" }}>
                  🎌 Anime
                </div>
                <div className="absolute -left-12 bottom-16 float-badge glass-card rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ animationDelay: "2.4s" }}>
                  📚 Manga
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ MARQUEE ════════ */}
      <section className="overflow-hidden border-y border-border/40 py-4">
        <div className="marquee-track flex gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/35">
          {[...Array(4)].map((_, i) =>
            MARQUEE_ITEMS.map((item) => (
              <span key={`${i}-${item}`}>{item}</span>
            ))
          )}
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/60">Platform</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Semua ada di sini
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Fitur lengkap untuk komunitas yang terus tumbuh bersama
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {FEATURES.map((f) => (
              <Link key={f.href} href={f.href}
                className="glass-card group flex flex-col items-center gap-3 p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/30">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-2xl`}>
                  {f.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{f.title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground/60">{f.desc}</p>
                </div>
                <ChevronRight className="mt-auto h-3.5 w-3.5 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary/60" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ DISCORD CTA ════════ */}
      <section className="px-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-background/50 to-primary/8 p-8 backdrop-blur-sm sm:p-12">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              {/* Icon */}
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl border border-indigo-500/30 bg-indigo-500/15">
                <DiscordIcon className="h-10 w-10 text-indigo-300" />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Gabung server Discord kami
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  500+ member aktif, channel khusus anime · manga · game · cosplay,
                  event rutin, dan komunitas yang ramah untuk semua kalangan.
                </p>
              </div>

              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2.5 rounded-2xl bg-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/40">
                <DiscordIcon className="h-4 w-4" />
                Gabung Sekarang
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ JOIN CTA ════════ */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-card px-8 py-12 sm:px-14">
            <div className="mb-4 flex justify-center gap-2 text-3xl">
              <span>🌸</span><span>🎌</span><span>✨</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Jadilah bagian dari Soraku
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Gratis selamanya. Temukan sesama penggemar budaya Jepang dan jadilah
              bagian dari komunitas yang hangat &amp; supportif.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                Daftar Gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about"
                className="inline-flex items-center gap-2 rounded-2xl border border-border px-7 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
