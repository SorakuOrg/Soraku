import Link from "next/link";
import { ArrowRight, Users, Calendar, BookOpen } from "lucide-react";

/* ── Kategori untuk hero pill tags ── */
const HERO_CATEGORIES = [
  "Anime", "Manga", "Cosplay", "Fanart", "J-Music",
  "VTuber", "Light Novel", "Gaming", "Gacha", "Tokusatsu", "dll.",
];

/* ── Floating badge di hero visual ── */
function FloatBadge({ pos, delay, children }: {
  pos: string;
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`float-badge glass-card ${pos} rounded-full px-3 py-1.5 text-[11px] font-semibold text-foreground/80 whitespace-nowrap`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

/* ── Stat pill ── */
function StatPill({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1 w-1 rounded-full bg-primary/50" />
      {value && (
        <span className="text-sm font-bold text-foreground/90">{value}</span>
      )}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/* ── Section heading ── */
function SectionHeading({ eyebrow, title, sub }: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary/60">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

/* ── Platform feature card ── */
function PlatformCard({ emoji, title, desc, href }: {
  emoji: string;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href} className="glass-card group block p-5 transition-all hover:-translate-y-1">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
        {emoji}
      </div>
      <h3 className="mb-1.5 font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </Link>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 pt-16 pb-14 sm:pt-20 sm:pb-16 lg:min-h-[88vh] lg:pt-24 lg:pb-20">
        {/* Atmosphere blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-blob bg-primary/7 absolute -top-40 -left-28 h-[520px] w-[520px] rounded-full blur-[140px]" />
          <div className="animate-blob animation-delay-2000 absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-[#E8C2A8]/5 blur-[110px]" />
          <div className="animate-blob animation-delay-4000 bg-primary/5 absolute -bottom-16 left-1/3 h-[360px] w-[360px] rounded-full blur-[120px]" />
          {/* Subtle grid */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.022]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4FA3D1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_380px] lg:items-center lg:gap-20">

            {/* ── Left copy ── */}
            <div>
              {/* Eyebrow pill */}
              <div className="border-primary/20 bg-primary/8 text-primary/80 mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase">
                <span className="bg-primary/70 h-1.5 w-1.5 animate-pulse rounded-full" />
                Komunitas Anime &amp; Budaya Jepang Indonesia
              </div>

              {/* Heading */}
              <h1 className="font-heading leading-none tracking-tight">
                <span className="text-foreground/92 block text-[clamp(4rem,11vw,7.5rem)] leading-[0.9] font-black">
                  Soraku
                </span>
                <span className="text-muted-foreground/65 mt-1 block text-[clamp(1.4rem,3.5vw,2.4rem)] leading-tight font-semibold">
                  Community
                </span>
                <span className="text-primary/50 mt-3 block text-[11px] font-medium tracking-[0.4em] uppercase sm:text-xs">
                  空 · Indonesia · Est. 2023
                </span>
              </h1>

              {/* Category tags */}
              <div className="mt-6 flex flex-col gap-3">
                <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
                  Komunitas non-profit yang menaungi berbagai minat budaya pop Jepang di Indonesia:
                </p>
                <div className="flex max-w-lg flex-wrap gap-1.5">
                  {HERO_CATEGORIES.map((cat, i) => (
                    <span
                      key={cat}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        cat === "dll."
                          ? "text-muted-foreground/40 italic"
                          : i % 4 === 0
                          ? "border-primary/25 bg-primary/10 text-primary/80 border"
                          : i % 4 === 1
                          ? "border border-[#E8C2A8]/25 bg-[#E8C2A8]/8 text-[#E8C2A8]/75"
                          : i % 4 === 2
                          ? "border border-violet-400/20 bg-violet-500/8 text-violet-300/70"
                          : "border-border/60 text-muted-foreground/60 border"
                      }`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="group bg-primary shadow-primary/20 hover:shadow-primary/30 relative overflow-hidden rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:px-7 sm:py-3.5"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Bergabung Gratis
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                </Link>
                <a
                  href="https://discord.gg/qm3XJvRa6B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/8 px-6 py-3 text-sm font-semibold text-indigo-300 transition-all hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-indigo-500/15 sm:px-7 sm:py-3.5"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                  Gabung Discord
                </a>
              </div>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <StatPill label="Member Discord" value="500+" />
                <StatPill label="Event Digelar"  value="20+" />
                <StatPill label="Konten Aktif"   value="100+" />
              </div>
            </div>

            {/* ── Right visual (desktop) ── */}
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="relative flex items-center justify-center">
                {/* Rings */}
                <div className="border-primary/8 absolute h-[340px] w-[340px] rounded-full border shadow-[0_0_100px_rgba(79,163,209,0.07)]" />
                <div className="border-primary/5 absolute h-[270px] w-[270px] rounded-full border" />
                <div className="absolute h-[200px] w-[200px] rounded-full border border-[#E8C2A8]/10" />

                {/* Center panel */}
                <div className="glass-card relative flex h-[200px] w-[200px] flex-col items-center justify-center overflow-hidden text-center">
                  <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-[#E8C2A8]/8" />
                  <span className="text-gradient relative block text-[5.5rem] leading-none font-black">
                    空
                  </span>
                  <span className="text-muted-foreground/50 relative mt-1 block text-[9px] font-semibold tracking-[0.45em] uppercase">
                    Soraku · 空
                  </span>
                </div>

                {/* Floating badges */}
                <FloatBadge pos="absolute -top-5 left-1/2 -translate-x-1/2" delay="0s">🎌 Anime</FloatBadge>
                <FloatBadge pos="absolute top-8 -right-16"                  delay="0.6s">🎭 VTuber</FloatBadge>
                <FloatBadge pos="absolute bottom-8 -right-14"               delay="1.2s">🎵 J-Music</FloatBadge>
                <FloatBadge pos="absolute -bottom-5 left-1/2 -translate-x-1/2" delay="1.8s">🎨 Fanart</FloatBadge>
                <FloatBadge pos="absolute bottom-8 -left-14"                delay="2.4s">🎮 Gaming</FloatBadge>
                <FloatBadge pos="absolute top-8 -left-16"                   delay="3s">📚 Manga</FloatBadge>

                {/* Live badge */}
                <div className="absolute -top-10 right-4 flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                  Community Live
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PLATFORM FEATURES
      ════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Platform"
            title="Semua yang kamu butuhkan"
            sub="Fitur lengkap untuk komunitas yang tumbuh bersama"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <PlatformCard emoji="📝" title="Blog"     desc="Artikel & cerita dari member komunitas"  href="/blog" />
            <PlatformCard emoji="🗓️" title="Event"    desc="Nonton bareng, gathering, & kontes"       href="/events" />
            <PlatformCard emoji="🖼️" title="Galeri"   desc="Karya fanart, cosplay, & kreasi member"  href="/gallery" />
            <PlatformCard emoji="🎭" title="Agensi"   desc="VTuber & talent management Soraku"       href="/agensi" />
            <PlatformCard emoji="🏆" title="Premium"  desc="Dukung komunitas & dapatkan badge eksklusif" href="/premium" />
            <PlatformCard emoji="💬" title="Discord"  desc="Server aktif 24/7 untuk ngobrol bareng" href="https://discord.gg/qm3XJvRa6B" />
            <PlatformCard emoji="🌸" title="Tentang"  desc="Kenali lebih dalam komunitas Soraku"     href="/about" />
            <PlatformCard emoji="✨" title="Donasi"   desc="Bantu Soraku tetap gratis & berkembang"  href="/donate" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE — kategori
      ════════════════════════════════════════ */}
      <section className="overflow-hidden border-y border-border/50 py-5">
        <div className="marquee-track flex gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-muted-foreground/40">
          {[...Array(3)].map((_, i) =>
            ["🎌 Anime", "📚 Manga", "🎵 J-Music", "🎭 VTuber", "🎨 Fanart",
             "👘 Cosplay", "🎮 Gaming", "🍜 J-Food", "📖 Light Novel", "🌸 Budaya"].map((item) => (
              <span key={`${i}-${item}`}>{item}</span>
            ))
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          JOIN CTA
      ════════════════════════════════════════ */}
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-card inline-block px-8 py-12 sm:px-14">
            <span className="text-5xl">🌸</span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              Bergabung ke Soraku sekarang
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Gratis selamanya. Temukan sesama penggemar budaya Jepang dan jadilah bagian dari komunitas yang hangat.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                Daftar Gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
