# Soraku Community Hub

Soraku adalah komunitas Pop Jepang & Anime yang berkembang bersama.
Website ini adalah pusat komunitas, media platform, dan integrasi Discord.

## Tech Stack
- Next.js (App Router)
- TailwindCSS
- PostgreSQL (Supabase)
- Clerk Auth
- Discord API
- Vercel Deployment

## Fitur Utama

### 1. Maintenance Mode
- Toggle via Admin Dashboard
- Redirect semua route ke /maintenance
- Tetap tampilkan jumlah member online

### 2. Discord Integration
- Real-time member count
- Online member count (auto refresh 60s)
- Server info display

### 3. Clerk Authentication
- Login/Register dengan Discord OAuth
- Role-based access control
- Middleware protection

### 4. Role System
- **Manager**: Full access (post events, blog, manage users, toggle maintenance)
- **Agensi**: Manage events
- **Admin**: Post & edit blog
- **User**: Upload gallery

### 5. Community Page
- 1000+ Members badge
- Real Discord data
- 3 Pilar Soraku
- Channel preview

### 6. Events System
- Grid layout 3 kolom
- Countdown timer
- Status badge
- Discord webhook integration

### 7. Gallery System
- User upload (pending approval)
- Admin approval workflow
- Grid responsive
- Modal preview

## Setup Project

### 1. Clone repo
```bash
git clone https://github.com/yourusername/soraku.git
cd soraku
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables

Buat file `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_KEY
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Discord
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_SERVER_ID=1116971049045729302
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Setup Discord Bot
1. Buat Application di [Discord Developer Portal](https://discord.com/developers/applications)
2. Aktifkan OAuth2
3. Tambahkan Bot
4. Berikan permission: Read Members, Send Messages
5. Invite ke server Soraku (Server ID: 1116971049045729302)

### 5. Setup Clerk
1. Buat project di [Clerk Dashboard](https://dashboard.clerk.dev)
2. Enable Discord OAuth provider
3. Tambahkan redirect URLs:
   - http://localhost:3000/sign-in
   - http://localhost:3000/sign-up
   - https://your-domain.com/sign-in
   - https://your-domain.com/sign-up
4. Setup role metadata di Clerk

### 6. Setup Supabase
1. Buat project di [Supabase](https://supabase.com)
2. Buat tables sesuai schema di `src/lib/supabase.ts`
3. Copy API keys ke environment variables

### 7. Run development
```bash
npm run dev
```

### 8. Build production
```bash
npm run build
```

## Deployment ke Vercel

1. Push ke GitHub
2. Import project ke [Vercel](https://vercel.com)
3. Set environment variables di Vercel Dashboard
4. Deploy!

## Database Schema

### Tables

**users**
- id (uuid)
- clerk_id (text)
- username (text)
- avatar_url (text)
- email (text)
- role (enum: user, admin, agensi, manager)
- created_at (timestamp)
- updated_at (timestamp)

**blog_posts**
- id (uuid)
- title (text)
- slug (text)
- content (text)
- excerpt (text)
- featured_image (text)
- author_id (uuid)
- status (enum: draft, published)
- category (text)
- tags (text[])
- featured (boolean)
- view_count (int)
- created_at (timestamp)
- updated_at (timestamp)

**events**
- id (uuid)
- title (text)
- slug (text)
- description (text)
- short_description (text)
- banner_image (text)
- start_date (timestamp)
- end_date (timestamp)
- location (text)
- location_type (enum: online, offline, hybrid)
- max_participants (int)
- status (enum: upcoming, ongoing, ended, cancelled)
- category (text)
- organizer_id (uuid)
- discord_event_id (text)
- rsvp_count (int)
- created_at (timestamp)
- updated_at (timestamp)

**gallery**
- id (uuid)
- user_id (uuid)
- image_url (text)
- caption (text)
- status (enum: pending, approved, rejected)
- created_at (timestamp)

**settings**
- id (uuid)
- key (text)
- value (text)
- updated_at (timestamp)

## Design System

### Colors
- Primary: #4FA3D1
- Dark Base: #1C1E22
- Secondary: #6E8FA6
- Light Base: #D9DDE3
- Accent: #E8C2A8

### Features
- Glassmorphism (blur + transparansi)
- Gradient effects
- Soft shadows
- Rounded modern cards
- Smooth animations
- Micro interactions

## Logo

Logo Soraku: https://blogger.googleusercontent.com/img/a/AVvXsEhlhs4Uhd-DSMY2uER618DpZkDLuupIyT5GmQDqdMmM31HF3XGi1om60_82VyP_P4r7aZlpqz8zCXNFe_-qfsBRQ63m_NcTD_viFP5pTpR4-sgfTGfK0BSUpjixF8N7eZdV7oki8kkq5uivp_Xo=w150-h150-p-k-no-nu-rw-e90

## License

MIT License

---

Dibuat dengan ❤️ oleh Soraku Community
