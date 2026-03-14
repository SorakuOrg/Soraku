import type { Message } from "discord.js"
import { EmbedBuilder } from "discord.js"

export default {
  name:        "serverinfo",
  aliases:     ["si", "server", "guild"],
  description: "Info detail server Discord ini",
  category:    "Information",
  usage:       "!serverinfo",

  async execute(message: Message) {
    const g = message.guild!
    const owner = await g.fetchOwner()
    const channels = g.channels.cache
    const text  = channels.filter(c => c.type === 0).size
    const voice = channels.filter(c => c.type === 2).size

    const embed = new EmbedBuilder()
      .setColor(0x3b82f6)
      .setTitle(`🏠 ${g.name}`)
      .setThumbnail(g.iconURL())
      .addFields(
        { name: "👑 Owner",     value: `${owner.user.tag}`,                     inline: true },
        { name: "👥 Member",    value: `${g.memberCount.toLocaleString("id-ID")}`, inline: true },
        { name: "🎭 Role",      value: `${g.roles.cache.size}`,                 inline: true },
        { name: "💬 Text",      value: `${text}`,                               inline: true },
        { name: "🔊 Voice",     value: `${voice}`,                              inline: true },
        { name: "😀 Emoji",     value: `${g.emojis.cache.size}`,               inline: true },
        { name: "📅 Dibuat",    value: `<t:${Math.floor(g.createdTimestamp / 1000)}:D>`, inline: true },
        { name: "🔒 Verifikasi",value: `${g.verificationLevel}`,               inline: true },
        { name: "🆔 ID",        value: `\`${g.id}\``,                          inline: true },
      )
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    if (g.bannerURL()) embed.setImage(g.bannerURL({ size: 1024 }))
    await message.reply({ embeds: [embed] })
  },
}
