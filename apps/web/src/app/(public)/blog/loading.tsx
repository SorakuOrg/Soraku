export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-pulse">
      <div className="mb-12">
        <div className="h-4 w-24 rounded-full bg-primary/10 mb-4" />
        <div className="h-12 w-64 rounded-xl bg-border/50" />
        <div className="h-4 w-80 rounded bg-border/30 mt-4" />
      </div>
      <div className="mb-8 flex gap-2 flex-wrap">
        {[...Array(6)].map((_,i)=><div key={i} className="h-8 w-20 rounded-full bg-border/30"/>)}
      </div>
      <div className="glass-card mb-8 grid lg:grid-cols-2 h-48 lg:h-64"/>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_,i)=>(
          <div key={i} className="glass-card overflow-hidden">
            <div className="h-36 bg-border/20"/>
            <div className="p-5 space-y-3">
              <div className="h-3 w-full rounded bg-border/30"/>
              <div className="h-3 w-3/4 rounded bg-border/20"/>
              <div className="h-3 w-1/2 rounded bg-border/15"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
