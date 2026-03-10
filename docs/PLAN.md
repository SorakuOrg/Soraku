# SORAKU — PLAN.md
> Koordinasi Tim: Riu (Owner) · Sora (Full Stack) · Bubu (Front-end) · Kaizo (Back-end)

## v0.0.1 — Foundation ✅

| Feature               | Owner | Status | Catatan                                      |
|-----------------------|-------|--------|----------------------------------------------|
| Monorepo setup        | Sora  | ✅     | pnpm workspace + Turborepo                   |
| Design system / CSS   | Bubu  | ✅     | globals.css, tokens, animations              |
| Navbar, Footer        | Bubu  | ✅     | Responsive, dark mode, social links          |
| Homepage              | Bubu  | ✅     | Hero blob, badges, marquee                   |
| About page            | Bubu  | ✅     | Filosofi, pilar, tim, CTA                   |
| UI primitives         | Bubu  | ✅     | Button, Badge, Avatar, Separator             |
| Types                 | Sora  | ✅     | User, BlogPost, Event, GalleryItem + Talent/VTuber/Donatur |
| 404 page              | Bubu  | ✅     | Custom dengan kanji 空                       |
| Vercel deploy         | Sora  | ✅     | soraku.vercel.app — LIVE                     |

## v0.1.0 — Navbar & Footer ✅

| Feature                          | Owner | Status | Catatan                                      |
|----------------------------------|-------|--------|----------------------------------------------|
| Navbar dropdown Komunitas+Agensi | Bubu  | ✅     | With desc, mobile accordion                  |
| Footer 2 kolom + 6 sosmed        | Bubu  | ✅     | Discord, TikTok, FB, IG, Twitter, YouTube    |
| /agensi/vtuber page              | Bubu  | ✅     | VTuber cards + CTA                           |

## v0.2.0 — Auth & User UI ✅

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Supabase project setup     | Kaizo | ✅     | Schema soraku aktif di Supabase              |
| Schema DB                  | Kaizo | ✅     | 15 tabel di schema soraku, RLS aktif         |
| Login page UI              | Bubu  | ✅     | 2 step + Discord OAuth button                |
| Register page UI           | Bubu  | ✅     | 2 step form + benefits panel                 |
| Auth middleware             | Kaizo | ✅     | src/middleware.ts — role-based protection    |
| Dashboard layout + page    | Bubu  | ✅     | Sidebar, stats, quick links                  |

## v0.3.0 — Konten ✅ (UI + mock data)

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Blog listing page          | Bubu  | ✅     | Filter tag, featured post, grid              |
| Blog detail page           | Bubu  | ✅     | /blog/[slug], related posts, metadata        |
| Blog API (GET)             | Kaizo | ✅     | /api/blog + /api/blog/[slug]                 |
| Events listing page        | Bubu  | ✅     | Upcoming/past, card grid, info lengkap       |
| Events detail page         | Bubu  | ✅     | /events/[slug], Discord CTA                  |
| Events API (GET)           | Kaizo | ✅     | /api/events + /api/events/[slug]             |
| Galeri grid page           | Bubu  | ✅     | Masonry layout, filter kategori              |
| Galeri upload form         | Bubu  | ✅     | Drag & drop, preview, form                   |
| Galeri API                 | Kaizo | ✅     | /api/gallery + /api/gallery/upload           |
| Loading skeletons          | Bubu  | ✅     | Blog, events, gallery loading.tsx            |
| Error boundaries           | Bubu  | ✅     | Blog, events error.tsx                       |

## v0.4.0 — Agensi & Premium ✅ (UI + mock data)

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Agensi talent list         | Bubu  | ✅     | Grid cards, type badge, socials              |
| Agensi VTuber page         | Bubu  | ✅     | /agensi/vtuber, model type, streams          |
| Agensi API                 | Kaizo | ✅     | /api/agensi + /api/agensi/[slug]             |
| Premium page               | Bubu  | ✅     | 3 tier (Donatur/VIP/VVIP) + benefits         |
| Xendit integration         | Kaizo | ✅     | /api/premium/xendit/create + webhook         |
| Donate page                | Bubu  | ✅     | Trakteer redirect, how-to, usage             |
| Top Donatur page           | Bubu  | ✅     | Podium 🥇🥈🥉, full list, gold glow          |

