# 🔧 KAIZO.md — Back-end Developer Soraku

> Semua task Kaizo dari PLAN.md, API spec yang dibutuhkan Bubu, dan DB schema.
> **Update terakhir: Bubu — 10 Mar 2026**

---

## Stack Kaizo

- Supabase (Auth + PostgreSQL + RLS + Storage)
- Prisma ORM (untuk query kompleks)
- Next.js Route Handlers di `apps/web/src/app/api/`
- Payments: Xendit (premium membership)

## Supabase Project

- Project ID: `jrgknsxqwuygcoocnnnb`
- Region: Southeast Asia
- Migration folder: `apps/web/supabase/migrations/`

---

## ⚡ Status Frontend — Bubu sudah siap semua UI

> Semua halaman sudah live di soraku.vercel.app dengan **mock data**.
> Kaizo tinggal buat API dan data langsung ngalir ke UI.

| Halaman / Fitur         | URL                     | Status UI | Butuh API Kaizo         |
|-------------------------|-------------------------|-----------|-------------------------|
| Login                   | `/login`                | ✅ Siap   | `POST /api/auth/login`  |
| Register                | `/register`             | ✅ Siap   | `POST /api/auth/register` |
| Dashboard User          | `/dashboard`            | ✅ Siap   | `GET /api/auth/me`      |
| Blog listing            | `/blog`                 | ✅ Siap   | `GET /api/blog`         |
| Blog detail             | `/blog/[slug]`          | ✅ Siap   | `GET /api/blog/[slug]`  |
| Event listing           | `/events`               | ✅ Siap   | `GET /api/events`       |
| Event detail            | `/events/[slug]`        | ✅ Siap   | `GET /api/events/[slug]`|
| Galeri grid             | `/gallery`              | ✅ Siap   | `GET /api/gallery`      |
| Galeri upload           | `/gallery/upload`       | ✅ Siap   | `POST /api/gallery/upload` |
| Agensi talent list      | `/agensi`               | ✅ Siap   | `GET /api/agensi`       |
| Agensi VTuber           | `/agensi/vtuber`        | ✅ Siap   | `GET /api/agensi?type=vtuber` |
| Premium page            | `/premium`              | ✅ Siap   | `POST /api/premium/xendit/create` |
| Top Donatur             | `/premium/donatur`      | ✅ Siap   | `GET /api/premium/donatur` |
| Donate                  | `/donate`               | ✅ Siap   | — (redirect Trakteer)   |
| Admin users             | `/admin/users`          | ✅ Siap   | `PATCH /api/admin/users/[id]` |
| Admin blog              | `/admin/blog`           | ✅ Siap   | Full CRUD API           |
| Admin events            | `/admin/events`         | ✅ Siap   | Full CRUD API           |
| Admin galeri            | `/admin/gallery`        | ✅ Siap   | `PATCH /api/admin/gallery/[id]` |
| Music Player            | Navbar (semua halaman)  | ✅ Siap   | `GET /api/music/playlist` *(baru)*|

---

## 🗄️ Database Schema

### Tabel: users
```sql
CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT UNIQUE NOT NULL,
  username       TEXT UNIQUE NOT NULL,
  display_name   TEXT,
  avatar_url     TEXT,
  bio            TEXT,
  role           TEXT NOT NULL DEFAULT 'USER'
                 CHECK (role IN ('OWNER','MANAGER','ADMIN','AGENSI','KREATOR','USER')),
  supporter_role TEXT
                 CHECK (supporter_role IN ('DONATUR','VIP','VVIP') OR supporter_role IS NULL),
  discord_id     TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: blog_posts
```sql
CREATE TABLE blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT NOT NULL,
  cover_url   TEXT,
  tags        TEXT[],
  author_id   UUID REFERENCES users(id),
  published   BOOLEAN DEFAULT false,
  read_time   INTEGER, -- estimasi menit baca
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: events
```sql
CREATE TABLE events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  cover_url        TEXT,
  event_type       TEXT NOT NULL DEFAULT 'online'
                   CHECK (event_type IN ('online','offline','hybrid')),
  location         TEXT,
  discord_link     TEXT,
  starts_at        TIMESTAMPTZ NOT NULL,
  ends_at          TIMESTAMPTZ,
  max_participants INTEGER,
  tags             TEXT[],
  created_by       UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: gallery_items
```sql
CREATE TABLE gallery_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT NOT NULL,
  category    TEXT NOT NULL
              CHECK (category IN ('fanart','cosplay','foto','digital','lainnya')),
  uploader_id UUID REFERENCES users(id),
  approved    BOOLEAN DEFAULT false,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: talents
