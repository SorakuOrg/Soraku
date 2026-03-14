import type { Message } from "discord.js"
import { EmbedBuilder } from "discord.js"

export default {
  name:        "ping",
  aliases:     ["latency"],
  description: "Cek latency bot ke Discord",
  category:    "Information",
  usage:       "!ping",

  async execute(message: Message) {
    const sent = await message.reply("🏓 Pinging...")
    const latency = sent.createdTimestamp - message.createdTimestamp
    const ws = message.client.ws.ping

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setTitle("🏓 Pong!")
      .addFields(
        { name: "📡 Pesan",     value: `${latency}ms`,  inline: true },
        { name: "💓 WebSocket", value: `${ws}ms`,        inline: true },
      )
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    await sent.edit({ content: "", embeds: [embed] })
  },
}
