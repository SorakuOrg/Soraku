import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { z } from "zod"
import { client } from "../index"

const app = new Hono()

// ─── Health check — NO AUTH (wajib untuk Railway health check) ─────────────────
app.get("/health", (c) => {
  return c.json({
    status:  "ok",
    bot:     client.isReady() ? "online" : "offline",
    uptime:  process.uptime(),
    version: "0.1.0",
  })
})

// ─── Auth middleware — hanya untuk webhook routes ──────────────────────────────
app.use("/webhook/*", async (c, next) => {
  const secret = c.req.header("x-soraku-secret")
  if (secret !== process.env.WEBHOOK_SECRET) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  await next()
})

// ─── POST /webhook/notify — kirim DM ke user Discord ──────────────────────────
const NotifySchema = z.object({
  discordId: z.string(),
  message:   z.string().max(1800),
})

app.post("/webhook/notify", async (c) => {
  const body   = await c.req.json()
  const parsed = NotifySchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.message }, 400)

  try {
    const user = await client.users.fetch(parsed.data.discordId)
    await user.send(parsed.data.message)
    return c.json({ sent: true })
  } catch (err) {
    console.error("[bot] notify error:", err)
    return c.json({ sent: false, error: String(err) }, 500)
  }
})

// ─── POST /webhook/discord-event — announce event ke channel ──────────────────
const EventAnnounceSchema = z.object({
  title:       z.string(),
  description: z.string().optional(),
  startAt:     z.string(),
  eventUrl:    z.string().url().optional(),
})

app.post("/webhook/discord-event", async (c) => {
  const body   = await c.req.json()
  const parsed = EventAnnounceSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.message }, 400)

  const channelId = process.env.DISCORD_EVENT_CHANNEL_ID
  if (!channelId) return c.json({ error: "DISCORD_EVENT_CHANNEL_ID not set" }, 500)

  try {
    const channel = client.channels.cache.get(channelId)
    if (!channel || !("send" in channel)) return c.json({ error: "Channel not found or not sendable" }, 404)
    const textChannel = channel as { send: (msg: string) => Promise<unknown> }

    const { title, description, startAt, eventUrl } = parsed.data
    const date = new Date(startAt).toLocaleString("id-ID", {
      dateStyle: "full", timeStyle: "short", timeZone: "Asia/Jakarta",
    })

    const msg = [
      `📣 **Event Baru: ${title}**`,
      description ? `> ${description}` : "",
      `🗓️ **Waktu:** ${date} WIB`,
      eventUrl ? `🔗 **Detail:** ${eventUrl}` : "",
      `\n🔔 Jangan sampai terlewat, Sorakuuu~`,
    ].filter(Boolean).join("\n")

    await textChannel.send(msg)
    return c.json({ announced: true })
  } catch (err) {
    console.error("[bot] discord-event error:", err)
    return c.json({ announced: false, error: String(err) }, 500)
  }
})

// ─── POST /webhook/role-sync — sync role dari web ke Discord ──────────────────
const RoleSyncSchema = z.object({
  discordId: z.string(),
  tier:      z.enum(["DONATUR", "VIP", "VVIP"]).nullable(),
})

app.post("/webhook/role-sync", async (c) => {
  const body   = await c.req.json()
  const parsed = RoleSyncSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.message }, 400)

  const guildId = process.env.GUILD_ID
  if (!guildId) return c.json({ error: "GUILD_ID not set" }, 500)

  const ROLE_MAP: Record<string, string | undefined> = {
    DONATUR: process.env.ROLE_DONATUR,
    VIP:     process.env.ROLE_VIP,
    VVIP:    process.env.ROLE_VVIP,
  }

  try {
    const guild  = client.guilds.cache.get(guildId)
    if (!guild) return c.json({ error: "Guild not in cache" }, 404)
    const member = await guild.members.fetch(parsed.data.discordId)

    // Hapus semua tier roles dulu
    for (const roleId of Object.values(ROLE_MAP)) {
      if (roleId && member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId)
      }
    }

    // Tambah role baru kalau ada tier
    if (parsed.data.tier) {
      const roleId = ROLE_MAP[parsed.data.tier]
      if (roleId) await member.roles.add(roleId)
    }

    return c.json({ synced: true, tier: parsed.data.tier })
  } catch (err) {
    console.error("[bot] role-sync error:", err)
    return c.json({ synced: false, error: String(err) }, 500)
  }
})

// ─── Start server ──────────────────────────────────────────────────────────────
export async function startWebhookServer() {
  const port = parseInt(process.env.PORT ?? "3001")
  serve({ fetch: app.fetch, port, hostname: "0.0.0.0" })
  console.log(`[bot] 🌐 Webhook server listening on 0.0.0.0:${port}`)
}
