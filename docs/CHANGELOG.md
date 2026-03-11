# CHANGELOG — Soraku Community Platform
> Riwayat perubahan dari awal hingga sekarang
> Format: `[vX.X.X] — Tanggal · Owner`

---

## [v1.0.1] — 2026-03-11 · Kaizo (backup Bubu + lanjutan)

### Profile Routing — Restruktur (Backup Tugas Bubu)
- **Sebelumnya**: edit profile ada di `/dashboard/profile` — tidak konsisten dengan konsep Soraku
- **Sesudah**: struktur baru sesuai instruksi Riu:
  - `/profile/me` ← Profile Pribadi (edit — pakai dashboard layout + sidebar)
  - `/profile/[username]` ← Profile Publik (tetap seperti sebelumnya)
- Pindah `(dashboard)/profile/page.tsx` → `(dashboard)/profile/me/page.tsx`
- Hapus `(public)/profile/me/page.tsx` (redirect lama — tidak diperlukan lagi)
- Update semua referensi `/dashboard/profile` → `/profile/me`:
  - `(dashboard)/layout.tsx` SIDEBAR_LINKS
  - `(dashboard)/dashboard/page.tsx` quick links
  - `(public)/profile/[username]/page.tsx` edit profile button
  - Navbar sudah benar (`/profile/me`)
- **Versi tidak berubah** — keputusan versi di tangan Riu & Sora

### /api/stats — Real DB (Fix TODO dari Bubu)
- Ganti hard-coded mock count dengan query real ke Supabase:
  - `event_count` → `SELECT COUNT(*) FROM events WHERE ispublished = true`
  - `member_count` → `SELECT COUNT(*) FROM users`
  - `post_count` → `SELECT COUNT(*) FROM posts WHERE ispublished = true`
- Discord member + online count tetap dari Discord Invite API (revalidate 60s)
- Fallback ke 0 jika DB error — tidak crash

### Migration: soraku.partnerships
- Buat tabel `soraku.partnerships` baru di Supabase:
  - Kolom: `id, name, logourl, website, category, isactive, sortorder, createdat, updatedat`
  - RLS: public bisa read (isactive=true), service_role full access
  - Index: `(isactive, sortorder)` untuk query cepat
- `/api/partnerships` sudah siap konsumsi tabel ini (tidak perlu ubah kode)
- Admin bisa tambah partnership via Supabase Dashboard atau admin panel

---

## [v1.0.1] — 2026-03-11 · Bubu

### Profile Page — Total Redesign
- Redesign minimalis modern: layout 2-kolom grid, section cards dengan icon headers
- **Identity Card** di bagian atas: cover banner + avatar float, role badge + supporter badge, nama + username + bio preview, tanggal bergabung
- **Dirty state tracking**: tombol Simpan hanya aktif (biru) jika ada perubahan yang belum disimpan
- **Info Dasar** section: Nama Tampilan, Username (read-only), Bio (max 300 dengan counter), Privacy toggle (publik/privat) dengan animasi pill
- **Foto & Media** section: Avatar URL dengan preview + clear button, Cover URL dengan preview inline + clear button, Account info card (Role, Supporter, Bergabung)
- **Sosial Media** section: 5 fields (Discord, Instagram, X, YouTube, Website) dengan individual clear button per field, grid 3 kolom
- **Actions bar** bawah: Keluar dari akun (kiri) + Lihat Profil + Simpan Perubahan (kanan)
- Semua menggunakan **Lucide icon** — zero emoji
- Toast notification dengan close button, animasi slide-in
- Loading skeleton, error state dengan icon

### Auth — Discord & Google OAuth Routes (sebelumnya belum ada)
- `apps/web/src/app/api/auth/discord/route.ts` — GET redirect ke Supabase Discord OAuth
- `apps/web/src/app/api/auth/google/route.ts` — GET redirect ke Supabase Google OAuth
- Scope Discord: `identify email guilds`

### Auth Callback — Auto OWNER role
- `apps/web/src/app/api/auth/callback/route.ts` diupdate:
  - Upsert user ke `soraku.users` setelah OAuth berhasil (ambil username/displayname/avatarurl dari metadata)
  - Discord ID `1020644780075659356` (Riu) otomatis dapat role `OWNER`
  - Support ENV `OWNER_DISCORD_IDS` untuk tambah owner lain tanpa deploy ulang
  - Graceful: DB error tidak block user dari login

### Login & Register — Real API
- Login: `POST /api/auth/login`, error message dari server, redirect `/dashboard`
- Register: `POST /api/auth/register`, auto-login setelah daftar berhasil, 2-step form
- Dashboard layout: real session dari `GET /api/auth/me`, nama + avatar real, link Admin hanya jika staff

