const { Hono } = require("hono")
const { serve } = require("@hono/node-server")

let _client

async function startWebhookServer(client) {
  _client = client
  const app  = new Hono()
  const port = parseInt(process.env.PORT ?? "3000")

  // Health check — NO AUTH, selalu 200 agar Railway tidak kill container
  // Meski bot belum login Discord, server sudah harus respond
  app.get("/health", c => {
    return c.json({
      status: "ok",
      bot:    _client?.isReady() ? "online" : "starting",
      uptime: process.uptime(),
      guilds: _client?.guilds?.cache?.size ?? 0,
      version: "0.2.0",
    })
  })

  // Auth middleware — hanya untuk webhook routes
  app.use("/webhook/*", async (c, next) => {
    if (c.req.header("x-soraku-secret") !== process.env.WEBHOOK_SECRET)
      return c.json({ error: "Unauthorized" }, 401)
    await next()
  })

  // POST /webhook/notify — kirim DM ke user Discord
  app.post("/webhook/notify", async c => {
    const { discordId, message } = await c.req.json()
    try {
      const user = await _client.users.fetch(discordId)
      await user.send(message)
      return c.json({ sent: true })
    } catch (err) {
      return c.json({ sent: false, error: String(err) }, 500)
    }
  })

  // POST /webhook/role-sync — sync supporter tier dari web
  app.post("/webhook/role-sync", async c => {
    const { discordId, tier } = await c.req.json()
    const guildId = process.env.GUILD_ID
    const ROLES   = { DONATUR: process.env.ROLE_DONATUR, VIP: process.env.ROLE_VIP, VVIP: process.env.ROLE_VVIP }
    try {
      const guild  = _client.guilds.cache.get(guildId)
      if (!guild) return c.json({ error: "Guild not cached" }, 404)
      const member = await guild.members.fetch(discordId)
      for (const id of Object.values(ROLES)) if (id && member.roles.cache.has(id)) await member.roles.remove(id).catch(() => {})
      if (tier && ROLES[tier]) await member.roles.add(ROLES[tier]).catch(() => {})
      return c.json({ synced: true, tier })
    } catch (err) {
      return c.json({ synced: false, error: String(err) }, 500)
    }
  })

  // POST /webhook/event-announce — announce event ke channel
  app.post("/webhook/event-announce", async c => {
    const { title, description, startAt, eventUrl } = await c.req.json()
    const channelId = process.env.DISCORD_EVENT_CHANNEL_ID
    if (!channelId) return c.json({ error: "DISCORD_EVENT_CHANNEL_ID not set" }, 500)
    try {
      const channel = _client.channels.cache.get(channelId)
      if (!channel?.send) return c.json({ error: "Channel not found" }, 404)
      const date = new Date(startAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Jakarta" })
      const msg  = [`📣 **Event Baru: ${title}**`, description ? `> ${description}` : "", `🗓️ **Waktu:** ${date} WIB`, eventUrl ? `🔗 **Detail:** ${eventUrl}` : "", `\n🔔 Jangan sampai terlewat, Sorakuuu~`].filter(Boolean).join("\n")
      await channel.send(msg)
      return c.json({ announced: true })
    } catch (err) {
      return c.json({ announced: false, error: String(err) }, 500)
    }
  })

  serve({ fetch: app.fetch, port, hostname: "0.0.0.0" })
  console.log(`[bot] 🌐 Webhook server on 0.0.0.0:${port}`)
}

module.exports = { startWebhookServer }
