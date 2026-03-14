import type { Message } from "discord.js"
import { EmbedBuilder, PermissionFlagsBits } from "discord.js"

export default {
  name:        "mute",
  aliases:     ["timeout", "to"],
  description: "Timeout (mute) member — durasi dalam menit",
  category:    "Moderation",
  usage:       "!mute [@user] [menit] [alasan]",

  async execute(message: Message, args: string[]) {
    if (!message.member!.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply("❌ Kamu tidak punya izin **Moderate Members**.")

    const target = message.mentions.members?.first()
    if (!target) return message.reply("❌ Sebutkan user-nya!")

    const minutes = parseInt(args[1]) || 10
    const reason  = args.slice(2).join(" ") || "Tidak ada alasan"

    await target.timeout(minutes * 60 * 1000, reason)

    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle("🔇 Member Dimute")
      .addFields(
        { name: "👤 User",    value: `${target.user.tag}`,    inline: true },
        { name: "⏱️ Durasi",  value: `${minutes} menit`,      inline: true },
        { name: "👮 Oleh",    value: `${message.author.tag}`, inline: true },
        { name: "📋 Alasan",  value: reason,                   inline: false },
      )
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    await message.reply({ embeds: [embed] })
  },
}
