-- =============================================
-- SORAKU COMMUNITY PLATFORM v1.0.a1
-- Database Schema — Jalankan di Supabase SQL Editor
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USERS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'USER'
    CHECK (role IN ('MANAGER', 'AGENSI', 'ADMIN', 'USER')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── VTUBERS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS vtubers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  generation INTEGER NOT NULL DEFAULT 1,
  agency TEXT,
  social_links JSONB DEFAULT '{}',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vtubers_generation ON vtubers(generation);
CREATE INDEX IF NOT EXISTS idx_vtubers_slug ON vtubers(slug);

-- ── BLOG POSTS ───────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id TEXT NOT NULL,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- ── EVENTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  banner_image TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  location_type TEXT DEFAULT 'online'
    CHECK (location_type IN ('online', 'offline', 'hybrid')),
  max_participants INTEGER,
  status TEXT NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'ongoing', 'ended', 'cancelled')),
  category TEXT DEFAULT 'general',
  organizer_id TEXT NOT NULL,
  discord_event_id TEXT,
  rsvp_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);

-- ── GALLERY ──────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by TEXT NOT NULL,
  uploader_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_status ON gallery(status);

-- ── SETTINGS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO settings (key, value) VALUES
  ('maintenance_mode', 'false'),
  ('site_name', 'Soraku Community'),
  ('discord_invite', 'https://discord.gg/soraku'),
  ('discord_server_id', '1116971049045729302')
ON CONFLICT (key) DO NOTHING;

-- ── ROW LEVEL SECURITY ───────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vtubers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_vtubers" ON vtubers FOR SELECT USING (true);
CREATE POLICY "public_read_blog" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "public_read_events" ON events FOR SELECT USING (true);
CREATE POLICY "public_read_gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "public_read_settings" ON settings FOR SELECT USING (true);
CREATE POLICY "public_read_users" ON users FOR SELECT USING (true);

-- Write policies (service role handles auth checks in API)
CREATE POLICY "service_write_all" ON users FOR ALL USING (true);
CREATE POLICY "service_write_vtubers" ON vtubers FOR ALL USING (true);
CREATE POLICY "service_write_blog" ON blog_posts FOR ALL USING (true);
CREATE POLICY "service_write_events" ON events FOR ALL USING (true);
CREATE POLICY "service_write_gallery" ON gallery FOR ALL USING (true);
CREATE POLICY "service_write_settings" ON settings FOR ALL USING (true);

-- ── SAMPLE DATA ───────────────────────────────
INSERT INTO vtubers (name, slug, bio, generation, social_links, created_by) VALUES
  ('Sakura Hana', 'sakura-hana', 'VTuber ceria dan energik dari Generasi 1! Suka main game FPS dan nyanyi lagu anime. Streaming setiap hari Senin, Rabu, Jumat.', 1, '{"youtube": "https://youtube.com", "twitter": "https://twitter.com"}', 'system'),
  ('Luna Tsuki', 'luna-tsuki', 'VTuber dengan suara merdu dari Generasi 1. Ahli dalam RPG dan visual novel. Selalu ada untuk memberikan semangat ke semua orang!', 1, '{"youtube": "https://youtube.com", "twitter": "https://twitter.com"}', 'system'),
  ('Miko Hoshi', 'miko-hoshi', 'VTuber artistik dari Generasi 1. Passionate tentang anime dan cosplay. Sering collab dengan VTuber lain!', 1, '{"youtube": "https://youtube.com"}', 'system'),
  ('Akira Sora', 'akira-sora', 'VTuber Generasi 2 yang handal dalam speedrun. Main berbagai genre game dan selalu kasih konten seru!', 2, '{"youtube": "https://youtube.com", "twitch": "https://twitch.tv"}', 'system'),
  ('Yuki Hana', 'yuki-hana', 'VTuber seniman digital dari Generasi 2. Sering live drawing dan sharing tips seni kepada penonton.', 2, '{"youtube": "https://youtube.com", "twitter": "https://twitter.com", "instagram": "https://instagram.com"}', 'system')
ON CONFLICT (slug) DO NOTHING;

-- ── STORAGE BUCKETS ───────────────────────────
-- Buat di Supabase Dashboard > Storage > New Bucket (set Public):
-- • vtubers-avatars
-- • blog-images
-- • event-banners
-- • gallery