### API `/api/profile` (baru)
- `GET /api/profile` — ambil profile user yang sedang login
- `PATCH /api/profile` — update displayname, bio, avatarurl, coverurl, sociallinks, isprivate

---

## [v0.9.0] — 2026-03-11 · Bubu

### /about — Total Rebuild (Sesuai Spesifikasi Riu)
- Hero dengan `logo-full.png` mascot full-height + kanji 空 giant gradient
- Quote dramatis dari PHILOSOPHY: *"Langit tidak membatasi siapa yang boleh memandangnya."*
- **Stats real-time** (Client Component):
  - Total Member Discord (dari Discord API)
  - Total Event Digelar
  - Tahun Berdiri (2023)
  - Member Online di Website (green dot pulse = Live)
  - CountUp animation saat pertama load
- **Category marquee** berjalan seperti homepage (anime, manga, cosplay, dll)
- **Kenapa nama Soraku** — 3 kartu: `空` (langit) + `-ku` (possesif) + `Soraku` (langitku)
- **3 Pilar** — Manager, Agensi, Admin (bukan 4 pilar generik sebelumnya)
  - Masing-masing dengan gradient, badge role, duties list
- **Timeline Soraku** — 7 milestone dari 2023 s.d. 2026:
  - 2023 Awal: "Lahirnya Sora" (nama awal komunitas)
  - 2023 Mid: Berubah jadi Soraku (+ sufiks -ku)
  - 2023 Akhir: Event pertama
  - 2024 Q1: Platform web lahir, tim inti terbentuk
  - 2024 Q2: Agensi Soraku berdiri
  - 2025 Q1: 500+ member Discord
  - 2026 Now: v1.0 Platform Penuh
- **Team section** (Draft) — 4 cards: Riu/Sora/Bubu/Kaizo dengan badge berwarna
- **Discord CTA** — link real `discord.gg/qm3XJvRa6B`
- **Sosial media scrolling** — marquee cards seperti homepage hero
- **Partnership scrolling** — marquee dari `/api/partnerships` (diisi admin manual)
- `api/stats/route.ts` — Discord real member + fallback mock
- `api/partnerships/route.ts` — mock, schema TODO untuk Kaizo

---

### Homepage Redesign
- Hero visual `logo-full.png` mascot sebagai visual utama desktop
- `DiscordIcon` dari `custom-icons.tsx` (tidak ada inline SVG baru)
- Stats grid 4 kolom (member, event, konten, tahun berdiri)
- Features grid 6 kolom dengan gradient icons per section
- Discord CTA section full-width + Join CTA glassmorphism

### Login Redesign
- Split layout: panel kiri (mascot + quote) + panel kanan (form)
- `DiscordIcon` + `GoogleIcon` dari `custom-icons.tsx`
- OAuth Discord & Google button

### Register Redesign
- Split layout: panel kiri (benefits list + mascot preview) + panel kanan (2-step form)
- `DiscordIcon` + `GoogleIcon` dari `custom-icons.tsx`

### Blog Redesign
- Featured post card lebih besar (area cover 420px)
- Emoji tag filter (✨ Semua · 🎌 Anime · 📚 Manga · dll)
- Search placeholder di header

### Events Redesign
- Section Upcoming vs Selesai terpisah
- Countdown badge "X hari lagi" untuk event < 7 hari
- Filter tipe Online/Offline/Hybrid

### Gallery Redesign
- Masonry 2→4 kolom
- Hover overlay dengan icon ZoomIn
- Upload karya button prominent

### Notification System
- `lib/notifications.ts` — NotifType, NOTIF_CONFIG, MOCK_NOTIFICATIONS
- `hooks/use-notifications.ts` — polling 30 detik, markRead, markAllRead
- `app/api/notifications/route.ts` — GET + PATCH (schema TODO Kaizo)
- **Bukan dari GitHub Discussion** — internal DB Supabase

### Navbar Polish
- Logo `logo.png` mascot dengan hover scale
- Bell icon (Lucide) + badge unread count merah
- Panel dropdown notifikasi (judul, body, timeAgo, mark all read)
- User dropdown (avatar, nama, Profil/Settings/Admin/Keluar)
- Nav items baru: Showcase, Sosial Media → `/social`, Premium

### New Pages
- `/social` — grid semua platform Soraku dari `SORAKU_SOCIALS`
- `/api/stats` — combined stats (Discord + events)
- `/api/partnerships` — data partner (mock, admin panel nanti)

---

## [v0.8.0] — 2026-03-10 · Sora

### Discord Bot (services/bot)
- Fix 3 bug sebelum deploy Railway
- Fix Dockerfile + railway.toml path error

