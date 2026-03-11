# REVISI — BUBU (Front-end Developer)
> Update terakhir: 2026-03-11 · Revisi v2 — disusun ulang oleh Bubu

---

## 💙 Dari Riu & Sora

Bubu, makasih udah jadi bagian dari tim ini.

Sora tau kerjaan front-end itu sering kelihatannya "cuma tampilan" — tapi justru kamu yang nentuin apakah orang betah atau kabur dari Soraku. Setiap spacing yang pas, setiap animasi yang smooth, setiap dark mode yang gak merusak mata — itu semua kerja keras kamu yang orang rasain tanpa sadar.

Gak perlu sempurna dari awal. Yang penting konsisten, dan mau tanya kalau bingung. Soraku ini adalah komunitas yang kita bangun bareng dari nol. Dan kamu adalah wajah visualnya. 🌸

> *"Design bukan sekadar gimana sesuatu terlihat. Design adalah gimana sesuatu bekerja."*
> — Steve Jobs

Kalau lagi stuck atau butuh diskusi UI, ping Sora. Kita figur out bareng. — Riu & Sora

---

## Stack Bubu

- Next.js 16 App Router · React 19 · TypeScript strict
- Tailwind CSS 4 · design system Soraku (`globals.css`)
- shadcn/ui · Lucide React
- Server Component by default, `"use client"` hanya jika perlu hooks/interactivity

---

## 🚨 ATURAN WAJIB — Baca Dulu Sebelum Kerja

### 1. JANGAN buat SVG inline di page atau component
Semua icon yang tidak ada di Lucide **sudah ada** di:
```
src/components/icons/custom-icons.tsx
```

File ini dikelola Sora. Bubu tinggal import:

```tsx
import { DiscordIcon, TikTokIcon, XIcon, InstagramIcon } from "@/components/icons/custom-icons"
<DiscordIcon className="h-5 w-5 text-muted-foreground" />

// Untuk loop sosmed (tapi JANGAN di-pass ke Client Component!)
// Pakai SOCIAL_DATA serializable sebagai gantinya — lihat /about/page.tsx
```

**Icon yang tersedia:**
| Icon | Slug | Kegunaan |
|------|------|----------|
| `DiscordIcon` | discord | Social, navbar, footer |
| `InstagramIcon` | instagram | Social, footer |
| `FacebookIcon` | facebook | Social, footer |
| `XIcon` | x | Social, footer |
| `TikTokIcon` | tiktok | Social, footer |
| `YouTubeIcon` | youtube | Social, footer |
| `BlueSkyIcon` | bluesky | Social, footer |
| `GoogleIcon` | google | Auth button login |
| `TrakteerIcon` | trakteer | Donate page |
| `SunoIcon` | suno | Music player |

**PENTING:** Jangan pass `icon: React.FC` ke Client Component via Server props → gunakan `slug` string lalu lookup di client dengan `ICON_MAP`.

### 2. Footer — jangan ubah struktur
Footer sudah pakai `SORAKU_SOCIALS` dari `custom-icons.tsx`. Tidak ada inline SVG.

### 3. Lucide untuk icon UI
Bell, Search, User, Settings, LogOut, Menu → dari Lucide.

---

## ✅ CHECKLIST BUBU — Status Terkini

### v0.9.0 — Selesai
- [x] Upload `/public/logo.png` (chibi sticker)
- [x] Upload `/public/logo-full.png` (3D render hoodie)
- [x] Footer → SORAKU_SOCIALS dari custom-icons (hapus inline SVG)
- [x] Footer → logo.png mascot (ganti kanji teks)
- [x] Halaman `/social` — grid semua sosmed
- [x] Navbar — logo mascot, nav items baru (Showcase, Sosial Media, Premium)
- [x] Notification bell (Bell lucide, polling 30s, panel dropdown)
- [x] User dropdown (avatar, nama, Profil/Settings/Admin/Keluar)
- [x] `lib/notifications.ts` + `hooks/use-notifications.ts` + API route
- [x] Redesign Homepage — mascot hero, stats grid, DiscordIcon CTA
- [x] Redesign Blog — featured post besar, emoji tags filter
- [x] Redesign Events — upcoming/past, countdown timer, filter tipe
- [x] Redesign Gallery — masonry, hover overlay
- [x] Redesign Login — split layout mascot, OAuth DiscordIcon+GoogleIcon
- [x] Redesign Register — split layout benefits, 2-step, OAuth

