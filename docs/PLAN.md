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

## v0.2.0 — Auth & User UI ✅ (UI only)

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
| Admin layout               | Bubu  | ✅     | Sidebar, protected (TODO: middleware Sora)   |
| Admin dashboard overview   | Bubu  | ✅     | Stats cards, recent posts, pending gallery   |
| Admin user management      | Bubu  | ✅     | UI done; Kaizo perlu API untuk actions       |
| Admin blog CRUD UI         | Bubu  | ✅     | Tabel + Edit/Delete buttons                  |
| Admin event CRUD UI        | Bubu  | ✅     | List + Edit/Delete buttons                   |
| Admin galeri moderasi      | Bubu  | ✅     | Approve/Reject buttons per item              |
| Admin API (users)          | Kaizo | ✅     | /api/admin/users + blog + events + gallery   |

## v0.6.0 — Polish ✅

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Discord stats API          | Sora  | ✅     | /api/discord/stats — fallback ke mock        |
| Music player persistent    | Bubu  | ✅     | React Context, PlayerBar floating + minimized pill                                 |
| Sitemap                    | Bubu  | ✅     | /sitemap.xml — static + dynamic pages        |
| Loading skeletons          | Bubu  | ✅     | Blog, events, gallery                        |
| Error boundaries           | Bubu  | ✅     | Blog, events                                 |
| OG image meta              | Bubu  | ✅     | layout.tsx — OG, Twitter card, robots        |
| Performance audit          | Sora  | ❌     | Setelah launch                               |

## 🔮 Next Steps

| Item | Owner | Prioritas |
|------|-------|-----------|
| Supabase setup + schema | Kaizo | ✅ DONE |
| Auth middleware (Sora) | Sora | HIGH |
| Ganti mock data → real API | Kaizo+Sora | 🔄 API siap, Sora connect ke UI |
| Music player persistent | Bubu | ✅ DONE |
| Admin form create/edit | Bubu | LOW |
| Performance audit | Sora | LOW |
