export default function GalleryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-pulse">
      <div className="mb-8"><div className="h-12 w-48 rounded-xl bg-border/50"/></div>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {[...Array(8)].map((_,i)=><div key={i} className="mb-4 break-inside-avoid glass-card h-48 bg-border/20"/>)}
      </div>
    </div>
  );
}
