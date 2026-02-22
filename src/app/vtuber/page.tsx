import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const GENERATIONS = [
  { gen: 1, label: 'Generasi 1', description: 'VTuber generasi pertama yang memulai perjalanan Soraku.' },
  { gen: 2, label: 'Generasi 2', description: 'Generasi kedua yang memperluas komunitas Soraku.' },
]

export default function VtuberPage() {
  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="page-title">VTuber Soraku</h1>
            <p className="text-secondary text-lg">Kenali semua VTuber dari komunitas Soraku</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GENERATIONS.map(({ gen, label, description }) => (
              <Link key={gen} href={`/vtuber/generation-${gen}`} className="block group">
                <div className="glass-card-hover p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="badge bg-primary/10 text-primary border-primary/20 mb-3">Generasi {gen}</div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{label}</h2>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-3xl">
                      {'Gen'[0]}{gen}
                    </div>
                  </div>
                  <p className="text-secondary mb-6">{description}</p>
                  <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                    Lihat VTuber <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
