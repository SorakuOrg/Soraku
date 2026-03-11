"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Loader2, RefreshCw, Calendar, Wifi, MapPin, ExternalLink } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface EventItem { id: string; slug: string; title: string; startdate: string; isonline: boolean; ispublished: boolean; tags: string[]; location: string | null; }

export default function AdminEventsPage() {
  const [events,  setEvents]  = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/events?status=all&limit=50")
      .then(r => r.json()).then(d => setEvents(d.data ?? []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (ev: EventItem) => {
    setSaving(ev.id);
    await fetch(`/api/admin/events/${ev.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ispublished: !ev.ispublished }) });
    setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, ispublished: !e.ispublished } : e));
    setSaving(null);
  };

  const del = async (id: string) => {
    if (!confirm("Hapus event ini?")) return;
    setSaving(id);
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setEvents(prev => prev.filter(e => e.id !== id));
    setSaving(null);
  };

  const isPast = (d: string) => new Date(d) < new Date();
  const pub = events.filter(e => e.ispublished).length;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-xl font-bold tracking-tight">Manajemen Event</h1>
          <p className="text-xs text-muted-foreground/50 mt-0.5">
            {loading ? "Memuat…" : `${events.length} event · ${pub} publik · ${events.length - pub} draft`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-all disabled:opacity-40">
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
          </button>
          <Link href="/dash/admin/events/new"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
            <Plus className="h-3.5 w-3.5" /> Event Baru
          </Link>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_140px_80px_100px] gap-4 px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          <span>Event</span><span>Tanggal</span><span>Status</span><span className="text-right">Aksi</span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="flex-1 h-4 rounded bg-muted/20" /><div className="h-4 w-20 rounded bg-muted/15" /><div className="h-5 w-14 rounded-full bg-muted/20" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Calendar className="h-8 w-8 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground/40">Belum ada event</p>
            <Link href="/dash/admin/events/new" className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/15 transition-all">
              Buat Event Pertama
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {events.map(ev => {
              const past = isPast(ev.startdate);
              const busy = saving === ev.id;
              const statusCls = past ? "bg-muted/40 text-muted-foreground/50" : ev.ispublished ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400";
              const statusLabel = past ? "Selesai" : ev.ispublished ? "Publik" : "Draft";
              return (
                <div key={ev.id} className="grid grid-cols-1 sm:grid-cols-[1fr_140px_80px_100px] gap-3 sm:gap-4 px-5 py-4 items-center hover:bg-primary/2 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 flex-shrink-0 rounded-full", past ? "bg-muted-foreground/30" : ev.ispublished ? "bg-green-400" : "bg-amber-400/50")} />
                      <p className="text-sm font-semibold truncate">{ev.title}</p>
                    </div>
                    <div className="ml-4 mt-1">
                      {ev.isonline
                        ? <span className="flex items-center gap-1 text-[10px] text-primary/60"><Wifi className="h-2.5 w-2.5" />Online</span>
                        : <span className="flex items-center gap-1 text-[10px] text-green-400/60"><MapPin className="h-2.5 w-2.5" />{ev.location ?? "Offline"}</span>
                      }
                    </div>
                  </div>
                  <p className="ml-4 sm:ml-0 text-xs text-muted-foreground/60">{formatDate(ev.startdate)}</p>
                  <div className="ml-4 sm:ml-0"><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", statusCls)}>{statusLabel}</span></div>
                  <div className="flex items-center justify-end gap-1.5">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40" /> : (
                      <>
                        <Link href={`/events/${ev.slug}`} target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/40 text-muted-foreground/40 hover:border-primary/30 hover:text-primary transition-all">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        {!past && (
                          <button onClick={() => toggle(ev)}
                            className={cn("flex h-8 w-8 items-center justify-center rounded-xl border transition-all",
                              ev.ispublished ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20")}>
                            {ev.ispublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        )}
                        <button onClick={() => del(ev.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive/60 hover:bg-destructive/15 hover:text-destructive transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
