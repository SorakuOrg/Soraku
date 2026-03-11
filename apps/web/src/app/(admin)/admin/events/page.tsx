"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Wifi, MapPin, Loader2 } from "lucide-react";

interface Event {
  id: string;
  slug: string;
  title: string;
  startdate: string;   // ← field real dari DB
  isonline: boolean;   // ← field real dari DB
  ispublished: boolean;
}

export default function AdminEventsPage() {
  const [events,  setEvents]  = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events?status=all&limit=50")
      .then(r => r.json())
      .then(d => setEvents(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Event</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Memuat…" : `${events.length} event total`}
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Event Baru
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground/50">
          <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Memuat data…</span>
        </div>
      ) : events.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground/50">Belum ada event.</p>
      ) : (
        <div className="space-y-3">
          {events.map(event => {
            const isUpcoming = new Date(event.startdate) > new Date();
            const TypeIcon   = event.isonline ? Wifi : MapPin;
            return (
              <div key={event.id} className="glass-card p-5 flex items-start gap-4">
                <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                  isUpcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <TypeIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-medium line-clamp-1">{event.title}</h3>
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isUpcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {isUpcoming ? "Upcoming" : "Selesai"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{fmt(event.startdate)}</p>
                  {!event.ispublished && (
                    <span className="mt-1 inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">Draft</span>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/events/${event.slug}`}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/8 hover:text-primary transition-colors">
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/8 hover:text-primary transition-colors">
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
