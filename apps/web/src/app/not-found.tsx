import Link from "next/link";
export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="text-gradient block text-[6rem] font-black leading-none">空</span>
      <h1 className="mt-4 text-2xl font-bold">404 — Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm text-muted-foreground">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
        Kembali ke Beranda
      </Link>
    </section>
  );
}
