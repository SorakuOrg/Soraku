# 🔄 Migration Guide — Update Repo GitHub ke v1.0.a1

Panduan ini untuk meng-update repo GitHub Soraku yang sudah ada (`SorakuCommunity/Soraku`) dengan fitur-fitur baru dari versi 1.0.a1.

---

## Strategi: Selective File Replacement

Karena repo lama sudah punya struktur sendiri, kita **tidak replace semua file** — hanya file yang perlu diupdate atau ditambahkan.

---

## Langkah 1 — Clone Repo Lama

```bash
git clone https://github.com/SorakuCommunity/Soraku.git
cd Soraku
```

---

## Langkah 2 — Buat Branch Baru

```bash
git checkout -b feature/v1.0.a1-update
```

---

## Langkah 3 — Update package.json

Ganti isi `package.json` dengan yang berikut (React 19 + Next.js 15 + Clerk v6):

```json
{
  "name": "soraku",
  "version": "1.0.0-a1",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@clerk/nextjs": "^6.0.0",
    "@supabase/supabase-js": "^2.43.0",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.469.0",
    "next": "15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hot-toast": "^2.4.1",
    "tailwind-merge": "^2.3.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/uuid": "^9.0.8",
    "autoprefixer": "^10.0.1",
    "eslint": "^9",
    "eslint-config-next": "15.1.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

Lalu install ulang:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Langkah 4 — Copy File dari Soraku.zip

Dari file `Soraku.zip` yang sudah didownload, copy file-file berikut ke repo lama:

### ✅ File yang HARUS diganti (critical updates):

| File | Alasan |
|------|--------|
| `middleware.ts` | Update untuk Clerk v6 |
| `next.config.ts` | Tambah Google & Clerk image domain |
| `src/app/layout.tsx` | Clerk v6 appearance + Google OAuth styling |
| `src/lib/supabase.ts` | Types baru (EventRow + SettingRow lengkap) |
| `src/lib/clerk.ts` | Helper functions update |
| `src/lib/discord.ts` | Caching fix |
| `src/lib/roles.ts` | Permission map lengkap |
| `src/lib/utils.ts` | Helper functions |

### ✅ Halaman baru yang perlu DITAMBAHKAN:

| File | Fitur |
|------|-------|
| `src/app/vtuber/page.tsx` | VTuber index page |
| `src/app/vtuber/[generation]/page.tsx` | VTuber per generasi |
| `src/app/vtuber/[generation]/[slug]/page.tsx` | Detail VTuber |
| `src/app/admin/page.tsx` | Admin panel dashboard |
| `src/app/admin/blog/page.tsx` | Blog CRUD |
| `src/app/admin/events/page.tsx` | Events CRUD |
| `src/app/admin/vtuber/page.tsx` | VTuber CRUD |
| `src/app/admin/gallery/page.tsx` | Gallery approval |
| `src/app/admin/users/page.tsx` | User management |
| `src/app/admin/settings/page.tsx` | Maintenance toggle |
| `src/app/maintenance/page.tsx` | Maintenance page |
| `src/app/gallery/page.tsx` | Gallery publik |

### ✅ Components baru:

| File | Fungsi |
|------|--------|
| `src/components/VtuberCard.tsx` | Card VTuber dengan glassmorphism |
| `src/components/VtuberModal.tsx` | Modal detail VTuber |
| `src/components/StatsCard.tsx` | Discord live stats |
| `src/components/RoleGuard.tsx` | Role-based component guard |
| `src/components/MaintenanceBanner.tsx` | Banner maintenance |

### ✅ API Routes baru:

| Route | Fungsi |
|-------|--------|
| `src/app/api/discord/route.ts` | Discord stats |
| `src/app/api/vtuber/route.ts` | VTuber CRUD |
| `src/app/api/vtuber/[id]/route.ts` | VTuber single ops |
| `src/app/api/gallery/route.ts` | Gallery upload |
| `src/app/api/gallery/[id]/route.ts` | Gallery approval |
| `src/app/api/users/me/route.ts` | Current user data |
| `src/app/api/users/[id]/route.ts` | Update user role |
| `src/app/api/settings/route.ts` | Settings CRUD |
| `src/app/api/settings/maintenance/route.ts` | Maintenance check |

### ✅ Hooks baru:

| File | Fungsi |
|------|--------|
| `src/hooks/useAuthRole.ts` | Get user role |
| `src/hooks/useDiscord.ts` | Discord stats hook |
| `src/hooks/useMaintenance.ts` | Maintenance mode hook |

---

## Langkah 5 — Update Database Schema

Jalankan SQL berikut di **Supabase SQL Editor** (tambahan dari schema lama):

```sql
-- Tambah kolom yang mungkin belum ada di tabel lama

-- Vtubers: tambah kolom agency jika belum ada
ALTER TABLE vtubers ADD COLUMN IF NOT EXISTS agency TEXT;
ALTER TABLE vtubers ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE vtubers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Pastikan slug unik
UPDATE vtubers SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]', '-', 'g')) WHERE slug IS NULL;
ALTER TABLE vtubers ALTER COLUMN slug SET NOT NULL;

-- Blog: tambah kolom baru
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Events: tambah kolom baru
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_type TEXT DEFAULT 'online';
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE events ADD COLUMN IF NOT EXISTS rsvp_count INTEGER DEFAULT 0;

-- Gallery: tambah kolom
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS uploader_name TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS reviewed_by TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Rename tabel settings jika masih app_settings
-- HANYA jalankan jika tabel lama bernama app_settings:
-- ALTER TABLE app_settings RENAME TO settings;

-- Buat tabel settings jika belum ada
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
  ('maintenance_mode', 'false'),
  ('site_name', 'Soraku Community'),
  ('discord_invite', 'https://discord.gg/soraku')
ON CONFLICT (key) DO NOTHING;
```

---

## Langkah 6 — Update `.env.local`

Pastikan semua variabel ini ada di `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Discord
DISCORD_BOT_TOKEN=Bot.Token...
DISCORD_SERVER_ID=1116971049045729302
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAINTENANCE_MODE=false
```

---

## Langkah 7 — Test Lokal

```bash
npm run dev
```

Cek:
- [ ] Homepage terbuka dengan logo Soraku
- [ ] Tombol Masuk → modal Clerk muncul dengan pilihan Discord & Google
- [ ] Login berhasil → redirect ke homepage
- [ ] `/vtuber` menampilkan halaman generasi
- [ ] `/admin` accessible setelah login
- [ ] Discord stats muncul di homepage

---

## Langkah 8 — Push ke GitHub

```bash
git add .
git commit -m "feat: update to v1.0.a1 - VTuber system, Admin panel, Discord stats, Gallery, Role system"
git push origin feature/v1.0.a1-update
```

Lalu buat **Pull Request** ke branch `main` di GitHub.

---

## Langkah 9 — Deploy ke Vercel

1. Vercel auto-detect dari GitHub PR
2. Set semua environment variables di Vercel Dashboard
3. Merge PR → otomatis deploy!

---

## ⚠️ Catatan Penting

- **Jangan hapus** file yang sudah ada di repo lama jika tidak yakin
- Test di branch dulu sebelum merge ke main
- Backup database Supabase sebelum jalankan migration SQL
- Untuk panduan Clerk OAuth detail, lihat `CLERK_OAUTH_SETUP.md`

---

*Soraku Community Platform v1.0.a1*
