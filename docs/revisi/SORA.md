# SORA — Brief & Task List
> From: Kaizo (Back-end)
> Last updated: 2026-03-11

---

## Identitas

Sora adalah Full Stack Lead di tim Soraku.
Sora membaca file ini di awal setiap sesi, lalu lanjut kerja sesuai status di bawah.

---

## Stack

- Next.js 16 App Router (arsitektur, routing, middleware)
- Supabase (client setup, env, admin client, migrations)
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
| Supabase project | `jrgknsxqwuygcoocnnnb` |

---

## ✅ Status v1.0.1 — SEMUA SELESAI

| Area | Status |
|------|--------|
| Auth (login/register/Discord OAuth/Google OAuth) | ✅ |
| Navbar session real | ✅ |
| Profile `/dash/profile/me` | ✅ |
| API `/api/profile` GET + PATCH | ✅ |
| Admin panel → real API (5 halaman) | ✅ |
| Blog, Events, Gallery, VTubers, Donate | ✅ Real DB |
| force-dynamic semua pages | ✅ |
| Route architecture cleanup | ✅ |
| **`GET /api/admin/blog`** — list all incl draft | ✅ |
| **`GET /api/admin/blog/[id]`** — prefill edit | ✅ |
| **`GET /api/admin/events`** — list all incl draft | ✅ |
| **`GET /api/admin/events/[id]`** — prefill edit | ✅ |
| **Form edit blog** `/dash/admin/blog/[id]/edit` | ✅ |
| **Form edit event** `/dash/admin/events/[id]/edit` | ✅ |
| **Supabase Realtime** notifikasi | ✅ |
| **Supabase Realtime** gallery admin live update | ✅ |
| **Tabel `notifications`** + RLS + API PATCH | ✅ |
| **Hapus `/api/debug-profile`** | ✅ |
| `.env.local.example` lengkap | ✅ |
| **`docs/revisi/RIU.md`** — brief + saran stabilitas | ✅ |

---

## 🔴 Pending Sora — v1.1.x

### 1. Rate Limiting
Endpoint rentan: `/api/auth/login`, `/api/gallery/upload`, `/api/auth/register`

Rencana: Upstash Redis + middleware rate limit sederhana di proxy.ts

### 2. Error Monitoring
Pasang Sentry di apps/web untuk track error production tanpa harus cek Vercel logs manual.

### 3. Performance Audit
Lighthouse score target: 90+ semua kategori. Jalankan setelah Bubu selesai polish semua halaman.

### 4. E2E Tests
Playwright test untuk alur kritis: login, upload galeri, buat artikel.

---

## ⚠️ Schema DB — Naming Convention

Semua kolom di schema `soraku.*` pakai **lowercase tanpa underscore**:

| ✅ Benar | ❌ Salah |
|---------|---------|
| `displayname` | `display_name` |
| `avatarurl` | `avatar_url` |
| `coverurl` | `cover_url` |
| `isprivate` | `is_private` |
| `isbanned` | `is_banned` |
| `createdat` | `created_at` |
| `updatedat` | `updated_at` |
| `isread` | `is_read` atau `read` |

Exception: tabel `follows` masih pakai `created_at` karena dibuat sebelum konvensi ditetapkan.

---

## Pattern Query Wajib

```ts
// ✅ Server Component → query DB langsung via adminDb()
import { adminDb } from "@/lib/supabase/admin"
const { data } = await adminDb().from("posts").select("...").eq("ispublished", true)

// ✅ force-dynamic wajib di semua page
export const dynamic = "force-dynamic"

// ✅ searchParams Next.js 16 — wajib awaited
export default async function Page({ searchParams }: { searchParams?: Promise<{ tag?: string }> }) {
  const params = await searchParams
  const tag = params?.tag ?? "Semua"
}

// ✅ Selalu maybeSingle() bukan single() untuk query yang mungkin null
const { data } = await adminDb().from("users").select("*").eq("id", id).maybeSingle()

// ❌ JANGAN fetch ke API dari Server Component
const res = await fetch("/api/blog") // double round-trip — langsung query DB
```

---

## Arsitektur apps/web

