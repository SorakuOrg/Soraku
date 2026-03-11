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

## ✅ Status v1.0.1 — SEMUA SELESAI

| Area | Status |
|------|--------|
| Auth (login/register/Discord OAuth/Google OAuth) | ✅ |
| Navbar session real | ✅ |
| Profile `/dash/profile/me` | ✅ |
| API `/api/profile` GET + PATCH | ✅ |
| Admin panel → real API (5 halaman) | ✅ |
| Blog, Events, Gallery, VTubers, Donate | ✅ Real DB |
| force-dynamic semua pages | ✅ |
| Route architecture cleanup | ✅ |
| **`GET /api/admin/blog`** — list all incl draft | ✅ |
| **`GET /api/admin/blog/[id]`** — prefill edit | ✅ |
| **`GET /api/admin/events`** — list all incl draft | ✅ |
| **`GET /api/admin/events/[id]`** — prefill edit | ✅ |
| **Form edit blog** `/dash/admin/blog/[id]/edit` | ✅ |
| **Form edit event** `/dash/admin/events/[id]/edit` | ✅ |
| **Supabase Realtime** notifikasi | ✅ |
| **Supabase Realtime** gallery admin live update | ✅ |
| **Tabel `notifications`** + RLS + API PATCH | ✅ |
| **Hapus `/api/debug-profile`** | ✅ |
| `.env.local.example` lengkap | ✅ |
| **`docs/revisi/RIU.md`** — brief + saran stabilitas | ✅ |

---

## 🔴 Pending Sora — v1.1.x

### 1. Rate Limiting
Endpoint rentan: `/api/auth/login`, `/api/gallery/upload`, `/api/auth/register`

Rencana: Upstash Redis + middleware rate limit sederhana di proxy.ts

### 2. Error Monitoring
Pasang Sentry di apps/web untuk track error production tanpa harus cek Vercel logs manual.

### 3. Performance Audit
Lighthouse score target: 90+ semua kategori. Jalankan setelah Bubu selesai polish semua halaman.

### 4. E2E Tests
Playwright test untuk alur kritis: login, upload galeri, buat artikel.

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
| `isread` | `is_read` atau `read` |

Exception: tabel `follows` masih pakai `created_at` karena dibuat sebelum konvensi ditetapkan.

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

// ✅ Selalu maybeSingle() bukan single() untuk query yang mungkin null
const { data } = await adminDb().from("users").select("*").eq("id", id).maybeSingle()

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
│   │       └── admin/     ← blog (+ [id]/edit), events (+ [id]/edit), gallery, users
│   └── api/               ← Route Handlers
├── components/
│   ├── layout/            ← Navbar, Footer
│   ├── icons/             ← custom-icons.tsx
│   └── ui/                ← shadcn primitives
├── hooks/
│   └── use-notifications.ts  ← Realtime + polling fallback
└── lib/
    ├── auth.ts            ← getSession(), isStaff(), isManager(), isOwner()
    ├── api.ts             ← ok(), err(), HTTP helpers
    ├── notifications.ts   ← NotifType, Notification (isread, createdat)
    └── supabase/
        ├── types.ts       ← UserSession type
        ├── server.ts      ← SSR client + db()
        ├── client.ts      ← Client component client
        └── admin.ts       ← adminDb() + createAdminClient()
```

---

## Bug Log — Fix yang Sudah Dilakukan

| # | Bug | Root Cause | Fix | Status |
|---|-----|-----------|-----|--------|
| 1–12 | (lihat history) | | | ✅ |
| 13 | Admin blog list tidak tampilkan draft | Fetch dari `/api/blog` publik yang filter `ispublished=true` | Fetch dari `/api/admin/blog` | ✅ |
| 14 | Notification field mismatch | Type `read`/`created_at` vs DB `isread`/`createdat` | Fix type + navbar | ✅ |
| 15 | `markAllRead` PATCH tidak ada handler | API hanya GET | Tambah PATCH handler | ✅ |

---

## Log Revisi

| # | Tanggal | Revisi | Oleh |
|---|---------|--------|------|
| 1–10 | 2026-03-10/11 | (lihat CHANGELOG) | Sora/Kaizo |
| 11 | 2026-03-11 | v1.0.1 — semua task Sora selesai | Sora |
