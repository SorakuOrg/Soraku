import { PermissionFlagsBits } from "discord.js"
import { Autorespond } from "../../schema/db"

module.exports = {
  name: "autoresponder", aliases: ["ar"], category: "Extra",
  description: "Tambah/hapus auto-responder trigger", usage: "autoresponder <add|remove|list> [trigger] [response]",
  execute: async (message: any, args: string[], client: any) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild))
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Butuh izin **Manage Server**.`).setFooter({ text: "Soraku Community" })] })
    const opt = args[0]?.toLowerCase()
    if (opt === "list") {
      const all = await Autorespond.getAll(message.guild.id) as any[]
      if (!all.length) return message.reply({ embeds: [client.embed().setDescription("Belum ada autoresponder.").setFooter({ text: "Soraku Community" })] })
      return message.reply({ embeds: [
        client.embed().setTitle("📝 Autoresponder").setDescription(all.map((r, i) => `**${i+1}.** \`${r.trigger}\` → ${r.response}`).join("\n")).setFooter({ text: "Soraku Community" }),
      ]})
    }
    if (opt === "add") {
      const trigger  = args[1]
      const response = args.slice(2).join(" ")
      if (!trigger || !response) return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Format: \`!ar add <trigger> <response>\``).setFooter({ text: "Soraku Community" })] })
      await Autorespond.add(message.guild.id, trigger, response)
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} Autoresponder \`${trigger}\` ditambahkan.`).setFooter({ text: "Soraku Community" })] })
    }
    if (opt === "remove") {
      const trigger = args[1]
      if (!trigger) return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Sebutkan trigger-nya.`).setFooter({ text: "Soraku Community" })] })
      await Autorespond.remove(message.guild.id, trigger)
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} Autoresponder \`${trigger}\` dihapus.`).setFooter({ text: "Soraku Community" })] })
    }
  },
}
