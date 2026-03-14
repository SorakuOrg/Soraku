/**
 * services/bot/src/index.ts — SorakuBot Entry Point
 *
 * Railway ENV yang dibutuhkan:
 *   BOT_TOKEN         — Discord bot token
 *   CLIENT_ID         — Discord Application ID
 *   GUILD_ID          — Discord Server ID
 *   SORAKU_API_SECRET — Internal API secret
 *   SORAKU_WEB_URL    — URL web komunitas
 *   WEBHOOK_SECRET    — Webhook validation secret
 *   BOT_PREFIX        — Prefix command (default: !)
 */
import { Client, GatewayIntentBits, Events } from "discord.js"
import { startWebhookServer }  from "./webhooks/server"
import { syncRoleOnUpdate }    from "./events/guildMemberUpdate"
import { handleReady }         from "./events/ready"
import {
  loadPrefixCommands, loadSlashCommands, deploySlashCommands,
  prefixCommands, slashCommands,
} from "./commands/loader"

// ── ENV validation ────────────────────────────────────────────
const required = ["BOT_TOKEN", "CLIENT_ID", "GUILD_ID", "SORAKU_API_SECRET", "SORAKU_WEB_URL", "WEBHOOK_SECRET"]
for (const key of required) {
  if (!process.env[key]) { console.error(`[bot] ❌ ENV missing: ${key}`); process.exit(1) }
}

export const PREFIX = process.env.BOT_PREFIX ?? "!"

// ── Discord Client ────────────────────────────────────────────
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
})

// ── Events ────────────────────────────────────────────────────
client.once(Events.ClientReady, c => handleReady(c))
client.on(Events.GuildMemberUpdate, syncRoleOnUpdate)

// Prefix command handler
client.on(Events.MessageCreate, async message => {
  if (message.author.bot || !message.guild) return
  if (!message.content.startsWith(PREFIX)) return

  const args    = message.content.slice(PREFIX.length).trim().split(/\s+/)
  const cmdName = args.shift()?.toLowerCase()
  if (!cmdName) return

  const command = prefixCommands.get(cmdName)
  if (!command) return

  try {
    await command.execute(message, args)
  } catch (err) {
    console.error(`[bot] ❌ Prefix error: ${PREFIX}${cmdName}`, err)
    await message.reply("❌ Terjadi kesalahan. Coba lagi nanti.").catch(() => {})
  }
})

// Slash command handler
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = slashCommands.get(interaction.commandName)
  if (!command) return

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(`[bot] ❌ Slash error: /${interaction.commandName}`, err)
    const msg = { content: "❌ Terjadi kesalahan. Coba lagi nanti.", ephemeral: true }
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => {})
    else await interaction.reply(msg).catch(() => {})
  }
})

// ── Snipe: simpan pesan yang dihapus ─────────────────────────
client.on(Events.MessageDelete, message => {
  if (message.author?.bot) return
  if (!message.content) return
  import("./commands/prefix/Utility/snipe").then(({ setSnipe }) => {
    setSnipe(message.channelId, {
      content: message.content!,
      author:  message.author!.tag,
      avatar:  message.author!.displayAvatarURL(),
    })
  }).catch(() => {})
})

// ── AFK: hapus AFK saat user kirim pesan ─────────────────────
client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return
  import("./commands/prefix/Utility/afk").then(async ({ getAfkMap }) => {
    const afkMap = getAfkMap()
    if (!afkMap.has(message.author.id)) return
    afkMap.delete(message.author.id)
    const m = await message.reply(`✅ Selamat datang kembali, **${message.author.username}**! AFK kamu dihapus.`)
    setTimeout(() => m.delete().catch(() => {}), 5000)
  }).catch(() => {})
})

// ── Start ─────────────────────────────────────────────────────
async function main() {
  console.log("[bot] 🚀 Starting SorakuBot...")

  await loadPrefixCommands()
  await loadSlashCommands()
  await deploySlashCommands()
  await startWebhookServer()
  await client.login(process.env.BOT_TOKEN)
}

main().catch(err => {
  console.error("[bot] 💥 Fatal error:", err)
  process.exit(1)
})
