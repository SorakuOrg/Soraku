import { Collection, REST, Routes } from "discord.js"
import type { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, Message, ChatInputCommandInteraction } from "discord.js"
import { readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

export interface PrefixCommand {
  name:       string
  aliases?:   string[]
  description:string
  category:   string
  usage:      string
  execute:    (msg: Message, args: string[]) => Promise<unknown>
}

export interface SlashCommand {
  data:    SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
  execute: (i: ChatInputCommandInteraction) => Promise<unknown>
}

export const prefixCommands = new Collection<string, PrefixCommand>()
export const slashCommands  = new Collection<string, SlashCommand>()

export async function loadPrefixCommands() {
  const baseDir = join(__dirname, "prefix")
  let count = 0
  for (const cat of readdirSync(baseDir)) {
    for (const file of readdirSync(join(baseDir, cat)).filter(f => f.endsWith(".js"))) {
      const mod = await import(join(baseDir, cat, file)) as { default?: PrefixCommand }
      const cmd = mod.default
      if (!cmd?.name) continue
      prefixCommands.set(cmd.name, cmd)
      if (cmd.aliases) for (const a of cmd.aliases) prefixCommands.set(a, cmd)
      count++
    }
  }
  console.log(`[bot] ✓ ${count} prefix commands loaded`)
}

export async function loadSlashCommands() {
  const baseDir = join(__dirname, "slash")
  let count = 0
  for (const cat of readdirSync(baseDir)) {
    for (const file of readdirSync(join(baseDir, cat)).filter(f => f.endsWith(".js"))) {
      const mod = await import(join(baseDir, cat, file)) as Record<string, unknown>
      for (const val of Object.values(mod)) {
        const cmd = val as SlashCommand
        if (cmd && typeof cmd === "object" && "data" in cmd && "execute" in cmd) {
          slashCommands.set(cmd.data.name, cmd)
          count++
        }
      }
    }
  }
  console.log(`[bot] ✓ ${count} slash commands loaded`)
}

export async function deploySlashCommands() {
  const token    = process.env.BOT_TOKEN!
  const clientId = process.env.CLIENT_ID!
  const guildId  = process.env.GUILD_ID
  const rest     = new REST({ version: "10" }).setToken(token)
  const body     = [...slashCommands.values()].map(c => c.data.toJSON())

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body })
    console.log(`[bot] ✓ ${body.length} slash commands deployed (guild)`)
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body })
    console.log(`[bot] ✓ ${body.length} slash commands deployed (global)`)
  }
}
