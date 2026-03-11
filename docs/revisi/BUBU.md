# BUBU — Brief & Task List
> From: Kaizo (Back-end) & Sora (Full Stack Lead)
> Last updated: 2026-03-11

---

## ✅ Sudah Selesai (rekap)

| Fitur | Status |
|-------|--------|
| Design system, globals.css, animasi | ✅ |
| Navbar + Footer + SORAKU_SOCIALS | ✅ |
| Semua halaman publik (homepage, blog, events, gallery, about, donate, premium) | ✅ |
| Login / Register → real API | ✅ |
| Dashboard layout → real session | ✅ |
| Profile /dash/profile/me → CRUD | ✅ |
| Admin panel UI — 5 halaman | ✅ |
| Notification bell polling | ✅ |
| User dropdown Navbar → real session | ✅ |
| force-dynamic semua pages | ✅ |
| Hapus link /social dari Navbar | ✅ |
| Update link VTuber → /vtubers | ✅ |
| Update link Top Donatur → /donate/leaderboard | ✅ |
| Update link Admin → /dash/admin | ✅ |
| Login page: screen "sudah login" | ✅ |

---

## 🔴 Masih Pending — WAJIB Dikerjakan Bubu

### 1. Form Edit Blog — `/dash/admin/blog/[id]/edit`

Tombol "Edit" di tabel admin sudah ada. Tinggal buat halaman formnya.

```
apps/web/src/app/(dashboard)/dash/admin/blog/[id]/edit/page.tsx
```

Prefill dari API, submit ke PATCH:

```tsx
// Ambil data existing untuk prefill
const res = await fetch(`/api/blog/${id}`)
const { data } = await res.json()
// prefill: title, slug, excerpt, content, coverurl, tags, ispublished

// Submit edit
await fetch(`/api/admin/blog/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, slug, excerpt, content, coverurl, tags, ispublished })
})
```

### 2. Form Edit Event — `/dash/admin/events/[id]/edit`

Sama seperti form create event tapi prefill data existing.

```
apps/web/src/app/(dashboard)/dash/admin/events/[id]/edit/page.tsx
```

```tsx
// Ambil data existing untuk prefill
const res = await fetch(`/api/events/${slug}`)
const { data } = await res.json()

// Submit edit
await fetch(`/api/admin/events/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, slug, description, startdate, enddate, isonline, location, coverurl, tags, ispublished })
})
```

---

## 📌 Route Architecture — Status Final

Semua redirect sudah jalan di `proxy.ts`. Bubu tidak perlu buat file lama lagi.

| Route Lama | Status | Pengganti |
|------------|--------|-----------|
| `/social` | ❌ Dihapus | Gunakan icon di Navbar/Footer |
| `/agensi/vtuber` | 🔄 Redirect 301 | `/vtubers` |
| `/premium/donatur` | 🔄 Redirect 301 | `/donate/leaderboard` |
| `/admin/*` | 🔄 Redirect 301 | `/dash/admin/*` |
| `/dashboard` | 🔄 Redirect 301 | `/dash` |

Halaman baru yang sudah ada (Kaizo buat):
- `/vtubers` — listing VTuber
- `/vtubers/[slug]` — detail VTuber (butuh UI polish dari Bubu)
- `/donate/leaderboard` — top donatur
- `/dash/admin/*` — semua admin panel sudah di namespace baru

---

## 📌 Namespace Rules (WAJIB — dari docs/routes/NAMESPACE.md)

> Ditetapkan oleh Riu. Jangan buat route di luar namespace ini.

| Jenis | Namespace |
|-------|-----------|
| Halaman publik | `(public)/` — `/blog`, `/events`, `/gallery`, `/vtubers`, `/donate`, dll |
| Auth | `(auth)/` — `/login`, `/register` saja, tidak boleh ada sub-route |
| Dashboard user | `(dashboard)/dash/*` |
| Admin panel | `(dashboard)/dash/admin/*` |
| API | `api/*` |

**JANGAN buat:**
- `/admin/*` → sudah deprecated, ada redirect otomatis
- `/dashboard/*` → sudah deprecated, ada redirect otomatis
- `/social` → bukan halaman, cukup icon komponen
- `/premium/donatur` → sudah diganti `/donate/leaderboard`
- `/agensi/vtuber` → sudah diganti `/vtubers`

---

## 📌 Rules Coding (tetap sama)

```ts
export const dynamic = 'force-dynamic'  // baris pertama setiap page.tsx
```

- Import icons dari `@/components/icons/custom-icons` atau Lucide — jangan inline SVG
- Mutations lewat `fetch("/api/...")` — bukan Server Actions
- **Jangan** fetch ke API dari Server Component (double round-trip) — query DB langsung pakai `adminDb()`

---

## API yang Tersedia untuk Bubu

Semua sudah ready, tinggal consume dari client side:

| Endpoint | Keterangan |
|----------|-----------|
| `GET /api/blog` | List artikel published |
| `GET /api/blog/[slug]` | Detail artikel (untuk prefill form edit) |
| `PATCH /api/admin/blog/[id]` | Edit artikel |
| `GET /api/events` | List event |
| `GET /api/events/[slug]` | Detail event (untuk prefill form edit) |
| `PATCH /api/admin/events/[id]` | Edit event |
| `GET /api/gallery` | List gallery approved |
| `POST /api/gallery/upload` | Upload karya (butuh login) |
| `GET /api/vtubers` | List semua VTuber |
| `GET /api/vtubers/[slug]` | Detail VTuber per slug |
| `GET /api/profile` | Profil sendiri (butuh login) |
| `PATCH /api/profile` | Update profil (butuh login) |
| `GET /api/stats` | Statistik platform real DB |
| `GET /api/partnerships` | Daftar partner |
| `GET /api/donate` | Data donasi |

---

## Log Revisi

| # | Tanggal | Revisi | Oleh |
|---|---------|--------|------|
| 1 | 2026-03-10 | Project reset → v0.0.1 | Riu |
| 2 | 2026-03-11 | v0.9.0 — Redesign + Navbar auth | Bubu |
| 3 | 2026-03-11 | v1.0 — Login/Register/Profile/Dashboard real | Bubu |
| 4 | 2026-03-11 | Discord + Google OAuth routes | Bubu |
| 5 | 2026-03-11 | Profile page redesign minimalis | Bubu |
| 6 | 2026-03-11 | Route cleanup — semua link lama diupdate | Bubu |
| 7 | 2026-03-11 | Login sudah-login screen | Bubu |
| 8 | 2026-03-11 | Fix OAuth PKCE cookie (bad_oauth_state) | Kaizo |
| 9 | 2026-03-11 | Fix logout (signout tidak hapus cookie) | Kaizo |
| 10 | 2026-03-11 | Re-insert Riu ke soraku.users | Kaizo |
