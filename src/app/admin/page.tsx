'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Calendar, Users, Image, Settings, Database, Shield } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useAuthRole } from '@/hooks/useAuthRole'
import { useRouter } from 'next/navigation'
import StatsCard from '@/components/StatsCard'
import { hasPermission } from '@/lib/roles'

const ADMIN_SECTIONS = [
  { href: '/admin/blog', icon: FileText, label: 'Blog', desc: 'Kelola artikel blog', roles: ['MANAGER', 'ADMIN'] },
  { href: '/admin/events', icon: Calendar, label: 'Events', desc: 'Kelola event komunitas', roles: ['MANAGER', 'AGENSI'] },
  { href: '/admin/vtuber', icon: Shield, label: 'VTuber', desc: 'Kelola data VTuber', roles: ['MANAGER', 'AGENSI'] },
  { href: '/admin/gallery', icon: Image, label: 'Gallery', desc: 'Review foto gallery', roles: ['MANAGER', 'ADMIN'] },
  { href: '/admin/users', icon: Users, label: 'Users', desc: 'Kelola role pengguna', roles: ['MANAGER'] },
  { href: '/admin/settings', icon: Settings, label: 'Settings', desc: 'Toggle maintenance mode', roles: ['MANAGER'] },
]

export default function AdminPage() {
  const { role, loading } = useAuthRole()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !hasPermission(role ?? undefined, ['MANAGER', 'AGENSI', 'ADMIN'])) {
      router.push('/')
    }
  }, [role, loading, router])

  if (loading) return <div className="min-h-screen bg-dark-base flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>

  const accessibleSections = ADMIN_SECTIONS.filter(s => hasPermission(role ?? undefined, s.roles as any[]))

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-10">
            <div>
              <h1 className="page-title">Admin Panel</h1>
              <p className="text-secondary">Kelola platform Soraku Community</p>
            </div>
            <div className="badge bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
              {role}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-1"><StatsCard /></div>
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
              {accessibleSections.map(({ href, icon: Icon, label, desc }) => (
                <Link key={href} href={href}>
                  <div className="glass-card-hover p-6 h-full">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{label}</h3>
                    <p className="text-secondary text-xs">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
