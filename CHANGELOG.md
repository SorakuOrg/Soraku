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

## [0.0.8] — 2026-03-10

### Added (Sora — infrastructure & shared lib)
- `services/bot/railway.toml` — Railway deployment config (builder Dockerfile, healthcheck /health)
- `services/bot/Dockerfile` — multi-stage build, Node 20 Alpine, non-root user
- `apps/web/src/components/icons/custom-icons.tsx` — registry SVG icon non-Lucide:
  Discord, Instagram, Facebook, X, TikTok, YouTube, Bluesky, Google, Trakteer, Suno
  Export: SORAKU_SOCIALS (sosmed + href), CUSTOM_ICONS, getIcon(slug), getIconsByCategory()

### Updated (docs instruksi)
- `docs/revisi/BUBU.md` — Instruksi lengkap:
  - Redesign semua halaman (homepage, blog, events, gallery, dll)
  - Halaman baru `/social` — grid sosmed pakai SORAKU_SOCIALS
  - Footer: review Sora punya, pastikan logo.png ada
  - Navbar: tambahan nav items + notification bell + user dropdown
  - Aturan wajib: tidak ada inline SVG baru, semua dari custom-icons.tsx
- `docs/revisi/KAIZO.md` — Tambah instruksi deploy Railway bot:
  - ENV vars Railway + Vercel yang perlu di-set
  - Langkah deploy step-by-step
  - Fitur lanjutan bot (notify format, role ID mapping)
  - Alur Trakteer → DB → Bot → Discord lengkap
  - Reminder: buat /api/premium/trakteer/webhook

---

## SERVICES/BOT — Release History & Feature Plan

### [bot-0.1.0] — 2026-03-10 · First Release 🚀

**Scaffold awal Discord bot Soraku terintegrasi dengan web platform.**

#### Core
- `src/index.ts` — Entry point, Discord.js v14 client, env validation wajib
- `src/events/ready.ts` — Bot online, set activity "Watching Soraku Community 空"
- `src/events/guildMemberUpdate.ts` — Role Discord berubah → POST /api/discord/role-sync ke web

#### HTTP Webhook Server (Hono, port 3001)
- `GET  /health` — Railway healthcheck, return `{ status, bot, uptime }`
- `POST /webhook/notify` — Terima dari web, kirim DM ke user Discord
- `POST /webhook/role-update` — Terima dari web, add/remove role Discord user
- `POST /webhook/discord-event` — Terima dari web, announce event ke channel Discord

#### Slash Commands
- `/ping` — Health check, tampilkan latency bot
- `/member` — Ambil member count dari /api/discord/stats web
- `/event` — List 5 event upcoming dari /api/events web

#### Infrastructure
- `Dockerfile` — Multi-stage build Node 20 Alpine, non-root user `bot`
- `railway.toml` — Railway deployment config, healthcheck, restart policy
- `.env.example` — Template semua ENV vars yang dibutuhkan

#### Fix
- `fix(bot): Dockerfile path error Railway` — Build context Railway = services/bot/,
  semua COPY path diubah relatif (bukan `services/bot/src` → `src`)
  railway.toml dockerfilePath diubah `"services/bot/Dockerfile"` → `"Dockerfile"`

---

### [bot-0.2.0] — PLANNED

#### Fitur
- [ ] Trakteer webhook handler terintegrasi (DM + role update otomatis)
- [ ] Format pesan DM yang proper per event (donasi, approval galeri, role update)
- [ ] Slash command `/donatur` — list top donatur bulan ini
- [ ] Slash command `/info` — info platform Soraku + link

### [bot-0.3.0] — PLANNED

#### Fitur
- [ ] Welcome message saat member baru join server Discord
- [ ] Auto-role `USER` saat member baru join
- [ ] Slash command `/role` — user lihat role mereka sendiri
- [ ] Logging: kirim log aktivitas bot ke channel #bot-log

### [bot-0.4.0] — PLANNED

#### Fitur
- [ ] Reminder otomatis event H-1 dan H-0 ke channel Discord
- [ ] Slash command `/event [nama]` — detail satu event spesifik
- [ ] Slash command `/galeri` — link ke galeri Soraku + stats (jumlah karya)
- [ ] Auto-announce saat konten blog baru dipublish

### [bot-1.0.0] — PLANNED (Launch Ready)

#### Fitur
- [ ] Rate limiting semua webhook endpoint
- [ ] Logging terpusat (Winston atau pino)
- [ ] Unit tests command handler
- [ ] Monitoring uptime (UptimeRobot atau Railway metrics)

