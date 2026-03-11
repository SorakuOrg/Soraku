# CHANGELOG — Soraku Community
> Format: [versi] — tanggal · deskripsi singkat

---

## [1.0.0-rc] — 2026-03-11 · Admin Panel Complete

### Added (Sora)
- `admin/blog/new` — form buat artikel: judul, slug auto-generate, excerpt, konten Markdown, cover preview, tags, Draft & Publish
- `admin/events/new` — form buat event: judul, slug auto, deskripsi, tanggal mulai/selesai, toggle Online/Offline + lokasi, cover, tags

### Fixed (Sora)
- `admin/layout` → active state sidebar dengan dot indicator + warna primary; tambah mobile bottom nav (sebelumnya tidak ada di HP)
- `d.total` → `d.meta?.total` di admin blog & users (struktur response API `{ data, meta: { total } }`)
- `api/partnerships` → hapus mock data, fetch dari Supabase, fallback `[]` jika tabel belum ada

---

## [0.9.0] — 2026-03-11 · Admin Real Data + Audit

### Added (Sora)
- `api/admin/stats` — single endpoint dashboard: blog_count, event_count, gallery_pending, member_count, recent_posts, pending_gallery via Promise.all

### Fixed (Sora)
- Admin panel semua 5 halaman connect ke real DB:
  - `/admin` → `/api/admin/stats`
  - `/admin/blog` → `/api/blog` + publish toggle + hapus
  - `/admin/events` → `/api/events` + publish toggle + hapus
  - `/admin/gallery` → approve/reject via `/api/admin/gallery/[id]`
  - `/admin/users` → role dropdown + ban/unban via `/api/admin/users`
- `force-dynamic` diinjeksi ke 29 API routes (semua sebelumnya tidak ada)
- `proxy.ts` → `middleware.ts` dihapus (konflik Next.js 16), `proxy.ts` sudah benar
- `IS_LOGGED_IN = true` di navbar → diganti fetch `/api/auth/me` real session (Bubu)
- Login/register tidak bisa diakses → tombol Masuk/Daftar sekarang tampil saat belum login (Bubu)

---

## [0.8.0] — 2026-03-10 · Discord Bot Scaffold

### Added (Sora)
- `services/bot/` — scaffold lengkap Discord bot: Discord.js v14, Hono HTTP server, Railway-ready
- `services/bot/src/index.ts` — entry point, env validation, Discord client
- `services/bot/src/events/ready.ts` — bot online, set activity
- `services/bot/src/events/guildMemberUpdate.ts` — role berubah → POST /api/discord/role-sync
- `services/bot/src/webhooks/server.ts` — HTTP server port 3001: /health, /webhook/notify, /webhook/role-update, /webhook/discord-event
- `services/bot/src/commands/register.ts` — slash: /ping /member /event
- `services/bot/Dockerfile` — multi-stage Node 20 Alpine, non-root user `bot`
- `services/bot/railway.toml` — Railway deployment config
- `apps/web/src/components/icons/custom-icons.tsx` — SVG icon registry: DiscordIcon, InstagramIcon, TrakteerIcon, SORAKU_SOCIALS, dll

### Fixed (Sora)
- Dockerfile path error Railway: `COPY services/bot/src` → `COPY src` (relatif ke build context)
- railway.toml: `dockerfilePath: "services/bot/Dockerfile"` → `"Dockerfile"`
- package.json bot: tambah `@hono/node-server`, hapus `@node-fetch/undici` yang tidak dipakai

---

## [0.7.0] — 2026-03-10 · Real Data Integration

### Added (Kaizo)
- Semua halaman publik connect ke Supabase real data: blog, events, gallery, agensi, donatur, music, dashboard
- `/api/premium/trakteer` — webhook handler: update DB + insert notif + trigger bot DM + update Discord role
- `/api/auth/login` + `/api/auth/register` — auth endpoints lengkap
- `/api/notifications` — GET list + PATCH mark-as-read
- Sitemap dynamic dari real DB

---

## [0.5.0 → 0.6.0] — 2026-03-10 · UI Redesign

### Added (Bubu)
- Redesign total: homepage, blog, events, gallery, login, register, about, social
- Navbar: real session auth, notification bell, user dropdown, mobile menu
- Footer: logo mascot, SORAKU_SOCIALS icons
- Halaman /social: grid semua platform
- force-dynamic di 13 front-end pages

---

## [0.0.1 → 0.4.0] — 2026-03-10 · Foundation → Premium

### Foundation (semua tim)
- Monorepo pnpm + Turborepo (Sora)
- Design system, CSS tokens, animations (Bubu)
- Semua halaman publik (Bubu)
- Supabase schema 15 tabel + RLS (Kaizo)
- Semua API routes GET + admin CRUD (Kaizo)
- Auth middleware proxy.ts (Kaizo)
- Xendit integration (Kaizo)
- Deploy Vercel live (Sora)

---

## SERVICES/BOT — Release History

### [bot-0.1.0] — 2026-03-10 · First Release
- Scaffold lengkap: Discord client, webhook server, slash commands
- Dockerfile + railway.toml siap deploy
- Fix: path error Railway (COPY services/bot/src → COPY src)
- Fix: tambah @hono/node-server ke package.json
- Fix: hapus @node-fetch/undici yang tidak dipakai

### [bot-0.2.0] — PLANNED
- Trakteer webhook → DM format proper
- Slash /donatur, /info
- Welcome message member baru

### [bot-1.0.0] — PLANNED
- Rate limiting webhook endpoints
- Logging terpusat
- Unit tests command handler
