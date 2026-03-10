/**
 * services/bot/src/index.ts
 * Entry point Soraku Discord Bot
 */

import { Client, GatewayIntentBits, Events } from "discord.js";
import { startWebhookServer } from "./webhooks/server";
import { syncRoleOnUpdate } from "./events/guildMemberUpdate";
import { handleReady } from "./events/ready";
import { registerCommands } from "./commands/register";

// ─── Validasi env ──────────────────────────────────────────────────────────────

const required = ["DISCORD_TOKEN", "DISCORD_GUILD_ID", "SORAKU_API_URL", "SORAKU_API_SECRET", "WEBHOOK_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[bot] ❌ ENV missing: ${key}`);
    process.exit(1);
  }
}

// ─── Discord Client ────────────────────────────────────────────────────────────

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

// ─── Events ────────────────────────────────────────────────────────────────────

client.once(Events.ClientReady, (c) => handleReady(c));
client.on(Events.GuildMemberUpdate, syncRoleOnUpdate);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commands } = await import("./commands/register");
  const command = commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`[bot] command error: ${interaction.commandName}`, err);
    const msg = { content: "Terjadi kesalahan.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg);
    } else {
      await interaction.reply(msg);
    }
  }
});

// ─── Start ──────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Register slash commands ke Discord
  await registerCommands();

  // 2. Start HTTP webhook server (terima request dari web)
  await startWebhookServer();

  // 3. Login Discord bot
  await client.login(process.env.DISCORD_TOKEN);
}

main().catch((err) => {
  console.error("[bot] Fatal error:", err);
  process.exit(1);
});
