import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Users, Calendar, MessageCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatsCard from '@/components/StatsCard'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-base bg-mesh">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-glass">
              <Image
                src="https://blogger.googleusercontent.com/img/a/AVvXsEhlhs4Uhd-DSMY2uER618DpZkDLuupIyT5GmQDqdMmM31HF3XGi1om60_82VyP_P4r7aZlpqz8zCXNFe_-qfsBRQ63m_NcTD_viFP5pTpR4-sgfTGfK0BSUpjixF8N7eZdV7oki8kkq5uivp_Xo=w150-h150-p-k-no-nu-rw-e90"
                alt="Soraku Logo"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            Komunitas Pop Jepang & Anime Indonesia
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Selamat Datang di{' '}
            <span className="gradient-text">Soraku</span>
          </h1>

          <p className="text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform komunitas VTuber, anime, dan pop Jepang Indonesia. Temukan, dukung, dan bergabung bersama kami!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/vtuber" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
              Jelajahi VTuber <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://discord.gg/soraku"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2 text-base px-8 py-3"
            >
              <MessageCircle className="w-4 h-4" /> Join Discord
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1"><StatsCard /></div>
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            {[
              { icon: Users, label: 'VTuber', value: '10+', color: 'text-primary' },
              { icon: Calendar, label: 'Events', value: 'Live', color: 'text-accent' },
              { icon: Star, label: 'Komunitas', value: 'Aktif', color: 'text-green-400' },
            ].map((s) => (
              <div key={s.label} className="glass-card p-6 flex flex-col items-center text-center">
                <s.icon className={'w-8 h-8 mb-3 ' + s.color} />
                <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-xs text-secondary">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Pilar Soraku */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">3 Pilar Soraku</h2>
            <p className="text-secondary">Fondasi komunitas kami</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '🎌', title: 'Budaya', desc: 'Merayakan dan memperkenalkan budaya pop Jepang kepada komunitas Indonesia dengan cara yang inklusif dan menyenangkan.' },
              { emoji: '🤝', title: 'Komunitas', desc: 'Membangun komunitas yang supportif, ramah, dan saling mendukung satu sama lain dalam segala aspek.' },
              { emoji: '🌟', title: 'Kreativitas', desc: 'Mendorong kreativitas anggota melalui VTuber, fan art, events, dan berbagai konten kreatif lainnya.' },
            ].map((p) => (
              <div key={p.title} className="glass-card p-8 text-center hover:border-primary/30 hover:shadow-glass transition-all duration-300">
                <div className="text-5xl mb-5">{p.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Fitur Platform</h2>
            <p className="text-secondary">Semua yang kamu butuhkan dalam satu tempat</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '⭐', title: 'VTuber Generations', desc: 'Profil lengkap VTuber Soraku berdasarkan generasi.', href: '/vtuber' },
              { emoji: '🎉', title: 'Events', desc: 'Ikuti event komunitas dan dapatkan notifikasi Discord.', href: '/events' },
              { emoji: '📰', title: 'Blog', desc: 'Berita dan update terbaru seputar komunitas Soraku.', href: '/blog' },
              { emoji: '🖼️', title: 'Gallery', desc: 'Upload dan bagikan karya fan art atau foto event.', href: '/gallery' },
              { emoji: '💬', title: 'Discord', desc: 'Server aktif dengan channels khusus setiap VTuber.', href: 'https://discord.gg/soraku' },
              { emoji: '🛡️', title: 'Role System', desc: 'Manager, Agensi, Admin, User — akses terstruktur.', href: '/about' },
            ].map((f) => (
              <Link key={f.title} href={f.href} className="block">
                <div className="glass-card-hover p-6 h-full">
                  <div className="text-4xl mb-4">{f.emoji}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Discord CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative glass-card p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-primary/10" />
            <div className="relative">
              <div className="text-6xl mb-6">💜</div>
              <h2 className="text-3xl font-bold text-white mb-4">Bergabung Bersama Kami</h2>
              <p className="text-secondary mb-8 max-w-md mx-auto">
                Join Discord server Soraku dan jadilah bagian dari 1000+ member komunitas kami!
              </p>
              <a href="https://discord.gg/soraku" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
                <MessageCircle className="w-5 h-5" /> Join Soraku Discord
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
