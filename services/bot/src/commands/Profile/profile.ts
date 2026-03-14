import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { SorakuUser } from "../../schema/db"

module.exports = {
  name: "profile", aliases: ["p", "profil"], category: "Profile",
  description: "Lihat profil Soraku Community kamu atau user lain", usage: "profile [@user]",
  execute: async (message: any, _args: any, client: any) => {
    const target = message.mentions.users.first() ?? message.author
    const user   = await SorakuUser.get(target.id) as any

    if (!user) {
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setLabel("Daftar Sekarang").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(`${client.webUrl}/register`)
      )
      return message.reply({ embeds: [
        client.embed().setDescription(`${target.id === message.author.id ? "Kamu" : `**${target.username}**`} belum punya akun Soraku Community.`)
          .setFooter({ text: "Soraku Community" }),
      ], components: [row] })
    }

    const ROLE: Record<string, string> = { OWNER: "👑 Owner", MANAGER: "⭐ Manager", ADMIN: "🛡️ Admin", AGENSI: "🎭 Agensi", KREATOR: "🎨 Kreator", USER: "👤 Member" }
    const TIER: Record<string, string> = { VVIP: "💎 VVIP", VIP: "💜 VIP", DONATUR: "💙 Donatur" }

    const embed = client.embed()
      .setTitle(`${ROLE[user.role]?.split(" ")[0] ?? "👤"} ${user.displayname ?? user.username}`)
      .setURL(`${client.webUrl}/profile/${user.username}`)
      .setThumbnail(user.avatarurl ?? target.displayAvatarURL())
      .addFields(
        { name: "Username",  value: `@${user.username ?? "—"}`,                    inline: true },
        { name: "Role",      value: ROLE[user.role] ?? "👤 Member",                inline: true },
      )
    if (user.supporterrole) embed.addFields({ name: "Supporter", value: TIER[user.supporterrole] ?? user.supporterrole, inline: true })
    embed.setFooter({ text: "Soraku Community" }).setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Lihat Profil").setEmoji("🔗").setStyle(ButtonStyle.Link).setURL(`${client.webUrl}/profile/${user.username}`)
    )
    message.reply({ embeds: [embed], components: [row] })
  },
}
