# ⚙️ SORA.md — Core / Full Stack Lead Soraku

> Koordinasi teknis, keputusan arsitektur, dan tasks dari Bubu/Kaizo.

---

## Stack Sora

- Next.js 16 App Router (arsitektur, routing, middleware)
- Supabase client setup, env management
- Prisma schema & migrations
- Vercel deployment & monitoring
- TypeScript types shared

---

## Status Deployment

- **Production:** https://soraku.vercel.app ✅ LIVE
- **Repo:** SorakuCommunity/Soraku (master)
- **Vercel project:** prj_xlkSNQGFtoVGd1XmbxqXmqvPkMug
- **Root Directory:** apps/web

---

## Pending Tasks Sora

### Urgent
- [ ] **Auth middleware** (`apps/web/src/middleware.ts`)
  - `/dashboard/*` → redirect ke `/login` jika tidak ada session
  - `/admin/*` → redirect ke `/login`, atau `/` jika role < ADMIN
  - Gunakan Supabase SSR: `@supabase/ssr` createServerClient
  
- [ ] **Types tambahan** di `src/types/index.ts` (diminta Bubu):
  ```ts
  Talent, VTuber, Donatur
  ```

- [ ] **Sitemap** (`/api/sitemap.xml` atau `src/app/sitemap.ts`)
  - Static: /, /about, /blog, /events, /gallery, /agensi, /premium, /donate
  - Dynamic: tambahkan /blog/[slug], /events/[slug] setelah API Kaizo ready

- [ ] **Discord stats API** (`/api/discord/stats`)
  - Hit Discord API: `GET https://discord.com/api/v10/invites/{code}?with_counts=true`
  - Return: `{ memberCount, onlineCount }`
  - Cache: 60s (Next.js route cache)
  - Env: `DISCORD_INVITE_CODE=qm3XJvRa6B`

### Non-urgent
- [ ] **Prisma setup** setelah Kaizo buat Supabase schema
  - `prisma init` di apps/web
  - Connect ke Supabase PostgreSQL
- [ ] **Performance audit** — Lighthouse 90+ setelah launch
- [ ] **Env validation** — tambah `@t3-oss/env-nextjs` untuk validate env vars

---

## Pesan dari Bubu (via BUBU.md)

1. **Dashboard & Admin layout sudah dibuat** (UI only). Butuh middleware Sora untuk protection.
2. **Types: Talent, VTuber, Donatur** belum ada di `src/types/index.ts` — tolong tambahkan.
3. **Sitemap** — Bubu sudah handle halaman statis, Sora perlu tambah dynamic routes setelah API ready.
4. **Discord stats API** — Bubu sudah buat widget polling 30s di homepage, butuh endpoint dari Sora.

---

## Arsitektur Notes

```
apps/web/src/
├── app/
│   ├── (public)/         ← semua halaman publik
│   ├── (auth)/           ← login, register
│   ├── (dashboard)/      ← user dashboard (protected)
│   ├── (admin)/          ← admin panel (protected, ADMIN+)
│   └── api/              ← Route Handlers
├── components/
│   ├── layout/           ← Navbar, Footer
│   ├── ui/               ← primitives (Button, Badge, etc)
│   └── features/         ← per-feature components (planned)
├── lib/
│   ├── utils.ts          ← cn, formatDate, dll
│   └── supabase/         ← client, server, middleware (planned)
├── types/
│   └── index.ts          ← shared types
└── styles/
    └── globals.css       ← design system
```

---

## 🗺️ Monorepo Roadmap (dari brief Riu, 2026-03-10)
Lihat: `docs/MONOREPO.md` untuk detail lengkap.
Urutan pengerjaan: types → utils → config → services/api → auth → stream → mobile
Aturan: apps/web JANGAN import langsung dari services/ — harus lewat API. Semua shared logic ke packages/.
