import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServiceClient } from '@/lib/supabase'
import { formatDate, cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = { upcoming: 'Akan Datang', ongoing: 'Berlangsung', ended: 'Selesai' }
const STATUS_STYLES: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  ongoing: 'bg-green-500/20 text-green-300 border-green-500/30',
  ended: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createServiceClient()
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .or(`slug.eq.${params.slug},id.eq.${params.slug}`)
    .single()

  if (!event) notFound()

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/events" className="inline-flex items-center gap-2 text-secondary hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Events
          </Link>

          {event.banner_image && (
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
              <Image src={event.banner_image} alt={event.title} fill className="object-cover" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className={cn('badge', STATUS_STYLES[event.status])}>{STATUS_LABELS[event.status]}</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-6">{event.title}</h1>

          <div className="glass-card p-6 mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-secondary uppercase mb-1">Mulai</p>
              <p className="text-white font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />{formatDate(event.start_date)}</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase mb-1">Selesai</p>
              <p className="text-white font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-accent" />{formatDate(event.end_date)}</p>
            </div>
          </div>

          {event.description && (
            <div className="glass-card p-8">
              <p className="text-secondary leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
