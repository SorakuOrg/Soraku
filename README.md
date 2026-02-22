# Soraku Community Platform

Platform komunitas VTuber Indonesia yang dibangun dengan Next.js, Clerk, Supabase, dan Discord API.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Authentication**: Clerk (Discord OAuth)
- **Database**: Supabase (PostgreSQL)
- **Discord**: Discord Bot + Webhook
- **Deploy**: Vercel

## Features

- 🌟 VTuber generation system
- 🎉 Events dengan Discord webhook integration
- 📰 Blog system
- 🖼️ Gallery dengan approval system
- 💬 Live Discord stats
- 🛡️ Role-based access control (MANAGER, AGENSI, ADMIN, USER)
- 🔧 Admin panel
- 🔴 Maintenance mode

## Quick Start

Lihat [SETUP.md](./SETUP.md) untuk panduan lengkap instalasi.

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local dengan credentials kamu
npm run dev
```
