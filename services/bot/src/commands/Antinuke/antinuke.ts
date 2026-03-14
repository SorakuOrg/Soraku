import { PermissionFlagsBits, EmbedBuilder } from "discord.js"
import { Antinuke } from "../../schema/db"

module.exports = {
  name: "antinuke", aliases: ["an"], category: "Antinuke",
  description: "Konfigurasi sistem antinuke server", usage: "antinuke <enable|disable|status>",
  execute: async (message: any, args: string[], client: any) => {
    const isOwner = message.author.id === message.guild.ownerId || message.author.id === client.ownerID
    let cfg = await Antinuke.get(message.guild.id) as any
    const extraOwners: string[] = cfg?.extra_owners ?? []
    if (!isOwner && !extraOwners.includes(message.author.id)) {
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Hanya **Server Owner** atau **Extra Owner** yang bisa pakai ini.`).setFooter({ text: "Soraku Community" })] })
    }

    const opt = args[0]?.toLowerCase()
    if (!opt) {
      // Show status
      const embed = client.embed()
        .setTitle("🔒 Antinuke — Status")
        .addFields(
          { name: "Status",        value: cfg?.is_enabled ? "✅ Aktif" : "❌ Nonaktif", inline: true },
          { name: "Extra Owners",  value: extraOwners.length ? extraOwners.map((id: string) => `<@${id}>`).join(", ") : "Tidak ada", inline: false },
          { name: "Whitelist Users", value: (cfg?.whitelist_users ?? []).length ? (cfg.whitelist_users as string[]).map(id => `<@${id}>`).join(", ") : "Tidak ada", inline: false },
        )
        .setFooter({ text: "Soraku Community" })
      return message.reply({ embeds: [embed] })
    }

    if (opt === "enable" || opt === "on") {
      await Antinuke.upsert(message.guild.id, { is_enabled: true })
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} Antinuke **diaktifkan**.`).setFooter({ text: "Soraku Community" })] })
    }
    if (opt === "disable" || opt === "off") {
      await Antinuke.upsert(message.guild.id, { is_enabled: false })
      return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} Antinuke **dinonaktifkan**.`).setFooter({ text: "Soraku Community" })] })
    }
    message.reply({ embeds: [client.embed().setDescription(`${client.emoji.warn} Opsi: \`enable\` / \`disable\` / *(kosong = status)*`).setFooter({ text: "Soraku Community" })] })
  },
}
