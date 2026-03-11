# REVISI — KAIZO (Back-end Developer)
> Update terakhir: 2026-03-10

---

## 💙 Dari Riu & Sora

Kaizo, lo adalah fondasi dari semua ini.

Semua yang Bubu bangun di depan, semua yang Sora rancang di arsitektur — semuanya bisa jalan karena API dan auth yang lo handle di belakang. Kalau backend lo goyah, semua rubuh. Dan sejauh ini, lo yang jaga supaya itu gak terjadi.

Bugs yang lo fix bukan cuma fix — itu pelajaran yang kita dokumentasikan supaya tim kita makin solid ke depannya. Gak ada yang expect lo sempurna. Tapi lo diharapkan jujur kalau ada yang berat atau bingung — supaya kita bisa solve bareng.

> *"First, solve the problem. Then, write the code."*
> — John Johnson

Kalau ada yang aneh di DB atau auth, langsung ping Sora. Jangan dipendem sendiri.

– Riu & Sora

---

## Stack Kaizo

- Supabase (Auth + PostgreSQL + RLS + Storage) — schema: `soraku`
- Drizzle ORM untuk semua DB queries
- Next.js Route Handlers di `apps/web/src/app/api/`
- Zod untuk validasi semua input
- Payments: Trakteer (aktif), Xendit (draft)

### Supabase Project
- Project ID: `jrgknsxqwuygcoocnnnb`
- Region: Southeast Asia
- Migration folder: `apps/web/supabase/migrations/`

---

## Rules Wajib — Jangan Sampai Lupa

```ts
// ✅ BENAR — z.record selalu 2 argumen
z.record(z.string(), z.string()).default({})

// ❌ SALAH — z.record 1 argumen, akan error di Vercel
z.record(z.string())
```

```ts
// ✅ BENAR — adminDb() untuk data queries
const data = await adminDb().schema("soraku").from("users").select()

// ✅ BENAR — createAdminClient() untuk auth.admin operations
const admin = createAdminClient()
await admin.auth.admin.listUsers()

// ❌ SALAH — adminDb() tidak punya .auth
await adminDb().auth.admin.listUsers()
```

```ts
// ✅ BENAR — Cookie types di server.ts dan middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr"
setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[])

// ❌ SALAH — implicit any akan error TypeScript strict
setAll(cookiesToSet) // ERROR: Parameter 'cookiesToSet' implicitly has an 'any' type
```

```ts
// Semua DB queries WAJIB pakai .schema("soraku")
const { data } = await db.schema("soraku").from("users").select()
```

---

## Response Format — WAJIB Konsisten

```ts
// Success
{ data: T, error: null, meta?: { total: number, page: number, limit: number } }

// Error
{ data: null, error: { message: string, code?: string } }
```

---

## Database Schema

### users
```sql
CREATE TABLE soraku.users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT UNIQUE NOT NULL,
  username       TEXT UNIQUE NOT NULL,
  display_name   TEXT,
  avatar_url     TEXT,
  bio            TEXT,
  role           TEXT NOT NULL DEFAULT 'USER'
                 CHECK (role IN ('OWNER','MANAGER','ADMIN','AGENSI','KREATOR','USER')),
  supporter_tier TEXT CHECK (supporter_tier IN ('DONATUR','VIP','VVIP') OR supporter_tier IS NULL),
  discord_id     TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);
```

### blog_posts
```sql
CREATE TABLE soraku.blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT NOT NULL,
  cover_url   TEXT,
  tags        TEXT[],
  author_id   UUID REFERENCES soraku.users(id),
  published   BOOLEAN DEFAULT false,
  read_time   INTEGER,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### events
```sql
CREATE TABLE soraku.events (
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
  created_by       UUID REFERENCES soraku.users(id),
  created_at       TIMESTAMPTZ DEFAULT now()
);
```

### gallery_items
```sql
CREATE TABLE soraku.gallery_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT NOT NULL,
  category    TEXT NOT NULL
              CHECK (category IN ('fanart','cosplay','foto','digital','lainnya')),
  uploader_id UUID REFERENCES soraku.users(id),
  approved    BOOLEAN DEFAULT false,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### talents
