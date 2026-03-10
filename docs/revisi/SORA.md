# REVISI — SORA (Core / Full Stack Lead)
> Update terakhir: 2026-03-11 — diupdate Kaizo

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

## ⚠️ WAJIB BACA — Perbedaan Schema DB vs Mock Data

> Kaizo sudah backup semua pages mock ke `docs/revisi/backup-v0.7.0/pages/`
> dan implement real data. Sora tinggal connect sisa + bug fix.

### Nama tabel aktual di Supabase (`soraku` schema):

| Mock pakai | DB sebenarnya |
|-----------|--------------|
| `blog_posts` | `posts` |
| `gallery_items` | `gallery` |
| `talents` | `vtubers` (hanya VTuber, tidak ada type field) |
| `gallery.approved` (bool) | `gallery.status` ('pending'/'approved'/'rejected') |
| `gallery.category` | **TIDAK ADA** — pakai `tags[0]` sebagai kategori |
| `gallery.image_url` | `gallery.imageurl` |
| `gallery.uploader_id` | `gallery.uploadedby` |
| `events.starts_at` | `events.startdate` |
| `events.ends_at` | `events.enddate` |
| `events.event_type` (string) | `events.isonline` (boolean) |
| `events.discord_link` | **TIDAK ADA** |
| `events.max_participants` | **TIDAK ADA** |
| `posts.published` | `posts.ispublished` |
| `posts.published_at` | `posts.publishedat` |
| `posts.cover_url` | `posts.coverurl` |
| `posts.author_id` | `posts.authorid` |
| `posts.read_time` | **TIDAK ADA** |
| `donatur.display_name` | `donatur.displayname` |
| `donatur.is_public` | `donatur.ispublic` |
| `donatur.user_id` | `donatur.userid` |
| `donatur.created_at` | `donatur.createdat` |
| `vtubers.bio` | `vtubers.description` |
| `vtubers.avatar_url` | `vtubers.avatarurl` |
| `vtubers.debut_date` | `vtubers.debutdate` |
| `vtubers.is_active` | `vtubers.isactive` |
| `vtubers.socials` | `vtubers.sociallinks` |

### Pattern query wajib:

```ts
// ✅ BENAR — Server Component query DB
import { db } from "@/lib/supabase/server"
const { data } = await (await db()).from("posts").select("...").eq("ispublished", true)

// ✅ BENAR — wajib di semua page (Next.js 16)
export const dynamic = "force-dynamic"

// ✅ BENAR — searchParams di Next.js 16 harus awaited
export default async function Page({ searchParams }: { searchParams?: Promise<{ tag?: string }> }) {
  const params = await searchParams
  const tag = params?.tag ?? "Semua"
}

// ❌ JANGAN — fetch ke API dari Server Component
const res = await fetch("/api/blog") // double round-trip, tidak perlu
```

---

## Progress v0.7.0 (Kaizo backup + implement)

| Halaman | Status | Catatan |
|---------|--------|---------|
| `/blog` | ✅ Kaizo | Real DB — `posts`, filter by `tags`, order by `publishedat` |
| `/blog/[slug]` | ✅ Kaizo | Real DB + author join dari `users` |
| `/events` | ✅ Kaizo | Real DB — filter `isonline` bool |
| `/events/[slug]` | ✅ Kaizo | Real DB |
| `/gallery` | ✅ Kaizo | Real DB — filter `status='approved'`, filter by `tags[0]` |
| `/agensi` | ✅ Kaizo | Real DB — `vtubers`, ganti dari `MOCK_TALENTS` |
| `/premium/donatur` | ✅ Kaizo | Real DB — order by `amount DESC` |
| `/dashboard` | ✅ Kaizo | Real stats: post count + gallery count per user |

### Backup mock pages ada di:
```
docs/revisi/backup-v0.7.0/pages/
├── blog.page.tsx
├── blog-slug.page.tsx
├── events.page.tsx
├── events-slug.page.tsx
├── gallery.page.tsx
├── agensi.page.tsx
├── donatur.page.tsx
└── dashboard.page.tsx
```

---

## Pending Tasks Sora — v0.7.0 Lanjutan

### 🔴 Urgent — Belum dikerjakan Kaizo

- [ ] **`/agensi/vtuber`** — halaman detail VTuber masih mock
  - Query: `vtubers` by slug, termasuk `islive`, `liveurl`, `subscribercount`
  - Pattern sama: `await (await db()).from("vtubers").select(...).eq("slug", slug)`

- [ ] **`/gallery/upload`** — form upload masih static
  - POST ke `/api/gallery/upload` (sudah ada) dengan `FormData: { file, title, tags }`
  - Perlu `'use client'` + state management

- [ ] **Connect IS_LOGGED_IN → auth session**
  - File terkait: cek semua Navbar, UserDropdown yang masih pakai konstanta mock
  - Pattern: `getSession()` dari `@/lib/auth` di Server Component
  - Atau `createClient()` dari `@/lib/supabase/client` untuk Client Component

