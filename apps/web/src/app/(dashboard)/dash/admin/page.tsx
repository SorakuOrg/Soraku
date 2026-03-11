"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, ImageIcon, Users, Loader2, ExternalLink } from "lucide-react";

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
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => setStats(d.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: "Total Blog",      value: stats?.blog_count      ?? 0, icon: BookOpen,  href: "/admin/blog",    color: "text-blue-400 bg-blue-500/10"     },
    { label: "Total Event",     value: stats?.event_count     ?? 0, icon: Calendar,  href: "/admin/events",  color: "text-green-400 bg-green-500/10"   },
    { label: "Galeri Pending",  value: stats?.gallery_pending ?? 0, icon: ImageIcon, href: "/admin/gallery", color: "text-amber-400 bg-amber-500/10"   },
    { label: "Total Member",    value: stats?.member_count    ?? 0, icon: Users,     href: "/admin/users",   color: "text-primary bg-primary/10"       },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola konten dan komunitas Soraku.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="glass-card p-5 hover:-translate-y-0.5 transition-transform group">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            {loading
              ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/30 mb-1" />
              : <p className="text-2xl font-black">{value}</p>
            }
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent posts */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Blog Terbaru</h2>
            <Link href="/dash/admin/blog" className="text-xs text-primary hover:underline">Lihat semua</Link>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground/40 py-4"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-xs">Memuat…</span></div>
          ) : stats?.recent_posts?.length === 0 ? (
            <p className="text-xs text-muted-foreground/40 py-4">Belum ada artikel.</p>
          ) : (
            <ul className="space-y-2">
              {stats?.recent_posts?.map(p => (
                <li key={p.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm truncate flex-1">{p.title}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${p.ispublished ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {p.ispublished ? "Publik" : "Draft"}
                    </span>
                    <Link href={`/blog/${p.slug}`} target="_blank"><ExternalLink className="h-3 w-3 text-muted-foreground/40 hover:text-foreground" /></Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending gallery */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Galeri Pending</h2>
            <Link href="/dash/admin/gallery" className="text-xs text-primary hover:underline">Moderasi</Link>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground/40 py-4"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-xs">Memuat…</span></div>
          ) : stats?.pending_gallery?.length === 0 ? (
            <p className="text-xs text-muted-foreground/40 py-4">Tidak ada item pending. ✅</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {stats?.pending_gallery?.map(item => (
                <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl bg-primary/5">
                  {item.imageurl
                    ? <Image src={item.imageurl} alt={item.title ?? "galeri"} fill className="object-cover" />
                    : <div className="flex h-full items-center justify-center"><ImageIcon className="h-6 w-6 text-foreground/10" /></div>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
