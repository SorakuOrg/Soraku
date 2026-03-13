import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"

// Inline type — tidak import @soraku/types (tidak resolve di Docker standalone build)
interface User {
  id: string; username: string | null; displayname: string | null
  avatarurl: string | null; bio: string | null; role: string
  supporterrole: string | null; sociallinks: Record<string, string>
  isprivate: boolean; createdat: string
}

const API_URL = process.env.SORAKU_API_URL ?? "http://localhost:4000"
const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"

const ROLE_DISPLAY: Record<string, { label: string; emoji: string; color: number }> = {
  OWNER:   { label: "Owner",   emoji: "👑", color: 0xeab308 },
  MANAGER: { label: "Manager", emoji: "⭐", color: 0xeab308 },
  ADMIN:   { label: "Admin",   emoji: "🛡️",  color: 0xef4444 },
  AGENSI:  { label: "Agensi",  emoji: "🎭", color: 0xf97316 },
  KREATOR: { label: "Kreator", emoji: "🎨", color: 0xa855f7 },
  USER:    { label: "Member",  emoji: "👤", color: 0x6b7280 },
}

const TIER_DISPLAY: Record<string, { label: string; emoji: string }> = {
  VVIP:    { label: "VVIP Supporter", emoji: "💎" },
  VIP:     { label: "VIP Supporter",  emoji: "💜" },
  DONATUR: { label: "Donatur",        emoji: "💙" },
}

export const profileCommand = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Lihat profil Soraku Community 👤")
    .addStringOption(opt =>
      opt.setName("username")
        .setDescription("Username Soraku (kosongkan untuk profil kamu sendiri)")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: false })

    const inputUsername = interaction.options.getString("username")
    const lookupKey     = inputUsername ?? interaction.user.id
    const isOwnProfile  = !inputUsername

    let user: User | null = null
    try {
      const res  = await fetch(`${API_URL}/api/users/${encodeURIComponent(lookupKey)}`, {
        headers: { "x-soraku-secret": process.env.SORAKU_API_SECRET ?? "" },
      })
      const json = await res.json() as { data: User | null }
      user = json.data

      if (!user && isOwnProfile) {
        const res2  = await fetch(`${API_URL}/api/users?discordId=${interaction.user.id}`, {
          headers: { "x-soraku-secret": process.env.SORAKU_API_SECRET ?? "" },
        })
        const json2 = await res2.json() as { data: User | null }
        user = json2.data
      }
    } catch {
      await interaction.editReply({ content: "❌ Gagal menghubungi server Soraku. Coba lagi." })
      return
    }

    if (!user) {
      if (isOwnProfile) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setLabel("Daftar Sekarang").setEmoji("✨")
            .setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/register`),
        )
        await interaction.editReply({
          content: `Hey <@${interaction.user.id}>! Kamu belum punya akun Soraku Community.\nDaftar sekarang dan hubungkan akun Discord kamu! 🎮`,
          components: [row],
        })
      } else {
        await interaction.editReply({ content: `❌ User **${inputUsername}** tidak ditemukan.` })
      }
      return
    }

    const roleInfo = ROLE_DISPLAY[user.role] ?? ROLE_DISPLAY.USER
    const tierInfo = user.supporterrole ? TIER_DISPLAY[user.supporterrole] : null
    const displayName = user.displayname ?? user.username ?? "Unknown"
    const username    = user.username ?? "—"
    const joinDate    = new Date(user.createdat).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    })

    const embed = new EmbedBuilder()
      .setColor(tierInfo ? 0x7c3aed : roleInfo.color)
      .setAuthor({ name: "Soraku Community — Profil", iconURL: "https://www.soraku.id/icon.png", url: WEB_URL })
      .setTitle(`${roleInfo.emoji} ${displayName}`)
      .setURL(`${WEB_URL}/profile/${username}`)
      .setThumbnail(user.avatarurl ?? `https://cdn.discordapp.com/embed/avatars/0.png`)
      .addFields({ name: "Username", value: `@${username}`,                          inline: true })
      .addFields({ name: "Role",     value: `${roleInfo.emoji} ${roleInfo.label}`,   inline: true })

    if (tierInfo) embed.addFields({ name: "Supporter", value: `${tierInfo.emoji} ${tierInfo.label}`, inline: true })
    if (user.bio) embed.addFields({ name: "Bio", value: user.bio.slice(0, 200), inline: false })
    embed.addFields({ name: "Bergabung", value: joinDate, inline: true })

    if (user.sociallinks && Object.keys(user.sociallinks).length > 0) {
      const socials = Object.entries(user.sociallinks).slice(0, 3)
        .map(([k, v]) => `[${k}](${v})`).join(" · ")
      embed.addFields({ name: "Sosial", value: socials, inline: true })
    }

    embed
      .setFooter({ text: user.isprivate ? "🔒 Profil ini privat · Soraku Community" : "Soraku Community · Klik nama untuk buka profil lengkap" })
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Lihat Profil Lengkap").setEmoji("🔗")
        .setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/profile/${username}`),
    )
    if (isOwnProfile) {
      row.addComponents(
        new ButtonBuilder().setLabel("Edit Profil").setEmoji("✏️")
          .setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/dash/profile/me`),
      )
    }

    await interaction.editReply({ embeds: [embed], components: [row] })
  },
}
