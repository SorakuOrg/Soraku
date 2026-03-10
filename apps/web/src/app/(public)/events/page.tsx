import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Users, Wifi, ArrowRight } from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { formatEventDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Event — Soraku Community",
  description: "Event, gathering, dan workshop komunitas Soraku Indonesia.",
};

function EventCard({ event }: { event: typeof MOCK_EVENTS[0] }) {
  const now = new Date();
  const start = new Date(event.starts_at);
  const isUpcoming = start > now;
  const typeLabel = { online: "Online", offline: "Offline", hybrid: "Hybrid" }[event.event_type];
  const TypeIcon = event.event_type === "online" ? Wifi : MapPin;

  return (
    <Link href={`/events/${event.slug}`}
      className="glass-card overflow-hidden hover:-translate-y-1 hover:border-primary/30 transition-all group">
      {/* Cover */}
      <div className={`h-40 relative flex items-center justify-center ${
        isUpcoming ? "bg-gradient-to-br from-primary/20 to-accent/10" : "bg-gradient-to-br from-border/30 to-border/10"
      }`}>
        <span className="text-5xl opacity-10">空</span>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            isUpcoming ? "bg-primary text-white" : "bg-muted text-muted-foreground"
          }`}>
            {isUpcoming ? "Upcoming" : "Selesai"}
          </span>
          <span className="rounded-full bg-background/70 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm flex items-center gap-1">
            <TypeIcon className="h-3 w-3" />{typeLabel}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold leading-snug group-hover:text-primary transition-colors">{event.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            {formatEventDate(event.starts_at)}
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              {event.location}
            </div>
          )}
          {event.max_participants && (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 flex-shrink-0" />
              Maks. {event.max_participants} peserta
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {event.tags?.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function EventsPage() {
  const now = new Date();
  const upcoming = MOCK_EVENTS.filter((e) => new Date(e.starts_at) > now);
  const past = MOCK_EVENTS.filter((e) => new Date(e.starts_at) <= now);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Komunitas</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Event <span className="text-gradient">Soraku</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Nobar, gathering, lomba, dan workshop dari komunitas Soraku Indonesia.
          Semua event gratis kecuali disebutkan sebaliknya.
        </p>
      </div>

      {/* Upcoming */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Upcoming ({upcoming.length})
          </h2>
        </div>
        {upcoming.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        ) : (
          <div className="glass-card p-10 text-center">
            <p className="text-muted-foreground">Belum ada event upcoming.</p>
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Ikuti Discord untuk info event <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-6 text-muted-foreground">Event Sebelumnya</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 opacity-70">
            {past.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {/* Discord CTA */}
      <div className="mt-16 glass-card px-8 py-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">Selalu Update</p>
        <h2 className="text-2xl font-bold">Jangan Sampai Ketinggalan Event!</h2>
        <p className="mt-2 text-muted-foreground">Semua pengumuman event diposting duluan di Discord Soraku.</p>
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
          Gabung Discord Soraku
        </a>
      </div>
    </div>
  );
}
