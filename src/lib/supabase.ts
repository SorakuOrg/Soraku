import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          discord_id: string;
          username: string;
          avatar_url: string | null;
          email: string | null;
          role: 'admin' | 'moderator' | 'member';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          discord_id: string;
          username: string;
          avatar_url?: string | null;
          email?: string | null;
          role?: 'admin' | 'moderator' | 'member';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          discord_id?: string;
          username?: string;
          avatar_url?: string | null;
          email?: string | null;
          role?: 'admin' | 'moderator' | 'member';
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          featured_image: string | null;
          author_id: string;
          status: 'draft' | 'published' | 'archived';
          tags: string[];
          category: string;
          meta_title: string | null;
          meta_description: string | null;
          featured: boolean;
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          featured_image?: string | null;
          author_id: string;
          status?: 'draft' | 'published' | 'archived';
          tags?: string[];
          category: string;
          meta_title?: string | null;
          meta_description?: string | null;
          featured?: boolean;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          featured_image?: string | null;
          author_id?: string;
          status?: 'draft' | 'published' | 'archived';
          tags?: string[];
          category?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          featured?: boolean;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          short_description: string;
          banner_image: string | null;
          start_date: string;
          end_date: string;
          location: string | null;
          location_type: 'online' | 'offline' | 'hybrid';
          max_participants: number | null;
          status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled';
          category: string;
          organizer_id: string;
          discord_channel_id: string | null;
          rsvp_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          short_description: string;
          banner_image?: string | null;
          start_date: string;
          end_date: string;
          location?: string | null;
          location_type: 'online' | 'offline' | 'hybrid';
          max_participants?: number | null;
          status?: 'upcoming' | 'ongoing' | 'ended' | 'cancelled';
          category: string;
          organizer_id: string;
          discord_channel_id?: string | null;
          rsvp_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          short_description?: string;
          banner_image?: string | null;
          start_date?: string;
          end_date?: string;
          location?: string | null;
          location_type?: 'online' | 'offline' | 'hybrid';
          max_participants?: number | null;
          status?: 'upcoming' | 'ongoing' | 'ended' | 'cancelled';
          category?: string;
          organizer_id?: string;
          discord_channel_id?: string | null;
          rsvp_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: 'going' | 'maybe' | 'not_going';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status: 'going' | 'maybe' | 'not_going';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: 'going' | 'maybe' | 'not_going';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          type: 'string' | 'number' | 'boolean' | 'json';
          description: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          type: 'string' | 'number' | 'boolean' | 'json';
          description?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          type?: 'string' | 'number' | 'boolean' | 'json';
          description?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      admin_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          details: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          details?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          details?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
