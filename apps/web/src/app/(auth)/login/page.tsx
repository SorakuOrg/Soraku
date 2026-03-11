"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { DiscordIcon, GoogleIcon } from "@/components/icons/custom-icons";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO Kaizo: POST /api/auth/login
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-stretch">

      {/* ── Left: Visual panel (desktop only) ── */}
      <div className="relative hidden flex-1 overflow-hidden lg:flex lg:flex-col lg:justify-between bg-gradient-to-br from-primary/12 via-background to-background/95 border-r border-border/40">
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/12 blur-[120px]" />
          <div className="animate-blob animation-delay-2000 absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/8 blur-[100px]" />
        </div>
        {/* Mascot */}
        <div className="relative flex flex-1 items-center justify-center p-12">
          <div className="relative">
            <div className="absolute inset-0 -m-6 rounded-3xl bg-primary/6 blur-2xl" />
            <div className="glass-card relative h-[380px] w-[300px] overflow-hidden rounded-[2rem] p-0">
              <Image src="/logo-full.png" alt="Soraku mascot" fill className="object-cover object-top" priority />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-5 pt-10">
                <p className="text-base font-black">Soraku Community</p>
                <p className="text-xs text-muted-foreground/60">空 · Indonesia · Est. 2023</p>
              </div>
            </div>
          </div>
        </div>
        {/* Quote */}
        <div className="relative p-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground/70 italic leading-relaxed">
            "Komunitas yang hangat untuk semua pecinta budaya pop Jepang di Indonesia."
          </p>
          <p className="mt-2 text-xs text-muted-foreground/40">— Soraku Community</p>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:max-w-[480px]">
        {/* Mobile blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="animate-blob absolute -top-20 -left-16 h-64 w-64 rounded-full bg-primary/7 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute bottom-0 right-0 h-56 w-56 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-border/60">
              <Image src="/logo.png" alt="Soraku" width={40} height={40} className="h-full w-full object-cover object-top" />
            </div>
            <div>
              <p className="text-base font-black leading-none">Soraku</p>
              <p className="text-xs text-muted-foreground/50">Community</p>
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight">Selamat Datang Kembali</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Masuk ke akun Soraku Community kamu</p>

          {/* OAuth buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <a href="/api/auth/discord"
              className="flex items-center justify-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/8 px-4 py-3 text-sm font-semibold text-indigo-300 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/15 hover:-translate-y-0.5">
              <DiscordIcon className="h-4 w-4" />
              Masuk dengan Discord
            </a>
            <button type="button"
              className="flex items-center justify-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground hover:-translate-y-0.5">
              <GoogleIcon className="h-4 w-4" />
              Masuk dengan Google
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-[11px] font-medium text-muted-foreground/40">atau masuk dengan email</span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input type="email" required placeholder="kamu@email.com"
                className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary/70 hover:text-primary transition-colors">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 pr-10 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Masuk <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground/60">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
