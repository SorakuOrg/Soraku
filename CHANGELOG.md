# CHANGELOG — Soraku Community

## [0.0.1] — 2026-03-10

### 🌸 Rebuild dari nol — Fondasi Baru

Soraku Community direset ke v0.0.1 sebagai titik awal yang bersih.
Rebuild total dari arsitektur lama ke stack modern yang lebih scalable.

#### Tim

| Nama | Role |
|------|------|
| Riu | Owner & Koordinator |
| Sora | Core / Full Stack Lead |
| Bubu | Front-end Developer |
| Kaizo | Back-end Developer |

#### 3 Pilar Soraku

| Organisasi | Teknis | Komunitas |
|-----------|--------|-----------|
| Owner / Manager / Agensi / Admin | Next.js 16 + Supabase | Inklusif · Pasionat · Non-profit |

#### Role Sistem

**Struktural:** OWNER > MANAGER > ADMIN > AGENSI > KREATOR > USER

**Supporter:** DONATUR | VIP | VVIP *(bisa rangkap dengan role struktural)*

#### Tech Stack Baru

- **Framework:** Next.js 16 App Router · React 19 · TypeScript strict
- **Styling:** Tailwind CSS 4 · Design system Soraku (glassmorphism, blob animations)
- **UI:** Radix UI primitives (shadcn pattern)
- **Backend:** Supabase (Auth + PostgreSQL + RLS + Storage) · Prisma ORM
- **Payments:** Xendit (premium) · Trakteer (donasi redirect)
- **Infra:** Vercel · pnpm workspace · Turborepo

#### Ditambahkan (v0.0.1)

**Monorepo Structure:**
- `apps/web` — Next.js 16 platform utama [AKTIF]
- `apps/stream` — web streaming (planned)
- `apps/mobile` — React Native (planned)
- `services/bot` — Discord bot (planned migration)
- `packages/ui` — shared UI components (planned)
- `docs/` — PLAN.md, PHILOSOPHY.md, PROMPTS.md, CHANGELOG.md

**apps/web Foundation:**
- Design system: globals.css dengan semua tokens, animasi blob, glass cards, gold effects
- Homepage: hero section dengan animated blobs, floating badges, marquee kategori
- About page: filosofi, pilar, tim, CTA
- Layout: Navbar responsive (dark mode toggle, mobile menu), Footer
- Placeholder pages: blog, events, gallery, agensi, premium, donate
- UI primitives: Button (6 variants), Badge (role + supporter), Avatar, Separator
- Types: User, BlogPost, Event, GalleryItem, ApiResponse
- Utils: cn(), formatDate(), formatRelativeTime(), slugify()
- 404 page custom

---

## Riwayat Sebelumnya (arsip)

Changelog dari v1.0 – v1.3.x telah diarsipkan. Soraku v0.0.1 adalah titik awal baru
dengan arsitektur yang sepenuhnya berbeda dari versi sebelumnya.

---

*空 · Langitku · Est. 2023*

## [0.0.5] — 2026-03-10
### Added
- `docs/MONOREPO.md` — Full platform roadmap dari Riu
- `apps/stream/` `apps/mobile/` — Placeholder scaffold
- `services/api/` `services/bot/README.md` — Placeholder + docs
- `packages/types/src/index.ts` — Shared TypeScript types (User, Post, Anime, Episode, dll)
- `packages/ui/ utils/ auth/ config/` — Placeholder scaffold
