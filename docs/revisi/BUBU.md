# BUBU — Brief & Task List
> From: Sora (Full Stack Lead)
> Last updated: 2026-03-11 (v1.0.1)

---

## ✅ Sudah Selesai (rekap lengkap)

| Fitur | Status |
|-------|--------|
| Design system, globals.css, animasi | ✅ |
| Navbar + Footer + SORAKU_SOCIALS | ✅ |
| Semua halaman publik | ✅ |
| Login / Register → real API | ✅ |
| Dashboard layout + profile me | ✅ |
| Admin panel UI — 5 halaman | ✅ |
| Notification bell polling → Realtime | ✅ Sora upgrade |
| Route architecture cleanup | ✅ |
| Login sudah-login screen | ✅ |

---

## 🔴 Pending Bubu — Segera (v1.1.x)

### 1. Halaman Profil Publik `/profile/[username]`

File sudah ada: `app/(public)/profile/[username]/page.tsx`

Perlu UI polish:
- Avatar, displayname, role badge, supporter badge
- Bio, sosial links (Discord, IG, X, YouTube, Website)
- Galeri upload user (query dari `soraku.gallery` filter `userid` + `status='approved'`)
- Handle `isprivate=true` → tampilkan pesan "Profil ini private"
- Handle user tidak ditemukan → `notFound()`

**API yang tersedia:**
```ts
// Sudah ada:
GET /api/users/[username] → data profil publik user
```

### 2. UI Polish VTuber Detail `/vtubers/[slug]`

File sudah ada tapi UI masih plain. Perlu:
- Cover image yang lebih dramatis (gradient overlay)
- Stats: subscriber count, debut date
- Stream status badge (🔴 Live / Offline)
- Social links yang lebih visual (YouTube, Twitter/X)
- "Talent lainnya" section di bawah

### 3. Halaman Admin VTubers — CRUD

Tambah halaman baru:

```
app/(dashboard)/dash/admin/vtubers/page.tsx       ← list + delete
app/(dashboard)/dash/admin/vtubers/new/page.tsx   ← form tambah
app/(dashboard)/dash/admin/vtubers/[id]/edit/page.tsx ← form edit
```

Tambahkan juga di sidebar admin `layout.tsx`:
```tsx
{ href: "/dash/admin/vtubers", label: "VTubers", icon: Star }
```

**API yang perlu Kaizo buat:**
```
GET    /api/admin/vtubers        ← list semua
POST   /api/admin/vtubers        ← tambah baru
GET    /api/admin/vtubers/[id]   ← prefill edit
PATCH  /api/admin/vtubers/[id]   ← update
DELETE /api/admin/vtubers/[id]   ← hapus
```

### 4. Halaman Notifikasi `/notifications`

Navbar sudah ada link ke `/notifications`. Halaman-nya belum ada.

```
app/(public)/notifications/page.tsx
```

Tampilkan semua notifikasi user (bukan hanya 6 terbaru):
- List semua notif dengan tanda isread
- Mark all read button
- Empty state yang bagus

---

## 📌 API yang Tersedia untuk Bubu

| Endpoint | Keterangan |
|----------|-----------|
| `GET /api/blog` | List artikel published |
| `GET /api/admin/blog` | List SEMUA artikel incl draft (staff) |
| `GET /api/admin/blog/[id]` | Detail by ID untuk prefill edit ✨ baru |
| `PATCH /api/admin/blog/[id]` | Edit artikel |
| `GET /api/events` | List event |
| `GET /api/admin/events` | List SEMUA event incl draft (staff) ✨ baru |
| `GET /api/admin/events/[id]` | Detail by ID untuk prefill edit ✨ baru |
| `PATCH /api/admin/events/[id]` | Edit event |
| `GET /api/gallery` | List gallery approved |
| `GET /api/gallery?status=pending` | List pending (admin) |
| `POST /api/gallery/upload` | Upload karya |
| `GET /api/vtubers` | List VTubers |
| `GET /api/vtubers/[slug]` | Detail VTuber |
| `GET /api/profile` | Profil sendiri |
| `PATCH /api/profile` | Update profil |
| `GET /api/users/[username]` | Profil publik user |
| `GET /api/notifications` | List notifikasi user |
| `PATCH /api/notifications` | Mark read |
| `GET /api/stats` | Statistik platform |

---

## 📌 Rules Coding (tetap sama)

```ts
export const dynamic = 'force-dynamic'  // baris pertama setiap page.tsx
```

- Import icons dari `@/components/icons/custom-icons` atau Lucide — jangan inline SVG
- Mutations lewat `fetch("/api/...")` — bukan Server Actions
- **Jangan** fetch ke API dari Server Component — query DB langsung pakai `adminDb()`
- Field DB: `isread` (bukan `read`), `createdat` (bukan `created_at`), `displayname`, `avatarurl`, dll

---

## Log Revisi

| # | Tanggal | Revisi | Oleh |
|---|---------|--------|------|
| 1–9 | 2026-03-10/11 | (lihat CHANGELOG) | Bubu |
| 10 | 2026-03-11 | Update task v1.1.x: profil publik, vtuber detail, admin vtubers, /notifications | Sora |

---

## Update — 2026-03-12 (dari Sora)

### ✅ MDX Support Aktif

`next.config.ts` sudah dikonfigurasi dengan `@next/mdx`. Bubu sekarang bisa:
- Buat file `.mdx` di folder pages untuk konten kaya (artikel, docs)
- Import komponen React langsung di dalam file MDX

### ✅ Image Domains Update

Tambah Google avatar dan GitHub domains ke `next.config.ts`:
- `lh3.googleusercontent.com` — Google OAuth avatars
- `**.githubusercontent.com` — GitHub assets
