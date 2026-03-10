# REVISI — BUBU (Front-end Developer)
> Update terakhir: 2026-03-10 · Instruksi dari Sora

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
// Import langsung (paling sering dipakai)
import { DiscordIcon, TikTokIcon, XIcon, InstagramIcon } from "@/components/icons/custom-icons"

// Render dengan className biasa
<DiscordIcon className="h-5 w-5 text-muted-foreground" />

// Import seluruh sosmed Soraku (untuk halaman social/footer)
import { SORAKU_SOCIALS } from "@/components/icons/custom-icons"
SORAKU_SOCIALS.map(({ name, slug, href, icon: Icon }) => (
  <a key={slug} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
    <Icon className="h-5 w-5" />
  </a>
))
```

**Icon yang tersedia:**
| Icon | Slug | Kegunaan |
|------|------|----------|
| `DiscordIcon` | discord | Social, navbar, footer |
| `InstagramIcon` | instagram | Social, footer |
| `FacebookIcon` | facebook | Social, footer |
| `XIcon` | x | Social, footer (bukan Twitter) |
| `TikTokIcon` | tiktok | Social, footer |
| `YouTubeIcon` | youtube | Social, footer |
| `BlueSkyIcon` | bluesky | Social, footer |
| `GoogleIcon` | google | Auth button (login Google) |
| `TrakteerIcon` | trakteer | Donate page |
| `SunoIcon` | suno | Music player |

Kalau butuh icon baru → **kabari Sora**, bukan buat inline SVG sendiri.

### 2. Footer sudah ada — JANGAN dibuat ulang dari nol

Sora sudah buat footer yang bersih di:
```
src/components/layout/footer.tsx
```

Footer ini:
- Pakai `SORAKU_SOCIALS` dari `custom-icons.tsx` — tidak ada inline SVG
- Ada kolom: brand + deskripsi + sosmed, Komunitas, Platform, Legal
- Responsive: grid 2→5 kolom
- Bottom bar dengan copyright

**Tugas Bubu untuk footer:**
- [ ] Pastikan `/public/logo.png` ada (upload logo Soraku ke sana)
- [ ] Review visual — apakah sudah sesuai design system Soraku?
- [ ] Kalau ada yang perlu diubah secara *gaya/visual* → ubah di `footer.tsx`, tapi jangan hapus struktur yang sudah ada

### 3. Lucide untuk semua icon UI
Semua icon fungsional (Bell, Search, User, Settings, LogOut, Menu, X, dll) → pakai Lucide:
```tsx
import { Bell, Search, User, LogOut } from "lucide-react"
```

---

## 🎨 TUGAS UTAMA — Redesign Semua Page

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
