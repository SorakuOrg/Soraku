# Update Bot SorakuBot — Untuk Kaizo & Bubu
> Dari: Sora | 2026-03-14

---

## 🔧 Fix yang baru di-push (commit `6dd1567`)

### Masalah sebelumnya
Health check Railway selalu gagal karena webhook server (`/health`) baru
start **setelah** login Discord dan deploy slash commands. Discord API bisa
lambat 10–30 detik → Railway timeout → bot dianggap crash terus.

### Fix
HTTP server sekarang **start pertama** sebelum apapun → Railway langsung
dapat response dari `/health` → tidak timeout lagi.

---

## 📋 Checklist deploy untuk Kaizo

### 1. ENV Railway yang WAJIB ada (cek semua ini)

| Key | Keterangan |
|-----|-----------|
| `BOT_TOKEN` | Token Discord bot |
| `CLIENT_ID` | Application ID dari Discord Dev Portal |
| `GUILD_ID` | ID server Discord Soraku |
| `SUPABASE_URL` | URL Supabase (sama dengan apps/web) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key Supabase |
| `SORAKU_WEB_URL` | `https://www.soraku.id` |
| `WEBHOOK_SECRET` | Secret untuk webhook dari web |

### 2. ENV Railway yang opsional tapi recommended

| Key | Value | Keterangan |
|-----|-------|-----------|
| `BOT_PREFIX` | `!` | Prefix command (default sudah `!`) |
| `OWNER_ID` | `1020644780075659356` | Discord ID Riu |
| `ROLE_DONATUR` | `1436534227708543046` | Role ID Discord Donatur |
| `ROLE_VIP` | `1447194092965728307` | Role ID Discord VIP |
| `ROLE_VVIP` | `1447194196401459320` | Role ID Discord VVIP |
| `DISCORD_EVENT_CHANNEL_ID` | *(ID channel announce)* | Untuk announce event otomatis |

### 3. ENV untuk musik Lavalink (opsional)
Kalau tidak diset, musik otomatis nonaktif tanpa crash.

| Key | Contoh value |
|-----|-------------|
| `LAVA_URL` | `lava-v4.ajieblogs.eu.org:443` |
| `LAVA_AUTH` | `https://dsc.gg/ajidevserver` |
| `LAVA_SECURE` | `true` |
| `SPOTIFY_ID` | *(dari Spotify Developer)* |
| `SPOTIFY_SECRET` | *(dari Spotify Developer)* |

### 4. Supabase SQL Migration
**WAJIB dirun sebelum bot online** — buat semua tabel bot di Supabase:
```
File: services/bot/supabase_migration.sql
Cara: Supabase Dashboard → SQL Editor → paste → Run
```

### 5. Discord Developer Portal
Aktifkan Privileged Intents:
- ✅ Server Members Intent
- ✅ Presence Intent
- ✅ Message Content Intent

---

## 📁 Struktur bot (untuk referensi Bubu)

```
services/bot/src/
├── Commands/
│   ├── prefix/          ← Semua prefix commands (!help, !play, dll)
│   │   ├── Antinuke/
│   │   ├── Automod/
│   │   ├── Config/
│   │   ├── Extra/
│   │   ├── Information/
│   │   ├── Moderation/
│   │   ├── Music/
│   │   ├── Owner/
│   │   ├── Playlist/
│   │   ├── Profile/
│   │   ├── Role/
│   │   ├── Utility/
│   │   ├── Voice/
│   │   └── Welcome/
│   └── slash/           ← Semua slash commands (/link, /profile, dll)
│       ├── Soraku/
│       ├── Information/
│       └── Music/
├── Events/              ← Discord events (guildMemberAdd, dll)
├── Schema/db.js         ← Supabase layer (pengganti MongoDB)
├── Structures/SorakuClient.js
├── Utils/
├── Webhooks/server.js   ← HTTP server untuk Railway + webhook dari web
└── index.js
```

## 🔗 Integrasi dengan apps/web (untuk Bubu)

Bot **terhubung langsung** ke Supabase `soraku` schema yang sama dengan web:

| Aksi Discord | Efek di Web |
|-------------|-------------|
| User dapat role DONATUR/VIP/VVIP | `soraku.users.supporterrole` langsung update |
| `/profile` | Ambil data dari `soraku.users` berdasarkan `discordid` |

Webhook dari web ke bot (endpoint `POST /webhook/`):
| Endpoint | Fungsi |
|----------|--------|
| `/webhook/notify` | Kirim DM ke user Discord |
| `/webhook/role-sync` | Sync supporter tier → assign Discord role |
| `/webhook/event-announce` | Announce event baru ke channel Discord |

Header yang dibutuhkan: `x-soraku-secret: <WEBHOOK_SECRET>`

---

## ✅ Status setelah fix ini

Setelah Railway redeploy dengan commit `6dd1567`:
1. `/health` langsung respond setelah container start
2. Bot login Discord di background
3. Kalau ENV ada yang kurang → log warning, server tetap up (tidak crash)

Cek status: `https://soraku.up.railway.app/health`
Expected: `{"status":"ok","bot":"starting"}` → lalu `"bot":"online"` setelah login
