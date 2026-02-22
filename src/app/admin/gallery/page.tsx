'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import GalleryCard from '@/components/GalleryCard'
import { useAuthRole } from '@/hooks/useAuthRole'
import { hasPermission } from '@/lib/roles'
import { useRouter } from 'next/navigation'
import type { GalleryRow } from '@/lib/supabase'

export default function AdminGalleryPage() {
  const { role, loading: authLoading } = useAuthRole()
  const router = useRouter()
  const [items, setItems] = useState<GalleryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    if (!authLoading && !hasPermission(role ?? undefined, ['MANAGER', 'ADMIN'])) router.push('/admin')
  }, [role, authLoading, router])

  const fetchItems = async () => {
    const res = await fetch(`/api/gallery?status=${filter}`)
    if (res.ok) { const d = await res.json(); setItems(d) }
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [filter])

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/gallery/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved' }) })
    if (res.ok) { toast.success('Disetujui!'); fetchItems() } else toast.error('Gagal')
  }

  const handleReject = async (id: string) => {
    const res = await fetch(`/api/gallery/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' }) })
    if (res.ok) { toast.success('Ditolak'); fetchItems() } else toast.error('Gagal')
  }

  if (authLoading) return <div className="min-h-screen bg-dark-base flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="text-secondary hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-2xl font-bold text-white">Review Gallery</h1>
          </div>

          <div className="flex gap-3 mb-8">
            {(['pending', 'approved', 'rejected'] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === s ? 'bg-primary/20 text-primary border border-primary/30' : 'text-secondary hover:text-white hover:bg-white/5'}`}>{s}</button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="aspect-square glass-card animate-pulse" />)}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-secondary"><div className="text-6xl mb-4">🖼️</div><p>Tidak ada foto dengan status {filter}</p></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => <GalleryCard key={item.id} item={item} isAdmin onApprove={handleApprove} onReject={handleReject} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
