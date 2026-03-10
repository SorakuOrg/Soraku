import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { MOCK_POSTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Blog</h1><p className="text-sm text-muted-foreground mt-1">{MOCK_POSTS.length} artikel</p></div>
        <Link href="/admin/blog/new" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Artikel Baru
        </Link>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 text-left">{["Judul","Penulis","Tanggal","Status","Aksi"].map(h=><th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border/30">
              {MOCK_POSTS.map(post=>(
                <tr key={post.id} className="hover:bg-primary/3 transition-colors">
                  <td className="px-4 py-3"><p className="font-medium line-clamp-1 max-w-[200px]">{post.title}</p><div className="flex gap-1 mt-0.5">{post.tags.slice(0,2).map(t=><span key={t} className="text-xs text-primary/70">{t}</span>)}</div></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{post.author.display_name}</td>
                  <td className="px-4 py-3 text-muted-foreground/60 text-xs">{formatDate(post.published_at)}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">Terbit</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <Link href={`/blog/${post.slug}`} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/8 hover:text-primary transition-colors"><Eye className="h-3.5 w-3.5"/></Link>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/8 hover:text-primary transition-colors"><Edit className="h-3.5 w-3.5"/></button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5"/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
