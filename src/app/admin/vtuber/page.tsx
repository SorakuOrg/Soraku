'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import { useAuthRole } from '@/hooks/useAuthRole'
import { hasPermission } from '@/lib/roles'
import { useRouter } from 'next/navigation'
import type { VtuberRow } from '@/lib/supabase'

export default function AdminVtuberPage() {
  const { role, loading: authLoading } = useAuthRole()
  const router = useRouter()
  const [vtubers, setVtubers] = useState<VtuberRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<VtuberRow | null>(null)
  const [form, setForm] = useState({ name: '', bio: '', avatar_url: '', generation: '1', agency: '', social_links: '{}' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !hasPermission(role ?? undefined, ['MANAGER', 'AGENSI'])) router.push('/admin')
  }, [role, authLoading, router])

  const fetchVtubers = async () => {
    const res = await fetch('/api/vtuber')
    if (res.ok) { const d = await res.json(); setVtubers(d) }
    setLoading(false)
  }

  useEffect(() => { fetchVtubers() }, [])

  const handleSubmit = async () => {
    if (!form.name) return toast.error('Nama wajib diisi')
    let socialLinks = {}
    try { socialLinks = JSON.parse(form.social_links) } catch { return toast.error('Format social links tidak valid (JSON)') }
    setSubmitting(true)
    try {
      const method = editing ? 'PUT' : 'POST'
      const url = editing ? `/api/vtuber/${editing.id}` : '/api/vtuber'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, social_links: socialLinks, generation: parseInt(form.generation) })
      })
      if (res.ok) { toast.success(editing ? 'VTuber diperbarui!' : 'VTuber ditambahkan!'); setShowForm(false); setEditing(null); fetchVtubers() }
      else { const err = await res.json(); toast.error(err.error || 'Gagal') }
    } finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    if (!hasPermission(role ?? undefined, ['MANAGER'])) return toast.error('Tidak punya akses')
    if (!confirm('Hapus VTuber ini?')) return
    const res = await fetch(`/api/vtuber/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Dihapus'); fetchVtubers() } else toast.error('Gagal hapus')
  }

  if (authLoading || loading) return <div className="min-h-screen bg-dark-base flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-secondary hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
              <h1 className="text-2xl font-bold text-white">Kelola VTuber</h1>
            </div>
            <button onClick={() => { setEditing(null); setForm({ name: '', bio: '', avatar_url: '', generation: '1', agency: '', social_links: '{}' }); setShowForm(true) }} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Tambah VTuber
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vtubers.length === 0 ? <div className="col-span-3 text-center py-20 text-secondary">Belum ada VTuber</div> : vtubers.map(v => (
              <div key={v.id} className="glass-card p-5 flex items-start gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-primary/20">
                  {v.avatar_url ? <Image src={v.avatar_url} alt={v.name} width={56} height={56} className="object-cover w-full h-full" /> : <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">{v.name[0]}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{v.name}</h3>
                  <span className="badge bg-primary/10 text-primary border-primary/20 text-xs">Gen {v.generation}</span>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => { setEditing(v); setForm({ name: v.name, bio: v.bio || '', avatar_url: v.avatar_url || '', generation: String(v.generation), agency: (v as any).agency || '', social_links: JSON.stringify(v.social_links || {}, null, 2) }); setShowForm(true) }} className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-primary/10"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-lg text-secondary hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass-card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit VTuber' : 'Tambah VTuber'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-secondary" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm text-secondary mb-1 block">Nama *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm text-secondary mb-1 block">Bio</label><textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} className="input-field resize-none" /></div>
              <div><label className="text-sm text-secondary mb-1 block">Avatar URL</label><input value={form.avatar_url} onChange={e => setForm({...form, avatar_url: e.target.value})} className="input-field" placeholder="https://..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-secondary mb-1 block">Generasi</label>
                  <select value={form.generation} onChange={e => setForm({...form, generation: e.target.value})} className="input-field">
                    <option value="1">Generasi 1</option><option value="2">Generasi 2</option><option value="3">Generasi 3</option>
                  </select>
                </div>
                <div><label className="text-sm text-secondary mb-1 block">Agency</label><input value={form.agency} onChange={e => setForm({...form, agency: e.target.value})} className="input-field" /></div>
              </div>
              <div><label className="text-sm text-secondary mb-1 block">Social Links (JSON)</label>
                <textarea value={form.social_links} onChange={e => setForm({...form, social_links: e.target.value})} rows={4} className="input-field resize-none font-mono text-xs" placeholder={'{\n  "youtube": "https://..."\n}'} />
              </div>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />} {submitting ? 'Menyimpan...' : editing ? 'Perbarui' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
