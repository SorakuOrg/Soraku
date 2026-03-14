import {
  SlashCommandBuilder, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  type ChatInputCommandInteraction,
} from "discord.js"

const API_URL = process.env.SORAKU_API_URL ?? process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"
const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"

interface User {
  username: string | null; displayname: string | null; avatarurl: string | null
  bio: string | null; role: string; supporterrole: string | null
  sociallinks: Record<string, string>; isprivate: boolean; createdat: string
}

const ROLE_DISPLAY: Record<string, { label: string; emoji: string; color: number }> = {
  OWNER:   { label: "Owner",   emoji: "👑", color: 0xeab308 },
  MANAGER: { label: "Manager", emoji: "⭐", color: 0xeab308 },
  ADMIN:   { label: "Admin",   emoji: "🛡️", color: 0xef4444 },
  AGENSI:  { label: "Agensi",  emoji: "🎭", color: 0xf97316 },
  KREATOR: { label: "Kreator", emoji: "🎨", color: 0xa855f7 },
  USER:    { label: "Member",  emoji: "👤", color: 0x6b7280 },
}
const TIER: Record<string, { label: string; emoji: string }> = {
  VVIP:    { label: "VVIP Supporter", emoji: "💎" },
  VIP:     { label: "VIP Supporter",  emoji: "💜" },
  DONATUR: { label: "Donatur",        emoji: "💙" },
}

export const profileCommand = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Lihat profil Soraku Community 👤")
    .addStringOption(o => o.setName("username").setDescription("Username Soraku (kosong = profil kamu)").setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    const inputUsername = interaction.options.getString("username")
    const lookupKey     = inputUsername ?? interaction.user.id
    let user: User | null = null

    try {
      const res  = await fetch(`${API_URL}/api/users/${encodeURIComponent(lookupKey)}`, {
        headers: { "x-soraku-secret": process.env.SORAKU_API_SECRET ?? "" },
      })
      const json = await res.json() as { data: User | null }
      user = json.data
    } catch {
      await interaction.editReply("❌ Gagal menghubungi server Soraku.")
      return
    }

    if (!user) {
      if (!inputUsername) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setLabel("Daftar Sekarang").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/register`),
        )
        await interaction.editReply({ content: `Kamu belum punya akun Soraku! Daftar dulu yuk~ ✨`, components: [row] })
      } else {
        await interaction.editReply(`❌ User **${inputUsername}** tidak ditemukan.`)
      }
      return
    }

    const roleInfo    = ROLE_DISPLAY[user.role] ?? ROLE_DISPLAY.USER
    const tierInfo    = user.supporterrole ? TIER[user.supporterrole] : null
    const displayName = user.displayname ?? user.username ?? "Unknown"
    const username    = user.username ?? "—"
    const joinDate    = new Date(user.createdat).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })

    const embed = new EmbedBuilder()
      .setColor(tierInfo ? 0x7c3aed : roleInfo.color)
      .setTitle(`${roleInfo.emoji} ${displayName}`)
      .setURL(`${WEB_URL}/profile/${username}`)
      .setThumbnail(user.avatarurl ?? `https://cdn.discordapp.com/embed/avatars/0.png`)
      .addFields({ name: "Username",  value: `@${username}`,                          inline: true })
      .addFields({ name: "Role",      value: `${roleInfo.emoji} ${roleInfo.label}`,   inline: true })

    if (tierInfo) embed.addFields({ name: "Supporter", value: `${tierInfo.emoji} ${tierInfo.label}`, inline: true })
    if (user.bio) embed.addFields({ name: "Bio", value: user.bio.slice(0, 200) })
    embed.addFields({ name: "Bergabung", value: joinDate, inline: true })
    embed.setFooter({ text: "Soraku Community" }).setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Lihat Profil").setEmoji("🔗").setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/profile/${username}`),
    )
    if (!inputUsername) {
      row.addComponents(
        new ButtonBuilder().setLabel("Edit Profil").setEmoji("✏️").setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/dash/profile/me`),
      )
    }

    await interaction.editReply({ embeds: [embed], components: [row] })
  },
}
