/**
 * SorakuBot — Entry Point
 * Clone struktural Arrkiii bot, DB: Supabase (bukan MongoDB)
 * Integrasi dengan apps/web via schema soraku di Supabase
 */
import { SorakuClient } from "./structures/SorakuClient"
import loadCommands      from "./loaders/loadCommands"
import loadSlashCommands from "./loaders/loadSlashCommands"
import loadEvents        from "./loaders/loadEvents"
import loadPlayers       from "./loaders/loadPlayers"
import deploySlash       from "./loaders/deploySlash"
import { startWebhookServer } from "./webhooks/server"

// ── ENV validation ────────────────────────────────────────────
const required = ["BOT_TOKEN", "CLIENT_ID", "GUILD_ID", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SORAKU_WEB_URL", "SORAKU_API_SECRET", "WEBHOOK_SECRET"]
for (const key of required) {
  if (!process.env[key]) { console.error(`[bot] ❌ ENV missing: ${key}`); process.exit(1) }
}

const client = new SorakuClient()

async function main() {
  console.log("[bot] 🚀 Starting SorakuBot v2...")

  // Init Lavalink music (opsional — tidak crash kalau tidak ada ENV)
  client.initMusic()

  // Load commands + events
  loadCommands(client)
  loadSlashCommands(client)
  loadEvents(client)
  loadPlayers(client)

  // Deploy slash commands ke Discord
  await deploySlash(client)

  // Start webhook HTTP server
  await startWebhookServer(client)

  // Login
  await client.login(process.env.BOT_TOKEN)
  console.log("[bot] ✅ SorakuBot online!")
}

main().catch(err => {
  console.error("[bot] 💥 Fatal:", err)
  process.exit(1)
})

export { client }
