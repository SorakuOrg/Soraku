'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Upload, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GalleryCard from '@/components/GalleryCard'
import type { GalleryRow } from '@/lib/supabase'

export default function GalleryPage() {
  const { isSignedIn, user } = useUser()
  const [items, setItems] = useState<GalleryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/gallery?status=approved')
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!imageUrl) return toast.error('Masukkan URL gambar')
    setSubmitting(true)
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, caption, uploader_name: user?.firstName || 'Anonim' }),
      })
      if (res.ok) {
        toast.success('Foto berhasil diupload! Menunggu persetujuan.')
        setShowUpload(false)
        setImageUrl('')
        setCaption('')
      } else {
        toast.error('Gagal upload foto')
      }
    } catch {
      toast.error('Terjadi error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-14">
            <div>
              <h1 className="page-title">Gallery</h1>
              <p className="text-secondary text-lg">Foto dan karya dari komunitas Soraku</p>
            </div>
            {isSignedIn && (
              <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload Foto
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="aspect-square glass-card animate-pulse" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-secondary">
              <div className="text-6xl mb-4">🖼️</div>
              <p>Belum ada foto di gallery</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => <GalleryCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowUpload(false)}>
          <div className="glass-card p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Upload Foto</h2>
              <button onClick={() => setShowUpload(false)} className="text-secondary hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-secondary mb-2 block">URL Gambar *</label>
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="input-field" />
              </div>
              <div>
                <label className="text-sm text-secondary mb-2 block">Caption</label>
                <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Deskripsi foto..." rows={3} className="input-field resize-none" />
              </div>
              <p className="text-xs text-secondary/60">Foto akan di-review sebelum tampil di gallery.</p>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {submitting ? 'Mengupload...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
