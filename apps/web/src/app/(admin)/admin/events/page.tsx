"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Wifi, MapPin, Loader2, RefreshCw, Eye, EyeOff } from "lucide-react";

interface Event {
  id: string;
  slug: string;
  title: string;
  startdate: string;
  isonline: boolean;
  ispublished: boolean;
  location: string | null;
}

export default function AdminEventsPage() {
  const [events,  setEvents]  = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/events?status=all&limit=50")
      .then(r => r.json())
      .then(d => setEvents(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePublish = async (ev: Event) => {
    setActing(ev.id);
    await fetch(`/api/admin/events/${ev.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ispublished: !ev.ispublished }),
    });
    setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, ispublished: !e.ispublished } : e));
    setActing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus event ini?")) return;
    setActing(id);
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setEvents(prev => prev.filter(e => e.id !== id));
    setActing(null);
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const upcoming = events.filter(e => new Date(e.startdate) >= new Date());
  const past     = events.filter(e => new Date(e.startdate) <  new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Event</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Memuat…" : `${upcoming.length} mendatang · ${past.length} selesai`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <Link href="/admin/events/new" className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Buat Event
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground/40">
          <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Memuat data…</span>
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <p className="text-sm text-muted-foreground/50">Belum ada event.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50">
              <tr className="text-xs text-muted-foreground/60">
                <th className="px-4 py-3 text-left font-medium">Event</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Tanggal</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Tipe</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-primary/3 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{ev.title}</p>
                    <p className="text-xs text-muted-foreground/50 mt-0.5">/events/{ev.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground/60 hidden md:table-cell">
                    {fmt(ev.startdate)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                      {ev.isonline
                        ? <><Wifi className="h-3 w-3 text-blue-400" /> Online</>
                        : <><MapPin className="h-3 w-3 text-green-400" /> {ev.location ?? "Offline"}</>
                      }
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      new Date(ev.startdate) < new Date()
                        ? "bg-muted text-muted-foreground"
                        : ev.ispublished
                          ? "bg-green-500/10 text-green-400"
                          : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {new Date(ev.startdate) < new Date() ? "Selesai" : ev.ispublished ? "Publik" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/events/${ev.slug}`} target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-primary/8 hover:text-primary transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handlePublish(ev)}
                        disabled={acting === ev.id}
                        title={ev.ispublished ? "Jadikan Draft" : "Publish"}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-primary/8 hover:text-primary transition-colors disabled:opacity-40"
                      >
                        {acting === ev.id
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : ev.ispublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 text-green-400" />
                        }
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        disabled={acting === ev.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
