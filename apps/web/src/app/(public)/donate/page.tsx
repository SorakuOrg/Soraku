import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ExternalLink, Trophy, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Donasi — Soraku Community",
  description: "Dukung Soraku Community dengan donasi sukarela melalui Trakteer.",
};

const HOW_TO = [
  { step: "1", title: "Klik tombol Trakteer", desc: "Kamu akan diarahkan ke halaman Trakteer Soraku." },
  { step: "2", title: "Pilih nominal", desc: "Minimal 1 kopi (sekitar Rp 5.000). Bebas seikhlasnya." },
  { step: "3", title: "Isi pesan", desc: "Opsional: tulis pesan atau username Discord kamu." },
  { step: "4", title: "Selesai! 🎉", desc: "Nama kamu akan muncul di halaman Top Donatur Soraku." },
];

const USES = [
  { icon: "🖥️", label: "Server & Hosting" },
  { icon: "🌐", label: "Domain & SSL" },
  { icon: "🎉", label: "Event Offline" },
  { icon: "🛠️", label: "Dev Platform" },
  { icon: "🏆", label: "Hadiah Lomba" },
  { icon: "💙", label: "Komunitas" },
];

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
          <Heart className="h-8 w-8" />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Support Soraku</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Donasi <span className="text-gradient">Sukarela</span>
        </h1>
        <p className="mt-4 max-w-lg mx-auto text-muted-foreground">
          Soraku adalah komunitas non-profit. Setiap donasi sekecil apapun berarti besar untuk keberlangsungan komunitas ini. 🌸
        </p>
      </div>

      {/* Main CTA */}
      <div className="glass-card p-8 text-center mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-primary/5" />
        <div className="relative">
          <p className="text-5xl mb-4">☕</p>
          <h2 className="text-2xl font-black mb-2">Trakteer Soraku</h2>
          <p className="text-muted-foreground mb-6">
            Trakteer adalah platform donasi populer Indonesia.<br />
            Minimal 1 kopi (~Rp 5.000) sudah sangat berarti!
          </p>
          <a
            href="https://trakteer.id/soraku"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-8 py-4 text-base font-black text-white hover:bg-rose-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-rose-600/20"
          >
            <Heart className="h-5 w-5" />
            Donasi via Trakteer
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-4 text-xs text-muted-foreground/50">Link akan membuka Trakteer di tab baru</p>
        </div>
      </div>

      {/* How to */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-5">Cara Donasi</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {HOW_TO.map(({ step, title, desc }) => (
            <div key={step} className="glass-card p-4 flex items-start gap-4">
              <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-primary/15 text-primary text-sm font-black">
                {step}
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uses */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-base font-bold mb-4">Donasimu Digunakan Untuk</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {USES.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-border/50 p-3 text-center">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <Link href="/premium/donatur" className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <Trophy className="h-4 w-4" /> Top Donatur
        </Link>
        <span className="text-border">·</span>
        <Link href="/premium" className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <Star className="h-4 w-4" /> Premium Membership
        </Link>
        <span className="text-border">·</span>
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="hover:text-primary transition-colors">
          Discord Soraku
        </a>
      </div>
    </div>
  );
}
