import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EventCard from '@/components/EventCard'
import { createServiceClient } from '@/lib/supabase'

async function EventsList() {
  const supabase = createServiceClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true })

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20 text-secondary">
        <div className="text-6xl mb-4">🎉</div>
        <p>Belum ada event</p>
      </div>
    )
  }

  const upcoming = events.filter(e => e.status === 'upcoming' || e.status === 'ongoing')
  const past = events.filter(e => e.status === 'ended')

  return (
    <div>
      {upcoming.length > 0 && (
        <div className="mb-12">
          <h2 className="section-title">Event Mendatang</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h2 className="section-title text-secondary/60">Event Sebelumnya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            {past.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="page-title">Events</h1>
            <p className="text-secondary text-lg">Event dan kegiatan komunitas Soraku</p>
          </div>
          <Suspense fallback={<div className="grid grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <div key={i} className="glass-card h-80 animate-pulse" />)}</div>}>
            <EventsList />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  )
}
