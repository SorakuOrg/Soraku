"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2, RefreshCw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem { id: string; title: string | null; imageurl: string; tags: string[]; createdat: string; }

export default function AdminGalleryPage() {
  const [items,   setItems]   = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/gallery?status=pending&limit=30")
      .then(r => r.json()).then(d => setItems(d.data ?? []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const moderate = async (id: string, status: "approved" | "rejected") => {
    setSaving(id);
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      setItems(prev => prev.filter(i => i.id !== id));
    } finally { setSaving(null); }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-xl font-bold tracking-tight">Moderasi Galeri</h1>
          <p className="text-xs text-muted-foreground/50 mt-0.5">
            {loading ? "Memuat…" : `${items.length} upload menunggu review`}
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-all disabled:opacity-40">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-muted/20 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
            <CheckCircle className="h-7 w-7 text-green-400/60" />
          </div>
          <p className="text-sm font-semibold text-foreground/60">Semua sudah bersih!</p>
          <p className="text-xs text-muted-foreground/40">Tidak ada upload yang menunggu review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(item => {
            const busy = saving === item.id;
            return (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
                <div className="relative aspect-square bg-muted/20">
                  <Image src={item.imageurl} alt={item.title ?? ""} fill className="object-cover" />
                  <div className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 backdrop-blur-sm">
                    <Clock className="h-2.5 w-2.5 text-amber-400" />
                    <span className="text-[9px] font-bold text-amber-400">Pending</span>
                  </div>
                </div>
                <div className="p-3 space-y-2.5">
                  {item.title && <p className="text-xs font-semibold truncate">{item.title}</p>}
                  {busy ? (
                    <div className="flex justify-center py-1"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40" /></div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={() => moderate(item.id, "approved")}
                        className="flex items-center justify-center gap-1 rounded-xl bg-green-500/10 border border-green-500/20 py-2 text-[11px] font-bold text-green-400 hover:bg-green-500/20 transition-all">
                        <CheckCircle className="h-3 w-3" /> Approve
                      </button>
                      <button onClick={() => moderate(item.id, "rejected")}
                        className="flex items-center justify-center gap-1 rounded-xl bg-destructive/10 border border-destructive/20 py-2 text-[11px] font-bold text-destructive hover:bg-destructive/20 transition-all">
                        <XCircle className="h-3 w-3" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
