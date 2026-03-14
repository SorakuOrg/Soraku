import { PermissionFlagsBits } from "discord.js"
import { Guild } from "../../schema/db"

module.exports = {
  name: "setprefix", aliases: ["prefix", "sp"], category: "Config",
  description: "Ganti prefix bot untuk server ini", usage: "setprefix <prefix>",
  userPerms: ["ManageGuild"],
  execute: async (message: any, args: string[], client: any) => {
    const newPrefix = args[0]
    if (!newPrefix) return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Sebutkan prefix baru! Contoh: \`!setprefix >\``).setFooter({ text: "Soraku Community" })] })
    if (newPrefix.length > 5) return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Prefix maksimal 5 karakter.`).setFooter({ text: "Soraku Community" })] })
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Butuh izin **Manage Server**.`).setFooter({ text: "Soraku Community" })] })
    }
    await Guild.setPrefix(message.guild.id, newPrefix)
    await message.reply({ embeds: [
      client.embed().setDescription(`${client.emoji.tick} Prefix berhasil diubah ke \`${newPrefix}\``).setFooter({ text: "Soraku Community" }),
    ]})
  },
}
