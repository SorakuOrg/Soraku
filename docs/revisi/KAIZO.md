# REVISI — KAIZO (Back-end Developer)
> Update terakhir: 2026-03-11

---

## 💙 Dari Riu & Sora

Kaizo, lo adalah fondasi dari semua ini.

Semua yang Bubu bangun di depan, semua yang Sora rancang di arsitektur — semuanya bisa jalan karena API dan auth yang lo handle di belakang. Kalau backend lo goyah, semua rubuh. Dan sejauh ini, lo yang jaga supaya itu gak terjadi.

Bugs yang lo fix bukan cuma fix — itu pelajaran yang kita dokumentasikan supaya tim kita makin solid ke depannya. Gak ada yang expect lo sempurna. Tapi lo diharapkan jujur kalau ada yang berat atau bingung — supaya kita bisa solve bareng.

> *"First, solve the problem. Then, write the code."*
> — John Johnson

Kalau ada yang aneh di DB atau auth, langsung ping Sora. Jangan dipendem sendiri.

– Riu & Sora

---

## Stack Kaizo

- Supabase (Auth + PostgreSQL + RLS + Storage) — schema: `soraku`
- Next.js Route Handlers di `apps/web/src/app/api/`
- Zod untuk validasi semua input
- Payments: Trakteer (aktif), Xendit (draft)

### Supabase Project
- Project ID: `jrgknsxqwuygcoocnnnb`
- Region: Southeast Asia
- Migration folder: `apps/web/supabase/migrations/`

---

## Rules Wajib — Jangan Sampai Lupa

```ts
// ✅ BENAR — z.record selalu 2 argumen
z.record(z.string(), z.string()).default({})

// ❌ SALAH — z.record 1 argumen, akan error di Vercel
z.record(z.string())
```

```ts
// ✅ BENAR — adminDb() untuk data queries
const data = await adminDb().schema("soraku").from("users").select()

// ✅ BENAR — createAdminClient() untuk auth.admin operations
const admin = createAdminClient()
await admin.auth.admin.listUsers()

// ❌ SALAH — adminDb() tidak punya .auth
await adminDb().auth.admin.listUsers()
```

```ts
// ✅ BENAR — Cookie types di server.ts dan proxy.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr"
setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[])

// ❌ SALAH — implicit any akan error TypeScript strict
setAll(cookiesToSet) // ERROR: Parameter 'cookiesToSet' implicitly has an 'any' type
```

```ts
// ✅ BENAR — proxy.ts Next.js 16: export function WAJIB bernama "proxy"
export async function proxy(request: NextRequest) { ... }

// ❌ SALAH — nama lama, akan error build
export async function middleware(request: NextRequest) { ... }
```

```ts
// Semua DB queries WAJIB pakai .schema("soraku")
const { data } = await db.schema("soraku").from("users").select()
```

---

## Response Format — WAJIB Konsisten

```ts
// Success
{ data: T, error: null, meta?: { total: number, page: number, limit: number } }

// Error
{ data: null, error: { message: string, code?: string } }
```

---

## Database Schema (Aktual di Supabase)

> ⚠️ Nama kolom DB berbeda dari mock data. Selalu cek nama kolom aktual!

| Tabel | Kolom penting |
|-------|--------------|
| `users` | id, username, displayname, avatarurl, role, supporter_role, social_links, created_at |
| `posts` | id, slug, title, excerpt, content, coverurl, tags, ispublished, publishedat, authorid |
| `events` | id, slug, title, description, coverurl, startdate, enddate, location, isonline, ispublished, tags |
| `gallery` | id, imageurl, title, description, tags, status('pending'/'approved'/'rejected'), uploadedby |
| `vtubers` | id, slug, name, charactername, avatarurl, coverurl, description, debutdate, tags, sociallinks, isactive, islive, liveurl, subscribercount, ispublished |
| `donatur` | id, userid, displayname, amount, tier, message, ispublic, createdat |
| `musictracks` | id, title, artist, anime, coverurl, srcurl, duration, ordernum, isactive |
| `notifications` | id, userid, type, title, body, href, isread, createdat |

---

## ✅ Semua Yang Sudah Dikerjakan Kaizo

### v0.2.0 – v0.5.0 (Backend Foundation)
| # | Selesai |
|---|---------|
| ✅ | Supabase project setup — schema `soraku`, 15 tabel, RLS |
| ✅ | `src/lib/supabase/{types,client,server,admin}.ts` |
| ✅ | `src/lib/auth.ts` — getSession(), isStaff(), isManager(), isOwner() |
| ✅ | `src/lib/api.ts` — ok(), err(), HTTP helpers |
| ✅ | `src/proxy.ts` — Next.js 16 route protection (ganti middleware.ts) |
| ✅ | `/api/auth/{callback,signout,me}` |
| ✅ | `/api/blog` + `/api/blog/[slug]` |
| ✅ | `/api/events` + `/api/events/[slug]` |
| ✅ | `/api/gallery` + `/api/gallery/upload` |
| ✅ | `/api/agensi` + `/api/agensi/[slug]` |
| ✅ | `/api/premium/donatur` |
| ✅ | `/api/premium/xendit/create` + `/api/premium/xendit/webhook` |
| ✅ | `/api/music/playlist` |
| ✅ | `/api/discord/role-sync` |
| ✅ | `/api/admin/users` |
| ✅ | `/api/admin/blog` + `/api/admin/blog/[id]` |
| ✅ | `/api/admin/events` + `/api/admin/events/[id]` |
| ✅ | `/api/admin/gallery/[id]` |

