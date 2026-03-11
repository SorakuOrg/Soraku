"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { DiscordIcon, GoogleIcon } from "@/components/icons/custom-icons";

const BENEFITS = [
  { icon: "🎌", text: "Akses ke semua konten komunitas" },
  { icon: "🗓️", text: "Ikut event & gathering eksklusif" },
  { icon: "🖼️", text: "Upload karya ke galeri komunitas" },
  { icon: "🏅", text: "Badge & role member Soraku" },
];

const STEPS = ["Akun", "Profil"];

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    // TODO Kaizo: POST /api/auth/register
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-stretch">

      {/* ── Left: Benefits panel ── */}
      <div className="relative hidden flex-1 overflow-hidden lg:flex lg:flex-col bg-gradient-to-br from-accent/8 via-background to-background border-r border-border/40">
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent/10 blur-[120px]" />
          <div className="animate-blob animation-delay-3000 absolute bottom-10 left-0 h-72 w-72 rounded-full bg-primary/8 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative p-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-border/60">
              <Image src="/logo.png" alt="Soraku" width={40} height={40} className="h-full w-full object-cover object-top" />
            </div>
            <span className="text-base font-black">Soraku</span>
            <span className="text-xs text-muted-foreground/40 uppercase tracking-widest">Community</span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative flex flex-1 flex-col justify-center p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/60">Bergabung Sekarang</p>
          <h2 className="text-2xl font-black tracking-tight leading-tight">
            Komunitas anime<br />& budaya Jepang<br />terbesar di Indonesia
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Gratis selamanya. Daftar dan mulai berinteraksi dengan ribuan member.
          </p>

          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base">
                  {b.icon}
                </span>
                <span className="text-sm text-muted-foreground/80">{b.text}</span>
              </li>
            ))}
          </ul>

          {/* Mascot */}
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border/50 bg-card/40 p-3">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-border/50">
              <Image src="/logo.png" alt="Mascot" width={48} height={48} className="h-full w-full object-cover object-top" />
            </div>
            <div>
              <p className="text-xs font-semibold">Sudah 500+ member!</p>
              <p className="text-[11px] text-muted-foreground/50">Bergabunglah dan jadilah bagian dari Soraku</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:max-w-[480px]">
        {/* Mobile blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="animate-blob absolute -top-16 -right-16 h-64 w-64 rounded-full bg-accent/6 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute bottom-0 -left-10 h-56 w-56 rounded-full bg-primary/7 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="h-9 w-9 overflow-hidden rounded-xl border border-border/60">
              <Image src="/logo.png" alt="Soraku" width={36} height={36} className="h-full w-full object-cover object-top" />
            </div>
            <span className="text-base font-black">Soraku Community</span>
          </div>

          {/* Header + step indicator */}
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                    step > i + 1 ? "bg-green-500 text-white"
                    : step === i + 1 ? "bg-primary text-white"
                    : "border border-border text-muted-foreground/50"
                  }`}>
                    {step > i + 1 ? <Check className="h-3 w-3" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${step === i + 1 ? "text-foreground" : "text-muted-foreground/40"}`}>{s}</span>
                  {i < STEPS.length - 1 && <div className="h-px w-6 bg-border/50" />}
                </div>
              ))}
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {step === 1 ? "Buat Akun" : "Lengkapi Profil"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === 1 ? "Daftar gratis ke Soraku Community" : "Hampir selesai! Isi info profil kamu"}
            </p>
          </div>

          {/* OAuth — only step 1 */}
          {step === 1 && (
            <>
              <div className="flex flex-col gap-2.5">
                <a href="/api/auth/discord"
                  className="flex items-center justify-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/8 px-4 py-3 text-sm font-semibold text-indigo-300 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/15 hover:-translate-y-0.5">
                  <DiscordIcon className="h-4 w-4" />
                  Daftar dengan Discord
                </a>
                <button type="button"
                  className="flex items-center justify-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground hover:-translate-y-0.5">
                  <GoogleIcon className="h-4 w-4" />
                  Daftar dengan Google
                </button>
              </div>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-[11px] font-medium text-muted-foreground/40">atau daftar dengan email</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <input type="email" required placeholder="kamu@email.com"
                    className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} required placeholder="Min. 8 karakter"
                      className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 pr-10 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Username</label>
                  <input type="text" required placeholder="@username kamu" minLength={3}
                    className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Nama Tampilan</label>
                  <input type="text" required placeholder="Nama yang akan ditampilkan"
                    className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Bio <span className="text-muted-foreground/40 font-normal">(opsional)</span></label>
                  <textarea rows={2} placeholder="Ceritakan sedikit tentang diri kamu..."
                    className="w-full resize-none rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </>
            )}

            {step === 1 && (
              <p className="text-xs text-muted-foreground/50 leading-relaxed">
                Dengan mendaftar, kamu menyetujui{" "}
                <Link href="/terms" className="text-primary/70 hover:text-primary">Syarat & Ketentuan</Link>
                {" "}dan{" "}
                <Link href="/privacy" className="text-primary/70 hover:text-primary">Kebijakan Privasi</Link> Soraku.
              </p>
            )}

            <button type="submit" disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30 disabled:opacity-60">
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {step === 1 ? "Lanjut" : "Selesai Daftar"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {step === 2 && (
              <button type="button" onClick={() => setStep(1)}
                className="w-full rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                ← Kembali
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground/60">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
