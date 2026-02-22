'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VtuberCard from '@/components/VtuberCard'
import VtuberModal from '@/components/VtuberModal'
import type { VtuberRow } from '@/lib/supabase'

export default function GenerationPage() {
  const params = useParams()
  const generationSlug = params.generation as string
  const genNumber = parseInt(generationSlug.replace('generation-', '')) || 1

  const [vtubers, setVtubers] = useState<VtuberRow[]>([])
  const [selected, setSelected] = useState<VtuberRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVtubers = async () => {
      try {
        const res = await fetch(`/api/vtuber?generation=${genNumber}`)
        if (res.ok) {
          const data = await res.json()
          setVtubers(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchVtubers()
  }, [genNumber])

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="badge bg-primary/10 text-primary border-primary/20 mb-3">VTuber</div>
            <h1 className="page-title">Generasi {genNumber}</h1>
            <p className="text-secondary">VTuber Soraku Generasi {genNumber}</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-4" />
                  <div className="h-5 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/5 rounded w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : vtubers.length === 0 ? (
            <div className="text-center py-20 text-secondary">
              <div className="text-6xl mb-4">👾</div>
              <p>Belum ada VTuber di Generasi {genNumber}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {vtubers.map((vtuber) => (
                <VtuberCard key={vtuber.id} vtuber={vtuber} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      {selected && <VtuberModal vtuber={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
