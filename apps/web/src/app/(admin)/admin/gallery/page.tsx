import { Check, X, ImageIcon } from "lucide-react";
import { MOCK_GALLERY } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Moderasi Galeri</h1><p className="text-sm text-muted-foreground mt-1">Review upload dari member.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_GALLERY.map(item=>(
          <div key={item.id} className="glass-card overflow-hidden">
            <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center"><ImageIcon className="h-10 w-10 text-foreground/10"/></div>
            <div className="p-4">
              <p className="text-sm font-medium line-clamp-1">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">by {item.author.display_name} · {item.category}</p>
              <p className="text-xs text-muted-foreground/50 mt-0.5">{formatDate(item.created_at)}</p>
              <div className="mt-4 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500/10 py-2 text-xs font-bold text-green-400 hover:bg-green-500/20 transition-colors"><Check className="h-3.5 w-3.5"/>Approve</button>
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-destructive/10 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors"><X className="h-3.5 w-3.5"/>Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
