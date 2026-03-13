# Database Migration — Soraku Community
> Dibuat oleh: Kaizo (Back-end)
> Last updated: 2026-03-12

---

## Overview

Semua migration DB ada di `supabase/migrations/` dan ditrack di tabel `soraku._migrations`.

**Jangan pernah:**
- Drop atau recreate tabel yang sudah ada data
- Edit migration yang sudah applied
- Jalankan migration tanpa koordinasi dengan Kaizo

---

## Migration History

| # | File | Tanggal | Isi | Status |
|---|------|---------|-----|--------|
| 1 | `20260310_init.sql` | 2026-03-10 | Schema awal — users, posts, events, gallery, vtubers | ✅ Applied |
| 2 | `20260311_follows.sql` | 2026-03-11 | Tabel follows, rename kolom ke camelCase tanpa underscore | ✅ Applied |
| 3 | `20260311_notifications.sql` | 2026-03-11 | Tabel notifications, supporter history, discord mappings | ✅ Applied |
| 4 | `20260312_fix_sync_cleanup_all.sql` | 2026-03-12 | Hapus duplikat functions/triggers/policies, fix notifications.body nullable | ✅ Applied |
| 5 | `20260312_services_api_setup.sql` | 2026-03-12 | Tabel `streamcontent` dan `apikeys` untuk services/api | ✅ Applied |

---

## Schema Aktif — `soraku.*`

### Naming Convention (WAJIB)
Semua kolom menggunakan **lowercase tanpa underscore**:

| ✅ Benar | ❌ Salah |
|---------|---------|
| `displayname` | `display_name` |
| `avatarurl` | `avatar_url` |
| `isprivate` | `is_private` |
| `createdat` | `created_at` |
| `updatedat` | `updated_at` |

---

### Tabel-tabel yang Ada

#### `soraku.users`
User utama — sync dengan `auth.users` via trigger `handle_new_auth_user`.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | uuid PK | Sama dengan `auth.users.id` |
| `username` | text unique | Lowercase, max 30 char |
| `displayname` | text | Nama tampil, max 50 char |
| `avatarurl` | text | URL avatar |
| `bio` | text | Bio profil |
| `coverurl` | text | URL cover/banner |
| `role` | enum | `OWNER\|MANAGER\|ADMIN\|AGENSI\|KREATOR\|USER` |
| `supporterrole` | enum nullable | `DONATUR\|VIP\|VVIP` |
| `supportersince` | timestamptz | Tanggal mulai supporter |
| `supporteruntil` | timestamptz | Tanggal berakhir (null = selamanya) |
| `supportersource` | text | `xendit\|trakteer\|discord\|manual` |
| `sociallinks` | jsonb | `{"youtube": "...", "twitter": "..."}` |
| `isprivate` | boolean | Profil tersembunyi |
| `isbanned` | boolean | User diblokir |

#### `soraku.posts`
Artikel/blog komunitas.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `slug` | text unique | URL-friendly ID |
| `title` | text | Judul artikel |
| `excerpt` | text | Ringkasan pendek |
| `content` | text | Konten penuh (markdown) |
| `coverurl` | text | URL gambar cover |
| `tags` | text[] | Array tag |
| `ispublished` | boolean | Published atau draft |
| `publishedat` | timestamptz | Tanggal publish |
| `authorid` | uuid FK users | Penulis |

#### `soraku.events`
Event komunitas.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `slug` | text unique | URL-friendly ID |
| `title` | text | Nama event |
| `startdate` | timestamptz | Tanggal mulai |
| `enddate` | timestamptz | Tanggal selesai |
| `location` | text | Lokasi (kalau offline) |
| `isonline` | boolean | Online atau offline |
| `status` | text | `pending\|online\|selesai` |
| `ispublished` | boolean | Tampil di website |

#### `soraku.gallery`
Galeri karya member.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `imageurl` | text | URL gambar |
| `status` | text | `pending\|approved\|rejected` |
| `uploadedby` | uuid FK users | Pengunggah |
| `reviewedby` | uuid FK users | Staff yang review |
| `rejectionreason` | text | Alasan ditolak |

#### `soraku.vtubers`
Data VTuber di komunitas.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `slug` | text unique | URL-friendly ID |
| `name` | text | Nama asli/IRL |
| `charactername` | text | Nama karakter VTuber |
| `islive` | boolean | Sedang live sekarang |
| `liveurl` | text | URL stream aktif |
| `subscribercount` | integer | Jumlah subscriber |
| `userid` | uuid FK users | Link ke akun user |

#### `soraku.streamcontent` ← BARU (migration 5)
Konten streaming — video on demand, live, clip.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `slug` | text unique | URL-friendly ID |
| `title` | text | Judul konten |
| `thumbnailurl` | text | URL thumbnail |
| `hlsurl` | text | URL HLS playlist (.m3u8) |
| `duration` | integer | Durasi dalam detik |
| `type` | text | `vod\|live\|clip` |
| `status` | text | `draft\|published\|archived` |
| `vtuberid` | uuid FK vtubers | VTuber yang bersangkutan |
| `viewcount` | integer | Total view |
| `ispremium` | boolean | Khusus subscriber (DONATUR/VIP/VVIP) |
| `metadata` | jsonb | Resolution, bitrate, dll |

