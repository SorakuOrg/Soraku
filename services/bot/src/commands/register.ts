/**
 * services/bot/src/commands/register.ts
 *
 * Daftar lengkap slash commands SorakuBot.
 * Tambah command baru: import handlernya dan push ke commandList[].
 *
 * Commands aktif:
 *   /link    — Dapatkan link Register / Login di web Soraku
 *   /profile — Lihat profil Soraku Community (diri sendiri atau user lain)
 *   /about   — Tentang Soraku Community
 *   /ping    — Cek latency bot
 *   /member  — Jumlah member server
 *   /event   — Event Soraku yang akan datang
 */

import {
  REST,
  Routes,
  Collection,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js"
import { linkCommand }    from "./handlers/link"
import { profileCommand } from "./handlers/profile"
import { aboutCommand }   from "./handlers/about"

// ── Type ──────────────────────────────────────────────────────
export type Command = {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

// ── Built-in commands (tetap di sini, ringan) ─────────────────
const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Cek apakah SorakuBot aktif 🏓"),
  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp
    const apiLatency = Math.round(interaction.client.ws.ping)
    await interaction.reply({
      content: [
        `🏓 **Pong!**`,
        `Bot latency: **${latency}ms**`,
        `API latency: **${apiLatency}ms**`,
        `Status: **Online** ✅`,
      ].join(" · "),
      ephemeral: true,
    })
  },
}

const memberCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("member")
    .setDescription("Lihat jumlah member server Soraku 👥"),
  async execute(interaction) {
    const guild = interaction.guild
    if (!guild) {
      await interaction.reply({ content: "Command ini hanya bisa dipakai di server.", ephemeral: true })
      return
    }
    await interaction.deferReply({ ephemeral: false })
    try {
      await guild.members.fetch()
      const total  = guild.memberCount
      const humans = guild.members.cache.filter(m => !m.user.bot).size
      const bots   = guild.members.cache.filter(m => m.user.bot).size
      await interaction.editReply(
        `👥 **Member Server Soraku**\n` +
        `Total: **${total.toLocaleString("id-ID")}** (${humans.toLocaleString("id-ID")} manusia · ${bots} bot)`
      )
    } catch {
      await interaction.editReply(`👥 **${guild.memberCount.toLocaleString("id-ID")}** member di server ini.`)
    }
  },
}

const eventCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Lihat event Soraku yang akan datang 📅"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false })
    const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://soraku.vercel.app"
    const API_URL = process.env.SORAKU_API_URL  ?? "http://localhost:4000"

    try {
      const res  = await fetch(`${API_URL}/api/events?status=online&limit=5`)
      const data = await res.json() as {
        data: Array<{ title: string; startdate: string; slug: string; location?: string; isonline?: boolean }>
      }
      const events = data.data ?? []

      if (!events.length) {
        await interaction.editReply("Tidak ada event yang akan datang saat ini. Stay tuned! 🎉")
        return
      }

      const list = events
        .map((e, i) => {
          const date = new Date(e.startdate).toLocaleString("id-ID", {
            dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta",
          })
          const loc = e.isonline ? "🌐 Online" : (e.location ?? "📍 Offline")
          return `**${i + 1}. ${e.title}**\n📅 ${date} WIB · ${loc}\n🔗 ${WEB_URL}/events/${e.slug}`
        })
        .join("\n\n")

      await interaction.editReply(`📅 **Event Soraku yang Akan Datang**\n\n${list}`)
    } catch {
      await interaction.editReply("Gagal mengambil data event. Coba cek langsung di website ya!")
    }
  },
}

// ── Command Registry ──────────────────────────────────────────
const commandList: Command[] = [
  // Utama
  linkCommand,
  profileCommand,
  aboutCommand,
  // Utility
  pingCommand,
  memberCommand,
  eventCommand,
]

export const commands = new Collection<string, Command>()
for (const cmd of commandList) {
  commands.set(cmd.data.name, cmd)
}

// ── Register ke Discord API ───────────────────────────────────
export async function registerCommands() {
  const token   = process.env.DISCORD_TOKEN!
  const guildId = process.env.DISCORD_GUILD_ID!

  if (!token || !guildId) {
    console.error("[bot] ❌ DISCORD_TOKEN atau DISCORD_GUILD_ID tidak ada di ENV")
    return
  }

  const rest = new REST({ version: "10" }).setToken(token)

  // Decode client ID dari JWT token Discord
  const clientId = Buffer.from(token.split(".")[0], "base64").toString("utf-8")

  const body = [...commands.values()].map(c => c.data.toJSON())

  try {
    console.log(`[bot] 🔄 Registering ${body.length} slash commands...`)
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body })
    console.log(`[bot] ✅ ${body.length} slash commands registered:`)
    for (const cmd of body) {
      console.log(`        /${cmd.name} — ${cmd.description}`)
    }
  } catch (err) {
    console.error("[bot] ❌ Gagal register commands:", err)
  }
}
