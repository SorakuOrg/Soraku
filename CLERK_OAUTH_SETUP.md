# 🔐 Panduan Setup Login Google & Discord via Clerk

Panduan ini akan memandu kamu step-by-step untuk mengaktifkan login dengan **Google** dan **Discord** di platform Soraku menggunakan **Clerk**.

---

## Daftar Isi

1. [Buat Akun & Project Clerk](#1-buat-akun--project-clerk)
2. [Aktifkan Login Discord](#2-aktifkan-login-discord)
3. [Aktifkan Login Google](#3-aktifkan-login-google)
4. [Konfigurasi di `.env.local`](#4-konfigurasi-di-envlocal)
5. [Konfigurasi untuk Production (Vercel)](#5-konfigurasi-untuk-production-vercel)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Buat Akun & Project Clerk

### Langkah:

1. Buka **https://clerk.com** → klik **"Start building for free"**
2. Daftar dengan email atau GitHub
3. Setelah masuk, klik **"Add application"**
4. Isi **Application name**: `Soraku Community`
5. Di bagian **"How will your users sign in?"**, pilih:
   - ✅ **Discord**
   - ✅ **Google**
   - ✅ **Email** (opsional, sebagai fallback)
6. Klik **"Create application"**

> Clerk akan langsung generate project dan menampilkan API Keys kamu.

### Ambil API Keys:

Setelah project dibuat, kamu akan melihat:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY = sk_test_xxxxxxxxxxxx
```

Simpan dulu, akan dipakai di step 4.

---

## 2. Aktifkan Login Discord

Discord OAuth butuh **Client ID** dan **Client Secret** dari Discord Developer Portal.

### A. Buat Discord Application

1. Buka **https://discord.com/developers/applications**
2. Klik **"New Application"** → beri nama: `Soraku Auth`
3. Klik **"Create"**

### B. Ambil Client ID & Secret

1. Di sidebar kiri, klik **"OAuth2"**
2. Di bagian **"Client Information"**:
   - Copy **CLIENT ID** → simpan
   - Klik **"Reset Secret"** → Copy **CLIENT SECRET** → simpan

### C. Tambahkan Redirect URI

Masih di halaman **OAuth2**, scroll ke bawah ke **"Redirects"**:

1. Klik **"Add Redirect"**
2. Masukkan URL berikut (satu per satu):
   ```
   https://accounts.clerk.dev/v1/oauth_callback
   ```
3. Klik **"Save Changes"**

> ⚠️ Jangan lupa klik **Save Changes**!

### D. Daftarkan ke Clerk

1. Buka **Clerk Dashboard** → **User & Authentication** → **Social Connections**
2. Klik **Discord** → toggle ke **Enabled**
3. Masukkan:
   - **Client ID**: (dari Discord Developer Portal)
   - **Client Secret**: (dari Discord Developer Portal)
4. Klik **Save**

---

## 3. Aktifkan Login Google

Google OAuth butuh setup di **Google Cloud Console**.

### A. Buat Google Cloud Project

1. Buka **https://console.cloud.google.com**
2. Klik dropdown project di atas → **"New Project"**
3. Nama project: `Soraku Community` → **Create**
4. Pastikan project `Soraku Community` sudah dipilih

### B. Aktifkan Google OAuth API

1. Di sidebar, klik **"APIs & Services"** → **"Library"**
2. Cari **"Google+ API"** atau **"Google Identity"**
3. Klik hasil pencarian → klik **"Enable"**

### C. Buat OAuth Credentials

1. Klik **"APIs & Services"** → **"Credentials"**
2. Klik **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Jika diminta, konfigurasi **OAuth consent screen** dulu:
   - **User Type**: External → **Create**
   - **App name**: `Soraku Community`
   - **User support email**: email kamu
   - **Developer contact**: email kamu
   - Klik **Save and Continue** (semua langkah) → **Back to Dashboard**
4. Sekarang buat OAuth client ID:
   - **Application type**: **Web application**
   - **Name**: `Soraku Web`
5. Di bagian **"Authorized redirect URIs"**, klik **"+ ADD URI"**:
   ```
   https://accounts.clerk.dev/v1/oauth_callback
   ```
6. Klik **"Create"**
7. Sebuah popup akan muncul dengan:
   - **Client ID** → copy
   - **Client Secret** → copy

### D. Daftarkan ke Clerk

1. Buka **Clerk Dashboard** → **User & Authentication** → **Social Connections**
2. Klik **Google** → toggle ke **Enabled**
3. Masukkan:
   - **Client ID**: (dari Google Cloud Console)
   - **Client Secret**: (dari Google Cloud Console)
4. Klik **Save**

---

## 4. Konfigurasi di `.env.local`

Buat atau edit file `.env.local` di root project:

```env
# ─── Clerk ───────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# URL Routing Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ─── Supabase ────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ─── Discord ─────────────────────────────────
DISCORD_CLIENT_ID=1234567890123456789
DISCORD_CLIENT_SECRET=abcdefghijklmnop
DISCORD_BOT_TOKEN=MTIzNDU2Nzg...
DISCORD_SERVER_ID=1116971049045729302
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx/xxxxx

# ─── App ─────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAINTENANCE_MODE=false
```

---

## 5. Konfigurasi untuk Production (Vercel)

Saat deploy ke Vercel, ada konfigurasi tambahan yang diperlukan.

### A. Update Redirect URI di Discord

Tambahkan redirect URI production di Discord Developer Portal:
```
https://accounts.clerk.dev/v1/oauth_callback
```
> Ini URI yang sama. Clerk yang menghandle routing-nya.

### B. Update Redirect URI di Google Cloud Console

Tambahkan redirect URI production:
```
https://accounts.clerk.dev/v1/oauth_callback
```

### C. Tambahkan Domain di Clerk

1. **Clerk Dashboard** → **Domains**
2. Klik **"Add domain"**
3. Masukkan domain production kamu: `soraku.vercel.app` (atau domain custom)
4. Ikuti instruksi verifikasi

### D. Set Environment Variables di Vercel

1. Buka **Vercel Dashboard** → pilih project → **Settings** → **Environment Variables**
2. Tambahkan semua variabel dari `.env.local`:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_xxx` | Production |
| `CLERK_SECRET_KEY` | `sk_live_xxx` | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Service key | All |
| `DISCORD_BOT_TOKEN` | Bot token | All |
| `DISCORD_SERVER_ID` | `1116971049045729302` | All |
| `DISCORD_WEBHOOK_URL` | Webhook URL | All |
| `MAINTENANCE_MODE` | `false` | All |

> ⚠️ Untuk production, gunakan **Production API Keys** dari Clerk (bukan test keys).

---

## 6. Troubleshooting

### ❌ Error: "redirect_uri_mismatch" saat login Google

**Penyebab**: URI yang terdaftar di Google Console tidak cocok.

**Solusi**:
1. Pastikan di Google Cloud Console, Authorized redirect URI adalah:
   ```
   https://accounts.clerk.dev/v1/oauth_callback
   ```
2. Jangan ada spasi atau karakter tambahan.

---

### ❌ Error: "invalid_client" saat login Discord

**Penyebab**: Client ID atau Client Secret salah.

**Solusi**:
1. Double-check copy-paste Client ID dan Secret dari Discord Developer Portal.
2. Pastikan tidak ada spasi di awal/akhir.
3. Coba reset Client Secret Discord dan masukkan yang baru.

---

### ❌ Login berhasil tapi redirect ke halaman kosong

**Penyebab**: `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` tidak terset.

**Solusi**: Pastikan di `.env.local`:
```env
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

### ❌ Error: "Clerk: publishable key is not set"

**Penyebab**: Environment variable tidak terbaca.

**Solusi**:
1. Pastikan file bernama `.env.local` (bukan `.env`).
2. Restart dev server setelah edit env: `Ctrl+C` → `npm run dev`.

---

### ❌ User login tapi role tetap 'USER' padahal sudah diubah di Supabase

**Penyebab**: Data user belum di-sync atau cache.

**Solusi**:
1. User logout → login ulang (trigger re-sync ke Supabase).
2. Atau update manual di Supabase:
   ```sql
   UPDATE users SET role = 'MANAGER' WHERE email = 'your-email@example.com';
   ```

---

### ❌ Login Discord tidak muncul di Clerk modal

**Penyebab**: Discord belum di-enable di Clerk Social Connections.

**Solusi**:
1. Clerk Dashboard → **User & Authentication** → **Social Connections**
2. Pastikan Discord toggle = **ON** dan sudah ada Client ID + Secret.

---

## Checklist Akhir

Sebelum production, pastikan semua ini sudah dilakukan:

- [ ] Clerk project dibuat
- [ ] Discord OAuth: Client ID & Secret di Clerk
- [ ] Google OAuth: Client ID & Secret di Clerk
- [ ] `.env.local` diisi lengkap
- [ ] `npm run dev` berhasil
- [ ] Test login Discord di localhost
- [ ] Test login Google di localhost
- [ ] Set env variables di Vercel
- [ ] Tambah domain production di Clerk
- [ ] Deploy ke Vercel
- [ ] Test login di production
- [ ] Set role MANAGER pertama di Supabase

---

*Dibuat untuk Soraku Community Platform v1.0.a1*