#### `soraku.apikeys` ← BARU (migration 5)
API key untuk auth antar service (bot, mobile, stream).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `name` | text | Label: "Discord Bot", "Mobile App" |
| `keyhash` | text unique | SHA256 hash dari key asli |
| `prefix` | text | 8 char prefix untuk identify |
| `client` | text | `web\|bot\|stream\|mobile\|internal` |
| `permissions` | jsonb | `["read"]`, `["read","write"]`, dll |
| `expiresat` | timestamptz | Null = tidak expired |
| `isactive` | boolean | Key aktif atau dicabut |

---

## RLS Policies

Semua tabel punya RLS enabled. Pattern policy yang dipakai:

```sql
-- Public read
CREATE POLICY "table_public_read" ON soraku.table
  FOR SELECT USING (kondisi_public);

-- Staff bisa semua
CREATE POLICY "table_staff_all" ON soraku.table
  FOR ALL USING (soraku.is_staff(auth.uid()));
```

**Functions yang tersedia:**
- `soraku.is_staff(uid uuid)` → true kalau role OWNER/MANAGER/ADMIN
- `soraku.is_manager(uid uid)` → true kalau role OWNER/MANAGER
- `soraku.set_updated_at()` → trigger function, update `updatedat = now()`
- `soraku.handle_new_auth_user()` → trigger, auto-insert ke `soraku.users` saat register

---

## Services/API Setup (Baru)

### Struktur
```
services/api/
├── src/
│   ├── env/index.ts          — T3 env type-safe
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts      — Drizzle client
│   │   │   └── schema.ts     — Schema semua tabel
│   │   ├── auth/index.ts     — verifyAuth(), verifySecret()
│   │   └── validators/index.ts — Zod schemas
│   └── routes/
│       ├── users/            — GET & PATCH user
│       ├── premium/          — Status supporter
│       ├── vtubers/          — Data VTuber
│       ├── events/           — Events dengan filter status
│       ├── blog/             — Posts dengan search & tag filter
│       ├── gallery/          — Gallery approved
│       ├── donate/           — Xendit & Trakteer webhook
│       └── stream/           — HLS playlist & metadata
├── drizzle.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

### ENV yang diperlukan
Lihat `services/api/.env.example`.

| ENV | Keterangan |
|-----|-----------|
| `DATABASE_URL` | Supabase Transaction Pooler (port 6543) |
| `SUPABASE_URL` | URL project Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypass RLS) |
| `SORAKU_API_SECRET` | Harus sama dengan `apps/web` dan `services/bot` |
| `XENDIT_SECRET_KEY` | Opsional — payment |
| `TRAKTEER_WEBHOOK_TOKEN` | Opsional — payment |

### Auth Pattern
Services/api mendukung dua jenis auth:

1. **Supabase JWT** — untuk user biasa (login via web/mobile)
   ```
   Authorization: Bearer <supabase-access-token>
   ```

2. **API Key** — untuk service-to-service (bot, mobile app, stream)
   ```
   Authorization: Bearer sk_xxxxxxxx...
   ```
   Key disimpan sebagai SHA256 hash di tabel `soraku.apikeys`.

3. **Internal Secret** — untuk komunikasi web ↔ bot
   ```
   x-soraku-secret: <SORAKU_API_SECRET>
   ```

### Cara Generate API Key (untuk bot/mobile)
```bash
node -e "
const crypto = require('crypto');
const key = 'bot_' + crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256').update(key).digest('hex');
console.log('Key:', key);
console.log('Hash (simpan di DB):', hash);
console.log('Prefix:', key.substring(0, 8));
"
```
Simpan `Hash` ke tabel `soraku.apikeys.keyhash`, dan berikan `Key` ke bot/mobile.

---

## Cara Tambah Migration Baru

1. Buat file: `supabase/migrations/YYYYMMDD_nama.sql`
2. Gunakan `ALTER TABLE ADD COLUMN IF NOT EXISTS` — jangan drop tabel yang ada data
3. Selalu tambah RLS policy untuk tabel baru
4. Track di `soraku._migrations`:
   ```sql
   INSERT INTO soraku._migrations (name, checksum)
   VALUES ('YYYYMMDD_nama', md5('...'))
   ON CONFLICT (name) DO NOTHING;
   ```
5. Apply via Supabase MCP atau Supabase CLI
6. Update file ini (docs/migration.md)

---

## Packages/Types

Semua shared types ada di `packages/types/src/index.ts`.
Dipakai oleh semua app dan service di monorepo:

```ts
import type { User, StreamContent, ApiResponse } from "@soraku/types"
```

Types yang tersedia: `User`, `UserSession`, `Post`, `Event`, `GalleryItem`, `VTuber`, `StreamContent`, `Donatur`, `PremiumStatus`, `Notification`, dan semua enum types.

---

## Untuk Sora & Bubu

**Sora (Full Stack):**
- `services/api` siap diintegrasikan ke `apps/web` — import dari `@soraku/types` untuk type-safety
- Supabase Auth tetap di `apps/web` — `services/api` hanya untuk data layer
- Kalau perlu route baru di `services/api`, koordinasi dengan Kaizo

**Bubu (Front-end):**
- Untuk streaming UI, pakai types `StreamContent` dari `@soraku/types`
- Thumbnail: `content.thumbnailurl`
- HLS URL: `content.hlsurl` (butuh HLS.js untuk playback)
- Duration: `content.duration` (dalam detik, convert ke `mm:ss`)
- Premium badge: tampilkan jika `content.ispremium === true`