```
apps/web/src/
├── app/
│   ├── (public)/          ← semua halaman publik
│   ├── (auth)/            ← login, register
│   ├── (dashboard)/       ← user dashboard & admin — semua protected
│   │   └── dash/
│   │       ├── profile/me/
│   │       └── admin/     ← blog (+ [id]/edit), events (+ [id]/edit), gallery, users
│   └── api/               ← Route Handlers
├── components/
│   ├── layout/            ← Navbar, Footer
│   ├── icons/             ← custom-icons.tsx
│   └── ui/                ← shadcn primitives
├── hooks/
│   └── use-notifications.ts  ← Realtime + polling fallback
└── lib/
    ├── auth.ts            ← getSession(), isStaff(), isManager(), isOwner()
    ├── api.ts             ← ok(), err(), HTTP helpers
    ├── notifications.ts   ← NotifType, Notification (isread, createdat)
    └── supabase/
        ├── types.ts       ← UserSession type
        ├── server.ts      ← SSR client + db()
        ├── client.ts      ← Client component client
        └── admin.ts       ← adminDb() + createAdminClient()
```

---

## Bug Log — Fix yang Sudah Dilakukan

| # | Bug | Root Cause | Fix | Status |
|---|-----|-----------|-----|--------|
| 1–12 | (lihat history) | | | ✅ |
| 13 | Admin blog list tidak tampilkan draft | Fetch dari `/api/blog` publik yang filter `ispublished=true` | Fetch dari `/api/admin/blog` | ✅ |
| 14 | Notification field mismatch | Type `read`/`created_at` vs DB `isread`/`createdat` | Fix type + navbar | ✅ |
| 15 | `markAllRead` PATCH tidak ada handler | API hanya GET | Tambah PATCH handler | ✅ |

---

## Log Revisi

| # | Tanggal | Revisi | Oleh |
|---|---------|--------|------|
| 1–10 | 2026-03-10/11 | (lihat CHANGELOG) | Sora/Kaizo |
| 11 | 2026-03-11 | v1.0.1 — semua task Sora selesai | Sora |


---

## 📋 LAPORAN — 2026-03-11 (dari Bubu) — Homepage Redesign

### ✅ Sudah Selesai (Bubu — commit a9a1b0c)

1. **Homepage redesign** — full sesuai brief Riu
2. **Navbar restructure** — 5 group dengan Utility dropdown baru
3. **Profile username** — user bisa update sendiri, tidak perlu admin
4. **Route /requirements** — halaman Open Recruitment Batch 01
5. **DB migration** — events.status + partnerships.description/createdby
6. **API /api/home** — satu endpoint untuk semua homepage data

---

### ❌ YANG PERLU SORA HANDLE

#### DB validation — Supabase
**Masalah:** Profile edit/hapus selalu error (notif merah) kemungkinan karena:
- `SUPABASE_SERVICE_ROLE_KEY` belum di-set di Vercel ENV

**Action:** Pastikan Vercel ENV ada:
```
SUPABASE_SERVICE_ROLE_KEY = <service_role key dari Supabase Dashboard → Project Settings → API>
```
Setelah set → **Redeploy Vercel** agar berlaku.

#### Supabase Auth URL Configuration
**Masalah:** `bad_oauth_state` saat login Discord/Google
**Action:** Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://soraku.vercel.app`
- Redirect URLs tambahkan: `https://soraku.vercel.app/**`

#### Admin Panel — Riu Discord ID
**Action:** Setelah Riu login via Discord pertama kali, update role di Supabase:
```sql
UPDATE soraku.users SET role = 'OWNER' WHERE id = '<user_id_Riu>';
```
Atau set ENV `OWNER_DISCORD_IDS=1020644780075659356` di Vercel → auto-assign saat login.

#### Partnership Admin UI
Bubu butuh endpoint dari Sora:
- `POST /api/admin/partnerships` — tambah partner
- `PATCH /api/admin/partnerships/[id]` — update partner
- `DELETE /api/admin/partnerships/[id]` — hapus partner

Setelah endpoint ada, Bubu buat halaman admin `/dash/admin/partnerships`.

