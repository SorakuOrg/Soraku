# KAIZO — Brief & Task List
> From: Sora (Full Stack Lead)
> Last updated: 2026-03-11

---

## ✅ Sudah Selesai (rekap)

| Fitur | Status |
|-------|--------|
| Supabase schema 15 tabel + RLS | ✅ |
| Auth middleware proxy.ts | ✅ |
| /api/auth/* (login, register, me, signout, callback) | ✅ |
| Semua GET API routes (blog, events, gallery, agensi, donatur, music) | ✅ |
| Admin CRUD API routes | ✅ |
| /api/premium/trakteer webhook | ✅ |
| /api/notifications | ✅ |
| Profile routing /dash/profile/me + /profile/[username] | ✅ |
| packages/utils | ✅ |

---

## 🔴 URGENT 1 — Bot Deploy Railway (belum jalan)

Bot sudah siap dari Sora. Tinggal Kaizo set ENV dan deploy.

**Langkah:**
1. Railway dashboard → service `soraku-bot` → Variables:
```env
DISCORD_TOKEN=           # dari Discord Developer Portal
DISCORD_GUILD_ID=        # ID server Soraku
DISCORD_EVENT_CHANNEL_ID=# ID channel #event-soraku
SORAKU_API_URL=https://soraku.vercel.app
SORAKU_API_SECRET=       # random string — SAMA dengan di Vercel
WEBHOOK_SECRET=          # random string — SAMA dengan BOT_WEBHOOK_SECRET di Vercel
PORT=3001
```

2. Vercel dashboard → Environment Variables:
```env
BOT_WEBHOOK_URL=https://[nama-project].up.railway.app
BOT_WEBHOOK_SECRET=      # sama dengan WEBHOOK_SECRET Railway
SORAKU_API_SECRET=       # sama dengan di Railway
```

3. Deploy → cek: `GET https://[project].up.railway.app/health` → `{ status: "ok" }`

---

## 🔴 URGENT 2 — Discord ID Riu → role OWNER

```
Discord ID Riu: 1020644780075659356
```

Di `/api/auth/callback` saat user pertama kali OAuth Discord, cek apakah `discord_id === '1020644780075659356'` → set `role = 'OWNER'` di tabel users.

---

## 🔜 Task Selanjutnya

### 1. Tabel `partnerships` di Supabase

`/api/partnerships` sudah ada tapi tabel belum dibuat. Dipakai halaman `/about`.

```sql
CREATE TABLE soraku.partnerships (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  logourl    TEXT NOT NULL,
  website    TEXT,
  category   TEXT DEFAULT 'partner',
  isactive   BOOLEAN DEFAULT true,
  sortorder  INT DEFAULT 0,
  createdat  TIMESTAMPTZ DEFAULT now()
);
```

Isi data lewat Supabase dashboard langsung.

### 2. Awareness Route Baru (tidak perlu koding, hanya info)

Sora + Riu sudah migrasikan route architecture. Kaizo perlu tahu kalau ada API baru:

| API Baru | Keterangan |
|----------|-----------|
| `GET /api/vtubers` | List VTuber — filter tag, pagination |
| `GET /api/vtubers/[slug]` | Detail VTuber by slug |
| `GET /api/donate` | Donatur publik — filter `period=all\|month` |

Kalau ada query ke endpoint lama `/api/premium/donatur` atau `/api/agensi/vtuber` dari bot atau external service — update ke endpoint baru di atas.

---

## 📌 Route Namespace (WAJIB — dari docs/routes/NAMESPACE.md)

> Ditetapkan Riu. API baru wajib ikut struktur ini.

| Jenis | Namespace |
|-------|-----------|
| API public | `/api/blog`, `/api/events`, `/api/vtubers`, `/api/donate`, dll |
| API auth | `/api/auth/*` |
| API admin | `/api/admin/*` |
| API bot | `/api/bot/*` |

**JANGAN buat endpoint di luar `/api/`.**

---

## 📌 Rules Coding (tetap sama)

```ts
export const dynamic = 'force-dynamic'  // baris pertama setiap route.ts baru
```

- Response shape: `{ data, error, meta?: { total, page, limit } }`
- Gunakan `ok()` / `err()` dari `@/lib/api`
- `adminDb()` untuk queries — sudah include `.schema('soraku')`

