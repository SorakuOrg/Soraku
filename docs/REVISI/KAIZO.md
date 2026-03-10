# 📝 REVISI.md — Catatan Revisi & Perubahan

> Dokumen ini mencatat semua revisi desain, perubahan keputusan, dan update dari Riu.
> Format: tanggal · siapa · apa yang berubah · alasan

---

## 10 Maret 2026

### [REV-001] Footer — Redesign total ke layout brand block
**Oleh:** Riu (Owner)
**File:** `apps/web/src/components/layout/footer.tsx`

**Sebelum:**
- Layout 4 kolom grid: Brand · Komunitas · Platform · Sosial Media
- Ikon sosmed berwarna-warni (masing-masing berbeda warna)
- Ada label list di bawah ikon

**Sesudah:**
- Layout satu kolom brand block — simpel dan bersih
- Teks "Made with tea by" di atas
- Logo block: kotak rounded gelap + karakter 空 biru + nama "Soraku" bold
- Deskripsi lengkap komunitas
- Ikon sosmed seragam: bulat, border tipis, warna muted netral, hover biru primary
- Kolom link Komunitas & Platform dihapus dari footer

**Referensi visual:** Screenshot dari Riu (10 Mar 2026)

**Status:** ✅ Diterapkan · commit `fix(ui): footer redesign`

---

### [REV-002] Footer — Logo warna dipertahankan
**Oleh:** Riu (Owner)

**Catatan:** Riu konfirmasi warna logo (karakter 空 berwarna biru primary `#4FA3D1`) tidak perlu diubah, sudah sesuai.

**Status:** ✅ No action needed

---

### [REV-003] Music Player — Ditambahkan ke roadmap
**Oleh:** Bubu (inisiasi dari PLAN.md v0.6.0)
**File:** `apps/web/src/context/music-player.tsx`, `apps/web/src/components/music-player/player-bar.tsx`

**Keputusan implementasi:**
- Persistent di semua halaman via React Context + Providers
- Floating bar di bagian bawah layar (glassmorphism, backdrop blur)
- Fitur: play/pause, next/prev, progress bar, volume hover slider, playlist dropdown
- Minimized mode: pill kecil di pojok kanan bawah
- Audio src masih kosong (mock) — menunggu Kaizo upload ke Supabase Storage
- Playlist mock: 5 lagu anime populer (Silhouette, Gurenge, Unravel, Again, Renai Circulation)

**Yang dibutuhkan dari Kaizo:** `GET /api/music/playlist` → lihat KAIZO.md Priority 5

**Status:** ✅ UI selesai · commit `feat(ui): music player persistent`

---

## 🔮 Revisi yang Mungkin Datang (Pending Konfirmasi Riu)

| Item | Catatan | Status |
|------|---------|--------|
| Logo avatar karakter | Saat ini pakai karakter 空, nanti ganti dengan gambar karakter jika ada | Menunggu aset |
| Warna footer ikon sosmed | Saat ini muted/netral. Kalau mau colorful lagi bisa dikembalikan | Menunggu arahan |
| Kolom link di footer | Dihapus sesuai revisi. Bisa ditambah kembali jika perlu | Menunggu arahan |
| Playlist music player | 5 lagu mock — perlu keputusan Riu soal lagu apa yang diputar | Menunggu arahan |
| Trakteer URL | Hardcoded `trakteer.id/soraku` — perlu konfirmasi URL sudah benar | Menunggu konfirmasi |

---

## 📌 Cara Pakai Dokumen Ini

- Setiap ada perubahan dari Riu atau tim → Bubu/Sora/Kaizo catat di sini
- Format: `[REV-XXX]` dengan nomor urut
- Sertakan file yang berubah, sebelum/sesudah, dan commit reference
- Ini membantu semua tim tahu *kenapa* sesuatu berubah, bukan cuma *apa* yang berubah
