# Database Migration & Architecture — Soraku Monorepo
> Dibuat oleh: Kaizo (Back-end)  
> Last updated: 2026-03-12

---

## Monorepo Structure

```
SorakuCommunity/Soraku/
├── apps/
│   ├── web/          → Soraku Community (komunitas, admin, donation, login)
│   ├── stream/       → Anime Streaming Web (Next.js)
│   └── mobile/       → Mobile App (React Native / Expo) ← TODO
├── services/
│   ├── api/          → Central API — satu otak untuk semua apps & services
│   └── bot/          → Discord Bot (Railway)
└── packages/
    ├── types/        → Shared TypeScript types (@soraku/types)
    ├── ui/           → Shared UI components
    ├── config/       → Shared config (eslint, tsconfig)
    └── utils/        → Shared utilities
```

**Prinsip:** `services/api` adalah satu-satunya yang boleh akses DB langsung.  
Semua apps (`web`, `stream`, `mobile`) dan `services/bot` konsumsi data melalui `services/api`.

---

## Migration History

| # | File | Tanggal | Isi | Status |
|---|------|---------|-----|--------|
| 1 | `20260310_init.sql` | 2026-03-10 | Schema awal — users, posts, events, gallery, vtubers | ✅ Applied |
| 2 | `20260311_follows.sql` | 2026-03-11 | Tabel follows, rename kolom ke tanpa underscore | ✅ Applied |
| 3 | `20260311_notifications.sql` | 2026-03-11 | Notifications, supporter history, discord mappings | ✅ Applied |
| 4 | `20260312_fix_sync_cleanup_all.sql` | 2026-03-12 | Cleanup duplikat functions/triggers/policies | ✅ Applied |
| 5 | `20260312_services_api_setup.sql` | 2026-03-12 | Tabel `streamcontent` + `apikeys` untuk services/api | ✅ Applied |

---

## DB Schema — `soraku.*`

### ⚠️ Naming Convention (WAJIB)
Semua kolom **lowercase tanpa underscore**:

| ✅ Benar | ❌ Salah |
|---------|---------|
| `displayname` | `display_name` |
| `avatarurl` | `avatar_url` |
| `createdat` | `created_at` |

---

### Tabel Lengkap

| Tabel | Deskripsi | Consumer |
|-------|-----------|---------|
| `users` | User utama, sync auth | semua |
| `posts` | Blog/artikel komunitas | web, bot |
| `events` | Event online/offline | web, mobile, bot |
| `gallery` | Karya fan art member | web, mobile |
| `vtubers` | Profil VTuber | web, stream, mobile |
| `streamcontent` | Konten HLS streaming | stream, mobile |
| `donatur` | Riwayat donasi publik | web, mobile |
| `notifications` | Notifikasi per user | web, mobile |
| `supporterhistory` | Riwayat upgrade supporter | web, bot |
| `discordrolemappings` | Mapping Discord role ↔ tier | bot |
| `apikeys` | API key auth antar service | services/api |
| `musictracks` | Playlist musik website | web |
| `partnerships` | Partnership komunitas | web |
| `userlevels` | XP & level user | web |
| `userbadges` | Badge koleksi user | web |
| `webhooks` | Konfigurasi webhook | bot |
| `sitesettings` | Setting global website | web |

---

## Services/API — Central Brain

### Struktur
```
services/api/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── route.ts                    → GET /api (health check)
│   │       ├── users/[username]/route.ts   → GET, PATCH user
│   │       ├── premium/route.ts            → GET status + ?leaderboard=true
│   │       ├── vtubers/route.ts            → GET list
│   │       ├── vtubers/[slug]/route.ts     → GET detail
│   │       ├── events/route.ts             → GET list + ?status=
│   │       ├── events/[slug]/route.ts      → GET detail
│   │       ├── blog/route.ts               → GET list + ?search= ?tag=
│   │       ├── blog/[slug]/route.ts        → GET detail
│   │       ├── gallery/route.ts            → GET approved
│   │       ├── stream/route.ts             → GET list + premium gating
│   │       ├── stream/[slug]/route.ts      → GET metadata + HLS URL
│   │       ├── donate/xendit/create/route.ts  → POST buat invoice
│   │       ├── donate/xendit/webhook/route.ts → POST Xendit callback
│   │       └── donate/trakteer/route.ts    → POST Trakteer webhook
│   ├── lib/
│   │   ├── db/index.ts      → Drizzle client
│   │   ├── db/schema.ts     → Schema semua tabel (sync DB)
│   │   ├── auth/index.ts    → verifyAuth() + verifySecret()
│   │   └── validators/      → Zod schemas
│   └── env/index.ts         → T3 env type-safe
├── .env.example
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

### API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api` | — | Health check |
| GET | `/api/users/:username` | — | Profil user publik |
| PATCH | `/api/users/:username` | JWT | Update profil |
| GET | `/api/premium` | JWT | Status subscriber saya |
| GET | `/api/premium?leaderboard=true` | — | Top donatur publik |
| GET | `/api/vtubers` | — | Semua VTuber aktif |
| GET | `/api/vtubers/:slug` | — | Detail VTuber |
| GET | `/api/events` | — | List event (filter: `?status=`) |
| GET | `/api/events/:slug` | — | Detail event |
| GET | `/api/blog` | — | List post (filter: `?search= ?tag= ?page=`) |
| GET | `/api/blog/:slug` | — | Detail post |
| GET | `/api/gallery` | — | Galeri approved (filter: `?tag=`) |
| GET | `/api/stream` | — / JWT | List stream (premium: JWT required) |
| GET | `/api/stream/:slug` | — / JWT | Metadata + HLS URL |
| POST | `/api/donate/xendit/create` | JWT | Buat invoice Xendit |
| POST | `/api/donate/xendit/webhook` | x-callback-token | Xendit payment callback |
| POST | `/api/donate/trakteer` | x-trakteer-signature | Trakteer webhook |

