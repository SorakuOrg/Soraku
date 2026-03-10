"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

const BENEFITS = [
  "Akses ke semua konten komunitas",
  "Ikut event & gathering eksklusif",
  "Upload karya ke galeri",
  "Badge & role member",
];

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    // TODO: Kaizo — hit POST /api/auth/register
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -right-20 top-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute left-0 bottom-0 h-64 w-64 rounded-full bg-primary/7 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-3xl gap-8 lg:grid-cols-2 lg:items-start">
        {/* Left: benefits */}
        <div className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <span className="text-gradient text-2xl font-black leading-none">空</span>
            <span className="text-lg font-bold">Soraku</span>
            <span className="text-muted-foreground/50 text-xs uppercase tracking-widest">Community</span>
          </Link>
          <h2 className="text-3xl font-black mb-2">Bergabung Gratis</h2>
          <p className="text-muted-foreground mb-8">Jadi bagian dari komunitas anime & budaya Jepang terbaik di Indonesia.</p>
          <ul className="space-y-4">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-sm text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-muted-foreground/50">
            空 · Non-profit · Est. 2023 · Indonesia
          </p>
        </div>

        {/* Right: form */}
        <div className="glass-card p-8">
          {/* Progress */}
          <div className="mb-6 flex items-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>

          <h1 className="text-xl font-bold mb-1">
            {step === 1 ? "Buat Akun" : "Info Profil"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {step === 1 ? "Langkah 1 dari 2 — Akun & keamanan" : "Langkah 2 dari 2 — Perkenalkan dirimu"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <input type="email" required placeholder="kamu@email.com"
                    className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} required placeholder="Min. 8 karakter"
                      className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors pr-10" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                    <input type="text" required placeholder="usernamu" pattern="[a-zA-Z0-9_]+"
                      className="w-full rounded-xl border border-border bg-card/50 pl-8 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground/60">Hanya huruf, angka, dan underscore</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Nama Tampil <span className="text-muted-foreground font-normal">(opsional)</span></label>
                  <input type="text" placeholder="Nama yang ditampilkan ke orang lain"
                    className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
                </div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 rounded border-border" />
                  <span className="text-xs text-muted-foreground">
                    Saya setuju dengan{" "}
                    <Link href="/terms" className="text-primary hover:underline">Syarat & Ketentuan</Link>
                    {" "}dan{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Kebijakan Privasi</Link> Soraku.
                  </span>
                </label>
              </>
            )}

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:pointer-events-none">
              {loading ? "Membuat akun..." : step === 1 ? (<>Lanjut <ArrowRight className="h-4 w-4" /></>) : (<>Daftar Sekarang <ArrowRight className="h-4 w-4" /></>)}
            </button>

            {step === 1 && (
              <>
                <div className="my-2 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">atau</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <a href="/api/auth/discord"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/8 px-4 py-3 text-sm font-medium text-indigo-300 hover:bg-indigo-500/15 transition-colors">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                  Daftar dengan Discord
                </a>
              </>
            )}

            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Kembali
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
