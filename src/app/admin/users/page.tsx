'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import { useAuthRole } from '@/hooks/useAuthRole'
import { hasPermission, ROLE_COLORS } from '@/lib/roles'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'

type User = { id: string; username: string; email: string; role: string; created_at: string }

export default function AdminUsersPage() {
  const { role, loading: authLoading } = useAuthRole()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !hasPermission(role ?? undefined, ['MANAGER'])) router.push('/admin')
  }, [role, authLoading, router])

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(d => { if (Array.isArray(d)) setUsers(d) }).finally(() => setLoading(false))
  }, [])

  const updateRole = async (id: string, newRole: string) => {
    setUpdating(id)
    const res = await fetch(`/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: newRole }) })
    if (res.ok) { toast.success('Role diperbarui!'); setUsers(prev => prev.map(u => u.id === id ? {...u, role: newRole} : u)) }
    else toast.error('Gagal update role')
    setUpdating(null)
  }

  if (authLoading || loading) return <div className="min-h-screen bg-dark-base flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="text-secondary hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-2xl font-bold text-white">Kelola Users</h1>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Username</th>
                  <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Email</th>
                  <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Role</th>
                  <th className="text-left px-6 py-4 text-xs text-secondary uppercase">Bergabung</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/3">
                    <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                    <td className="px-6 py-4 text-secondary text-sm">{user.email}</td>
                    <td className="px-6 py-4"><span className={'badge ' + (ROLE_COLORS[user.role as keyof typeof ROLE_COLORS] || '')}>{user.role}</span></td>
                    <td className="px-6 py-4 text-secondary text-sm">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {updating === user.id ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : (
                          <select value={user.role} onChange={e => updateRole(user.id, e.target.value)} className="text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary/50">
                            {['USER', 'ADMIN', 'AGENSI', 'MANAGER'].map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
