import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Clock,
  Flame
} from 'lucide-react';
import { useInView } from '@/hooks/useScroll';
import { useEventStore } from '@/stores/eventStore';
import { useCountdown } from '@/hooks/useCountdown';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  banner_image: string | null;
  category: string;
  status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled';
  start_date: string;
  location: string | null;
  rsvp_count: number;
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const countdown = useCountdown(event.start_date);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
    >
      {/* Banner Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.banner_image || `https://placehold.co/600x400/1C1E22/4FA3D1?text=${encodeURIComponent(event.title)}`}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E22] via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-[#4FA3D1]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {event.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute right-4 top-4">
          <span className={cn(
            'rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm',
            event.status === 'upcoming' && 'bg-emerald-500/90 text-white',
            event.status === 'ongoing' && 'bg-amber-500/90 text-white',
            event.status === 'ended' && 'bg-gray-500/90 text-white',
          )}>
            {event.status === 'upcoming' && 'Akan Datang'}
            {event.status === 'ongoing' && 'Sedang Berlangsung'}
            {event.status === 'ended' && 'Selesai'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Countdown */}
        {!countdown.isExpired && event.status === 'upcoming' && (
          <div className="mb-4 flex items-center gap-2 text-sm text-[#4FA3D1]">
            <Clock className="h-4 w-4" />
            <span>
              {countdown.days > 0 && `${countdown.days}h `}
              {countdown.hours > 0 && `${countdown.hours}j `}
              {countdown.minutes}m
            </span>
          </div>
        )}

        <h3 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-[#4FA3D1]">
          {event.title}
        </h3>
        
        <p className="mb-4 line-clamp-2 text-sm text-[#D9DDE3]/60">
          {event.short_description}
        </p>

        {/* Meta */}
        <div className="mb-4 space-y-2 text-sm text-[#D9DDE3]/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{event.rsvp_count} peserta</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/events/${event.slug}`}
          className="flex items-center gap-2 text-sm font-medium text-[#4FA3D1] transition-colors hover:text-[#6E8FA6]"
        >
          Lihat Detail
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

export function Events() {
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });
  const { upcomingEvents, fetchUpcomingEvents, isLoading } = useEventStore();

  useEffect(() => {
    fetchUpcomingEvents(3);
  }, [fetchUpcomingEvents]);

  return (
    <section className="relative overflow-hidden bg-[#1C1E22] py-24" ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#E8C2A8]/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[#4FA3D1]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8C2A8]/30 bg-[#E8C2A8]/10 px-4 py-2">
              <Flame className="h-4 w-4 text-[#E8C2A8]" />
              <span className="text-sm font-medium text-[#E8C2A8]">Event Mendatang</span>
            </div>
            
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Jangan Lewatkan{' '}
              <span className="bg-gradient-to-r from-[#E8C2A8] to-[#4FA3D1] bg-clip-text text-transparent">
                Event Seru
              </span>
            </h2>
            
            <p className="mt-3 max-w-xl text-lg text-[#D9DDE3]/60">
              Ikuti berbagai event menarik bersama komunitas Soraku.
            </p>
          </div>

          <Link
            to="/events"
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
          >
            Lihat Semua Event
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-[#D9DDE3]/30" />
            <h3 className="mb-2 text-xl font-semibold text-white">Belum Ada Event</h3>
            <p className="text-[#D9DDE3]/60">Nantikan event-event menarik dari kami!</p>
          </div>
        )}
      </div>
    </section>
  );
}