```sql
CREATE TABLE talents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL
              CHECK (type IN ('vtuber','kreator','cosplayer','musisi','penulis')),
  avatar_url  TEXT,
  banner_url  TEXT,
  bio         TEXT,
  tags        TEXT[],
  socials     JSONB DEFAULT '{}', -- { youtube, twitter, instagram, tiktok, twitch }
  model_type  TEXT CHECK (model_type IN ('2D','3D')), -- khusus VTuber
  char_name   TEXT,               -- khusus VTuber: nama karakter
  debut_date  DATE,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: donatur
```sql
CREATE TABLE donatur (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  display_name TEXT NOT NULL,
  amount       INTEGER NOT NULL, -- dalam rupiah
  tier         TEXT CHECK (tier IN ('DONATUR','VIP','VVIP')),
  message      TEXT,
  is_public    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: music_tracks *(baru — untuk music player)*
```sql
CREATE TABLE music_tracks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  artist     TEXT NOT NULL,
  anime      TEXT,           -- nama anime asal lagu
  cover_url  TEXT,           -- URL cover art atau emoji fallback
  src_url    TEXT NOT NULL,  -- URL audio file (Supabase Storage)
  duration   INTEGER,        -- detik
  order_num  INTEGER DEFAULT 0,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔌 API Endpoints

### Priority 1 — Auth (v0.2.0) 🔴 URGENT

| Method | Endpoint | Body / Params | Response |
|--------|----------|---------------|----------|
| POST | `/api/auth/register` | `{ email, password, username }` | `{ data: User }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ data: User }` + set cookie session |
| GET  | `/api/auth/me` | — (dari cookie) | `{ data: User \| null }` |
| POST | `/api/auth/logout` | — | `{ data: null }` |
| GET  | `/api/auth/discord` | — | OAuth redirect Discord |

### Priority 2 — Konten (v0.3.0) 🟠 HIGH

| Method | Endpoint | Params | Response |
|--------|----------|--------|----------|
| GET | `/api/blog` | `?page=1&limit=12&tag=` | `{ data: BlogPost[], meta: { total, page, limit } }` |
| GET | `/api/blog/[slug]` | — | `{ data: BlogPost }` |
| GET | `/api/events` | `?status=upcoming\|past\|all` | `{ data: Event[] }` |
| GET | `/api/events/[slug]` | — | `{ data: Event }` |
| GET | `/api/gallery` | `?category=&page=1&limit=20` | `{ data: GalleryItem[] }` — hanya `approved=true` |
| POST | `/api/gallery/upload` | `FormData: { file, title, category, tags, description }` | `{ data: GalleryItem }` |

### Priority 3 — Agensi & Premium (v0.4.0) 🟡 MEDIUM

| Method | Endpoint | Params | Response |
|--------|----------|--------|----------|
| GET | `/api/agensi` | `?type=vtuber\|kreator\|...` | `{ data: Talent[] }` |
| GET | `/api/agensi/[slug]` | — | `{ data: Talent }` |
| GET | `/api/premium/donatur` | `?period=all\|month` | `{ data: Donatur[] }` — sorted by amount DESC |
| POST | `/api/premium/xendit/create` | `{ tier: 'VIP'\|'VVIP', user_id }` | `{ data: { payment_url } }` |

### Priority 4 — Admin (v0.5.0) 🟡 MEDIUM

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET    | `/api/admin/users` | `?page=1&role=` | `{ data: User[] }` |
| PATCH  | `/api/admin/users/[id]` | `{ role?, supporter_role? }` | `{ data: User }` |
| POST   | `/api/admin/blog` | BlogPost form fields | `{ data: BlogPost }` |
| PATCH  | `/api/admin/blog/[id]` | Partial BlogPost | `{ data: BlogPost }` |
| DELETE | `/api/admin/blog/[id]` | — | `{ data: null }` |
| POST   | `/api/admin/events` | Event form fields | `{ data: Event }` |
| PATCH  | `/api/admin/events/[id]` | Partial Event | `{ data: Event }` |
| DELETE | `/api/admin/events/[id]` | — | `{ data: null }` |
| PATCH  | `/api/admin/gallery/[id]` | `{ approved: boolean }` | `{ data: GalleryItem }` |
| DELETE | `/api/admin/gallery/[id]` | — | `{ data: null }` |

### Priority 5 — Music Player (v0.6.0) 🟢 LOW

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/music/playlist` | `{ data: Track[] }` — hanya `is_active=true`, sorted by `order_num` |

**Track response shape** (harus sesuai dengan interface di `src/context/music-player.tsx`):
```json
{
  "id": "uuid",
  "title": "Silhouette",
  "artist": "KANA-BOON",
  "anime": "Naruto Shippuden OP16",
  "cover": "https://... atau emoji fallback 🍃",
  "src": "https://supabase-storage-url/audio.mp3",
  "duration": 253
}
```

---

## 📋 Response Format (WAJIB konsisten)

```ts
// Success
{ data: T, error: null, meta?: { total: number, page: number, limit: number } }

// Error
{ data: null, error: { message: string, code?: string } }
```

---

## 🔐 RLS Policy Template

Setiap tabel baru WAJIB ada RLS:

```sql
-- Enable RLS
ALTER TABLE nama_tabel ENABLE ROW LEVEL SECURITY;

-- Public read (untuk konten publik)
CREATE POLICY "public_read" ON nama_tabel
  FOR SELECT USING (true);

-- Owner only write
CREATE POLICY "owner_write" ON nama_tabel
  FOR ALL USING (auth.uid() = user_id);
```

---

## ✅ Rules Kaizo

1. Semua tabel baru: wajib RLS policy
2. Migration di `apps/web/supabase/migrations/YYYYMMDD_nama.sql`
3. Selesai satu endpoint → update PLAN.md status ✅ + kabari Bubu
4. Response format selalu: `{ data, error, meta? }`
5. Audio files music player → upload ke Supabase Storage bucket `music`
6. Gallery images → upload ke Supabase Storage bucket `gallery`

---

## 📬 Pesan dari Bubu

> Hei Kaizo! Ini yang Bubu tunggu biar UI bisa connect ke data real:

1. **Paling urgent** → Auth dulu (login/register/me). Begitu ini jalan, Bubu bisa pasang auth middleware bareng Sora.
2. **Setelah auth** → Blog + Events API. Konten paling sering dikunjungi.
3. **Music player** sudah ada UI-nya, tinggal endpoint `/api/music/playlist` + upload audio ke Supabase Storage. Cover bisa pakai emoji dulu.
4. **Gallery upload** — form sudah siap, tinggal `POST /api/gallery/upload` multipart ke Supabase Storage.
5. Trakteer donate sudah redirect langsung ke `https://trakteer.id/soraku`, tidak perlu webhook.
