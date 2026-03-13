import {
  REST, Routes, Collection, SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js"
import { linkCommand }    from "./handlers/link"
import { profileCommand } from "./handlers/profile"
import { aboutCommand }   from "./handlers/about"

// ── Type ──────────────────────────────────────────────────────
export type Command = {
  // Terima SlashCommandBuilder ATAU SlashCommandOptionsOnlyBuilder (punya addStringOption dll)
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

// ── Registry ──────────────────────────────────────────────────
export const commands = new Collection<string, Command>()

const commandList: Command[] = [
  linkCommand    as Command,
  profileCommand as Command,
  aboutCommand   as Command,
]

for (const cmd of commandList) {
  commands.set(cmd.data.name, cmd)
}

// ── Deploy ke Discord ─────────────────────────────────────────
export async function deployCommands() {
  const token    = process.env.DISCORD_TOKEN!
  const clientId = process.env.DISCORD_CLIENT_ID!
  const guildId  = process.env.DISCORD_GUILD_ID

  const rest = new REST({ version: "10" }).setToken(token)

  const body = commandList.map(c => c.data.toJSON())

  try {
    if (guildId) {
      // Guild deploy — instant, bagus untuk development
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body })
      console.log(`[bot] ✓ ${body.length} slash commands deployed (guild: ${guildId})`)
    } else {
      // Global deploy — 1 jam propagate, untuk production
      await rest.put(Routes.applicationCommands(clientId), { body })
      console.log(`[bot] ✓ ${body.length} slash commands deployed (global)`)
    }
  } catch (err) {
    console.error("[bot] ✗ Gagal deploy slash commands:", err)
    throw err
  }
}
