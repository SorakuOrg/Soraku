"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Check, AlertCircle } from "lucide-react";
import { DiscordIcon, GoogleIcon } from "@/components/icons/custom-icons";

const BENEFITS = [
  { icon: "🎌", text: "Akses ke semua konten komunitas" },
  { icon: "🗓️", text: "Ikut event & gathering eksklusif" },
  { icon: "🖼️", text: "Upload karya ke galeri komunitas" },
  { icon: "🏅", text: "Badge & role member Soraku" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "", password: "", username: "", displayname: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!form.email || !form.password) { setError("Isi email dan password dulu ya."); return; }
      if (form.password.length < 8) { setError("Password minimal 8 karakter."); return; }
      setStep(2);
      return;
    }

    // Step 2 — submit
    if (!form.username) { setError("Username wajib diisi."); return; }
    if (!/^[a-z0-9_]+$/.test(form.username)) {
      setError("Username hanya huruf kecil, angka, dan underscore."); return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:    form.email,
          password: form.password,
          username: form.username.toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Pendaftaran gagal. Coba lagi.");
      } else {
        // Langsung login setelah register berhasil
        const loginRes  = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        if (loginRes.ok) {
          router.push("/dash");
          router.refresh();
        } else {
          // Register berhasil tapi login gagal — redirect ke login
          router.push("/login?registered=1");
        }
      }
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-stretch">

      {/* ── Kiri: Benefits ── */}
      <div className="relative hidden flex-1 overflow-hidden lg:flex lg:flex-col bg-gradient-to-br from-accent/8 via-background to-background border-r border-border/40">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent/10 blur-[120px]" />
          <div className="animate-blob animation-delay-3000 absolute bottom-10 left-0 h-72 w-72 rounded-full bg-primary/8 blur-[100px]" />
        </div>
        <div className="relative p-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-border/60">
              <Image src="/logo.png" alt="Soraku" width={40} height={40} className="h-full w-full object-cover object-top" />
            </div>
            <span className="text-base font-black">Soraku</span>
            <span className="text-xs text-muted-foreground/40 uppercase tracking-widest">Community</span>
          </Link>
        </div>
        <div className="relative flex flex-1 flex-col justify-center p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/60">Bergabung Sekarang</p>
          <h2 className="text-2xl font-black tracking-tight leading-tight">
            Komunitas anime<br />& budaya Jepang<br />terbesar di Indonesia
          </h2>
          <ul className="mt-8 space-y-3.5">
            {BENEFITS.map(b => (
              <li key={b.text} className="flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm">{b.icon}</span>
                <span className="text-sm text-muted-foreground">{b.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary font-black text-lg">空</div>
            <div>
              <p className="text-sm font-semibold">Gratis selamanya</p>
              <p className="text-xs text-muted-foreground/60">Non-profit · Est. 2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Kanan: Form ── */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:max-w-[480px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="animate-blob absolute -top-16 left-0 h-64 w-64 rounded-full bg-accent/7 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">
          {/* Step indicator */}
          <div className="mb-8 flex items-center gap-2">
            {["Akun", "Profil"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black transition-all ${
                  step > i + 1 ? "bg-green-500 text-white"
                  : step === i + 1 ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
                }`}>
                  {step > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`text-xs font-semibold ${step === i + 1 ? "text-foreground" : "text-muted-foreground/50"}`}>{s}</span>
                {i === 0 && <div className="mx-1 h-px w-8 bg-border/60" />}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-black tracking-tight">
            {step === 1 ? "Buat Akun Baru" : "Lengkapi Profil"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {step === 1 ? "Daftar ke Soraku Community — gratis!" : "Username unikmu di komunitas Soraku"}
          </p>

          {/* OAuth — hanya di step 1 */}
          {step === 1 && (
            <>
              <div className="mt-6 flex flex-col gap-2.5">
                <a href="/api/auth/discord"
                  className="flex items-center justify-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/8 px-4 py-3 text-sm font-semibold text-indigo-300 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/15 hover:-translate-y-0.5">
                  <DiscordIcon className="h-5 w-5" />Daftar dengan Discord
                </a>
                <a href="/api/auth/google"
                  className="flex items-center justify-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5">
                  <GoogleIcon className="h-5 w-5" />Daftar dengan Google
                </a>
              </div>
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 border-t border-border/50" />
                <span className="text-xs text-muted-foreground/40 font-medium">atau</span>
                <div className="flex-1 border-t border-border/50" />
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Email</label>
                  <input type="email" autoComplete="email" placeholder="kamu@example.com"
                    value={form.email} onChange={set("email")}
                    className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} autoComplete="new-password" placeholder="Min 8 karakter"
                      value={form.password} onChange={set("password")}
                      className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 pr-11 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/40 font-medium">@</span>
                    <input type="text" autoComplete="username" placeholder="contoh: anon_weebs"
                      value={form.username} onChange={set("username")}
                      className="w-full rounded-xl border border-border bg-card/50 pl-8 pr-4 py-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/40">Huruf kecil, angka, underscore. Tidak bisa diubah setelah daftar.</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Nama Tampilan <span className="normal-case text-muted-foreground/30">(opsional)</span></label>
                  <input type="text" placeholder="Nama yang tampil ke orang lain"
                    value={form.displayname} onChange={set("displayname")}
                    className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
                </div>
                <button type="button" onClick={() => { setStep(1); setError(null); }}
                  className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  ← Kembali ke step sebelumnya
                </button>
              </>
            )}

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none">
              {loading ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Mendaftar…</>
              ) : (
                <>{step === 1 ? "Lanjut" : "Daftar Sekarang"}<ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground/50 leading-relaxed">
            Dengan mendaftar kamu setuju dengan{" "}
            <Link href="/terms" className="text-primary/70 hover:text-primary">Syarat & Ketentuan</Link>{" "}dan{" "}
            <Link href="/privacy" className="text-primary/70 hover:text-primary">Kebijakan Privasi</Link> Soraku.
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
