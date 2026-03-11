# SORA — Brief & Task List
> From: Kaizo (Back-end)
> Last updated: 2026-03-11

---

## Identitas

Sora adalah Full Stack Lead di tim Soraku.
Sora membaca file ini di awal setiap sesi, lalu lanjut kerja sesuai status di bawah.

---

## Stack

- Next.js 16 App Router (arsitektur, routing, middleware)
- Supabase (client setup, env, admin client, migrations)
- TypeScript strict mode — semua types harus benar
- Vercel deployment & monitoring
- Turborepo untuk monorepo build

---

## Deployment

| | |
|---|---|
| Production | https://soraku.vercel.app |
| Repo | https://github.com/SorakuCommunity/Soraku |
| Branch | `master` → auto-deploy ke Vercel |
| Vercel project | `prj_xlkSNQGFtoVGd1XmbxqXmqvPkMug` |
| Root Directory | `apps/web` |
| Supabase project | `jrgknsxqwuygcoocnnnb` |

---

## ✅ Status Terkini — v1.0 Live

| Area | Status |
|------|--------|
| Auth (login/register/Discord OAuth/Google OAuth) | ✅ Real API |
| Navbar session real (fetch /api/auth/me) | ✅ |
| Profile page `/dash/profile/me` | ✅ |
| API `/api/profile` GET + PATCH | ✅ |
| Admin panel → real API (5 halaman) | ✅ |
| Blog, Events, Gallery, VTubers, Donate | ✅ Real DB |
| force-dynamic semua pages | ✅ |
| Route architecture cleanup | ✅ |
| API `/api/vtubers` + `/api/vtubers/[slug]` | ✅ Kaizo buat |
| API `/api/donate` | ✅ Kaizo buat |
| Auto-trigger create soraku.users saat signup | ✅ Kaizo buat |
| Login sudah-login screen | ✅ |

---

## ⚠️ ACTION REQUIRED — Segera

### Set ENV di Vercel

Buka: **Vercel Dashboard → Project `soraku` → Settings → Environment Variables**

Pastikan ENV berikut ada dan benar:

```
SUPABASE_SERVICE_ROLE_KEY   ← ambil dari Supabase Dashboard → Settings → API → service_role
```

Tanpa ENV ini → semua query `adminDb()` gagal diam-diam → error 500 di `/api/profile`,
`/api/auth/callback`, `/api/auth/me`, dan semua admin routes.

Nama lama `SUPABASE_SERVICE_KEY` masih di-support sebagai fallback tapi pakai nama standar lebih baik.

### Cek Supabase Redirect URLs

Buka: **Supabase Dashboard → Authentication → URL Configuration**

- **Site URL** harus: `https://soraku.vercel.app`
- **Redirect URLs** harus include:
  ```
  https://soraku.vercel.app/**
  https://soraku.vercel.app/api/auth/callback
  ```

---

## 🔴 Pending untuk Sora

### 1. Supabase Realtime

Enable di Supabase Dashboard → Database → Replication → Tables, lalu implement:

```ts
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Gallery approval live update
const channel = supabase
  .channel('gallery-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'soraku',
    table: 'gallery'
  }, (payload) => {
    // update state di UI
  })
  .subscribe()
```

Yang butuh Realtime:
- Gallery approval live update di `/gallery`
- Notif count realtime — update badge bell tanpa polling
- `website_online` presence counter di `/about` stats

### 2. Admin Panel Real Data

Bubu sudah buat semua UI admin. Sora connect UI ke API routes:
- `/dash/admin/blog` → connect ke `GET /api/blog` + `DELETE /api/admin/blog/[id]`
- `/dash/admin/events` → connect ke `GET /api/events` + `DELETE /api/admin/events/[id]`
- `/dash/admin/gallery` → connect ke `GET /api/gallery` + approval action
- `/dash/admin/users` → connect ke `GET /api/users`

---

## ⚠️ Schema DB — Naming Convention

Semua kolom di schema `soraku.*` pakai **lowercase tanpa underscore**:

| ✅ Benar | ❌ Salah |
|---------|---------|
| `displayname` | `display_name` |
| `avatarurl` | `avatar_url` |
| `coverurl` | `cover_url` |
| `isprivate` | `is_private` |
| `isbanned` | `is_banned` |
| `createdat` | `created_at` |
| `updatedat` | `updated_at` |
| `supporterrole` | `supporter_role` |

Exception: tabel `follows` masih pakai `created_at` karena dibuat sebelum konvensi ditetapkan.

Tabel lain — nama kolom berbeda dari mock lama:

| Mock lama | DB sebenarnya |
|-----------|--------------|
| `blog_posts` | `posts` |
| `gallery_items` | `gallery` |
| `gallery.approved` (bool) | `gallery.status` ('pending'/'approved'/'rejected') |
| `events.starts_at` | `events.startdate` |
| `events.event_type` | `events.isonline` (boolean) |
| `posts.published` | `posts.ispublished` |
| `posts.published_at` | `posts.publishedat` |
| `vtubers.bio` | `vtubers.description` |
| `vtubers.avatar_url` | `vtubers.avatarurl` |

---

## Migration Rules

