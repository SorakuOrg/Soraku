import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const createServiceClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// ── Types ────────────────────────────────────
export type VtuberRow = {
  id: string
  name: string
  slug: string
  bio: string | null
  avatar_url: string | null
  generation: number
  agency: string | null
  social_links: Record<string, string>
  created_by: string
  created_at: string
  updated_at: string
}

export type BlogPostRow = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  author_id: string
  author_name: string | null
  status: 'draft' | 'published'
  category: string | null
  tags: string[]
  featured: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export type EventRow = {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  banner_image: string | null
  start_date: string
  end_date: string
  location: string | null
  location_type: 'online' | 'offline' | 'hybrid'
  max_participants: number | null
  status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled'
  category: string | null
  organizer_id: string
  discord_event_id: string | null
  rsvp_count: number
  created_at: string
  updated_at: string
}

export type GalleryRow = {
  id: string
  image_url: string
  caption: string | null
  uploaded_by: string
  uploader_name: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export type UserRow = {
  id: string
  clerk_user_id: string
  username: string
  email: string
  avatar_url: string | null
  role: 'MANAGER' | 'AGENSI' | 'ADMIN' | 'USER'
  created_at: string
  updated_at: string
}

export type SettingRow = {
  id: string
  key: string
  value: string
  updated_by: string | null
  updated_at: string
}
