# KAIZO — Revisi & Task List
> Back-end Soraku Community
> Last updated: 2026-03-11

---

## ✅ Sudah Selesai (dicatat Sora)

| Fitur | Keterangan |
|-------|-----------|
| Supabase schema + RLS | 15 tabel di schema soraku, RLS aktif |
| Auth middleware | src/proxy.ts — role-based (Next.js 16) |
| /api/auth/login + register | Zod validate, signInWithPassword, upsert profile |
| /api/auth/me + signout + callback | Session management lengkap |
| Semua GET API routes | blog, events, gallery, agensi, donatur, music, discord/stats |
| Semua admin API routes | /api/admin/users + blog + events + gallery (CRUD) |
| /api/gallery/upload | Upload file ke Supabase Storage |
| /api/premium/trakteer | Webhook → update DB + insert notif + trigger bot DM + update Discord role |
| /api/premium/xendit | Create invoice + webhook handler |
| /api/notifications | GET list + PATCH mark-as-read |
| /api/discord/role-sync | guildMemberUpdate dari bot → update DB |
| /api/admin/stats | Single endpoint dashboard — Promise.all 6 queries |
| packages/utils | slugify, formatDate, formatRupiah, truncate, readingTime, dll |
| Sitemap dynamic | Query real DB posts + events |

---

## 🔴 URGENT #1 — Discord ID Riu → Role OWNER

**Permintaan dari Riu:** User dengan Discord ID `1020644780075659356` harus otomatis dapat role `OWNER` saat login via Discord OAuth.

### Cara implementasinya:

**Option A — Di `POST /api/auth/register` dan `/api/auth/callback`:**

Cek apakah Discord ID user cocok dengan daftar OWNER, lalu set role di DB.

```ts
// Di src/app/api/auth/callback/route.ts atau register flow
const OWNER_DISCORD_IDS = [
  '1020644780075659356', // Riu
]

// Setelah user berhasil auth via Discord:
const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub
const role = OWNER_DISCORD_IDS.includes(discordId) ? 'OWNER' : 'USER'

await adminDb()
  .from('users')
  .upsert({
    id:          user.id,
    username:    ...,
    displayname: ...,
    role,           // ← OWNER jika Discord ID cocok
  }, { onConflict: 'id' })
```

**Option B — Langsung update di Supabase Dashboard:**

Buka Supabase → Table Editor → `soraku.users` → cari user Riu → ubah kolom `role` ke `OWNER`.

> **Catatan Bubu:** Opsi B bisa dilakukan Riu sendiri setelah akun Discord-nya terdaftar. Tapi Kaizo perlu ensure Option A berjalan untuk akun baru di masa depan.

### Yang harus Kaizo kerjakan:

1. Update `apps/web/src/app/api/auth/callback/route.ts` — tambah OWNER check berdasarkan Discord ID
2. Update `apps/web/src/app/api/auth/register/route.ts` — tambah logic yang sama untuk OAuth register
3. Simpan `OWNER_DISCORD_IDS` di env var `OWNER_DISCORD_IDS=1020644780075659356` (bisa multiple, comma-separated) agar tidak hardcoded

```ts
// Pattern yang benar:
const OWNER_IDS = (process.env.OWNER_DISCORD_IDS ?? '').split(',').map(s => s.trim())
const isOwner   = OWNER_IDS.includes(discordId)
```

---

## 🔴 URGENT #2 — Bot Deploy Railway

Bot sudah selesai di-scaffold Sora dan siap deploy. **Kaizo yang set ENV dan deploy.**

### Langkah:
1. Buka Railway project → pilih service `soraku-bot`
2. Set semua ENV vars di Railway:
```env
DISCORD_TOKEN=           # dari Discord Developer Portal
DISCORD_GUILD_ID=        # ID server Soraku Discord
DISCORD_EVENT_CHANNEL_ID=# ID channel #event-soraku
SORAKU_API_URL=https://soraku.vercel.app
SORAKU_API_SECRET=       # generate random string, sama dengan di Vercel
WEBHOOK_SECRET=          # generate random string, sama dengan BOT_WEBHOOK_SECRET Vercel
PORT=3001
```

3. Set ENV vars di **Vercel** juga:
```env
BOT_WEBHOOK_URL=https://[project].up.railway.app
BOT_WEBHOOK_SECRET=      # sama dengan WEBHOOK_SECRET di Railway
SORAKU_API_SECRET=       # sama dengan di Railway
OWNER_DISCORD_IDS=1020644780075659356   # ← TAMBAHKAN INI
```

4. Deploy dari `services/bot/` — Railway sudah baca `railway.toml` otomatis
5. Verifikasi: hit `GET https://[project].up.railway.app/health` → harus return `{ status: "ok" }`

---

## 🔜 Task Selanjutnya untuk Kaizo

### 3. Tabel `partnerships` di Supabase
`/api/partnerships` sudah ada tapi tabel belum dibuat. Bubu pakai ini di halaman `/about`.

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
-- RLS: OWNER/MANAGER bisa CRUD, semua bisa READ
ALTER TABLE soraku.partnerships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partnerships_select" ON soraku.partnerships FOR SELECT USING (isactive = true);
```

### 4. API `/api/profile` sudah dibuat Bubu — pastikan kompatibel
Bubu sudah buat `apps/web/src/app/api/profile/route.ts` (GET + PATCH).
Pastikan kolom yang di-update cocok dengan schema tabel `soraku.users`.
Field yang di-update: `displayname`, `bio`, `avatarurl`, `coverurl`, `sociallinks`, `isprivate`, `updatedat`.

---

## 📌 Rules Wajib

```ts
// WAJIB di baris pertama setiap route.ts baru
export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
// ...
```

- Semua response pakai `ok()` / `err()` dari `@/lib/api`
- Zod validasi semua input POST/PATCH
- `adminDb()` untuk queries, `createAdminClient()` untuk auth.admin ops
- Semua queries pakai `.schema('soraku')` (sudah include di `adminDb()`)
- Response shape: `{ data, error, meta?: { total, page, limit } }`
