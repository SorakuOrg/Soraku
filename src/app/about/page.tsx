import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MessageCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="page-title">Tentang Soraku</h1>
            <p className="text-secondary text-lg">Platform komunitas VTuber Indonesia</p>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">🌟 Apa itu Soraku?</h2>
              <p className="text-secondary leading-relaxed">
                Soraku adalah platform komunitas yang didedikasikan untuk mendukung dan mempromosikan VTuber Indonesia.
                Kami menyediakan ruang bagi para penggemar untuk terhubung, berbagi, dan merayakan kreativitas VTuber lokal.
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-6">🛡️ Sistem Role</h2>
              <div className="space-y-4">
                {[
                  { role: 'MANAGER', badge: 'bg-purple-500/20 text-purple-300', desc: 'Akses penuh ke seluruh platform, manajemen role user, dan settings.' },
                  { role: 'AGENSI', badge: 'bg-blue-500/20 text-blue-300', desc: 'Dapat mengelola VTuber dan Events.' },
                  { role: 'ADMIN', badge: 'bg-green-500/20 text-green-300', desc: 'Dapat membuat dan mengelola konten Blog.' },
                  { role: 'USER', badge: 'bg-gray-500/20 text-gray-300', desc: 'Akses baca dan upload gallery (dengan persetujuan).' },
                ].map(r => (
                  <div key={r.role} className="flex items-start gap-4 p-4 bg-white/3 rounded-xl">
                    <span className={"badge " + r.badge + " border-transparent flex-shrink-0"}>{r.role}</span>
                    <p className="text-secondary text-sm">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 text-center">
              <div className="text-5xl mb-4">💜</div>
              <h2 className="text-xl font-bold text-white mb-3">Bergabung Bersama Kami</h2>
              <p className="text-secondary mb-6">Join komunitas Discord Soraku dan jadilah bagian dari keluarga kami!</p>
              <a href="https://discord.gg/soraku" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
