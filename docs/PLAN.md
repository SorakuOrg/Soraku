# SORAKU — PLAN.md
> Koordinasi Tim: Riu (Owner) · Sora (Full Stack) · Bubu (Front-end) · Kaizo (Back-end)
> Format: | Feature | Owner | Status | Catatan |

## v0.0.1 — Foundation

| Feature               | Owner | Status | Catatan                                      |
|-----------------------|-------|--------|----------------------------------------------|
| Monorepo setup        | Sora  | ✅     | pnpm workspace + Turborepo                   |
| Design system / CSS   | Bubu  | ✅     | globals.css, tokens, animations              |
| Navbar (flat)         | Bubu  | ✅     | Responsive, dark mode toggle                 |
| Footer                | Bubu  | ✅     | Nav links + Discord icon                     |
| Homepage              | Bubu  | ✅     | Hero blob, badges, marquee, stat pills       |
| About page            | Bubu  | ✅     | Filosofi, pilar, tim, CTA                   |
| Placeholder pages     | Bubu  | ✅     | blog, events, gallery, agensi, premium, donate |
| UI primitives         | Bubu  | ✅     | Button, Badge, Avatar, Separator             |
| Types                 | Sora  | ✅     | User, BlogPost, Event, GalleryItem, ApiResponse |
| 404 page              | Bubu  | ✅     | Custom dengan kanji 空                       |
| Vercel deploy         | Sora  | ✅     | soraku.vercel.app — LIVE                     |

## v0.1.0 — Navbar & Footer v2

| Feature                          | Owner | Status | Catatan                                      |
|----------------------------------|-------|--------|----------------------------------------------|
| Navbar dropdown (Komunitas)      | Bubu  | ✅     | About, Blog, Event, Galeri                   |
| Navbar dropdown (Agensi)         | Bubu  | ✅     | VTuber, Talent                               |
| Footer 2 kolom (Komunitas+Platform) | Bubu | ✅  | Hapus kolom Akun                             |
| Footer sosial media lengkap      | Bubu  | ✅     | Discord, TikTok, FB, IG, Twitter, YouTube    |
| Agensi VTuber placeholder page   | Bubu  | ❌     | /agensi/vtuber                               |

## v0.2.0 — Auth & User (Kaizo + Bubu)

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Supabase project setup     | Kaizo | ❌     | Auth + PostgreSQL + Storage + RLS            |
| Schema DB (users, roles)   | Kaizo | ❌     | Lihat PHILOSOPHY.md untuk role system        |
| Login page UI              | Bubu  | ❌     | Tunggu API spec dari Kaizo                   |
| Register page UI           | Bubu  | ❌     | Tunggu API spec dari Kaizo                   |
| Auth middleware             | Sora  | ❌     | Protected routes: /dashboard, /admin         |
| User dashboard layout      | Bubu  | ❌     | Sidebar, profile, settings                   |

## v0.3.0 — Konten (Bubu + Kaizo)

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Blog listing page          | Bubu  | ❌     | Grid cards, filter kategori, search          |
| Blog detail page           | Bubu  | ❌     | Markdown render, author info                 |
| Blog API (GET)             | Kaizo | ❌     | /api/blog — list + detail                    |
| Events listing page        | Bubu  | ❌     | Upcoming/past, card grid                     |
| Events detail page         | Bubu  | ❌     | Info, CTA join                               |
| Events API (GET)           | Kaizo | ❌     | /api/events                                  |
| Galeri grid page           | Bubu  | ❌     | Masonry layout, filter, lightbox             |
| Galeri upload form         | Bubu  | ❌     | Tunggu Storage API dari Kaizo                |
| Galeri API (GET + upload)  | Kaizo | ❌     | /api/gallery + Supabase Storage              |

## v0.4.0 — Agensi & Premium (Bubu + Kaizo)

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Agensi page (talent list)  | Bubu  | ❌     | Grid talent/kreator                          |
| Agensi VTuber page         | Bubu  | ❌     | /agensi/vtuber — profil VTuber               |
| Agensi API                 | Kaizo | ❌     | /api/agensi                                  |
| Premium page               | Bubu  | ❌     | Tier VIP/VVIP, benefit, CTA Xendit          |
| Xendit integration         | Kaizo | ❌     | Payment untuk premium membership             |
| Donate page                | Bubu  | ❌     | Redirect Trakteer, no webhook                |
| Top Donatur page           | Bubu  | ❌     | Leaderboard donatur, gold podium             |

## v0.5.0 — Admin Panel

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Admin layout               | Bubu  | ❌     | Sidebar, protected (ADMIN+)                  |
| Admin user management      | Kaizo | ❌     | List, role change manual                     |
| Admin premium toggle       | Kaizo | ❌     | Manual toggle VIP/VVIP via API               |
| Admin blog management      | Bubu  | ❌     | CRUD blog                                    |
| Admin event management     | Bubu  | ❌     | CRUD events                                  |
| Admin galeri moderasi      | Bubu  | ❌     | Approve/reject upload                        |

## v0.6.0 — Polish & Launch

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Discord live member count  | Bubu  | ❌     | Widget di homepage, polling 30s              |
| Music player persistent    | Bubu  | ❌     | Navbar, React Context                        |
| Sitemap API route          | Sora  | ❌     | /sitemap.xml                                 |
| Loading skeletons          | Bubu  | ❌     | Semua halaman list                           |
| Error boundaries           | Bubu  | ❌     | error.tsx per segment                        |
| OG image meta              | Bubu  | ❌     | Per halaman                                  |
| Performance audit          | Sora  | ❌     | Lighthouse 90+                               |
