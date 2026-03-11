"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  publishedat: string | null;
  ispublished: boolean;
  createdat: string;
}

export default function AdminBlogPage() {
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [acting,  setActing]  = useState<string | null>(null); // id yang sedang diproses

  const load = () => {
    setLoading(true);
    fetch("/api/blog?limit=50")
      .then(r => r.json())
      .then(d => {
        setPosts(d.data ?? []);
        setTotal(d.meta?.total ?? d.data?.length ?? 0); // ← fix: d.meta.total
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePublish = async (post: Post) => {
    setActing(post.id);
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ispublished: !post.ispublished }),
    });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ispublished: !p.ispublished } : p));
    setActing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus artikel ini? Aksi tidak bisa dibatalkan.")) return;
    setActing(id);
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts(prev => prev.filter(p => p.id !== id));
    setTotal(t => t - 1);
    setActing(null);
  };

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Memuat…" : `${total} artikel total`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <Link href="/admin/blog/new" className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Buat Post
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground/40">
          <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Memuat data…</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <p className="text-sm text-muted-foreground/50">Belum ada artikel.</p>
          <Link href="/admin/blog/new" className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Plus className="h-3.5 w-3.5" /> Buat artikel pertama
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50">
              <tr className="text-xs text-muted-foreground/60">
                <th className="px-4 py-3 text-left font-medium">Judul</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Tag</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Tanggal</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-primary/3 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{post.title}</p>
                    <p className="text-xs text-muted-foreground/50 mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 2).map(t => (
                        <span key={t} className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] text-primary/80">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground/60 hidden lg:table-cell">
                    {fmt(post.publishedat ?? post.createdat)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${post.ispublished ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {post.ispublished ? "Publik" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/blog/${post.slug}`} target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-primary/8 hover:text-primary transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handlePublish(post)}
                        disabled={acting === post.id}
                        title={post.ispublished ? "Jadikan Draft" : "Publish"}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-primary/8 hover:text-primary transition-colors disabled:opacity-40"
                      >
                        {acting === post.id
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : post.ispublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 text-green-400" />
                        }
                      </button>
                      <Link href={`/admin/blog/${post.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-primary/8 hover:text-primary transition-colors">
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={acting === post.id}
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
