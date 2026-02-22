# SETUP GUIDE - Soraku Community Platform

## Prerequisites
- Node.js 18+, npm, Akun Supabase, Akun Clerk, Discord Server + Bot

---

## 1. Installation

```bash
git clone <repo-url>
cd soraku
npm install
cp .env.local.example .env.local
# Edit .env.local dengan credentials kamu
npm run dev
```

---

## 2. Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
DISCORD_CLIENT_ID=1234567890
DISCORD_CLIENT_SECRET=abcdef...
DISCORD_BOT_TOKEN=Bot.Token.Here
DISCORD_SERVER_ID=1116971049045729302
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAINTENANCE_MODE=false
```

---

## 3. Setup Supabase

1. Buat project di https://supabase.com
2. Di **SQL Editor**, jalankan semua isi file `src/lib/schema.sql`
3. Buat Storage Buckets (Public): `vtubers-avatars`, `blog-images`, `event-banners`, `gallery`

---

## 4. Setup Clerk

1. Buat app di https://clerk.com
2. Enable Discord sebagai social login provider
3. Masukkan Discord Client ID & Secret di Clerk Dashboard
4. Copy Publishable Key dan Secret Key ke `.env.local`

---

## 5. Setup Discord Bot

1. Buat bot di https://discord.com/developers/applications
2. Salin Token ke `DISCORD_BOT_TOKEN`
3. Salin Client ID & Secret ke env
4. Invite bot ke server dengan permission: Read Members, View Guild Insights
5. Buat webhook di channel yang diinginkan → salin URL ke `DISCORD_WEBHOOK_URL`

---

## 6. Set Role MANAGER Pertama

```sql
UPDATE users SET role = 'MANAGER' WHERE email = 'your-email@example.com';
```

---

## 7. Deploy ke Vercel

```bash
git init && git add . && git commit -m "feat: Soraku Community Platform"
git push origin main
```
Di Vercel: Import repo → tambahkan semua env variables → Deploy

---

## 8. Role Permission Reference

| Feature         | MANAGER | AGENSI | ADMIN | USER |
|-----------------|---------|--------|-------|------|
| VTuber Create   | ✅ | ✅ | ❌ | ❌ |
| VTuber Edit     | ✅ | ✅ | ❌ | ❌ |
| VTuber Delete   | ✅ | ❌ | ❌ | ❌ |
| Blog Create     | ✅ | ❌ | ✅ | ❌ |
| Blog Delete     | ✅ | ❌ | ❌ | ❌ |
| Events Create   | ✅ | ✅ | ❌ | ❌ |
| Gallery Approve | ✅ | ❌ | ✅ | ❌ |
| User Manage     | ✅ | ❌ | ❌ | ❌ |
| Settings        | ✅ | ❌ | ❌ | ❌ |

---

Butuh bantuan? Join Discord: https://discord.gg/soraku
