"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X, ImageIcon, Loader2 } from "lucide-react";

interface GalleryItem {
  id: string; title: string; imageurl: string;
  category: string; createdat: string;
  author?: { display_name?: string };
}

export default function AdminGalleryPage() {
  const [items,   setItems]   = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery?status=pending&limit=30")
      .then(r => r.json())
      .then(d => setItems(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handle = async (id: string, action: "approved" | "rejected") => {
    await fetch(`/api/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Moderasi Galeri</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? "Memuat…" : `${items.length} item pending review`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground/50">
          <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Memuat data…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card py-14 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground/50">Tidak ada item pending.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <div key={item.id} className="glass-card overflow-hidden">
              <div className="relative h-36 bg-gradient-to-br from-primary/10 to-accent/5">
                {item.imageurl ? (
                  <Image src={item.imageurl} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-foreground/10" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  by {item.author?.display_name ?? "—"} · {item.category}
                </p>
                <p className="text-xs text-muted-foreground/50 mt-0.5">{fmt(item.createdat)}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handle(item.id, "approved")}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500/10 py-2 text-xs font-bold text-green-400 hover:bg-green-500/20 transition-colors">
                    <Check className="h-3.5 w-3.5" />Approve
                  </button>
                  <button onClick={() => handle(item.id, "rejected")}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-destructive/10 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors">
                    <X className="h-3.5 w-3.5" />Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
