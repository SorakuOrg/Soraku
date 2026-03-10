import type { Metadata } from "next";
import Link from "next/link";
import { Upload, ImageIcon } from "lucide-react";
import { MOCK_GALLERY } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Galeri — Soraku Community",
  description: "Galeri karya anggota komunitas Soraku — fanart, cosplay, digital art, dan foto.",
};

const CATEGORIES = ["Semua", "fanart", "cosplay", "digital", "foto", "lainnya"];
const COLORS = [
  "from-pink-500/20 to-rose-500/15",
  "from-violet-500/20 to-purple-500/15",
  "from-blue-500/20 to-cyan-500/15",
  "from-amber-500/20 to-yellow-500/15",
  "from-green-500/20 to-emerald-500/15",
  "from-primary/20 to-accent/10",
];

export default function GalleryPage({ searchParams }: { searchParams?: { category?: string } }) {
  const activeCategory = searchParams?.category ?? "Semua";
  const items = activeCategory === "Semua"
    ? MOCK_GALLERY
    : MOCK_GALLERY.filter((i) => i.category === activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Komunitas</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Galeri <span className="text-gradient">Karya</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Fanart, cosplay, dan karya kreatif dari anggota Soraku.</p>
        </div>
        <Link href="/gallery/upload"
          className="flex items-center gap-2 self-start rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all sm:self-auto">
          <Upload className="h-4 w-4" /> Upload Karya
        </Link>
      </div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Link key={cat} href={cat === "Semua" ? "/gallery" : `/gallery?category=${cat}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}>
            {cat}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {items.map((item, i) => (
            <div key={item.id} className="mb-4 break-inside-avoid glass-card overflow-hidden group cursor-pointer hover:-translate-y-0.5 transition-transform">
              <div className={`bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center`}
                style={{ aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "4/3" }}>
                <ImageIcon className="h-10 w-10 text-foreground/10" />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium line-clamp-1 group-hover:text-primary transition-colors">{item.title}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">by {item.author.display_name ?? item.author.username}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded text-[10px] text-muted-foreground/50">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Upload CTA card */}
          <div className="mb-4 break-inside-avoid">
            <Link href="/gallery/upload"
              className="glass-card flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors"
              style={{ aspectRatio: "1/1" }}>
              <Upload className="h-8 w-8 text-primary/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Upload karyamu</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Bagikan ke komunitas</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Belum ada karya dengan kategori ini.</p>
          <Link href="/gallery" className="mt-4 inline-block text-sm text-primary hover:underline">Lihat semua</Link>
        </div>
      )}
    </div>
  );
}
