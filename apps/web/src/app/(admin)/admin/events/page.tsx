import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Wifi, MapPin } from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { formatEventDate } from "@/lib/utils";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Event</h1><p className="text-sm text-muted-foreground mt-1">{MOCK_EVENTS.length} event total</p></div>
        <Link href="/admin/events/new" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Event Baru
        </Link>
      </div>
      <div className="space-y-3">
        {MOCK_EVENTS.map(event=>{
          const isUpcoming = new Date(event.starts_at) > new Date();
          const TypeIcon = event.event_type === "online" ? Wifi : MapPin;
          return (
            <div key={event.id} className="glass-card p-5 flex items-start gap-4">
              <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${isUpcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}><TypeIcon className="h-4 w-4"/></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium line-clamp-1">{event.title}</h3>
                  <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${isUpcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{isUpcoming ? "Upcoming" : "Selesai"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formatEventDate(event.starts_at)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href={`/events/${event.slug}`} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/8 hover:text-primary transition-colors"><Eye className="h-3.5 w-3.5"/></Link>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/8 hover:text-primary transition-colors"><Edit className="h-3.5 w-3.5"/></button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5"/></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
