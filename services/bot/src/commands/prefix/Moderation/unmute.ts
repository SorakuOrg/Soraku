import type { Message } from "discord.js"
import { EmbedBuilder, PermissionFlagsBits } from "discord.js"

export default {
  name:        "unmute",
  aliases:     ["untimeout"],
  description: "Hapus timeout (unmute) member",
  category:    "Moderation",
  usage:       "!unmute [@user]",

  async execute(message: Message) {
    if (!message.member!.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply("❌ Kamu tidak punya izin **Moderate Members**.")

    const target = message.mentions.members?.first()
    if (!target) return message.reply("❌ Sebutkan user-nya!")

    await target.timeout(null)

    const embed = new EmbedBuilder()
      .setColor(0x22c55e)
      .setTitle("🔊 Timeout Dihapus")
      .addFields(
        { name: "👤 User", value: `${target.user.tag}`,    inline: true },
        { name: "👮 Oleh", value: `${message.author.tag}`, inline: true },
      )
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    await message.reply({ embeds: [embed] })
  },
}
