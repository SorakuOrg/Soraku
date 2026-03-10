import Link from "next/link";
import { BookOpen, Calendar, Image, Users, TrendingUp } from "lucide-react";
import { MOCK_POSTS, MOCK_EVENTS, MOCK_GALLERY } from "@/lib/mock-data";

const STATS = [
  { label: "Total Blog", value: MOCK_POSTS.length, icon: BookOpen, href: "/admin/blog", color: "text-blue-400 bg-blue-500/10" },
  { label: "Total Event", value: MOCK_EVENTS.length, icon: Calendar, href: "/admin/events", color: "text-green-400 bg-green-500/10" },
  { label: "Galeri Pending", value: 3, icon: Image, href: "/admin/gallery", color: "text-amber-400 bg-amber-500/10" },
  { label: "Total Member", value: 500, icon: Users, href: "/admin/users", color: "text-primary bg-primary/10" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola konten dan komunitas Soraku.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="glass-card p-5 hover:-translate-y-0.5 transition-transform group">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent posts */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Blog Terbaru</h2>
            <Link href="/admin/blog" className="text-xs text-primary hover:underline">Kelola →</Link>
          </div>
          <div className="space-y-3">
            {MOCK_POSTS.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-3 text-sm">
                <p className="line-clamp-1 text-muted-foreground flex-1">{p.title}</p>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400 flex-shrink-0">Live</span>
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
            {MOCK_GALLERY.slice(0, 3).map((g) => (
              <div key={g.id} className="flex items-center justify-between gap-3 text-sm">
                <p className="line-clamp-1 text-muted-foreground flex-1">{g.title}</p>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400 flex-shrink-0">Pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
