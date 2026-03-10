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

## [0.0.6] — 2026-03-10

### Changed
- `docs/MONOREPO.md` — Ditulis ulang agar lebih team-friendly dan implementable:
  siapa kerjakan apa, urutan pengerjaan, arsitektur diagram, env vars lengkap
- Docs restructure: hapus semua file kecuali 4 file utama
  - Dipertahankan: `PHILOSOPHY.md`, `PLAN.md`, `PROMPTS.md`, `MONOREPO.md`

### Added
- `docs/revisi/BUBU.md` — Brief front-end: task list, navbar todo, custom icons, catatan API, motivasi
- `docs/revisi/KAIZO.md` — Brief back-end: DB schema lengkap, API spec, bug patterns, motivasi
- `docs/revisi/SORA.md` — Brief full stack lead: pending tasks, arsitektur, rules, log revisi

### Removed
- `docs/BUBU.md` → dipindah & diperbarui ke `docs/revisi/BUBU.md`
- `docs/KAIZO.md` → dipindah & diperbarui ke `docs/revisi/KAIZO.md`
- `docs/SORA.md` → dipindah & diperbarui ke `docs/revisi/SORA.md`
- `docs/Revisi.md` → konten digabung ke masing-masing revisi/
- `docs/ADMIN_BOT_TUTORIAL.md` → dihapus (konten akan pindah ke services/bot README)
- `docs/REVISI/` folder lama → dihapus

## [0.0.7] — 2026-03-10

### Added (Sora)
- `docs/PLAN.md` — Diperbarui: v0.7.0 (real data integration) + v0.8.0 (Discord bot) + v0.9.0 (notif) + v1.0.0 (launch)
- `services/bot/` — Scaffold Discord bot lengkap siap Railway:
  - `src/index.ts` — entry point, Discord client, env validation
  - `src/events/ready.ts` — bot ready handler
  - `src/events/guildMemberUpdate.ts` — role berubah → POST /api/discord/role-sync
  - `src/webhooks/server.ts` — HTTP server (Hono): /health, /webhook/notify, /webhook/role-update, /webhook/discord-event
  - `src/commands/register.ts` — slash commands: /ping, /member, /event
  - `package.json`, `tsconfig.json`, `.env.example`
- `apps/web/src/app/api/bot/notify/route.ts` — Web → trigger bot DM
- `apps/web/src/app/api/bot/announce/route.ts` — Web → trigger bot announce event ke Discord

### Integration Map
- Trakteer webhook → update DB → /api/bot/notify → bot DM user
- Admin ubah role → update DB → bot update role Discord
- Event baru dibuat → /api/bot/announce → bot post ke #event channel
- Discord role berubah → bot → /api/discord/role-sync → update DB
