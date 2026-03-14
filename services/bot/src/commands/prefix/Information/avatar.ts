import type { Message } from "discord.js"
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

export default {
  name:        "avatar",
  aliases:     ["av", "pfp", "pp"],
  description: "Lihat avatar user",
  category:    "Information",
  usage:       "!avatar [@user]",

  async execute(message: Message) {
    const target = message.mentions.users.first() ?? message.author
    const url    = target.displayAvatarURL({ size: 1024 })

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setTitle(`🖼️ Avatar — ${target.username}`)
      .setImage(url)
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Buka di Browser").setStyle(ButtonStyle.Link).setURL(url),
    )

    await message.reply({ embeds: [embed], components: [row] })
  },
}
