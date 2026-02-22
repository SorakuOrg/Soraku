import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatsCard from '@/components/StatsCard'
import { MessageCircle } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="page-title">Komunitas</h1>
            <p className="text-secondary text-lg">Bergabung dan terhubung dengan komunitas Soraku</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StatsCard />
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="text-xl font-bold text-white mb-3">Discord Server</h2>
              <p className="text-secondary mb-6 text-sm">Chat, gaming, dan diskusi bareng komunitas VTuber Soraku.</p>
              <a href="https://discord.gg/soraku" target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Join Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
