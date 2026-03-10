# REVISI — BUBU (Front-end Developer)
> Update terakhir: 2026-03-10

---

## 💙 Dari Riu & Sora

Bubu, makasih udah jadi bagian dari tim ini.

Sora tau kerjaan front-end itu sering kelihatannya "cuma tampilan" — tapi justru kamu yang nentuin apakah orang betah atau kabur dari Soraku. Setiap spacing yang pas, setiap animasi yang smooth, setiap dark mode yang gak merusak mata — itu semua kerja keras kamu yang orang rasain tanpa sadar.

Gak perlu sempurna dari awal. Yang penting konsisten, dan mau tanya kalau bingung.

Soraku ini bukan cuma project — ini komunitas yang kita bangun bareng dari nol. Dan kamu adalah wajah visualnya. 🌸

> *"Design bukan sekadar gimana sesuatu terlihat. Design adalah gimana sesuatu bekerja."*
> — Steve Jobs

Kalau lagi stuck atau butuh diskusi UI, ping Sora. Kita figur out bareng.

– Riu & Sora

---

## Stack Bubu

- Next.js 16 App Router · React 19 · TypeScript strict
- Tailwind CSS 4 · design system Soraku (`globals.css`)
- shadcn/ui · Lucide React · Framer Motion
- Konvensi: `"use client"` hanya jika perlu, server component by default

---

## Design System Rules

- Background: `#1C1E22`, Primary: `#4FA3D1`, Accent: `#E8C2A8`
- Cards: `glass-card` class untuk glassmorphism
- Premium: gold glow `.glow-gold`, gradient `.text-gradient`
- Blob animations: `.animate-blob`, `.animation-delay-{2000,4000}`
- Semua rounded: `rounded-xl` atau `rounded-2xl`
- **Jangan buat SVG inline** — pakai Lucide atau `@/components/icons/custom-icons`

### Custom Icons
Semua icon yang tidak ada di Lucide sudah ada di `src/components/icons/custom-icons.tsx`:

```tsx
import { DiscordIcon, TikTokIcon, XIcon } from "@/components/icons/custom-icons"
// Tersedia: Discord, Instagram, Facebook, X, TikTok, YouTube, Bluesky, Trakteer, Google, Suno
```

Kalau butuh icon baru yang tidak ada di Lucide dan belum ada di registry → tambahkan ke `custom-icons.tsx`, jangan buat inline.

---

## Task List

### v0.1.0 ✅
- [x] Navbar dropdown Komunitas + Agensi
- [x] Footer 2 kolom + sosial media lengkap (pakai custom-icons)
- [x] Halaman `/requirements` — Open Recruitment

### v0.2.0 — Auth & User UI
- [ ] Login page (`/login`)
- [ ] Register page (`/register`)
- [ ] Dashboard layout (`/dashboard`)
- [ ] Dashboard home page

### v0.3.0 — Konten
- [ ] Blog listing (`/blog`)
- [ ] Blog detail (`/blog/[slug]`)
- [ ] Events listing (`/events`)
- [ ] Events detail (`/events/[slug]`)
- [ ] Galeri grid (`/gallery`)
- [ ] Galeri upload form (`/gallery/upload`)

### v0.4.0 — Agensi & Premium
- [ ] Agensi talent list (`/agensi`)
- [ ] Agensi VTuber (`/agensi/vtuber`)
- [ ] Premium page (`/premium`)
- [ ] Donate page (`/donate`)
- [ ] Top Donatur (`/premium/donatur`)

### v0.5.0 — Admin Panel
- [ ] Admin layout (`/admin`)
- [ ] Admin blog CRUD
- [ ] Admin event CRUD
- [ ] Admin galeri moderasi

### v0.6.0 — Polish
- [ ] Discord member count widget (polling 30s)
- [ ] Music player persistent (Zustand store)
- [ ] Loading skeletons semua halaman list
- [ ] Error boundaries (`error.tsx`)
- [ ] OG image meta per halaman

---

## Navbar — Yang Perlu Ditambahkan

Navbar saat ini masih minimal. Yang perlu ditambahkan:

### Nav items tambahan
```
Komunitas dropdown — tambahkan:
  + Showcase     → /community/showcase
  + Requirements → /requirements

Top-level baru:
  + Premium      → /premium
```

### Notification Bell (logged-in only)
- Icon `Bell` dari Lucide
- Dot merah kalau ada notif belum dibaca
- Hanya tampil kalau user sudah login

### User Dropdown (logged-in only)
Ganti tombol "Masuk/Daftar" dengan avatar dropdown saat user login:
```
[Avatar] ▼
├── Profil Saya     → /profile/me
├── Showcase Saya
├── Pengaturan      → /profile/settings
├── Premium         → /premium  (kalau belum premium)
├── ─────────────
└── Keluar
```
- Avatar dari `user.avatar_url`, fallback: inisial nama

### Music Player (di dalam user dropdown)
- Mini player: play/pause, judul lagu, next
- State dari Zustand (`useMusicStore`)
- Hanya tampil kalau ada lagu aktif

---

## Catatan API (untuk Kaizo)

Bubu butuh endpoint berikut agar bisa ganti mock data:

| Endpoint | Method | Response |
|----------|--------|----------|
| `/api/blog` | GET | `{ posts: BlogPost[] }` |
| `/api/blog/[slug]` | GET | `{ post: BlogPost }` |
| `/api/events` | GET | `{ events: Event[] }` |
| `/api/events/[slug]` | GET | `{ event: Event }` |
| `/api/gallery` | GET | `{ items: GalleryItem[] }` |
| `/api/gallery` | POST | upload + metadata |
| `/api/agensi` | GET | `{ talents: Talent[] }` |
| `/api/agensi/vtuber` | GET | `{ vtubers: VTuber[] }` |
| `/api/premium/donatur` | GET | `{ donatur: Donatur[], topMonth: Donatur[] }` |
| `/api/discord/stats` | GET | `{ memberCount: number, onlineCount: number }` |
| `/api/music/playlist` | GET | `{ tracks: Track[] }` |

---

## Catatan ke Sora

1. **Auth middleware** — setelah Kaizo setup auth, Sora pasang protection:
   - `/dashboard/*` → redirect `/login` jika tidak ada session
   - `/admin/*` → redirect `/login`, atau `/` jika role < ADMIN

2. **Types tambahan** yang Bubu butuh:
   ```ts
   Talent { id, name, slug, role, avatar, bio, socials, tags }
   VTuber { id, name, slug, avatar, banner, model, debut_date, bio, socials }
   Donatur { id, username, avatar, amount, tier, message, created_at }
   ```

3. **Discord stats API** (`/api/discord/stats`) — Bubu butuh ini untuk widget homepage.