---

## [v0.7.0] — 2026-03-10 · Sora (IN PROGRESS)

### Real Data Integration
- Pattern Server Component query langsung via `db()` dari `@/lib/supabase/server`
- Blog, events, gallery, agensi, donatur → connected ke Supabase

### custom-icons.tsx Registry (Sora)
- `DiscordIcon`, `InstagramIcon`, `FacebookIcon`, `XIcon`
- `TikTokIcon`, `YouTubeIcon`, `BlueSkyIcon`
- `GoogleIcon`, `TrakteerIcon`, `SunoIcon`
- `SORAKU_SOCIALS[]`, `CUSTOM_ICONS[]`
- `getIcon(slug)`, `getIconsByCategory(category)`
- REVISI/BUBU.md dengan aturan wajib penggunaan icon

---

## [v0.6.0] — 2026-03-09 · Bubu

### Polish & Infrastructure
- Music player persistent (React Context + floating PlayerBar)
- `MusicPlayerContext` — DEFAULT_PLAYLIST 5 lagu anime mock
- `PlayerBar` — glassmorphism, progress, volume, playlist panel
- `providers.tsx` — wrap MusicPlayerProvider + PlayerBar
- Sitemap XML — static + dynamic pages
- OG Image meta — layout.tsx (OG, Twitter card, robots)
- Discord stats API — `/api/discord/stats` (fallback mock)

---

## [v0.5.0] — 2026-03-08 · Bubu

### Admin Panel (UI + Mock Data)
- Admin layout — sidebar, protected (middleware active)
- Admin dashboard overview — stats cards, recent posts, pending gallery
- Admin user management UI
- Admin blog CRUD UI — tabel + Edit/Delete
- Admin event CRUD UI — list + Edit/Delete
- Admin galeri moderasi — Approve/Reject per item

---

## [v0.4.0] — 2026-03-07 · Bubu + Kaizo

### Agensi & Premium
- Agensi talent list — grid cards, type badge, socials
- Agensi VTuber page — `/agensi/vtuber`, model type, streams
- Premium page — 3 tier (Donatur/VIP/VVIP) + benefits
- Xendit integration — `/api/premium/xendit/create` + webhook (Kaizo)
- Donate page — Trakteer redirect, how-to, usage
- Top Donatur page — podium 🥇🥈🥉, full list, gold glow

---

## [v0.3.0] — 2026-03-06 · Bubu + Kaizo

### Konten (UI + Mock Data)
- Blog listing — filter tag, featured post, grid
- Blog detail — `/blog/[slug]`, related posts, metadata
- Blog API GET — `/api/blog` + `/api/blog/[slug]` (Kaizo)
- Events listing — upcoming/past, card grid
- Events detail — `/events/[slug]`, Discord CTA
- Events API GET — `/api/events` + `/api/events/[slug]` (Kaizo)
- Gallery grid — masonry layout, filter kategori
- Gallery upload form — drag & drop, preview, form
- Gallery API — `/api/gallery` + `/api/gallery/upload` (Kaizo)
- Loading skeletons — blog, events, gallery
- Error boundaries — blog, events

---

## [v0.2.0] — 2026-03-05 · Bubu + Kaizo

### Auth & User UI
- Supabase project setup (Kaizo) — schema soraku, 15 tabel, RLS aktif
- Login page UI — 2 step + Discord OAuth button
- Register page UI — 2 step form + benefits panel
- Auth middleware — `src/middleware.ts`, role-based protection (Kaizo)
- Dashboard layout + page — sidebar, stats, quick links

---

## [v0.1.0] — 2026-03-04 · Bubu

### Navbar & Footer
- Navbar dropdown Komunitas + Agensi (with desc, mobile accordion)
- Footer 2 kolom + 6 sosmed — Discord, TikTok, FB, IG, Twitter, YouTube
- `/agensi/vtuber` page — VTuber cards + CTA

---

## [v0.0.1] — 2026-03-03 · Tim Soraku

### Foundation
- Monorepo setup — pnpm workspace + Turborepo (Sora)
- Design system / CSS — globals.css, tokens, animations (Bubu)
- Navbar + Footer responsive dark mode (Bubu)
- Homepage — hero blob, badges, marquee (Bubu)
- About page — filosofi, pilar, tim, CTA (Bubu)
- UI primitives — Button, Badge, Avatar, Separator (Bubu)
- Types — User, BlogPost, Event, GalleryItem, Talent, Donatur (Sora)
- 404 page — custom dengan kanji 空 (Bubu)
- Vercel deploy — `soraku.vercel.app` LIVE (Sora)

---

*空 · Soraku Community · Est. 2023*
