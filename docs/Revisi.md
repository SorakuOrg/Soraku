# SORAKU COMMUNITY — Revisi.md

> Semua perubahan, keputusan, dan revisi dari Riu dicatat di sini.
> Format: tanggal · siapa · apa yang direvisi · alasan

---

## Cara Penggunaan

Setiap kali Riu atau tim melakukan revisi / perubahan keputusan:
- Kaizo otomatis catat di file ini
- Push ke repo bersamaan dengan perubahan terkait
- Kaizo baca file ini di awal setiap sesi "Lanjut Kaizo"

---

## Log Revisi

### 2026-03-10

| # | Dari | Revisi | Keterangan |
|---|------|--------|------------|
| 1 | Riu | Project di-reset dari v1.x → mulai dari v0.0.1 | Bersih dari semua legacy code dan database lama |
| 2 | Riu | Schema pindah dari `public` → `soraku` | Lebih rapi, tidak campur dengan Supabase default |
| 3 | Riu | Nama kolom: lowercase tanpa underscore | Konsistensi naming convention seluruh tabel soraku |
| 4 | Riu | Hapus tabel `user_roles` terpisah | Role langsung di kolom `users.role` + `users.supporterrole` |
| 5 | Riu | Kaizo langsung eksekusi SQL ke Supabase | Tidak perlu Riu jalankan manual lewat SQL Editor |
| 6 | Riu | Kaizo langsung push ke GitHub | Tidak perlu konfirmasi manual dari Riu setiap push |
| 7 | Riu | Kalau ada instruksi "Lanjut Kaizo" → langsung kerjakan | Kaizo baca Revisi.md dulu, lalu lanjut dari PLAN.md |
| 8 | Riu | Payment: Xendit redirect only, tidak ada Stripe | Soraku non-profit, Xendit untuk VIP/VVIP membership |
| 9 | Riu | Bahasa: Indonesia only, tidak ada i18n | Semua UI dan docs dalam Bahasa Indonesia |

---

## Keputusan Arsitektur

| Keputusan | Nilai | Alasan |
|-----------|-------|--------|
| Schema DB | `soraku` | Bukan `public`, lebih terorganisir |
| Naming kolom | lowercase no underscore | `displayname` bukan `display_name` |
| Auth provider | Discord, Google, Email+Password | Tiga provider aktif di Supabase |
| Payment | Xendit | Platform Indonesia, redirect only |
| Role storage | Kolom di `users` | Tidak butuh join tabel tambahan |
| API pattern | Next.js Route Handlers | Di `apps/web/src/app/api/` |
| Response format | `{ data, error }` | Konsisten via `lib/api.ts` |

---

## Catatan Bubu (Front-end)

- Semua query pakai `.schema('soraku')` — wajib
- Types ada di `src/lib/supabase/types.ts`
- Client helper ada di `src/lib/supabase/client.ts` → `db()`
- Instruksi lengkap: `docs/BUBU.md`

---

*File ini dikelola oleh Kaizo. Update setiap ada revisi dari Riu.*

### 2026-03-10 (Sesi Lanjut)

| # | Dari | Revisi | Keterangan |
|---|------|--------|------------|
| 10 | Kaizo | Re-push semua API routes | File sebelumnya ter-overwrite saat Bubu push UI v0.1–v0.6 |
| 11 | Kaizo | Tambah tabel `musictracks` + `donatur` di DB | Dibutuhkan untuk music player dan top donatur page |
| 12 | Kaizo | Route `/api/blog` (bukan `/api/posts`) | Sesuai spec KAIZO.md dari Bubu |
| 13 | Kaizo | Route `/api/agensi` (bukan `/api/vtubers`) | Sesuai spec KAIZO.md dari Bubu |
| 14 | Kaizo | Route `/api/premium/xendit/*` dan `/api/premium/donatur` | Sesuai spec KAIZO.md dari Bubu |
| 15 | Kaizo | Route `/api/music/playlist` — response shape sesuai music player context | Cover pakai emoji fallback jika belum ada |
| 16 | Kaizo | Fix TypeScript error `server.ts` + `middleware.ts` | `cookiesToSet` butuh explicit type `Parameters<CookieMethodsServer['setAll']>[0]` — TypeScript strict mode Vercel |
