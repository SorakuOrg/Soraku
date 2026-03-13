# Revisi untuk Kaizo — Back-end
> Updated: 2026-03-13

---

## ✅ Status services/api

`services/api` sudah deploy ke Vercel. Landing page sudah ada di root `/`.

**Domain:**
- `https://apisoraku-git-master-soraku.vercel.app`
- `https://apisoraku-8jsns0leq-soraku.vercel.app`

---

## 🔧 Yang perlu Kaizo lakukan sekarang

### 1. Assign custom domain (opsional tapi recommended)
Di Vercel project `apisoraku` → Settings → Domains → tambah:
```
api.soraku.vercel.app
```
Atau domain custom kalau ada.

### 2. Set `API_URL` di apps/web di Vercel
Setelah domain final diketahui, update ENV di project `soraku` (apps/web):
```
API_URL = https://apisoraku-git-master-soraku.vercel.app
```

### 3. Run migration `20260313_level_badge_system.sql`
Kalau belum di-run, execute di Supabase SQL Editor:
```
supabase/migrations/20260313_level_badge_system.sql
```
Ini untuk tabel `userlevels` dan `userbadges`.

### 4. Generate + simpan API Key untuk Discord Bot
```bash
node -e "
const crypto = require('crypto');
const key  = 'bot_' + crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256').update(key).digest('hex');
console.log('KEY  (→ BOT_API_KEY di Railway):', key);
console.log('HASH (→ simpan ke DB):', hash);
"
```

Simpan HASH ke Supabase:
```sql
INSERT INTO soraku.apikeys (name, keyhash, prefix, client, permissions)
VALUES (
  'Discord Bot',
  '<HASH dari command di atas>',
  LEFT('<KEY>', 8),
  'bot',
  '["read"]'
);
```

Lalu set `BOT_API_KEY=<KEY>` di Railway ENV bot.

### 5. Set Railway ENV untuk bot
```
DISCORD_TOKEN       = (dari Discord Developer Portal)
DISCORD_GUILD_ID    = (ID server Discord Soraku)
SORAKU_API_URL      = https://apisoraku-git-master-soraku.vercel.app
SORAKU_WEB_URL      = https://soraku.vercel.app
SORAKU_API_SECRET   = (sama dengan di apps/web)
WEBHOOK_SECRET      = (sama dengan BOT_WEBHOOK_SECRET di apps/web)
DISCORD_INVITE_CODE = qm3XJvRa6B
BOT_API_KEY         = (dari langkah 4)
```

### 6. Aktifkan Privileged Intents di Discord Developer Portal
Discord Dev Portal → aplikasi bot → **Bot** → Privileged Gateway Intents:
- ✅ Server Members Intent
- ✅ Presence Intent

---

## ⚠️ Yang JANGAN dilakukan
- Jangan pakai Prisma / ioredis / bullmq
- Jangan query DB langsung dari apps/web — semua lewat services/api
- Jangan commit `.env` ke Git
