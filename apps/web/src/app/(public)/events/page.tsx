import type { Metadata } from "next";
export const metadata: Metadata = { title: "Event" };
export default function EventsPage() {
  return (
    <section className="px-4 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Segera Hadir</p>
      <h1 className="text-3xl font-bold">Event</h1>
      <p className="mt-3 text-sm text-muted-foreground">Acara & gathering — segera tersedia.</p>
    </section>
  );
}
