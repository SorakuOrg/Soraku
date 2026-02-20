import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

export type EventStatus = 'upcoming' | 'ongoing' | 'ended' | 'cancelled';
export type RSVPStatus = 'going' | 'maybe' | 'not_going';

interface EventState {
  events: Event[];
  upcomingEvents: Event[];
  ongoingEvents: Event[];
  pastEvents: Event[];
  currentEvent: Event | null;
  userRSVPs: Record<string, RSVPStatus>;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchEvents: (params?: {
    status?: EventStatus | 'all';
    category?: string;
    limit?: number;
  }) => Promise<void>;
  fetchEventBySlug: (slug: string) => Promise<Event | null>;
  fetchUpcomingEvents: (limit?: number) => Promise<void>;
  fetchOngoingEvents: () => Promise<void>;
  fetchPastEvents: (limit?: number) => Promise<void>;
  createEvent: (event: EventInsert) => Promise<Event | null>;
  updateEvent: (id: string, updates: EventUpdate) => Promise<Event | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  updateEventStatus: () => void;
  
  // RSVP
  fetchUserRSVPs: (userId: string) => Promise<void>;
  rsvpToEvent: (eventId: string, userId: string, status: RSVPStatus, notes?: string) => Promise<boolean>;
  cancelRSVP: (eventId: string, userId: string) => Promise<boolean>;
  getRSVPStatus: (eventId: string) => RSVPStatus | null;
  
  // Categories
  fetchCategories: () => Promise<void>;
  
  // Current event
  setCurrentEvent: (event: Event | null) => void;
  
  // Countdown
  getCountdown: (eventDate: string) => {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  };
}

export const useEventStore = create<EventState>()((set, get) => ({
  events: [],
  upcomingEvents: [],
  ongoingEvents: [],
  pastEvents: [],
  currentEvent: null,
  userRSVPs: {},
  categories: [],
  isLoading: false,
  error: null,

  fetchEvents: async (params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const { status = 'all', category, limit } = params;

      let query = supabase.from('events').select('*');

      if (status !== 'all') query = query.eq('status', status);
      if (category) query = query.eq('category', category);

      query = query.order('start_date', { ascending: true });
      
      if (limit) query = query.limit(limit);

      const { data, error } = await query;

      if (error) throw error;

      set({ events: data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch events',
        isLoading: false,
      });
    }
  },

  fetchEventBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      set({ currentEvent: data, isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch event',
        isLoading: false,
      });
      return null;
    }
  },

  fetchUpcomingEvents: async (limit = 10) => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'upcoming')
        .gte('start_date', now)
        .order('start_date', { ascending: true })
        .limit(limit);

      if (error) throw error;

      set({ upcomingEvents: data || [] });
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error);
    }
  },

  fetchOngoingEvents: async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'ongoing')
        .order('start_date', { ascending: true });

      if (error) throw error;

      set({ ongoingEvents: data || [] });
    } catch (error) {
      console.error('Failed to fetch ongoing events:', error);
    }
  },

  fetchPastEvents: async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('status', ['ended', 'cancelled'])
        .order('end_date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      set({ pastEvents: data || [] });
    } catch (error) {
      console.error('Failed to fetch past events:', error);
    }
  },

  createEvent: async (event) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();

      if (error) throw error;

      set({ isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create event',
        isLoading: false,
      });
      return null;
    }
  },

  updateEvent: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('events')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set({ isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update event',
        isLoading: false,
      });
      return null;
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete event',
        isLoading: false,
      });
      return false;
    }
  },

  updateEventStatus: () => {
    const now = new Date();
    const { events } = get();
    
    events.forEach(async (event) => {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      
      let newStatus: EventStatus = event.status;
      
      if (event.status === 'cancelled') return;
      
      if (now < startDate) {
        newStatus = 'upcoming';
      } else if (now >= startDate && now <= endDate) {
        newStatus = 'ongoing';
      } else if (now > endDate) {
        newStatus = 'ended';
      }
      
      if (newStatus !== event.status) {
        await supabase
          .from('events')
          .update({ status: newStatus })
          .eq('id', event.id);
      }
    });
  },

  fetchUserRSVPs: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const rsvps: Record<string, RSVPStatus> = {};
      data?.forEach((rsvp) => {
        rsvps[rsvp.event_id] = rsvp.status;
      });

      set({ userRSVPs: rsvps });
    } catch (error) {
      console.error('Failed to fetch user RSVPs:', error);
    }
  },

  rsvpToEvent: async (eventId, userId, status, notes) => {
    try {
      const { error } = await supabase
        .from('event_rsvps')
        .upsert({
          event_id: eventId,
          user_id: userId,
          status,
          notes,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update local state
      set((state) => ({
        userRSVPs: { ...state.userRSVPs, [eventId]: status },
      }));

      // Update RSVP count
      await supabase.rpc('update_event_rsvp_count', { event_id: eventId });

      return true;
    } catch (error) {
      console.error('Failed to RSVP:', error);
      return false;
    }
  },

  cancelRSVP: async (eventId, userId) => {
    try {
      const { error } = await supabase
        .from('event_rsvps')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      const newRSVPs = { ...get().userRSVPs };
      delete newRSVPs[eventId];
      set({ userRSVPs: newRSVPs });

      // Update RSVP count
      await supabase.rpc('update_event_rsvp_count', { event_id: eventId });

      return true;
    } catch (error) {
      console.error('Failed to cancel RSVP:', error);
      return false;
    }
  },

  getRSVPStatus: (eventId) => {
    return get().userRSVPs[eventId] || null;
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase.from('events').select('category');

      if (error) throw error;

      const categories = [...new Set(data?.map((e) => e.category) || [])];
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  setCurrentEvent: (event) => set({ currentEvent: event }),

  getCountdown: (eventDate) => {
    const now = new Date().getTime();
    const targetDate = new Date(eventDate).getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  },
}));
