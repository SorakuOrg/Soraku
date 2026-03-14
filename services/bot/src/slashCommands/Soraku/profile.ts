import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { SorakuUser } from "../../schema/db"
const WEB = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"
const API  = process.env.SORAKU_API_URL ?? WEB
module.exports = {
  name: "profile", description: "Lihat profil Soraku Community 👤",
  options: [{ name: "username", description: "Username Soraku (kosong = profil kamu)", type: 3, required: false }],
  execute: async (interaction: any, client: any) => {
    await interaction.deferReply()
    const input  = interaction.options.getString("username")
    let   user   = input ? null : await SorakuUser.get(interaction.user.id) as any
    if (input) {
      try {
        const res = await fetch(`${API}/api/users/${encodeURIComponent(input)}`, { headers: { "x-soraku-secret": process.env.SORAKU_API_SECRET ?? "" } })
        const j   = await res.json() as any
        user = j.data
      } catch {}
    }
    if (!user) {
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setLabel("Daftar Sekarang").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(`${WEB}/register`)
      )
      return interaction.editReply({ content: input ? `❌ User **${input}** tidak ditemukan.` : `Kamu belum punya akun Soraku! Daftar dulu~ ✨`, components: [row] })
    }
    const ROLE: Record<string, string> = { OWNER: "👑", MANAGER: "⭐", ADMIN: "🛡️", AGENSI: "🎭", KREATOR: "🎨", USER: "👤" }
    const TIER: Record<string, string> = { VVIP: "💎 VVIP", VIP: "💜 VIP", DONATUR: "💙 Donatur" }
    const embed = client.embed()
      .setTitle(`${ROLE[user.role] ?? "👤"} ${user.displayname ?? user.username}`)
      .setURL(`${WEB}/profile/${user.username}`)
      .setThumbnail(user.avatarurl ?? interaction.user.displayAvatarURL())
      .addFields({ name: "Username", value: `@${user.username}`, inline: true }, { name: "Role", value: user.role, inline: true })
    if (user.supporterrole) embed.addFields({ name: "Supporter", value: TIER[user.supporterrole] ?? user.supporterrole, inline: true })
    embed.setFooter({ text: "Soraku Community" }).setTimestamp()
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Lihat Profil").setEmoji("🔗").setStyle(ButtonStyle.Link).setURL(`${WEB}/profile/${user.username}`)
    )
    if (!input) row.addComponents(new ButtonBuilder().setLabel("Edit").setEmoji("✏️").setStyle(ButtonStyle.Link).setURL(`${WEB}/dash/profile/me`))
    await interaction.editReply({ embeds: [embed], components: [row] })
  },
}
