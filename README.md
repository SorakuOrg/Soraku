# Soraku Community

Website komunitas Pop Jepang & Anime yang modern dan terintegrasi dengan Discord.

## Fitur Utama

### 1. Authentication (Discord OAuth2)
- Login dengan akun Discord
- Sync username dan avatar
- Role-based access control (admin/moderator/member)
- JWT session management

### 2. Admin Dashboard
- CRUD Blog Post
- CRUD Event
- Manage Users
- Analytics sederhana
- Custom settings

### 3. Blog System
- Rich text editor
- Upload gambar
- Slug otomatis
- SEO meta tags
- Tags dan kategori
- Featured posts
- Pagination

### 4. Events Real-Time
- Countdown timer
- Status event (Upcoming/Ongoing/Ended)
- RSVP system
- Filter kategori
- Auto status update

### 5. Discord Integration
- Tampilkan jumlah member online
- Server info
- Invite link
- Webhook support
- Role sync

### 6. Community Section
- Hero section dengan animasi
- Features showcase
- Testimonials
- Discord server preview
- CTA sections

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Auth**: Discord OAuth2
- **Icons**: Lucide React

## Design System

### Colors
- **Primary**: #4FA3D1
- **Dark Base**: #1C1E22
- **Secondary**: #6E8FA6
- **Light Base**: #D9DDE3
- **Accent**: #E8C2A8

### Features
- Glassmorphism (blur + transparansi)
- Gradient effects
- Soft shadows
- Rounded modern cards
- Smooth animations
- Micro interactions

## Struktur Halaman

1. **Landing Page** - Hero, Features, Events, Blog, Discord, Testimonials, CTA
2. **About Us** - Visi, Misi, Values, Timeline
3. **Blog** - List artikel dan detail
4. **Events** - List event dan detail dengan RSVP
5. **Community** - Channel preview dan benefits
6. **Admin Dashboard** - Full CRUD management
7. **Privacy Policy** - Kebijakan privasi
8. **Terms of Service** - Syarat dan ketentuan
9. **Login** - Discord OAuth2

## Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Discord OAuth
VITE_DISCORD_CLIENT_ID=your_discord_client_id
VITE_DISCORD_CLIENT_SECRET=your_discord_client_secret
VITE_DISCORD_REDIRECT_URI=http://localhost:5173/auth/callback

# Discord Server
VITE_DISCORD_SERVER_ID=your_discord_server_id
VITE_DISCORD_INVITE_URL=https://discord.gg/soraku
VITE_DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

## Database Schema

### Tables
- **users** - Data user dari Discord
- **blog_posts** - Artikel blog
- **events** - Data event
- **event_rsvps** - RSVP peserta event
- **site_settings** - Pengaturan website
- **admin_logs** - Log aktivitas admin

## Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/soraku.git
cd soraku
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## Deployment

### Vercel
1. Push ke GitHub
2. Import project di Vercel
3. Setup environment variables
4. Deploy!

### Supabase Setup
1. Buat project baru di Supabase
2. Jalankan SQL migrations
3. Setup Row Level Security (RLS)
4. Copy API keys ke environment variables

## Discord App Setup

1. Buat aplikasi baru di Discord Developer Portal
2. Setup OAuth2 redirect URLs
3. Copy Client ID dan Client Secret
4. Invite bot ke server Anda

## Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk diskusi.

## Lisensi

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## Kontak

- Email: hello@soraku.id
- Discord: https://discord.gg/soraku
- Website: https://soraku.id

---

Dibuat dengan ❤️ oleh Soraku Community
