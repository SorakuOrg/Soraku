import type { Metadata } from "next";
export const metadata: Metadata = { title: "Donasi" };
export default function DonatePage() {
  return (
    <section className="px-4 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Segera Hadir</p>
      <h1 className="text-3xl font-bold">Donasi</h1>
      <p className="mt-3 text-sm text-muted-foreground">Dukung komunitas Soraku — segera tersedia.</p>
    </section>
  );
}
