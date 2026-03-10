# SORAKU — PLAN.md
> Koordinasi Tim: Riu (Owner) · Sora (Full Stack) · Bubu (Front-end) · Kaizo (Back-end)
> Format: | Feature | Owner | Status | Catatan |

## v0.0.1 — Foundation

| Feature               | Owner | Status | Catatan                                      |
|-----------------------|-------|--------|----------------------------------------------|
| Monorepo setup        | Bubu  | ✅     | pnpm workspace + turbo                       |
| Design system / CSS   | Bubu  | ✅     | globals.css, tokens, animations              |
| Root layout           | Bubu  | ✅     | font, theme provider, metadata               |
| Navbar                | Bubu  | ✅     | responsive, dark mode, mobile menu           |
| Footer                | Bubu  | ✅     | links, brand                                 |
| Homepage              | Bubu  | ✅     | hero, platform grid, marquee, CTA            |
| About page            | Bubu  | ✅     | origin, pillars, team, CTA                   |
| Placeholder pages     | Bubu  | ✅     | blog/events/gallery/agensi/premium/donate    |
| UI primitives         | Bubu  | ✅     | button, badge, avatar, separator             |
| Types (shared)        | Bubu  | ✅     | User, BlogPost, Event, GalleryItem           |
| Vercel config         | Bubu  | ✅     | headers, framework preset                    |

## v0.1.0 — Auth & User

| Feature               | Owner | Status | Catatan                                      |
|-----------------------|-------|--------|----------------------------------------------|
| Supabase setup        | Kaizo | ❌     | Auth + DB schema                             |
| Login page UI         | Bubu  | ❌     | Tunggu API spec dari Kaizo                   |
| Register page UI      | Bubu  | ❌     | Tunggu API spec dari Kaizo                   |
| Auth middleware       | Kaizo | ❌     |                                              |
| Dashboard layout      | Bubu  | ❌     |                                              |
| Profil publik         | Bubu  | ❌     |                                              |
| Badge supporter UI    | Bubu  | ❌     | DONATUR/VIP/VVIP di navbar + profil          |

## v0.2.0 — Content

| Feature               | Owner | Status | Catatan                                      |
|-----------------------|-------|--------|----------------------------------------------|
| Blog listing + detail | Bubu  | ❌     |                                              |
| Events listing        | Bubu  | ❌     |                                              |
| Galeri grid           | Bubu  | ❌     |                                              |
| API routes (blog)     | Kaizo | ❌     |                                              |
| API routes (events)   | Kaizo | ❌     |                                              |
| API routes (gallery)  | Kaizo | ❌     |                                              |

## v0.3.0 — Agensi & Premium

| Feature               | Owner | Status | Catatan                                      |
|-----------------------|-------|--------|----------------------------------------------|
| Agensi page           | Bubu  | ❌     |                                              |
| VTuber profiles       | Bubu  | ❌     |                                              |
| Premium page          | Bubu  | ❌     |                                              |
| Donate page           | Bubu  | ❌     | Trakteer redirect                            |
| Xendit integration    | Kaizo | ❌     |                                              |

## v0.4.0 — Admin

| Feature               | Owner | Status | Catatan                                      |
|-----------------------|-------|--------|----------------------------------------------|
| Admin layout          | Bubu  | ❌     | Sidebar per role                             |
| Admin dashboard       | Bubu  | ❌     |                                              |
| User management UI    | Bubu  | ❌     |                                              |
| Content moderation    | Bubu  | ❌     |                                              |

---
_Last updated: 2025-03-10_
