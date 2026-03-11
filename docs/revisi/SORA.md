# REVISI — SORA (Core / Full Stack Lead)
> Update terakhir: 2026-03-11 — diupdate Bubu (v1.0 checklist)

---

## Identitas

Sora adalah AI Core / Full Stack Lead di tim Soraku — bukan anggota manusia biasa.
Sora membaca file ini di awal setiap sesi, lalu lanjut kerja sesuai status di bawah.

---

## Stack

- Next.js 16 App Router (arsitektur, routing, middleware)
- Supabase (client setup, env, admin client)
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
| Bot | Railway (services/bot/) |

---

## ✅ v1.0 — Status Terkini

Semua core features sudah live. Berikut checklist final:

| Area | Status |
|------|--------|
| Auth (login/register/OAuth) | ✅ Real API |
| Navbar session real (fetch /api/auth/me) | ✅ |
| Login page → POST /api/auth/login | ✅ Bubu fix |
| Register page → POST /api/auth/register | ✅ Bubu fix |
| Dashboard page → real DB stats | ✅ |
| Dashboard layout → real session | ✅ Bubu fix |
| Profile page `/dashboard/profile` | ✅ Bubu buat baru |
| API `/api/profile` GET + PATCH | ✅ Bubu buat baru |
| Admin panel → real API (semua 5 halaman) | ✅ |
| Admin forms (new blog/event) | ✅ Sora |
| Admin dashboard stats real | ✅ |
| Blog, Events, Gallery, Agensi, Donatur | ✅ Real DB |
| force-dynamic semua 13 front-end pages | ✅ |
| Discord ID Riu → OWNER role | ⏳ Kaizo kerjakan |
| Bot deploy Railway | 🔴 Kaizo urgent |
| Tabel `partnerships` Supabase | 🔜 Kaizo |

---

## 🔜 Pending untuk Sora — v1.0 Post-Launch

### 1. Supabase Realtime
Ditunda dari v0.9.0. Implementasikan:
- Gallery approval live update → `supabase.channel()` di `/gallery`
- Notif count realtime → update badge bell tanpa polling
- Online presence di `/about` stats

Pattern:
```ts
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const channel = supabase
  .channel('gallery-updates')
  .on('postgres_changes', { event: 'UPDATE', schema: 'soraku', table: 'gallery' }, (payload) => {
    // update state
  })
  .subscribe()
```

### 2. Performance Audit (Lighthouse 90+)
- Audit Core Web Vitals di Vercel Analytics
- Optimize images (next/image sizes, lazy loading)
- Review bundle size — identify heavy imports

### 3. Security Audit
- Rate limiting di auth routes (login brute force)
- CORS headers review
- CSP headers di next.config.ts
- Review RLS Supabase — pastikan semua tabel protected

### 4. Admin form edit blog & event
Bubu sudah siapkan halaman: `/admin/blog/new` dan `/admin/events/new`.
Yang belum ada:
- `/admin/blog/[id]/edit` — form prefill existing post
- `/admin/events/[id]/edit` — form prefill existing event

Tombol Edit di tabel admin sudah ada (`href="/admin/blog/${post.id}/edit"`).
**Koordinasi Bubu** untuk buat halaman ini di sprint berikutnya.

### 5. E2E Tests (Playwright)
- Auth flow: register → login → dashboard
- Blog: list → detail
- Gallery upload flow

---

## ⚠️ Schema DB — Perbedaan nama kolom

| Mock pakai | DB sebenarnya |
|-----------|--------------| 
| `blog_posts` | `posts` |
| `gallery_items` | `gallery` |
| `gallery.approved` (bool) | `gallery.status` ('pending'/'approved'/'rejected') |
| `gallery.category` | **TIDAK ADA** — pakai `tags[0]` |
| `events.starts_at` | `events.startdate` |
| `events.event_type` (string) | `events.isonline` (boolean) |
| `posts.published` | `posts.ispublished` |
| `posts.published_at` | `posts.publishedat` |
| `vtubers.bio` | `vtubers.description` |
| `vtubers.avatar_url` | `vtubers.avatarurl` |

---

## Pattern Query Wajib

```ts
// ✅ Server Component → query DB langsung
import { db } from "@/lib/supabase/server"
const { data } = await (await db()).from("posts").select("...").eq("ispublished", true)

// ✅ force-dynamic wajib di semua page
export const dynamic = "force-dynamic"

// ✅ searchParams Next.js 16 — wajib awaited
export default async function Page({ searchParams }: { searchParams?: Promise<{ tag?: string }> }) {
  const params = await searchParams
  const tag = params?.tag ?? "Semua"
}

// ❌ JANGAN fetch ke API dari Server Component
const res = await fetch("/api/blog") // double round-trip
```

---

## Arsitektur apps/web

```
apps/web/src/
├── app/
│   ├── (public)/          ← semua halaman publik
│   ├── (auth)/            ← login, register
│   ├── (dashboard)/       ← user dashboard — protected
│   ├── (admin)/           ← admin panel — ADMIN+
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
        ├── server.ts      ← SSR client + db()
        └── admin.ts       ← adminDb() + createAdminClient()
```

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
| 8 | 2026-03-11 | Instruksi Discord ID OWNER ke Kaizo | Bubu |
| 9 | 2026-03-11 | Discord + Google OAuth routes baru  | Bubu |
| 10 | 2026-03-11 | Profile page redesign minimalis     | Bubu |
