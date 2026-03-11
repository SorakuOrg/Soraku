"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState, useRef } from "react";
import { Upload, ImageIcon, X, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

const CATEGORIES = ["fanart", "cosplay", "digital", "foto", "lainnya"];

export default function GalleryUploadPage() {
  const [dragOver, setDragOver]   = useState(false);
  const [preview, setPreview]     = useState<string | null>(null);
  const [file, setFile]           = useState<File | null>(null);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const titleRef    = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const tagsRef     = useRef<HTMLInputElement>(null);
  const descRef     = useRef<HTMLTextAreaElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) { setError("File harus berupa gambar (jpg/png/webp/gif)"); return; }
    if (f.size > 10 * 1024 * 1024)   { setError("Ukuran maksimal 10MB"); return; }
    setError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Pilih gambar dulu"); return; }

    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append("file", file);
    form.append("title", titleRef.current?.value ?? "");
    form.append("tags",  tagsRef.current?.value ?? "");
    form.append("description", descRef.current?.value ?? "");
    // Tambahkan kategori sebagai tag pertama
    const cat = categoryRef.current?.value;
    if (cat) {
      const existingTags = tagsRef.current?.value ?? "";
      const allTags = [cat, ...existingTags.split(",").map(t => t.trim()).filter(Boolean)].join(",");
      form.set("tags", allTags);
    }

    try {
      const res = await fetch("/api/gallery/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error?.message ?? json.error ?? "Upload gagal, coba lagi");
      } else {
        setSuccess(true);
        setFile(null);
        setPreview(null);
        if (titleRef.current)    titleRef.current.value    = "";
        if (categoryRef.current) categoryRef.current.value = "";
        if (tagsRef.current)     tagsRef.current.value     = "";
        if (descRef.current)     descRef.current.value     = "";
      }
    } catch {
      setError("Koneksi gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="glass-card p-12">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Upload Berhasil! 🎉</h2>
          <p className="text-muted-foreground mb-8">
            Karya kamu sudah masuk antrian review. Moderator akan memeriksa sebelum tampil di galeri publik.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => setSuccess(false)}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
              Upload Lagi
            </button>
            <Link href="/gallery"
              className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
              Lihat Galeri
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Image upload area */}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full rounded-2xl max-h-64 object-cover" />
              <button type="button"
                onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
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
              <p className="text-xs text-muted-foreground/50 mt-3">PNG, JPG, WEBP, GIF · Maks. 10MB</p>
            </div>
          )}
          <input id="file-input" type="file" className="hidden" accept="image/*"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Judul Karya <span className="text-destructive">*</span></label>
            <input ref={titleRef} required type="text" placeholder="Nama karya kamu"
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Kategori <span className="text-destructive">*</span></label>
            <select ref={categoryRef} required
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors">
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
            <input ref={tagsRef} type="text" placeholder="naruto, sasuke, fanart"
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Deskripsi <span className="text-muted-foreground font-normal text-xs">(opsional)</span></label>
            <textarea ref={descRef} rows={3} placeholder="Ceritakan tentang karya ini..."
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none" />
          </div>
        </div>

        <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent/80">
          💡 Karya kamu akan direview oleh moderator sebelum tampil di galeri publik.
        </div>

        <button type="submit" disabled={loading || !file}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none">
          <Upload className="h-4 w-4" />
          {loading ? "Mengupload..." : "Upload Karya"}
        </button>
      </form>
    </div>
  );
}
