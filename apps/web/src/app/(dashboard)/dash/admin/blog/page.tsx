"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Loader2, RefreshCw, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPost { id: string; slug: string; title: string; excerpt: string | null; ispublished: boolean; tags: string[]; createdat: string; }

export default function AdminBlogPage() {
  const [posts,   setPosts]   = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/blog?limit=50")
      .then(r => r.json()).then(d => setPosts(d.data ?? []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (post: BlogPost) => {
    setSaving(post.id);
    await fetch(`/api/admin/blog/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ispublished: !post.ispublished }) });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ispublished: !p.ispublished } : p));
    setSaving(null);
  };

  const del = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    setSaving(id);
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts(prev => prev.filter(p => p.id !== id));
    setSaving(null);
  };

  const pub = posts.filter(p => p.ispublished).length;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-xl font-bold tracking-tight">Manajemen Blog</h1>
          <p className="text-xs text-muted-foreground/50 mt-0.5">
            {loading ? "Memuat…" : `${posts.length} artikel · ${pub} publik · ${posts.length - pub} draft`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-all disabled:opacity-40">
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
          </button>
          <Link href="/dash/admin/blog/new"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
            <Plus className="h-3.5 w-3.5" /> Artikel Baru
          </Link>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_120px_80px_100px] gap-4 px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          <span>Artikel</span><span>Tags</span><span>Status</span><span className="text-right">Aksi</span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="flex-1 h-4 rounded bg-muted/20" /><div className="h-5 w-14 rounded-full bg-muted/20" />
                <div className="flex gap-1">{[...Array(3)].map((_, j) => <div key={j} className="h-7 w-7 rounded-xl bg-muted/15" />)}</div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground/40">Belum ada artikel</p>
            <Link href="/dash/admin/blog/new" className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/15 transition-all">
              Buat Artikel Pertama
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {posts.map(post => {
              const busy = saving === post.id;
              return (
                <div key={post.id} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_80px_100px] gap-3 sm:gap-4 px-5 py-4 items-center hover:bg-primary/2 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 flex-shrink-0 rounded-full", post.ispublished ? "bg-green-400" : "bg-amber-400/50")} />
                      <p className="text-sm font-semibold truncate">{post.title}</p>
                    </div>
                    {post.excerpt && <p className="mt-0.5 ml-4 text-xs text-muted-foreground/50 truncate">{post.excerpt}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1 ml-4 sm:ml-0">
                    {post.tags.slice(0, 2).map(t => <span key={t} className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] text-primary/70">{t}</span>)}
                  </div>
                  <div className="ml-4 sm:ml-0">
                    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      post.ispublished ? "bg-green-500/10 text-green-400" : "bg-muted/40 text-muted-foreground/60")}>
                      {post.ispublished ? "Publik" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40" /> : (
                      <>
                        <Link href={`/blog/${post.slug}`} target="_blank" title="Lihat"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/40 text-muted-foreground/40 hover:border-primary/30 hover:text-primary transition-all">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button onClick={() => toggle(post)} title={post.ispublished ? "Jadikan Draft" : "Publish"}
                          className={cn("flex h-8 w-8 items-center justify-center rounded-xl border transition-all",
                            post.ispublished
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                              : "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20")}>
                          {post.ispublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button onClick={() => del(post.id)} title="Hapus"
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
