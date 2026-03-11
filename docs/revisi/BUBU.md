# BUBU — Brief & Task List
> From: Sora (Full Stack Lead)
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

---

## 🔴 Revisi Route — WAJIB (dari Riu + Sora, sudah ditetapkan di docs/routes)

Sora sudah kerjakan semua redirect dan pages baru. **Tugas Bubu hanya cleanup + form edit.**

### 1. Hapus file lama yang sudah di-redirect

File ini masih ada tapi routenya sudah di-redirect oleh `proxy.ts`. Tidak akan muncul ke user, tapi perlu dihapus agar codebase bersih.

```
apps/web/src/app/(public)/social/page.tsx          → HAPUS
apps/web/src/app/(public)/premium/donatur/page.tsx → HAPUS (sudah pindah ke /donate/leaderboard)
apps/web/src/app/(public)/agensi/vtuber/page.tsx   → HAPUS (sudah pindah ke /vtubers)
apps/web/src/app/(admin)/                           → HAPUS seluruh folder (sudah pindah ke /dash/admin)
apps/web/src/app/(dashboard)/dashboard/            → HAPUS (legacy, redirect ke /dash)
```

### 2. Audit semua link internal di halaman publik

Cek setiap halaman — kalau masih ada link ke route lama, ganti:

| Link Lama | Ganti Jadi |
|-----------|-----------|
| `href="/social"` | hapus atau `href="/about"` |
| `href="/agensi/vtuber"` | `href="/vtubers"` |
| `href="/premium/donatur"` | `href="/donate/leaderboard"` |
| `href="/admin"` atau `href="/admin/*"` | `href="/dash/admin"` |
| `href="/dashboard"` | `href="/dash/profile/me"` |

Jalankan ini di terminal untuk temukan semua:
```bash
grep -rn 'href="/social\|href="/agensi/vtuber\|href="/premium/donatur\|href="/admin\|href="/dashboard' apps/web/src/app --include="*.tsx"
```

### 3. Form Edit Blog — `/dash/admin/blog/[id]/edit`

Sora sudah buat form **create** di `/dash/admin/blog/new`. Bubu buat versi **edit** yang prefill data existing.

```tsx
// Struktur folder
apps/web/src/app/(dashboard)/dash/admin/blog/[id]/edit/page.tsx

// Fetch data existing dulu
const res = await fetch(`/api/blog/${id}`)
const { data } = await res.json()
// prefill: title, slug, excerpt, content, coverurl, tags, ispublished

// Submit ke PATCH /api/admin/blog/[id]
await fetch(`/api/admin/blog/${id}`, {
  method: "PATCH",
  body: JSON.stringify({ title, slug, excerpt, content, coverurl, tags, ispublished })
})
```

### 4. Form Edit Event — `/dash/admin/events/[id]/edit`

Sama seperti form create event tapi prefill data.

```tsx
// Struktur folder
apps/web/src/app/(dashboard)/dash/admin/events/[id]/edit/page.tsx

// Submit ke PATCH /api/admin/events/[id]
await fetch(`/api/admin/events/${id}`, {
  method: "PATCH",
  body: JSON.stringify({ title, slug, description, startdate, enddate, isonline, location, coverurl, tags, ispublished })
})
```

---

## 📌 Namespace Rules (WAJIB — dari docs/routes/NAMESPACE.md)

> Ini sudah ditetapkan Riu. Jangan buat route di luar ini.

| Jenis | Namespace |
|-------|-----------|
| Halaman publik | `/blog`, `/events`, `/gallery`, `/vtubers`, `/donate`, dll |
| Auth | `/login`, `/register` saja — tidak boleh ada sub-route |
| Dashboard user | `/dash/*` |
| Admin panel | `/dash/admin/*` |
| API | `/api/*` |

**JANGAN buat:**
- `/admin/*` → sudah diganti `/dash/admin/*`
- `/dashboard/*` → sudah diganti `/dash/*`
- `/social` → bukan halaman
- `/premium/donatur` → sudah diganti `/donate/leaderboard`
- `/agensi/vtuber` → sudah diganti `/vtubers`

---

## 📌 Rules Coding (tetap sama)

```ts
export const dynamic = 'force-dynamic'  // baris pertama setiap page.tsx
```

- Import icons dari `@/components/icons/custom-icons` atau Lucide — jangan inline SVG
- Mutations lewat `fetch("/api/...")` — bukan Server Actions

