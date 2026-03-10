import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Tag, ArrowRight } from "lucide-react";
import { MOCK_POSTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — Soraku Community",
  description: "Artikel, review, dan ulasan anime & budaya Jepang dari komunitas Soraku.",
};

const ALL_TAGS = ["Semua", "anime", "manga", "cosplay", "review", "list", "panduan", "event", "musik"];

export default function BlogPage({ searchParams }: { searchParams?: { tag?: string } }) {
  const activeTag = searchParams?.tag ?? "Semua";
  const posts = activeTag === "Semua"
    ? MOCK_POSTS
    : MOCK_POSTS.filter((p) => p.tags.includes(activeTag));

  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Komunitas</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Blog <span className="text-gradient">Soraku</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Artikel, review anime, tips cosplay, dan cerita dari komunitas Soraku Indonesia.
        </p>
      </div>

      {/* Tags filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        {ALL_TAGS.map((tag) => (
          <Link key={tag} href={tag === "Semua" ? "/blog" : `/blog?tag=${tag}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTag === tag
                ? "bg-primary text-white"
                : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}>
            {tag}
          </Link>
        ))}
      </div>

      {/* Featured post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`}
          className="glass-card mb-8 grid overflow-hidden lg:grid-cols-2 hover:border-primary/30 transition-colors group">
          <div className="h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15 flex items-center justify-center lg:h-auto">
            <span className="text-6xl opacity-10">空</span>
          </div>
          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {featured.tags.slice(0, 3).map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs text-primary"><Tag className="h-2.5 w-2.5" />{t}</span>
              ))}
              <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />{featured.read_time} menit
              </span>
            </div>
            <h2 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors sm:text-2xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{featured.excerpt}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60">{formatDate(featured.published_at)}</span>
              <span className="flex items-center gap-1 text-sm text-primary font-medium">Baca <ArrowRight className="h-3.5 w-3.5" /></span>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}
            className="glass-card overflow-hidden hover:-translate-y-1 hover:border-primary/30 transition-all group">
            <div className="h-36 bg-gradient-to-br from-primary/15 via-accent/8 to-border flex items-center justify-center">
              <span className="text-4xl opacity-10">空</span>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-xs text-primary/80">{t}</span>
                ))}
                <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground/60">
                  <Clock className="h-3 w-3" />{post.read_time}m
                </span>
              </div>
              <h3 className="text-base font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
              <p className="mt-3 text-xs text-muted-foreground/50">{formatDate(post.published_at)}</p>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Belum ada artikel dengan tag ini.</p>
          <Link href="/blog" className="mt-4 inline-block text-sm text-primary hover:underline">Lihat semua artikel</Link>
        </div>
      )}
    </div>
  );
}
