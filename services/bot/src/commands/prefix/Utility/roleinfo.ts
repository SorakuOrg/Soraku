import type { Message } from "discord.js"
import { EmbedBuilder } from "discord.js"

export default {
  name:        "roleinfo",
  aliases:     ["ri", "role"],
  description: "Info detail sebuah role",
  category:    "Utility",
  usage:       "!roleinfo [@role]",

  async execute(message: Message) {
    const role = message.mentions.roles.first()
      ?? message.guild!.roles.cache.get(message.content.split(" ")[1])

    if (!role) {
      return message.reply("❌ Sebutkan role-nya! Contoh: `!roleinfo @Member`")
    }

    const embed = new EmbedBuilder()
      .setColor(role.color || 0x7c3aed)
      .setTitle(`🎭 ${role.name}`)
      .addFields(
        { name: "🆔 ID",       value: `\`${role.id}\``,                                          inline: true },
        { name: "🎨 Warna",    value: `\`${role.hexColor}\``,                                     inline: true },
        { name: "👥 Member",   value: `${role.members.size}`,                                     inline: true },
        { name: "📌 Posisi",   value: `${role.position}`,                                         inline: true },
        { name: "🔔 Mentionable", value: role.mentionable ? "Ya" : "Tidak",                       inline: true },
        { name: "📌 Hoisted",  value: role.hoist ? "Ya" : "Tidak",                               inline: true },
        { name: "📅 Dibuat",   value: `<t:${Math.floor(role.createdTimestamp / 1000)}:D>`,        inline: true },
      )
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    await message.reply({ embeds: [embed] })
  },
}