- Format nama file: `supabase/migrations/YYYYMMDD_nama.sql`
- Setiap tabel baru **wajib enable RLS**
- Tambah index untuk kolom yang sering di-query (`username`, `role`, `slug`, dll)
- **Jangan drop/recreate** tabel yang sudah ada data → pakai `ALTER TABLE ADD COLUMN IF NOT EXISTS`
- Setelah migration selesai, update `docs/PLAN.md` dan `docs/CHANGELOG.md`

---

## Pattern Query Wajib

```ts
// ✅ Server Component → query DB langsung via adminDb()
import { adminDb } from "@/lib/supabase/admin"
const { data } = await adminDb().from("posts").select("...").eq("ispublished", true)

// ✅ force-dynamic wajib di semua page
export const dynamic = "force-dynamic"

// ✅ searchParams Next.js 16 — wajib awaited
export default async function Page({ searchParams }: { searchParams?: Promise<{ tag?: string }> }) {
  const params = await searchParams
  const tag = params?.tag ?? "Semua"
}

// ❌ JANGAN fetch ke API dari Server Component
const res = await fetch("/api/blog") // double round-trip — langsung query DB
```

---

## Arsitektur apps/web

```
apps/web/src/
├── app/
│   ├── (public)/          ← semua halaman publik
│   ├── (auth)/            ← login, register
│   ├── (dashboard)/       ← user dashboard & admin — semua protected
│   │   └── dash/
│   │       ├── profile/me/
│   │       └── admin/     ← blog, events, gallery, users
│   └── api/               ← Route Handlers
├── components/
│   ├── layout/            ← Navbar, Footer
│   ├── icons/             ← custom-icons.tsx
│   └── ui/                ← shadcn primitives
└── lib/
    ├── auth.ts            ← getSession(), isStaff(), isManager(), isOwner()
    ├── api.ts             ← ok(), err(), HTTP helpers
    ├── notifications.ts   ← NotifType, NOTIF_CONFIG
    └── supabase/
        ├── types.ts       ← UserSession type
        ├── server.ts      ← SSR client
        ├── client.ts      ← Client component client
        └── admin.ts       ← adminDb() + createAdminClient()
```

> ⚠️ Folder `(admin)/` sudah dihapus — semua admin page sekarang di `(dashboard)/dash/admin/`

---

## Bug Log — Fix yang Sudah Dilakukan Kaizo

| # | Bug | Root Cause | Fix | Status |
|---|-----|-----------|-----|--------|
| 1 | `z.record()` error | Zod v3 butuh 2 argumen | `z.record(z.string(), z.string())` | ✅ |
| 2 | `adminDb().auth` error | adminDb() return schema client | Pakai `createAdminClient().auth.admin` | ✅ |
| 3 | Cookie handler `any` type | Type tidak dideklarasi | `import { type CookieOptions }` | ✅ |
| 4 | middleware + proxy konflik | Dua file export matcher | Hapus middleware.ts, pakai proxy.ts | ✅ |
| 5 | `/profile/me` route conflict | Clash dengan `/profile/[username]` | Pindah ke `/dash/profile/me` | ✅ |
| 6 | `ZodError.errors` undefined | Zod v3 pakai `.issues` | `.issues[0]?.message` | ✅ |
| 7 | Kolom DB snake_case mismatch | DB `display_name`, kode `displayname` | Migration rename 9 kolom | ✅ |
| 8 | Riu hilang dari soraku.users | Migration Sora reset tabel | Re-insert manual dari auth.users | ✅ |
| 9 | OAuth `bad_oauth_state` | PKCE cookie ke response yang salah | `pendingCookies[]` → attach ke `redirect(url)` | ✅ |
| 10 | Profile GET return 500 | adminDb() gagal (ENV kosong) | Fallback ke session data + flag `_fallback:true` | ✅ |
| 11 | Logout tidak berfungsi | signout tidak menulis cookie ke response | `createServerClient` + manual clear `sb-*` | ✅ |
| 12 | Trigger `updated_at` error | Kolom sudah rename, trigger belum | `CREATE OR REPLACE FUNCTION → NEW.updatedat` | ✅ |

---

## Log Revisi

| # | Tanggal | Revisi | Oleh |
|---|---------|--------|------|
| 1 | 2026-03-10 | Project reset → v0.0.1 | Riu |
| 2 | 2026-03-10 | Schema `public` → `soraku` | Sora |
| 3 | 2026-03-10 | `middleware.ts` → `proxy.ts` (Next.js 16) | Sora/Kaizo |
| 4 | 2026-03-10 | Monorepo scaffold | Sora |
| 5 | 2026-03-11 | v0.7.0 — Real DB di 8 pages | Kaizo |
| 6 | 2026-03-11 | v0.9.0 — Redesign + Navbar auth | Bubu |
| 7 | 2026-03-11 | v1.0 — Login/Register/Profile/Dashboard real | Bubu |
| 8 | 2026-03-11 | Route architecture cleanup | Sora/Kaizo |
| 9 | 2026-03-11 | API vtubers + donate + auto-trigger | Kaizo |
| 10 | 2026-03-11 | Fix semua auth bugs + logout | Kaizo |
| 11 | 2026-03-11 | Laporan bug + schema migration baru | Sora |
