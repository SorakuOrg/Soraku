# REVISI — SORA (Core / Full Stack Lead)
> Update terakhir: 2026-03-10

---

## Identitas

Sora adalah AI Core / Full Stack Lead di tim Soraku — bukan anggota manusia biasa.
Sora membaca file ini di awal setiap sesi, lalu lanjut kerja sesuai status di bawah.

---

## Stack

- Next.js 16 App Router (arsitektur, routing, middleware)
- Supabase (client setup, env, admin client)
- Drizzle ORM + PostgreSQL schema `soraku`
- TypeScript strict mode — semua types harus benar
- Vercel deployment & monitoring
- Turborepo untuk monorepo build

---

## Deployment

| | |
|---|---|
| Production | https://soraku.vercel.app |
| Repo | https://github.com/SorakuCommunity/Soraku |
| Branch | `master` → auto-deploy ke Vercel |
| Vercel project | `prj_xlkSNQGFtoVGd1XmbxqXmqvPkMug` |
| Root Directory | `apps/web` |
| Bot | Railway (folder `/Discord/` di root) |

---

## Pending Tasks Sora

### Urgent
- [ ] **Auth middleware** (`apps/web/src/proxy.ts` atau middleware config)
  - `/dashboard/*` → redirect `/login` jika tidak ada session
  - `/admin/*` → redirect `/login`, atau `/403` jika role < ADMIN
  - Gunakan `@supabase/ssr` createServerClient

- [ ] **Types tambahan** di `packages/types/src/index.ts`:
  ```ts
  Talent { id, name, slug, type, avatar, bio, socials, tags, debut_date }
  Donatur { id, username, avatar, amount, tier, message, created_at }
  ```

- [ ] **Discord stats API** (`/api/discord/stats`)
  - Hit: `GET https://discord.com/api/v10/invites/{code}?with_counts=true`
  - Return: `{ memberCount: number, onlineCount: number }`
  - Cache 60s — `next: { revalidate: 60 }`
  - Env: `NEXT_PUBLIC_DISCORD_INVITE=qm3XJvRa6B`

### Medium
- [ ] **Sitemap dynamic** (`apps/web/src/app/sitemap.ts`)
  - Static routes sudah ada
  - Tambahkan `/blog/[slug]` dan `/events/[slug]` setelah Kaizo selesai API-nya

- [ ] **packages/utils** — helpers yang sudah sering dipakai di apps/web:
  ```ts
  slugify, formatDate, formatRupiah, truncate, generateAvatar
  ```

- [ ] **packages/config** — shared ESLint + tsconfig base

### Low
- [ ] **Performance audit** — Lighthouse 90+ setelah v0.6.0 selesai
- [ ] **Bot migration** — pindah source dari `/Discord/` ke `services/bot/`

---

## Arsitektur apps/web

```
apps/web/src/
├── app/
│   ├── (public)/          ← semua halaman publik (Bubu)
│   ├── (auth)/            ← login, register (Bubu)
│   ├── (dashboard)/       ← user dashboard — protected (Bubu)
│   ├── (admin)/           ← admin panel — ADMIN+ (Bubu)
│   └── api/               ← Route Handlers (Kaizo)
│       ├── auth/
│       ├── blog/
│       ├── events/
│       ├── gallery/
│       ├── agensi/
│       ├── premium/
│       ├── admin/
│       ├── music/
│       └── discord/
├── components/
│   ├── layout/            ← Navbar, Footer
│   ├── icons/             ← custom-icons.tsx (registry SVG non-Lucide)
│   └── ui/                ← shadcn primitives
├── lib/
│   ├── utils.ts           ← cn, helpers
│   └── supabase/
│       ├── client.ts      ← browser client
│       ├── server.ts      ← server client (SSR)
│       └── admin.ts       ← admin client + adminDb()
├── types/
│   └── index.ts           ← local types (akan dimigrasikan ke packages/types)
└── proxy.ts               ← Next.js 16 middleware (menggantikan middleware.ts)
```

---

## Rules Penting (jangan dilanggar)

```ts
// Semua pages wajib
export const dynamic = "force-dynamic"

// Mutations via API routes — BUKAN Server Actions
// ✅ fetch("/api/blog", { method: "POST", body: ... })
// ❌ "use server" + action langsung

// Drizzle untuk semua DB queries
// Supabase Auth untuk sessions

// adminDb() → data queries
// createAdminClient() → auth.admin operations

// Semua DB queries → .schema("soraku")

// Cookie types
import { type CookieOptions } from "@supabase/ssr"

// Git command — hindari trigger CI
git add -A -- ':!.github/workflows/ci.yml'
```

---

## Monorepo Roadmap

Lihat `docs/MONOREPO.md` untuk detail lengkap.

**Urutan pengerjaan:**
1. Selesaikan `apps/web` v0.6.0
2. `packages/utils` + `packages/config`
3. `services/api` — central REST API
4. `packages/auth`
5. `apps/stream`
6. `apps/mobile`

**Aturan arsitektur:**
- `apps/web` JANGAN import langsung dari `services/`
- Semua shared logic ke `packages/`
- Jangan duplicate types — pakai dari `@soraku/types`

---

## Log Revisi Penting

| # | Tanggal | Revisi | Alasan |
|---|---------|--------|--------|
| 1 | 2026-03-10 | Project reset → v0.0.1 | Bersih dari legacy code |
| 2 | 2026-03-10 | Schema `public` → `soraku` | Lebih rapi, tidak campur Supabase default |
| 3 | 2026-03-10 | Hapus `middleware.ts`, pakai `proxy.ts` | Konflik "both middleware and proxy detected" di Next.js 16 |
| 4 | 2026-03-10 | Folder `/Discord/` tetap di root | Bot masih aktif di Railway, belum migrasi ke `services/bot/` |
| 5 | 2026-03-10 | Monorepo scaffold: stream, mobile, packages, services | Sesuai brief Riu di `docs/MONOREPO.md` |
| 6 | 2026-03-10 | Docs restructure: hapus semua kecuali 4 file utama + `revisi/` | Lebih rapi, tim lebih fokus |