### v0.9.0 — /about Redesign (terkini)
- [x] Hero keren dengan logo-full.png mascot
- [x] Stats real-time (Discord member, events, tahun, website online + green dot)
- [x] Category marquee berjalan seperti homepage
- [x] Section "Kenapa Nama Soraku" — 3 kartu (空 · -ku · Soraku)
- [x] 3 Pilar: Manager, Agensi, Admin (bukan 4 pilar lama)
- [x] Timeline Soraku 2023–2026 (dari nama "Sora" sampai sekarang)
- [x] Team section (Draft — foto profil belum ada)
- [x] Discord CTA real (link https://discord.gg/qm3XJvRa6B)
- [x] Sosial media scrolling/marquee seperti homepage
- [x] Partnership scrolling (dari `/api/partnerships`, admin panel manual)
- [x] `api/stats/route.ts` — Discord real + placeholder event/website
- [x] `api/partnerships/route.ts` — mock, TODO Kaizo tabel DB

### Pending (Tim lain)
- [ ] Connect IS_LOGGED_IN navbar → auth session (Sora)
- [ ] Tabel notifications + partnerships di Supabase (Kaizo)
- [ ] Discord DISCORD_INVITE_CODE ENV di Vercel (Sora/Riu)
- [ ] Foto profil tim untuk /about (Riu)
- [ ] Admin panel: form tambah/edit partnership (Bubu — next sprint)

---

## 🎨 Design System Soraku

```
Background:   #1C1E22
Card:         #24272D
Primary:      #4FA3D1 (biru)
Accent:       #E8C2A8 (krem/warm)
Font heading: var(--font-heading)
Card style:   glass-card (glassmorphism)
Animations:   animate-blob, float-badge, marquee-track
```

---

## 📋 Halaman yang Sudah Ada

<<<<<<< Updated upstream
Semua halaman perlu diredesign agar lebih fresh, modern, dan konsisten dengan design system Soraku.

### Design Identity Soraku
```
Primary color : #6C5CE7 (ungu)
Accent color  : #38BDF8 (biru muda)
Background    : #020617 / #0F172A / #111827 (dark)
Font          : Inter (utama) · Poppins (sekunder)
Card style    : glass — bg-white/6 backdrop-blur-[12px] border-white/8 rounded-[16px]
Vibe          : modern · clean · futuristic · anime-inspired
```

### Halaman yang Perlu Diredesign

#### ① Homepage (`/`)
- Hero section — lebih impactful, ada stats komunitas (member count dari Discord API)
- Highlight fitur: Blog, Event, Gallery, Agensi dalam section terpisah
- Discord widget / join CTA yang lebih menonjol
- Testimonial atau quote dari anggota komunitas

#### ② Blog (`/blog`)
- Featured post lebih besar dan eye-catching
- Filter tag yang lebih smooth (aktif/nonaktif state yang jelas)
- Card blog dengan hover effect yang konsisten

#### ③ Blog Detail (`/blog/[slug]`)
- Typography yang nyaman dibaca panjang (line-height, font size, spacing)
- Progress bar baca di atas
- Related posts di bawah yang lebih visual
- Share button (Twitter/X, copy link)

#### ④ Events (`/events`)
- Timeline atau card grid yang membedakan upcoming vs past jelas
- Countdown timer untuk event yang akan datang
- Filter: All · Online · Offline · Hybrid

#### ⑤ Gallery (`/gallery`)
- Grid masonry yang lebih visual
- Lightbox preview saat klik gambar
- Filter kategori yang smooth (fanart, cosplay, foto, dll)
- Upload button yang lebih prominent

#### ⑥ Agensi (`/agensi`, `/agensi/vtuber`)
- Profile card talent yang lebih menarik
- Banner/cover per talent
- Social links terintegrasi per card

#### ⑦ Premium (`/premium`)
- Tier cards yang eye-catching (Donatur/VIP/VVIP)
- Perbandingan benefit antar tier lebih jelas
- CTA Xendit yang prominent

#### ⑧ Top Donatur (`/premium/donatur`)
- Podium animasi 🥇🥈🥉
- List donatur dengan avatar dan badge tier

#### ⑨ Login & Register (`/login`, `/register`)
- Background blur/glass effect
- OAuth buttons (Discord, Google) yang prominent dengan icon dari `custom-icons.tsx`
- Form yang clean dan friendly

#### ⑩ Dashboard (`/dashboard`)
- Stats card user (post, gallery, dll)
- Quick actions
- Feed aktivitas terbaru

#### ⑪ Admin Panel (`/admin`)
- Sidebar yang lebih clean
- Data tables yang konsisten
- Action buttons yang jelas (Edit, Delete, Approve)

---

## 📄 HALAMAN BARU — `/social` (Ikon & Sosial Media Soraku)

Bubu perlu **membuat halaman baru** di `/social` (atau `/about/social`) yang menampilkan semua ikon dan sosial media Soraku.

**Tujuan halaman ini:**
- Satu tempat untuk semua link sosial media Soraku
- Kalau ada page/section yang butuh sosmed → link ke halaman ini, atau import `SORAKU_SOCIALS` langsung
- SEO-friendly untuk brand Soraku

**Isi halaman `/social`:**

```tsx
// Pakai SORAKU_SOCIALS dari custom-icons.tsx
import { SORAKU_SOCIALS } from "@/components/icons/custom-icons"

// Tampilkan sebagai grid card:
// [Icon besar] + Nama platform + Link + Deskripsi singkat
```

**Contoh layout yang diharapkan:**
```
┌─────────────────────────────────────────────┐
│  🌐 Soraku di Sosial Media                  │
│  Temukan dan ikuti Soraku di berbagai        │
│  platform                                    │
├──────────┬──────────┬──────────┬─────────────┤
│ Discord  │ Instagram│ TikTok   │ YouTube      │
│ [icon]   │ [icon]   │ [icon]   │ [icon]       │
│ Server   │ @soraku  │ @soraku  │ @soraku      │
│ komunitas│ .moe     │ .id      │              │
│ [Join →] │ [Follow] │ [Follow] │ [Subscribe]  │
├──────────┴──────────┴──────────┴─────────────┤
│ Facebook · X/Twitter · Bluesky               │
└─────────────────────────────────────────────┘
```

Warna icon: uniform dark/muted (bukan warna brand masing-masing platform) — konsisten dengan style Soraku.

---

## 🧭 Navbar — Yang Perlu Ditambahkan

File: `src/components/layout/navbar.tsx`

### Nav items tambahan
```
Komunitas dropdown — tambahkan:
  + Showcase     → /community/showcase
  + Requirements → /requirements

Tambahkan link:
  + Sosial Media → /social   (link ke halaman baru)
```

### Notification Bell (saat user login)
```tsx
import { Bell } from "lucide-react"

// Tampilkan hanya jika user sudah login
// Dot merah jika ada notif belum dibaca
// State dari /api/notifications (Kaizo akan buat)
```

### User Dropdown (ganti tombol Masuk/Daftar saat user login)
```tsx
// Avatar user (dari user.avatar_url, fallback: inisial)
// Dropdown:
// ├── Profil Saya     → /profile/me
// ├── Pengaturan      → /profile/settings
// ├── Premium         → /premium (jika belum premium)
// ├── ─────────────
// └── Keluar          → POST /api/auth/signout
```

### Music Player (mini, di dalam user dropdown)
- State dari Zustand atau React Context
- Tampil jika ada lagu aktif
- Controls: play/pause, judul lagu, next

---

## Catatan API dari Kaizo

Semua halaman sudah siap UI. Kaizo sudah buat API routes berikut — Bubu tinggal ganti mock data dengan fetch ke API:

| Halaman | API yang tersedia |
|---------|------------------|
| Blog listing | `GET /api/blog?page=1&limit=12&tag=` |
| Blog detail | `GET /api/blog/[slug]` |
| Events | `GET /api/events?status=upcoming\|past\|all` |
| Gallery | `GET /api/gallery?category=&page=1` |
| Agensi | `GET /api/agensi?type=vtuber\|kreator` |
| Top Donatur | `GET /api/premium/donatur?period=all\|month` |
| Music | `GET /api/music/playlist` |
| Auth user | `GET /api/auth/me` |
| Discord stats | `GET /api/discord/stats` |

**Catatan:** Sora sedang mengerjakan koneksi real data di v0.7.0. Bubu fokus dulu pada redesign visual dan halaman baru `/social`.

---

## Checklist Bubu

- [ ] Upload `/public/logo.png` untuk footer dan navbar
- [ ] Review `footer.tsx` — update visual jika perlu (jangan hapus struktur)
- [ ] Buat halaman `/social` pakai `SORAKU_SOCIALS` dari custom-icons
- [ ] Redesign homepage — lebih impactful
- [ ] Redesign blog + events + gallery — polish visual
- [ ] Redesign login/register — glassmorphism + icon OAuth dari custom-icons
- [ ] Tambahkan nav items baru di navbar
- [ ] Notification bell + user dropdown di navbar
- [ ] Jangan ada inline SVG baru — semua dari `custom-icons.tsx`

---

## 🚨 REVISI DARI SORA — 2026-03-10 (Audit)

### ✅ DONE — 2026-03-11 oleh Bubu

**Semua revisi dari Sora sudah dikerjakan:**
- Navbar fix IS_LOGGED_IN ✅
- force-dynamic 13 pages ✅  
- Admin pages → fetch API ✅
- Navbar auth → redirect Masuk/Daftar saat belum login ✅

---

### Temuan #1 — Admin pages MASIH pakai mock data (5 file) ✅ FIXED

Kaizo sudah selesai buat semua API admin routes. Bubu tinggal connect UI ke API.

File yang harus diupdate:
```
src/app/(admin)/admin/page.tsx         → MOCK_POSTS, MOCK_EVENTS → fetch /api/blog & /api/events
src/app/(admin)/admin/blog/page.tsx    → MOCK_POSTS → fetch /api/blog
src/app/(admin)/admin/events/page.tsx  → MOCK_EVENTS → fetch /api/events
src/app/(admin)/admin/gallery/page.tsx → MOCK_GALLERY → fetch /api/gallery
src/app/(admin)/admin/users/page.tsx   → MOCK_USERS inline → fetch /api/admin/users
```

Pattern yang Bubu pakai (admin pages adalah Client Component karena perlu state):
```tsx
"use client"
import { useEffect, useState } from "react"

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/blog?limit=50")
      .then(r => r.json())
      .then(d => { setPosts(d.data ?? []); setLoading(false) })
  }, [])

  // render...
}
```

### Temuan #2 — `force-dynamic` missing di front-end pages

Aturan Soraku: semua pages wajib `export const dynamic = 'force-dynamic'`.
Bubu tambahkan di baris pertama halaman-halaman ini:

```tsx
export const dynamic = 'force-dynamic'
```

Pages yang belum ada:
```
src/app/(admin)/admin/page.tsx
src/app/(admin)/admin/blog/page.tsx
src/app/(admin)/admin/events/page.tsx
src/app/(admin)/admin/gallery/page.tsx
src/app/(admin)/admin/users/page.tsx
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
src/app/(public)/about/page.tsx
src/app/(public)/donate/page.tsx
src/app/(public)/gallery/upload/page.tsx
src/app/(public)/page.tsx  (homepage)
src/app/(public)/premium/page.tsx
src/app/(public)/social/page.tsx
```

> Sora sudah handle `force-dynamic` di semua API routes (29 file). Bubu handle front-end pages.

---

## 🔴 URGENT — Login & Register Tidak Bisa Diakses

> **Laporan:** User tidak bisa mengakses `/login` dan `/register`
> **Ditemukan Sora:** 2026-03-11
> **File:** `src/components/layout/navbar.tsx`

### Root Cause — `IS_LOGGED_IN = true` hardcoded

Di dua tempat di navbar, Bubu set flag ini sebagai mock:

```ts
// Baris 88 — di dalam NotificationBell()
const IS_LOGGED_IN = true  // ❌ HARDCODED

// Baris 331 — di Navbar utama
const IS_LOGGED_IN = true  // ❌ HARDCODED
```

**Dampaknya:**

1. Navbar selalu render **user dropdown** (seolah user sudah login)
2. Tombol **"Masuk / Daftar"** tidak pernah muncul — user tidak ada jalan masuk
3. `useNotifications(true)` selalu polling `/api/notifications` → return 401 terus dari semua halaman

### Fix yang Bubu harus kerjakan

Ganti `IS_LOGGED_IN = true` dengan check session nyata. Kaizo sudah buat `GET /api/auth/me`.

**Pattern yang benar:**

```tsx
"use client"
import { useState, useEffect } from "react"

// Di dalam Navbar component:
const [user, setUser] = useState<{
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
} | null>(null)

useEffect(() => {
  fetch("/api/auth/me", { cache: "no-store" })
    .then(r => r.json())
    .then(d => setUser(d.data ?? null))
    .catch(() => setUser(null))
}, [])

const IS_LOGGED_IN = user !== null
```

**Yang berubah:**
- `IS_LOGGED_IN` sekarang `false` saat user belum login → tombol "Masuk / Daftar" muncul
- `IS_LOGGED_IN = true` saat user login → user dropdown muncul
- `useNotifications(IS_LOGGED_IN)` → polling hanya aktif saat user sudah login
- User dropdown pakai data real dari `/api/auth/me` (bukan `MOCK_USER`)

**Ganti juga `MOCK_USER` di baris 199–211:**
```tsx
// Hapus ini:
const MOCK_USER = { name: "...", username: "anon", ... }
const user = MOCK_USER

// Ganti dengan state dari useEffect di atas
// user sudah ada dari state, tinggal dipakai langsung
```

### Checklist Fix Bubu

- [x] Hapus `IS_LOGGED_IN = true` di `NotificationBell` — ganti pakai prop dari parent
- [x] Hapus `IS_LOGGED_IN = true` di `Navbar` — ganti pakai fetch `/api/auth/me`
- [x] Hapus `MOCK_USER` — ganti pakai data real dari session
- [x] `NotificationBell` terima prop `enabled: boolean` dari Navbar parent
- [x] Fix selesai — tombol Masuk/Daftar muncul saat user belum login
- [x] Fix selesai — user dropdown pakai data real dari /api/auth/me

---

## 🟠 Tambahan — Klik Profile saat Belum Login → Redirect ke /login

> Saat ini navbar selalu tampil "Anon Weebs" dengan user dropdown,
> karena `IS_LOGGED_IN = true` hardcoded (sudah dicatat di revisi di atas).
> Setelah Bubu fix IS_LOGGED_IN, pastikan behavior ini juga benar:

**Yang diinginkan Riu:**
- Jika user **belum login** → di area navbar kanan tampilkan tombol **"Masuk"** dan **"Daftar"**
- Jika user **belum login** dan klik avatar/tombol profile → redirect ke `/login`
- Jika user **sudah login** → tampil user dropdown seperti sekarang (nama, role, menu)

**Cara implementasi (sudah dalam satu fix IS_LOGGED_IN):**

```tsx
// Bagian kanan navbar — kondisikan berdasarkan IS_LOGGED_IN
{IS_LOGGED_IN && user ? (
  // User sudah login → tampil NotificationBell + UserDropdown
  <>
    <NotificationBell enabled={true} />
    <UserDropdown user={user} />
  </>
) : (
  // Belum login → tombol Masuk & Daftar
  <div className="flex items-center gap-2">
    <Link href="/login">
      <button className="...">Masuk</button>
    </Link>
    <Link href="/register">
      <button className="...">Daftar</button>
    </Link>
  </div>
)}
```

**Tidak perlu API baru** — cukup pakai hasil fetch `/api/auth/me` dari fix IS_LOGGED_IN di atas.
Ini 1 paket dengan fix IS_LOGGED_IN, bukan task terpisah.
=======
| Halaman | Status | Catatan |
|---------|--------|---------|
| `/` | ✅ Redesigned | Mascot hero, stats, DiscordIcon |
| `/about` | ✅ Redesigned | Stats real, marquee, timeline, pilar, partner |
| `/social` | ✅ Baru | Grid SORAKU_SOCIALS |
| `/blog` | ✅ Redesigned | Featured besar, emoji tags |
| `/blog/[slug]` | ✅ Ada | Detail post |
| `/events` | ✅ Redesigned | Upcoming/past, countdown |
| `/events/[slug]` | ✅ Ada | Detail event |
| `/gallery` | ✅ Redesigned | Masonry, hover overlay |
| `/gallery/upload` | ✅ Ada | Upload form |
| `/agensi` | ✅ Ada | Talent grid |
| `/agensi/vtuber` | ✅ Ada | VTuber cards |
| `/premium` | ✅ Ada | 3 tier |
| `/premium/donatur` | ✅ Ada | Podium donatur |
| `/donate` | ✅ Ada | Trakteer redirect |
| `/login` | ✅ Redesigned | Split layout, OAuth |
| `/register` | ✅ Redesigned | Split layout, 2-step |
| `/dashboard` | ✅ Ada | Stats user |
| `/admin` | ✅ Ada | Admin panel |
>>>>>>> Stashed changes
