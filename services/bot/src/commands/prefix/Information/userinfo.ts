import type { Message } from "discord.js"
import { EmbedBuilder } from "discord.js"

export default {
  name:        "userinfo",
  aliases:     ["ui", "whois", "user"],
  description: "Info detail user Discord",
  category:    "Information",
  usage:       "!userinfo [@user]",

  async execute(message: Message) {
    const target = message.mentions.members?.first() ?? message.member!
    const user   = target.user

    const roles = target.roles.cache
      .filter(r => r.id !== message.guild!.id)
      .sort((a, b) => b.position - a.position)
      .map(r => r.toString())
      .slice(0, 5)

    const embed = new EmbedBuilder()
      .setColor(target.displayColor || 0x7c3aed)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "🆔 ID",       value: `\`${user.id}\``,                                                    inline: true },
        { name: "🤖 Bot",      value: user.bot ? "Ya" : "Tidak",                                           inline: true },
        { name: "📅 Akun",     value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`,                 inline: true },
        { name: "📥 Join",     value: `<t:${Math.floor(target.joinedTimestamp! / 1000)}:D>`,               inline: true },
        { name: "🎭 Roles",    value: roles.length ? roles.join(", ") : "Tidak ada",                       inline: false },
      )
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    await message.reply({ embeds: [embed] })
  },
}
