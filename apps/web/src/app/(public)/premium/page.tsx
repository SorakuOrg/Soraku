import type { Metadata } from "next";
export const metadata: Metadata = { title: "Premium" };
export default function PremiumPage() {
  return (
    <section className="px-4 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Segera Hadir</p>
      <h1 className="text-3xl font-bold">Premium</h1>
      <p className="mt-3 text-sm text-muted-foreground">Badge & keuntungan eksklusif — segera tersedia.</p>
    </section>
  );
}
