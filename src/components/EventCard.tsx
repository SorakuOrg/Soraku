import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { EventRow } from '@/lib/supabase'

interface EventCardProps {
  event: EventRow
}

const STATUS_STYLES = {
  upcoming: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  ongoing: 'bg-green-500/20 text-green-300 border-green-500/30',
  ended: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const STATUS_LABELS = {
  upcoming: 'Akan Datang',
  ongoing: 'Berlangsung',
  ended: 'Selesai',
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.slug || event.id}`} className="block group">
      <div className="glass-card overflow-hidden hover:border-primary/30 hover:shadow-glass hover:-translate-y-1 transition-all duration-300">
        {/* Banner */}
        <div className="relative h-52 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          {event.banner_image ? (
            <Image
              src={event.banner_image}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-20">🎉</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card/90 to-transparent" />
          <div className="absolute top-3 right-3">
            <span className={cn('badge', STATUS_STYLES[event.status])}>
              {STATUS_LABELS[event.status]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-white text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-secondary text-sm line-clamp-2 mb-4">
              {event.description}
            </p>
          )}
          <div className="flex flex-col gap-1.5 text-xs text-secondary/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-primary" />
              Mulai: {formatDate(event.start_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-accent" />
              Selesai: {formatDate(event.end_date)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