## v0.5.0 — Admin Panel ✅ (UI + mock data)

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Admin layout               | Bubu  | ✅     | Sidebar, protected (middleware active)       |
| Admin dashboard overview   | Bubu  | ✅     | Stats cards, recent posts, pending gallery   |
| Admin user management      | Bubu  | ✅     | UI done                                      |
| Admin blog CRUD UI         | Bubu  | ✅     | Tabel + Edit/Delete buttons                  |
| Admin event CRUD UI        | Bubu  | ✅     | List + Edit/Delete buttons                   |
| Admin galeri moderasi      | Bubu  | ✅     | Approve/Reject buttons per item              |
| Admin API                  | Kaizo | ✅     | /api/admin/users + blog + events + gallery   |

## v0.6.0 — Polish ✅

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Discord stats API          | Sora  | ✅     | /api/discord/stats — fallback ke mock        |
| Music player persistent    | Bubu  | ✅     | React Context, PlayerBar floating            |
| Sitemap                    | Bubu  | ✅     | /sitemap.xml — static + dynamic pages        |
| Loading skeletons          | Bubu  | ✅     | Blog, events, gallery                        |
| Error boundaries           | Bubu  | ✅     | Blog, events                                 |
| OG image meta              | Bubu  | ✅     | layout.tsx — OG, Twitter card, robots        |
| Performance audit          | Sora  | ❌     | Ditunda ke v1.0.0                            |

---

