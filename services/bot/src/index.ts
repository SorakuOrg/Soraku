/**
 * services/bot/src/index.ts
 * Entry point SorakuBot — Discord Bot Soraku Community
 *
 * ENV (Railway):
 *   BOT_TOKEN         — Discord bot token
 *   CLIENT_ID         — Discord application/client ID
 *   GUILD_ID          — Discord server ID
 *   OWNER_ID          — Discord ID owner (Riu)
 *   SORAKU_API_SECRET — Internal secret untuk services/api
 *   SORAKU_WEB_URL    — URL web komunitas (https://soraku.vercel.app)
 *   WEBHOOK_SECRET    — Secret validasi webhook dari web
 *   ROLE_DONATUR      — Discord Role ID tier Donatur
 *   ROLE_VIP          — Discord Role ID tier VIP
 *   ROLE_VVIP         — Discord Role ID tier VVIP
 */

import { Client, GatewayIntentBits, Events } from "discord.js"
import { startWebhookServer } from "./webhooks/server"
import { syncRoleOnUpdate }   from "./events/guildMemberUpdate"
import { handleReady }        from "./events/ready"
import { deployCommands, commands } from "./commands/register"

// ── ENV validation ────────────────────────────────────────────
const required = [
  "BOT_TOKEN",
  "CLIENT_ID",
  "GUILD_ID",
  "SORAKU_API_SECRET",
  "SORAKU_WEB_URL",
  "WEBHOOK_SECRET",
]
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[bot] ❌ ENV missing: ${key}`)
    process.exit(1)
  }
}

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

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = commands.get(interaction.commandName)
  if (!command) return

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(`[bot] ❌ Command error: /${interaction.commandName}`, err)
    const msg = { content: "❌ Terjadi kesalahan. Coba lagi nanti.", ephemeral: true }
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg).catch(() => {})
    } else {
      await interaction.reply(msg).catch(() => {})
    }
  }
})

// ── Start ─────────────────────────────────────────────────────
async function main() {
  console.log("[bot] 🚀 Starting SorakuBot...")

  await deployCommands()
  await startWebhookServer()
  await client.login(process.env.BOT_TOKEN)
}

main().catch(err => {
  console.error("[bot] 💥 Fatal error:", err)
  process.exit(1)
})
