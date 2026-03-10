# 🤖 Tutorial Admin Bot Panel — soraku.vercel.app/admin/bot

## Apa itu Admin Bot Panel?

Panel untuk mengelola bot Discord Soraku langsung dari website, tanpa perlu akses ke server Railway atau Discord Developer Portal.

---

## Syarat Sebelum Menggunakan

### ENV Vars yang harus sudah di-set:

**Vercel (soraku.vercel.app):**

```
BOT_WEBHOOK_URL=https://xxxx.up.railway.app   ← URL Railway bot
BOT_WEBHOOK_SECRET=secret_sama_dengan_Railway
SORAKU_API_SECRET=secret_sama_dengan_Railway
```

**Railway (bot Discord):**

```
WEBHOOK_SECRET=secret_sama_dengan_Vercel
SORAKU_API_SECRET=secret_sama_dengan_Vercel
SORAKU_API_URL=https://soraku.vercel.app
SORAKU_GUILD_ID=id_server_discord
```

> ⚠️ Jika salah satu ENV tidak di-set, tab Status akan menampilkan **Bot Offline** meskipun bot berjalan normal.

---

## Tab 1: Status Bot

**Fungsi:** Cek apakah bot Railway sedang online.

**Cara pakai:**

1. Buka `/admin/bot` → otomatis fetch status setiap 30 detik
2. Hijau ✅ = bot online, Railway berjalan
3. Merah ❌ = bot offline atau `BOT_WEBHOOK_URL` belum di-set

**Error umum:**
| Error | Penyebab | Solusi |
|---|---|---|
| "BOT_WEBHOOK_URL not configured" | ENV belum di-set di Vercel | Set `BOT_WEBHOOK_URL` di Vercel dashboard |
| "Bot unreachable" | Railway bot belum jalan / URL salah | Cek Railway service, pastikan domain sudah di-generate |
| "Unauthorized" | Login bukan role OWNER/MANAGER/ADMIN | Assign role admin di Supabase `user_roles` |

---

## Tab 2: Premium

**Fungsi:** Grant atau revoke role premium ke user Discord.

**Cara grant premium:**

1. Masukkan **Discord User ID** (bukan username)
   - Cara dapat Discord User ID: Discord → Developer Mode aktif → klik kanan user → _Copy User ID_
2. Pilih tipe: `DONATUR` / `VIP` / `VVIP`
3. Opsional: isi catatan dan tanggal expired
4. Klik **Grant** → Vercel akan:
   - Insert role ke Supabase `user_roles`
   - Kirim request ke bot Railway → bot assign role di Discord

**Cara revoke premium:**

1. Masukkan Discord User ID
2. Pilih tipe yang sama
3. Klik **Revoke**

**Error umum:**
| Error | Penyebab | Solusi |
|---|---|---|
| "Missing userId or action" | Field kosong | Pastikan Discord User ID terisi |
| "Bot not configured" | `BOT_WEBHOOK_URL` atau `BOT_WEBHOOK_SECRET` kosong | Set ENV di Vercel |
| Role tidak muncul di Discord | Bot tidak punya permission "Manage Roles" | Assign permission di Discord server |
| Role tidak muncul di Discord | Bot role posisinya di bawah role target | Naikkan posisi role bot di Discord Server Settings → Roles |

---

## Tab 3: Webhooks

**Fungsi:** Kelola webhook URL untuk notifikasi ke Discord channel.

**Cara tambah webhook:**

1. Klik **+ Tambah Webhook**
2. Isi nama, URL (dari Discord channel → Edit Channel → Integrations → Webhooks → Copy URL)
3. Pilih events yang mau di-trigger
4. Klik **Simpan**
5. Klik **Test** untuk verifikasi

> ⚠️ **Webhook Discord vs Bot Railway adalah berbeda:**
>
> - Webhook Discord = URL dari Discord (untuk kirim pesan ke channel langsung tanpa bot)
> - `BOT_WEBHOOK_URL` = URL Railway bot (untuk Vercel → bot communicate)

---

## Tab 4: Notifikasi

**Fungsi:** Kirim pesan ke channel Discord via bot.

**Cara pakai:**

1. Masukkan **Channel ID** (bukan nama channel)
   - Cara dapat Channel ID: Discord → Developer Mode → klik kanan channel → _Copy Channel ID_
2. Tulis pesan
3. Toggle embed on/off
4. Klik **Kirim Notifikasi**

**Syarat:** Bot harus ada di server dan punya akses ke channel tersebut.

---

## Tab 5: Role Sync

**Fungsi:** Lihat mapping Discord role ↔ web role, assign manual, cek koneksi.

**Mapping yang sudah ada:**
| Discord Role ID | Web Role | Auto Sync |
|---|---|---|
| 1436534227708543046 | DONATUR | ✅ Otomatis |
| 1447194092965728307 | VIP | ✅ Otomatis |
| 1447194196401459320 | VVIP | ❌ Manual only |

**Auto Sync** = setiap kali role berubah di Discord (manual atau dari grant premium), bot otomatis sync ke Supabase via `guildMemberUpdate` event.

---

## Cara dapat BOT_WEBHOOK_URL

1. Buka [Railway Dashboard](https://railway.app)
2. Pilih project Soraku → pilih service bot
3. **Settings** → **Networking** → klik **Generate Domain**
4. Railway generate URL seperti `https://soraku-bot-xxx.up.railway.app`
5. URL ini = nilai `BOT_WEBHOOK_URL` di Vercel

Test: buka `https://soraku-bot-xxx.up.railway.app/health` di browser → harus return `{"status":"ok"}`

---

## Flow Lengkap Premium Sync

```
Admin input Discord User ID + pilih VIP
        ↓
/api/bot/premium (Vercel)
        ├─→ Supabase: insert user_roles (VIP)
        └─→ POST https://bot.railway.app/webhook/premium
                    ↓
              Bot Discord assign role ID di server
                    ↓
            guildMemberUpdate event (otomatis)
                    ↓
              POST soraku.vercel.app/api/discord/role-sync
                    ↓
              Supabase: konfirmasi sync
```
