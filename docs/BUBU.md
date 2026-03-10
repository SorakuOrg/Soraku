# 🎨 BUBU.md — Front-end Developer Soraku

> Semua task Bubu dari PLAN.md, status, dan catatan teknis.
> Update status setelah selesai. Koordinasi dengan Sora untuk API spec.

---

## Stack Bubu

- Next.js 16 App Router · React 19 · TypeScript strict
- Tailwind CSS 4 · design system Soraku (globals.css)
- Radix UI · Lucide React · Framer Motion
- Konvensi: `"use client"` hanya jika perlu, server component by default

## Design System Rules

- Background: `#1C1E22`, Primary: `#4FA3D1`, Accent: `#E8C2A8`
- Cards: `glass-card` class untuk glassmorphism
- Premium: gold glow `.glow-gold`, gradient `.text-gradient`
- Blob animations: `.animate-blob`, `.animation-delay-{2000,4000}`
- Semua rounded: `rounded-xl` atau `rounded-2xl`

---

## Task List

### v0.1.0 ✅
- [x] Navbar dropdown Komunitas + Agensi
- [x] Footer 2 kolom + sosial media lengkap
- [ ] /agensi/vtuber placeholder → **IN PROGRESS**

### v0.2.0 — Auth & User UI
- [ ] Login page (`/login`)
- [ ] Register page (`/register`)
- [ ] Dashboard layout (`/dashboard`)
- [ ] Dashboard home page

### v0.3.0 — Konten
- [ ] Blog listing (`/blog`)
- [ ] Blog detail (`/blog/[slug]`)
- [ ] Events listing (`/events`)
- [ ] Events detail (`/events/[slug]`)
- [ ] Galeri grid (`/gallery`)
- [ ] Galeri upload form (`/gallery/upload`)

### v0.4.0 — Agensi & Premium
- [ ] Agensi talent list (`/agensi`)
- [ ] Agensi VTuber (`/agensi/vtuber`)
- [ ] Premium page (`/premium`)
- [ ] Donate page (`/donate`)
- [ ] Top Donatur (`/premium/donatur`)

### v0.5.0 — Admin Panel
- [ ] Admin layout (`/admin`)
- [ ] Admin blog CRUD
- [ ] Admin event CRUD
- [ ] Admin galeri moderasi

### v0.6.0 — Polish
- [ ] Discord member count widget (polling 30s)
- [ ] Music player persistent (React Context)
- [ ] Loading skeletons semua halaman list
- [ ] Error boundaries (error.tsx)
- [ ] OG image meta per halaman

---

## Catatan API (untuk Kaizo)

Bubu butuh endpoint berikut agar bisa ganti mock data:

| Endpoint | Method | Response |
|----------|--------|----------|
| `/api/blog` | GET | `{posts: BlogPost[]}` |
| `/api/blog/[slug]` | GET | `{post: BlogPost}` |
| `/api/events` | GET | `{events: Event[]}` |
| `/api/events/[slug]` | GET | `{event: Event}` |
| `/api/gallery` | GET | `{items: GalleryItem[]}` |
| `/api/gallery` | POST | upload + metadata |
| `/api/agensi` | GET | `{talents: Talent[]}` |
| `/api/agensi/vtuber` | GET | `{vtubers: VTuber[]}` |
| `/api/premium/donatur` | GET | `{donatur: Donatur[], topMonth: Donatur[]}` |
| `/api/discord/stats` | GET | `{memberCount: number, onlineCount: number}` |

---

## ➡️ Pesan untuk Sora (docs/SORA.md)

1. **Auth middleware** — Bubu sudah buat `/dashboard` dan `/admin` layout. Tolong Sora tambahkan middleware protection:
   - `/dashboard/*` → harus login (redirect ke `/login`)
   - `/admin/*` → harus login + role ADMIN/MANAGER/OWNER
   - Setelah Kaizo setup Supabase, pakai `createMiddlewareClient` dari `@supabase/auth-helpers-nextjs`

2. **Types tambahan** — Bubu butuh tipe berikut di `src/types/index.ts`:
   ```ts
   Talent { id, name, slug, role, avatar, bio, socials, tags }
   VTuber { id, name, slug, avatar, banner, model, debut_date, bio, socials, streams }
   Donatur { id, username, avatar, amount, tier, message, created_at }
   ```

3. **Sitemap** — Bubu sudah buat static pages, Sora bisa tambahkan dynamic slugs (blog, events) ke sitemap setelah API ready.

4. **Discord stats API** — Bubu butuh `/api/discord/stats` yang hit Discord API (server ID: dari env). Polling 30s di client.
