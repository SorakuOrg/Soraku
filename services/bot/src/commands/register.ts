import {
  REST, Routes, Collection, SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js"
import { linkCommand }    from "./handlers/link"
import { profileCommand } from "./handlers/profile"
import { aboutCommand }   from "./handlers/about"
import { helpCommand }    from "./handlers/help"

export type Command = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export const commands = new Collection<string, Command>()

const commandList: Command[] = [
  linkCommand    as Command,
  profileCommand as Command,
  aboutCommand   as Command,
  helpCommand    as Command,
]

for (const cmd of commandList) {
  commands.set(cmd.data.name, cmd)
}

export async function deployCommands() {
  const token    = process.env.BOT_TOKEN!      // Railway: BOT_TOKEN
  const clientId = process.env.CLIENT_ID!      // Railway: CLIENT_ID
  const guildId  = process.env.GUILD_ID        // Railway: GUILD_ID

  const rest = new REST({ version: "10" }).setToken(token)
  const body = commandList.map(c => c.data.toJSON())

  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body })
      console.log(`[bot] ✓ ${body.length} slash commands deployed (guild: ${guildId})`)
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body })
      console.log(`[bot] ✓ ${body.length} slash commands deployed (global)`)
    }
  } catch (err) {
    console.error("[bot] ✗ Gagal deploy slash commands:", err)
    throw err
  }
}
