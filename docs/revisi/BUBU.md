# BUBU — Revisi & Task List
> Front-end Soraku Community
> Last updated: 2026-03-11

---

## ✅ Sudah Selesai

| Fitur | Keterangan |
|-------|-----------|
| Design system, globals.css | Tokens, animations, glass-card, semua class custom |
| Navbar + Footer | Responsive, dropdown, SORAKU_SOCIALS, mobile accordion |
| Semua halaman publik | Homepage, Blog, Events, Gallery, About, Social, Premium, Donate, Donatur |
| Login / Register redesign | Split layout mascot, OAuth icons, 2-step form |
| Dashboard layout | Sidebar, quick links, stats |
| Admin panel UI (5 halaman) | Dashboard, Blog, Events, Gallery, Users — semua selesai |
| Notification bell | Polling 30s, badge unread count, panel dropdown |
| User dropdown Navbar | Avatar, nama, role, menu Profil/Settings/Admin/Keluar |
| Navbar → real session | IS_LOGGED_IN → fetch /api/auth/me, hapus MOCK_USER |
| Logo mascot navbar + footer | /public/logo.png + logo-full.png |
| force-dynamic 13 halaman | login, register, about, donate, premium, social, upload, admin pages |
| Halaman /social | Grid SORAKU_SOCIALS lengkap |
| /about redesign | Hero 空, stats real-time, marquee, timeline, partnership |
| Profile edit form | Design di `/dashboard/profile` (sebelum dipindah Kaizo) |
| Profile public page | `/profile/[username]` — public view lengkap |

### ✅ Selesai oleh Kaizo (backup tugas Bubu)

| Fitur | Keterangan |
|-------|-----------|
| Profile routing restruktur | `/dash/profile/me` ← edit pribadi, `/profile/[username]` ← publik |
| Hapus `/dashboard/profile` | Dipindah ke `(dashboard)/profile/me/page.tsx` |
| Update semua link | sidebar, quick links, public profile "Edit" button |

---

## 🔜 Task Selanjutnya untuk Bubu

### 1. Form Edit Blog — `/admin/blog/[id]/edit`
Sora sudah buat `/admin/blog/new`. Tinggal bikin versi edit yang **prefill data existing**.

```tsx
// Fetch data dulu, lalu tampilkan form dengan nilai terisi
useEffect(() => {
  fetch(`/api/blog/${id}`)
    .then(r => r.json())
    .then(d => {
      setTitle(d.data.title)
      setSlug(d.data.slug)
      setExcerpt(d.data.excerpt ?? "")
      setContent(d.data.content ?? "")
    })
}, [id])

// Submit ke PATCH /api/admin/blog/[id]
await fetch(`/api/admin/blog/${id}`, {
  method: "PATCH",
  body: JSON.stringify({ title, slug, excerpt, content, coverurl, tags, ispublished })
})
```

### 2. Form Edit Event — `/admin/events/[id]/edit`
Sama seperti form new event, tapi prefill dari `/api/events/{slug}` atau `/api/admin/events`.
Submit ke `PATCH /api/admin/events/[id]`.

### 3. Tombol Edit di tabel Blog & Events
Di `/admin/blog/page.tsx` dan `/admin/events/page.tsx` sudah ada tombol edit dengan ikon `<Edit />`.
Saat ini link ke `/admin/blog/${post.id}/edit` — halaman tersebut belum dibuat.
**Bubu buat halaman edit-nya.**

### 4. About page — /api/stats update response shape
`/api/stats` sekarang return field tambahan dari Kaizo:
```ts
{
  discord_members:  number,  // dari Discord API
  discord_online:   number,  // dari Discord API
  event_count:      number,  // real DB ✅
  post_count:       number,  // real DB (baru) ✅
  member_count:     number,  // real DB (baru) ✅
  founded_year:     number,
}
```
Kalau Bubu mau tampilin `post_count` atau `member_count` di /about, tinggal tambah ke UI.

### 5. Partnership marquee — `/api/partnerships`
Tabel `soraku.partnerships` sudah dibuat Kaizo. API `/api/partnerships` sudah ready.
Response: `[{ id, name, logourl, website, category }]`
Kalau mau tampilin logo partnership di /about marquee, query sudah jalan.

---

## ⚠️ Yang Dibutuhkan Bubu dari Kaizo

| Kebutuhan | Status |
|-----------|--------|
| `GET /api/admin/blog` — list semua post | ✅ Ada |
| `GET /api/blog/[slug]` — detail post by slug | ✅ Ada |
| `PATCH /api/admin/blog/[id]` — update post | ✅ Ada |
| `GET /api/admin/events` — list semua event | ✅ Ada |
| `PATCH /api/admin/events/[id]` — update event | ✅ Ada |

Semua API yang Bubu butuhkan untuk form edit sudah tersedia. Tinggal UI-nya.

---

## 📌 Rules Wajib

- `export const dynamic = 'force-dynamic'` di baris pertama setiap page
- **JANGAN** buat inline SVG — selalu import dari `@/components/icons/custom-icons` atau Lucide
- Icons sosmed: `DiscordIcon`, `InstagramIcon`, `TiktokIcon`, dll dari `custom-icons.tsx`
- Mutations selalu lewat `fetch("/api/...")` — bukan Server Actions
- **JANGAN update versi** — keputusan versi ada di tangan Riu & Sora
- Profile edit sekarang ada di `/dash/profile/me` (bukan `/dashboard/profile`)
