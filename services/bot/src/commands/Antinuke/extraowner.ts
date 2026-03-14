import { Antinuke } from "../../schema/db"

module.exports = {
  name: "extraowner", aliases: ["eo"], category: "Antinuke",
  description: "Tambah/hapus extra owner antinuke", usage: "extraowner <add|remove> @user",
  execute: async (message: any, args: string[], client: any) => {
    if (message.author.id !== message.guild.ownerId && message.author.id !== client.ownerID) {
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Hanya **Server Owner** yang bisa pakai ini.`).setFooter({ text: "Soraku Community" })] })
    }
    const opt    = args[0]?.toLowerCase()
    const target = message.mentions.users.first()
    if (!opt || !target) return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Format: \`!extraowner add|remove @user\``).setFooter({ text: "Soraku Community" })] })

    let cfg = await Antinuke.get(message.guild.id) as any
    const list: string[] = cfg?.extra_owners ?? []

    if (opt === "add") {
      if (!list.includes(target.id)) list.push(target.id)
      await Antinuke.upsert(message.guild.id, { extra_owners: list })
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} <@${target.id}> ditambah sebagai Extra Owner.`).setFooter({ text: "Soraku Community" })] })
    }
    if (opt === "remove") {
      const updated = list.filter(id => id !== target.id)
      await Antinuke.upsert(message.guild.id, { extra_owners: updated })
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} <@${target.id}> dihapus dari Extra Owner.`).setFooter({ text: "Soraku Community" })] })
    }
  },
}
