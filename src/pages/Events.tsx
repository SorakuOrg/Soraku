import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  X,
  Share2,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useEventStore, type RSVPStatus } from '@/stores/eventStore';
import { useAuthStore } from '@/stores/authStore';
import { useCountdown } from '@/hooks/useCountdown';
import { useUIStore } from '@/stores/uiStore';
import { formatDate, formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

// RSVP Button Component
function RSVPButton({ eventId, maxParticipants, rsvpCount }: { eventId: string; maxParticipants: number | null; rsvpCount: number }) {
  const { user, isAuthenticated } = useAuthStore();
  const { userRSVPs, rsvpToEvent, cancelRSVP } = useEventStore();
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const currentStatus = userRSVPs[eventId];
  const isFull = maxParticipants !== null && rsvpCount >= maxParticipants;

  const handleRSVP = async (status: RSVPStatus) => {
    if (!isAuthenticated || !user) {
      addToast({
        title: 'Login Diperlukan',
        description: 'Silakan login untuk RSVP ke event ini.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    const success = await rsvpToEvent(eventId, user.id, status);
    setIsLoading(false);

    if (success) {
      addToast({
        title: 'RSVP Berhasil',
        description: `Anda telah RSVP dengan status: ${status === 'going' ? 'Hadir' : status === 'maybe' ? 'Mungkin' : 'Tidak Hadir'}`,
        type: 'success',
      });
    }
  };

  const handleCancel = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const success = await cancelRSVP(eventId, user.id);
    setIsLoading(false);

    if (success) {
      addToast({
        title: 'RSVP Dibatalkan',
        description: 'Anda telah membatalkan RSVP.',
        type: 'info',
      });
    }
  };

  if (currentStatus) {
    return (
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
          currentStatus === 'going' && 'bg-emerald-500/10 text-emerald-400',
          currentStatus === 'maybe' && 'bg-amber-500/10 text-amber-400',
          currentStatus === 'not_going' && 'bg-red-500/10 text-red-400',
        )}>
          <CheckCircle className="h-4 w-4" />
          {currentStatus === 'going' && 'Anda akan hadir'}
          {currentStatus === 'maybe' && 'Mungkin hadir'}
          {currentStatus === 'not_going' && 'Tidak hadir'}
        </div>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="rounded-lg bg-white/5 p-2 text-[#D9DDE3]/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleRSVP('going')}
        disabled={isLoading || isFull}
        className={cn(
          'rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-600',
          (isLoading || isFull) && 'cursor-not-allowed opacity-50'
        )}
      >
        {isFull ? 'Penuh' : 'Hadir'}
      </button>
      <button
        onClick={() => handleRSVP('maybe')}
        disabled={isLoading}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-amber-600 disabled:opacity-50"
      >
        Mungkin
      </button>
      <button
        onClick={() => handleRSVP('not_going')}
        disabled={isLoading}
        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600 disabled:opacity-50"
      >
        Tidak Hadir
      </button>
    </div>
  );
}

// Event List Page
function EventList() {
  const { events, fetchEvents, isLoading } = useEventStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'ended'>('all');

  useEffect(() => {
    fetchEvents({ status: filter === 'all' ? undefined : filter });
  }, [fetchEvents, filter]);

  return (
    <div className="min-h-screen bg-[#1C1E22]">
      <Navbar />
      
      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-white">Event Soraku</h1>
            <p className="mx-auto max-w-2xl text-lg text-[#D9DDE3]/60">
              Ikuti berbagai event menarik bersama komunitas Soraku.
            </p>
          </motion.div>

          {/* Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {(['all', 'upcoming', 'ongoing', 'ended'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-lg px-6 py-2 text-sm font-medium capitalize transition-all',
                  filter === f
                    ? 'bg-[#4FA3D1] text-white'
                    : 'bg-white/5 text-[#D9DDE3]/70 hover:bg-white/10 hover:text-white'
                )}
              >
                {f === 'all' ? 'Semua' : f}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-[#D9DDE3]/30" />
              <p className="text-[#D9DDE3]/60">Tidak ada event ditemukan.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

interface EventItem {
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

// Event Card Component
function EventCard({ event, index }: { event: EventItem; index: number }) {
  const countdown = useCountdown(event.start_date);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:border-white/10"
    >
      <Link to={`/events/${event.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.banner_image || `https://placehold.co/600x400/1C1E22/4FA3D1?text=${encodeURIComponent(event.title)}`}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E22] via-transparent to-transparent" />
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-[#4FA3D1]/90 px-3 py-1 text-xs font-medium text-white">
              {event.category}
            </span>
          </div>
          <div className="absolute right-4 top-4">
            <span className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              event.status === 'upcoming' && 'bg-emerald-500/90 text-white',
              event.status === 'ongoing' && 'bg-amber-500/90 text-white',
              event.status === 'ended' && 'bg-gray-500/90 text-white',
              event.status === 'cancelled' && 'bg-red-500/90 text-white',
            )}>
              {event.status}
            </span>
          </div>
        </div>
        <div className="p-6">
          {!countdown.isExpired && event.status === 'upcoming' && (
            <div className="mb-3 flex items-center gap-2 text-sm text-[#4FA3D1]">
              <Clock className="h-4 w-4" />
              <span>
                {countdown.days > 0 && `${countdown.days}h `}
                {countdown.hours > 0 && `${countdown.hours}j `}
                {countdown.minutes}m
              </span>
            </div>
          )}
          <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-[#4FA3D1]">
            {event.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-[#D9DDE3]/60">
            {event.short_description}
          </p>
          <div className="space-y-2 text-sm text-[#D9DDE3]/50">
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
        </div>
      </Link>
    </motion.article>
  );
}

// Event Detail Page
function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { currentEvent, fetchEventBySlug, isLoading } = useEventStore();
  const countdown = useCountdown(currentEvent?.start_date || new Date().toISOString());

  useEffect(() => {
    if (slug) {
      fetchEventBySlug(slug);
    }
  }, [slug, fetchEventBySlug]);

  if (isLoading || !currentEvent) {
    return (
      <div className="min-h-screen bg-[#1C1E22]">
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#4FA3D1] border-t-transparent" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1E22]">
      <Navbar />
      
      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/events"
            className="mb-8 inline-flex items-center gap-2 text-[#D9DDE3]/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali ke Event
          </Link>

          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={currentEvent.banner_image || `https://placehold.co/1200x400/1C1E22/4FA3D1?text=${encodeURIComponent(currentEvent.title)}`}
                alt={currentEvent.title}
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E22] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="rounded-full bg-[#4FA3D1]/90 px-3 py-1 text-sm font-medium text-white">
                  {currentEvent.category}
                </span>
                <span className={cn(
                  'rounded-full px-3 py-1 text-sm font-medium',
                  currentEvent.status === 'upcoming' && 'bg-emerald-500/90 text-white',
                  currentEvent.status === 'ongoing' && 'bg-amber-500/90 text-white',
                  currentEvent.status === 'ended' && 'bg-gray-500/90 text-white',
                  currentEvent.status === 'cancelled' && 'bg-red-500/90 text-white',
                )}>
                  {currentEvent.status}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Countdown */}
          {currentEvent.status === 'upcoming' && !countdown.isExpired && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 rounded-2xl border border-[#4FA3D1]/20 bg-[#4FA3D1]/5 p-6"
            >
              <p className="mb-4 text-center text-sm text-[#D9DDE3]/60">Event akan dimulai dalam:</p>
              <div className="flex justify-center gap-4">
                {[
                  { value: countdown.days, label: 'Hari' },
                  { value: countdown.hours, label: 'Jam' },
                  { value: countdown.minutes, label: 'Menit' },
                  { value: countdown.seconds, label: 'Detik' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#1C1E22] text-2xl font-bold text-[#4FA3D1]">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <p className="mt-2 text-xs text-[#D9DDE3]/60">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              {currentEvent.title}
            </h1>

            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                <Calendar className="h-5 w-5 text-[#4FA3D1]" />
                <div>
                  <p className="text-sm text-[#D9DDE3]/50">Tanggal & Waktu</p>
                  <p className="text-white">{formatDateTime(currentEvent.start_date)}</p>
                </div>
              </div>
              {currentEvent.location && (
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                  <MapPin className="h-5 w-5 text-[#6E8FA6]" />
                  <div>
                    <p className="text-sm text-[#D9DDE3]/50">Lokasi</p>
                    <p className="text-white">{currentEvent.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                <Users className="h-5 w-5 text-[#E8C2A8]" />
                <div>
                  <p className="text-sm text-[#D9DDE3]/50">Peserta</p>
                  <p className="text-white">
                    {currentEvent.rsvp_count}
                    {currentEvent.max_participants && ` / ${currentEvent.max_participants}`} peserta
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                <AlertCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-[#D9DDE3]/50">Tipe</p>
                  <p className="text-white capitalize">{currentEvent.location_type}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-[#D9DDE3]/80 leading-relaxed">
                {currentEvent.description}
              </p>
            </div>

            {/* RSVP Section */}
            {currentEvent.status === 'upcoming' && (
              <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">RSVP ke Event</h3>
                <RSVPButton 
                  eventId={currentEvent.id} 
                  maxParticipants={currentEvent.max_participants}
                  rsvpCount={currentEvent.rsvp_count}
                />
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-[#D9DDE3]/60 transition-colors hover:bg-white/10 hover:text-white">
                <Share2 className="h-4 w-4" />
                Bagikan
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export { EventList, EventDetail };
