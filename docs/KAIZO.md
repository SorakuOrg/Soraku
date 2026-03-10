# 🔧 KAIZO.md — Back-end Developer Soraku

> Semua task Kaizo dari PLAN.md, API spec yang dibutuhkan Bubu, dan DB schema.

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

## Database Schema

### Tabel: users
```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  username    TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  role        TEXT NOT NULL DEFAULT 'USER'
              CHECK (role IN ('OWNER','MANAGER','ADMIN','AGENSI','KREATOR','USER')),
  supporter_role TEXT
              CHECK (supporter_role IN ('DONATUR','VIP','VVIP') OR supporter_role IS NULL),
  discord_id  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
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
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: events
```sql
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  cover_url   TEXT,
  location    TEXT,
  is_online   BOOLEAN DEFAULT false,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ,
  max_participants INT,
  tags        TEXT[],
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: gallery_items
```sql
CREATE TABLE gallery_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('fanart','cosplay','foto','digital','lainnya')),
  uploader_id UUID REFERENCES users(id),
  approved    BOOLEAN DEFAULT false,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: talents / vtubers
```sql
CREATE TABLE talents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('vtuber','kreator','cosplayer','musisi','penulis')),
  avatar_url  TEXT,
  banner_url  TEXT,
  bio         TEXT,
  tags        TEXT[],
  socials     JSONB DEFAULT '{}',
  is_active   BOOLEAN DEFAULT true,
  debut_date  DATE,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: donatur
```sql
CREATE TABLE donatur (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  display_name TEXT NOT NULL,
  amount      INTEGER NOT NULL, -- dalam rupiah
  tier        TEXT CHECK (tier IN ('DONATUR','VIP','VVIP')),
  message     TEXT,
  is_public   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## API Endpoints yang Bubu Butuhkan

### Priority 1 (Auth — v0.2.0)
- `POST /api/auth/register` — email, password, username
- `POST /api/auth/login` — email, password → session
- `GET /api/auth/me` → user object
- `POST /api/auth/logout`

### Priority 2 (Konten — v0.3.0)
- `GET /api/blog?page=1&limit=12&tag=` → paginated posts
- `GET /api/blog/[slug]` → single post
- `GET /api/events?status=upcoming|past` → list
- `GET /api/events/[slug]` → single event
- `GET /api/gallery?category=&page=` → list approved items
- `POST /api/gallery/upload` → multipart, auto-moderate

### Priority 3 (Agensi & Premium — v0.4.0)
- `GET /api/agensi?type=vtuber|kreator|...` → list talents
- `GET /api/agensi/[slug]` → single talent
- `GET /api/premium/donatur?period=all|month` → top donatur list
- `POST /api/premium/xendit/create` → buat payment link Xendit

### Priority 4 (Admin — v0.5.0)
- `PATCH /api/admin/users/[id]` → ubah role/supporter_role
- `POST /api/admin/blog` → create post
- `DELETE /api/admin/blog/[id]`
- `PATCH /api/admin/gallery/[id]` → approve/reject
- `DELETE /api/admin/gallery/[id]`

### Priority 5 (v0.6.0)
- `GET /api/discord/stats` → hit Discord API untuk member count

---

## Rules Kaizo
1. Semua tabel baru: wajib RLS policy
2. Migration di `apps/web/supabase/migrations/YYYYMMDD_nama.sql`
3. Selesai satu endpoint → update PLAN.md + kabari Bubu
4. Response format selalu: `{ data, error, meta? }`