### 🟠 Medium

- [ ] **Admin panel → real data**
  - `/admin/users` → GET `/api/admin/users` (sudah ada)
  - `/admin/blog` → GET, POST, PATCH, DELETE via API routes (sudah ada)
  - `/admin/events` → sama
  - `/admin/gallery` → PATCH approve/reject, DELETE

- [ ] **packages/utils** — isi file yang masih kosong
  ```ts
  // packages/utils/src/index.ts — sudah ada tapi kosong
  export function slugify(str: string): string
  export function formatRupiah(amount: number): string
  export function truncate(str: string, length: number): string
  export function generateAvatar(name: string): string
  ```

- [ ] **`/api/auth/register`** — belum ada, Bubu butuh ini
  - POST body: `{ email, password, username }`
  - Pakai: `supabase.auth.signUp()` + insert ke `soraku.users`

- [ ] **`/api/auth/login`** — belum ada
  - POST body: `{ email, password }`
  - Pakai: `supabase.auth.signInWithPassword()`

### 🟡 Low

- [ ] **Sitemap dynamic** — tambah `/blog/[slug]` dan `/events/[slug]`
  - File sudah ada di `apps/web/src/app/sitemap.ts`
  - Query `posts` dan `events` yang published, return array URL

- [ ] **Supabase Realtime**
  - Gallery approval live update
  - Notif count realtime

---

## Arsitektur apps/web

```
apps/web/src/
├── app/
│   ├── (public)/          ← semua halaman publik (Bubu design, Sora+Kaizo data)
│   ├── (auth)/            ← login, register (Bubu design)
│   ├── (dashboard)/       ← user dashboard — protected (Bubu design)
│   ├── (admin)/           ← admin panel — ADMIN+ (Bubu design)
│   └── api/               ← Route Handlers (Kaizo)
├── components/
│   ├── layout/            ← Navbar, Footer
│   ├── icons/             ← custom-icons.tsx (registry SVG non-Lucide)
│   └── ui/                ← shadcn primitives
├── lib/
│   ├── utils.ts           ← cn, formatDate, formatRupiah, formatEventDate
│   ├── auth.ts            ← getSession(), isStaff(), isManager(), isOwner()
│   ├── api.ts             ← ok(), err(), HTTP helpers
│   ├── notifications.ts   ← NotifType, NOTIF_CONFIG
│   └── supabase/
│       ├── client.ts      ← browser client + db()
│       ├── server.ts      ← server client (SSR) + db()
│       └── admin.ts       ← admin client + adminDb() + createAdminClient()
└── proxy.ts               ← Next.js 16 middleware (menggantikan middleware.ts)
```

---

## Rules Penting

```ts
// Semua pages wajib
export const dynamic = "force-dynamic"

// searchParams Next.js 16 — WAJIB awaited
async function Page({ searchParams }: { searchParams?: Promise<{ key?: string }> }) {
  const params = await searchParams  // ← wajib await
}

// Mutations via API routes — BUKAN Server Actions
// ✅ fetch("/api/blog", { method: "POST", body: ... })
// ❌ "use server" + action langsung

// adminDb() → data queries
// createAdminClient() → auth.admin operations

// Semua DB queries → await (await db()) atau adminDb()
const { data } = await (await db()).from("posts").select(...)
const { data } = await adminDb().from("users").select(...)
```

---

## Log Revisi

| # | Tanggal | Revisi | Oleh |
|---|---------|--------|------|
| 1 | 2026-03-10 | Project reset → v0.0.1 | Riu |
| 2 | 2026-03-10 | Schema `public` → `soraku` | Sora |
| 3 | 2026-03-10 | `middleware.ts` → `proxy.ts` (Next.js 16) | Sora/Kaizo |
| 4 | 2026-03-10 | Monorepo scaffold: stream, mobile, packages, services | Sora |
| 5 | 2026-03-10 | Docs restructure: 4 file utama + `revisi/` | Sora |
| 6 | 2026-03-11 | v0.7.0 — Backup mock + implement real DB di 8 pages | Kaizo |
| 7 | 2026-03-11 | `CookieOptions` fix + `proxy.ts` + notif API | Kaizo |

---

## Monorepo Roadmap

Lihat `docs/MONOREPO.md` untuk detail lengkap.

**Urutan pengerjaan:**
1. ✅ `apps/web` v0.6.0
2. 🔄 `packages/utils` + `packages/config` — isi content
3. 🔜 `services/api` — central REST API
4. 🔜 `packages/auth`
5. 🔜 `apps/stream`
6. 🔜 `apps/mobile`

**Aturan arsitektur:**
- `apps/web` JANGAN import langsung dari `services/`
- Semua shared logic ke `packages/`
- Jangan duplicate types — pakai dari `@soraku/types`