### Auth Pattern

```
# 1. Supabase JWT — untuk user (web, mobile, stream)
Authorization: Bearer <supabase-jwt>

# 2. API Key — untuk service (bot, mobile app)
Authorization: Bearer sk_xxxxxxxxxxxxxxxx

# 3. Internal Secret — untuk bot ↔ web
x-soraku-secret: <SORAKU_API_SECRET>
```

### Cara Generate API Key untuk Bot / Mobile
```bash
node -e "
const crypto = require('crypto');
const key  = 'bot_' + crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256').update(key).digest('hex');
console.log('KEY (berikan ke bot):', key);
console.log('HASH (simpan di DB) :', hash);
"
# Simpan hash ke soraku.apikeys.keyhash
```

---

## ENV services/api

Lihat `services/api/.env.example`

| Variable | Keterangan |
|----------|-----------|
| `DATABASE_URL` | Supabase Transaction Pooler port 6543 |
| `SUPABASE_URL` | Project URL Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (bypass RLS) |
| `SORAKU_API_SECRET` | Harus sama dengan apps/web & services/bot |
| `XENDIT_SECRET_KEY` | Opsional — payment |
| `TRAKTEER_WEBHOOK_TOKEN` | Opsional — payment |

---

## Cara Tambah Migration Baru

1. Buat file: `supabase/migrations/YYYYMMDD_nama.sql`
2. Gunakan `ALTER TABLE ADD COLUMN IF NOT EXISTS` — jangan drop tabel yang ada data
3. Selalu `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
4. Track:
   ```sql
   INSERT INTO soraku._migrations (name, checksum)
   VALUES ('YYYYMMDD_nama', md5('...'))
   ON CONFLICT (name) DO NOTHING;
   ```
5. Koordinasi dengan Kaizo sebelum apply

---

## Tugas Sora (Full Stack)

### Prioritas Tinggi

**1. Integrasikan `apps/web` ke `services/api`**

Semua fetch data di `apps/web` yang langsung ke Supabase via `adminDb()` perlu perlahan dipindah ke hit `services/api`. Untuk sementara tidak perlu migrasi masif — cukup route baru pakai `services/api`.

```ts
// ❌ Sekarang (langsung ke DB)
const { data } = await adminDb().from("posts").select("*")

// ✅ Target (via services/api)
const res  = await fetch(`${env.API_URL}/api/blog`)
const { data } = await res.json()
```

**2. Setup `apps/stream` (Anime Streaming Web)**

Struktur awal yang dibutuhkan:
```
apps/stream/
├── src/app/
│   ├── page.tsx          → homepage — list anime
│   ├── anime/[slug]/     → detail anime
│   ├── watch/[slug]/     → video player HLS
│   └── layout.tsx
```

Pakai type dari `@soraku/types`:
```ts
import type { StreamContent, VTuber } from "@soraku/types"
```

Fetch dari `services/api`:
```ts
// List konten stream
GET ${API_URL}/api/stream?type=vod&page=1

// Detail + HLS URL untuk player
GET ${API_URL}/api/stream/:slug
// Response: { data: { hlsurl: "https://...", thumbnailurl, duration, ... } }
```

**3. Tambah ENV `API_URL` ke `apps/web`**

Di `apps/web/src/env/index.ts`, tambah:
```ts
API_URL: z.string().url().default("http://localhost:4000"),
```

Dan di Vercel: `API_URL = https://soraku-api.vercel.app` (setelah services/api deploy)

---

## Tugas Bubu (Front-end)

### `apps/stream` — UI Components yang Dibutuhkan

**1. Video Player (`/watch/[slug]`)**

Data yang tersedia dari API:
```ts
content.hlsurl       // string — HLS playlist .m3u8
content.thumbnailurl // string | null — poster image
content.duration     // number | null — detik, convert ke "mm:ss"
content.title        // string
content.ispremium    // boolean — tampilkan badge 👑
```

Player pakai **HLS.js** (sudah ada di `apps/stream`):
```tsx
import Hls from "hls.js"
// Mount ke <video> element, load content.hlsurl
```

**2. Stream Card Component**

```tsx
// Tampilkan di homepage / list
<StreamCard
  title={content.title}
  thumbnail={content.thumbnailurl}
  duration={formatDuration(content.duration)} // "24:15"
  isPremium={content.ispremium}               // crown badge
  type={content.type}                          // "VOD" | "LIVE" | "CLIP"
/>
```

**3. Premium Gate UI**

Kalau `content.ispremium === true` dan user belum subscribe:
- Tampilkan overlay blur pada thumbnail
- Tombol "Upgrade ke Supporter"
- Link ke `apps/web/premium`

**4. `apps/mobile` (kelak)**

Stack yang akan dipakai: **React Native + Expo**  
Konsumsi dari `services/api` — sama persis dengan web, cukup ganti `fetch` URL.  
Types dari `@soraku/types` bisa langsung dipakai.

---

## packages/types — Shared Types

Import di mana saja:
```ts
import type {
  User, UserSession, UserRole,
  Post, Event, GalleryItem,
  VTuber, StreamContent, StreamType,
  Donatur, PremiumStatus,
  Notification, NotifType,
  ApiResponse, PaginatedResponse,
} from "@soraku/types"
```

Kalau perlu tambah type baru, edit `packages/types/src/index.ts` dan koordinasi dengan Kaizo.