```sql
CREATE TABLE soraku.talents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('vtuber','kreator','cosplayer','musisi','penulis')),
  avatar_url  TEXT,
  banner_url  TEXT,
  bio         TEXT,
  tags        TEXT[],
  socials     JSONB DEFAULT '{}',
  model_type  TEXT CHECK (model_type IN ('2D','3D')),
  debut_date  DATE,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### donatur
```sql
CREATE TABLE soraku.donatur (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES soraku.users(id),
  display_name TEXT NOT NULL,
  amount       INTEGER NOT NULL,
  tier         TEXT CHECK (tier IN ('DONATUR','VIP','VVIP')),
  message      TEXT,
  is_public    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

### music_tracks
```sql
CREATE TABLE soraku.music_tracks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  artist     TEXT NOT NULL,
  anime      TEXT,
  cover_url  TEXT,
  src_url    TEXT NOT NULL,
  duration   INTEGER,
  order_num  INTEGER DEFAULT 0,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### RLS Template (wajib tiap tabel baru)
```sql
ALTER TABLE soraku.nama_tabel ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_read" ON soraku.nama_tabel
  FOR SELECT USING (true);

-- Owner write
CREATE POLICY "owner_write" ON soraku.nama_tabel
  FOR ALL USING (auth.uid() = user_id);
```

---

## API Endpoints

### Priority 1 — Auth (v0.2.0) 🔴 URGENT

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/register` | `{ email, password, username }` | `{ data: User }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ data: User }` + set cookie |
| GET  | `/api/auth/me` | — (dari cookie) | `{ data: User \| null }` |
| POST | `/api/auth/logout` | — | `{ data: null }` |
| GET  | `/api/auth/discord` | — | OAuth redirect |

### Priority 2 — Konten (v0.3.0) 🟠 HIGH

| Method | Endpoint | Params | Response |
|--------|----------|--------|----------|
| GET | `/api/blog` | `?page=1&limit=12&tag=` | `{ data: BlogPost[], meta }` |
| GET | `/api/blog/[slug]` | — | `{ data: BlogPost }` |
| GET | `/api/events` | `?status=upcoming\|past\|all` | `{ data: Event[] }` |
| GET | `/api/events/[slug]` | — | `{ data: Event }` |
| GET | `/api/gallery` | `?category=&page=1&limit=20` | `{ data: GalleryItem[] }` — hanya `approved=true` |
| POST | `/api/gallery/upload` | `FormData: { file, title, category, tags }` | `{ data: GalleryItem }` |

### Priority 3 — Agensi & Premium (v0.4.0) 🟡 MEDIUM

| Method | Endpoint | Params | Response |
|--------|----------|--------|----------|
| GET | `/api/agensi` | `?type=vtuber\|kreator\|...` | `{ data: Talent[] }` |
| GET | `/api/agensi/[slug]` | — | `{ data: Talent }` |
| GET | `/api/premium/donatur` | `?period=all\|month` | `{ data: Donatur[] }` sorted by amount DESC |
| POST | `/api/premium/xendit/create` | `{ tier, user_id }` | `{ data: { payment_url } }` |

### Priority 4 — Admin (v0.5.0) 🟡 MEDIUM

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET    | `/api/admin/users` | `?page=1&role=` | `{ data: User[] }` |
| PATCH  | `/api/admin/users/[id]` | `{ role?, supporter_tier? }` | `{ data: User }` |
| POST   | `/api/admin/blog` | BlogPost fields | `{ data: BlogPost }` |
| PATCH  | `/api/admin/blog/[id]` | Partial BlogPost | `{ data: BlogPost }` |
| DELETE | `/api/admin/blog/[id]` | — | `{ data: null }` |
| POST   | `/api/admin/events` | Event fields | `{ data: Event }` |
| PATCH  | `/api/admin/events/[id]` | Partial Event | `{ data: Event }` |
| DELETE | `/api/admin/events/[id]` | — | `{ data: null }` |
| PATCH  | `/api/admin/gallery/[id]` | `{ approved: boolean }` | `{ data: GalleryItem }` |
| DELETE | `/api/admin/gallery/[id]` | — | `{ data: null }` |

### Priority 5 — Music Player (v0.6.0) 🟢 LOW

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/music/playlist` | `{ data: Track[] }` — hanya `is_active=true`, sorted `order_num` |

Track response shape:
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

## Checklist Setelah Selesai Satu Endpoint

1. ✅ Response format: `{ data, error, meta? }`
2. ✅ Zod validation untuk semua input
3. ✅ RLS policy sudah ada di tabel terkait
4. ✅ Update PLAN.md status → ✅
5. ✅ Kabari Bubu supaya bisa connect UI ke data real

---

## Log Bug Patterns (Jangan Diulang)

| # | Bug | Fix |
|---|-----|-----|
| 1 | `z.record(z.string())` — Zod v3 error | Selalu 2 arg: `z.record(z.string(), z.string())` |
| 2 | `adminDb().auth` tidak ada | Gunakan `createAdminClient().auth.admin` |
| 3 | Cookie handler implicit `any` | Import `CookieOptions` dari `@supabase/ssr` |
| 4 | `middleware.ts` + `proxy.ts` konflik | Hapus middleware.ts, pakai proxy.ts saja |
| 5 | `onError` di `<Image>` di Server Component | Hapus — event handler tidak bisa di server component |

---

## 🤖 Bot Discord (services/bot) — Instruksi Deploy Railway

Sora sudah scaffold `services/bot/` lengkap. Kaizo yang handle deploy dan fitur selanjutnya.

### File yang sudah ada (jangan diubah kecuali ada bug):
```
services/bot/
├── src/index.ts                    ← entry point
├── src/events/ready.ts             ← bot online
├── src/events/guildMemberUpdate.ts ← role sync → /api/discord/role-sync
├── src/webhooks/server.ts          ← Hono HTTP server
│   ├── GET  /health
│   ├── POST /webhook/notify        ← terima dari web, DM user Discord
│   ├── POST /webhook/role-update   ← terima dari web, update role Discord
│   └── POST /webhook/discord-event ← terima dari web, announce ke channel
├── src/commands/register.ts        ← slash: /ping /member /event
├── railway.toml                    ← Railway config
├── Dockerfile                      ← build & run
└── .env.example                    ← template env vars
```

### Langkah deploy ke Railway

**1. Set ENV vars di Railway dashboard:**
```env
DISCORD_TOKEN=           ← dari Discord Developer Portal
DISCORD_GUILD_ID=        ← ID server Discord Soraku
DISCORD_EVENT_CHANNEL_ID= ← ID channel #event-soraku
SORAKU_API_URL=https://soraku.vercel.app
SORAKU_API_SECRET=       ← buat secret baru, sama dengan di Vercel
WEBHOOK_SECRET=          ← buat secret baru, sama dengan BOT_WEBHOOK_SECRET di Vercel
PORT=3001
```

**2. Set ENV vars di Vercel (apps/web):**
```env
BOT_WEBHOOK_URL=https://[nama-project].up.railway.app
BOT_WEBHOOK_SECRET=      ← sama dengan WEBHOOK_SECRET di Railway
SORAKU_API_SECRET=       ← sama dengan SORAKU_API_SECRET di Railway
```

**3. Di Railway:**
- New Project → Deploy from GitHub repo
- Root directory: `.` (root monorepo)
- Railway otomatis pakai `services/bot/railway.toml`
- Healthcheck: `GET /health` → harus return `{ status: "ok" }`

### Fitur yang perlu Kaizo tambahkan ke bot:

#### /webhook/notify — sudah ada, tambahkan format pesan yang baik
```ts
// Contoh format DM saat Trakteer berhasil:
const msg = `
✨ **Terima kasih sudah mendukung Soraku!**

Kamu sekarang adalah **${tier}** member Soraku 💜
Role Discord kamu akan diupdate dalam beberapa detik.

🌐 Platform: https://soraku.vercel.app
💙 Discord: https://discord.gg/qm3XJvRa6B
`.trim()
```

#### /webhook/role-update — sudah ada, pastikan mapping role ID benar
Role Discord ID (dari server Soraku):
- DONATUR: `1436534227708543046`
- VIP: `1447194092965728307`
- VVIP: `1447194196401459320`

Pakai ID ini di `webhook/role-update` untuk `addRoleId` / `removeRoleId`.

#### Slash command /event — ambil dari web API
```ts
// Di commands/register.ts, /event sudah ada skeleton
// Pastikan format response /api/events sesuai:
// { data: Array<{ title, starts_at, slug }> }
```

### Alur lengkap Trakteer → Discord:
```
1. User donasi di trakteer.id/soraku
2. Trakteer kirim webhook → POST /api/premium/trakteer/webhook (Vercel)
3. Web update DB: users.supporter_tier = "DONATUR"
4. Web kirim ke bot: POST {BOT_WEBHOOK_URL}/webhook/role-update
   body: { discordId: "...", addRoleId: "1436534227708543046" }
5. Bot update role Discord user
6. Web kirim ke bot: POST {BOT_WEBHOOK_URL}/webhook/notify
   body: { discordId: "...", message: "Terima kasih..." }
7. Bot DM user Discord
```

**Catatan:** Endpoint `/api/premium/trakteer/webhook` perlu Kaizo buat (belum ada).
Format Trakteer webhook: cek di https://trakteer.id/dashboard/webhook

---

## Log Bug Patterns (Tambahan Kaizo)

| # | Bug | Fix |
|---|-----|-----|
| 6 | `Parameters<CookieMethodsServer['setAll']>` error | Method optional — pakai `type CookieOptions` dari `@supabase/ssr` |
| 7 | `middleware.ts` deprecated Next.js 16 | Rename ke `proxy.ts`, hapus `middleware.ts`. Export function WAJIB bernama `proxy` (bukan `middleware`) |
| 8 | Trakteer webhook: `z.record(z.string())` | Zod v3 perlu 2 arg: `z.record(z.string(), z.string())` |

## Progress Kaizo (2026-03-11)

| # | Selesai |
|---|---------|
| ✅ | Fix `server.ts` — `CookieOptions` dari `@supabase/ssr` |
| ✅ | Rename `middleware.ts` → `proxy.ts` (Next.js 16) |
| ✅ | Tabel `notifications` di Supabase + RLS |
| ✅ | `/api/notifications` GET + PATCH real DB |
| ✅ | `/api/premium/trakteer` webhook — update DB + bot DM + role Discord |
| ✅ | `/api/admin/events` trigger bot announce saat publish |
