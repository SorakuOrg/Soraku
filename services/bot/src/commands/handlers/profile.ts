/**
 * /profile [username] — Tampilkan profil Soraku Community.
 *
 * Tanpa argumen → tampilkan profil Discord user yang ngetik command.
 * Dengan argumen username → tampilkan profil user tersebut.
 *
 * Ambil data dari services/api → /api/users/:username
 * Fallback ke /api/users/:discordId jika username tidak ditemukan.
 */
import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"
import type { User } from "@soraku/types"

const API_URL = process.env.SORAKU_API_URL ?? "http://localhost:4000"
const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://soraku.vercel.app"

// Role display
const ROLE_DISPLAY: Record<string, { label: string; emoji: string; color: number }> = {
  OWNER:   { label: "Owner",        emoji: "👑", color: 0xeab308 },
  MANAGER: { label: "Manager",      emoji: "⭐", color: 0xeab308 },
  ADMIN:   { label: "Admin",        emoji: "🛡️",  color: 0xef4444 },
  AGENSI:  { label: "Agensi",       emoji: "🎭", color: 0xf97316 },
  KREATOR: { label: "Kreator",      emoji: "🎨", color: 0xa855f7 },
  USER:    { label: "Member",       emoji: "👤", color: 0x6b7280 },
}

// Supporter tier display
const TIER_DISPLAY: Record<string, { label: string; emoji: string }> = {
  VVIP:    { label: "VVIP Supporter",  emoji: "💎" },
  VIP:     { label: "VIP Supporter",   emoji: "💜" },
  DONATUR: { label: "Donatur",         emoji: "💙" },
}

export const profileCommand = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Lihat profil Soraku Community 👤")
    .addStringOption(opt =>
      opt
        .setName("username")
        .setDescription("Username Soraku (kosongkan untuk profil kamu sendiri)")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: false })

    const inputUsername = interaction.options.getString("username")
    // Kalau tidak ada input → coba lookup by Discord ID
    const lookupKey = inputUsername ?? interaction.user.id

    let user: User | null = null
    let isOwnProfile = !inputUsername

    try {
      // Coba lookup by username dulu
      const res = await fetch(`${API_URL}/api/users/${encodeURIComponent(lookupKey)}`, {
        headers: { "x-soraku-secret": process.env.SORAKU_API_SECRET ?? "" },
      })
      const json = await res.json() as { data: User | null; error: string | null }
      user = json.data

      // Kalau tidak ketemu dan ini self-profile (pakai discord ID) → coba discord endpoint
      if (!user && isOwnProfile) {
        const res2 = await fetch(
          `${API_URL}/api/users?discordId=${interaction.user.id}`,
          { headers: { "x-soraku-secret": process.env.SORAKU_API_SECRET ?? "" } }
        )
        const json2 = await res2.json() as { data: User | null; error: string | null }
        user = json2.data
      }
    } catch {
      await interaction.editReply({ content: "❌ Gagal menghubungi server Soraku. Coba lagi." })
      return
    }

    // User belum punya akun
    if (!user) {
      if (isOwnProfile) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Daftar Sekarang")
            .setEmoji("✨")
            .setStyle(ButtonStyle.Link)
            .setURL(`${WEB_URL}/register`),
        )
        await interaction.editReply({
          content: [
            `Hey <@${interaction.user.id}>! Kamu belum punya akun Soraku Community.`,
            "Daftar sekarang dan hubungkan akun Discord kamu! 🎮",
          ].join("\n"),
          components: [row],
        })
      } else {
        await interaction.editReply({ content: `❌ User **${inputUsername}** tidak ditemukan di Soraku Community.` })
      }
      return
    }

    // Build embed
    const roleInfo  = ROLE_DISPLAY[user.role] ?? ROLE_DISPLAY.USER
    const tierInfo  = user.supporterrole ? TIER_DISPLAY[user.supporterrole] : null

    const displayName = user.displayname ?? user.username ?? "Unknown"
    const username    = user.username ?? "—"
    const joinDate    = new Date(user.createdat).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    })

    const embed = new EmbedBuilder()
      .setColor(tierInfo ? 0x7c3aed : roleInfo.color)
      .setAuthor({
        name:    "Soraku Community — Profil",
        iconURL: "https://soraku.vercel.app/icon.png",
        url:     WEB_URL,
      })
      .setTitle(`${roleInfo.emoji} ${displayName}`)
      .setURL(`${WEB_URL}/profile/${username}`)
      .setThumbnail(user.avatarurl ?? `https://cdn.discordapp.com/embed/avatars/0.png`)

    // Fields
    embed.addFields({ name: "Username",    value: `@${username}`,          inline: true })
    embed.addFields({ name: "Role",        value: `${roleInfo.emoji} ${roleInfo.label}`, inline: true })

    if (tierInfo) {
      embed.addFields({ name: "Supporter", value: `${tierInfo.emoji} ${tierInfo.label}`, inline: true })
    }

    if (user.bio) {
      embed.addFields({ name: "Bio", value: user.bio.slice(0, 200), inline: false })
    }

    embed.addFields({ name: "Bergabung", value: joinDate, inline: true })

    // Social links
    if (user.sociallinks && Object.keys(user.sociallinks).length > 0) {
      const socials = Object.entries(user.sociallinks as Record<string, string>)
        .slice(0, 3)
        .map(([k, v]) => `[${k}](${v})`)
        .join(" · ")
      embed.addFields({ name: "Sosial", value: socials, inline: true })
    }

    if (user.isprivate) {
      embed.setFooter({ text: "🔒 Profil ini privat · Soraku Community" })
    } else {
      embed.setFooter({ text: "Soraku Community · Klik nama untuk buka profil lengkap" })
    }
    embed.setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Lihat Profil Lengkap")
        .setEmoji("🔗")
        .setStyle(ButtonStyle.Link)
        .setURL(`${WEB_URL}/profile/${username}`),
    )

    if (isOwnProfile) {
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Edit Profil")
          .setEmoji("✏️")
          .setStyle(ButtonStyle.Link)
          .setURL(`${WEB_URL}/dash/profile/me`),
      )
    }

    await interaction.editReply({ embeds: [embed], components: [row] })
  },
}
