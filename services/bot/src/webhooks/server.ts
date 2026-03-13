import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { z } from "zod";
import { client } from "../index";

const app = new Hono();

// ─── Auth middleware ────────────────────────────────────────────────────────────

app.use("*", async (c, next) => {
  const secret = c.req.header("x-soraku-secret");
  if (secret !== process.env.WEBHOOK_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

// ─── Health check ───────────────────────────────────────────────────────────────

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    bot: client.isReady() ? "online" : "offline",
    uptime: process.uptime(),
  });
});

// ─── POST /webhook/notify — kirim DM ke user Discord ───────────────────────────

const NotifySchema = z.object({
  discordId: z.string(),
  message:   z.string().max(2000),
});

app.post("/webhook/notify", async (c) => {
  const body = await c.req.json();
  const parsed = NotifySchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.message }, 400);

  try {
    const user = await client.users.fetch(parsed.data.discordId);
    await user.send(parsed.data.message);
    return c.json({ sent: true });
  } catch (err) {
    console.error("[bot] notify error:", err);
    return c.json({ sent: false, error: String(err) }, 500);
  }
});

// ─── POST /webhook/role-update — update role Discord user ──────────────────────

const RoleUpdateSchema = z.object({
  discordId:  z.string(),
  addRoleId:  z.string().optional(),
  removeRoleId: z.string().optional(),
});

app.post("/webhook/role-update", async (c) => {
  const body = await c.req.json();
  const parsed = RoleUpdateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.message }, 400);

  try {
    const guild  = client.guilds.cache.get(process.env.GUILD_ID!);
    if (!guild) return c.json({ error: "Guild not found" }, 404);

    const member = await guild.members.fetch(parsed.data.discordId);

    if (parsed.data.addRoleId)    await member.roles.add(parsed.data.addRoleId);
    if (parsed.data.removeRoleId) await member.roles.remove(parsed.data.removeRoleId);

    console.log(`[bot] role-update: ${member.user.tag} +${parsed.data.addRoleId ?? "-"} -${parsed.data.removeRoleId ?? "-"}`);
    return c.json({ updated: true });
  } catch (err) {
    console.error("[bot] role-update error:", err);
    return c.json({ updated: false, error: String(err) }, 500);
  }
});

// ─── POST /webhook/discord-event — announce event ke channel ───────────────────

const EventAnnounceSchema = z.object({
  title:       z.string(),
  description: z.string().optional(),
  startAt:     z.string(),
  eventUrl:    z.string().optional(),
  coverUrl:    z.string().optional(),
});

app.post("/webhook/discord-event", async (c) => {
  const body = await c.req.json();
  const parsed = EventAnnounceSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.message }, 400);

  const channelId = process.env.DISCORD_EVENT_CHANNEL_ID;
  if (!channelId) return c.json({ error: "DISCORD_EVENT_CHANNEL_ID not set" }, 500);

  try {
    const channel = client.channels.cache.get(channelId);
    if (!channel || !("send" in channel)) return c.json({ error: "Channel not found or not sendable" }, 404);
    const textChannel = channel as { send: (msg: string) => Promise<unknown> };

    const { title, description, startAt, eventUrl } = parsed.data;
    const date = new Date(startAt).toLocaleString("id-ID", {
      dateStyle: "full", timeStyle: "short", timeZone: "Asia/Jakarta",
    });

    const msg = [
      `📣 **Event Baru: ${title}**`,
      description ? `> ${description}` : "",
      `🗓️ **Waktu:** ${date} WIB`,
      eventUrl ? `🔗 **Detail:** ${eventUrl}` : "",
      `\n🔔 Jangan sampai terlewat, Sorakuuu~`,
    ].filter(Boolean).join("\n");

    await textChannel.send(msg);
    return c.json({ announced: true });
  } catch (err) {
    console.error("[bot] discord-event error:", err);
    return c.json({ announced: false, error: String(err) }, 500);
  }
});

// ─── Start server ───────────────────────────────────────────────────────────────

export async function startWebhookServer() {
  const port = parseInt(process.env.PORT ?? "3001");
  serve({ fetch: app.fetch, port });
  console.log(`[bot] 🌐 Webhook server running on port ${port}`);
}
