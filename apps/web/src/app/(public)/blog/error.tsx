"use client";
import Link from "next/link";
export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">😢</p>
      <h2 className="text-xl font-bold mb-2">Gagal memuat blog</h2>
      <p className="text-muted-foreground text-sm mb-6">Terjadi kesalahan. Coba lagi atau kembali ke beranda.</p>
      <div className="flex gap-3"><button onClick={reset} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white">Coba Lagi</button>
      <Link href="/" className="rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground">Beranda</Link></div>
    </div>
  );
}
