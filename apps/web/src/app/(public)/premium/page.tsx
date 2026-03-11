
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, Star, Zap, Crown, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Premium — Soraku Community",
  description: "Dukung Soraku Community dengan membership VIP atau VVIP dan dapatkan benefit eksklusif.",
};

const TIERS = [
  {
    name: "Donatur",
    icon: Star,
    price: "Bebas",
    desc: "Donasi sukarela via Trakteer",
    color: "border-amber-500/30 bg-amber-500/5",
    iconColor: "text-amber-400 bg-amber-500/10",
    badge: "💙",
    benefits: [
      "Badge Donatur di profil",
      "Ucapan terima kasih dari tim",
      "Akses channel Discord khusus donatur",
    ],
    cta: "Donasi via Trakteer",
    ctaHref: "/donate",
    ctaStyle: "border border-amber-500/40 bg-amber-500/8 text-amber-300 hover:bg-amber-500/15",
  },
  {
    name: "VIP",
    icon: Zap,
    price: "Rp 25.000",
    period: "/bulan",
    desc: "Membership bulanan untuk supporter setia",
    color: "border-primary/40 bg-primary/5",
    iconColor: "text-primary bg-primary/10",
    badge: "💜",
    highlight: true,
    benefits: [
      "Badge VIP di profil & Discord",
      "Akses channel Discord eksklusif VIP",
      "Priority response dari tim",
      "Early access event & konten",
      "Nama di halaman Top Donatur",
    ],
    cta: "Mulai VIP",
    ctaHref: "#vip",
    ctaStyle: "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20",
  },
  {
    name: "VVIP",
    icon: Crown,
    price: "Rp 75.000",
    period: "/bulan",
    desc: "Support tertinggi untuk community builder",
    color: "border-accent/40 bg-accent/5",
    iconColor: "text-accent bg-accent/10",
    badge: "✨",
    benefits: [
      "Semua benefit VIP",
      "Badge VVIP dengan glow emas",
      "Custom role di Discord",
      "Shoutout bulanan di sosmed Soraku",
      "Akses beta fitur platform",
      "Nama besar di halaman Top Donatur",
    ],
    cta: "Mulai VVIP",
    ctaHref: "#vvip",
    ctaStyle: "bg-gradient-to-r from-amber-500 to-accent text-background font-black hover:opacity-90 shadow-md shadow-accent/20",
  },
];

export default function PremiumPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Support Soraku</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Premium <span className="text-gradient">Membership</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
          Soraku adalah komunitas non-profit. Setiap dukungan kamu membantu kami terus berkarya untuk komunitas.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/donate/leaderboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Trophy className="h-4 w-4" /> Lihat Top Donatur →
          </Link>
        </div>
      </div>

      {/* Tiers */}
      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map(({ name, icon: Icon, price, period, desc, color, iconColor, badge, highlight, benefits, cta, ctaHref, ctaStyle }) => (
          <div key={name} className={`glass-card relative p-7 border ${color} ${highlight ? "ring-2 ring-primary/30" : ""}`}>
            {highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-4 py-1 text-xs font-bold text-white">Paling Populer</span>
              </div>
            )}

            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>

            <div className="mb-1 flex items-center gap-2">
              <span className="text-lg">{badge}</span>
              <h2 className="text-xl font-black">{name}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{desc}</p>

            <div className="mb-6">
              <span className="text-3xl font-black">{price}</span>
              {period && <span className="text-muted-foreground text-sm">{period}</span>}
            </div>

            <ul className="mb-8 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>

            <a href={ctaHref}
              className={`block w-full rounded-xl px-4 py-3 text-center text-sm font-bold transition-all hover:-translate-y-0.5 ${ctaStyle}`}>
              {cta}
            </a>
          </div>
        ))}
      </div>

      {/* FAQ note */}
      <div className="mt-16 text-center glass-card px-8 py-10">
        <h2 className="text-xl font-bold mb-3">100% Untuk Komunitas</h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Semua donasi dan membership digunakan untuk biaya server, domain, event offline, dan pengembangan platform.
          Soraku tidak mengambil keuntungan dari komunitas.
        </p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link href="/donate" className="text-sm text-primary hover:underline">Donasi via Trakteer</Link>
          <span className="text-border">·</span>
          <Link href="/donate/leaderboard" className="text-sm text-primary hover:underline">Top Donatur</Link>
          <span className="text-border">·</span>
          <Link href="/about" className="text-sm text-primary hover:underline">Tentang Kami</Link>
        </div>
      </div>
    </div>
  );
}
