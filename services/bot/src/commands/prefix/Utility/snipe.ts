import type { Message } from "discord.js"
import { EmbedBuilder } from "discord.js"

// In-memory snipe store per channel
const snipeStore = new Map<string, { content: string; author: string; avatar: string; deletedAt: number }>()

export function setSnipe(channelId: string, data: { content: string; author: string; avatar: string }) {
  snipeStore.set(channelId, { ...data, deletedAt: Date.now() })
}

export default {
  name:        "snipe",
  aliases:     ["s"],
  description: "Lihat pesan terakhir yang dihapus di channel ini",
  category:    "Utility",
  usage:       "!snipe",

  async execute(message: Message) {
    const data = snipeStore.get(message.channelId)
    if (!data) {
      return message.reply({ embeds: [
        new EmbedBuilder().setColor(0xef4444)
          .setDescription("❌ Tidak ada pesan yang dihapus baru-baru ini.")
          .setFooter({ text: "Soraku Community" })
      ]})
    }

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setAuthor({ name: data.author, iconURL: data.avatar })
      .setDescription(data.content.slice(0, 2000))
      .addFields({ name: "🕐 Dihapus", value: `<t:${Math.floor(data.deletedAt / 1000)}:R>`, inline: true })
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    await message.reply({ embeds: [embed] })
  },
}
