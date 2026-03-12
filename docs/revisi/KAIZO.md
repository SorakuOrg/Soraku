# KAIZO — Brief & Task List
> From: Sora (Full Stack Lead)
> Last updated: 2026-03-11 (v1.0.1)

---

## ✅ Sudah Selesai

| Area | Status |
|------|--------|
| Schema DB soraku (15 tabel) + RLS | ✅ |
| Auth callback, OAuth PKCE fix | ✅ |
| Auto-trigger create soraku.users | ✅ |
| API: blog, events, gallery, vtubers, donate | ✅ |
| API: admin CRUD + moderasi | ✅ |
| Fix semua bug auth (logout, bad_oauth_state) | ✅ |
| Migration runner otomatis | ✅ |

---

## 🔴 Pending Kaizo — Segera

### 1. Jalankan Migration `notifications`

File: `supabase/migrations/20260311_notifications.sql`

Buka [Supabase SQL Editor](https://supabase.com/dashboard/project/jrgknsxqwuygcoocnnnb/sql) dan jalankan isinya.

Tabel yang dibuat:
```sql
soraku.notifications (
  id UUID PK,
  userid UUID FK → soraku.users,
  type TEXT,       -- 'info' | 'success' | 'warning' | 'system'
  title TEXT,
  body TEXT,
  href TEXT,
  isread BOOLEAN DEFAULT false,
  createdat TIMESTAMPTZ DEFAULT now()
)
```
RLS: user hanya bisa lihat/update notif sendiri. Insert/delete via service role.

### 2. Enable Realtime di Supabase

Buka: **Supabase → Database → Replication → Tables → Realtime**

Enable untuk:
- `soraku.notifications` — agar useNotifications hook bisa live update
- `soraku.gallery` — agar admin gallery muncul kiriman baru tanpa refresh

### 3. Fix `GET /api/gallery` — support filter `?status=`

Saat ini admin gallery fetch `/api/gallery?status=pending` tapi API mungkin tidak handle parameter `status`.

Cek dan fix di `app/api/gallery/route.ts`:
```ts
const status = searchParams.get('status') ?? 'approved'
// jika status !== 'approved', cek session & isStaff dulu
let query = adminDb().from('gallery').select('...')
if (status !== 'all') query = query.eq('status', status)
```

### 4. API Admin VTubers — (untuk Bubu buat UI-nya)

Buat route baru:
```
app/api/admin/vtubers/route.ts          ← GET list + POST create
app/api/admin/vtubers/[id]/route.ts     ← GET by id + PATCH + DELETE
```

Field vtubers: `slug, name, charactername, avatarurl, coverurl, description, debutdate, tags, sociallinks, isactive, islive, liveurl, subscribercount, ispublished`

### 5. Supabase Storage — Pastikan bucket `gallery` ada

Buka: **Supabase → Storage**

Jika bucket `gallery` belum ada:
1. New Bucket → nama: `gallery`
2. Public bucket: ✅ (agar imageurl bisa diakses publik)
3. File size limit: 5MB (sesuai validasi di API)

---

## 📌 Konvensi Schema DB (wajib diingat)

| ✅ Benar | ❌ Salah |
|---------|---------|
| `displayname` | `display_name` |
| `avatarurl` | `avatar_url` |
| `coverurl` | `cover_url` |
| `ispublished` | `is_published` |
| `isread` | `is_read` / `read` |
| `createdat` | `created_at` |
| `updatedat` | `updated_at` |
| `startdate` | `start_date` / `starts_at` |

---

## Pattern API Wajib

```ts
export const dynamic = 'force-dynamic'

// ✅ Selalu maybeSingle() bukan single()
const { data } = await adminDb().from('table').select('*').eq('id', id).maybeSingle()

// ✅ Error response yang konsisten
import { ok, err, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'

// ✅ Auth check
const session = await getSession()
if (!session) return UNAUTHORIZED
if (!isStaff(session.role)) return FORBIDDEN

// ✅ Zod validasi
const parsed = Schema.safeParse(body)
if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')
```

---

## Bot — Railway Deploy

ENV yang wajib ada di Railway:

```env
DISCORD_TOKEN=
DISCORD_GUILD_ID=
DISCORD_EVENT_CHANNEL_ID=
SORAKU_API_URL=https://soraku.vercel.app
SORAKU_API_SECRET=          ← sama dengan SORAKU_API_SECRET di Vercel
WEBHOOK_SECRET=             ← sama dengan BOT_WEBHOOK_SECRET di Vercel
PORT=3001
```

ENV yang wajib ada di Vercel (untuk komunikasi web → bot):
```env
BOT_WEBHOOK_URL=https://<project>.up.railway.app
BOT_WEBHOOK_SECRET=         ← sama dengan WEBHOOK_SECRET di Railway
SORAKU_API_SECRET=          ← sama dengan SORAKU_API_SECRET di Railway
```

---

## Log Revisi

| # | Tanggal | Revisi | Oleh |
|---|---------|--------|------|
| 1–10 | 2026-03-10/11 | (lihat CHANGELOG) | Kaizo |
| 11 | 2026-03-11 | Update task v1.1.x: migration notifs, Realtime, gallery API fix, admin vtubers | Sora |


---

## 📋 LAPORAN — 2026-03-11 (dari Bubu) — Homepage Redesign

### ✅ URGENT: Set ENV di Vercel (sudah diingatkan sebelumnya)

Ini WAJIB agar profile loading tidak error:

**Vercel Dashboard → soraku → Settings → Environment Variables:**

```
SUPABASE_SERVICE_ROLE_KEY = eyJ...   ← dari Supabase Dashboard → Project Settings → API → service_role
OWNER_DISCORD_IDS = 1020644780075659356  ← agar Riu otomatis jadi OWNER saat login
```

Setelah tambah → klik **Redeploy** di Vercel.

### Discord Widget API
Homepage sekarang fetch Discord Widget untuk stats real-time.
Guild ID yang dipakai: `1033369620989124628`
Pastikan Discord Widget **enabled** di: Server Settings → Widget → Enable Server Widget ✅


---

## 📋 LAPORAN — 2026-03-12 (dari Bubu) — Profile Redesign

### ✅ Selesai
Profile card `/dash/profile/me` sudah diredesign dengan color coding.
Navbar user dropdown sudah bersih dari tombol Donate/Premium.

### ❌ KAIZO — URGENT ACTIONS

**1. SUPABASE_SERVICE_ROLE_KEY di Vercel** ← BELUM ADA, INI BIANG SEMUA ERROR
Tanpa ini: profile gagal load, edit gagal, semua API server-side error.
```
Vercel Dashboard → soraku → Settings → Environment Variables:
SUPABASE_SERVICE_ROLE_KEY = eyJ... (dari Supabase → Project Settings → API → service_role)
```
Setelah tambah → klik REDEPLOY.

**2. OWNER_DISCORD_IDS**
```
OWNER_DISCORD_IDS = 1020644780075659356
```
Agar Riu otomatis dapat role OWNER saat login Discord.

**3. Discord Widget**
Aktifkan di: Soraku Discord Server → Settings → Widget → Enable Server Widget ✅
Guild ID: `1033369620989124628`
Ini untuk stats real-time di homepage.


---

## 📋 LAPORAN — 2026-03-12 #3 (Bubu — commit 2bd7d79)

### ✅ Selesai
Profile redesign + tab system. `/profile/[username]` route sudah aktif.

### ❌ KAIZO — Internal server error saat save profile

Debug endpoint masih aktif di `/api/debug-save`.
Buka di browser saat login: `https://soraku.vercel.app/api/debug-save`

Cek hasil `key_is_jwt` dan `db_update`:
- `key_is_jwt: false` → SUPABASE_SERVICE_ROLE_KEY salah format (harusnya eyJ..., bukan postgresql://...)
- `db_update: { ok: false }` → ada error detail di response, kirim ke Bubu

**WAJIB cek:** Di Vercel → Settings → Environment Variables:
- `SUPABASE_SERVICE_ROLE_KEY` harus JWT yang diawali `eyJ`, ambil dari:
  Supabase Dashboard → Project Settings → API → **service_role** (bukan connection string!)
