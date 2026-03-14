import type { Message } from "discord.js"
import { EmbedBuilder, PermissionFlagsBits } from "discord.js"

export default {
  name:        "ban",
  aliases:     ["b"],
  description: "Ban member dari server",
  category:    "Moderation",
  usage:       "!ban [@user] [alasan]",
  permission:  PermissionFlagsBits.BanMembers,

  async execute(message: Message, args: string[]) {
    if (!message.member!.permissions.has(PermissionFlagsBits.BanMembers))
      return message.reply("❌ Kamu tidak punya izin **Ban Members**.")

    const target = message.mentions.members?.first()
    if (!target) return message.reply("❌ Sebutkan user-nya! Contoh: `!ban @user spam`")
    if (!target.bannable) return message.reply("❌ Aku tidak bisa ban user ini.")

    const reason = args.slice(1).join(" ") || "Tidak ada alasan"
    await target.ban({ reason: `${message.author.tag}: ${reason}` })

    const embed = new EmbedBuilder()
      .setColor(0xef4444)
      .setTitle("🔨 Member Dibanned")
      .addFields(
        { name: "👤 User",    value: `${target.user.tag}`,     inline: true },
        { name: "👮 Oleh",    value: `${message.author.tag}`,  inline: true },
        { name: "📋 Alasan",  value: reason,                    inline: false },
      )
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    await message.reply({ embeds: [embed] })
  },
}
