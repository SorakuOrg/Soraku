'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import { useAuthRole } from '@/hooks/useAuthRole'
import { formatDate } from '@/lib/utils'
import { hasPermission } from '@/lib/roles'
import { useRouter } from 'next/navigation'

type Event = { id: string; title: string; status: string; start_date: string; end_date: string; description?: string; banner_image?: string }

export default function AdminEventsPage() {
  const { role, loading: authLoading } = useAuthRole()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState({ title: '', description: '', banner_image: '', start_date: '', end_date: '', status: 'upcoming' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !hasPermission(role ?? undefined, ['MANAGER', 'AGENSI'])) router.push('/admin')
  }, [role, authLoading, router])

  const fetchEvents = async () => {
    const res = await fetch('/api/events')
    if (res.ok) { const d = await res.json(); setEvents(Array.isArray(d) ? d : []) }
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.start_date || !form.end_date) return toast.error('Isi semua field wajib')
    setSubmitting(true)
    try {
      const method = editing ? 'PUT' : 'POST'
      const url = editing ? `/api/events/${editing.id}` : '/api/events'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { toast.success(editing ? 'Event diperbarui!' : 'Event dibuat! Notif dikirim ke Discord.'); setShowForm(false); setEditing(null); fetchEvents() }
      else { const e = await res.json(); toast.error(e.error || 'Gagal') }
    } finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus event ini?')) return
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Event dihapus'); fetchEvents() } else toast.error('Gagal hapus')
  }

  const STATUS_COLORS: Record<string, string> = {
    upcoming: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    ongoing: 'bg-green-500/20 text-green-300 border-green-500/30',
    ended: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
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
              <h1 className="text-2xl font-bold text-white">Kelola Events</h1>
            </div>
            <button onClick={() => { setEditing(null); setForm({ title: '', description: '', banner_image: '', start_date: '', end_date: '', status: 'upcoming' }); setShowForm(true) }} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Event Baru
            </button>
          </div>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Judul</th>
                <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Mulai</th>
                <th className="px-6 py-4" />
              </tr></thead>
              <tbody>
                {events.length === 0 ? <tr><td colSpan={4} className="text-center py-12 text-secondary">Belum ada event</td></tr>
                  : events.map(event => (
                  <tr key={event.id} className="border-b border-white/5 hover:bg-white/3">
                    <td className="px-6 py-4 text-white font-medium">{event.title}</td>
                    <td className="px-6 py-4"><span className={'badge ' + (STATUS_COLORS[event.status] || '')}>{event.status}</span></td>
                    <td className="px-6 py-4 text-secondary text-sm">{formatDate(event.start_date)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => { setEditing(event); setForm({ title: event.title, description: event.description || '', banner_image: event.banner_image || '', start_date: event.start_date.slice(0,16), end_date: event.end_date.slice(0,16), status: event.status }); setShowForm(true) }} className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg text-secondary hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass-card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit Event' : 'Event Baru'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-secondary" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm text-secondary mb-1 block">Judul *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm text-secondary mb-1 block">Deskripsi</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="input-field resize-none" /></div>
              <div><label className="text-sm text-secondary mb-1 block">Banner Image URL</label><input value={form.banner_image} onChange={e => setForm({...form, banner_image: e.target.value})} className="input-field" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-secondary mb-1 block">Mulai *</label><input type="datetime-local" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="input-field" /></div>
                <div><label className="text-sm text-secondary mb-1 block">Selesai *</label><input type="datetime-local" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className="input-field" /></div>
              </div>
              <div><label className="text-sm text-secondary mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field">
                  <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="ended">Ended</option>
                </select>
              </div>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}{submitting ? 'Menyimpan...' : editing ? 'Perbarui' : 'Simpan & Kirim ke Discord'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
