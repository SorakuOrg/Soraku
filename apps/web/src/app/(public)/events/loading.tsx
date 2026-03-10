export default function EventsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-pulse">
      <div className="mb-12"><div className="h-12 w-56 rounded-xl bg-border/50"/><div className="h-4 w-80 rounded bg-border/30 mt-4"/></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_,i)=><div key={i} className="glass-card overflow-hidden"><div className="h-40 bg-border/20"/><div className="p-5 space-y-3"><div className="h-4 w-full rounded bg-border/30"/><div className="h-3 w-3/4 rounded bg-border/20"/></div></div>)}
      </div>
    </div>
  );
}