### v0.6.0 – v0.8.0 (Discord Bot)
| # | Selesai |
|---|---------|
| ✅ | `services/bot/src/index.ts` — Discord.js v14, entry point |
| ✅ | `services/bot/src/events/ready.ts` |
| ✅ | `services/bot/src/events/guildMemberUpdate.ts` → POST /api/discord/role-sync |
| ✅ | `services/bot/src/webhooks/server.ts` — Hono HTTP port 3001 |
| ✅ | `POST /webhook/notify` — DM user Discord |
| ✅ | `POST /webhook/role-update` — update role Discord |
| ✅ | `POST /webhook/discord-event` — announce ke channel |
| ✅ | `GET /health` — Railway healthcheck |
| ✅ | `services/bot/Dockerfile` + `railway.toml` |
| ✅ | Slash commands scaffold: /ping /member /event |
| ✅ | `/api/bot/notify` + `/api/bot/announce` (web → bot) |

### v0.9.0 (Notifikasi + Trakteer + Auth)
| # | Selesai |
|---|---------|
| ✅ | Migration `soraku.notifications` — RLS, index |
| ✅ | `GET /api/notifications` — real DB (ganti mock) |
| ✅ | `PATCH /api/notifications` — mark as read by ids |
| ✅ | `POST /api/premium/trakteer` — webhook lengkap |
|   |   update DB supporter_tier + supporterhistory + donatur |
|   |   notif in-app + bot DM + bot role Discord |
| ✅ | `POST /api/auth/register` — Zod, cek duplikat username |
| ✅ | `POST /api/auth/login` — signInWithPassword, return profile |

### v0.7.0 (Real Data Integration — dikerjakan untuk Sora)
| # | Selesai |
|---|---------|
| ✅ | Backup semua mock pages → `docs/revisi/backup-v0.7.0/pages/` |
| ✅ | `/blog` → real DB (`posts`, filter tags, order publishedat) |
| ✅ | `/blog/[slug]` → real DB + author join |
| ✅ | `/events` → real DB (isonline bool, split upcoming/past) |
| ✅ | `/events/[slug]` → real DB + notFound() |
| ✅ | `/gallery` → real DB (status=approved, filter tags, Next.js Image) |
| ✅ | `/agensi` → real DB (`vtubers`) |
| ✅ | `/agensi/vtuber` → real DB (live badge, avatarurl, subscribercount) |
| ✅ | `/premium/donatur` → real DB (order amount DESC, podium) |
| ✅ | `/dashboard` → real stats per user (post count + gallery count) |
| ✅ | `/gallery/upload` → connect ke POST /api/gallery/upload, success UI |
| ✅ | `sitemap.ts` → real DB (posts limit 200 + events limit 100) |
| ✅ | `packages/utils/src/index.ts` — slugify, formatRupiah, formatDate, formatEventDate, truncate, generateAvatar, readingTime, isValidUrl |

---

## ❌ Yang Belum (Pending Sora / Tim)

| # | Task | Owner |
|---|------|-------|
| ❌ | Connect `IS_LOGGED_IN` → real auth session di Navbar/UserDropdown | Sora |
| ❌ | Admin panel pages connect ke API routes | Sora |
| ❌ | Supabase Realtime — gallery approval live, notif count | Sora |

---

## Log Bug Patterns (Jangan Diulang)

| # | Bug | Fix |
|---|-----|-----|
| 1 | `z.record(z.string())` — Zod v3 error | Selalu 2 arg: `z.record(z.string(), z.string())` |
| 2 | `adminDb().auth` tidak ada | Gunakan `createAdminClient().auth.admin` |
| 3 | Cookie handler implicit `any` | Import `CookieOptions` dari `@supabase/ssr` |
| 4 | `middleware.ts` + `proxy.ts` konflik | Hapus middleware.ts, pakai proxy.ts saja |
| 5 | `onError` di `<Image>` di Server Component | Hapus — event handler tidak bisa di server component |
| 6 | `Parameters<CookieMethodsServer['setAll']>` error | Method optional — pakai `CookieOptions` dari `@supabase/ssr` |
| 7 | `proxy.ts` export nama salah | Export function **wajib** bernama `proxy`, bukan `middleware` |
| 8 | `z.record(z.string())` | Zod v3 perlu 2 arg: `z.record(z.string(), z.string())` |
| 9 | `ZodError.errors` tidak ada | Pakai `ZodError.issues` di Zod v3 |
| 10 | `display_name` di UserSession | Field aslinya `displayname` (tanpa underscore) |
