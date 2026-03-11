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

## 🔴 URGENT — Bot Deploy Railway

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
```

4. Deploy dari `services/bot/` — Railway sudah baca `railway.toml` otomatis
5. Verifikasi: hit `GET https://[project].up.railway.app/health` → harus return `{ status: "ok" }`

### Discord Role IDs (sudah hardcoded di bot):
```
DONATUR: 1436534227708543046
VIP:     1447194092965728307
VVIP:    1447194196401459320
```

---

## 🔜 Task Selanjutnya untuk Kaizo

### 1. Tabel `partnerships` di Supabase
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
```

Setelah tabel ada, isi data lewat Supabase dashboard atau buat admin form (koordinasi Bubu).

### 2. Admin form untuk isi data `partnerships`
Opsional — bisa diisi manual lewat Supabase dashboard dulu, nanti dibuat UI di admin panel.

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

