'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Power } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import { useAuthRole } from '@/hooks/useAuthRole'
import { hasPermission } from '@/lib/roles'
import { useRouter } from 'next/navigation'

export default function AdminSettingsPage() {
  const { role, loading: authLoading } = useAuthRole()
  const router = useRouter()
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [siteSettings, setSiteSettings] = useState({ site_name: 'Soraku', discord_invite: 'https://discord.gg/soraku' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    if (!authLoading && !hasPermission(role ?? undefined, ['MANAGER'])) router.push('/admin')
  }, [role, authLoading, router])

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(settings => {
      if (Array.isArray(settings)) {
        settings.forEach((s: any) => {
          if (s.key === 'maintenance_mode') setMaintenanceMode(s.value === 'true')
          if (s.key === 'site_name') setSiteSettings(prev => ({...prev, site_name: s.value}))
          if (s.key === 'discord_invite') setSiteSettings(prev => ({...prev, discord_invite: s.value}))
        })
      }
    }).finally(() => setLoading(false))
  }, [])

  const toggleMaintenance = async () => {
    setToggling(true)
    const newValue = !maintenanceMode
    const res = await fetch('/api/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'maintenance_mode', value: String(newValue) })
    })
    if (res.ok) { setMaintenanceMode(newValue); toast.success(`Maintenance mode ${newValue ? 'aktif' : 'nonaktif'}`) }
    else toast.error('Gagal mengubah maintenance mode')
    setToggling(false)
  }

  const saveSiteSettings = async () => {
    setSaving(true)
    try {
      await Promise.all([
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'site_name', value: siteSettings.site_name }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'discord_invite', value: siteSettings.discord_invite }) }),
      ])
      toast.success('Settings disimpan!')
    } catch { toast.error('Gagal menyimpan') } finally { setSaving(false) }
  }

  if (authLoading || loading) return <div className="min-h-screen bg-dark-base flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="text-secondary hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>

          {/* Maintenance Toggle */}
          <div className="glass-card p-8 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-2">Maintenance Mode</h2>
                <p className="text-secondary text-sm">Ketika aktif, semua halaman redirect ke /maintenance. Hanya Admin yang bisa akses.</p>
              </div>
              <button
                onClick={toggleMaintenance}
                disabled={toggling}
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 flex items-center ${maintenanceMode ? 'bg-yellow-500' : 'bg-white/20'}`}
              >
                {toggling ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" /> : (
                  <div className={`absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${maintenanceMode ? 'translate-x-9' : 'translate-x-1'}`} />
                )}
              </button>
            </div>
            <div className={`mt-4 px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${maintenanceMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
              <Power className="w-3.5 h-3.5" />
              {maintenanceMode ? 'Maintenance Mode AKTIF' : 'Platform NORMAL'}
            </div>
            <p className="text-xs text-secondary/50 mt-3">Catatan: Perubahan env variable MAINTENANCE_MODE memerlukan redeploy. Nilai di database ini hanya untuk referensi.</p>
          </div>

          {/* Site Settings */}
          <div className="glass-card p-8">
            <h2 className="text-lg font-bold text-white mb-6">Site Settings</h2>
            <div className="space-y-4">
              <div><label className="text-sm text-secondary mb-1 block">Nama Site</label><input value={siteSettings.site_name} onChange={e => setSiteSettings({...siteSettings, site_name: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm text-secondary mb-1 block">Discord Invite URL</label><input value={siteSettings.discord_invite} onChange={e => setSiteSettings({...siteSettings, discord_invite: e.target.value})} className="input-field" /></div>
              <button onClick={saveSiteSettings} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Simpan Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