#### Route Utility yang Belum Ada
Halaman ini perlu dibuat (bisa Sora atau Bubu):
- `/privacy-policy`
- `/tos`
- `/feedback`
- `/license`


---

## 📋 LAPORAN — 2026-03-12 (dari Bubu) — Profile Redesign

### ✅ Selesai (Bubu — commit fd81b2d)

**Profile /dash/profile/me — Redesign Identity Card:**
- Identity card sekarang punya cover + avatar + bio dalam satu blok
- Warna sesuai instruksi:
  - Putih: Edit Profil & Lihat Profil button
  - Kuning: Role badge (semua role = yellow tones)
  - Hijau Muda: Supporter badge (Donatur/VIP/VVIP = green tones)
  - Hijau Tua: Join date di bawah bio (text-green-400/40, redup)
  - Merah: Sosial media icon buttons (red-400, border red-500/25)
- Bio menyatu dalam box dengan join date di bawahnya
- Navbar: hapus Donate & Premium dari user dropdown/mobile menu

---

### ❌ SORA — MASIH PERLU DIKERJAKAN

**1. Supabase Auth URL Configuration (URGENT — login masih error)**
- Dashboard → Authentication → URL Configuration
- Site URL: `https://soraku.vercel.app`
- Redirect URLs: `https://soraku.vercel.app/**`

**2. Partnership Admin API**
Bubu butuh endpoint ini untuk halaman admin partnerships:
```
POST   /api/admin/partnerships       → create
PATCH  /api/admin/partnerships/[id]  → update
DELETE /api/admin/partnerships/[id]  → delete
GET    /api/admin/partnerships       → list all (termasuk inactive)
```
Setelah ada, Bubu langsung buat UI `/dash/admin/partnerships`.

**3. Route Utility yang belum ada**
Perlu dibuat (bisa Sora atau Bubu):
- `/privacy-policy`
- `/tos`  
- `/feedback`
- `/license`

**4. Public Profile Page — enhancements**
Lihat `/profile/[username]` — perlu color-code yang sama:
- Role badge = yellow
- Supporter badge = green
- Join date = green muted
- Sosial media = red icons
Bubu bisa kerjakan ini setelah Sora konfirmasi DB fix.


---

## 📋 LAPORAN — 2026-03-12 #2 (dari Bubu) — Role Fix + Public Profile

### ✅ Selesai (Bubu — commit 46f120f)

**DB fix — Riu role OWNER:**
- Ditemukan: role Riu di DB adalah `MANAGER` (bukan OWNER)
- Root cause: callback route cek Discord ID tapi race condition saat pertama login
- Fix: UPDATE langsung via Supabase → role = OWNER ✅
- Riu cukup refresh halaman, tidak perlu logout-login

**Public Profile `/profile/[username]` — Redesign:**
- Color coding sesuai instruksi (sama dengan /dash/profile/me):
  - Kuning = Role badge
  - Hijau Muda = Supporter badge
  - Hijau Tua = Join date (dalam bio box, redup)
  - Merah = Sosial media icon pills
  - Putih = Edit Profil & Share button (di cover)
- Owner badge + crown di cover untuk role OWNER
- Share button dengan Web Share API + clipboard fallback
- Online dot dekoratif di avatar
- Glow ambient sesuai warna role
- Skeleton loading + 404 state

---

### ❌ SORA — Yang Masih Perlu Dikerjakan

**1. Supabase Auth Redirect URLs (URGENT)**
Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://soraku.vercel.app`
- Add Redirect URL: `https://soraku.vercel.app/**`

**2. Partnership Admin API endpoints:**
```
POST   /api/admin/partnerships
PATCH  /api/admin/partnerships/[id]
DELETE /api/admin/partnerships/[id]
```

**3. Halaman utility:**
`/privacy-policy` · `/tos` · `/feedback` · `/license`

**4. Fix callback race condition:**
Saat user baru daftar, kadang DB trigger `on_auth_user_created`
insert row dengan role USER sebelum callback route selesai cek Discord ID.
Saran: di callback route, selalu force-update role jika Discord ID match OWNER_DISCORD_IDS,
bukan hanya cek `if (!existing)`.