## v0.7.0 — Real Data Integration 🔄 IN PROGRESS
> **Owner: Sora**
> Connect semua halaman dari mock data ke real Supabase DB.
> Server Components query langsung via `db()` dari `@/lib/supabase/server` — lebih efisien dari fetch ke /api/*.
> API routes tetap untuk: mutations dari client, panggilan dari bot, webhooks.

| Feature                    | Owner | Status | Catatan                                              |
|----------------------------|-------|--------|------------------------------------------------------|
| Blog listing → real DB     | Sora  | 🔄     | `db().from('blog_posts')` replace MOCK_POSTS         |
| Blog detail → real DB      | Sora  | 🔄     | Query by slug, notFound() jika tidak ada             |
| Events → real DB           | Sora  | 🔄     | Sort by starts_at, filter upcoming/past              |
| Gallery → real DB          | Sora  | 🔄     | approved=true only, dengan pagination                |
| Agensi → real DB           | Sora  | 🔄     | Query talents table, filter by type                  |
| Top Donatur → real DB      | Sora  | 🔄     | Query donatur, sorted by amount DESC                 |
| Music playlist → real DB   | Sora  | 🔄     | Query music_tracks via /api/music/playlist           |
| Dashboard → real user data | Sora  | 🔄     | Auth user dari session + stats dari DB               |
| Admin panel → real data    | Sora  | 🔄     | Connect admin pages ke API routes Kaizo              |
| packages/utils             | Sora  | 🔄     | slugify, formatDate, formatRupiah, truncate          |
| Trakteer webhook handler   | Sora  | 🔜     | /api/premium/trakteer/webhook → update DB + notif bot|

---

## v0.8.0 — Discord Bot (services/bot) 🔜 PLANNED
> **Owner: Sora (scaffold + arsitektur) · Kaizo (fitur + maintenance)**
> Bot Discord terintegrasi penuh dengan web via internal webhooks.

### Alur Integrasi Web ↔ Bot

```
1. User donasi Trakteer
   Trakteer → POST /api/premium/trakteer/webhook (Vercel)
   → Update DB supporter_tier
   → POST {BOT_WEBHOOK_URL}/webhook/notify (Bot)
   → Bot DM user Discord + update role Discord

2. Admin ubah role di web
   Admin → PATCH /api/admin/users/[id] (Vercel)
   → Update DB
   → POST {BOT_WEBHOOK_URL}/webhook/role-update (Bot)
   → Bot update role Discord user

3. Event baru dibuat di web
   Admin → POST /api/admin/events (Vercel)
   → Simpan DB
   → POST {BOT_WEBHOOK_URL}/webhook/discord-event (Bot)
   → Bot post announcement ke #event-soraku

4. User join/update role di Discord
   Discord → Bot guildMemberUpdate event
   → Bot POST /api/discord/role-sync (Vercel)
   → Update DB supporter_tier user
```

| Feature                          | Owner | Status | Catatan                                              |
|----------------------------------|-------|--------|------------------------------------------------------|
| Scaffold services/bot            | Sora  | 🔜     | Discord.js v14, TypeScript, Railway-ready            |
| HTTP server internal (Hono)      | Sora  | 🔜     | Terima webhooks dari web, port 3001                  |
| Bot login & ready handler        | Sora  | 🔜     | Bot online, set activity status                      |
| Slash command: /ping             | Sora  | 🔜     | Health check command                                 |
| Slash command: /member           | Kaizo | 🔜     | Info member count + online                           |
| Slash command: /event            | Kaizo | 🔜     | List upcoming events dari web API                    |
| guildMemberUpdate → role-sync    | Kaizo | 🔜     | Role Discord berubah → POST /api/discord/role-sync   |
| POST /webhook/notify             | Kaizo | 🔜     | Terima dari web → DM user Discord                    |
| POST /webhook/role-update        | Kaizo | 🔜     | Terima dari web → update role Discord user           |
| POST /webhook/discord-event      | Kaizo | 🔜     | Terima dari web → announce ke channel                |
| GET  /health                     | Sora  | 🔜     | Railway healthcheck                                  |
| API web: POST /api/bot/notify    | Sora  | 🔜     | Web endpoint untuk kirim request ke bot              |
| API web: POST /api/bot/announce  | Sora  | 🔜     | Web endpoint untuk trigger bot announcement          |
| Dockerfile + Railway config      | Kaizo | 🔜     | Deploy Railway dari services/bot/                    |

### ENV yang dibutuhkan (services/bot)
```env
DISCORD_TOKEN=
DISCORD_GUILD_ID=
DISCORD_EVENT_CHANNEL_ID=   # channel #event-soraku
SORAKU_API_URL=https://soraku.vercel.app
SORAKU_API_SECRET=           # sama dengan di Vercel
WEBHOOK_SECRET=              # sama dengan BOT_WEBHOOK_SECRET di Vercel
PORT=3001
```

---

## v0.9.0 — Notifikasi & Real-time 🔄 IN PROGRESS

| Feature                       | Owner | Status | Catatan                                                        |
|-------------------------------|-------|--------|----------------------------------------------------------------|
| Upload /public/logo.png       | Bubu  | ✅     | Chibi sticker + logo-full.png (3D render hoodie)              |
| Footer → SORAKU_SOCIALS       | Bubu  | ✅     | Ganti inline SVG → import dari custom-icons.tsx               |
| Footer → logo.png             | Bubu  | ✅     | Ganti karakter 空 teks → Image mascot                         |
| Halaman /social               | Bubu  | ✅     | Grid semua sosmed pakai SORAKU_SOCIALS                        |
| Nav items baru                | Bubu  | ✅     | Showcase, Sosial Media, Premium                               |
| Notification bell UI          | Bubu  | ✅     | Bell lucide, badge unread count, panel dropdown, polling 30s  |
| Notif lib + hook + API route  | Bubu  | ✅     | lib/notifications.ts · hooks/use-notifications.ts             |
| User dropdown di Navbar       | Bubu  | ✅     | Avatar, nama, Profil/Settings/Admin/Keluar                    |
| Logo mascot di Navbar         | Bubu  | ✅     | Image Next.js, hover scale                                    |
| Notif API (Supabase)          | Kaizo | ❌     | GET /api/notifications + PATCH mark-as-read, schema di route  |
| Push via Discord DM           | Kaizo | ❌     | Via services/bot webhook                                      |
| Supabase Realtime             | Sora  | ❌     | Gallery approval live update, notif count                     |
| Connect IS_LOGGED_IN → auth   | Sora  | ❌     | Ganti konstanta mock dengan useAuth() / session               |

---

## v1.0.0 — Launch Ready 🔜 PLANNED

| Feature                    | Owner | Status | Catatan                                              |
|----------------------------|-------|--------|------------------------------------------------------|
| Performance audit          | Sora  | 🔜     | Lighthouse 90+, Core Web Vitals                      |
| Security audit             | Sora  | 🔜     | Rate limiting, CORS, CSP headers                     |
| E2E tests (Playwright)     | Sora  | 🔜     | Auth flow, blog, gallery upload                      |
| Error monitoring           | Sora  | 🔜     | Sentry / Vercel monitoring                           |
| Custom domain              | Riu   | 🔜     | soraku.id atau soraku.moe                            |

---

## Catatan Teknis Sora — Pattern v0.7.0

```ts
// ✅ Server Component — query langsung ke DB (efisien)
import { db } from "@/lib/supabase/server"
export default async function BlogPage() {
  const { data: posts } = await (await db())
    .from("blog_posts")
    .select("id, slug, title, excerpt, tags, created_at, author:users(username, display_name, avatar_url)")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(12)
  return <BlogGrid posts={posts ?? []} />
}

// ✅ Client Component mutation — lewat API routes
await fetch("/api/gallery/upload", { method: "POST", body: formData })

// ❌ JANGAN fetch /api/* dari Server Component
const res = await fetch("/api/blog") // double round-trip, tidak perlu
```
