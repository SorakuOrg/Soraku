'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, ArrowLeft, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import { useAuthRole } from '@/hooks/useAuthRole'
import { formatDate } from '@/lib/utils'
import { hasPermission } from '@/lib/roles'
import { useRouter } from 'next/navigation'

type BlogPost = { id: string; title: string; status: string; created_at: string; slug: string; content?: string; excerpt?: string; featured_image?: string }

export default function AdminBlogPage() {
  const { role, loading: authLoading } = useAuthRole()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', featured_image: '', status: 'draft' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !hasPermission(role ?? undefined, ['MANAGER', 'ADMIN'])) router.push('/admin')
  }, [role, authLoading, router])

  const fetchPosts = async () => {
    const [r1, r2] = await Promise.all([fetch('/api/blog?status=published&limit=50'), fetch('/api/blog?status=draft&limit=50')])
    const p = await r1.json(), d = await r2.json()
    setPosts([...(Array.isArray(p) ? p : []), ...(Array.isArray(d) ? d : [])])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.content) return toast.error('Title dan content wajib diisi')
    setSubmitting(true)
    try {
      const method = editing ? 'PUT' : 'POST'
      const url = editing ? `/api/blog/${editing.id}` : '/api/blog'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { toast.success(editing ? 'Diperbarui!' : 'Post dibuat!'); setShowForm(false); setEditing(null); setForm({ title: '', content: '', excerpt: '', featured_image: '', status: 'draft' }); fetchPosts() }
      else { const e = await res.json(); toast.error(e.error || 'Gagal') }
    } finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus post ini?')) return
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Dihapus'); fetchPosts() } else toast.error('Gagal')
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
              <h1 className="text-2xl font-bold text-white">Kelola Blog</h1>
            </div>
            <button onClick={() => { setEditing(null); setForm({ title: '', content: '', excerpt: '', featured_image: '', status: 'draft' }); setShowForm(true) }} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Post Baru
            </button>
          </div>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Judul</th>
                <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Tanggal</th>
                <th className="px-6 py-4" />
              </tr></thead>
              <tbody>
                {posts.length === 0 ? <tr><td colSpan={4} className="text-center py-12 text-secondary">Belum ada post</td></tr>
                  : posts.map(post => (
                  <tr key={post.id} className="border-b border-white/5 hover:bg-white/3">
                    <td className="px-6 py-4 text-white font-medium">{post.title}</td>
                    <td className="px-6 py-4"><span className={`badge ${post.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>{post.status}</span></td>
                    <td className="px-6 py-4 text-secondary text-sm">{formatDate(post.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/blog/${post.slug}`} className="p-2 rounded-lg text-secondary hover:text-white hover:bg-white/10"><Eye className="w-4 h-4" /></Link>
                        <button onClick={() => { setEditing(post); setForm({ title: post.title, content: post.content || '', excerpt: post.excerpt || '', featured_image: post.featured_image || '', status: post.status }); setShowForm(true) }} className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg text-secondary hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
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
          <div className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit Post' : 'Post Baru'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-secondary" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm text-secondary mb-1 block">Judul *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm text-secondary mb-1 block">Excerpt</label><input value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm text-secondary mb-1 block">Featured Image URL</label><input value={form.featured_image} onChange={e => setForm({...form, featured_image: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm text-secondary mb-1 block">Konten *</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={8} className="input-field resize-none" /></div>
              <div><label className="text-sm text-secondary mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field">
                  <option value="draft">Draft</option><option value="published">Published</option>
                </select>
              </div>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}{submitting ? 'Menyimpan...' : editing ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
