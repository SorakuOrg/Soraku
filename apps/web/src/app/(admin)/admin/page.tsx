"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, ImageIcon, Users, Loader2 } from "lucide-react";

interface AdminStats {
  blog_count:      number;
  event_count:     number;
  gallery_pending: number;
  member_count:    number;
  recent_posts:    Array<{ id: string; title: string; slug: string; ispublished: boolean }>;
  pending_gallery: Array<{ id: string; title: string | null; imageurl: string; tags: string[] }>;
}

export default function AdminDashboardPage() {
  const [stats,   setStats]   = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Satu fetch ke /api/admin/stats — lebih efisien dari 4 fetch terpisah
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => setStats(d.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: "Total Blog",     value: stats?.blog_count,      icon: BookOpen,  href: "/admin/blog",    color: "text-blue-400 bg-blue-500/10"   },
    { label: "Total Event",    value: stats?.event_count,     icon: Calendar,  href: "/admin/events",  color: "text-green-400 bg-green-500/10"  },
    { label: "Galeri Pending", value: stats?.gallery_pending, icon: ImageIcon, href: "/admin/gallery", color: "text-amber-400 bg-amber-500/10"  },
    { label: "Total Member",   value: stats?.member_count,    icon: Users,     href: "/admin/users",   color: "text-primary bg-primary/10"      },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola konten dan komunitas Soraku.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="glass-card p-5 hover:-translate-y-0.5 transition-transform group">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            {loading ? (
              <div className="h-8 w-16 animate-pulse rounded-lg bg-muted/40 mb-1" />
            ) : (
              <p className="text-2xl font-black">{value ?? 0}</p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground/50">
          <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Memuat…</span>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent posts */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold">Blog Terbaru</h2>
              <Link href="/admin/blog" className="text-xs text-primary hover:underline">Kelola →</Link>
            </div>
            <div className="space-y-3">
              {(stats?.recent_posts.length ?? 0) === 0 ? (
                <p className="text-xs text-muted-foreground/50">Belum ada artikel.</p>
              ) : stats?.recent_posts.map(p => (
                <div key={p.id} className="flex items-start justify-between gap-3 text-sm">
                  <p className="line-clamp-1 text-muted-foreground flex-1">{p.title}</p>
                  <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${
                    p.ispublished
                      ? "bg-green-500/10 text-green-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {p.ispublished ? "Live" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Galeri pending */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold">Galeri Pending Review</h2>
              <Link href="/admin/gallery" className="text-xs text-primary hover:underline">Review →</Link>
            </div>
            <div className="space-y-3">
              {(stats?.pending_gallery.length ?? 0) === 0 ? (
                <p className="text-xs text-muted-foreground/50">Tidak ada item pending.</p>
              ) : stats?.pending_gallery.map(g => (
                <div key={g.id} className="flex items-center justify-between gap-3 text-sm">
                  <p className="line-clamp-1 text-muted-foreground flex-1">{g.title ?? "Tanpa judul"}</p>
                  <span className="flex-shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">Pending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