## [0.0.9] — 2026-03-10

### Fixed (services/bot)
- `fix(bot): ganti pnpm → npm di Dockerfile` — lockfile `pnpm-lock.yaml` ada di root monorepo,
  tidak ikut ke build context Railway (`services/bot/`). `pnpm install --frozen-lockfile` akan gagal.
  Solusi: pakai `npm install` dan `npm install --omit=dev` langsung tanpa lockfile.
- `fix(bot): tambah @hono/node-server ke dependencies` — `server.ts` import dari `@hono/node-server`
  tapi package belum ada di `package.json`. Build akan gagal saat runtime.
- `fix(bot): hapus @node-fetch/undici` — package tidak dipakai di mana-mana, hapus dari deps.
- `fix(bot): bump version 0.0.1 → 0.1.0` — mencerminkan first working release

## [0.1.0] — 2026-03-10 · Audit & Critical Fix

### Fixed (Sora — Critical Security)
- `fix(middleware): buat src/middleware.ts yang benar`
  **Root cause:** Next.js HANYA membaca `middleware.ts`, bukan `proxy.ts`.
  `proxy.ts` yang sudah ada sama sekali tidak dipanggil — route `/dashboard` dan `/admin`
  **tidak terproteksi** siapapun bisa akses tanpa login.
  **Fix:** Buat `src/middleware.ts` yang re-export `proxy as middleware` dari `proxy.ts`.
  `proxy.ts` tetap ada sebagai logika modular.

### Fixed (Sora — Coding Rule)
- `fix(api): tambah force-dynamic ke 29 API routes`
  Semua API routes di `src/app/api/**` tidak punya `export const dynamic = 'force-dynamic'`.
  Tanpa ini Next.js/Vercel bisa cache response dan data tidak update realtime.
  Fix otomatis ke semua 29 routes: admin/*, agensi/*, auth/*, blog/*, bot/*,
  discord/*, events/*, gallery/*, music/*, notifications/*, premium/*

### Pending → Revisi ke Bubu
- 5 admin pages masih pakai mock data (API routes sudah siap di Kaizo):
  `/admin` `/admin/blog` `/admin/events` `/admin/gallery` `/admin/users`
- `force-dynamic` belum ada di 13 front-end pages
  Detail: lihat `docs/revisi/BUBU.md` section Revisi Dari Sora

### Pending → Catatan ke Kaizo
- Mulai sekarang setiap API route baru wajib `export const dynamic = 'force-dynamic'`
  Detail: lihat `docs/revisi/KAIZO.md` section Revisi Dari Sora

## [0.1.1] — 2026-03-11

### Fixed (Sora)
- `fix(middleware): hapus middleware.ts — konflik dengan proxy.ts di Next.js 16`
  **Root cause:** Next.js 16 pakai `proxy.ts` sebagai middleware, BUKAN `middleware.ts`.
  Commit sebelumnya (0.1.0) Sora buat `middleware.ts` berdasarkan asumsi Next.js versi lama.
  Hasilnya: build Vercel error "Both middleware file and proxy file are detected".
  **Fix:** Hapus `src/middleware.ts`. `proxy.ts` sudah benar dan cukup untuk Next.js 16.

## [0.1.2] — 2026-03-11 · Admin Panel Real Data Fix

### Fixed (Sora — Admin Panel)
- `fix(admin/events): field mismatch DB`
  `starts_at` → `startdate`, `event_type === "online"` → `isonline: boolean`
  
- `fix(admin/gallery): wrong API route untuk approve/reject`
  PATCH ke `/api/gallery/${id}` (tidak ada) → `/api/admin/gallery/${id}` (benar)
  
- `fix(admin/gallery): field mismatch DB`
  `item.category` → `item.tags[0]`, hapus `item.author?.display_name` (tidak ada join)

- `fix(api/gallery): tambah status filter untuk staff`
  Staff sekarang bisa filter `?status=pending|approved|rejected|all`
  Public tetap hanya lihat `approved`

- `fix(admin/page): stats fetch dari 4 endpoint → 1 endpoint /api/admin/stats`
  Sebelumnya baca `blog.total` (undefined) — response API ada di `meta.total`
  Sekarang pakai `/api/admin/stats` yang return semua data dalam 1 request via Promise.all

### Added (Sora)
- `feat(api): POST /api/admin/stats`
  Single endpoint untuk admin dashboard overview:
  blog_count, event_count, gallery_pending, member_count, recent_posts, pending_gallery
  Semua query dijalankan parallel via Promise.all
