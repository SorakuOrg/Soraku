import { REST, Routes } from "discord.js"
import type { SorakuClient } from "../structures/SorakuClient"

export default async function deploySlash(client: SorakuClient) {
  const token    = process.env.BOT_TOKEN!
  const clientId = process.env.CLIENT_ID!
  const guildId  = process.env.GUILD_ID

  const rest = new REST({ version: "10" }).setToken(token)
  const body = [...client.slashCommands.values()].map(c => ({
    name: c.name, description: c.description, options: c.options ?? [],
  }))

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body })
    console.log(`[bot] ✓ ${body.length} slash commands deployed (guild)`)
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body })
    console.log(`[bot] ✓ ${body.length} slash commands deployed (global)`)
  }
}
