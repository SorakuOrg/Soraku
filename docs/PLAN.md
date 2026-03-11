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
| Auth middleware             | Kaizo | ✅     | src/proxy.ts — role-based protection (Next.js 16) |
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

## v0.7.0 — Real Data Integration ✅ DONE
> **Owner: Sora → dikerjakan Kaizo (backup + implement)**
> Server Components query langsung via `db()` dari `@/lib/supabase/server`.
> Backup mock pages: `docs/revisi/backup-v0.7.0/pages/`

| Feature                    | Owner | Status | Catatan                                              |
|----------------------------|-------|--------|------------------------------------------------------|
| Blog listing → real DB     | Kaizo | ✅     | `posts` table, filter tags, order publishedat        |
| Blog detail → real DB      | Kaizo | ✅     | Query by slug + author join, notFound()              |
| Events → real DB           | Kaizo | ✅     | `events` table, filter isonline bool, split upcoming/past |
| Gallery → real DB          | Kaizo | ✅     | status='approved', filter by tags, Next.js Image    |
| Agensi → real DB           | Kaizo | ✅     | `vtubers` table (/agensi + /agensi/vtuber)           |
| Top Donatur → real DB      | Kaizo | ✅     | `donatur` table, order amount DESC, podium top 3     |
| Music playlist → real DB   | Kaizo | ✅     | /api/music/playlist → musictracks isactive + ordernum|
| Dashboard → real user data | Kaizo | ✅     | getSession() + count posts & gallery per user        |
| Admin panel → real data    | Sora  | ❌     | Pending — API routes sudah ada, UI belum connect     |
| packages/utils             | Kaizo | ✅     | slugify, formatDate, formatRupiah, formatEventDate, truncate, generateAvatar, readingTime |
| Trakteer webhook handler   | Kaizo | ✅     | /api/premium/trakteer → update DB + bot DM + role Discord    |
| /api/auth/register         | Kaizo | ✅     | POST — Zod validate, cek duplikat username, signUp   |
| /api/auth/login            | Kaizo | ✅     | POST — signInWithPassword, return full profile       |
| /gallery/upload → real API | Kaizo | ✅     | Connect form ke POST /api/gallery/upload, success UI |
| Sitemap dynamic            | Kaizo | ✅     | Query real DB — posts (200) + events (100)           |

---

## v0.8.0 — Discord Bot (services/bot) ✅ DONE
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
| Slash command: /member           | Kaizo | ✅     | Scaffold di services/bot/src/commands/register.ts    |
| Slash command: /event            | Kaizo | ✅     | Scaffold di services/bot/src/commands/register.ts    |
| guildMemberUpdate → role-sync    | Kaizo | ✅     | services/bot/src/events/guildMemberUpdate.ts         |
| POST /webhook/notify             | Kaizo | ✅     | services/bot/src/webhooks/server.ts                  |
| POST /webhook/role-update        | Kaizo | ✅     | services/bot/src/webhooks/server.ts — role Discord   |
| POST /webhook/discord-event      | Kaizo | ✅     | services/bot/src/webhooks/server.ts — announce event |
| GET  /health                     | Sora  | 🔜     | Railway healthcheck                                  |
| API web: POST /api/bot/notify    | Sora  | 🔜     | Web endpoint untuk kirim request ke bot              |
| API web: POST /api/bot/announce  | Sora  | 🔜     | Web endpoint untuk trigger bot announcement          |
| Dockerfile + Railway config      | Kaizo | ✅     | Dockerfile + railway.toml di services/bot/           |

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

## v0.9.0 — Notifikasi & Real-time 🔄 IN PROGRESS (partial)

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
| Redesign homepage             | Bubu  | ✅     | Mascot hero visual, stats grid, DiscordIcon CTA, features     |
| Redesign blog                 | Bubu  | ✅     | Featured post besar, emoji tags, search placeholder           |
| Redesign events               | Bubu  | ✅     | Upcoming/past section, countdown timer, filter tipe           |
| Redesign gallery              | Bubu  | ✅     | Masonry grid, hover overlay, category filter                  |
| Redesign login                | Bubu  | ✅     | Split layout mascot, DiscordIcon+GoogleIcon dari custom-icons |
| Redesign register             | Bubu  | ✅     | Split layout benefits, 2-step form, OAuth dari custom-icons   |
<<<<<<< Updated upstream
| Redesign /about               | Bubu  | ✅     | Kanji hero 空, mascot card, pilar gradient, tim, hierarki     |
| Notif API (Supabase)          | Kaizo | ✅     | GET /api/notifications + PATCH mark-as-read, tabel DB aktif   |
| Push via Discord DM           | Kaizo | ✅     | Via bot /webhook/notify — Trakteer + premium flow             |
=======
| Redesign /about v1            | Bubu  | ✅     | Hero+mascot, stats real-time, marquee, kenapa Soraku          |
| /about — 3 Pilar              | Bubu  | ✅     | Manager/Agensi/Admin (bukan 4 pilar lama)                     |
| /about — Timeline             | Bubu  | ✅     | 2023 Sora → 2026 Soraku v1 (7 milestone)                     |
| /about — Sosmed marquee       | Bubu  | ✅     | Scrolling berjalan seperti homepage                           |
| /about — Partnership marquee  | Bubu  | ✅     | Scrolling, data dari /api/partnerships (admin manual)         |
| /api/stats                    | Bubu  | ✅     | Discord real + event count + website online placeholder       |
| /api/partnerships             | Bubu  | ✅     | Mock data, TODO Kaizo: tabel DB + admin form                  |
| Notif API (Supabase)          | Kaizo | ❌     | GET /api/notifications + PATCH mark-as-read, schema di route  |
| Push via Discord DM           | Kaizo | ❌     | Via services/bot webhook                                      |
>>>>>>> Stashed changes
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
