/**
 * services/bot/src/index.ts
 * Entry point SorakuBot — Discord Bot Soraku Community
 *
 * Commands aktif: /link /profile /about /ping /member /event
 */

import { Client, GatewayIntentBits, Events } from "discord.js"
import { startWebhookServer } from "./webhooks/server"
import { syncRoleOnUpdate }   from "./events/guildMemberUpdate"
import { handleReady }        from "./events/ready"
import { registerCommands, commands } from "./commands/register"

// ── ENV validation ────────────────────────────────────────────
const required = [
  "DISCORD_TOKEN",
  "DISCORD_GUILD_ID",
  "SORAKU_API_URL",
  "SORAKU_API_SECRET",
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
    GatewayIntentBits.GuildPresences,   // ← untuk /about (cek online count)
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

  // 1. Register slash commands ke Discord
  await registerCommands()

  // 2. Start HTTP webhook server (terima request dari web & Railway health check)
  await startWebhookServer()

  // 3. Login Discord
  await client.login(process.env.DISCORD_TOKEN)
}

main().catch(err => {
  console.error("[bot] 💥 Fatal error:", err)
  process.exit(1)
})
