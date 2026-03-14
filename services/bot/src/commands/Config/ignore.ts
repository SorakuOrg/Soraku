import { PermissionFlagsBits } from "discord.js"
import { IgnoreChan } from "../../schema/db"

module.exports = {
  name: "ignore", aliases: ["ignorechan"], category: "Config",
  description: "Abaikan/aktifkan prefix command di channel ini", usage: "ignore",
  execute: async (message: any, _args: any, client: any) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Butuh izin **Manage Server**.`).setFooter({ text: "Soraku Community" })] })
    }
    const all = await IgnoreChan.getAll(message.guild.id) as { channel_id: string }[]
    const isIgnored = all.some(r => r.channel_id === message.channelId)
    if (isIgnored) {
      await IgnoreChan.remove(message.guild.id, message.channelId)
      await message.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} Channel ini tidak lagi diabaikan.`).setFooter({ text: "Soraku Community" })] })
    } else {
      await IgnoreChan.add(message.guild.id, message.channelId)
      await message.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} Channel ini sekarang diabaikan dari prefix command.`).setFooter({ text: "Soraku Community" })] })
    }
  },
}
