"use client";
import Link from "next/link";
import { useState } from "react";
import { Upload, ImageIcon, X, ArrowLeft } from "lucide-react";

const CATEGORIES = ["fanart", "cosplay", "digital", "foto", "lainnya"];

export default function GalleryUploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Kaizo — hit POST /api/gallery/upload (multipart)
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/gallery" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Galeri
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black">Upload <span className="text-gradient">Karya</span></h1>
        <p className="mt-2 text-muted-foreground">Bagikan karya kreatifmu ke komunitas Soraku. Semua upload akan direview moderator.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image upload */}
        <div
          className={`relative rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full rounded-2xl max-h-64 object-cover" />
              <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-xl bg-background/80 text-foreground hover:bg-background backdrop-blur-sm">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ImageIcon className="h-7 w-7" />
              </div>
              <p className="font-medium">Drag & drop gambar di sini</p>
              <p className="text-sm text-muted-foreground mt-1">atau klik untuk pilih file</p>
              <p className="text-xs text-muted-foreground/50 mt-3">PNG, JPG, WEBP · Maks. 10MB</p>
            </div>
          )}
          <input id="file-input" type="file" className="hidden" accept="image/*"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Judul Karya <span className="text-destructive">*</span></label>
            <input required type="text" placeholder="Nama karya kamu"
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Kategori <span className="text-destructive">*</span></label>
            <select required className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors">
              <option value="">Pilih kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-background capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Tags <span className="text-muted-foreground font-normal text-xs">(pisahkan dengan koma)</span>
            </label>
            <input type="text" placeholder="naruto, sasuke, fanart"
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Deskripsi <span className="text-muted-foreground font-normal text-xs">(opsional)</span></label>
            <textarea rows={3} placeholder="Ceritakan tentang karya ini..."
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none" />
          </div>
        </div>

        {/* Notice */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent/80">
          💡 Karya kamu akan direview oleh moderator sebelum tampil di galeri publik.
        </div>

        <button type="submit" disabled={loading || !preview}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none">
          <Upload className="h-4 w-4" />
          {loading ? "Mengupload..." : "Upload Karya"}
        </button>
      </form>
    </div>
  );
}
