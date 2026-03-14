import type { Message, TextChannel } from "discord.js"
import { EmbedBuilder, PermissionFlagsBits } from "discord.js"

export default {
  name:        "purge",
  aliases:     ["clear", "prune"],
  description: "Hapus banyak pesan sekaligus (maks 100)",
  category:    "Moderation",
  usage:       "!purge [jumlah]",

  async execute(message: Message, args: string[]) {
    if (!message.member!.permissions.has(PermissionFlagsBits.ManageMessages))
      return message.reply("❌ Kamu tidak punya izin **Manage Messages**.")

    const amount = Math.min(parseInt(args[0]) || 10, 100)
    await message.delete().catch(() => {})

    const deleted = await (message.channel as TextChannel)
      .bulkDelete(amount, true)
      .catch(() => null)

    const count = deleted?.size ?? 0
    const embed = new EmbedBuilder()
      .setColor(0x22c55e)
      .setDescription(`🗑️ Berhasil menghapus **${count}** pesan.`)
      .setFooter({ text: "Soraku Community" })

    const reply = await message.channel.send({ embeds: [embed] })
    setTimeout(() => reply.delete().catch(() => {}), 3000)
  },
}
